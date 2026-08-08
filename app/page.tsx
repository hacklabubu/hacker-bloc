import Link from "next/link";
import { Button } from "@/components/ui/button";
import { FloatingObjects } from "@/components/site/floating-objects";
import { BootSequence } from "@/components/site/boot-sequence";
import { Countdown } from "@/components/site/countdown";
import { Error529 } from "@/components/site/error-529";
import { EventCard } from "@/components/site/event-card";
import { FirstWave } from "@/components/site/first-wave";
import { BlocMark } from "@/components/site/logo";
import { PhotoSlot } from "@/components/site/photo-slot";
import { PhotoWall } from "@/components/site/photo-wall";
import { Reveal } from "@/components/site/reveal";
import { TheStack } from "@/components/site/the-stack";
import { getUpcomingEvents } from "@/lib/luma";
import { ALIEN_BAZAAR, SITE } from "@/lib/site";

const SPONSORS = [
  { name: "EPICOR", gives: "operating partner // the dungeons" },
  { name: "VISTULA COMPUTE", gives: "gpu credits" },
  { name: "SOLDER & SONS", gives: "hardware lab" },
  { name: "KAWA://OS", gives: "infinite coffee" },
  { name: "NIGHTSHIFT ROBOTICS", gives: "workshop machines" },
  { name: "ZAKŁAD MECHANICZNY №7", gives: "steel + welding" },
];

const BAZAAR_SHOTS = [
  { file: "photos/bazaar-01.jpg", label: "hackathon_000" },
  { file: "photos/bazaar-02.jpg", label: "the_dungeons" },
  { file: "photos/bazaar-03.jpg", label: "hardware_only" },
  { file: "photos/bazaar-04.jpg", label: "no_daylight" },
] as const;

function SectionHeading({ code, title }: { code: string; title: string }) {
  return (
    <div className="mb-10 flex flex-wrap items-baseline gap-4 border-b border-border pb-3">
      <span className="text-xs tracking-[0.3em] text-signal">{code}</span>
      <h2 className="font-heading text-3xl sm:text-4xl uppercase tracking-wide text-beige">
        {title}
      </h2>
    </div>
  );
}

