import type { Metadata } from "next";
import Image from "next/image";
import { formatEventDate, getPastEvents, getUpcomingEvents, type LumaEvent } from "@/lib/luma";
import { LUMA } from "@/lib/site";
import styles from "./events.module.css";

export const metadata: Metadata = {
  title: "Events",
  description:
    "Meetups, workshops, and hackathons at Hacker Bloc in Warsaw. See upcoming events and RSVP on Luma.",
  alternates: { canonical: "/events" },
};

function EventDate({ event }: { event: LumaEvent }) {
  const formatted = formatEventDate(event);

  if (!formatted) {
    return <span>Date to be announced</span>;
  }

  return (
    <time dateTime={event.startAt}>
      {formatted.label} ({formatted.timezone})
    </time>
  );
}

function EventList({ events }: { events: LumaEvent[] }) {
  return (
    <ul className={styles.list}>
      {events.map((event) => (
        <li key={event.apiId} className={`${styles.event} ${event.coverUrl ? styles.withPhoto : ""}`}>
          {event.coverUrl && (
            <a href={event.url} className={styles.cover} aria-label={`View ${event.name} on Luma`}>
              <Image
                src={event.coverUrl}
                alt=""
                fill
                sizes="(max-width: 480px) 80px, 128px"
                className={styles.image}
              />
            </a>
          )}
          <div>
          <p className={styles.details}><EventDate event={event} /></p>
          <h3 className={styles.title}>
            <a href={event.url}>
              {event.name} <span aria-hidden="true">↗</span>
            </a>
          </h3>
          {event.address && <p className={styles.details}>{event.address}</p>}
          </div>
        </li>
      ))}
    </ul>
  );
}

export default async function EventsPage() {
  const [upcoming, past] = await Promise.all([getUpcomingEvents(), getPastEvents()]);

  return (
    <main className="terminal-page">
      <section className="terminal-intro" aria-labelledby="events-heading">
        <h1 id="events-heading">Events</h1>
        <p>
          Meetups, workshops, and hackathons at the bloc. Find your next event
          and RSVP on Luma.
        </p>
        <a href={LUMA.calendarUrl} className={`terminal-button ${styles.calendar}`}>
          Open the calendar <span aria-hidden="true">↗</span>
        </a>
      </section>

      <section className="terminal-section" aria-labelledby="upcoming-heading">
        <h2 id="upcoming-heading" className="terminal-legend">Upcoming</h2>
        <div className="terminal-section-content">
          {upcoming.length > 0 ? (
            <EventList events={upcoming.slice(0, 8)} />
          ) : (
            <p className="terminal-muted">
              No upcoming events to show here right now. Check the{" "}
              <a href={LUMA.calendarUrl} className={styles.link}>calendar</a> for the latest.
            </p>
          )}
        </div>
      </section>

      {past.length > 0 && (
        <section className="terminal-section" aria-labelledby="past-heading">
          <h2 id="past-heading" className="terminal-legend">Recently at the bloc</h2>
          <div className="terminal-section-content">
            <EventList events={past.slice(0, 5)} />
          </div>
        </section>
      )}
    </main>
  );
}
