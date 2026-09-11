import type { Metadata } from "next";
import Link from "next/link";
import { connection } from "next/server";
import { SIGNUP_FOR_MEMBERSHIP } from "@/components/site/member-form";
import { PatronForm } from "@/components/site/patron-form";
import { formatEventDate } from "@/lib/luma";
import { EXPERIMENT_NOTE } from "@/lib/copy";
import { FeeNote } from "@/components/site/fee-note";
import { HOME_PHOTOS, getHomeData } from "@/lib/home";
import { MEMBERSHIP, formatUsd } from "@/lib/membership";
import { roleOf } from "@/lib/people";
import { LUMA, SITE, SOCIALS } from "@/lib/site";
import { patronCheckoutEnabled } from "@/lib/stripe";

const description =
  "A hackerspace in Warsaw, built by founders. Palo Alto at home: a house where startup founders meet, build, and start companies. Become a member or a patron.";

export const metadata: Metadata = {
  title: "Home",
  description,
  alternates: { canonical: "/" },
};

/*
 * Entity graph for crawlers and agents: the organisation and the site it
 * runs, both under the canonical URL so "Hacker Bloc" resolves to this domain.
 */
const organizationJsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": `${SITE.url}/#organization`,
      name: "Hacker Bloc",
      alternateName: ["HACKER BLOC", "hackerbloc.com"],
      url: SITE.url,
      description,
      email: SITE.email,
      address: {
        "@type": "PostalAddress",
        ...SITE.postal,
      },
      sameAs: [...SOCIALS.map((social) => social.url), "https://hacklab.so"],
    },
    {
      "@type": "WebSite",
      "@id": `${SITE.url}/#website`,
      name: "Hacker Bloc",
      alternateName: "HACKER BLOC",
      url: SITE.url,
      inLanguage: "en",
      publisher: { "@id": `${SITE.url}/#organization` },
    },
  ],
};

export default async function Home() {
  await connection();
  const patronEnabled = patronCheckoutEnabled();
  const { people, upcoming, signals } = await getHomeData();
  const nextEvents = upcoming.slice(0, 2);
  const nextWhen = signals.event ? formatEventDate(signals.event) : null;
  const hasSignals =
    signals.inSpace !== null || signals.people !== null || signals.roadmap !== null || signals.event !== null;
  const faces = people.filter((p) => p.github).slice(0, 24);

  return (
    <main id="top" className="terminal-page">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(organizationJsonLd).replace(/</g, "\\u003c"),
        }}
      />
      <section className="terminal-intro" aria-labelledby="home-heading">
        <p className="terminal-location">
          {SITE.city} / {SITE.district} /{" "}
          <a href={SITE.mapsUrl} className="underline underline-offset-4">
            {SITE.postal.streetAddress}
          </a>
        </p>
        <h1 id="home-heading">We have Palo Alto at home</h1>
        <p className="terminal-tagline">
          A hackerspace in a house in Warsaw, run by the founders who live in it.
        </p>
        <h2 className="sr-only">What we are building</h2>
        <p>
          We want the kind of space we saw in Silicon Valley: a house where startup founders meet, build, start
          their first Delaware C-corp, get their first check, find cofounders,
          and build billion-dollar companies.
        </p>
        <p>
          We are not community builders. We are founders. We rented this house
          to build the next billion-dollar company,{" "}
          <a href="https://hacklab.so" className="underline underline-offset-4">hacklab.so</a>,
          and we live and work here 24/7. We&apos;re pre-seed, pre-revenue,{" "}
          <a href="https://www.youtube.com/shorts/n5dAIvH2cQw" className="underline underline-offset-4">pure potential</a>,
          so we figured a hackerspace would help us not die in the initial grind.
        </p>
        <p>{EXPERIMENT_NOTE}</p>
      </section>



      {hasSignals ? (
        <section id="now" className="terminal-section" aria-labelledby="now-heading">
          <h2 id="now-heading" className="terminal-legend">Right now in the space</h2>
          <div className="terminal-section-content">
            <ul className="terminal-signals" aria-label="Live numbers">
              {signals.inSpace ? (
                <li>
                  <strong>{signals.inSpace.people ?? signals.inSpace.devices}</strong>
                  <span>
                    {signals.inSpace.people !== null
                      ? `${signals.inSpace.people === 1 ? "person" : "people"} in the space`
                      : `${signals.inSpace.devices === 1 ? "device" : "devices"} on the house Wi‑Fi`}
                    {signals.inSpace.github.length > 0 ? `: ${signals.inSpace.github.join(", ")}` : ""}
                  </span>
                </li>
              ) : null}
              {signals.people !== null ? (
                <li>
                  <strong>{signals.people}</strong>
                  <span>{signals.people === 1 ? "person" : "people"} on <Link href="/members">the list</Link></span>
                </li>
              ) : null}
              {signals.roadmap ? (
                <li>
                  <strong>{signals.roadmap.claimed} / {signals.roadmap.next}</strong>
                  <span>members to <Link href="/roadmap">Hacker Bloc {signals.roadmap.version}</Link></span>
                </li>
              ) : null}
              {signals.event && nextWhen ? (
                <li>
                  <strong>{nextWhen.label.slice(0, 6)}</strong>
                  <span>next: <a href={signals.event.url}>{signals.event.name}</a></span>
                </li>
              ) : null}
            </ul>
          </div>
        </section>
      ) : null}

      <section id="member" className="terminal-section" aria-labelledby="member-heading">
        <h2 id="member-heading" className="terminal-legend">What you get</h2>
        <div className="terminal-section-content">
          <h3 className="sr-only">Member benefits</h3>
          <ul className="terminal-perks" aria-label="Member benefits">
            {MEMBERSHIP.benefits.map((benefit) => (
              <li key={benefit.title}>
                <span aria-hidden="true">[+]</span>
                <span>{benefit.description}</span>
              </li>
            ))}
          </ul>
          <p className="terminal-price">
            <strong>{formatUsd(MEMBERSHIP.monthlyUsd)}</strong> USD / month
          </p>
          <p className="terminal-signup">
            + {formatUsd(MEMBERSHIP.signupUsd)} USD one-time signup fee. First {MEMBERSHIP.limit} members.
          </p>
          <div className="terminal-checkout">
            <Link href={SIGNUP_FOR_MEMBERSHIP} className="terminal-button">
              Create an account <span aria-hidden="true">↗</span>
            </Link>
            <p className="terminal-muted">
              An account is free and puts you on the list. Paying comes after, on the{" "}
              <Link href="/membership#member" className="underline underline-offset-4">membership page</Link>.{" "}
              <Link href="/membership#risk" className="underline underline-offset-4">Risk note →</Link>{" "}
              <Link href="/terms" className="underline underline-offset-4">Terms →</Link>
            </p>
          </div>
          <FeeNote />
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
