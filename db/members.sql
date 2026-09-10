-- Membership ledger mirrored from Stripe by app/api/stripe/webhook/route.ts.
-- Stripe is the system of record; these tables exist so the site can answer
-- "who is a member, since when, and what have they paid" without an API call.
-- Apply with: psql "$DATABASE_URL" -f db/members.sql  (safe to re-run)

create table if not exists members (
  id serial primary key,
  stripe_customer_id text unique not null,
  stripe_subscription_id text unique,
  email text,
  name text,
  -- Stripe subscription status: active, past_due, canceled, unpaid, incomplete, ...
  status text not null default 'pending',
  signup_paid_at timestamptz,
  current_period_end timestamptz,
  canceled_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists member_payments (
  id serial primary key,
  stripe_invoice_id text unique not null,
  stripe_customer_id text not null,
  amount_cents integer not null,
  currency text not null,
  description text,
  paid_at timestamptz not null,
  created_at timestamptz not null default now()
);
create index if not exists member_payments_customer_idx on member_payments (stripe_customer_id);

-- Every webhook event we accepted, keyed by Stripe's event id, so retries are
-- no-ops and there is a raw audit trail to debug against.
create table if not exists stripe_events (
  id text primary key,
  type text not null,
  payload jsonb not null,
  received_at timestamptz not null default now()
);
