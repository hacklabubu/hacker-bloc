import { getSql } from "@/lib/db";

/*
 * The signed-in member's view of the Stripe mirror (db/members.sql). The
 * webhook stores the email Stripe collected at checkout; a member account is
 * whichever Supabase login uses that same address, compared case-insensitively.
 */

export type MemberAccount = {
  stripeCustomerId: string;
  name: string | null;
  status: string;
  signupPaidAt: string | null;
  currentPeriodEnd: string | null;
  canceledAt: string | null;
  payments: MemberPayment[];
};

export type MemberPayment = {
  amountCents: number;
  currency: string;
  description: string | null;
  paidAt: string;
};

export async function getMemberByEmail(email: string): Promise<MemberAccount | null> {
  if (!process.env.DATABASE_URL || !email) return null;
  const sql = getSql();

  const rows = (await sql`
    SELECT stripe_customer_id, name, status, signup_paid_at, current_period_end, canceled_at
    FROM members
    WHERE lower(email) = lower(${email})
    ORDER BY created_at DESC
    LIMIT 1
  `) as {
    stripe_customer_id: string;
    name: string | null;
    status: string;
    signup_paid_at: string | null;
    current_period_end: string | null;
    canceled_at: string | null;
  }[];
  const row = rows[0];
  if (!row) return null;

  const payments = (await sql`
    SELECT amount_cents, currency, description, paid_at
    FROM member_payments
    WHERE stripe_customer_id = ${row.stripe_customer_id}
    ORDER BY paid_at DESC
    LIMIT 24
  `) as { amount_cents: number; currency: string; description: string | null; paid_at: string }[];

  return {
    stripeCustomerId: row.stripe_customer_id,
    name: row.name,
    status: row.status,
    signupPaidAt: row.signup_paid_at,
    currentPeriodEnd: row.current_period_end,
    canceledAt: row.canceled_at,
    payments: payments.map((p) => ({
      amountCents: p.amount_cents,
      currency: p.currency,
      description: p.description,
      paidAt: p.paid_at,
    })),
  };
}
