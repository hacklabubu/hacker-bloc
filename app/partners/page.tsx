import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Partners",
  description:
    "Partner tiers for Hacker Bloc — Diamond, Gold, Silver, and Bronze.",
};

const PARTNER_TIERS = [
  {
    tier: "Diamond",
    slots: 1,
    cell: "min-h-40 sm:min-h-48",
    grid: "grid-cols-1",
  },
  {
    tier: "Gold",
    slots: 3,
    cell: "min-h-32 sm:min-h-36",
    grid: "grid-cols-1 sm:grid-cols-3",
  },
  {
    tier: "Silver",
    slots: 6,
    cell: "min-h-24 sm:min-h-28",
    grid: "grid-cols-2 sm:grid-cols-3",
  },
  {
    tier: "Bronze",
    slots: 9,
    cell: "min-h-20 sm:min-h-24",
    grid: "grid-cols-3 sm:grid-cols-3",
  },
] as const;

export default function PartnersPage() {
  return (
    <main className="flex-1">
      <section className="mx-auto w-full max-w-6xl px-4 py-20 sm:py-28">
        <h1 className="font-heading text-4xl leading-tight uppercase text-beige sm:text-5xl md:text-6xl">
          Partners
        </h1>
        <p className="mt-8 max-w-2xl text-lg leading-8 text-concrete sm:text-xl sm:leading-9">
          Brands and operators who power the house. Open slots by tier.
        </p>

        <div className="mt-12 space-y-10">
          {PARTNER_TIERS.map(({ tier, slots, cell, grid }) => (
            <div key={tier}>
              <p className="mb-4 text-xs font-bold tracking-[0.3em] text-signal uppercase">
                {tier}
              </p>
              <div className={`grid gap-3 ${grid}`}>
                {Array.from({ length: slots }, (_, i) => (
                  <div
                    key={`${tier}-${i}`}
                    className={`flex ${cell} items-center justify-center border border-dashed border-border bg-asphalt px-4`}
                  >
                    <span className="text-[10px] tracking-[0.25em] text-steel uppercase sm:text-xs">
                      {tier} partner
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <p className="mt-12 text-sm text-concrete">
          <Link
            href="/sponsor"
            className="text-beige underline underline-offset-4 hover:text-signal"
          >
            Become a sponsor
          </Link>
        </p>
      </section>
    </main>
  );
}
