"use client";

import Link from "next/link";
import { useActionState } from "react";
import {
  startMembershipCheckout,
  type MembershipState,
} from "@/app/actions/membership";

const initial: MembershipState = { error: null };

export const SIGNUP_FOR_MEMBERSHIP = "/auth/sign-up?next=%2Fmembership%23member";
export const LOGIN_FOR_MEMBERSHIP = "/auth/login?next=%2Fmembership%23member";

/* Guests and signed-in visitors go straight to hosted checkout. */
export function MemberForm({
  accountsEnabled,
  paymentsEnabled,
  signedIn,
  note,
  thanks = false,
  tier = "founding",
}: {
  accountsEnabled: boolean;
  paymentsEnabled: boolean;
  signedIn: boolean;
  note: React.ReactNode;
  thanks?: boolean;
  tier?: "founding" | "member";
}) {
  const [state, action, pending] = useActionState<MembershipState, FormData>(
    () => startMembershipCheckout(tier),
    initial
  );

  if (thanks) {
    return (
      <div className="terminal-checkout">
        <p className="terminal-muted" role="status">Thanks. Your payment is being confirmed.</p>
        {signedIn ? <Link href="/space" className="terminal-button">Go to your space ↗</Link> : <>
          <Link href="/auth/sign-up?next=%2Fspace" className="terminal-button">Finish setting up your account ↗</Link>
          <p className="terminal-muted">Use the same email you entered at checkout and verify it to access your membership. You can finish later; your payment is recorded independently.</p>
          {accountsEnabled && <Link href="/auth/login?next=%2Fspace" className="underline underline-offset-4">Already have an account? Sign in</Link>}
        </>}
      </div>
    );
  }

  if (!paymentsEnabled) {
    return (
      <div className="terminal-checkout">
        <button type="button" className="terminal-button" disabled>
          {tier === "founding" ? "Become a founding member" : "Become a member"} <span aria-hidden="true">↗</span>
        </button>
        <p className="terminal-muted" role="status">
          Payments open soon.
        </p>
      </div>
    );
  }

  let status: React.ReactNode = note;
  if (state.error) status = state.error;

  return (
    <form action={action} className="terminal-checkout">
      <button type="submit" className="terminal-button" disabled={pending}>
        {pending ? "Opening checkout" : (tier === "founding" ? "Become a founding member" : "Become a member")}{" "}
        <span aria-hidden="true">↗</span>
      </button>
      <p className="terminal-muted" role="status">{status}</p>
    </form>
  );
}
