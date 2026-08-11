import { SITE, SOCIALS } from "@/lib/site";

export function SiteFooter() {
  return (
    <footer className="border-t border-border">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-10 sm:flex-row sm:items-center sm:justify-between">
        <div className="text-sm text-concrete">
          <p className="font-heading text-xl uppercase text-beige">Hacker Bloc</p>
          <a
            href={SITE.mapsUrl}
            target="_blank"
            rel="noreferrer"
            className="mt-2 block hover:text-signal"
          >
            {SITE.address}
          </a>
        </div>
        <ul className="flex flex-wrap gap-x-6 gap-y-2 text-xs tracking-widest text-concrete uppercase">
          {SOCIALS.map((s) => (
            <li key={s.label}>
              <a
                href={s.url}
                target="_blank"
                rel="noreferrer"
                className="hover:text-signal"
              >
                {s.label.startsWith("YT") ? "YouTube" : s.label}
              </a>
            </li>
          ))}
          <li>
            <a href={`mailto:${SITE.email}`} className="hover:text-signal">
              Email
            </a>
          </li>
        </ul>
      </div>
    </footer>
  );
}
