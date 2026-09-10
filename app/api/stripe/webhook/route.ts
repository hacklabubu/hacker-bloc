import Stripe from "stripe";
import { getSql } from "@/lib/db";

/*
 * Stripe → Neon membership ledger.
 *
 * Checkout is Stripe-hosted (app/actions/membership.ts), so this route is the
 * only place the site learns who paid. Stripe stays the
 * system of record; the `members` / `member_payments` tables in Neon
 * (db/members.sql) are a mirror so the site can answer "who is a member,
 * since when, what have they paid" without an API round-trip.
 *
 * Every handler is idempotent (upserts keyed by Stripe ids), and accepted
 * events are recorded in `stripe_events` so Stripe's retries are no-ops.
 *
 * Only the signing secret is needed here: verifying a webhook does not call
 * the Stripe API.
 *
 * Route Handler reference:
 * node_modules/next/dist/docs/01-app/03-api-reference/03-file-conventions/route.md
 */

/* Stripe timestamps are unix seconds; Postgres wants ISO strings. */
function toIso(seconds: number | null | undefined): string | null {
  return typeof seconds === "number" ? new Date(seconds * 1000).toISOString() : null;
}

/* Expandable fields arrive as ids from webhooks, but the types allow objects. */
function idOf(
  ref: string | { id: string } | null | undefined
): string | null {
  if (!ref) return null;
  return typeof ref === "string" ? ref : ref.id;
}

type MemberPatch = {
  stripeCustomerId: string;
  stripeSubscriptionId?: string | null;
  email?: string | null;
  name?: string | null;
  status?: string | null;
  signupPaidAt?: string | null;
  currentPeriodEnd?: string | null;
  canceledAt?: string | null;
};

/*
 * Insert-or-update keyed by customer. Nulls never overwrite a value we already
 * have, so a subscription event arriving before the checkout event (Stripe
 * makes no ordering promise) can't blank out the email.
 */
async function upsertMember(patch: MemberPatch) {
  const sql = getSql();
  await sql`
    INSERT INTO members (
      stripe_customer_id, stripe_subscription_id, email, name, status,
      signup_paid_at, current_period_end, canceled_at
    ) VALUES (
      ${patch.stripeCustomerId},
      ${patch.stripeSubscriptionId ?? null},
      ${patch.email ?? null},
      ${patch.name ?? null},
      ${patch.status ?? "pending"},
      ${patch.signupPaidAt ?? null},
      ${patch.currentPeriodEnd ?? null},
      ${patch.canceledAt ?? null}
    )
    ON CONFLICT (stripe_customer_id) DO UPDATE SET
      stripe_subscription_id = COALESCE(EXCLUDED.stripe_subscription_id, members.stripe_subscription_id),
      email = COALESCE(EXCLUDED.email, members.email),
      name = COALESCE(EXCLUDED.name, members.name),
      status = COALESCE(${patch.status ?? null}, members.status),
      signup_paid_at = COALESCE(EXCLUDED.signup_paid_at, members.signup_paid_at),
      current_period_end = COALESCE(EXCLUDED.current_period_end, members.current_period_end),
      canceled_at = ${patch.canceledAt === undefined ? null : patch.canceledAt},
      updated_at = now()
  `;
}

async function onCheckoutCompleted(session: Stripe.Checkout.Session) {
  /* Patron contributions (app/actions/patron.ts) are one-time payments, not
   * memberships; they stay in stripe_events for the audit trail only. */
  if (session.mode !== "subscription" || session.metadata?.kind === "patron") return;

  const customerId = idOf(session.customer);
  if (!customerId) return;

  const paid = session.payment_status === "paid";
  await upsertMember({
    stripeCustomerId: customerId,
    stripeSubscriptionId: idOf(session.subscription),
    email: session.customer_details?.email ?? null,
    name: session.customer_details?.name ?? null,
    /* The subscription events carry the authoritative status; this only
     * marks the signup fee as settled once Checkout says the money landed. */
    signupPaidAt: paid ? toIso(session.created) : null,
  });
}

