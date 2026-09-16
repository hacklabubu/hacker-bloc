import { createClient } from "@/lib/supabase/server";

/*
 * Who is signed in, server-side. Null when nobody is, and null when Supabase
 * is not configured at all so every caller can fall back to "accounts open
 * soon" instead of crashing.
 */
export type SessionUser = {
  id: string;
  email: string;
  /* GitHub login when the account came through the GitHub provider. */
  githubUsername: string | null;
  /* "github", "email", ... — which way the account signs in. */
  provider: string | null;
};

export function authConfigured(): boolean {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
  );
}

function str(value: unknown): string | null {
  return typeof value === "string" && value ? value : null;
}

export async function getSessionUser(): Promise<SessionUser | null> {
  if (!authConfigured()) return null;
  try {
    const supabase = await createClient();
    const { data: verified } = await supabase.auth.getUser();
    if (!verified.user?.email_confirmed_at) return null;
    const { data } = await supabase.auth.getClaims();
    const claims = data?.claims as Record<string, unknown> | undefined;
    if (!claims || typeof claims.sub !== "string" || typeof claims.email !== "string") return null;
    const meta = (claims.user_metadata ?? {}) as Record<string, unknown>;
    const app = (claims.app_metadata ?? {}) as Record<string, unknown>;
    return {
      id: claims.sub,
      email: claims.email,
      githubUsername: str(meta.user_name) ?? str(meta.preferred_username),
      provider: str(app.provider),
    };
  } catch {
    return null;
  }
}
