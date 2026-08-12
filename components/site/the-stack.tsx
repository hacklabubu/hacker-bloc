"use client";

import { useState } from "react";
import { PhotoSlot } from "@/components/site/photo-slot";

type Phase = "before" | "after";

const FLOORS = [
  {
    id: "dorms",
    name: "Dorms",
    before:
      "Sleeping floor. Bunks and dorm space for founders crashing during builds and hackathons.",
    after:
      "Full residency floor — founders living where they build. First wave gets first pick.",
    file: "photos/stack-bunks.jpg",
  },
  {
    id: "social",
    name: "Social",
    before:
      "The social floor. Meetups, demos, long tables, and the room where the house actually gathers.",
    after:
      "Event hall for 100+. Talks, demo nights, and the room that runs the house calendar.",
    file: "photos/stack-commons.jpg",
  },
  {
    id: "office",
    name: "Office & Studio",
    before:
      "Hacklab office and studio. Day-to-day work floor — desks, recording, and shipping in progress.",
    after:
      "Expanded production studio and founder workspace. More desks, more builds, more signal.",
    file: "photos/stack-commons.jpg",
  },
  {
    id: "garden",
    name: "Garden",
    before:
      "Outdoor yard and BBQ. Soft entry into the bloc — grill smoke, whiteboards, stranger friends.",
    after:
      "Year-round garden kitchen. Soft entry stays; capacity and weatherproofing grow.",
    file: "photos/stack-garden.jpg",
  },
  {
    id: "dungeons",
    name: "Dungeons",
    before:
      "Hardware lab below street level, run with Epicor. Solder, CNC, GPUs.",
    after:
      "Full hardware dungeon — more stations, more machines, space for bigger builds.",
    file: "photos/stack-dungeons.jpg",
  },
] as const;

export function TheStack() {
  const [active, setActive] = useState<(typeof FLOORS)[number]["id"]>("social");
  const [phase, setPhase] = useState<Phase>("before");
  const floor = FLOORS.find((f) => f.id === active)!;
  const body = phase === "before" ? floor.before : floor.after;

  return (
    <div className="grid gap-8 md:grid-cols-[minmax(12rem,0.7fr)_minmax(0,1.8fr)] md:gap-12 lg:gap-16">
      <ul
        className="flex flex-col border-y border-border"
        role="tablist"
        aria-label="Floors"
      >
        {FLOORS.map((f) => (
          <li key={f.id} className="border-b border-border last:border-b-0">
            <button
              type="button"
              role="tab"
              aria-selected={active === f.id}
              onClick={() => setActive(f.id)}
              className={`w-full px-0 py-4 text-left text-lg uppercase tracking-widest transition-colors sm:text-xl ${
                active === f.id
                  ? "text-signal"
                  : "text-concrete hover:text-beige"
              }`}
            >
              {f.name}
            </button>
          </li>
        ))}
      </ul>

      <div className="flex flex-col">
        <PhotoSlot
          label={floor.name}
          file={floor.file}
          ratio="4/3"
          className="min-h-[40vh] w-full sm:min-h-[48vh]"
        />

        <div className="mt-6 flex items-center gap-2">
          <div
            className="flex border border-border text-xs tracking-[0.2em] uppercase"
            role="tablist"
            aria-label="Investment phase"
          >
            {(["before", "after"] as const).map((p) => (
              <button
                key={p}
                type="button"
                role="tab"
                aria-selected={phase === p}
                onClick={() => setPhase(p)}
                className={`px-4 py-2 transition-colors ${
                  phase === p
                    ? "bg-signal font-bold text-on-signal"
                    : "text-concrete hover:text-beige"
                }`}
              >
                {p === "before" ? "Before" : "After"} investment
              </button>
            ))}
          </div>
        </div>

        <p className="mt-5 text-base leading-8 text-concrete sm:text-lg sm:leading-9">
          {body}
        </p>
      </div>
    </div>
  );
}
