"use server";

import { redirect } from "next/navigation";
import { getSessionUser } from "@/lib/auth";
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
 * Guests pay first; verified accounts are matched to the checkout email later.
 *
 * Fulfillment is in app/api/stripe/webhook/route.ts, which mirrors the
 * customer, subscription, and invoices into Neon.
 */
export async function startMembershipCheckout(tier: "founding" | "member" = "founding"): Promise<MembershipState> {
  if (tier !== "founding" && tier !== "member") return { error: "Choose a membership tier." };
  const founding = tier === "founding";
  const stripe = getMembershipStripe();
  const prices = getMembershipPrices(tier);
  if (!stripe || !prices) return { error: "Payments open soon." };

  const user = await getSessionUser();


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
      customer_email: user?.email,
      client_reference_id: user?.id,
      line_items: [
        { price: prices.monthly, quantity: 1 },
        ...(founding ? [{ price: prices.signup!, quantity: 1 }] : []),
      ],
      subscription_data: {
        ...(founding ? { trial_end: anchor } : {}),
        metadata: { kind: "membership", tier, ...(user ? { supabase_user_id: user.id } : {}) },
      },
      custom_text: {
        submit: {
          message: `${founding ? `${formatUsd(MEMBERSHIP.signupUsd)} today. Then ${formatUsd(MEMBERSHIP.monthlyUsd)} a month, first on ${firstMonthly}.` : `${formatUsd(MEMBERSHIP.monthlyUsd)} today and every month.`} By paying you accept the membership terms and refund policy at ${origin}/terms and ${origin}/refunds, and ask us to start your membership immediately.`,
        },
      },
      metadata: { kind: "membership", tier, ...(user ? { supabase_user_id: user.id } : {}) },
      integration_identifier: "hacker-bloc-membership-kwzqmtev",
      success_url: `${origin}/pricing?member=thanks&tier=${tier}#${tier}`,
      cancel_url: `${origin}/pricing#${tier}`,
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
