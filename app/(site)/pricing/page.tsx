import type { Metadata } from "next";
import Link from "next/link";
import { connection } from "next/server";
import { MemberForm } from "@/components/site/member-form";
import { authConfigured, getSessionUser } from "@/lib/auth";
import { rememberProfile } from "@/lib/profile";
import { PatronForm } from "@/components/site/patron-form";
import { MEMBERSHIP, RISK_NOTE, formatUsd } from "@/lib/membership";
import { membershipCheckoutEnabled, patronCheckoutEnabled } from "@/lib/stripe";

export const metadata: Metadata = {
  title: "Pricing",
  description: `Become one of the first ${MEMBERSHIP.limit} members of Hacker Bloc for ${formatUsd(MEMBERSHIP.monthlyUsd)} USD/month, or become a patron with a one-time donation of any amount.`,
  alternates: { canonical: "/pricing" },
};

export default async function PricingPage({
  searchParams,
}: {
  searchParams: Promise<{ member?: string; patron?: string; tier?: string }>;
}) {
  await connection();
  const accountsEnabled = authConfigured();
  const patronEnabled = patronCheckoutEnabled();
  const user = accountsEnabled ? await getSessionUser() : null;
  if (user) await rememberProfile(user);
  /* Stripe sends a finished checkout back here with ?member=thanks or ?patron=thanks. */
  const params = await searchParams;
  const memberThanks = params.member === "thanks";
  const thanks = params.patron === "thanks";

  return (
    <main id="top" className="terminal-page">
      <section className="terminal-intro" aria-labelledby="membership-heading">
        <p className="terminal-location">Pricing · USD</p>
        <h1 id="membership-heading">Three ways to be part of the Bloc.</h1>
      </section>

      <div className="pricing-grid">
      {(["founding", "member"] as const).map((tier) => (
      <section key={tier} id={tier} className="terminal-section" aria-labelledby={`${tier}-heading`}>
        <h2 id={`${tier}-heading`} className="terminal-legend">{tier === "founding" ? "Founding member" : "Member"}</h2>
        <div className="terminal-section-content">
          <p className="terminal-price">
            <strong>{formatUsd(MEMBERSHIP.monthlyUsd)}</strong> USD / month
          </p>
          <p className="terminal-signup">
            {tier === "founding" ? `+ ${formatUsd(MEMBERSHIP.signupUsd)} USD one-time contribution` : "No signup fee. Start building with us."}
          </p>
          <p className="terminal-muted">{tier === "founding" ? "Help set up the space. Pay the founding contribution today; monthly billing starts next month." : "Your first month starts today. Billed monthly."}</p>
          <ul className="terminal-perks" aria-label="Member benefits">
            {MEMBERSHIP.benefits.map((benefit) => (
              <li key={benefit.title}>
                <span aria-hidden="true">[+]</span>
                <span>{benefit.description}</span>
              </li>
            ))}
          </ul>
          <MemberForm
            accountsEnabled={accountsEnabled}
            tier={tier}
            paymentsEnabled={membershipCheckoutEnabled(tier)}
            signedIn={user !== null}
            thanks={memberThanks && params.tier === tier}
            note={
              <>
                {tier === "founding" ? `${formatUsd(MEMBERSHIP.signupUsd)} today, then ${formatUsd(MEMBERSHIP.monthlyUsd)} a month from next month.` : `${formatUsd(MEMBERSHIP.monthlyUsd)} today and every month.`}
                By paying you accept the{" "}
                <Link href="/terms" className="underline underline-offset-4">terms</Link> and the{" "}
                <Link href="/refunds" className="underline underline-offset-4">refund policy</Link>. Read the risk note below.
              </>
            }
          />
        </div>
      </section>

      ))}

      <section id="patron" className="terminal-section" aria-labelledby="patron-heading">
        <h2 id="patron-heading" className="terminal-legend">Patron</h2>
        <div className="terminal-section-content terminal-roadmap">
          <p className="terminal-price"><strong>Any amount</strong></p>
          <p>Love the idea and want to support the community? Give what you like, as a one-time contribution.</p>
          <p className="terminal-muted">No space access or membership included.</p>
          <PatronForm enabled={patronEnabled} thanks={thanks} />
        </div>
      </section>

      </div>

      <section id="money" className="terminal-section" aria-labelledby="money-heading">
        <h2 id="money-heading" className="terminal-legend">Where the money goes</h2>
        <div className="terminal-section-content terminal-roadmap">
          <p>
            {MEMBERSHIP.rentPercent}% rent, {MEMBERSHIP.setupPercent}% setting up the space.
          </p>
          <Link href="/roadmap" className="underline underline-offset-4">See the roadmap →</Link>
        </div>
      </section>

      {MEMBERSHIP.taken > 0 && (
        <section id="spots" className="terminal-section" aria-labelledby="spots-heading">
          <h2 id="spots-heading" className="terminal-legend">Spots</h2>
          <div className="terminal-section-content">
            <p>[ {MEMBERSHIP.taken} / {MEMBERSHIP.limit} taken ]</p>
          </div>
        </section>
      )}

      <section id="risk" className="terminal-section" aria-labelledby="risk-heading">
        <h2 id="risk-heading" className="terminal-legend">Risk</h2>
        <div className="terminal-section-content terminal-roadmap">
          <p>{RISK_NOTE}</p>
          <p>
            <Link href="/refunds" className="underline underline-offset-4">What is and isn&apos;t refunded →</Link>
          </p>
        </div>
      </section>
    </main>
  );
}
