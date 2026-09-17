import type { Metadata } from "next";
import { SITE } from "@/lib/site";
import { patronCheckoutEnabled } from "@/lib/stripe";
import { WishlistForm } from "@/components/site/wishlist-form";

export const metadata: Metadata = {
  title: "Wishlist",
  description:
    "What Hacker Bloc needs next: the things we want to build and buy for the space, and how to contribute equipment, time, or resources.",
  alternates: { canonical: "/wishlist" },
};

export default async function WishlistPage({ searchParams }: { searchParams: Promise<{ restroom?: string; kitchen?: string; monitors?: string; lighting?: string }> }) {
  const { restroom, kitchen, monitors, lighting } = await searchParams;
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
          <h3 className="wishlist-item-title">Restroom essentials — about $210</h3>
          <p>A toilet, sink, and the basics to get the restroom ready.</p>
          <WishlistForm enabled={patronCheckoutEnabled()} thanks={restroom === "thanks"} />
          <h3 className="wishlist-item-title wishlist-item-next">Mini Kitchen — about $1,200</h3>
          <p>Kitchen furniture, mini-stove, microwave, sink, dishes &amp; cutlery.</p>
          <WishlistForm item="kitchen" enabled={patronCheckoutEnabled()} thanks={kitchen === "thanks"} />
          <h3 className="wishlist-item-title wishlist-item-next">Five 4K monitors — about $750</h3>
          <p>Five second-hand 4K monitors available to all members.</p>
          <WishlistForm item="monitors" enabled={patronCheckoutEnabled()} thanks={monitors === "thanks"} />
          <h3 className="wishlist-item-title wishlist-item-next">Lighting &amp; decoration — about $500</h3>
          <p>LED lights, posters, decorations, and cool items to improve the atmosphere.</p>
          <WishlistForm item="lighting" enabled={patronCheckoutEnabled()} thanks={lighting === "thanks"} />
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
