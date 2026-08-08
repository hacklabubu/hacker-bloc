import type { Metadata } from "next";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/site/reveal";
import { getCounters } from "@/lib/luma";
import { PARTNERS, SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "Partners",
  description:
    "Power the Bloc. Brand on real events and hackathons, access to Warsaw's builder community, talent visibility.",
};

const SPONSORS = [
  { name: "VISTULA COMPUTE", gives: "gpu credits" },
  { name: "SOLDER & SONS", gives: "hardware lab" },
  { name: "KAWA://OS", gives: "infinite coffee" },
  { name: "NIGHTSHIFT ROBOTICS", gives: "workshop machines" },
  { name: "ZAKŁAD MECHANICZNY №7", gives: "steel + welding" },
];

const PARTNER_GETS = [
  {
    glyph: "[▚]",
    title: "Brand on events & hackathons",
    body: "Your logo on the demo wall, the hackathon banners, and every event page — seen by the people who actually build.",
  },
  {
    glyph: "[◉]",
    title: "Access to the community",
    body: "Weekly rooms full of founders and engineers. Bring your team, your hardware, your hard problems.",
  },
  {
    glyph: "[⚑]",
    title: "Talent visibility",
    body: "Hackathons are working interviews. Watch builders under pressure before anyone else does.",
  },
  {
    glyph: "[▶]",
    title: "Media features",
    body: "Error 529 and the photo wall document everything. Partners are part of the story, not a banner ad.",
  },
];

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

export default async function PartnersPage() {
  const counters = await getCounters();

  const numbers = [
    ["events / week", String(Math.max(counters.eventsThisWeek, 1)).padStart(2, "0")],
    ["events run", String(counters.eventsRun).padStart(2, "0")],
    ["hackathons", String(counters.hackathonsRun).padStart(2, "0")],
    ["builders through the door", `${counters.buildersThroughTheDoor}+`],
  ] as const;

  return (
    <main className="flex-1">
      {/* ── HERO ─────────────────────────────────────────── */}
      <section className="mx-auto max-w-6xl px-4 pt-16 pb-12 sm:pt-24">
        <p className="mb-4 text-xs tracking-[0.35em] text-signal uppercase">
          partners // skin in the game
        </p>
        <h1 className="hb-glitch font-heading text-[clamp(3rem,10vw,7.5rem)] leading-[0.9] uppercase text-beige">
          Power
          <br />
          the Bloc.
        </h1>
        <p className="mt-6 max-w-xl text-sm leading-7 text-concrete">
          Sponsors keep the doors open, the grills lit, and the dungeons
          powered. Every złoty goes into real rooms with real builders —
          weekly meetups, monthly hackathons, and a residency that stays free
          for founders, forever. No decks are harmed in the process.
        </p>
      </section>

      {/* ── THE NUMBERS ──────────────────────────────────── */}
      <section className="border-y border-border bg-asphalt">
        <dl className="mx-auto grid max-w-6xl grid-cols-2 divide-x divide-border lg:grid-cols-4">
          {numbers.map(([k, v]) => (
            <div key={k} className="px-4 py-6 text-center">
              <dd className="font-(family-name:--font-tech) text-3xl text-signal sm:text-4xl">
                {v}
              </dd>
              <dt className="mt-2 text-[10px] tracking-[0.2em] text-concrete uppercase">
                {k}
              </dt>
            </div>
          ))}
        </dl>
        <p className="mx-auto max-w-6xl px-4 pb-4 text-right text-[10px] tracking-[0.2em] text-steel uppercase">
          live from the calendar — updates continuously
        </p>
      </section>

      {/* ── WHO'S IN ─────────────────────────────────────── */}
      <section className="mx-auto max-w-6xl px-4 py-20">
        <SectionHeading code="01_ALREADY_IN" title="Who's already in" />
        <div className="grid gap-px bg-border sm:grid-cols-2 lg:grid-cols-3">
          <Reveal className="h-full">
            <div className="flex h-full flex-col justify-between border border-signal/40 bg-accent p-6">
              <p className="font-(family-name:--font-tech) text-lg font-bold tracking-widest text-signal uppercase">
                {PARTNERS.operating.name}
              </p>
              <p className="mt-4 text-[10px] tracking-[0.25em] text-beige uppercase">
                {PARTNERS.operating.role}
              </p>
            </div>
          </Reveal>
          {SPONSORS.map((s, i) => (
            <Reveal key={s.name} delay={(i + 1) * 60} className="h-full">
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
      </section>

      {/* ── WHAT PARTNERS GET ────────────────────────────── */}
      <section className="border-y border-border bg-asphalt">
        <div className="mx-auto max-w-6xl px-4 py-20">
          <SectionHeading code="02_THE_DEAL" title="What partners get" />
          <div className="grid gap-px bg-border sm:grid-cols-2">
            {PARTNER_GETS.map((p, i) => (
              <Reveal key={p.title} delay={i * 60} className="h-full">
                <article className="h-full bg-card p-6">
                  <span className="text-signal">{p.glyph}</span>
                  <h3 className="mt-4 font-(family-name:--font-tech) text-sm font-bold tracking-widest text-beige uppercase">
                    {p.title}
                  </h3>
                  <p className="mt-3 text-xs leading-5 text-concrete">{p.body}</p>
                </article>
              </Reveal>
            ))}
          </div>
          <p className="mt-6 text-xs text-steel">
            pricing and one-pagers travel by conversation, not by download.
          </p>
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────────── */}
      <section className="mx-auto max-w-3xl px-4 py-24 text-center">
        <p className="text-xs tracking-[0.3em] text-signal uppercase">
          03_HANDSHAKE
        </p>
        <h2 className="mt-4 font-heading text-5xl uppercase text-beige sm:text-6xl">
          Talk to us.
        </h2>
        <p className="mt-6 text-sm text-concrete">
          One email. We reply fast — usually from the dungeons.
        </p>
        <Button
          asChild
          size="lg"
          className="mt-8 bg-signal px-10 text-on-signal font-bold tracking-[0.2em] uppercase hover:bg-signal/80"
        >
          <a href={`mailto:${SITE.email}?subject=POWER%20THE%20BLOC`}>
            {SITE.email}
          </a>
        </Button>
      </section>
    </main>
  );
}
