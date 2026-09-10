import type { Metadata } from "next";
import Link from "next/link";
import { connection } from "next/server";
import { MemberForm } from "@/components/site/member-form";
import { PatronForm } from "@/components/site/patron-form";
import { MEMBERSHIP, RISK_NOTE, formatUsd } from "@/lib/membership";
import { membershipCheckoutEnabled, patronCheckoutEnabled } from "@/lib/stripe";

export const metadata: Metadata = {
  title: "Membership",
  description: `Become one of the first ${MEMBERSHIP.limit} members of Hacker Bloc for ${formatUsd(MEMBERSHIP.monthlyUsd)} USD/month, or become a patron with a one-time donation of any amount.`,
  alternates: { canonical: "/membership" },
};

export default async function MembershipPage({
  searchParams,
}: {
  searchParams: Promise<{ member?: string; patron?: string }>;
}) {
  await connection();
  const memberEnabled = membershipCheckoutEnabled();
  const patronEnabled = patronCheckoutEnabled();
  /* Stripe sends a finished checkout back here with ?member=thanks or ?patron=thanks. */
  const params = await searchParams;
  const memberThanks = params.member === "thanks";
  const thanks = params.patron === "thanks";

  return (
    <main id="top" className="terminal-page">
      <section className="terminal-intro" aria-labelledby="membership-heading">
        <p className="terminal-location">Membership</p>
        <h1 id="membership-heading">Become one of the first {MEMBERSHIP.limit} members of the Bloc.</h1>
      </section>

      <section id="member" className="terminal-section" aria-labelledby="member-heading">
        <h2 id="member-heading" className="terminal-legend">Become a member</h2>
        <div className="terminal-section-content">
          <p className="terminal-price">
            <strong>{formatUsd(MEMBERSHIP.monthlyUsd)}</strong> USD / month
          </p>
          <p className="terminal-signup">
            + {formatUsd(MEMBERSHIP.signupUsd)} USD one-time signup fee
          </p>
          <ul className="terminal-perks" aria-label="Member benefits">
            {MEMBERSHIP.benefits.map((benefit) => (
              <li key={benefit.title}>
                <span aria-hidden="true">[+]</span>
                <span>{benefit.description}</span>
              </li>
            ))}
          </ul>
          <MemberForm
            enabled={memberEnabled}
            thanks={memberThanks}
            note={
              <>
                {formatUsd(MEMBERSHIP.signupUsd)} today, then {formatUsd(MEMBERSHIP.monthlyUsd)} a month from next month.
                By paying you accept the{" "}
                <Link href="/terms" className="underline underline-offset-4">terms</Link> and the{" "}
                <Link href="/refunds" className="underline underline-offset-4">refund policy</Link>. Read the risk note below.
              </>
            }
          />
        </div>
      </section>

      <section id="patron" className="terminal-section" aria-labelledby="patron-heading">
        <h2 id="patron-heading" className="terminal-legend">Become a patron</h2>
        <div className="terminal-section-content terminal-roadmap">
          <p>Not moving in, but want this to exist? Put any amount into the space.</p>
          <PatronForm enabled={patronEnabled} thanks={thanks} />
        </div>
      </section>

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
