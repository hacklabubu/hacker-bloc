import { getSql } from "@/lib/db";

/*
 * Homepage readout of the membership ledger (db/members.sql), which the Stripe
 * webhook keeps in sync. Read-only, and every failure resolves to null so a
 * missing DATABASE_URL or a cold Neon branch can never take the page down.
 */

export type MembershipStats = {
  /* Founding seats claimed: a settled signup fee, or an active subscription
   * whose checkout event has not arrived yet. */
  claimed: number;
  /* Everything paid so far, in whole USD. */
  raisedUsd: number;
};

export async function getMembershipStats(): Promise<MembershipStats | null> {
  if (!process.env.DATABASE_URL) return null;

  try {
    const sql = getSql();
    const [members, payments] = await Promise.all([
      sql`
        SELECT count(*)::int AS claimed
        FROM members
        WHERE signup_paid_at IS NOT NULL OR status = 'active'
      `,
      sql`
        SELECT coalesce(sum(amount_cents), 0)::bigint AS cents
        FROM member_payments
        WHERE currency = 'usd'
      `,
    ]) as [{ claimed: number }[], { cents: string | number }[]];

    return {
      claimed: members[0]?.claimed ?? 0,
      raisedUsd: Math.floor(Number(payments[0]?.cents ?? 0) / 100),
    };
  } catch {
    return null;
  }
}
