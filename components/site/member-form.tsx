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

/*
 * The membership call to action. Step one is an account, step two is the
 * payment: a signed-out visitor gets "Create an account", a signed-in one
 * gets "Become a member", which hands off to Stripe-hosted checkout
 * (app/actions/membership.ts). The two steps switch on separately: accounts
 * need Supabase, payments need a Stripe key and both prices, so people can
 * sign up before payments open.
 */
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

  if (!signedIn) {
    if (!accountsEnabled) {
      return (
        <div className="terminal-checkout">
          <button type="button" className="terminal-button" disabled>
            Create an account <span aria-hidden="true">↗</span>
          </button>
          <p className="terminal-muted" role="status">Accounts open soon.</p>
        </div>
      );
    }
    return (
      <div className="terminal-checkout">
        <Link href={`/auth/sign-up?next=${encodeURIComponent(`/pricing#${tier}`)}`} className="terminal-button">
          Create an account <span aria-hidden="true">↗</span>
        </Link>
        <p className="terminal-muted" role="status">
          Step one is an account, step two is the payment. Already have one?{" "}
          <Link href={`/auth/login?next=${encodeURIComponent(`/pricing#${tier}`)}`} className="underline underline-offset-4">Sign in</Link>.
        </p>
      </div>
    );
  }

  if (!paymentsEnabled) {
    return (
      <div className="terminal-checkout">
        <button type="button" className="terminal-button" disabled>
          Become a member <span aria-hidden="true">↗</span>
        </button>
        <p className="terminal-muted" role="status">
          Your account is ready. Payments open soon; we will email you.
        </p>
      </div>
    );
  }

  let status: React.ReactNode = note;
  if (state.error) status = state.error;
  else if (thanks)
    status = (
      <>
        Thanks. Your payment is being confirmed. Check your membership in{" "}
        <Link href="/space" className="underline underline-offset-4">your space</Link>.
      </>
    );

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
