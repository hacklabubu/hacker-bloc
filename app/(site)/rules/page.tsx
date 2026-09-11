import type { Metadata } from "next";
import { connection } from "next/server";
import { AuthorityLadder } from "@/components/site/authority-ladder";
import { ROLES, getPeople } from "@/lib/people";
import { HACKERSPACE_RULES } from "@/lib/rules";
import type { LadderStep } from "@/lib/community";

export const metadata: Metadata = {
  title: "Rules",
  description:
    "The Hacker Bloc hackerspace rules and the house hierarchy. Read them before you show up; your role decides what you get.",
};

/* Mirrored in lib/markdown.ts (rulesMarkdown); change both. */
export default async function RulesPage() {
  await connection();
  const people = (await getPeople()) ?? [];
  const ladder: LadderStep[] = ROLES.map((role, index) => ({
    level: ROLES.length - 1 - index,
    names: [role.label],
    responsibilities: role.responsibilities,
    members: people.filter((p) => p.status === role.id && p.github).map((p) => p.github as string),
  }));

  return (
    <main id="top" className="terminal-page">
      <section className="terminal-intro" aria-labelledby="rules-heading">
        <p className="terminal-location">Rules</p>
        <h1 id="rules-heading">Read them before you show up.</h1>
        <p className="terminal-muted">
          We are not a hostel, not a coworking, not a party flat. We are laser
          focused on building Hacklab.
        </p>
      </section>

      <section className="terminal-section" aria-labelledby="hierarchy-heading">
        <h2 id="hierarchy-heading" className="terminal-legend">The hierarchy</h2>
        <div className="terminal-section-content">
          <AuthorityLadder steps={ladder} />
        </div>
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
