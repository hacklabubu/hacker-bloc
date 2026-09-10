"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { safeNextPath } from "@/lib/safe-next-path";
import { createClient } from "@/lib/supabase/client";

export function SignUpForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);
  const router = useRouter();

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== repeatPassword) {
      setError("Passwords do not match.");
      return;
    }
    const supabase = createClient();
    setPending(true);
    setError(null);
    try {
      /* Where the confirmation link lands, e.g. back on the membership page. */
      const next = safeNextPath(new URLSearchParams(window.location.search).get("next"), "/space");
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/confirm?next=${encodeURIComponent(next)}`,
        },
      });
      if (error) throw error;
      router.push("/auth/sign-up-success");
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : "Something went wrong.");
    } finally {
      setPending(false);
    }
  };

  return (
    <form onSubmit={handleSignUp} className="terminal-form">
      <label className="terminal-field">
        <span>Email (the one you paid with)</span>
        <input
          type="email"
          autoComplete="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </label>
      <label className="terminal-field">
        <span>Password</span>
        <input
          type="password"
          autoComplete="new-password"
          required
          minLength={8}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </label>
      <label className="terminal-field">
        <span>Repeat password</span>
        <input
          type="password"
          autoComplete="new-password"
          required
          minLength={8}
          value={repeatPassword}
          onChange={(e) => setRepeatPassword(e.target.value)}
        />
      </label>
      <div className="terminal-checkout">
        <button type="submit" className="terminal-button" disabled={pending}>
          {pending ? "Creating account" : "Create account"} <span aria-hidden="true">↗</span>
        </button>
        <p className="terminal-muted" role="status">
          {error ?? (
            <>
              Already have one? <Link href="/auth/login">Sign in</Link>
            </>
          )}
        </p>
      </div>
    </form>
  );
}
