"use server";

import { redirect } from "next/navigation";
import { requestOrigin } from "@/lib/request-origin";
import { getStripe } from "@/lib/stripe";

export async function startRestroomCheckout(): Promise<{ error: string | null }> {
  return startItemCheckout("restroom");
}

export async function startKitchenCheckout(): Promise<{ error: string | null }> {
  return startItemCheckout("kitchen");
}

export async function startMonitorsCheckout(): Promise<{ error: string | null }> {
  return startItemCheckout("monitors");
}

export async function startLightingCheckout(): Promise<{ error: string | null }> {
  return startItemCheckout("lighting");
}

async function startItemCheckout(item: "restroom" | "kitchen" | "monitors" | "lighting"): Promise<{ error: string | null }> {
  const kitchen = item === "kitchen";
  const monitors = item === "monitors";
  const lighting = item === "lighting";
  const stripe = getStripe();
  if (!stripe) return { error: "Payments open soon." };
  const origin = await requestOrigin();
  let url: string | null;
  try {
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      adaptive_pricing: { enabled: false },
      submit_type: "donate",
      line_items: [{
        quantity: 1,
        price_data: {
          currency: "usd",
          unit_amount: kitchen ? 120000 : monitors ? 75000 : lighting ? 50000 : 21000,
          product_data: {
            name: kitchen ? "Mini Kitchen" : monitors ? "Five 4K monitors" : lighting ? "Lighting & decoration" : "Restroom essentials",
            description: kitchen
              ? "Kitchen furniture, mini-stove, microwave, sink, dishes & cutlery."
              : monitors
                ? "Five second-hand 4K monitors available to all members."
                : lighting
                  ? "LED lights, posters, decorations, and cool items to improve the atmosphere."
                : "A toilet, sink, and the basics to get the restroom ready.",
          },
        },
      }],
      metadata: {
        kind: "patron",
        wishlist_item: kitchen
          ? "mini-kitchen"
          : monitors
            ? "five-4k-monitors"
            : lighting
              ? "lighting-and-decoration"
            : "restroom-essentials",
      },
      success_url: `${origin}/wishlist?${item}=thanks#items`,
      cancel_url: `${origin}/wishlist#items`,
    });
    url = session.url;
  } catch (error) {
    console.error("wishlist checkout failed", error);
    return { error: "Checkout could not be started. Please try again." };
  }
  if (!url) return { error: "Checkout could not be started. Please try again." };
  redirect(url);
}
