"use client";

import { useState } from "react";
import { safeNextPath } from "@/lib/safe-next-path";
import { createClient } from "@/lib/supabase/client";

/*
 * "Continue with GitHub": Supabase's GitHub provider. GitHub sends the browser
 * back to Supabase, Supabase to /auth/confirm with a PKCE code, and the confirm
 * route turns that into a session and forwards to `next`.
 */
export function GitHubButton({ label = "Continue with GitHub" }: { label?: string }) {
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  const signIn = async () => {
    setPending(true);
    setError(null);
    const next = safeNextPath(new URLSearchParams(window.location.search).get("next"), "/members");
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "github",
      options: {
        redirectTo: `${window.location.origin}/auth/confirm?next=${encodeURIComponent(next)}`,
      },
    });
    if (error) {
      setError(error.message);
      setPending(false);
    }
  };

  return (
    <div className="terminal-checkout">
      <button type="button" className="terminal-button" onClick={signIn} disabled={pending}>
        {pending ? "Opening GitHub" : label} <span aria-hidden="true">↗</span>
      </button>
      <p className="terminal-muted" role="status">
        {error ?? "Use the GitHub account whose email you will pay with."}
      </p>
    </div>
  );
}
