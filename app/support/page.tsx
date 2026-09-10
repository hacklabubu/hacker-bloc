import type { Metadata } from "next";
import Link from "next/link";
import { MEMBERSHIP, formatUsd } from "@/lib/membership";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "Support the Bloc",
  description: `Help build Hacker Bloc. Our first milestone is ${formatUsd(MEMBERSHIP.spaceGoalUsd)} USD for Space 1.0. Become a founding member or contribute equipment, time, and resources.`,
  alternates: { canonical: "/support" },
};

export default function SupportPage() {
  return (
    <main id="top" className="terminal-page">
      <section className="terminal-intro" aria-labelledby="support-heading">
        <p className="terminal-location">Support / Build it with us</p>
        <h1 id="support-heading">Support the Bloc.</h1>
        <p>
          We&apos;re building a hackerspace in Warsaw. Help us get the doors open
          and fill it with the things people need to make things.
        </p>
      </section>

      <section id="space" className="terminal-section" aria-labelledby="space-heading">
        <h2 id="space-heading" className="terminal-legend">The first milestone / Space 1.0</h2>
        <div className="terminal-section-content">
          <p className="terminal-price">
            <strong>{formatUsd(MEMBERSHIP.spaceGoalUsd)}</strong> USD gets Space 1.0 off the ground.
          </p>
          <p className="terminal-muted terminal-funding-description">
            Membership money goes straight into making the space happen:
          </p>
          <dl className="terminal-allocation">
            <div><dt>Rent</dt><dd>{MEMBERSHIP.rentPercent}%</dd></div>
            <div><dt>Setting up the space</dt><dd>{MEMBERSHIP.setupPercent}%</dd></div>
          </dl>
          <p className="terminal-funding-description">
            <Link href="/membership" className="underline underline-offset-4">Become a founding member →</Link>
          </p>
        </div>
      </section>

      <section className="terminal-section" aria-labelledby="contribute-heading">
        <h2 id="contribute-heading" className="terminal-legend">Bring something to the Bloc</h2>
        <div className="terminal-section-content terminal-roadmap">
          <p>
            Have equipment, time, or resources to contribute? Tell us what you have
            in mind, and we&apos;ll figure out how it can help the space.
          </p>
          <a href={`mailto:${SITE.email}`} className="underline underline-offset-4">Contact us →</a>
        </div>
      </section>

      <section id="roadmap" className="terminal-section" aria-labelledby="roadmap-heading">
        <h2 id="roadmap-heading" className="terminal-legend">Wishlist / roadmap</h2>
        <div className="terminal-section-content terminal-roadmap">
          <p>The things we want to build and buy next, with a way to fund specific items.</p>
          <span className="terminal-muted">[ coming soon ]</span>
        </div>
      </section>
    </main>
  );
}
