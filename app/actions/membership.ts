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
 * first invoice. The $100 recurring price does not bill until the billing
 * cycle anchor a month out, and `proration_behavior: "none"` stops Stripe
 * from charging a prorated slice of the first month on top of the signup fee.
 * The first invoice is therefore exactly $1,000, the second (a month later)
 * $100, and every month after that $100.
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
      line_items: [
        { price: prices.monthly, quantity: 1 },
        { price: prices.signup, quantity: 1 },
      ],
      subscription_data: {
        billing_cycle_anchor: anchor,
        proration_behavior: "none",
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
