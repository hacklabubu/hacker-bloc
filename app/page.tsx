import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Error529 } from "@/components/site/error-529";
import { EventCard } from "@/components/site/event-card";
import { FirstWave } from "@/components/site/first-wave";
import { PhotoWall } from "@/components/site/photo-wall";
import { TheStack } from "@/components/site/the-stack";
import { getPastEvents, getUpcomingEvents } from "@/lib/luma";

const PARTNER_TIERS = [
  {
    tier: "Diamond",
    slots: 1,
    cell: "min-h-40 sm:min-h-48",
    grid: "grid-cols-1",
  },
  {
    tier: "Gold",
    slots: 3,
    cell: "min-h-32 sm:min-h-36",
    grid: "grid-cols-1 sm:grid-cols-3",
  },
  {
    tier: "Silver",
    slots: 6,
    cell: "min-h-24 sm:min-h-28",
    grid: "grid-cols-2 sm:grid-cols-3",
  },
  {
    tier: "Bronze",
    slots: 9,
    cell: "min-h-20 sm:min-h-24",
    grid: "grid-cols-3 sm:grid-cols-3",
  },
] as const;

export default async function Home() {
  const [upcomingAll, pastAll] = await Promise.all([
    getUpcomingEvents(),
    getPastEvents(),
  ]);
  const upcoming = upcomingAll.slice(0, 6);
  const past = pastAll.slice(0, 6);

  return (
    <main id="top" className="flex-1">
      {/* ── HERO ─────────────────────────────────────────── */}
      <section className="relative flex min-h-[calc(100svh-73px)] items-center overflow-x-clip px-4 py-10">
        <div className="mx-auto grid w-full max-w-6xl items-center gap-10 md:grid-cols-[1.15fr_1fr]">
          <div>
            <h1 className="font-heading text-[clamp(4rem,9.5vw,9.5rem)] leading-[0.9] uppercase text-beige">
              Hacker
              <br />
              Bloc
            </h1>
            <p className="mt-6 text-sm leading-7 tracking-[0.25em] uppercase text-concrete sm:text-base">
              Eastern Bloc roots.
              <br />
              <span className="text-signal">Silicon Valley ambition.</span>
            </p>
            <div className="mt-10 flex flex-wrap gap-4">
              <Button
                asChild
                size="lg"
                className="h-14 bg-signal px-10 text-base text-on-signal font-bold tracking-[0.2em] uppercase hover:bg-signal/80 sm:h-16 sm:px-12 sm:text-lg"
              >
                <Link href="/join">Join</Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="h-14 border-steel px-10 text-base tracking-[0.2em] uppercase text-concrete hover:text-beige sm:h-16 sm:px-12 sm:text-lg"
              >
                <Link href="#partners">Sponsor</Link>
              </Button>
            </div>
          </div>
          <Image
            src="/photos/hero-hacker.webp"
            alt="Hooded builder soldering at a workbench, halftone green"
            width={1250}
            height={1159}
            preload
            className="mx-auto h-auto max-h-[78svh] w-auto"
          />
        </div>
      </section>

      {/* ── WHAT IS HACKER BLOC ──────────────────────────── */}
      <section
        id="bloc"
        className="flex min-h-svh items-center border-y border-border"
      >
        <div className="mx-auto w-full max-w-6xl px-4 py-20">
          <h2 className="font-heading text-4xl leading-tight uppercase text-beige sm:text-5xl md:text-6xl">
            What is Hacker Bloc
          </h2>
          <div className="mt-10 max-w-4xl space-y-8">
            <p className="text-xl leading-9 text-beige sm:text-2xl sm:leading-10 md:text-3xl md:leading-[1.35]">
              Hacker Bloc is a physical hacker house in Warsaw — a place where
              we invite ambitious founders and connect them with investors and
              media.
            </p>
            <p className="text-base leading-8 text-concrete sm:text-lg sm:leading-9">
              Not a Slack. Not coworking. A real house with a front door, where
              the best builders in the city meet, ship, and get put in front of
              the people who can move their companies forward.
            </p>
            <p className="text-base leading-8 text-concrete sm:text-lg sm:leading-9">
              A community and initiative created by the founders of{" "}
              <span className="text-beige">Hacklab</span> and{" "}
              <span className="text-beige">Epicor</span>.
            </p>
          </div>
          <ul className="mt-14 grid gap-px bg-border sm:grid-cols-3">
            {[
              {
                label: "founders",
                body: "Ambitious builders invited in — not open applications, not tourists.",
              },
              {
                label: "investors",
                body: "Capital that shows up in person, not cold inboxes.",
              },
              {
                label: "media",
                body: "Stories told from the room, not press releases from a deck.",
              },
            ].map((item) => (
              <li
                key={item.label}
                className="bg-charcoal px-6 py-8 sm:px-8 sm:py-10"
              >
                <p className="text-[10px] tracking-[0.3em] text-signal uppercase">
                  {item.label}
                </p>
                <p className="mt-3 text-sm leading-7 text-concrete sm:text-base">
                  {item.body}
                </p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ── FLOORS ───────────────────────────────────────── */}
      <section
        id="stack"
        className="flex min-h-svh items-center border-y border-border"
      >
        <div className="mx-auto w-full max-w-6xl px-4 py-20">
          <h2 className="font-heading text-4xl leading-tight uppercase text-beige sm:text-5xl md:text-6xl">
            Floors
          </h2>
          <div className="mt-10">
            <TheStack />
          </div>
        </div>
      </section>

      {/* ── MISSION — THE FIRST WAVE ─────────────────────── */}
      <section
        id="first-wave"
        className="flex min-h-svh items-center border-y border-border"
      >
        <div className="mx-auto w-full max-w-6xl px-4 py-20">
          <h2 className="font-heading text-4xl leading-tight uppercase text-beige sm:text-5xl md:text-6xl">
            Mission
            <span className="text-signal"> — </span>
            The First Wave
          </h2>
          <div className="mt-10">
            <FirstWave />
          </div>
        </div>
      </section>

      {/* ── EVENTS ───────────────────────────────────────── */}
      <section
        id="events"
        className="flex min-h-svh items-center border-y border-border"
      >
        <div className="mx-auto w-full max-w-6xl px-4 py-20">
          <h2 className="font-heading text-4xl leading-tight uppercase text-beige sm:text-5xl md:text-6xl">
            Events
          </h2>

          <div className="mt-12 space-y-14">
            <div>
              <h3 className="mb-6 text-sm font-bold tracking-[0.3em] text-signal uppercase sm:text-base">
                Upcoming
              </h3>
              {upcoming.length > 0 ? (
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {upcoming.map((e) => (
                    <EventCard key={e.apiId} event={e} />
                  ))}
                </div>
              ) : (
                <p className="text-sm text-concrete">No upcoming events yet.</p>
              )}
            </div>

            <div>
              <h3 className="mb-6 text-sm font-bold tracking-[0.3em] text-concrete uppercase sm:text-base">
                Past
              </h3>
              {past.length > 0 ? (
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {past.map((e) => (
                    <EventCard key={e.apiId} event={e} past />
                  ))}
                </div>
              ) : (
                <p className="text-sm text-concrete">No past events yet.</p>
              )}
            </div>
          </div>


        </div>
      </section>

      {/* ── PROOF OF LIFE ────────────────────────────────── */}
      <section className="flex min-h-svh items-center border-y border-border">
        <div className="mx-auto w-full max-w-6xl px-4 py-20">
          <h2 className="font-heading text-4xl leading-tight uppercase text-beige sm:text-5xl md:text-6xl">
            Proof of life
          </h2>
          <div className="mt-10">
            <PhotoWall />
          </div>
        </div>
      </section>

      {/* ── ERROR 529 ────────────────────────────────────── */}
      <section className="flex min-h-svh items-center border-y border-border">
        <div className="mx-auto w-full max-w-4xl px-4 py-20">
          <h2 className="font-heading text-4xl leading-tight uppercase text-beige sm:text-5xl md:text-6xl">
            Error 529
          </h2>
          <div className="mt-10">
            <Error529 />
          </div>
        </div>
      </section>

      {/* ── PARTNERS ─────────────────────────────────────── */}
      <section
        id="partners"
        className="flex min-h-svh items-center border-y border-border"
      >
        <div className="mx-auto w-full max-w-6xl px-4 py-20">
          <h2 className="font-heading text-4xl leading-tight uppercase text-beige sm:text-5xl md:text-6xl">
            Partners
          </h2>
          <div className="mt-12 space-y-10">
            {PARTNER_TIERS.map(({ tier, slots, cell, grid }) => (
              <div key={tier}>
                <p className="mb-4 text-xs font-bold tracking-[0.3em] text-signal uppercase">
                  {tier}
                </p>
                <div className={`grid gap-3 ${grid}`}>
                  {Array.from({ length: slots }, (_, i) => (
                    <div
                      key={`${tier}-${i}`}
                      className={`flex ${cell} items-center justify-center border border-dashed border-border bg-asphalt px-4`}
                    >
                      <span className="text-[10px] tracking-[0.25em] text-steel uppercase sm:text-xs">
                        {tier} partner
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── POWERED BY ───────────────────────────────────── */}
      <section className="flex min-h-svh items-center border-y border-border">
        <div className="mx-auto w-full max-w-6xl px-4 py-20">
          <h2 className="font-heading text-4xl leading-tight uppercase text-beige sm:text-5xl md:text-6xl">
            Powered by
          </h2>
          <p className="mt-8 max-w-2xl text-lg leading-8 text-concrete sm:text-xl sm:leading-9">
            A 100% private initiative by the founders of Hacklab and the
            founder of Epicor.
          </p>
          <div className="mt-16 grid gap-4 sm:grid-cols-2 sm:gap-6">
            <a
              href="https://hacklab.so"
              target="_blank"
              rel="noreferrer"
              className="group relative flex min-h-[16rem] flex-col border border-border bg-asphalt transition-colors hover:border-signal sm:min-h-[20rem] lg:min-h-[22rem]"
            >
              <div
                className="pointer-events-none absolute inset-0 opacity-40 transition-opacity group-hover:opacity-70"
                aria-hidden
                style={{
                  background:
                    "radial-gradient(ellipse at center, rgba(0,255,136,0.08) 0%, transparent 65%)",
                }}
              />
              <span
                className="pointer-events-none absolute top-0 left-0 h-5 w-5 border-t-2 border-l-2 border-signal"
                aria-hidden
              />
              <span
                className="pointer-events-none absolute top-0 right-0 h-5 w-5 border-t-2 border-r-2 border-signal"
                aria-hidden
              />
              <span
                className="pointer-events-none absolute bottom-0 left-0 h-5 w-5 border-b-2 border-l-2 border-signal"
                aria-hidden
              />
              <span
                className="pointer-events-none absolute right-0 bottom-0 h-5 w-5 border-r-2 border-b-2 border-signal"
                aria-hidden
              />
              <div className="relative flex flex-1 items-center justify-center overflow-hidden px-6 py-10 sm:px-10">
                <Image
                  src="/logos/hacklab.png"
                  alt="Hacklab"
                  width={5184}
                  height={3351}
                  className="h-auto w-[130%] max-w-none object-contain mix-blend-screen transition-transform duration-300 group-hover:scale-105 sm:w-[145%]"
                />
              </div>
              <div className="relative flex items-center justify-between border-t border-border px-5 py-3">
                <span className="text-xs font-bold tracking-[0.25em] text-beige uppercase">
                  Hacklab
                </span>
                <span className="text-[10px] tracking-[0.2em] text-steel uppercase transition-colors group-hover:text-signal">
                  founders
                </span>
              </div>
            </a>

            <a
              href="https://epikor.eu"
              target="_blank"
              rel="noreferrer"
              className="group relative flex min-h-[16rem] flex-col border border-border bg-asphalt transition-colors hover:border-signal sm:min-h-[20rem] lg:min-h-[22rem]"
            >
              <div
                className="pointer-events-none absolute inset-0 opacity-40 transition-opacity group-hover:opacity-70"
                aria-hidden
                style={{
                  background:
                    "radial-gradient(ellipse at center, rgba(0,255,136,0.08) 0%, transparent 65%)",
                }}
              />
              <span
                className="pointer-events-none absolute top-0 left-0 h-5 w-5 border-t-2 border-l-2 border-signal"
                aria-hidden
              />
              <span
                className="pointer-events-none absolute top-0 right-0 h-5 w-5 border-t-2 border-r-2 border-signal"
                aria-hidden
              />
              <span
                className="pointer-events-none absolute bottom-0 left-0 h-5 w-5 border-b-2 border-l-2 border-signal"
                aria-hidden
              />
              <span
                className="pointer-events-none absolute right-0 bottom-0 h-5 w-5 border-r-2 border-b-2 border-signal"
                aria-hidden
              />
              <div className="relative flex flex-1 items-center justify-center px-8 py-12 sm:px-12">
                <Image
                  src="/logos/epicor.svg"
                  alt="Epicor"
                  width={2522}
                  height={986}
                  unoptimized
                  className="h-auto w-full max-w-sm object-contain transition-transform duration-300 group-hover:scale-105 sm:max-w-md"
                />
              </div>
              <div className="relative flex items-center justify-between border-t border-border px-5 py-3">
                <span className="text-xs font-bold tracking-[0.25em] text-beige uppercase">
                  Epicor
                </span>
                <span className="text-[10px] tracking-[0.2em] text-steel uppercase transition-colors group-hover:text-signal">
                  founder
                </span>
              </div>
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
