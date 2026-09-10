"use client";

import Link from "next/link";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

export function ForgotPasswordForm() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [sent, setSent] = useState(false);
  const [pending, setPending] = useState(false);

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    const supabase = createClient();
    setPending(true);
    setError(null);
    try {
      /* The link in the email lands on /auth/update-password, which must be an
       * allowed redirect URL in the Supabase dashboard. */
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/update-password`,
      });
      if (error) throw error;
      setSent(true);
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : "Something went wrong.");
    } finally {
      setPending(false);
    }
  };

  if (sent) {
    return (
      <p>
        If that email has an account, a reset link is on its way. Check your
        inbox, then come back to <Link href="/auth/login" className="underline underline-offset-4">sign in</Link>.
      </p>
    );
  }

  return (
    <form onSubmit={handleForgotPassword} className="terminal-form">
      <label className="terminal-field">
        <span>Email</span>
        <input
          type="email"
          autoComplete="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </label>
      <div className="terminal-checkout">
        <button type="submit" className="terminal-button" disabled={pending}>
          {pending ? "Sending" : "Send reset link"} <span aria-hidden="true">↗</span>
        </button>
        <p className="terminal-muted" role="status">
          {error ?? (
            <>
              Remembered it? <Link href="/auth/login">Sign in</Link>
            </>
          )}
        </p>
      </div>
    </form>
  );
}
