import type { Metadata } from "next";
import Link from "next/link";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "Sponsor",
  description:
    "Invest in the Warsaw founder network. Hacker Bloc connects capital with ambitious builders in person.",
};

const POINTS = [
  {
    title: "Deal flow in the room",
    body: "Meet founders before they raise — demos, dinners, and builds, not cold decks.",
  },
  {
    title: "Curated access",
    body: "Ambitious founders only. Invited community, not open coworking.",
  },
  {
    title: "Physical presence",
    body: "A house in Warsaw with real events every week. Show up where shipping happens.",
  },
] as const;

export default function SponsorPage() {
  return (
    <main className="flex-1">
      <section className="mx-auto w-full max-w-6xl px-4 py-20 sm:py-28">
        <h1 className="font-heading text-4xl leading-tight uppercase text-beige sm:text-5xl md:text-6xl">
          Sponsor
        </h1>
        <p className="mt-8 max-w-2xl text-lg leading-8 text-concrete sm:text-xl sm:leading-9">
          For investors who want first access to the best founders in Warsaw —
          in person, not in an inbox.
        </p>

        <ul className="mt-16 grid gap-px bg-border sm:grid-cols-3">
          {POINTS.map((p) => (
            <li key={p.title} className="bg-charcoal px-6 py-8 sm:px-8 sm:py-10">
              <p className="text-sm font-bold tracking-widest text-beige uppercase">
                {p.title}
              </p>
              <p className="mt-4 text-sm leading-7 text-concrete">{p.body}</p>
            </li>
          ))}
        </ul>

        <div className="mt-20 max-w-2xl border-t border-border pt-12">
          <h2 className="font-heading text-2xl uppercase text-beige sm:text-3xl">
            Get involved
          </h2>
          <p className="mt-4 text-base leading-8 text-concrete sm:text-lg sm:leading-9">
            Tell us who you are and what you invest in. We&apos;ll follow up
            with access to events, founder intros, and partnership options.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <a
              href={`mailto:${SITE.email}?subject=Investor%20/%20Sponsor%20—%20Hacker%20Bloc`}
              className="inline-flex h-14 items-center bg-signal px-10 text-base font-bold tracking-[0.2em] text-on-signal uppercase transition-colors hover:bg-signal/80 sm:text-lg"
            >
              Contact
            </a>
            <Link
              href="/partners"
              className="inline-flex h-14 items-center border border-steel px-10 text-base tracking-[0.2em] text-concrete uppercase transition-colors hover:border-beige hover:text-beige sm:text-lg"
            >
              Partner tiers
            </Link>
          </div>
          <p className="mt-6 text-sm text-steel">{SITE.email}</p>
        </div>
      </section>
    </main>
  );
}