async function onInvoicePaid(invoice: Stripe.Invoice) {
  const customerId = idOf(invoice.customer);
  if (!customerId) return;

  const paidAt =
    toIso(invoice.status_transitions?.paid_at) ?? toIso(invoice.created) ?? new Date().toISOString();
  const description = invoice.lines.data
    .map((line) => line.description)
    .filter(Boolean)
    .join(" + ");

  const sql = getSql();
  await sql`
    INSERT INTO member_payments (
      stripe_invoice_id, stripe_customer_id, amount_cents, currency, description, paid_at
    ) VALUES (
      ${invoice.id}, ${customerId}, ${invoice.amount_paid}, ${invoice.currency},
      ${description || null}, ${paidAt}
    )
    ON CONFLICT (stripe_invoice_id) DO NOTHING
  `;

  /* A paid invoice extends the membership to the end of its billing period.
   * Only subscription lines carry a real period; the one-time signup fee on
   * the first invoice has a zero-length one and must not shorten it. */
  const periodEnd = invoice.lines.data.reduce(
    (max, line) =>
      line.parent?.type === "subscription_item_details"
        ? Math.max(max, line.period?.end ?? 0)
        : max,
    0
  );
  await upsertMember({
    stripeCustomerId: customerId,
    stripeSubscriptionId: idOf(invoice.parent?.subscription_details?.subscription),
    email: invoice.customer_email ?? null,
    name: invoice.customer_name ?? null,
    status: "active",
    currentPeriodEnd: periodEnd ? toIso(periodEnd) : null,
  });
}

async function onInvoicePaymentFailed(invoice: Stripe.Invoice) {
  const customerId = idOf(invoice.customer);
  if (!customerId) return;
  await upsertMember({ stripeCustomerId: customerId, status: "past_due" });
}

async function onSubscriptionChanged(subscription: Stripe.Subscription) {
  const customerId = idOf(subscription.customer);
  if (!customerId) return;

  const periodEnd = subscription.items.data.reduce(
    (max, item) => Math.max(max, item.current_period_end ?? 0),
    0
  );
  await upsertMember({
    stripeCustomerId: customerId,
    stripeSubscriptionId: subscription.id,
    status: subscription.status,
    currentPeriodEnd: periodEnd ? toIso(periodEnd) : null,
    canceledAt: toIso(subscription.canceled_at),
  });
}

export async function POST(request: Request) {
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!secret) {
    return new Response("STRIPE_WEBHOOK_SECRET is not set", { status: 500 });
  }
  const signature = request.headers.get("stripe-signature");
  if (!signature) {
    return new Response("Missing stripe-signature header", { status: 400 });
  }

  /* Signature is computed over the raw body — never parse before verifying. */
  const payload = await request.text();
  let event: Stripe.Event;
  try {
    event = await Stripe.webhooks.constructEventAsync(payload, signature, secret);
  } catch (error) {
    const message = error instanceof Error ? error.message : "invalid signature";
    return new Response(`Webhook signature verification failed: ${message}`, {
      status: 400,
    });
  }

  const sql = getSql();
  const seen = (await sql`
    SELECT id FROM stripe_events WHERE id = ${event.id}
  `) as { id: string }[];
  if (seen.length > 0) {
    return Response.json({ received: true, duplicate: true });
  }

  switch (event.type) {
    case "checkout.session.completed":
      await onCheckoutCompleted(event.data.object);
      break;
    case "invoice.paid":
      await onInvoicePaid(event.data.object);
      break;
    case "invoice.payment_failed":
      await onInvoicePaymentFailed(event.data.object);
      break;
    case "customer.subscription.created":
    case "customer.subscription.updated":
    case "customer.subscription.deleted":
      await onSubscriptionChanged(event.data.object);
      break;
    default:
      /* Subscribed in the Stripe dashboard but not handled here — still
       * recorded below so the audit trail is complete. */
      break;
  }

  await sql`
    INSERT INTO stripe_events (id, type, payload)
    VALUES (${event.id}, ${event.type}, ${JSON.stringify(event)}::jsonb)
    ON CONFLICT (id) DO NOTHING
  `;

  return Response.json({ received: true });
}
