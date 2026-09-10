import { createClient } from "@/lib/supabase/server";

/*
 * Who is signed in, server-side. Null when nobody is, and null when Supabase
 * is not configured at all so every caller can fall back to "accounts open
 * soon" instead of crashing.
 */
export type SessionUser = { id: string; email: string };

export function authConfigured(): boolean {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
  );
}

export async function getSessionUser(): Promise<SessionUser | null> {
  if (!authConfigured()) return null;
  try {
    const supabase = await createClient();
    const { data } = await supabase.auth.getClaims();
    const claims = data?.claims;
    if (!claims || typeof claims.sub !== "string" || typeof claims.email !== "string") return null;
    return { id: claims.sub, email: claims.email };
  } catch {
    return null;
  }
}
