import type { Metadata } from "next";
import Link from "next/link";
import { SectionHeading } from "@/components/site/section-heading";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "Privacy",
  description:
    "What Hacker Bloc collects when you apply, where it is stored, how long we keep it, and how to get it deleted.",
};

export default function PrivacyPage() {
  return (
    <main className="flex-1">
      <section className="mx-auto w-full max-w-6xl px-4 py-20 sm:py-28">
        <h1 className="font-heading text-4xl leading-tight uppercase text-beige sm:text-5xl md:text-6xl">
          Privacy
        </h1>
        <p className="mt-8 max-w-3xl text-lg leading-8 text-concrete sm:text-xl sm:leading-9">
          Short version: the only personal data we collect is what you type into
          the join form. We use it to read your application and to write back.
          We don&apos;t sell it, we don&apos;t track you around the web, and you
          can have it deleted by asking.
        </p>

        <section className="mt-16 sm:mt-20">
          <SectionHeading>What we collect</SectionHeading>
          <div className="max-w-3xl space-y-6 text-base leading-8 text-concrete sm:text-lg sm:leading-9">
            <p>
              The{" "}
              <Link
                href="/join"
                className="text-signal underline underline-offset-4 hover:text-beige"
              >
                join form
              </Link>{" "}
              asks for four things plus a category: your name, your email
              address, what you&apos;re building, and any links you want to show
              us (site, GitHub, X, whatever proves the point), along with
              whether you&apos;re applying as a founder, investor, media,
              factory, or partner. That is the whole form. There are no hidden
              fields, and nothing else about you is captured when you submit it.
            </p>
            <p>
              If you email us or book a call instead, we obviously end up with
              whatever you put in that email or booking. Same rules apply.
            </p>
          </div>
        </section>

        <section className="mt-16 sm:mt-20">
          <SectionHeading>Where it goes</SectionHeading>
          <div className="max-w-3xl space-y-6 text-base leading-8 text-concrete sm:text-lg sm:leading-9">
            <p>
              Submissions are written to our Notion workspace, which is the CRM
              we review applications in, and mirrored into a Neon Postgres
              database as a backup so a Notion outage can&apos;t lose your
              application. The site itself runs on Vercel, so requests pass
              through Vercel&apos;s infrastructure on the way there. All three
              act as processors on our instructions, and all three are US
              providers — the backup database currently runs in a US region — so
              your data is transferred outside the EEA under their standard
              contractual clauses.
            </p>
            <p>
              Access is limited to the people in the house who review
              applications. We do not sell your data, we do not rent it, and we
              do not hand it to sponsors, partners, or anyone else for their own
              marketing.
            </p>
          </div>
        </section>

        <section className="mt-16 sm:mt-20">
          <SectionHeading>Why we&apos;re allowed to</SectionHeading>
          <div className="max-w-3xl space-y-6 text-base leading-8 text-concrete sm:text-lg sm:leading-9">
            <p>
              You asked us to consider you. Under the GDPR, that&apos;s our
              legitimate interest in reviewing an application you sent us and
              contacting you about it — nothing more. We do not use the form to
              build a mailing list, and we won&apos;t send you unrelated
              broadcasts.
            </p>
            <p>
              Members shown on the{" "}
              <Link
                href="/community"
                className="text-signal underline underline-offset-4 hover:text-beige"
              >
                community page
              </Link>{" "}
              are people who are part of the house and whose profile we publish
              with their agreement. Applicants are never published.
            </p>
          </div>
        </section>

        <section className="mt-16 sm:mt-20">
          <SectionHeading>Tracking</SectionHeading>
          <div className="max-w-3xl space-y-6 text-base leading-8 text-concrete sm:text-lg sm:leading-9">
            <p>
              There is no analytics on this site. No Google Analytics, no
              Plausible, no PostHog, no pixels, no advertising tags, and no
              cookie banner, because we don&apos;t set cookies to track you.
              Fonts and event images are served from our own domain rather than
              fetched from someone else&apos;s, so loading a page here
              doesn&apos;t announce you to a third party. Links you click
              through to — the event calendar, the booking link, our social
              profiles — run under their own privacy policies, not ours.
            </p>
            <p>
              Our hosting provider keeps standard server logs (IP address, page
              requested, timestamp) for operational and security reasons, the
              way every web server does.
            </p>
          </div>
        </section>

        <section className="mt-16 sm:mt-20">
          <SectionHeading>How long we keep it</SectionHeading>
          <div className="max-w-3xl space-y-6 text-base leading-8 text-concrete sm:text-lg sm:leading-9">
            <p>
              Until you ask us to delete it. Applications stay in the CRM
              because the house is a long game — someone who was too early in
              spring is often exactly right by autumn, and we&apos;d rather
              re-read your application than make you rewrite it. If you&apos;d
              rather not be on that list, say so and you&apos;re off it.
            </p>
          </div>
        </section>

        <section className="mt-16 sm:mt-20">
          <SectionHeading>Your rights</SectionHeading>
          <div className="max-w-3xl space-y-6 text-base leading-8 text-concrete sm:text-lg sm:leading-9">
            <p>
              You can ask for a copy of what we hold on you, ask us to correct
              it, ask us to delete it, or object to us holding it at all. Email{" "}
              <a
                href={`mailto:${SITE.email}`}
                className="text-signal underline underline-offset-4 hover:text-beige"
              >
                {SITE.email}
              </a>{" "}
              from the address you applied with — or tell us which address to
              look for — and we&apos;ll handle it, from both Notion and the
              Postgres backup, within 30 days. No form, no fee, no argument.
            </p>
            <p>
              If we get it wrong, you can complain to your local data protection
              authority; in Poland that is the President of the Personal Data
              Protection Office (UODO). We&apos;d rather you told us first.
            </p>
            <p className="text-sm text-steel">
              Questions about any of this go to the same address as everything
              else:{" "}
              <Link
                href="/contact"
                className="underline underline-offset-4 hover:text-signal"
              >
                contact
              </Link>
              .
            </p>
          </div>
        </section>
      </section>
    </main>
  );
}
