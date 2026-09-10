import { getSql } from "@/lib/db";

/*
 * The public members list (/members): every account, labelled by what they
 * have put in. "member" is a paid membership, "patron" a one-time
 * contribution, "lurker" an account and nothing else. Only the GitHub
 * username is ever shown; accounts without one appear as anonymous.
 */
export type PersonStatus = "member" | "patron" | "lurker";

export type Person = {
  github: string | null;
  status: PersonStatus;
  since: string;
};

const ORDER: Record<PersonStatus, number> = { member: 0, patron: 1, lurker: 2 };

export async function getPeople(): Promise<Person[] | null> {
  if (!process.env.DATABASE_URL) return null;
  try {
    const sql = getSql();
    const rows = (await sql`
      SELECT
        p.github_username AS github,
        p.created_at AS since,
        EXISTS (
          SELECT 1 FROM members m
          WHERE lower(m.email) = lower(p.email)
            AND (m.signup_paid_at IS NOT NULL OR m.status IN ('active', 'trialing'))
        ) AS is_member,
        EXISTS (
          SELECT 1 FROM patron_payments pp WHERE lower(pp.email) = lower(p.email)
        ) AS is_patron
      FROM profiles p
      ORDER BY p.created_at
    `) as { github: string | null; since: string; is_member: boolean; is_patron: boolean }[];

    /* Patrons who paid without ever making an account still count. */
    const anonymousPatrons = (await sql`
      SELECT min(pp.paid_at) AS since
      FROM patron_payments pp
      WHERE pp.email IS NULL
         OR NOT EXISTS (SELECT 1 FROM profiles p WHERE lower(p.email) = lower(pp.email))
      GROUP BY lower(coalesce(pp.email, pp.stripe_session_id))
    `) as { since: string }[];

    const people: Person[] = [
      ...rows.map((row) => ({
        github: row.github,
        status: (row.is_member ? "member" : row.is_patron ? "patron" : "lurker") as PersonStatus,
        since: row.since,
      })),
      ...anonymousPatrons.map((row) => ({ github: null, status: "patron" as PersonStatus, since: row.since })),
    ];
    return people.sort((a, b) => ORDER[a.status] - ORDER[b.status] || a.since.localeCompare(b.since));
  } catch (error) {
    console.error("getPeople failed", error);
    return null;
  }
}
