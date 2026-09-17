import type { Metadata } from "next";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "Privacy",
  description:
    "What Hacker Bloc collects when you contact us or pay, where it is stored, how long we keep it, and how to get it deleted.",
};

/* Mirrored in lib/markdown.ts (privacyMarkdown); change both. */
const SECTIONS: { heading: string; paragraphs: React.ReactNode[] }[] = [
  {
    heading: "What we collect",
    paragraphs: [
      <>
        The former join form asked for: what you were applying
        as (founder, investor, media, content, factory, or partner), your name,
        your Hacklab profile, how you can be useful, how you heard about us, what
        excites you most, and a confirmation that you&apos;ve read the house
        rules. That is the whole form. There are no hidden fields, and nothing
        else about you is captured when you submit it.
      </>,
      "If you email us or book a call instead, we obviously end up with whatever you put in that email or booking. Same rules apply.",
    ],
  },
  {
    heading: "Where it goes",
    paragraphs: [
      "Submissions are written to our Notion workspace, which is the CRM we review applications in, and mirrored into a Neon Postgres database as a backup so a Notion outage can’t lose your application. The site itself runs on Vercel, so requests pass through Vercel’s infrastructure on the way there. All three act as processors on our instructions, and all three are US providers — the backup database currently runs in a US region — so your data is transferred outside the EEA under their standard contractual clauses.",
      "Access is limited to the people in the house who review applications. We do not sell your data, we do not rent it, and we do not hand it to sponsors, partners, or anyone else for their own marketing.",
    ],
  },
  {
    heading: "Payments",
    paragraphs: [
      <>
        If you become a member or a patron, the checkout is hosted by Stripe.
        Stripe collects your name, email, billing address, and card details; the
        card number never reaches us. Stripe is an independent controller for the
        payment itself, under{" "}
        <a href="https://stripe.com/privacy">its own privacy policy</a>. What we
        receive from Stripe, and keep in the Neon Postgres database, is your
        name, email, Stripe customer and subscription ids, subscription status,
        and a record of each invoice paid (amount, currency, date). We use it to
        know who is a member, to let you in, and to keep the books.
      </>,
      "The legal basis is performance of the membership contract, and for the payment records our legal obligation to keep accounting documents. Payment records are kept for five years after the end of the tax year in which the payment was made, as Polish tax law requires, even if you ask us to delete the rest.",
    ],
  },
  {
    heading: "Why we’re allowed to",
    paragraphs: [
      "You asked us to consider you. Under the GDPR, that’s our legitimate interest in reviewing an application you sent us and contacting you about it — nothing more. We do not use the form to build a mailing list, and we won’t send you unrelated broadcasts.",
      "Applicants are never published.",
    ],
  },
  {
    heading: "Tracking",
    paragraphs: [
      "There is no analytics on this site. No Google Analytics, no Plausible, no PostHog, no pixels, no advertising tags, and no cookie banner, because we don’t set cookies to track you. Fonts and event images are served from our own domain rather than fetched from someone else’s, so loading a page here doesn’t announce you to a third party. Links you click through to — the event calendar, the booking link, our social profiles — run under their own privacy policies, not ours.",
      "Our hosting provider keeps standard server logs (IP address, page requested, timestamp) for operational and security reasons, the way every web server does.",
    ],
  },
  {
    heading: "How long we keep it",
    paragraphs: [
      "Until you ask us to delete it. Applications stay in the CRM because the house is a long game — someone who was too early in spring is often exactly right by autumn, and we’d rather re-read your application than make you rewrite it. If you’d rather not be on that list, say so and you’re off it.",
    ],
  },
  {
    heading: "Your rights",
    paragraphs: [
      <>
        You can ask for a copy of what we hold on you, ask us to correct it, ask
        us to delete it, or object to us holding it at all. Email{" "}
        <a href={`mailto:${SITE.email}`}>{SITE.email}</a> from the address you
        applied with — or tell us which address to look for — and we&apos;ll
        handle it, from both Notion and the Postgres backup, within 30 days. No
        form, no fee, no argument.
      </>,
      "If we get it wrong, you can complain to your local data protection authority; in Poland that is the President of the Personal Data Protection Office (UODO). We’d rather you told us first.",
      <span key="q" className="terminal-muted">
        Questions about any of this go to the same address as everything else:{" "}
        <a href={`mailto:${SITE.email}`}>{SITE.email}</a>.
      </span>,
    ],
  },
];

export default function PrivacyPage() {
  return (
    <main id="top" className="terminal-page">
      <section className="terminal-intro" aria-labelledby="privacy-heading">
        <p className="terminal-location">Privacy</p>
        <h1 id="privacy-heading">Privacy</h1>
        <p>
          Short version: we keep information previously submitted through the
          former join form and, if you pay, what Stripe needs to take the
          payment. We use it to handle past applications, to write back, and to
          run your membership. We don&apos;t sell it, we don&apos;t track you around
          the web, and you can have it deleted by asking.
        </p>
      </section>

      {SECTIONS.map((section) => (
        <section key={section.heading} className="terminal-section" aria-label={section.heading}>
          <h2 className="terminal-legend">{section.heading}</h2>
          <div className="terminal-section-content terminal-prose">
            {section.paragraphs.map((paragraph, i) => (
              <p key={i}>{paragraph}</p>
            ))}
          </div>
        </section>
      ))}
    </main>
  );
}
