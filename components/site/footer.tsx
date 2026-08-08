import Link from "next/link";
import { getUpcomingEvents } from "@/lib/luma";
import { PARTNERS, SITE, SOCIALS } from "@/lib/site";

function formatEventDate(iso: string, tz: string) {
  return new Date(iso).toLocaleString("en-GB", {
    weekday: "short",
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
    timeZone: tz,
  });
}

export async function SiteFooter() {
  const [next] = await getUpcomingEvents();

  return (
    <footer className="border-t border-border">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-12 text-xs sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <p className="font-heading text-2xl uppercase text-beige">
            Hacker Bloc
          </p>
          <p className="mt-1 tracking-[0.25em] text-signal uppercase">
            the bloc where warsaw builds
          </p>
          <p className="mt-4 font-bold uppercase tracking-widest text-beige">
            Free for founders, forever.
          </p>
          <div className="hb-barcode mt-4 max-w-[200px]" aria-hidden />
        </div>

        <div className="text-concrete">
          <p className="tracking-[0.25em] uppercase text-steel">find us</p>
          <a
            href={SITE.mapsUrl}
            target="_blank"
            rel="noreferrer"
            className="mt-2 block hover:text-signal"
          >
            <span className="text-signal">◉</span> {SITE.address}
          </a>
          <p className="mt-1 uppercase tracking-widest">
            {SITE.district}{" // "}{SITE.city}
          </p>
          <p className="mt-3">
            {SITE.coordinates.lat.toFixed(4)}° N,{" "}
            {SITE.coordinates.lng.toFixed(4)}° E
          </p>
        </div>

        <div className="text-concrete">
          <p className="tracking-[0.25em] uppercase text-steel">next event</p>
          {next ? (
            <a
              href={next.url}
              target="_blank"
              rel="noreferrer"
              className="mt-2 block hover:text-signal"
            >
              <span className="text-beige">{next.name}</span>
              <br />
              {formatEventDate(next.startAt, next.timezone)}
            </a>
          ) : (
            <p className="mt-2">
              calendar recharging —{" "}
              <Link href="/events" className="text-beige hover:text-signal">
                check events
              </Link>
            </p>
          )}
          <p className="mt-4 tracking-[0.25em] uppercase text-steel">socials</p>
          <ul className="mt-2 flex flex-wrap gap-x-4 gap-y-1">
            {SOCIALS.map((s) => (
              <li key={s.label}>
                <a
                  href={s.url}
                  target="_blank"
                  rel="noreferrer"
                  className="uppercase tracking-widest hover:text-signal"
                >
                  {s.label}
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div className="text-concrete lg:text-right">
          <p className="tracking-[0.25em] uppercase text-steel">powered by</p>
          <p className="mt-2 font-(family-name:--font-tech) text-sm font-bold tracking-widest text-beige">
            HACKLAB <span className="text-signal">×</span> {PARTNERS.operating.name}
          </p>
          <p className="mt-1 text-[10px] uppercase tracking-widest">
            {PARTNERS.motto}
          </p>
          <p className="mt-4 text-steel">est. 2026 — cc by-nc-sa 4.0</p>
          <p className="mt-1 text-steel">
            a fictional demo brand. no aliens were housed.
          </p>
        </div>
      </div>
    </footer>
  );
}
