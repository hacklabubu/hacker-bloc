"use server";

import { redirect } from "next/navigation";
import { getMemberByEmail } from "@/lib/member-account";
import { requestOrigin } from "@/lib/request-origin";
import { getMembershipStripe } from "@/lib/stripe";
import { createClient } from "@/lib/supabase/server";

export type BillingState = { error: string | null };

/*
 * "Manage billing": hands the signed-in member to Stripe's hosted Customer
 * Portal (card on file, invoices, cancel at period end). The member is matched
 * to their Stripe customer by the email they signed in with. Requires the
 * Stripe key to have Customer portal write access on top of Checkout Sessions.
 */
export async function openBillingPortal(): Promise<BillingState> {
  const supabase = await createClient();
  const { data } = await supabase.auth.getClaims();
  const email = typeof data?.claims?.email === "string" ? data.claims.email : "";
  if (!email) redirect("/auth/login?next=/members");

  const member = await getMemberByEmail(email);
  if (!member) {
    return { error: "No membership is linked to this email yet." };
  }

  const stripe = getMembershipStripe();
  if (!stripe) return { error: "Billing is not available right now." };

  const origin = await requestOrigin();
  let portalUrl: string | null = null;
  try {
    const session = await stripe.billingPortal.sessions.create({
      customer: member.stripeCustomerId,
      return_url: `${origin}/members`,
    });
    portalUrl = session.url;
  } catch (error) {
    console.error("billing portal failed", error);
    return { error: "Billing could not be opened. Try again in a moment." };
  }

  redirect(portalUrl);
}
