import type { Metadata } from "next";
import { AuthorityLadder } from "@/components/site/authority-ladder";
import { authorityLadder } from "@/lib/community";
import { getHouseRoles, getMembers, getRules } from "@/lib/notion";

export const metadata: Metadata = {
  title: "House rules",
  description:
    "The Hacker Bloc house rules. Read them before you show up — your tier decides what you get.",
};

export default async function RulesPage() {
  /* Independent queries; all three are empty without NOTION_TOKEN. */
  const [rules, houseRoles, members] = await Promise.all([
    getRules(),
    getHouseRoles(),
    getMembers(),
  ]);
  const ladder = authorityLadder(houseRoles, members);

  return (
    <main id="top" className="terminal-page">
      <section className="terminal-intro" aria-labelledby="rules-heading">
        <p className="terminal-location">House rules</p>
        <h1 id="rules-heading">Read them before you show up.</h1>
        <p className="terminal-muted">
          We are not a hostel, not a coworking, not a party flat. We are laser
          focused on building Hacklab.
        </p>
      </section>

      {ladder.length > 0 ? (
        <section className="terminal-section" aria-labelledby="hierarchy-heading">
          <h2 id="hierarchy-heading" className="terminal-legend">The hierarchy</h2>
          <div className="terminal-section-content">
            <AuthorityLadder steps={ladder} />
          </div>
        </section>
      ) : null}

      <section className="terminal-section" aria-labelledby="rules-legend">
        <h2 id="rules-legend" className="terminal-legend">The rules</h2>
        <div className="terminal-section-content">
          {rules.length > 0 ? (
            <ol className="terminal-rules">
              {rules.map((rule) => (
                <li key={rule}>
                  <span>{rule}</span>
                </li>
              ))}
            </ol>
          ) : (
            <p className="terminal-muted">Rules are being written — ask hacker daddy.</p>
          )}
        </div>
      </section>
    </main>
  );
}
