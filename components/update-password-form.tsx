"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

export function UpdatePasswordForm() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);
  const router = useRouter();

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    const supabase = createClient();
    setPending(true);
    setError(null);
    try {
      const { error } = await supabase.auth.updateUser({ password });
      if (error) throw error;
      router.push("/space");
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : "Something went wrong.");
    } finally {
      setPending(false);
    }
  };

  return (
    <form onSubmit={handleUpdate} className="terminal-form">
      <label className="terminal-field">
        <span>New password</span>
        <input
          type="password"
          autoComplete="new-password"
          required
          minLength={8}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </label>
      <div className="terminal-checkout">
        <button type="submit" className="terminal-button" disabled={pending}>
          {pending ? "Saving" : "Save new password"} <span aria-hidden="true">↗</span>
        </button>
        <p className="terminal-muted" role="status">{error ?? "At least 8 characters."}</p>
      </div>
    </form>
  );
}
