import type { Metadata } from "next";
import { HACKERSPACE_RULES } from "@/lib/rules";

export const metadata: Metadata = {
  title: "Rules",
  description: "The Hacker Bloc hackerspace rules. Read before arriving.",
};

/* Mirrored in lib/markdown.ts (rulesMarkdown); change both. */
export default function RulesPage() {
  return (
    <main id="top" className="terminal-page">
      <section className="terminal-intro" aria-labelledby="rules-heading">
        <p className="terminal-location">Rules</p>
        <h1 id="rules-heading">Read before arriving.</h1>
        <p className="terminal-muted">
          Hacker Bloc is not a party hostel. We are a team laser-focused on
          building Hacklab. Please read and respect our rules to ensure a
          positive experience for everyone.
        </p>
      </section>

      <section className="terminal-section" aria-labelledby="rules-legend">
        <h2 id="rules-legend" className="terminal-legend">The rules</h2>
        <div className="terminal-section-content">
          <ol className="terminal-rules">
            {HACKERSPACE_RULES.map((rule) => (
              <li key={rule}>
                <span>{rule}</span>
              </li>
            ))}
          </ol>
        </div>
      </section>
    </main>
  );
}
