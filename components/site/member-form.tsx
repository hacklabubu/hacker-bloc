"use client";

import Link from "next/link";
import { useActionState } from "react";
import {
  startMembershipCheckout,
  type MembershipState,
} from "@/app/actions/membership";

const initial: MembershipState = { error: null };

/*
 * The "Become a member" button. Disabled with "Payments open soon." until the
 * server has a Stripe key and both membership prices; otherwise the submit
 * hands off to Stripe-hosted checkout (app/actions/membership.ts).
 */
export function MemberForm({
  enabled,
  note,
  thanks = false,
}: {
  enabled: boolean;
  note: React.ReactNode;
  thanks?: boolean;
}) {
  const [state, action, pending] = useActionState<MembershipState, FormData>(
    startMembershipCheckout,
    initial
  );
  const locked = !enabled || pending;

  let status: React.ReactNode = note;
  if (!enabled) status = "Payments open soon.";
  else if (state.error) status = state.error;
  else if (thanks)
    status = (
      <>
        Welcome in. Your membership is active; the receipt is in your inbox.{" "}
        <Link href="/auth/sign-up" className="underline underline-offset-4">
          Create your member account
        </Link>{" "}
        with the same email to manage billing.
      </>
    );

  return (
    <form action={action} className="terminal-checkout">
      <button type="submit" className="terminal-button" disabled={locked}>
        {pending ? "Opening checkout" : "Become a member"}{" "}
        <span aria-hidden="true">↗</span>
      </button>
      <p className="terminal-muted" role="status">{status}</p>
    </form>
  );
}
