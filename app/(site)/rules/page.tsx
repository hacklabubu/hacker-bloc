import type { Metadata } from "next";
import Link from "next/link";
import { HACKERSPACE_RULES } from "@/lib/rules";

export const metadata: Metadata = {
  title: "Rules",
  description: "The Hacker Bloc hackerspace rules. Read them before you show up.",
};

/* Mirrored in lib/markdown.ts (rulesMarkdown); change both. */
export default function RulesPage() {
  return (
    <main id="top" className="terminal-page">
      <section className="terminal-intro" aria-labelledby="rules-heading">
        <p className="terminal-location">Rules</p>
        <h1 id="rules-heading">Read them before you show up.</h1>
        <p className="terminal-muted">
          We are not a hostel, not a coworking, not a party flat. We are laser
          focused on building Hacklab. Who decides what is on{" "}
          <Link href="/roles" className="underline underline-offset-4">the roles page</Link>.
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
