import { Button } from "@/components/ui/button";
import { AsciiBlock } from "@/components/site/ascii-block";
import { BootSequence } from "@/components/site/boot-sequence";
import { Reveal } from "@/components/site/reveal";
import { StatusBar } from "@/components/site/status-bar";
import { Ticker } from "@/components/site/ticker";

const PRINCIPLES = [
  {
    glyph: "[#]",
    title: "Build together",
    body: "We share space, skills, and tools. Everything in the block is stronger when we build it together.",
  },
  {
    glyph: "[★]",
    title: "Eastern grit",
    body: "From concrete roots. Practical, resilient, no-nonsense. The block survived worse than your prod outage.",
  },
  {
    glyph: "</>",
    title: "Open systems",
    body: "Open source, open doors, open minds. Knowledge wants to be free, and so does the wifi password.",
  },
  {
    glyph: "[⚡]",
    title: "Ship fast",
    body: "Iterate, deploy, break, fix, repeat. Progress over perfection, demos over decks.",
  },
  {
    glyph: "[▯]",
    title: "House for builders",
    body: "A home for hackers, makers, and misfits who build the future instead of pitching it.",
  },
  {
    glyph: "((•))",
    title: "Signal over status",
    body: "Signal quality beats ego. Stay connected to what really matters, mute the rest.",
  },
];

const LOG = [
  { t: "2026-08-01 21:37", tag: "DEMO_NIGHT", msg: "14 projects shipped live from the common room. 2 caught fire (one literally)." },
  { t: "2026-07-28 03:12", tag: "SERVER_CLOSET", msg: "resident NIGHTBUS racked a salvaged GPU node. cluster now heats floor 3." },
  { t: "2026-07-25 19:00", tag: "OPEN_HOUSE", msg: "doors open. strangers became stranger friends. 6 new applications." },
  { t: "2026-07-20 11:45", tag: "WORKSHOP", msg: "hardware sunday: CNC'd a new door sign. old one stolen (flattered)." },
  { t: "2026-07-14 23:59", tag: "ROOFTOP", msg: "antenna upgrade complete. we can now hear satellites gossip." },
  { t: "2026-07-09 08:30", tag: "KITCHEN", msg: "pierogi_daemon pushed breakfast v2.1.0 — zero downtime deployment." },
];

const FACILITIES = [
  "gigabit fiber",
  "24/7 access",
  "workshop + solder lab",
  "server closet",
  "shared kitchen",
  "laundry",
  "bike room",
  "rooftop view",
  "demo wall + projector",
  "quiet floor (real quiet)",
];

const RESIDENTS = [
  { id: "HB-01", name: "SYNAPSE", role: "builder", clearance: 7 },
  { id: "HB-02", name: "VOIVODE", role: "hardware", clearance: 5 },
  { id: "HB-03", name: "MILKBAR", role: "design engineer", clearance: 4 },
  { id: "HB-07", name: "ZORZA", role: "ml research", clearance: 6 },
  { id: "HB-11", name: "PIEROGI_DAEMON", role: "infra", clearance: 5 },
  { id: "HB-13", name: "NIGHTBUS", role: "security", clearance: 7 },
];

