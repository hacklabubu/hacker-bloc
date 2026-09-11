import type { Metadata } from "next";
import Link from "next/link";
import { SiteFooter } from "@/components/site/footer";
import { Masthead } from "@/components/site/masthead";
import { SiteNav } from "@/components/site/nav";

export const metadata: Metadata = {
  title: "404",
  description: "That door doesn't exist.",
};

const EXITS = [
  { href: "/", label: "The Bloc", note: "the manifesto, membership, and patrons" },
  { href: "/events", label: "Events", note: "what is on at the house" },
  { href: "/rules", label: "Rules", note: "the hackerspace rules" },
  { href: "/roles", label: "Roles", note: "who decides what, and why" },
  { href: "/join", label: "Join", note: "apply to the house" },
] as const;

export default function NotFound() {
  return (
    <>
    <SiteNav />
    <Masthead />
    <main id="top" className="terminal-page">
      <section className="terminal-intro" aria-labelledby="nf-heading">
        <p className="terminal-location">404</p>
        <h1 id="nf-heading">No such door.</h1>
        <p className="terminal-muted">
          You knocked on a wall. Nothing lives at this address. Try one of the
          rooms that does.
        </p>
      </section>
      <section className="terminal-section" aria-labelledby="nf-maps">
        <h2 id="nf-maps" className="terminal-legend">Maps</h2>
        <div className="terminal-section-content">
          <p className="terminal-muted">
            Every page is listed in the{" "}
            <a href="/sitemap.xml" className="underline underline-offset-4">sitemap</a> and described in{" "}
            <a href="/llms.txt" className="underline underline-offset-4">llms.txt</a>. Ask any page with{" "}
            <code>Accept: text/markdown</code> for its markdown.
          </p>
        </div>
      </section>
      <section className="terminal-section" aria-labelledby="nf-legend">
        <h2 id="nf-legend" className="terminal-legend">Rooms</h2>
        <div className="terminal-section-content">
          <ul className="terminal-perks" aria-label="Pages">
            {EXITS.map((exit) => (
              <li key={exit.href}>
                <span aria-hidden="true">[→]</span>
                <span>
                  <Link href={exit.href} className="underline underline-offset-4">{exit.label}</Link>
                  {" — "}
                  <span className="terminal-muted">{exit.note}</span>
                </span>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </main>
    <SiteFooter />
    </>
  );
}
