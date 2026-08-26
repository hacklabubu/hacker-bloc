import type { Metadata } from "next";
import Link from "next/link";
import { SectionHeading } from "@/components/site/section-heading";
import { SITE, SOCIALS } from "@/lib/site";

export const metadata: Metadata = {
  title: "Contact",
  description: `Reach Hacker Bloc — ${SITE.email}, ${SITE.address}, or book a call. Applications go through the join form.`,
};

const REASONS = [
  {
    title: "Events",
    body: "Hosting, speaking, co-running a hackathon, or bringing a group through the dungeons.",
  },
  {
    title: "Joining",
    body: "Questions before you apply. The application itself goes through the join form, not the inbox.",
  },
  {
    title: "Sponsoring",
    body: "Money, machines, or shop time toward buying the building. Read the sponsor page first, then write.",
  },
  {
    title: "Press",
    body: "Interviews, filming in the house, photos. Tell us what you need and when.",
  },
] as const;

export default function ContactPage() {
  return (
    <main className="flex-1">
      <section className="mx-auto w-full max-w-6xl px-4 py-20 sm:py-28">
        <h1 className="font-heading text-4xl leading-tight uppercase text-beige sm:text-5xl md:text-6xl">
          Contact
        </h1>
        <p className="mt-8 max-w-2xl text-lg leading-8 text-concrete sm:text-xl sm:leading-9">
          One inbox, one address, one calendar. We read everything and answer
          the things worth answering.
        </p>

        <section className="mt-16 sm:mt-20">
          <SectionHeading>Direct</SectionHeading>
          <dl className="max-w-3xl border-t border-border">
            <div className="flex flex-col gap-2 border-b border-border py-6 sm:flex-row sm:gap-8">
              <dt className="w-40 shrink-0 pt-1 text-xs tracking-[0.25em] text-steel uppercase">
                Email
              </dt>
              <dd className="text-lg leading-8 text-beige sm:text-xl">
                <a
                  href={`mailto:${SITE.email}`}
                  className="underline underline-offset-4 hover:text-signal"
                >
                  {SITE.email}
                </a>
              </dd>
            </div>
            <div className="flex flex-col gap-2 border-b border-border py-6 sm:flex-row sm:gap-8">
              <dt className="w-40 shrink-0 pt-1 text-xs tracking-[0.25em] text-steel uppercase">
                Sponsorship
              </dt>
              <dd className="text-lg leading-8 text-beige sm:text-xl">
                <a
                  href={`mailto:${SITE.sponsorEmail}`}
                  className="underline underline-offset-4 hover:text-signal"
                >
                  {SITE.sponsorEmail}
                </a>
              </dd>
            </div>
            <div className="flex flex-col gap-2 border-b border-border py-6 sm:flex-row sm:gap-8">
              <dt className="w-40 shrink-0 pt-1 text-xs tracking-[0.25em] text-steel uppercase">
                The house
              </dt>
              <dd className="text-lg leading-8 text-beige sm:text-xl">
                <a
                  href={SITE.mapsUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="underline underline-offset-4 hover:text-signal"
                >
                  {SITE.address}
                </a>
                <span className="mt-1 block text-sm text-concrete">
                  {SITE.district}
                  {" — "}
                  don&apos;t just show up, write first.
                </span>
              </dd>
            </div>
            <div className="flex flex-col gap-2 border-b border-border py-6 sm:flex-row sm:gap-8">
              <dt className="w-40 shrink-0 pt-1 text-xs tracking-[0.25em] text-steel uppercase">
                Book a call
              </dt>
              <dd className="text-lg leading-8 text-beige sm:text-xl">
                <a
                  href={SITE.calendlyUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="underline underline-offset-4 hover:text-signal"
                >
                  30 minutes, straight in the calendar
                </a>
              </dd>
            </div>
          </dl>
        </section>

        <section className="mt-16 sm:mt-20">
          <SectionHeading>What to write about</SectionHeading>
          <ul className="max-w-3xl border-t border-border">
            {REASONS.map((reason) => (
              <li
                key={reason.title}
                className="flex flex-col gap-2 border-b border-border py-6 sm:flex-row sm:gap-8"
              >
                <span className="w-40 shrink-0 pt-1 text-xs tracking-[0.25em] text-signal uppercase">
                  {reason.title}
                </span>
                <span className="text-base leading-8 text-concrete sm:text-lg sm:leading-9">
                  {reason.body}
                </span>
              </li>
            ))}
          </ul>
          <p className="mt-8 max-w-3xl text-base leading-8 text-concrete sm:text-lg sm:leading-9">
            Applying to the house? Don&apos;t email — fill in{" "}
            <Link
              href="/join"
              className="text-signal underline underline-offset-4 hover:text-beige"
            >
              the join form
            </Link>
            . It lands in the CRM where we actually review applications, and an
            email lands in a pile where we might not.
          </p>
        </section>

        <section className="mt-16 sm:mt-20">
          <SectionHeading>Elsewhere</SectionHeading>
          <ul className="flex flex-wrap gap-x-8 gap-y-3 text-sm tracking-[0.2em] text-concrete uppercase">
            {SOCIALS.map((social) => (
              <li key={social.label}>
                <a
                  href={social.url}
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-signal"
                >
                  {social.label.startsWith("YT") ? "YouTube" : social.label}
                  <span className="ml-2 text-steel normal-case">
                    {social.handle}
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </section>
      </section>
    </main>
  );
}
