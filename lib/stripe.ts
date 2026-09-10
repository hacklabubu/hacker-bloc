import Stripe from "stripe";

/*
 * Server-only Stripe client. A restricted key (rk_…) with Checkout Sessions
 * write access is enough; nothing here reads customers or charges.
 * Null when unset, so every checkout surface can render itself disabled.
 */
export function getStripe(): Stripe | null {
  const key = process.env.STRIPE_SECRET_KEY?.trim();
  if (!key) return null;
  return new Stripe(key);
}

export function patronCheckoutEnabled(): boolean {
  return Boolean(process.env.STRIPE_SECRET_KEY?.trim());
}