export default async function Home() {
  const upcoming = await getUpcomingEvents();
  const thisWeek = upcoming.slice(0, 3);
  const next = upcoming[0] ?? null;

  return (
    <main id="top" className="flex-1">
      <BootSequence />

      {/* ── HERO ─────────────────────────────────────────── */}
      <section className="relative flex min-h-[calc(100svh-73px)] flex-col items-center justify-center overflow-x-clip px-4 py-10">
        <FloatingObjects />
        <div className="relative mx-auto max-w-3xl text-center">
          <BlocMark className="mx-auto mb-6 h-14 w-auto text-signal xl:h-20" />
          <h1 className="hb-glitch font-heading text-[clamp(2.5rem,6.5vw,5rem)] leading-[0.9] uppercase text-beige">
            The bloc where
            <br />
            Warsaw builds.
          </h1>
          <p className="mx-auto mt-6 max-w-md text-sm leading-6 text-concrete">
            Eastern Bloc roots. Silicon Valley ambition. A brutalist block
            turned build site for founders, hackers, and hardware freaks —
            live events, real dungeons, zero decks.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Button
              asChild
              className="bg-signal text-on-signal font-bold tracking-widest uppercase hover:bg-signal/80"
            >
              {next ? (
                <a href={next.url} target="_blank" rel="noreferrer">
                  Come to the next event
                </a>
              ) : (
                <Link href="/events">Come to the next event</Link>
              )}
            </Button>
            <Button
              asChild
              variant="outline"
              className="border-steel tracking-widest uppercase text-concrete hover:text-beige"
            >
              <Link href="/partners">Sponsor the Bloc</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* ── WHAT IS HACKER BLOC ──────────────────────────── */}
      <section className="mx-auto max-w-6xl px-4 py-20">
        <SectionHeading code="01_WHAT" title="What is Hacker Bloc" />
        <div className="grid gap-8 md:grid-cols-[1.2fr_1fr]">
          <div className="space-y-4 text-sm leading-7 text-concrete sm:text-base">
            <p>
              <span className="text-rust">Not coworking.</span>{" "}
              <span className="text-rust">Not an incubator.</span>{" "}
              <span className="text-rust">Not a theoretical nonprofit.</span>
            </p>
            <p className="text-beige">
              Hacker Bloc is a physical block in Warsaw where builders meet
              weekly, hack monthly, and ship constantly — a community with a
              front door instead of a Slack.
            </p>
            <p>
              Everyone here has skin in the game: we put our own money, our
              weekends, and our power tools into this building. Come see the
              receipts.
            </p>
          </div>
          <div className="border border-border bg-charcoal p-4 text-xs leading-6 sm:text-sm">
            <p className="text-steel">root@hacker-bloc:~#</p>
            <p className="text-signal">
              whoami
              <br />
              <span className="text-beige">
                &gt; community of builders // warsaw
              </span>
              <br />
              grep -c &quot;decks&quot; /var/lib/bloc/*
              <br />
              <span className="text-beige">&gt; 0</span>
              <span className="hb-blink">█</span>
            </p>
          </div>
        </div>
      </section>

      {/* ── ALIEN BAZAAR TEASER ──────────────────────────── */}
      <section id="alien-bazaar" className="border-y border-signal/30 bg-charcoal">
        <div className="mx-auto max-w-6xl px-4 py-20">
          <div className="mb-10 flex flex-wrap items-baseline gap-4 border-b border-signal/30 pb-3">
            <span className="text-xs tracking-[0.3em] text-signal">
              02_INCOMING
            </span>
            <h2 className="font-heading text-3xl sm:text-4xl uppercase tracking-wide text-signal">
              Alien Bazaar
            </h2>
            <span className="ml-auto text-[10px] tracking-[0.25em] text-concrete uppercase">
              2026-09-19 // the dungeons
            </span>
          </div>
          <Countdown target={ALIEN_BAZAAR.date} className="border border-border" />
          <p className="mt-8 text-center text-sm tracking-[0.2em] text-beige uppercase sm:text-base">
            100 builders. Hardware only. Built in the dungeons.
          </p>
          <div className="mt-8 grid grid-cols-2 gap-3 lg:grid-cols-4">
            {BAZAAR_SHOTS.map((s, i) => (
              <Reveal key={s.file} delay={i * 60}>
                <PhotoSlot label={s.label} file={s.file} ratio="4/3" />
              </Reveal>
            ))}
          </div>
          <div className="mt-10 text-center">
            <Button
              asChild
              size="lg"
              className="bg-signal px-10 text-on-signal font-bold tracking-[0.2em] uppercase hover:bg-signal/80"
            >
              <Link href={ALIEN_BAZAAR.url}>Enter the Bazaar →</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* ── THE STACK ────────────────────────────────────── */}
      <section id="stack" className="border-y border-border bg-asphalt">
        <div className="mx-auto max-w-6xl px-4 py-20">
          <SectionHeading code="03_THE_STACK" title="Five levels of signal" />
          <TheStack />
        </div>
      </section>

      {/* ── THE FIRST WAVE ───────────────────────────────── */}
      <section id="first-wave" className="mx-auto max-w-6xl px-4 py-20">
        <SectionHeading code="04_FIRST_WAVE" title="The first wave" />
        <FirstWave />
      </section>

      {/* ── THIS WEEK AT THE BLOC ────────────────────────── */}
      <section className="mx-auto max-w-6xl px-4 py-20">
        <SectionHeading code="05_THIS_WEEK" title="This week at the Bloc" />
        {thisWeek.length > 0 ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {thisWeek.map((e, i) => (
              <Reveal key={e.apiId} delay={i * 60} className="h-full">
                <EventCard event={e} />
              </Reveal>
            ))}
          </div>
        ) : (
          <p className="text-sm text-concrete">
            calendar offline — check{" "}
            <Link href="/events" className="text-signal underline underline-offset-4">
              the events page
            </Link>
            .
          </p>
        )}
        <p className="mt-6 text-xs text-steel">
          full schedule on{" "}
          <Link
            href="/events"
            className="text-concrete underline decoration-signal/50 underline-offset-4 hover:text-signal"
          >
            /events
          </Link>
        </p>
      </section>

      {/* ── PHOTO WALL ───────────────────────────────────── */}
      <section className="border-y border-border bg-asphalt">
        <div className="mx-auto max-w-6xl px-4 py-20">
          <SectionHeading code="06_THE_WALL" title="Proof of life" />
          <PhotoWall />
        </div>
      </section>

      {/* ── ERROR 529 ────────────────────────────────────── */}
      <section className="mx-auto max-w-4xl px-4 py-20">
        <SectionHeading code="07_BROADCAST" title="Error 529" />
        <Error529 />
      </section>

      {/* ── PARTNERS STRIP ───────────────────────────────── */}
      <section className="border-y border-border bg-asphalt">
        <div className="mx-auto max-w-6xl px-4 py-20">
          <SectionHeading code="08_POWERED_BY" title="Powered by people who build" />
          <div className="grid gap-px bg-border sm:grid-cols-2 lg:grid-cols-3">
            {SPONSORS.map((s, i) => (
              <Reveal key={s.name} delay={i * 60} className="h-full">
                <div className="group flex h-full flex-col justify-between bg-card p-6">
                  <p className="font-(family-name:--font-tech) text-sm font-bold tracking-widest text-concrete uppercase transition-colors group-hover:text-signal">
                    {s.name}
                  </p>
                  <p className="mt-4 text-[10px] tracking-[0.25em] text-steel uppercase">
                    supplies :: {s.gives}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
          <p className="mt-6 text-xs text-steel">
            want your logo on concrete? →{" "}
            <Link
              href="/partners"
              className="text-concrete underline decoration-signal/50 underline-offset-4 hover:text-signal"
            >
              power the bloc
            </Link>
          </p>
        </div>
      </section>

      {/* ── FINAL CTA ────────────────────────────────────── */}
      <section id="come-over" className="border-t border-border">
        <div className="mx-auto max-w-3xl px-4 py-24 text-center">
          <p className="text-xs tracking-[0.3em] text-signal uppercase">
            09_ACCESS
          </p>
          <h2 className="mt-4 font-heading text-5xl sm:text-7xl uppercase text-beige">
            Just show up.
          </h2>
          <p className="mt-6 text-sm text-concrete">
            <a
              href={SITE.mapsUrl}
              target="_blank"
              rel="noreferrer"
              className="text-beige underline decoration-signal/50 underline-offset-4 hover:text-signal"
            >
              ◉ {SITE.address}
            </a>
            {next && (
              <>
                <br />
                next open door: <span className="text-signal">{next.name}</span>
              </>
            )}
          </p>
          <Button
            asChild
            size="lg"
            className="mt-8 bg-signal px-10 text-on-signal font-bold tracking-[0.2em] uppercase hover:bg-signal/80"
          >
            <Link href="/come-over">Come Over</Link>
          </Button>
        </div>
      </section>
    </main>
  );
}
