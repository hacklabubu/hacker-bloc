import { getUpcomingEvents, type LumaEvent } from "@/lib/luma";
import { getMembershipStats } from "@/lib/members";
import { ROADMAP } from "@/lib/membership";
import { getPeople, type Person } from "@/lib/people";

/*
 * Photos of the house for the landing page. `src` under public/photos; while
 * it is missing the page draws a labelled placeholder instead, so the layout
 * is ready the day the pictures land.
 */
export const HOME_PHOTOS: readonly { label: string; alt: string; src?: string }[] = [
  { label: "the bench", alt: "The workbench on floor 0" },
  { label: "an event", alt: "The crowd at a house event" },
  { label: "the dungeon", alt: "The hardware lab in the basement" },
];

export type HomeSignals = {
  /* Accounts on the list, or null to hide. */
  people: number | null;
  /* Paid memberships and the next roadmap milestone, or null to hide. */
  roadmap: { claimed: number; next: number; version: string } | null;
  /* Next event, or null to hide. */
  event: LumaEvent | null;
};

/* Everything the landing page shows that changes on its own. */
export async function getHomeData(): Promise<{
  people: Person[];
  upcoming: LumaEvent[];
  signals: HomeSignals;
}> {
  const [people, stats, upcoming] = await Promise.all([
    getPeople(),
    getMembershipStats(),
    getUpcomingEvents(),
  ]);
  const list = people ?? [];
  const claimed = stats?.claimed ?? 0;
  const nextMilestone = ROADMAP.find((m) => m.hackers > claimed);
  return {
    people: list,
    upcoming,
    signals: {
      people: list.length > 0 ? list.length : null,
      roadmap:
        claimed > 0 && nextMilestone
          ? { claimed, next: nextMilestone.hackers, version: nextMilestone.version }
          : null,
      event: upcoming[0] ?? null,
    },
  };
}
