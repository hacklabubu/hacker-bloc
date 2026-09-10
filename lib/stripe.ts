import Stripe from "stripe";

/*
 * Server-only Stripe clients. Null when the key is unset, so every checkout
 * surface can render itself disabled ("Payments open soon.").
 *
 * One key (STRIPE_SECRET_KEY) serves both checkouts. Both only create
 * Checkout Sessions, so a restricted key (rk_…) with Checkout Sessions write
 * access is enough. STRIPE_SECRET_KEY_MEMBERSHIP, if set, overrides it for the
 * membership checkout so that key can be revoked on its own.
 */
function client(name: string): Stripe | null {
  const key = process.env[name]?.trim();
  if (!key) return null;
  return new Stripe(key);
}

function membershipKeyName(): string {
  return process.env.STRIPE_SECRET_KEY_MEMBERSHIP?.trim()
    ? "STRIPE_SECRET_KEY_MEMBERSHIP"
    : "STRIPE_SECRET_KEY";
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
  return client(membershipKeyName());
}

/*
 * The two prices behind a membership, created once in the Stripe dashboard on
 * the membership product (STRIPE_PRODUCT_ID_MEMBERSHIP, informational only):
 *   - monthly:  $100 USD, recurring every month
 *   - signup:   $1,000 USD, one-time
 */
export function getMembershipPrices(): { monthly: string; signup: string } | null {
  const monthly = process.env.STRIPE_PRICE_ID_MEMBERSHIP_100?.trim();
  const signup = process.env.STRIPE_PRICE_ID_MEMBERSHIP_1000?.trim();
  if (!monthly || !signup) return null;
  return { monthly, signup };
}

export function membershipCheckoutEnabled(): boolean {
  return (
    Boolean(process.env[membershipKeyName()]?.trim()) &&
    getMembershipPrices() !== null
  );
}
