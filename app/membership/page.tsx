import type { Metadata } from "next";
import Link from "next/link";
import { connection } from "next/server";
import {
  MEMBERSHIP,
  formatUsd,
  getMembershipPaymentUrl,
} from "@/lib/membership";

export const metadata: Metadata = {
  title: "Membership",
  description: `Join Hacker Bloc’s first ${MEMBERSHIP.limit} members. All events, 24/7 hackerspace access, and a say in the space. ${formatUsd(MEMBERSHIP.monthlyUsd)} USD/month + ${formatUsd(MEMBERSHIP.signupUsd)} signup.`,
  alternates: { canonical: "/membership" },
};

export default async function MembershipPage() {
  await connection();
  const paymentUrl = getMembershipPaymentUrl();

  return (
    <main id="top" className="terminal-page">
      <section className="terminal-intro" aria-labelledby="membership-heading">
        <p className="terminal-location">Membership / The first {MEMBERSHIP.limit}</p>
        <h1 id="membership-heading">Become a Hacker Bloc founding member.</h1>
        <p>
          Help get our hackerspace off the ground. Join the first {MEMBERSHIP.limit}
          {" "}people building a place to work, meet, and make things together.
        </p>
      </section>

      <section id="membership" className="terminal-section" aria-labelledby="offer-heading">
        <h2 id="offer-heading" className="terminal-legend">Founding membership</h2>
        <div className="terminal-section-content">
          <p className="terminal-price">
            <strong>{formatUsd(MEMBERSHIP.monthlyUsd)}</strong> USD / month
          </p>
          <p className="terminal-signup">
            + {formatUsd(MEMBERSHIP.signupUsd)} USD one-time signup fee
          </p>

          <ul className="terminal-perks" aria-label="Founding member privileges">
            {MEMBERSHIP.benefits.map((benefit) => (
              <li key={benefit.title}>
                <span aria-hidden="true">[+]</span>
                <span>{benefit.description}</span>
              </li>
            ))}
          </ul>

          <div className="terminal-checkout">
            {paymentUrl ? (
              <a href={paymentUrl} className="terminal-button">
                Join <span aria-hidden="true">↗</span>
              </a>
            ) : (
              <button type="button" disabled aria-describedby="payment-status" className="terminal-button">
                Join <span aria-hidden="true">↗</span>
              </button>
            )}
            <p id="payment-status" className="terminal-muted">
              {paymentUrl ? "All prices in USD." : "Payments open soon."}
            </p>
          </div>
        </div>
      </section>

      <section className="terminal-section" aria-labelledby="funding-heading">
        <h2 id="funding-heading" className="terminal-legend">Where your money goes</h2>
        <div className="terminal-section-content">
          <p>Membership money goes straight into making the space happen.</p>
          <dl className="terminal-allocation">
            <div><dt>Rent</dt><dd>{MEMBERSHIP.rentPercent}%</dd></div>
            <div><dt>Setting up the space</dt><dd>{MEMBERSHIP.setupPercent}%</dd></div>
          </dl>
          <p className="terminal-funding-description">
            Our first milestone is {formatUsd(MEMBERSHIP.spaceGoalUsd)} USD for Space 1.0.
            {" "}<Link href="/support" className="underline underline-offset-4">See how to support the Bloc →</Link>
          </p>
        </div>
      </section>
    </main>
  );
}
