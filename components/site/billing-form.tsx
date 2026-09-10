"use client";

import { useActionState } from "react";
import { openBillingPortal, type BillingState } from "@/app/actions/billing";

const initial: BillingState = { error: null };

/* The "Manage billing" button on /space/billing; opens Stripe's Customer Portal. */
export function BillingForm() {
  const [state, action, pending] = useActionState<BillingState, FormData>(
    openBillingPortal,
    initial
  );

  return (
    <form action={action} className="terminal-checkout">
      <button type="submit" className="terminal-button" disabled={pending}>
        {pending ? "Opening billing" : "Manage billing"}{" "}
        <span aria-hidden="true">↗</span>
      </button>
      <p className="terminal-muted" role="status">
        {state.error ?? "Update your card, download invoices, or cancel. Hosted by Stripe."}
      </p>
    </form>
  );
}
