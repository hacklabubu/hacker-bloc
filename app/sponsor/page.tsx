import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { EventCard } from "@/components/site/event-card";
import { PhotoSlot } from "@/components/site/photo-slot";
import { getUpcomingEvents } from "@/lib/luma";
import { FUNDING, SITE, formatEur, formatEurPlain } from "@/lib/site";

export const metadata: Metadata = {
  title: "Sponsor",
  description: `${formatEur(FUNDING.totalEur)} to buy Kosiarzy 21B and stand up Hacker Bloc. ${formatEur(FUNDING.buildingEur)} for the building, ${formatEur(FUNDING.setupEur)} to renovate and kit the floors.`,
};

const OBJECTS = [
  {
    tag: formatEur(FUNDING.buildingEur),
    title: "The building",
    body: "Buy Kosiarzy 21B. The deed, the ground, the rooms the house already lives in. Without this there is no Bloc.",
    label: "Garden // the plot",
    file: "photos/stack-garden.jpg",
    src: "/photos/stack-garden-before.webp",
    ratio: "16/10",
  },
  {
    tag: "Setup",
    title: "Dungeons",
    body: "Wire the basement. Benches, machines, power. Epicor already runs the shop — this money makes it a lab, not a dark room.",
    label: "Floor −1 // dungeons",
    file: "photos/stack-dungeons.jpg",
    src: "/photos/stack-dungeons-before.webp",
    ratio: "16/10",
  },
  {
    tag: "Setup",
    title: "Live floors",
    body: "Beds, the event hall, the garden kitchen. Renovation and setup so founders can sleep, demo, and eat where they build.",
    label: "Office // the room",
    file: "photos/stack-commons.jpg",
    src: "/photos/stack-office-before.webp",
    ratio: "16/10",
  },
] as const;

const LANES = [
  {
    id: "01",
    title: "Patron",
    give: "Money",
    get: "Name on the wall. First dinners. A floor that exists because you wrote the cheque.",
  },
  {
    id: "02",
    title: "Factory",
    give: "Machines, parts, shop time",
    get: "Your bench in the dungeon. Workshop nights. Hiring access to people who already solder.",
  },
  {
    id: "03",
    title: "Investor",
    give: "Time and capital",
    get: "Demo nights, founder dinners, intros — before a deck exists. Sit in the room, not the inbox.",
  },
] as const;

const NO_LIST = [
  "We are not coworking.",
  "We are not an incubator.",
  "We are not a lobby billboard.",
  "You do not buy the right to turn this into WeWork with stickers.",
] as const;

const ALREADY_IN = [
  {
    href: "https://hacklab.so",
    src: "/logos/hacklab.png",
    alt: "Hacklab",
    name: "Hacklab",
    role: "founders",
    wide: true,
  },
  {
    href: "https://epikor.eu",
    src: "/logos/epicor.svg",
    alt: "Epicor",
    name: "Epicor",
    role: "dungeons",
    wide: false,
  },
] as const;

