"use server";

import { redirect } from "next/navigation";
import { PATRON, formatUsd } from "@/lib/membership";
import { requestOrigin } from "@/lib/request-origin";
import { getStripe } from "@/lib/stripe";

export type PatronState = { error: string | null };

/*
 * One-time patron contribution: the visitor names the amount, Stripe hosts the
 * checkout. No card data touches this server. Fulfillment for a donation is
 * nothing more than saying thanks, which the success page does; the webhook in
 * app/api/stripe/webhook/route.ts still receives the event for the audit trail.
 */
export async function startPatronCheckout(
  _previous: PatronState,
  formData: FormData
): Promise<PatronState> {
  const raw = String(formData.get("amount") ?? "").replace(/[\s$,]/g, "");
  const amount = raw === "" ? NaN : Number(raw);
  if (!Number.isInteger(amount) || amount < PATRON.minUsd || amount > PATRON.maxUsd) {
    return {
      error: `Enter a whole amount between ${formatUsd(PATRON.minUsd)} and ${formatUsd(PATRON.maxUsd)} USD.`,
    };
  }

  const stripe = getStripe();
  if (!stripe) return { error: "Payments open soon." };

  const origin = await requestOrigin();
  let checkoutUrl: string | null = null;
  try {
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      submit_type: "donate",
      line_items: [
        {
          quantity: 1,
          price_data: {
            currency: "usd",
            unit_amount: amount * 100,
            product_data: {
              name: "Hacker Bloc patron",
              description: "One-time contribution to the hackerspace in Warsaw.",
            },
          },
        },
      ],
      metadata: { kind: "patron" },
      integration_identifier: "hacker-bloc-patron-kwzqmtev",
      success_url: `${origin}/membership?patron=thanks#patron`,
      cancel_url: `${origin}/membership#patron`,
    });
    checkoutUrl = session.url;
  } catch (error) {
    console.error("patron checkout failed", error);
    return { error: "Checkout could not be started. Try again in a moment." };
  }

  if (!checkoutUrl) {
    return { error: "Checkout could not be started. Try again in a moment." };
  }
  redirect(checkoutUrl);
}
