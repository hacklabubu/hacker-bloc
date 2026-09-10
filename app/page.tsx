import type { Metadata } from "next";
import Link from "next/link";
import { connection } from "next/server";
import { TerminalWordmark } from "@/components/site/terminal-art";
import { MEMBERSHIP, formatUsd } from "@/lib/membership";
import { SITE, SOCIALS } from "@/lib/site";
import { getWordmarks } from "@/lib/wordmarks";

const description = "A hackerspace in Warsaw, built by the people who use it. Find events, become a founding member, or help build the space.";

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

const PAGES = [
  {
    href: "/events",
    title: "Events",
    description: "Meet the people building here.",
  },
  {
    href: "/membership",
    title: "Membership",
    description: `${formatUsd(MEMBERSHIP.monthlyUsd)} USD/month + ${formatUsd(MEMBERSHIP.signupUsd)} signup. First ${MEMBERSHIP.limit} members.`,
  },
  {
    href: "/support",
    title: "Support the Bloc",
    description: `${formatUsd(MEMBERSHIP.spaceGoalUsd)} gets Space 1.0 off the ground.`,
  },
] as const;

export default async function Home() {
  // Read the collection on refresh so new artwork can be tried without a rebuild.
  await connection();
  const wordmarks = getWordmarks();

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
        <p className="terminal-location">A space for people who build the future.</p>
        <h1 id="home-heading"></h1>
        <p>
          We&apos;re bringing together the first {MEMBERSHIP.limit} members to get
          our hackerspace off the ground. A place to work, meet, make things,
          and shape what comes next. Help build it with us.
        </p>
      </section>
    </main>
  );
}
