import type { Metadata } from "next";
import Link from "next/link";
import { connection } from "next/server";
import { ROLES, getPeople, roleOf, type PersonStatus } from "@/lib/people";

export const metadata: Metadata = {
  title: "Members",
  description: "Everyone with an account at Hacker Bloc, by role: founders, residents, Hacklab team, founding members, members, patrons, and lurkers.",
  alternates: { canonical: "/members" },
};

const SINCE = new Intl.DateTimeFormat("en-GB", { month: "short", year: "numeric", timeZone: "Europe/Warsaw" });

/* Mirrored in lib/markdown.ts (membersMarkdown); change both. */
export default async function MembersPage() {
  await connection();
  const people = await getPeople();
  const counts = Object.fromEntries(ROLES.map((role) => [role.id, 0])) as Record<PersonStatus, number>;
  for (const person of people ?? []) counts[person.status] += 1;

  return (
    <main id="top" className="terminal-page">
      <section className="terminal-intro" aria-labelledby="members-heading">
        <p className="terminal-location">Members</p>
        <h1 id="members-heading">Everyone with a key to the Bloc.</h1>
        <p className="terminal-muted">
          {ROLES.map((role) => `${counts[role.id]} ${role.plural}`).join(" · ")}. What each
          role means is on <Link href="/roles" className="underline underline-offset-4">the roles page</Link>.
        </p>
      </section>

      <section className="terminal-section" aria-labelledby="list-heading">
        <h2 id="list-heading" className="terminal-legend">The list</h2>
        <div className="terminal-section-content">
          {people === null ? (
            <p className="terminal-muted">The list is offline right now.</p>
          ) : people.length === 0 ? (
            <p className="terminal-muted">Nobody yet. Be the first.</p>
          ) : (
            <ul className="terminal-list" aria-label="People">
              {people.map((person, i) => {
                const role = roleOf(person.status);
                return (
                  <li key={`${person.github ?? "anon"}-${i}`}>
                    <span aria-hidden="true">{role.mark}</span>
                    <span>
                      {person.github ? (
                        <a href={`https://github.com/${person.github}`}>{person.github}</a>
                      ) : (
                        "anonymous"
                      )}{" "}
                      <span className="terminal-muted">{role.label.toLowerCase()}</span>
                    </span>
                    <time dateTime={person.since}>{SINCE.format(new Date(person.since))}</time>
                  </li>
                );
              })}
            </ul>
          )}
          <div className="terminal-actions">
            <Link href="/auth/sign-up" className="terminal-button">
              Get on the list <span aria-hidden="true">↗</span>
            </Link>
            <Link href="/membership#member" className="terminal-button">
              Become a member <span aria-hidden="true">↗</span>
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