const SPONSORS = [
  { name: "VISTULA COMPUTE", gives: "gpu credits" },
  { name: "SOLDER & SONS", gives: "hardware lab" },
  { name: "KAWA://OS", gives: "infinite coffee" },
  { name: "NIGHTSHIFT ROBOTICS", gives: "workshop machines" },
  { name: "PEWNY.VC", gives: "first checks" },
  { name: "ZAKŁAD MECHANICZNY №7", gives: "steel + welding" },
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

export default function Home() {
  return (
    <main id="top" className="flex-1">
      <BootSequence />
      <StatusBar />

      {/* ── HERO ─────────────────────────────────────────── */}
      <section className="mx-auto grid max-w-6xl gap-10 px-4 pt-16 pb-12 sm:pt-24 md:grid-cols-[1.2fr_1fr] md:items-center">
        <div>
          <p className="mb-4 text-xs tracking-[0.35em] text-signal uppercase">
            hacker house // warsaw, pl — est. 2026
          </p>
          <h1 className="hb-glitch font-heading text-[clamp(3.5rem,12vw,8.5rem)] leading-[0.9] uppercase text-beige">
            Hacker
            <br />
            Block
          </h1>
          <p className="mt-6 max-w-md text-sm leading-6 text-concrete">
            A brutalist housing block turned underground infrastructure. A
            place to live, build, and share signal — anonymous, open,
            resilient. Built for builders, dreamers, and digital misfits.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button
              asChild
              className="bg-signal text-[#051a10] font-bold tracking-widest uppercase hover:bg-signal/80"
            >
              <a href="#apply">Apply to stay</a>
            </Button>
            <Button
              asChild
              variant="outline"
              className="border-steel tracking-widest uppercase text-concrete hover:text-beige"
            >
              <a href="#signal-log">Read the log</a>
            </Button>
          </div>
          <dl className="mt-10 grid max-w-md grid-cols-3 divide-x divide-border border border-border text-center">
            {[
              ["residents", "22"],
              ["nodes online", "07"],
              ["free bunks", "04"],
            ].map(([k, v]) => (
              <div key={k} className="px-2 py-3">
                <dt className="text-[10px] tracking-[0.2em] text-concrete uppercase">
                  {k}
                </dt>
                <dd className="mt-1 font-(family-name:--font-tech) text-2xl text-signal">
                  {v}
                </dd>
              </div>
            ))}
          </dl>
        </div>
        <div className="justify-self-center md:justify-self-end">
          <AsciiBlock />
        </div>
      </section>

      <Ticker />

      {/* ── PRINCIPLES ───────────────────────────────────── */}
      <section className="mx-auto max-w-6xl px-4 py-20">
        <SectionHeading code="01_PROTOCOL" title="House rules of the block" />
        <div className="grid gap-px bg-border sm:grid-cols-2 lg:grid-cols-3">
          {PRINCIPLES.map((p, i) => (
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

      {/* ── SIGNAL LOG ───────────────────────────────────── */}
      <section id="signal-log" className="border-y border-border bg-asphalt">
        <div className="mx-auto max-w-6xl px-4 py-20">
          <SectionHeading code="02_SIGNAL_LOG" title="What's happening" />
          <div className="border border-border bg-charcoal">
            <div className="flex items-center justify-between border-b border-border px-4 py-2 text-[10px] tracking-[0.25em] text-concrete uppercase">
              <span>tail -f /var/log/block.log</span>
              <span className="text-signal">live</span>
            </div>
            <div className="p-4 sm:p-6 text-xs sm:text-sm leading-7">
              {LOG.map((e, i) => (
                <Reveal key={e.t} delay={i * 80}>
                  <p className="flex flex-wrap gap-x-3">
                    <span className="text-steel">[{e.t}]</span>
                    <span className="text-signal">{e.tag}</span>
                    <span className="text-beige">:: {e.msg}</span>
                  </p>
                </Reveal>
              ))}
              <p className="mt-2 text-signal">
                <span className="text-steel">root@hacker-block:~#</span>{" "}
                <span className="hb-blink">█</span>
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── FACILITIES ───────────────────────────────────── */}
      <section className="mx-auto max-w-6xl px-4 py-20">
        <SectionHeading code="03_FACILITIES" title="Inside the block" />
        <ul className="grid gap-x-10 gap-y-3 text-sm sm:grid-cols-2 lg:grid-cols-3">
          {FACILITIES.map((f, i) => (
            <Reveal key={f} delay={i * 40}>
              <li className="flex items-center gap-3 border-b border-border/60 pb-3">
                <span className="text-signal">[x]</span>
                <span className="uppercase tracking-wider text-concrete">
                  {f}
                </span>
              </li>
            </Reveal>
          ))}
        </ul>
      </section>

      {/* ── RESIDENTS ────────────────────────────────────── */}
      <section className="border-y border-border bg-asphalt">
        <div className="mx-auto max-w-6xl px-4 py-20">
          <SectionHeading code="04_RESIDENTS" title="Nodes in the building" />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {RESIDENTS.map((r, i) => (
              <Reveal key={r.id} delay={i * 60}>
                <article className="group border border-border bg-charcoal p-5 transition-colors hover:border-signal/60">
                  <div className="flex items-center justify-between text-[10px] tracking-[0.25em] uppercase">
                    <span className="text-concrete">resident</span>
                    <span className="border border-border px-1.5 py-0.5 text-concrete">
                      clearance lvl {r.clearance}
                    </span>
                  </div>
                  <p className="mt-4 font-(family-name:--font-tech) text-2xl font-bold text-signal">
                    {r.id}
                  </p>
                  <p className="mt-1 text-sm uppercase tracking-widest text-beige">
                    {r.name}
                  </p>
                  <p className="mt-3 border-t border-border pt-3 text-xs uppercase tracking-[0.2em] text-concrete">
                    role :: {r.role}
                  </p>
                </article>
              </Reveal>
            ))}
          </div>
          <p className="mt-6 text-xs text-steel">
            * identities anonymized per block protocol. residents opt onto the
            wall, never onto the internet.
          </p>
        </div>
      </section>

      {/* ── SPONSORS ─────────────────────────────────────── */}
      <section className="mx-auto max-w-6xl px-4 py-20">
        <SectionHeading code="05_POWERED_BY" title="Sponsors of the signal" />
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
          <a
            href="mailto:core@hackerblock.wtf"
            className="text-concrete underline decoration-signal/50 underline-offset-4 hover:text-signal"
          >
            core@hackerblock.wtf
          </a>
        </p>
      </section>

      {/* ── APPLY ────────────────────────────────────────── */}
      <section id="apply" className="border-t border-border bg-asphalt">
        <div className="mx-auto max-w-3xl px-4 py-24 text-center">
          <p className="text-xs tracking-[0.3em] text-signal uppercase">
            06_ACCESS
          </p>
          <h2 className="mt-4 font-heading text-5xl sm:text-6xl uppercase text-beige">
            Live. Build.
            <br />
            Stay weird.
          </h2>
          <div className="mx-auto mt-8 max-w-md border border-border bg-charcoal p-4 text-left text-xs sm:text-sm">
            <p className="text-steel">root@hacker-block:~#</p>
            <p className="text-signal">
              ./apply --resident --bring=projects,stranger-friends
              <span className="hb-blink">█</span>
            </p>
          </div>
          <p className="mt-6 text-sm text-concrete">
            22 bunks. 4 free. No CVs — show us what you&apos;ve built or what
            you&apos;re dying to break.
          </p>
          <Button
            asChild
            size="lg"
            className="mt-8 bg-signal px-10 text-[#051a10] font-bold tracking-[0.2em] uppercase hover:bg-signal/80"
          >
            <a href="mailto:apply@hackerblock.wtf?subject=RESIDENT%20APPLICATION%20//%20HB">
              Apply to stay
            </a>
          </Button>
        </div>
      </section>

      {/* ── FOOTER ───────────────────────────────────────── */}
      <footer className="border-t border-border">
        <div className="mx-auto grid max-w-6xl gap-8 px-4 py-12 text-xs sm:grid-cols-3">
          <div>
            <p className="font-heading text-2xl uppercase text-beige">
              Hacker Block
            </p>
            <p className="mt-1 tracking-[0.25em] text-signal uppercase">
              hacker house for builders
            </p>
            <p className="mt-4 text-concrete">
              место силы для своих. строим будущее. живём сейчас. остаёмся на
              связи.
            </p>
          </div>
          <div className="text-concrete">
            <p className="tracking-[0.25em] uppercase text-steel">signal id</p>
            <p className="mt-2">HB-2026-05-17-WAW</p>
            <div className="hb-barcode mt-3 max-w-[220px]" aria-hidden />
            <p className="mt-3 uppercase tracking-widest">
              stay curious. question everything.
            </p>
          </div>
          <div className="text-concrete sm:text-right">
            <p>
              <span className="text-signal">◉</span> 52.2297° N, 21.0122° E
            </p>
            <p className="mt-1 uppercase tracking-widest">warsaw, pl</p>
            <p className="mt-4 text-steel">est. 2026 — cc by-nc-sa 4.0</p>
            <p className="mt-1 text-steel">
              a fictional demo brand. no aliens were housed.
            </p>
          </div>
        </div>
      </footer>
    </main>
  );
}
