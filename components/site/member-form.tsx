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
 * (app/actions/membership.ts). Disabled with "Payments open soon." until the
 * server has a Stripe key, both prices, and Supabase.
 */
export function MemberForm({
  enabled,
  signedIn,
  note,
  thanks = false,
}: {
  enabled: boolean;
  signedIn: boolean;
  note: React.ReactNode;
  thanks?: boolean;
}) {
  const [state, action, pending] = useActionState<MembershipState, FormData>(
    startMembershipCheckout,
    initial
  );

  if (!enabled) {
    return (
      <div className="terminal-checkout">
        <button type="button" className="terminal-button" disabled>
          Become a member <span aria-hidden="true">↗</span>
        </button>
        <p className="terminal-muted" role="status">Payments open soon.</p>
      </div>
    );
  }

  if (!signedIn) {
    return (
      <div className="terminal-checkout">
        <Link href={SIGNUP_FOR_MEMBERSHIP} className="terminal-button">
          Create an account <span aria-hidden="true">↗</span>
        </Link>
        <p className="terminal-muted" role="status">
          Step one is an account, step two is the payment. Already have one?{" "}
          <Link href={LOGIN_FOR_MEMBERSHIP} className="underline underline-offset-4">Sign in</Link>.
        </p>
      </div>
    );
  }

  let status: React.ReactNode = note;
  if (state.error) status = state.error;
  else if (thanks)
    status = (
      <>
        Welcome in. Your membership is active; the receipt is in your inbox. Manage it in{" "}
        <Link href="/members" className="underline underline-offset-4">Members</Link>.
      </>
    );

  return (
    <form action={action} className="terminal-checkout">
      <button type="submit" className="terminal-button" disabled={pending}>
        {pending ? "Opening checkout" : "Become a member"}{" "}
        <span aria-hidden="true">↗</span>
      </button>
      <p className="terminal-muted" role="status">{status}</p>
    </form>
  );
}
