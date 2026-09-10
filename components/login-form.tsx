"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { safeNextPath } from "@/lib/safe-next-path";
import { createClient } from "@/lib/supabase/client";

export function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const supabase = createClient();
    setPending(true);
    setError(null);
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      const next = new URLSearchParams(window.location.search).get("next");
      router.push(safeNextPath(next, "/space"));
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : "Something went wrong.");
    } finally {
      setPending(false);
    }
  };

  return (
    <form onSubmit={handleLogin} className="terminal-form">
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
      <label className="terminal-field">
        <span>Password</span>
        <input
          type="password"
          autoComplete="current-password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </label>
      <div className="terminal-checkout">
        <button type="submit" className="terminal-button" disabled={pending}>
          {pending ? "Signing in" : "Sign in"} <span aria-hidden="true">↗</span>
        </button>
        <p className="terminal-muted" role="status">
          {error ?? (
            <>
              <Link href="/auth/forgot-password">Forgot your password?</Link>
              {" · "}
              <Link href="/auth/sign-up">Create an account</Link>
            </>
          )}
        </p>
      </div>
    </form>
  );
}
