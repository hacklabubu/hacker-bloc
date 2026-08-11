import type { LumaEvent } from "@/lib/luma";

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

export function EventCard({
  event,
  past = false,
}: {
  event: LumaEvent;
  past?: boolean;
}) {
  return (
    <a
      href={event.url}
      target="_blank"
      rel="noreferrer"
      className="group flex flex-col border border-border bg-charcoal px-5 py-5 transition-colors hover:border-signal sm:px-6 sm:py-6"
    >
      <time
        dateTime={event.startAt}
        className={`text-xs tracking-[0.2em] uppercase ${
          past ? "text-steel" : "text-signal"
        }`}
      >
        {eventDate(event)}
        <span className="text-steel"> · </span>
        {eventTime(event)}
      </time>
      <h3 className="mt-3 text-base font-medium leading-snug text-beige transition-colors group-hover:text-signal sm:text-lg">
        {event.name}
      </h3>
      {event.address && (
        <p className="mt-auto pt-4 text-xs text-concrete">{event.address}</p>
      )}
    </a>
  );
}
