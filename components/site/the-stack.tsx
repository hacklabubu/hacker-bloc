"use client";

import { useState } from "react";
import { PhotoSlot } from "@/components/site/photo-slot";

type Phase = "now" | "after";

const LEVELS = [
  {
    id: "L4",
    name: "The Roof",
    ascii: "╥ )))",
    now: "Antenna farm and a view over Wilanów. Beers after demo night, satellites overhead.",
    after: "Rooftop garden + open-air cinema. The best standup spot in Warsaw, literally.",
    file: "photos/stack-roof.jpg",
  },
  {
    id: "L3",
    name: "The Bunks",
    ascii: "█ ▒ █ ▒",
    now: "Crash floor for hackathon weekends. Sleeping bags, ethernet to every pillow.",
    after: "Full residency floor — founders living where they build. First wave gets first pick.",
    file: "photos/stack-bunks.jpg",
  },
  {
    id: "L2",
    name: "The Commons",
    ascii: "▛ ▜ ▟ ▙",
    now: "Demo wall, projector, and the long table where every meetup ends up.",
    after: "Event hall for 100+. Talks, demo nights, and the occasional small fire.",
    file: "photos/stack-commons.jpg",
  },
  {
    id: "L1",
    name: "The Garden",
    ascii: "❀ ▒ ❀ ▒",
    now: "BBQ every Saturday. Grill smoke, whiteboards, and stranger friends.",
    after: "Year-round garden kitchen. The soft entry point into the bloc.",
    file: "photos/stack-garden.jpg",
  },
  {
    id: "L0",
    name: "The Dungeons",
    ascii: "▓▓▓▓▓▓",
    now: "Hardware lab below street level, run with Epicor. Solder, CNC, salvaged GPUs.",
    after: "Full hardware dungeon — where Alien Bazaar is built. 100 builders, no daylight.",
    file: "photos/stack-dungeons.jpg",
  },
] as const;

export function TheStack() {
  const [active, setActive] = useState<(typeof LEVELS)[number]["id"]>("L2");
  const [phase, setPhase] = useState<Phase>("now");
  const level = LEVELS.find((l) => l.id === active)!;

  return (
    <div className="border border-border bg-charcoal">
      {/* header row: cross-section label + NOW/AFTER toggle */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border px-4 py-2">
        <span className="text-[10px] tracking-[0.25em] text-concrete uppercase">
          cross_section // blok_07
        </span>
        <div className="flex border border-border text-[10px] tracking-[0.25em] uppercase" role="tablist" aria-label="Timeline">
          {(["now", "after"] as const).map((p) => (
            <button
              key={p}
              role="tab"
              aria-selected={phase === p}
              onClick={() => setPhase(p)}
              className={`px-4 py-1.5 transition-colors ${
                phase === p
                  ? "bg-signal font-bold text-on-signal"
                  : "text-concrete hover:text-beige"
              }`}
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      <div className="grid md:grid-cols-[1fr_1.2fr]">
        {/* clickable building levels */}
        <div className="flex flex-col border-b border-border md:border-r md:border-b-0" role="tablist" aria-label="Building levels">
          {LEVELS.map((l) => (
            <button
              key={l.id}
              role="tab"
              aria-selected={active === l.id}
              onClick={() => setActive(l.id)}
              className={`group flex items-center gap-4 border-b border-border px-4 py-4 text-left transition-colors last:border-b-0 ${
                active === l.id ? "bg-asphalt" : "hover:bg-asphalt/60"
              }`}
            >
              <span
                className={`font-(family-name:--font-tech) text-sm font-bold ${
                  active === l.id ? "text-signal" : "text-steel"
                }`}
              >
                {l.id}
              </span>
              <span
                className={`flex-1 text-sm uppercase tracking-widest ${
                  active === l.id ? "text-beige" : "text-concrete"
                }`}
              >
                {l.name}
              </span>
              <span
                className={`hidden text-xs sm:inline ${
                  active === l.id ? "text-signal" : "text-steel"
                }`}
                aria-hidden
              >
                {l.ascii}
              </span>
            </button>
          ))}
        </div>

        {/* active level detail */}
        <div className="p-5 sm:p-6">
          <div className="flex items-baseline justify-between gap-4">
            <h3 className="font-heading text-2xl uppercase text-beige sm:text-3xl">
              {level.name}
            </h3>
            <span className="text-[10px] tracking-[0.25em] text-signal uppercase">
              {phase === "now" ? "status // live" : "status // planned"}
            </span>
          </div>
          <p className="mt-4 min-h-16 text-sm leading-6 text-concrete">
            {phase === "now" ? level.now : level.after}
          </p>
          <PhotoSlot
            label={`${level.id} — ${level.name}`}
            file={level.file}
            ratio="16/9"
            className="mt-4"
          />
        </div>
      </div>
    </div>
  );
}
