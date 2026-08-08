import { LUMA } from "@/lib/site";

/*
 * Server-side reads of the public Luma calendar feed. Unofficial but
 * unauthenticated endpoint — every consumer must survive it failing,
 * so all fetchers resolve to empty arrays on any error.
 */

export type LumaEvent = {
  apiId: string;
  name: string;
  url: string; // full RSVP url on luma.com
  startAt: string; // ISO
  endAt: string; // ISO
  timezone: string;
  coverUrl: string | null;
  address: string | null;
  waitlist: boolean;
};

type RawEntry = {
  event: {
    api_id: string;
    name: string;
    url: string;
    start_at: string;
    end_at: string;
    timezone: string;
    cover_url?: string;
    geo_address_info?: { short_address?: string };
    waitlist_enabled?: boolean;
  };
};

function mapEntry(entry: RawEntry): LumaEvent {
  const e = entry.event;
  return {
    apiId: e.api_id,
    name: e.name,
    url: `https://luma.com/${e.url}`,
    startAt: e.start_at,
    endAt: e.end_at,
    timezone: e.timezone,
    coverUrl: e.cover_url ?? null,
    address: e.geo_address_info?.short_address ?? null,
    waitlist: e.waitlist_enabled ?? false,
  };
}

async function fetchPeriod(period: "future" | "past"): Promise<LumaEvent[]> {
  try {
    const res = await fetch(
      `https://api.lu.ma/calendar/get-items?calendar_api_id=${LUMA.calendarApiId}&period=${period}&pagination_limit=50`,
      { next: { revalidate: 1800 } }
    );
    if (!res.ok) return [];
    const data = (await res.json()) as { entries?: RawEntry[] };
    const events = (data.entries ?? []).map(mapEntry);
    // future arrives soonest-first, past newest-first; keep both explicit
    events.sort((a, b) =>
      period === "future"
        ? a.startAt.localeCompare(b.startAt)
        : b.startAt.localeCompare(a.startAt)
    );
    return events;
  } catch {
    return [];
  }
}

export const getUpcomingEvents = () => fetchPeriod("future");
export const getPastEvents = () => fetchPeriod("past");

export function isHackathon(e: LumaEvent) {
  return /hackathon|bazaar/i.test(e.name);
}

/* proof-strip numbers derived from the live calendar */
export async function getCounters() {
  const [past, future] = await Promise.all([getPastEvents(), getUpcomingEvents()]);
  const now = Date.now();
  const weekAhead = now + 7 * 86400 * 1000;
  return {
    eventsThisWeek: future.filter((e) => {
      const t = new Date(e.startAt).getTime();
      return t >= now && t <= weekAhead;
    }).length,
    hackathonsRun: past.filter(isHackathon).length,
    eventsRun: past.length,
    /* ~40 heads per BBQ-scale event is the house estimate until Luma
       guest counts are public */
    buildersThroughTheDoor: past.length * 40,
    nextEvent: future[0] ?? null,
  };
}
