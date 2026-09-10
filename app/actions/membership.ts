"use server";

import { redirect } from "next/navigation";
import { MEMBERSHIP, formatUsd, nextMonthUnix } from "@/lib/membership";
import { requestOrigin } from "@/lib/request-origin";
import { getMembershipPrices, getMembershipStripe } from "@/lib/stripe";

export type MembershipState = { error: string | null };

/*
 * Membership checkout: $1,000 today, then $100 a month starting a month from
 * now. Stripe hosts the checkout; no card data touches this server.
 *
 * Both amounts live on one subscription so a member is one customer with one
 * subscription in Stripe. The $1,000 signup price is a one-time line on the
 * first invoice. The $100 recurring price sits behind a one-month trial
 * (`trial_end`), so it bills nothing today and Stripe creates no prorations.
 * (A billing-cycle anchor with `proration_behavior: "none"` is rejected by
 * Checkout when a one-time price is present.) The first invoice is therefore
 * exactly $1,000, the second (a month later) $100, and every month after that
 * $100. The subscription is "trialing" for the first month and "active" after.
 *
 * Fulfillment is in app/api/stripe/webhook/route.ts, which mirrors the
 * customer, subscription, and invoices into Neon.
 */
export async function startMembershipCheckout(): Promise<MembershipState> {
  const stripe = getMembershipStripe();
  const prices = getMembershipPrices();
  if (!stripe || !prices) return { error: "Payments open soon." };

  const origin = await requestOrigin();
  const anchor = nextMonthUnix();
  const firstMonthly = new Date(anchor * 1000).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  });

  let checkoutUrl: string | null = null;
  try {
    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      /* Always charge in USD; no local-currency conversion offers. */
      adaptive_pricing: { enabled: false },
      line_items: [
        { price: prices.monthly, quantity: 1 },
        { price: prices.signup, quantity: 1 },
      ],
      subscription_data: {
        trial_end: anchor,
        metadata: { kind: "membership" },
      },
      custom_text: {
        submit: {
          message: `${formatUsd(MEMBERSHIP.signupUsd)} today. Then ${formatUsd(MEMBERSHIP.monthlyUsd)} a month, first on ${firstMonthly}. By paying you accept the membership terms and refund policy at ${origin}/terms and ${origin}/refunds, and ask us to start your membership immediately.`,
        },
      },
      metadata: { kind: "membership" },
      integration_identifier: "hacker-bloc-membership-kwzqmtev",
      success_url: `${origin}/membership?member=thanks#member`,
      cancel_url: `${origin}/membership#member`,
    });
    checkoutUrl = session.url;
  } catch (error) {
    console.error("membership checkout failed", error);
    return { error: "Checkout could not be started. Try again in a moment." };
  }

  if (!checkoutUrl) {
    return { error: "Checkout could not be started. Try again in a moment." };
  }
  redirect(checkoutUrl);
}
