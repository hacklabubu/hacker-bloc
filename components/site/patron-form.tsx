"use client";

import { useActionState } from "react";
import { startPatronCheckout, type PatronState } from "@/app/actions/patron";

const initial: PatronState = { error: null };

/*
 * The amount box. Disabled with "Payments open soon." until the server has a
 * Stripe key; otherwise the submit hands off to Stripe-hosted checkout.
 */
export function PatronForm({
  enabled,
  thanks = false,
}: {
  enabled: boolean;
  thanks?: boolean;
}) {
  const [state, action, pending] = useActionState(startPatronCheckout, initial);
  const locked = !enabled || pending;

  let status = "One-time. Any amount. Straight into the space.";
  if (!enabled) status = "Payments open soon.";
  else if (state.error) status = state.error;
  else if (thanks) status = "Thank you. It went straight into the space.";

  return (
    <form action={action} className="terminal-patron">
      <label className="terminal-amount">
        <span aria-hidden="true">$</span>
        <input
          name="amount"
          type="text"
          inputMode="numeric"
          autoComplete="off"
          placeholder="any amount"
          aria-label="Amount in USD"
          aria-invalid={state.error ? true : undefined}
          required
          disabled={locked}
        />
        <span aria-hidden="true">USD</span>
      </label>
      <div className="terminal-checkout">
        <button type="submit" className="terminal-button" disabled={locked}>
          {pending ? "Opening checkout" : "Become a patron"}{" "}
          <span aria-hidden="true">↗</span>
        </button>
        <p className="terminal-muted" role="status">{status}</p>
      </div>
    </form>
  );
}
