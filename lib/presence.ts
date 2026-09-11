import { getSql } from "@/lib/db";

/*
 * Presence: who is on the house Wi-Fi right now. A reporter on the LAN
 * (scripts/presence-agent.sh) posts a device count, and optionally the
 * GitHub usernames it recognised from known devices, to /api/presence. The
 * homepage shows it only while it is fresh.
 */
export const PRESENCE_MAX_AGE_MINUTES = 15;

export type Presence = {
  devices: number;
  /* Recognised people, when the reporter maps devices to members. */
  people: number | null;
  github: string[];
  reportedAt: string;
  fresh: boolean;
};

export async function getPresence(): Promise<Presence | null> {
  if (!process.env.DATABASE_URL) return null;
  try {
    const sql = getSql();
    const rows = (await sql`
      SELECT devices, people, github, reported_at,
             reported_at > now() - (${PRESENCE_MAX_AGE_MINUTES} || ' minutes')::interval AS fresh
      FROM presence WHERE id = 1
    `) as { devices: number; people: number | null; github: string[]; reported_at: string; fresh: boolean }[];
    const row = rows[0];
    if (!row) return null;
    return {
      devices: row.devices,
      people: row.people,
      github: row.github ?? [],
      reportedAt: row.reported_at,
      fresh: row.fresh,
    };
  } catch (error) {
    console.error("getPresence failed", error);
    return null;
  }
}

export async function setPresence(input: { devices: number; people?: number | null; github?: string[] }) {
  const sql = getSql();
  await sql`
    INSERT INTO presence (id, devices, people, github, reported_at)
    VALUES (1, ${input.devices}, ${input.people ?? null}, ${input.github ?? []}, now())
    ON CONFLICT (id) DO UPDATE SET
      devices = EXCLUDED.devices,
      people = EXCLUDED.people,
      github = EXCLUDED.github,
      reported_at = now()
  `;
}
