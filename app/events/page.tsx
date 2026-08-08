import type { Metadata } from "next";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Countdown } from "@/components/site/countdown";
import { EventCard, eventDate, eventTime } from "@/components/site/event-card";
import { Reveal } from "@/components/site/reveal";
import { getPastEvents, getUpcomingEvents, isHackathon } from "@/lib/luma";
import { LUMA, SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "Events",
  description:
    "Weekly meetups, monthly hackathons, garden BBQs. The Hacker Bloc calendar — one-tap RSVP via Luma.",
};

const EVENT_TYPES = [
  { glyph: "[◉]", name: "Founder Meetup", desc: "weekly. builders talking to builders." },
  { glyph: "[▶]", name: "Demo Night", desc: "ship it live or it didn't happen." },
  { glyph: "[⚑]", name: "Hackathon", desc: "monthly. dungeons open, daylight optional.", hot: true },
  { glyph: "[❀]", name: "BBQ / Garden", desc: "saturdays. grill smoke + whiteboards." },
  { glyph: "[⚙]", name: "Hardware Workshop", desc: "solder, CNC, salvage. bring gloves." },
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

export default async function EventsPage() {
  const [upcoming, past] = await Promise.all([
    getUpcomingEvents(),
    getPastEvents(),
  ]);
  const next = upcoming[0] ?? null;
  const rest = upcoming.slice(1);
  const pastHackathons = past.filter(isHackathon);
  const pastMeetups = past.filter((e) => !isHackathon(e));

  return (
    <main className="flex-1">
      {/* ── NEXT EVENT HERO ──────────────────────────────── */}
      <section className="mx-auto max-w-6xl px-4 pt-16 pb-12 sm:pt-20">
        <p className="mb-4 text-xs tracking-[0.35em] text-signal uppercase">
          events // {SITE.city.toLowerCase()}
        </p>
        {next ? (
          <div className="grid gap-8 md:grid-cols-[1.2fr_1fr] md:items-center">
            <div>
              <h1 className="font-heading text-[clamp(2.5rem,7vw,5.5rem)] leading-[0.95] uppercase text-beige">
                {next.name}
              </h1>
              <p className="mt-4 text-sm tracking-[0.2em] text-concrete uppercase">
                {eventDate(next)}{" // doors "}{eventTime(next)}
                {next.address && <>{" // ◉ "}{next.address}</>}
              </p>
              <div className="mt-8 flex flex-wrap items-center gap-4">
                <Button
                  asChild
                  size="lg"
                  className="bg-signal px-10 text-on-signal font-bold tracking-[0.2em] uppercase hover:bg-signal/80"
                >
                  <a href={next.url} target="_blank" rel="noreferrer">
                    RSVP — one tap
                  </a>
                </Button>
                <span className="text-xs text-steel uppercase tracking-widest">
                  t-minus <Countdown target={next.startAt} compact className="text-signal" />
                </span>
              </div>
            </div>
            {next.coverUrl && (
              <div
                className="relative overflow-hidden border border-border"
                style={{ aspectRatio: "16/9" }}
              >
                <Image
                  src={next.coverUrl}
                  alt={next.name}
                  fill
                  preload
                  sizes="(max-width: 768px) 100vw, 40vw"
                  className="object-cover"
                />
              </div>
            )}
          </div>
        ) : (
          <div>
            <h1 className="font-heading text-5xl uppercase text-beige sm:text-7xl">
              Calendar offline
            </h1>
            <p className="mt-4 text-sm text-concrete">
              The feed is recharging — everything lives on{" "}
              <a
                href={LUMA.calendarUrl}
                target="_blank"
                rel="noreferrer"
                className="text-signal underline underline-offset-4"
              >
                luma.com/{LUMA.slug}
              </a>
              .
            </p>
          </div>
        )}
      </section>

      {/* ── CALENDAR ─────────────────────────────────────── */}
      <section className="border-y border-border bg-asphalt">
        <div className="mx-auto max-w-6xl px-4 py-20">
          <SectionHeading code="01_SCHEDULE" title="On the calendar" />
          {rest.length > 0 ? (
            <div className="border border-border bg-charcoal">
              <div className="flex items-center justify-between border-b border-border px-4 py-2 text-[10px] tracking-[0.25em] text-concrete uppercase">
                <span>cal -A /dev/bloc</span>
                <span className="text-signal">live from luma</span>
              </div>
              <ul className="divide-y divide-border">
                {rest.map((e, i) => (
                  <Reveal key={e.apiId} delay={i * 50}>
                    <li>
                      <a
                        href={e.url}
                        target="_blank"
                        rel="noreferrer"
                        className="group flex flex-wrap items-baseline gap-x-4 gap-y-1 px-4 py-4 transition-colors hover:bg-asphalt"
                      >
                        <span className="font-(family-name:--font-tech) text-sm text-signal tabular-nums">
                          {eventDate(e)}
                        </span>
                        <span className="flex-1 text-sm font-bold uppercase tracking-widest text-beige">
                          {e.name}
                        </span>
                        <span
                          className={`text-[10px] tracking-[0.25em] uppercase ${
                            isHackathon(e) ? "text-rust" : "text-steel"
                          }`}
                        >
                          {isHackathon(e) ? "⚑ hackathon" : eventTime(e)}
                        </span>
                        <span className="text-[10px] tracking-[0.25em] text-concrete uppercase opacity-0 transition-opacity group-hover:opacity-100">
                          rsvp →
                        </span>
                      </a>
                    </li>
                  </Reveal>
                ))}
              </ul>
            </div>
          ) : (
            <p className="text-sm text-concrete">
              nothing else on the books yet — weekly meetups drop on{" "}
              <a
                href={LUMA.calendarUrl}
                target="_blank"
                rel="noreferrer"
                className="text-signal underline underline-offset-4"
              >
                luma
              </a>
              .
            </p>
          )}

          {/* legend */}
          <div className="mt-10 grid gap-px bg-border sm:grid-cols-2 lg:grid-cols-5">
            {EVENT_TYPES.map((t) => (
              <div key={t.name} className="bg-card p-4">
                <p
                  className={`text-xs font-bold uppercase tracking-widest ${
                    "hot" in t && t.hot ? "text-rust" : "text-beige"
                  }`}
                >
                  <span className="text-signal">{t.glyph}</span> {t.name}
                </p>
                <p className="mt-2 text-[10px] leading-4 tracking-wider text-concrete uppercase">
                  {t.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PAST EVENTS: SPLIT ARCHIVE ───────────────────── */}
      <section className="mx-auto max-w-6xl px-4 py-20">
        <SectionHeading code="02_ARCHIVE" title="Already happened" />
        <div className="grid border border-border md:grid-cols-2">
          {/* hackathons */}
          <div className="border-b border-border md:border-r md:border-b-0">
            <div className="flex items-baseline justify-between border-b border-border bg-charcoal px-4 py-3">
              <h3 className="font-(family-name:--font-tech) text-sm font-bold tracking-widest text-rust uppercase">
                ⚑ Hackathons
              </h3>
              <span className="text-[10px] tracking-[0.25em] text-concrete uppercase">
                {String(pastHackathons.length).padStart(2, "0")} logged
              </span>
            </div>
            <div className="grid gap-4 p-4">
              {pastHackathons.length > 0 ? (
                pastHackathons.map((e, i) => (
                  <Reveal key={e.apiId} delay={i * 50} className="h-full">
                    <EventCard event={e} past />
                  </Reveal>
                ))
              ) : (
                <p className="py-8 text-center text-xs text-steel uppercase tracking-widest">
                  dungeons quiet — for now
                </p>
              )}
            </div>
          </div>
          {/* meetups */}
          <div>
            <div className="flex items-baseline justify-between border-b border-border bg-charcoal px-4 py-3">
              <h3 className="font-(family-name:--font-tech) text-sm font-bold tracking-widest text-signal uppercase">
                ◉ Meetups
              </h3>
              <span className="text-[10px] tracking-[0.25em] text-concrete uppercase">
                {String(pastMeetups.length).padStart(2, "0")} logged
              </span>
            </div>
            <div className="grid gap-4 p-4 sm:grid-cols-2 md:grid-cols-1 lg:grid-cols-2">
              {pastMeetups.length > 0 ? (
                pastMeetups.map((e, i) => (
                  <Reveal key={e.apiId} delay={i * 50} className="h-full">
                    <EventCard event={e} past />
                  </Reveal>
                ))
              ) : (
                <p className="py-8 text-center text-xs text-steel uppercase tracking-widest">
                  no meetups logged yet
                </p>
              )}
            </div>
          </div>
        </div>
        <p className="mt-6 text-xs text-steel">
          * every archive entry is sponsor proof: real rooms, real turnout,
          real builders.
        </p>
      </section>

      {/* ── HOST YOUR EVENT ──────────────────────────────── */}
      <section className="border-y border-border bg-asphalt">
        <div className="mx-auto max-w-3xl px-4 py-16 text-center">
          <p className="text-xs tracking-[0.3em] text-signal uppercase">
            03_YOUR_TURN
          </p>
          <h2 className="mt-4 font-heading text-4xl uppercase text-beige sm:text-5xl">
            Host your event
          </h2>
          <p className="mt-4 text-sm leading-6 text-concrete">
            Community members can propose talks, workshops, and weird
            experiments. If it teaches builders something, the room is yours.
          </p>
          <p className="mt-6 text-sm">
            <a
              href={`mailto:${SITE.email}?subject=EVENT%20PROPOSAL%20//%20HB`}
              className="text-signal underline decoration-signal/50 underline-offset-4"
            >
              pitch your session → {SITE.email}
            </a>
          </p>
        </div>
      </section>

      {/* ── CHANNEL CTA ──────────────────────────────────── */}
      <section className="mx-auto max-w-3xl px-4 py-20 text-center">
        <p className="text-xs tracking-[0.3em] text-signal uppercase">
          04_STAY_SYNCED
        </p>
        <h2 className="mt-4 font-heading text-4xl uppercase text-beige sm:text-5xl">
          Pick your channel
        </h2>
        <p className="mt-4 text-sm text-concrete">
          One calendar, zero spam. Subscribe on Luma and every event lands in
          your inbox and calendar automatically.
        </p>
        <Button
          asChild
          size="lg"
          className="mt-8 bg-signal px-10 text-on-signal font-bold tracking-[0.2em] uppercase hover:bg-signal/80"
        >
          <a href={LUMA.calendarUrl} target="_blank" rel="noreferrer">
            Subscribe on Luma
          </a>
        </Button>
      </section>
    </main>
  );
}