export default async function SponsorPage() {
  const upcoming = (await getUpcomingEvents()).slice(0, 3);
  const mailHref = `mailto:${SITE.sponsorEmail}?subject=${encodeURIComponent("Sponsor — keep Kosiarzy 21B")}`;

  return (
    <main className="flex-1">
      {/* ── ASK ─────────────────────────────────────────── */}
      <section className="border-b border-border">
        <div className="mx-auto grid w-full max-w-6xl items-start gap-10 px-4 py-16 sm:py-24 md:grid-cols-[1.1fr_0.9fr] md:gap-12">
          <div>
            <p className="text-xs font-bold tracking-[0.3em] text-signal uppercase">
              Keep the house
            </p>
            <h1 className="mt-4 font-heading text-[clamp(3.25rem,11vw,8rem)] leading-[0.85] uppercase text-beige">
              <span className="block text-signal">€</span>
              {formatEurPlain(FUNDING.totalEur)}
            </h1>
            <div className="mt-10 flex flex-wrap gap-4">
              <a
                href={SITE.calendlyUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex h-14 w-full items-center justify-center bg-signal px-10 text-base font-bold tracking-[0.2em] text-on-signal uppercase transition-colors hover:bg-signal/80 sm:w-auto sm:text-lg"
              >
                Book 30 min
              </a>
              <a
                href={mailHref}
                className="inline-flex h-14 w-full items-center justify-center border border-beige/50 bg-beige/5 px-10 text-base tracking-[0.2em] text-beige uppercase transition-colors hover:border-beige hover:bg-beige/10 sm:w-auto sm:text-lg"
              >
                Email
              </a>
            </div>
            <p className="mt-6 text-xs tracking-[0.2em] text-steel uppercase">
              Moved in 1 July 2026
              <span className="text-border"> · </span>
              {SITE.district}
              <span className="text-border"> · </span>
              {SITE.city}
            </p>
          </div>
          <PhotoSlot
            label="The yard // Kosiarzy 21B"
            file="photos/stack-garden.jpg"
            src="/photos/stack-garden-before.webp"
            ratio="4/3"
            priority
            className="w-full"
          />
        </div>
        <div className="mx-auto w-full max-w-6xl space-y-6 px-4 pb-16 sm:pb-24">
          <p className="max-w-3xl text-lg leading-8 text-concrete sm:text-xl sm:leading-9">
            We rented a hacker house to build{" "}
            <a
              href="https://hacklab.so"
              target="_blank"
              rel="noreferrer"
              className="text-beige underline underline-offset-4 hover:text-signal"
            >
              hacklab.so
            </a>{" "}
            from it. During this process we built an incredible community and
            realized this is exactly what the next generation of founders
            need. A place where 24/7 founders live, build and talk about
            startups.
          </p>
          <p className="max-w-3xl text-lg leading-8 text-concrete sm:text-xl sm:leading-9">
            We are already helping founders in the earliest stages, explaining
            SAFEs, fundraising, helping with tech and prototypes, connecting
            with VCs, finding first customers, cofounders and investors.
          </p>
          <p className="max-w-3xl text-lg leading-8 text-concrete sm:text-xl sm:leading-9">
            This isn&apos;t a rational investment in real estate. With current
            rent, which is the max what we can afford, your ROI will be ~2.5%.
            This is an investment that really can help young founders with
            doing their first steps and coming from 0 to 1. The earliest,
            dirtiest and hardest founder days will be happening here.
          </p>
          <p className="max-w-3xl text-lg leading-8 text-concrete sm:text-xl sm:leading-9">
            We just ask you to buy this house and let us live here for some
            more years before Hacklab will be able to buy back the property
            from you.
          </p>
        </div>
      </section>

      {/* ── SPLIT ───────────────────────────────────────── */}
      <section className="border-b border-border">
        <div className="mx-auto grid w-full max-w-6xl gap-px bg-border sm:grid-cols-2">
          <div className="bg-charcoal px-4 py-12 sm:px-8 sm:py-16">
            <p className="font-heading text-[clamp(2.5rem,7vw,4.5rem)] leading-none text-beige">
              {formatEur(FUNDING.buildingEur)}
            </p>
            <p className="mt-4 text-xs font-bold tracking-[0.3em] text-signal uppercase">
              The building
            </p>
            <p className="mt-4 max-w-md text-base leading-7 text-concrete">
              Buy the house. {formatEur(FUNDING.buildingEur)} for Kosiarzy 21B
              so Warsaw keeps a building where founders live and ship.
            </p>
          </div>
          <div className="bg-charcoal px-4 py-12 sm:px-8 sm:py-16">
            <p className="font-heading text-[clamp(2.5rem,7vw,4.5rem)] leading-none text-beige">
              {formatEur(FUNDING.setupEur)}
            </p>
            <p className="mt-4 text-xs font-bold tracking-[0.3em] text-signal uppercase">
              Renovation + setup
            </p>
            <p className="mt-4 max-w-md text-base leading-7 text-concrete">
              Stand it up. Floors, power, dungeons, beds, the room that holds
              a hundred people. The house works. It is not finished.
            </p>
          </div>
        </div>
      </section>

      {/* ── WHAT THE MONEY BUYS ─────────────────────────── */}
      <section className="border-b border-border">
        <div className="mx-auto w-full max-w-6xl px-4 py-20 sm:py-24">
          <h2 className="font-heading text-4xl leading-tight uppercase text-beige sm:text-5xl md:text-6xl">
            What the money buys
          </h2>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-concrete sm:text-xl sm:leading-9">
            Objects you can point at. Not vibes.
          </p>
          <div className="mt-12 grid gap-8 md:grid-cols-3">
            {OBJECTS.map((item) => (
              <article key={item.title} className="flex flex-col">
                <PhotoSlot
                  label={item.label}
                  file={item.file}
                  src={item.src}
                  ratio={item.ratio}
                />
                <p className="mt-5 text-xs font-bold tracking-[0.3em] text-signal uppercase">
                  {item.tag}
                </p>
                <h3 className="mt-2 text-sm font-bold tracking-widest text-beige uppercase">
                  {item.title}
                </h3>
                <p className="mt-3 text-sm leading-7 text-concrete">{item.body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ── THREE WAYS IN ───────────────────────────────── */}
      <section className="border-b border-border">
        <div className="mx-auto w-full max-w-6xl px-4 py-20 sm:py-24">
          <h2 className="font-heading text-4xl leading-tight uppercase text-beige sm:text-5xl md:text-6xl">
            Three ways in
          </h2>
          <ul className="mt-12 grid gap-px bg-border sm:grid-cols-3">
            {LANES.map((lane) => (
              <li key={lane.id} className="bg-charcoal px-6 py-10 sm:px-8">
                <p className="text-[10px] tracking-[0.3em] text-steel uppercase">
                  {lane.id}
                </p>
                <h3 className="mt-4 text-sm font-bold tracking-widest text-beige uppercase">
                  {lane.title}
                </h3>
                <p className="mt-4 text-xs tracking-[0.2em] text-signal uppercase">
                  Gives {lane.give}
                </p>
                <p className="mt-4 text-sm leading-7 text-concrete">{lane.get}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ── NO LIST ─────────────────────────────────────── */}
      <section className="border-b border-border">
        <div className="mx-auto w-full max-w-6xl px-4 py-20 sm:py-24">
          <h2 className="font-heading text-4xl leading-tight uppercase text-beige sm:text-5xl md:text-6xl">
            What you do not buy
          </h2>
          <ul className="mt-10 max-w-2xl space-y-4">
            {NO_LIST.map((line) => (
              <li
                key={line}
                className="text-lg leading-8 text-concrete sm:text-xl sm:leading-9"
              >
                <span className="text-signal">{">"}</span> {line}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ── ALREADY IN ──────────────────────────────────── */}
      <section className="border-b border-border">
        <div className="mx-auto w-full max-w-6xl px-4 py-20 sm:py-24">
          <h2 className="font-heading text-4xl leading-tight uppercase text-beige sm:text-5xl md:text-6xl">
            Already in
          </h2>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-concrete sm:text-xl sm:leading-9">
            A private initiative. These two put the house on its feet. Empty
            logo slots live on{" "}
            <Link
              href="/partners"
              className="text-beige underline underline-offset-4 hover:text-signal"
            >
              Partners
            </Link>
            .
          </p>
          <div className="mt-12 grid gap-4 sm:grid-cols-2">
            {ALREADY_IN.map((org) => (
              <a
                key={org.name}
                href={org.href}
                target="_blank"
                rel="noreferrer"
                className="group flex min-h-40 flex-col border border-border bg-asphalt transition-colors hover:border-signal sm:min-h-48"
              >
                <div className="relative flex flex-1 items-center justify-center overflow-hidden px-8 py-8">
                  <Image
                    src={org.src}
                    alt={org.alt}
                    width={org.wide ? 5184 : 2522}
                    height={org.wide ? 3351 : 986}
                    unoptimized={!org.wide}
                    className={
                      org.wide
                        ? "h-auto w-[110%] max-w-none object-contain mix-blend-screen transition-transform duration-300 group-hover:scale-105"
                        : "h-auto w-full max-w-[14rem] object-contain transition-transform duration-300 group-hover:scale-105"
                    }
                  />
                </div>
                <div className="flex items-center justify-between border-t border-border px-5 py-3">
                  <span className="text-xs font-bold tracking-[0.25em] text-beige uppercase">
                    {org.name}
                  </span>
                  <span className="text-[10px] tracking-[0.2em] text-steel uppercase transition-colors group-hover:text-signal">
                    {org.role}
                  </span>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* ── PROOF ───────────────────────────────────────── */}
      {upcoming.length > 0 && (
        <section className="border-b border-border">
          <div className="mx-auto w-full max-w-6xl px-4 py-20 sm:py-24">
            <h2 className="font-heading text-4xl leading-tight uppercase text-beige sm:text-5xl md:text-6xl">
              The house is running
            </h2>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-concrete sm:text-xl sm:leading-9">
              Live calendar. Show up before you write anything.
            </p>
            <div className="mt-12 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {upcoming.map((e) => (
                <EventCard key={e.apiId} event={e} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── CTA ─────────────────────────────────────────── */}
      <section>
        <div className="mx-auto w-full max-w-6xl px-4 py-20 sm:py-28">
          <h2 className="font-heading text-4xl leading-tight uppercase text-beige sm:text-5xl md:text-6xl">
            Book the meeting
          </h2>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-concrete sm:text-xl sm:leading-9">
            Tell us who you are and which lane. We talk about the building,
            not a partnership brochure.
          </p>
          <div className="mt-10 flex flex-wrap gap-4">
            <a
              href={SITE.calendlyUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex h-14 items-center bg-signal px-10 text-base font-bold tracking-[0.2em] text-on-signal uppercase transition-colors hover:bg-signal/80 sm:text-lg"
            >
              Book 30 min
            </a>
            <a
              href={mailHref}
              className="inline-flex h-14 items-center border border-beige/50 bg-beige/5 px-10 text-base tracking-[0.2em] text-beige uppercase transition-colors hover:border-beige hover:bg-beige/10 sm:text-lg"
            >
              {SITE.sponsorEmail}
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
