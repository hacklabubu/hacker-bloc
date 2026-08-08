import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Countdown } from "@/components/site/countdown";
import { PhotoSlot } from "@/components/site/photo-slot";
import { Reveal } from "@/components/site/reveal";
import { ALIEN_BAZAAR, PARTNERS, SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "Alien Bazaar",
  description:
    "100 builders. Hardware only. Built in the dungeons. Sept 19, 2026 at Hacker Bloc, Warsaw.",
};

const SHOTS = [
  { file: "photos/bazaar-01.jpg", label: "hackathon_000" },
  { file: "photos/bazaar-02.jpg", label: "the_dungeons" },
  { file: "photos/bazaar-03.jpg", label: "hardware_only" },
  { file: "photos/bazaar-04.jpg", label: "no_daylight" },
] as const;

const TRANSMISSION = [
  { k: "builders", v: "100" },
  { k: "software-only projects", v: "00" },
  { k: "floors below street", v: "01" },
  { k: "daylight", v: "n/a" },
] as const;

const PROTOCOL = [
  {
    glyph: "[⚙]",
    title: "Hardware only",
    body: "If it doesn't have wires, motors, sensors, or solder, it doesn't enter. Demos run on the bench, not on localhost.",
  },
  {
    glyph: "[▼]",
    title: "Built in the dungeons",
    body: "The lab below street level, run with Epicor. CNC, solder stations, salvaged GPUs, and enough spare parts to get weird.",
  },
  {
    glyph: "[⚑]",
    title: "Descended from #000",
    body: "HACKLAB HACKATHON #0 proved the dungeons work. Alien Bazaar is the same energy at 10× the scale.",
  },
] as const;

export default function AlienBazaarPage() {
  return (
    <main className="flex-1">
      {/* ── HERO ─────────────────────────────────────────── */}
      <section className="border-b border-signal/30">
        <div className="mx-auto max-w-6xl px-4 pt-16 pb-12 sm:pt-24">
          <p className="mb-4 text-xs tracking-[0.35em] text-signal uppercase">
            incoming transmission // 2026-09-19 // the dungeons
          </p>
          <h1 className="hb-glitch font-heading text-[clamp(3.5rem,12vw,8.5rem)] leading-[0.9] uppercase text-signal">
            Alien
            <br />
            Bazaar
          </h1>
          <p className="mt-6 max-w-md text-sm leading-6 text-concrete">
            One day. One hundred builders underground at{" "}
            <span className="text-beige">{SITE.address.split(",")[0]}</span>.
            Machines get built, machines get traded, some machines escape.
          </p>
        </div>
      </section>

      {/* ── COUNTDOWN ────────────────────────────────────── */}
      <section className="border-b border-border bg-asphalt">
        <div className="mx-auto max-w-6xl px-4 py-16">
          <Countdown target={ALIEN_BAZAAR.date} className="border border-border" />
          <p className="mt-8 text-center text-sm tracking-[0.2em] text-beige uppercase sm:text-lg">
            100 builders. Hardware only. Built in the dungeons.
          </p>
          <dl className="mx-auto mt-10 grid max-w-3xl grid-cols-2 divide-x divide-border border border-border lg:grid-cols-4">
            {TRANSMISSION.map(({ k, v }) => (
              <div key={k} className="px-3 py-4 text-center">
                <dd className="font-(family-name:--font-tech) text-2xl text-signal">
                  {v}
                </dd>
                <dt className="mt-1 text-[9px] tracking-[0.2em] text-concrete uppercase">
                  {k}
                </dt>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* ── PROTOCOL ─────────────────────────────────────── */}
      <section className="mx-auto max-w-6xl px-4 py-20">
        <div className="mb-10 flex flex-wrap items-baseline gap-4 border-b border-border pb-3">
          <span className="text-xs tracking-[0.3em] text-signal">01_PROTOCOL</span>
          <h2 className="font-heading text-3xl sm:text-4xl uppercase tracking-wide text-beige">
            The rules of the Bazaar
          </h2>
        </div>
        <div className="grid gap-px bg-border sm:grid-cols-3">
          {PROTOCOL.map((p, i) => (
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
      </section>

      {/* ── DUNGEON SHOTS ────────────────────────────────── */}
      <section className="border-y border-border bg-asphalt">
        <div className="mx-auto max-w-6xl px-4 py-20">
          <div className="mb-10 flex flex-wrap items-baseline gap-4 border-b border-border pb-3">
            <span className="text-xs tracking-[0.3em] text-signal">02_EVIDENCE</span>
            <h2 className="font-heading text-3xl sm:text-4xl uppercase tracking-wide text-beige">
              From hackathon #000
            </h2>
          </div>
          <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
            {SHOTS.map((s, i) => (
              <Reveal key={s.file} delay={i * 60}>
                <PhotoSlot label={s.label} file={s.file} ratio="4/3" />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────────── */}
      <section className="mx-auto max-w-3xl px-4 py-24 text-center">
        <p className="text-xs tracking-[0.3em] text-signal uppercase">
          03_DOCKING
        </p>
        <h2 className="mt-4 font-heading text-5xl uppercase text-beige sm:text-7xl">
          Enter the Bazaar.
        </h2>
        <p className="mt-6 text-sm text-concrete">
          Registration opens on the calendar. 100 slots, zero spectators —
          come to build or come to trade.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Button
            asChild
            size="lg"
            className="bg-signal px-10 text-on-signal font-bold tracking-[0.2em] uppercase hover:bg-signal/80"
          >
            <a href={ALIEN_BAZAAR.registerUrl} target="_blank" rel="noreferrer">
              Enter the Bazaar →
            </a>
          </Button>
          <Button
            asChild
            size="lg"
            variant="outline"
            className="border-steel px-10 tracking-[0.2em] uppercase text-concrete hover:text-beige"
          >
            <Link href="/come-over">Built at Hacker Bloc</Link>
          </Button>
        </div>
        <p className="mt-6 text-xs text-steel">
          powered by {PARTNERS.operating.name.toLowerCase()} — {PARTNERS.operating.role}
        </p>
      </section>
    </main>
  );
}
