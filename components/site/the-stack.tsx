"use client";

import { useState } from "react";
import { PhotoSlot } from "@/components/site/photo-slot";

const FLOORS = [
  {
    id: "dorms",
    name: "Dorms",
    body: "Sleeping floor. Bunks and dorm space for founders crashing during builds and hackathons.",
    file: "photos/stack-bunks.jpg",
  },
  {
    id: "social",
    name: "Social",
    body: "The social floor. Meetups, demos, long tables, and the room where the house actually gathers.",
    file: "photos/stack-commons.jpg",
  },
  {
    id: "office",
    name: "Office & Studio",
    body: "Hacklab office and studio. Day-to-day work floor — desks, recording, and shipping in progress.",
    file: "photos/stack-commons.jpg",
  },
  {
    id: "garden",
    name: "Garden",
    body: "Outdoor yard and BBQ. Soft entry into the bloc — grill smoke, whiteboards, stranger friends.",
    file: "photos/stack-garden.jpg",
  },
  {
    id: "dungeons",
    name: "Dungeons",
    body: "Hardware lab below street level, run with Epicor. Solder, CNC, GPUs.",
    file: "photos/stack-dungeons.jpg",
  },
] as const;

export function TheStack() {
  const [active, setActive] = useState<(typeof FLOORS)[number]["id"]>("social");
  const floor = FLOORS.find((f) => f.id === active)!;

  return (
    <div className="grid gap-8 md:grid-cols-[minmax(12rem,0.7fr)_minmax(0,1.8fr)] md:gap-12 lg:gap-16">
      <ul className="flex flex-col border-y border-border" role="tablist" aria-label="Floors">
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

      <div>
        <p className="text-base leading-8 text-concrete sm:text-lg sm:leading-9">
          {floor.body}
        </p>
        <PhotoSlot
          label={floor.name}
          file={floor.file}
          ratio="4/3"
          className="mt-6 min-h-[40vh] w-full sm:min-h-[48vh]"
        />
      </div>
    </div>
  );
}
