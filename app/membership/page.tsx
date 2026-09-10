import type { Metadata } from "next";
import Link from "next/link";
import { connection } from "next/server";
import { PatronForm } from "@/components/site/patron-form";
import {
  MEMBERSHIP,
  RISK_NOTE,
  formatUsd,
  getMembershipPaymentUrl,
} from "@/lib/membership";
import { patronCheckoutEnabled } from "@/lib/stripe";

export const metadata: Metadata = {
  title: "Membership",
  description: `Become one of the first ${MEMBERSHIP.limit} members of Hacker Bloc for ${formatUsd(MEMBERSHIP.monthlyUsd)} USD/month, or become a patron with a one-time donation of any amount.`,
  alternates: { canonical: "/membership" },
};

function PayButton({
  href,
  label,
  note,
}: {
  href: string | null;
  label: string;
  note?: string;
}) {
  const statusId = `${label.toLowerCase().replace(/\s+/g, "-")}-status`;
  return (
    <div className="terminal-checkout">
      {href ? (
        <a href={href} className="terminal-button">
          {label} <span aria-hidden="true">↗</span>
        </a>
      ) : (
        <button type="button" disabled aria-describedby={statusId} className="terminal-button">
          {label} <span aria-hidden="true">↗</span>
        </button>
      )}
      <p id={statusId} className="terminal-muted">
        {href ? note : "Payments open soon."}
      </p>
    </div>
  );
}

export default async function MembershipPage({
  searchParams,
}: {
  searchParams: Promise<{ patron?: string }>;
}) {
  await connection();
  const memberUrl = getMembershipPaymentUrl();
  const patronEnabled = patronCheckoutEnabled();
  /* Stripe sends a finished patron back here with ?patron=thanks. */
  const thanks = (await searchParams).patron === "thanks";

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
          <PayButton
            href={memberUrl}
            label="Become a member"
            note="No refunds. Read the risk note below."
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
        </div>
      </section>
    </main>
  );
}
