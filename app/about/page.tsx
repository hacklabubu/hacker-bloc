import type { Metadata } from "next";
import Link from "next/link";
import { SectionHeading } from "@/components/site/section-heading";
import { FUNDING, LUMA, SITE, formatEurPlain } from "@/lib/site";

export const metadata: Metadata = {
  title: "About",
  description:
    "What Hacker Bloc is: a hacker house at Kosiarzy 21B in Warsaw where founders live, build Hacklab, run hardware in the dungeons, and host meetups and hackathons.",
};

export default function AboutPage() {
  return (
    <main className="flex-1">
      <section className="mx-auto w-full max-w-6xl px-4 py-20 sm:py-28">
        <h1 className="font-heading text-4xl leading-tight uppercase text-beige sm:text-5xl md:text-6xl">
          About
        </h1>
        <p className="mt-8 max-w-3xl text-lg leading-8 text-concrete sm:text-xl sm:leading-9">
          Warsaw has the talent. It never had the room. Hacker Bloc is the
          room — a house at{" "}
          <a
            href={SITE.mapsUrl}
            target="_blank"
            rel="noreferrer"
            className="text-beige underline underline-offset-4 hover:text-signal"
          >
            {SITE.address}
          </a>{" "}
          where people live where they build, instead of commuting to a desk
          they rent.
        </p>

        <section className="mt-16 sm:mt-20">
          <SectionHeading>The house</SectionHeading>
          <div className="max-w-3xl space-y-6 text-base leading-8 text-concrete sm:text-lg sm:leading-9">
            <p>
              Floors 0–2 are where we live and work:{" "}
              <a
                href="https://hacklab.so"
                target="_blank"
                rel="noreferrer"
                className="text-signal underline underline-offset-4 hover:text-beige"
              >
                Hacklab
              </a>{" "}
              gets built here every day, alongside{" "}
              <a
                href="https://epikor.eu"
                target="_blank"
                rel="noreferrer"
                className="text-signal underline underline-offset-4 hover:text-beige"
              >
                Epikor
              </a>
              . Dorms for founders crashing through a build, a studio floor of
              desks and cameras, an office floor that turns into an event hall,
              and a garden that runs on grill smoke and whiteboards.
            </p>
            <p>
              Floor −1 is the dungeons: a hardware lab below street level, run
              with Epicor. Solder, CNC, GPUs, bench space. It is the reason a
              hardware hackathon here is a real thing rather than a slide.
            </p>
            <p>
              We are not coworking. We are not an incubator. We are not a party
              flat and not a theoretical nonprofit. We put our own money,
              weekends, and power tools into this building, and it shows in
              every unfinished wall.
            </p>
          </div>
        </section>

        <section className="mt-16 sm:mt-20">
          <SectionHeading>What happens here</SectionHeading>
          <div className="max-w-3xl space-y-6 text-base leading-8 text-concrete sm:text-lg sm:leading-9">
            <p>
              Weekly meetups, demo nights, workshops, and hackathons — Warsaw
              founders come to prototype, ship an MVP, find first users, and get
              feedback from people who have already shipped. The upcoming and
              past events are listed on{" "}
              <a
                href={LUMA.calendarUrl}
                target="_blank"
                rel="noreferrer"
                className="text-signal underline underline-offset-4 hover:text-beige"
              >
                our public calendar
              </a>
              .
            </p>
            <p>
              Nobody rents a desk. You earn a spot by building things that work.
              The community is a ladder rather than a membership list: everyone
              around the bloc sits somewhere on it, and where you stand decides
              what you get a say in. The rungs and the responsibilities attached
              to them are written down on{" "}
              <Link
                href="/rules"
                className="text-signal underline underline-offset-4 hover:text-beige"
              >
                the rules page
              </Link>
              , and the people are on{" "}
              <Link
                href="/community"
                className="text-signal underline underline-offset-4 hover:text-beige"
              >
                the community page
              </Link>
              .
            </p>
          </div>
        </section>

        <section className="mt-16 sm:mt-20">
          <SectionHeading>Who runs it</SectionHeading>
          <div className="max-w-3xl space-y-6 text-base leading-8 text-concrete sm:text-lg sm:leading-9">
            <p>
              A 100% private initiative by the founders of Hacklab and the
              founder of Epicor. No grant office, no city programme, no
              landlord-with-a-vision. Epikor is the operating partner and runs
              the dungeons; the residents run the house. Everything is skin in
              the game — sponsors power it, residents keep it standing.
            </p>
            <p>
              Eastern Bloc roots, Silicon Valley ambition: a concrete block in
              Wilanów Niski, run with the expectation that what leaves it
              competes globally. That is the whole thesis, and it is why the
              building matters.
            </p>
            <p>
              We moved in on July 1st and the landlord wants to sell. Keeping
              the house means raising €{formatEurPlain(FUNDING.totalEur)} — €
              {formatEurPlain(FUNDING.buildingEur)} to buy Kosiarzy 21B and €
              {formatEurPlain(FUNDING.setupEur)} to renovate and stand it up.
              The numbers, the lanes, and what a sponsor actually gets are on{" "}
              <Link
                href="/sponsor"
                className="text-signal underline underline-offset-4 hover:text-beige"
              >
                the sponsor page
              </Link>
              .
            </p>
          </div>
        </section>

        <p className="mt-16 text-sm text-concrete">
          <Link
            href="/join"
            className="text-beige underline underline-offset-4 hover:text-signal"
          >
            Apply to the house
          </Link>{" "}
          ·{" "}
          <Link
            href="/contact"
            className="text-beige underline underline-offset-4 hover:text-signal"
          >
            Talk to us
          </Link>
        </p>
      </section>
    </main>
  );
}
