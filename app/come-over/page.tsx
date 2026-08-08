import type { Metadata } from "next";
import { Countdown } from "@/components/site/countdown";
import { JoinForm } from "@/components/site/join-form";
import { eventDate, eventTime } from "@/components/site/event-card";
import { getUpcomingEvents } from "@/lib/luma";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "Come Over",
  description:
    "Address, house rules, and the /join waitlist. Kosiarzy 21B, Warszawa. Just show up.",
};

const HOUSE_RULES = [
  "01 // build > talk. demos beat decks, always.",
  "02 // leave the bloc better than you found it — code, tools, and kitchen.",
  "03 // strangers are just builders you haven't shipped with yet.",
] as const;

const WAYS_IN = [
  {
    glyph: "[◉]",
    title: "Attend",
    body: "Weekly meetups and Saturday BBQs. RSVP on Luma, or honestly — just show up.",
  },
  {
    glyph: "[⚙]",
    title: "Build in the dungeons",
    body: "Hardware lab below street level. Bring a project, get a bench.",
  },
  {
    glyph: "[⌂]",
    title: "Crash during hackathons",
    body: "Bunks open for build weekends. Sleeping bag optional, laptop not.",
  },
  {
    glyph: "[♥]",
    title: "Volunteer",
    body: "Run the grill, the door, or the livestream. The bloc runs on its people.",
  },
] as const;

export default async function ComeOverPage() {
  const [next] = await getUpcomingEvents();

  return (
    <main className="flex-1">
      {/* ── HERO: ADDRESS + MAP ──────────────────────────── */}
      <section className="mx-auto max-w-6xl px-4 pt-16 pb-12 sm:pt-24">
        <p className="mb-4 text-xs tracking-[0.35em] text-signal uppercase">
          access // open door protocol
        </p>
        <h1 className="hb-glitch font-heading text-[clamp(3rem,10vw,7.5rem)] leading-[0.9] uppercase text-beige">
          Come over.
        </h1>
        <div className="mt-10 grid gap-8 md:grid-cols-2">
          <div className="border border-border bg-charcoal">
            <div className="flex items-center justify-between border-b border-border px-4 py-2 text-[10px] tracking-[0.25em] text-concrete uppercase">
              <span>coordinates</span>
              <span className="text-signal">◉ fixed</span>
            </div>
            <div className="p-5 text-sm leading-7">
              <a
                href={SITE.mapsUrl}
                target="_blank"
                rel="noreferrer"
                className="text-beige underline decoration-signal/50 underline-offset-4 hover:text-signal"
              >
                {SITE.address}
              </a>
              <p className="text-concrete">
                {SITE.district}{" // "}{SITE.city}
              </p>
              <p className="mt-2 text-xs text-steel">
                {SITE.coordinates.lat.toFixed(5)}° N, {SITE.coordinates.lng.toFixed(5)}° E
              </p>
              <a
                href={SITE.mapsUrl}
                target="_blank"
                rel="noreferrer"
                className="mt-4 inline-block border border-signal px-4 py-2 text-[10px] font-bold tracking-[0.25em] text-signal uppercase transition-colors hover:bg-signal hover:text-on-signal"
              >
                open map →
              </a>
            </div>
          </div>
          <div className="border border-border bg-charcoal">
            <div className="flex items-center justify-between border-b border-border px-4 py-2 text-[10px] tracking-[0.25em] text-concrete uppercase">
              <span>next open event</span>
              <span className="text-signal">live</span>
            </div>
            <div className="p-5 text-sm leading-7">
              {next ? (
                <>
                  <p className="font-bold uppercase tracking-widest text-beige">
                    {next.name}
                  </p>
                  <p className="text-concrete">
                    {eventDate(next)}{" // doors "}{eventTime(next)}
                  </p>
                  <p className="mt-2 text-xs uppercase tracking-widest text-steel">
                    t-minus{" "}
                    <Countdown target={next.startAt} compact className="text-signal" />
                  </p>
                  <a
                    href={next.url}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-4 inline-block border border-signal bg-signal px-4 py-2 text-[10px] font-bold tracking-[0.25em] text-on-signal uppercase transition-colors hover:bg-signal/80"
                  >
                    rsvp →
                  </a>
                </>
              ) : (
                <p className="text-concrete">
                  calendar recharging — the door still opens for BBQ saturdays.
                </p>
              )}
            </div>
          </div>
        </div>

        {/* house rules */}
        <div className="mt-8 border border-border bg-charcoal p-5 text-xs leading-7 sm:text-sm">
          <p className="text-steel">cat /etc/bloc/house.rules</p>
          {HOUSE_RULES.map((r) => (
            <p key={r} className="text-concrete">
              <span className="text-signal">&gt;</span> {r}
            </p>
          ))}
        </div>
      </section>

      {/* ── HOW TO GET INVOLVED ──────────────────────────── */}
      <section className="border-y border-border bg-asphalt">
        <div className="mx-auto max-w-6xl px-4 py-20">
          <div className="mb-10 flex flex-wrap items-baseline gap-4 border-b border-border pb-3">
            <span className="text-xs tracking-[0.3em] text-signal">01_WAYS_IN</span>
            <h2 className="font-heading text-3xl sm:text-4xl uppercase tracking-wide text-beige">
              How to get involved
            </h2>
          </div>
          <div className="grid gap-px bg-border sm:grid-cols-2 lg:grid-cols-4">
            {WAYS_IN.map((w) => (
              <article key={w.title} className="h-full bg-card p-6">
                <span className="text-signal">{w.glyph}</span>
                <h3 className="mt-4 font-(family-name:--font-tech) text-sm font-bold tracking-widest text-beige uppercase">
                  {w.title}
                </h3>
                <p className="mt-3 text-xs leading-5 text-concrete">{w.body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ── /JOIN ────────────────────────────────────────── */}
      <section id="join" className="mx-auto max-w-2xl px-4 py-20">
        <div className="mb-10 flex flex-wrap items-baseline gap-4 border-b border-border pb-3">
          <span className="text-xs tracking-[0.3em] text-signal">02_JOIN</span>
          <h2 className="font-heading text-3xl sm:text-4xl uppercase tracking-wide text-beige">
            /join the waitlist
          </h2>
        </div>
        <JoinForm />
      </section>
    </main>
  );
}
