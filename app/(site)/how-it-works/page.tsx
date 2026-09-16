import type { Metadata } from "next";
import Link from "next/link";
import { SIGNUP_FOR_MEMBERSHIP } from "@/components/site/member-form";
import { NO_EXCEPTIONS, WHY_FEE } from "@/lib/copy";
import { MEMBERSHIP, ROADMAP, formatUsd } from "@/lib/membership";
import { LUMA, SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "How it works",
  description:
    "How Hacker Bloc works: create an account, become a member, get a key, and help build the space one version at a time.",
  alternates: { canonical: "/how-it-works" },
};

/* Mirrored in lib/markdown.ts (howItWorksMarkdown); change both. */
export const STEPS = [
  {
    title: "Create an account",
    body: "Sign up with GitHub or an email. That puts you on the members list as a lurker: you can see who is around and what is on, and nothing is charged.",
  },
  {
    title: "Become a member",
    body: `${formatUsd(MEMBERSHIP.monthlyUsd)} a month with no signup fee, or join as a founding member. Stripe hosts the checkout; you manage the card and invoices yourself in your space. ${WHY_FEE.heading} ${WHY_FEE.body} ${NO_EXCEPTIONS.heading} ${NO_EXCEPTIONS.body}`,
  },
  {
    title: "Get the key",
    body: "Members get into every event and have round-the-clock access to the hackerspace at " + SITE.postal.streetAddress + ". Read the rules first; the roles page says who can say yes to what.",
  },
  {
    title: "Build the space with us",
    body: `${MEMBERSHIP.rentPercent}% of the money pays the rent, ${MEMBERSHIP.setupPercent}% sets up the space. Every ${ROADMAP[0].hackers} members unlock the next version on the roadmap, and members decide what gets bought next.`,
  },
] as const;

export default function HowItWorksPage() {
  return (
    <main id="top" className="terminal-page">
      <section className="terminal-intro" aria-labelledby="how-heading">
        <p className="terminal-location">How it works</p>
        <h1 id="how-heading">Account, membership, key.</h1>
        <p>
          A hackerspace in Warsaw run by the founders who live in it. Here is
          the whole model in four steps, and the two other ways to be part of it.
        </p>
      </section>

      <section className="terminal-section" aria-labelledby="steps-heading">
        <h2 id="steps-heading" className="terminal-legend">The steps</h2>
        <div className="terminal-section-content">
          <ol className="terminal-rules">
            {STEPS.map((step) => (
              <li key={step.title}>
                <span>
                  <strong>{step.title}.</strong> {step.body}
                </span>
              </li>
            ))}
          </ol>
          <div className="terminal-actions">
            <Link href={SIGNUP_FOR_MEMBERSHIP} className="terminal-button">
              Create an account <span aria-hidden="true">↗</span>
            </Link>
            <Link href="/membership#member" className="terminal-button">
              Membership details <span aria-hidden="true">↗</span>
            </Link>
          </div>
        </div>
      </section>

      <section className="terminal-section" aria-labelledby="other-heading">
        <h2 id="other-heading" className="terminal-legend">Not moving in?</h2>
        <div className="terminal-section-content terminal-prose">
          <p>
            <strong>Patrons</strong> put any amount into the space once, no
            membership attached. <Link href="/membership#patron">Become a patron</Link>.
          </p>
          <p>
            <strong>Residents</strong> live and work in the house by invitation.
          </p>
          <p>
            <strong>Everyone</strong> is welcome at public events. The calendar is
            on <a href={LUMA.calendarUrl}>Luma</a> and on <Link href="/events">the events page</Link>.
          </p>
        </div>
      </section>

      <section className="terminal-section" aria-labelledby="read-heading">
        <h2 id="read-heading" className="terminal-legend">Read next</h2>
        <div className="terminal-section-content terminal-prose">
          <p>
            <Link href="/rules">Rules →</Link>{" "}
            <Link href="/roles">Roles →</Link>{" "}
            <Link href="/roadmap">Roadmap →</Link>{" "}
            <Link href="/wishlist">Wishlist →</Link>{" "}
            <Link href="/members">Who is in →</Link>
          </p>
          <p className="terminal-muted">
            Terms, refunds and privacy are in the footer. Questions go to{" "}
            <a href={`mailto:${SITE.email}`}>{SITE.email}</a>.
          </p>
        </div>
      </section>
    </main>
  );
}
