import type { Metadata } from "next";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "Wishlist",
  description:
    "What Hacker Bloc needs next: the things we want to build and buy for the space, and how to contribute equipment, time, or resources.",
  alternates: { canonical: "/wishlist" },
};

export default function WishlistPage() {
  return (
    <main id="top" className="terminal-page">
      <section className="terminal-intro" aria-labelledby="wishlist-heading">
        <p className="terminal-location">Wishlist</p>
        <h1 id="wishlist-heading">
          The things we want to build and buy next, with a way to fund specific items.
        </h1>
      </section>

      <section id="items" className="terminal-section" aria-labelledby="items-heading">
        <h2 id="items-heading" className="terminal-legend">Items</h2>
        <div className="terminal-section-content terminal-roadmap">
          <span className="terminal-muted">[ coming soon ]</span>
        </div>
      </section>

      <section id="give" className="terminal-section" aria-labelledby="give-heading">
        <h2 id="give-heading" className="terminal-legend">Have something to give?</h2>
        <div className="terminal-section-content terminal-roadmap">
          <p>
            Equipment, time, or resources? Tell us what you have in mind and
            we&apos;ll figure out how it can help the space.
          </p>
          <a href={`mailto:${SITE.email}`} className="underline underline-offset-4">Contact us →</a>
        </div>
      </section>
    </main>
  );
}
