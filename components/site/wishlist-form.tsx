"use client";

import { useActionState } from "react";
import { startRestroomCheckout, startKitchenCheckout, startMonitorsCheckout, startLightingCheckout } from "@/app/actions/wishlist";

export function WishlistForm({ enabled, thanks, item = "restroom" }: { enabled: boolean; thanks: boolean; item?: "restroom" | "kitchen" | "monitors" | "lighting" }) {
  const amount = item === "kitchen" ? "$1,200" : item === "monitors" ? "$750" : item === "lighting" ? "$500" : "$210";
  const checkoutAction = item === "kitchen"
    ? startKitchenCheckout
    : item === "monitors"
      ? startMonitorsCheckout
      : item === "lighting"
        ? startLightingCheckout
      : startRestroomCheckout;
  const [state, action, pending] = useActionState(checkoutAction, { error: null });
  if (thanks) return <p role="status">Thank you. Your contribution is being confirmed.</p>;
  return (
    <form action={action} className="terminal-checkout">
      <button type="submit" className="terminal-button" disabled={!enabled || pending}>
        {pending ? "Opening checkout" : `Fund this item — ${amount}`} <span aria-hidden="true">↗</span>
      </button>
      <p className="terminal-muted" role="status">
        {state.error ?? (enabled ? `One-time payment of ${amount} USD via Stripe.` : "Payments open soon.")}
      </p>
    </form>
  );
}
