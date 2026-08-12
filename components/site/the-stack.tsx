"use client";

import { useState } from "react";
import { PhotoCompare } from "@/components/site/photo-compare";

const FLOORS = [
  {
    id: "dorms",
    name: "Dorms",
    before:
      "Sleeping floor. Bunks and dorm space for founders crashing during builds and hackathons.",
    after:
      "Full residency floor — founders living where they build. First wave gets first pick.",
    file: "photos/stack-bunks.jpg",
    beforePhoto: "/photos/stack-dorms-before.webp",
    afterPhoto: "/photos/stack-dorms-after.webp",
  },
  {
    id: "social",
    name: "Office",
    before:
      "The social floor. Meetups, demos, long tables, and the room where the house actually gathers.",
    after:
      "Event hall for 100+. Talks, demo nights, and the room that runs the house calendar.",
    file: "photos/stack-commons.jpg",
    beforePhoto: "/photos/stack-office-before.webp",
    afterPhoto: "/photos/stack-office-after.webp",
  },
  {
    id: "office",
    name: "Studio",
    before:
      "Hacklab office and studio. Day-to-day work floor — desks, recording, and shipping in progress.",
    after:
      "Expanded production studio and founder workspace. More desks, more builds, more signal.",
    file: "photos/stack-commons.jpg",
    beforePhoto: "/photos/stack-studio-before.webp",
    afterPhoto: "/photos/stack-studio-after.webp",
  },
  {
    id: "garden",
    name: "Garden",
    before:
      "Outdoor yard and BBQ. Soft entry into the bloc — grill smoke, whiteboards, stranger friends.",
    after:
      "Year-round garden kitchen. Soft entry stays; capacity and weatherproofing grow.",
    file: "photos/stack-garden.jpg",
    beforePhoto: "/photos/stack-garden-before.webp",
    afterPhoto: "/photos/stack-garden-after.webp",
  },
  {
    id: "dungeons",
    name: "Dungeons",
    before:
      "Hardware lab below street level, run with Epicor. Solder, CNC, GPUs.",
    after:
      "Full hardware dungeon — more stations, more machines, space for bigger builds.",
    file: "photos/stack-dungeons.jpg",
    beforePhoto: "/photos/stack-dungeons-before.webp",
    afterPhoto: "/photos/stack-dungeons-after.webp",
  },
] as const;

export function TheStack() {
  const [active, setActive] = useState<(typeof FLOORS)[number]["id"]>("social");
  const [pos, setPos] = useState(50);
  const floor = FLOORS.find((f) => f.id === active)!;
  const body = pos >= 50 ? floor.before : floor.after;

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
        <PhotoCompare
          label={floor.name}
          before={floor.beforePhoto}
          after={floor.afterPhoto}
          ratio="4/3"
          className="min-h-[40vh] w-full sm:min-h-[48vh]"
          value={pos}
          onChange={setPos}
        />

        <div className="relative mt-5 grid text-base leading-8 text-concrete sm:text-lg sm:leading-9">
          {FLOORS.flatMap((f) => [f.before, f.after]).map((text) => (
            <p
              key={text}
              className={`[grid-area:1/1] ${text === body ? "" : "invisible"}`}
            >
              {text}
            </p>
          ))}
        </div>
      </div>
    </div>
  );
}
