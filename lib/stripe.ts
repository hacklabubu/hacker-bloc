import Stripe from "stripe";

/*
 * Server-only Stripe clients. Null when the key is unset, so every checkout
 * surface can render itself disabled ("Payments open soon.").
 *
 * Each checkout has its own key. Both only create Checkout Sessions, so a
 * restricted key (rk_…) with Checkout Sessions write access is enough.
 */
function client(name: string): Stripe | null {
  const key = process.env[name]?.trim();
  if (!key) return null;
  return new Stripe(key);
}

/* Patron checkout (app/actions/patron.ts). */
export function getStripe(): Stripe | null {
  return client("STRIPE_SECRET_KEY");
}

export function patronCheckoutEnabled(): boolean {
  return Boolean(process.env.STRIPE_SECRET_KEY?.trim());
}

/* Membership checkout (app/actions/membership.ts). */
export function getMembershipStripe(): Stripe | null {
  return client("STRIPE_SECRET_KEY_MEMBERSHIP");
}

/*
 * The two prices behind a membership, created once in the Stripe dashboard on
 * the membership product (STRIPE_PRODUCT_ID_MEMBERSHIP, informational only):
 *   - monthly:  €100 EUR, recurring every month
 *   - signup:   €1,000 EUR, one-time
 */
export function getMembershipPrices(): { monthly: string; signup: string } | null {
  const monthly = process.env.STRIPE_PRICE_ID_MEMBERSHIP_100?.trim();
  const signup = process.env.STRIPE_PRICE_ID_MEMBERSHIP_1000?.trim();
  if (!monthly || !signup) return null;
  return { monthly, signup };
}

export function membershipCheckoutEnabled(): boolean {
  return (
    Boolean(process.env.STRIPE_SECRET_KEY_MEMBERSHIP?.trim()) &&
    getMembershipPrices() !== null
  );
}
