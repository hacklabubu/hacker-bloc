-- Hacker Bloc member directory + Stripe ledger, for Supabase Postgres.
-- Supersedes db/members.sql (Neon). Safe to re-run.
--
-- Model: one row per member in public.members, keyed by the auth user id.
-- Stripe is the record of money; the stripe_* columns and member_payments are
-- a mirror written by app/api/stripe/webhook/route.ts (service role, bypasses
-- RLS). Members can read the directory and edit only their own profile.

create extension if not exists pgcrypto;

-- membership_status: what the person is to the Bloc, independent of billing.
--   applicant  signed up / applied, no payment yet
--   active     paid founding member in good standing
--   past_due   Stripe couldn't collect the monthly fee
--   canceled   subscription ended
--   admin      runs the space (also a member)
do $$ begin
  create type public.membership_status as enum
    ('applicant', 'active', 'past_due', 'canceled', 'admin');
exception when duplicate_object then null; end $$;

create table if not exists public.members (
  id uuid primary key references auth.users (id) on delete cascade,
  email text,
  name text,
  handle text unique,
  bio text,
  avatar_url text,
  -- {"github": "...", "x": "...", "instagram": "...", "website": "...", "hacklab": "..."}
  socials jsonb not null default '{}'::jsonb,
  status public.membership_status not null default 'applicant',
  founding boolean not null default false,
  -- Stripe mirror
  stripe_customer_id text unique,
  stripe_subscription_id text unique,
  signup_paid_at timestamptz,
  current_period_end timestamptz,
  canceled_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint members_handle_format check (handle is null or handle ~ '^[a-z0-9_]{2,32}$')
);

create table if not exists public.member_payments (
  id bigint generated always as identity primary key,
  member_id uuid references public.members (id) on delete set null,
  stripe_invoice_id text unique not null,
  stripe_customer_id text not null,
  amount_cents integer not null,
  currency text not null,
  description text,
  paid_at timestamptz not null,
  created_at timestamptz not null default now()
);
create index if not exists member_payments_member_idx on public.member_payments (member_id);
create index if not exists member_payments_customer_idx on public.member_payments (stripe_customer_id);

-- Every Stripe event we accepted, keyed by Stripe's event id: retries become
-- no-ops and there is a raw audit trail.
create table if not exists public.stripe_events (
  id text primary key,
  type text not null,
  payload jsonb not null,
  received_at timestamptz not null default now()
);

-- A members row appears the moment someone signs up, so "who signed up but
-- never paid" is a query, not a reconciliation.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.members (id, email, name, avatar_url)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data ->> 'full_name', new.raw_user_meta_data ->> 'name'),
    new.raw_user_meta_data ->> 'avatar_url'
  )
  on conflict (id) do nothing;
  return new;
end;
$$;
revoke all on function public.handle_new_user() from public, anon, authenticated;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

create or replace function public.set_updated_at()
returns trigger language plpgsql set search_path = '' as $$
begin new.updated_at = now(); return new; end; $$;
drop trigger if exists members_set_updated_at on public.members;
create trigger members_set_updated_at
  before update on public.members
  for each row execute function public.set_updated_at();

-- Row Level Security -------------------------------------------------------
alter table public.members enable row level security;
alter table public.member_payments enable row level security;
alter table public.stripe_events enable row level security;

-- Signed-in members can see the directory; the public site reads it through
-- the service role, so anon gets nothing.
drop policy if exists "members: signed-in can read directory" on public.members;
create policy "members: signed-in can read directory"
  on public.members for select to authenticated using (true);

-- Only your own row is editable, and only the profile columns: the trigger
-- below rejects changes to billing/status fields from a regular session.
drop policy if exists "members: edit own profile" on public.members;
create policy "members: edit own profile"
  on public.members for update to authenticated
  using ((select auth.uid()) = id)
  with check ((select auth.uid()) = id);

create or replace function public.protect_member_billing_columns()
returns trigger language plpgsql set search_path = '' as $$
begin
  -- service_role (webhooks, admin scripts) may change anything.
  if current_setting('request.jwt.claim.role', true) is distinct from 'service_role'
     and current_user <> 'postgres' then
    new.status := old.status;
    new.founding := old.founding;
    new.stripe_customer_id := old.stripe_customer_id;
    new.stripe_subscription_id := old.stripe_subscription_id;
    new.signup_paid_at := old.signup_paid_at;
    new.current_period_end := old.current_period_end;
    new.canceled_at := old.canceled_at;
    new.email := old.email;
  end if;
  return new;
end; $$;
drop trigger if exists members_protect_billing on public.members;
create trigger members_protect_billing
  before update on public.members
  for each row execute function public.protect_member_billing_columns();

-- Members can see their own payment history; nobody else via the API.
drop policy if exists "payments: read own" on public.member_payments;
create policy "payments: read own"
  on public.member_payments for select to authenticated
  using ((select auth.uid()) = member_id);

-- stripe_events: service role only (no policies => no API access).
