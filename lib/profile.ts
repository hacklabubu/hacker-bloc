import type { SessionUser } from "@/lib/auth";
import { getSql } from "@/lib/db";

/*
 * Remember an account in Neon (profiles in db/members.sql) so the public
 * members list can count it. Called from the signed-in pages; idempotent, and
 * a failure never breaks the page.
 */
export async function rememberProfile(user: SessionUser): Promise<void> {
  if (!process.env.DATABASE_URL) return;
  try {
    const sql = getSql();
    await sql`
      INSERT INTO profiles (supabase_user_id, email, github_username)
      VALUES (${user.id}, ${user.email}, ${user.githubUsername})
      ON CONFLICT (supabase_user_id) DO UPDATE SET
        email = EXCLUDED.email,
        github_username = COALESCE(EXCLUDED.github_username, profiles.github_username),
        updated_at = now()
    `;
  } catch (error) {
    console.error("rememberProfile failed", error);
  }
}
