import Link from "next/link";
import { startMembershipCheckout } from "@/app/actions/membership";
import { authConfigured, getSessionUser } from "@/lib/auth";
import { getStatusByEmail, type PersonStatus } from "@/lib/people";
import { rememberProfile } from "@/lib/profile";
import { membershipCheckoutEnabled } from "@/lib/stripe";

/* Roles that still have a membership to buy. */
const CAN_JOIN: readonly PersonStatus[] = ["lurker", "patron"];

/*
 * The one call to action, wherever membership is offered. Signed out: "Join"
 * to the sign-in page (create an account from there), then back to `next`.
 * Signed in without a membership: "Become a member", straight into Stripe
 * checkout. Members and above: nothing to sell them, renders nothing.
 */
export async function JoinCta({ next = "/membership#member" }: { next?: string }) {
  const user = authConfigured() ? await getSessionUser() : null;
  if (!user) {
    return (
      <div className="terminal-actions">
        <Link href={`/auth/login?next=${encodeURIComponent(next)}`} className="terminal-button">
          Join <span aria-hidden="true">↗</span>
        </Link>
      </div>
    );
  }
  await rememberProfile(user);
  const status = await getStatusByEmail(user.email);
  if (!status || !CAN_JOIN.includes(status)) return null;
  if (!membershipCheckoutEnabled()) {
    return (
      <div className="terminal-actions">
        <Link href="/membership#member" className="terminal-button">
          Become a member <span aria-hidden="true">↗</span>
        </Link>
      </div>
    );
  }
  return (
    <form
      action={async () => {
        "use server";
        await startMembershipCheckout();
      }}
      className="terminal-actions"
    >
      <button type="submit" className="terminal-button">
        Become a member <span aria-hidden="true">↗</span>
      </button>
    </form>
  );
}
