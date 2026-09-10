import type { Metadata } from "next";
import Link from "next/link";
import { connection } from "next/server";
import { MemberForm } from "@/components/site/member-form";
import { PatronForm } from "@/components/site/patron-form";
import { TerminalWordmark } from "@/components/site/terminal-art";
import { MEMBERSHIP, formatUsd } from "@/lib/membership";
import { SITE, SOCIALS } from "@/lib/site";
import { membershipCheckoutEnabled, patronCheckoutEnabled } from "@/lib/stripe";
import { getWordmarks } from "@/lib/wordmarks";

const description =
  "A hackerspace in Warsaw, built by founders. Palo Alto at home: a house where startup founders meet, build, and start companies. Become a member or a patron.";

export const metadata: Metadata = {
  title: "Home",
  description,
  alternates: { canonical: "/" },
};

const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Hacker Bloc",
  url: SITE.url,
  description,
  email: SITE.email,
  address: {
    "@type": "PostalAddress",
    ...SITE.postal,
  },
  sameAs: [...SOCIALS.map((social) => social.url), "https://hacklab.so"],
};

export default async function Home() {
  // Read the collection on refresh so new artwork can be tried without a rebuild.
  await connection();
  const wordmarks = getWordmarks();
  const memberEnabled = membershipCheckoutEnabled();
  const patronEnabled = patronCheckoutEnabled();

  return (
    <main id="top" className="terminal-page">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(organizationJsonLd).replace(/</g, "\\u003c"),
        }}
      />
      <section className="terminal-intro" aria-labelledby="home-heading">
        <TerminalWordmark wordmarks={wordmarks} />
        <p className="terminal-location">
          {SITE.city} / {SITE.district} /{" "}
          <a href={SITE.mapsUrl} className="underline underline-offset-4">
            {SITE.postal.streetAddress}
          </a>
        </p>
        <h1 id="home-heading">We have Palo Alto at home</h1>
        <p>
          We want the kind of space we saw in Silicon Valley: a house where startup founders meet, build, start
          their first Delaware C-corp, get their first check, find cofounders,
          and build billion-dollar companies.
        </p>
        <p>
          We are not community builders. We are founders. We rented this house
          to build the next trillion-dollar company,{" "}
          <a href="https://hacklab.so" className="underline underline-offset-4">hacklab.so</a>,
          and we live and work here 24/7. We&apos;re pre-seed, pre-revenue,{" "}
          <a href="https://www.youtube.com/shorts/n5dAIvH2cQw" className="underline underline-offset-4">pure potential</a>,
          so we figured a hackerspace would help us not die in the initial grind.
        </p>
        <p>
          If you want a place like this in Warsaw, and want to help Poland become
          Europe&apos;s Silicon Valley, there are two ways in.
        </p>
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
            note={
              <>
                First {MEMBERSHIP.limit} members. No refunds.{" "}
                <Link href="/membership#risk" className="underline underline-offset-4">Read the risk note →</Link>{" "}
                <Link href="/terms" className="underline underline-offset-4">Terms →</Link>
              </>
            }
          />
        </div>
      </section>

      <section id="patron" className="terminal-section" aria-labelledby="patron-heading">
        <h2 id="patron-heading" className="terminal-legend">Become a patron</h2>
        <div className="terminal-section-content terminal-roadmap">
          <p>Not moving in, but want this to exist? Put any amount into the space.</p>
          <PatronForm enabled={patronEnabled} />
        </div>
      </section>

    </main>
  );
}
