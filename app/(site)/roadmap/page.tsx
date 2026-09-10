import type { Metadata } from "next";
import Link from "next/link";
import { ROADMAP } from "@/lib/membership";

export const metadata: Metadata = {
  title: "Roadmap",
  description: "The plan for building Hacker Bloc, one version at a time. Ten hackers unlock 1.0 and the hackerspace starts working; every ten more unlock the next version.",
  alternates: { canonical: "/roadmap" },
};

export default function RoadmapPage() {
  return (
    <main id="top" className="terminal-page">
      <section className="terminal-intro" aria-labelledby="roadmap-heading">
        <p className="terminal-location">Roadmap</p>
        <h1 id="roadmap-heading">The plan for building the space, one version at a time.</h1>
      </section>

      {ROADMAP.map((milestone) => {
        const id = `v${milestone.version.replace(".", "-")}`;
        return (
          <section key={milestone.version} id={id} className="terminal-section" aria-labelledby={`${id}-heading`}>
            <h2 id={`${id}-heading`} className="terminal-legend">Hacker Bloc {milestone.version}</h2>
            <div className="terminal-section-content terminal-roadmap">
              <p className="terminal-price">
                <strong>{milestone.hackers}</strong> hackers
              </p>
              <p className="terminal-muted">{milestone.summary}</p>
              <ul className="terminal-perks" aria-label={`Hacker Bloc ${milestone.version}`}>
                {milestone.items.map((item) => (
                  <li key={item}>
                    <span aria-hidden="true">[+]</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </section>
        );
      })}

      <section id="fund" className="terminal-section" aria-labelledby="fund-heading">
        <h2 id="fund-heading" className="terminal-legend">Fund it</h2>
        <div className="terminal-section-content terminal-roadmap">
          <p>Every version unlocks when enough hackers have joined. Ten get us to 1.0.</p>
          <p>
            <Link href="/membership" className="underline underline-offset-4">Become a member →</Link>
          </p>
          <Link href="/wishlist" className="underline underline-offset-4">See the wishlist →</Link>
        </div>
      </section>
    </main>
  );
}
