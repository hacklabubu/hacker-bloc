import Image from "next/image";
import type { LumaEvent } from "@/lib/luma";
import { isHackathon } from "@/lib/luma";

export function eventDate(e: LumaEvent) {
  return new Date(e.startAt).toLocaleString("en-GB", {
    weekday: "short",
    day: "2-digit",
    month: "short",
    timeZone: e.timezone,
  });
}

export function eventTime(e: LumaEvent) {
  return new Date(e.startAt).toLocaleString("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
    timeZone: e.timezone,
  });
}

export function EventCard({ event, past = false }: { event: LumaEvent; past?: boolean }) {
  return (
    <article className="group flex h-full flex-col border border-border bg-charcoal transition-colors hover:border-signal/60">
      {event.coverUrl && (
        <div className="relative overflow-hidden border-b border-border" style={{ aspectRatio: "16/9" }}>
          <Image
            src={event.coverUrl}
            alt={event.name}
            fill
            sizes="(max-width: 768px) 100vw, 33vw"
            className="object-cover opacity-80 transition-opacity group-hover:opacity-100"
          />
        </div>
      )}
      <div className="flex flex-1 flex-col p-4">
        <div className="flex items-baseline justify-between gap-2 text-[10px] tracking-[0.2em] uppercase">
          <span className="text-signal">
            {eventDate(event)}{" // "}{eventTime(event)}
          </span>
          <span className={isHackathon(event) ? "text-rust" : "text-steel"}>
            {isHackathon(event) ? "hackathon" : "meetup"}
          </span>
        </div>
        <h3 className="mt-2 flex-1 text-sm font-bold uppercase tracking-widest text-beige">
          {event.name}
        </h3>
        {event.address && (
          <p className="mt-2 text-[10px] tracking-[0.15em] text-concrete uppercase">
            ◉ {event.address}
          </p>
        )}
        <a
          href={event.url}
          target="_blank"
          rel="noreferrer"
          className={`mt-4 border px-3 py-1.5 text-center text-[10px] font-bold tracking-[0.25em] uppercase transition-colors ${
            past
              ? "border-steel text-concrete hover:border-signal hover:text-signal"
              : "border-signal text-signal hover:bg-signal hover:text-on-signal"
          }`}
        >
          {past ? "view log →" : "RSVP →"}
        </a>
      </div>
    </article>
  );
}
