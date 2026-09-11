import { getSql } from "@/lib/db";
import { isFounder } from "@/lib/founders";

/*
 * The roles of the house, top rung first. They are what /members shows,
 * what /roles lists as the hierarchy, and what a founder can pin on
 * /space/admin. Every account (Supabase Auth, mirrored in `profiles`) holds
 * exactly one: computed from the founders list and the payment tables, or
 * pinned. Only the GitHub username is ever shown; accounts without one appear
 * as anonymous.
 */
export type PersonStatus = "founder" | "resident" | "member" | "patron" | "lurker";

export type Role = {
  id: PersonStatus;
  label: string;
  plural: string;
  mark: string;
  /* How the role is earned, and what it is responsible for. */
  responsibilities: string;
};

export const ROLES: readonly Role[] = [
  {
    id: "founder",
    label: "Founder",
    plural: "founders",
    mark: "[*]",
    responsibilities:
      "Run the house: keys, access, bookings, disputes, money. The house daddy and the house mommy. Their call is final.",
  },
  {
    id: "resident",
    label: "Resident",
    plural: "residents",
    mark: "[#]",
    responsibilities:
      "Live and work in the house. Keep it standing, keep it clean, and say yes or no to guests.",
  },
  {
    id: "member",
    label: "Member",
    plural: "members",
    mark: "[+]",
    responsibilities:
      "Paid the membership, or approved by the founders. Every event, 24/7 access to the hackerspace, and a say in what gets bought and built next.",
  },
  {
    id: "patron",
    label: "Patron",
    plural: "patrons",
    mark: "[$]",
    responsibilities: "Put money into the space once. Name on the list, thanks from the house.",
  },
  {
    id: "lurker",
    label: "Lurker",
    plural: "lurkers",
    mark: "[ ]",
    responsibilities:
      "Made an account and is thinking about it. Welcome at public events, on floors 0 and 1, while the event is on.",
  },
];

export const STATUSES: readonly PersonStatus[] = ROLES.map((role) => role.id);

export function roleOf(status: PersonStatus): Role {
  return ROLES.find((role) => role.id === status) ?? ROLES[ROLES.length - 1];
}

export function isStatus(value: unknown): value is PersonStatus {
  return typeof value === "string" && (STATUSES as readonly string[]).includes(value);
}

function computed(email: string, isMember: boolean, isPatron: boolean): PersonStatus {
  if (isFounder(email)) return "founder";
  return isMember ? "member" : isPatron ? "patron" : "lurker";
}

/* One account as the founders see it on /space/admin. */
export type AdminPerson = {
  id: string;
  email: string;
  github: string | null;
  since: string;
  computed: PersonStatus;
  override: PersonStatus | null;
  status: PersonStatus;
  membershipStatus: string | null;
  patronPayments: number;
};

/* The role one account holds, by its email; null when it has no profile yet. */
export async function getStatusByEmail(email: string): Promise<PersonStatus | null> {
  if (!process.env.DATABASE_URL || !email) return null;
  try {
    const sql = getSql();
    const rows = (await sql`
      SELECT
        p.role_override AS override,
        EXISTS (
          SELECT 1 FROM members m
          WHERE lower(m.email) = lower(p.email)
            AND (m.signup_paid_at IS NOT NULL OR m.status IN ('active', 'trialing'))
        ) AS is_member,
        EXISTS (SELECT 1 FROM patron_payments pp WHERE lower(pp.email) = lower(p.email)) AS is_patron
      FROM profiles p
      WHERE lower(p.email) = lower(${email})
      LIMIT 1
    `) as { override: string | null; is_member: boolean; is_patron: boolean }[];
    const row = rows[0];
    if (!row) return computed(email, false, false);
    return isStatus(row.override) ? row.override : computed(email, row.is_member, row.is_patron);
  } catch (error) {
    console.error("getStatusByEmail failed", error);
    return null;
  }
}

export async function getAdminPeople(): Promise<AdminPerson[] | null> {
  if (!process.env.DATABASE_URL) return null;
  try {
    const sql = getSql();
    const rows = (await sql`
      SELECT
        p.supabase_user_id AS id,
        p.email,
        p.github_username AS github,
        p.created_at AS since,
        p.role_override AS override,
        m.status AS membership_status,
        (m.signup_paid_at IS NOT NULL OR m.status IN ('active', 'trialing')) AS is_member,
        (SELECT count(*)::int FROM patron_payments pp WHERE lower(pp.email) = lower(p.email)) AS patron_payments
      FROM profiles p
      LEFT JOIN LATERAL (
        SELECT status, signup_paid_at FROM members mm
        WHERE lower(mm.email) = lower(p.email)
        ORDER BY mm.created_at DESC LIMIT 1
      ) m ON true
      ORDER BY p.created_at
    `) as {
      id: string; email: string; github: string | null; since: string; override: string | null;
      membership_status: string | null; is_member: boolean | null; patron_payments: number;
    }[];
    return rows.map((row) => {
      const auto = computed(row.email, Boolean(row.is_member), row.patron_payments > 0);
      const override = isStatus(row.override) ? row.override : null;
      return {
        id: row.id,
        email: row.email,
        github: row.github,
        since: row.since,
        computed: auto,
        override,
        status: override ?? auto,
        membershipStatus: row.membership_status,
        patronPayments: row.patron_payments,
      };
    });
  } catch (error) {
    console.error("getAdminPeople failed", error);
    return null;
  }
}

export type Person = {
  github: string | null;
  status: PersonStatus;
  since: string;
};

const ORDER: Record<PersonStatus, number> = Object.fromEntries(
  ROLES.map((role, index) => [role.id, index]),
) as Record<PersonStatus, number>;

export async function getPeople(): Promise<Person[] | null> {
  if (!process.env.DATABASE_URL) return null;
  try {
    const sql = getSql();
    const rows = (await sql`
      SELECT
        p.email,
        p.github_username AS github,
        p.created_at AS since,
        p.role_override AS override,
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
    `) as { email: string; github: string | null; since: string; override: string | null; is_member: boolean; is_patron: boolean }[];

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
        /* A founder's override (/space/admin) beats what the payments say. */
        status: isStatus(row.override) ? row.override : computed(row.email, row.is_member, row.is_patron),
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
