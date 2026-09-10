import type { Metadata } from "next";
import Link from "next/link";
import { connection } from "next/server";
import { getPeople, type PersonStatus } from "@/lib/people";

export const metadata: Metadata = {
  title: "Members",
  description: "Everyone with an account at Hacker Bloc: members, patrons, and lurkers.",
  alternates: { canonical: "/members" },
};

const LABEL: Record<PersonStatus, string> = {
  member: "member",
  patron: "patron",
  lurker: "lurker",
};

const MARK: Record<PersonStatus, string> = {
  member: "[+]",
  patron: "[$]",
  lurker: "[ ]",
};

/* Mirrored in lib/markdown.ts (membersMarkdown); change both. */
export default async function MembersPage() {
  await connection();
  const people = await getPeople();
  const counts = { member: 0, patron: 0, lurker: 0 };
  for (const person of people ?? []) counts[person.status] += 1;

  return (
    <main id="top" className="terminal-page">
      <section className="terminal-intro" aria-labelledby="members-heading">
        <p className="terminal-location">Members</p>
        <h1 id="members-heading">Everyone with a key to the Bloc.</h1>
        <p className="terminal-muted">
          {counts.member} members · {counts.patron} patrons · {counts.lurker} lurkers.
          Members pay the membership, patrons put money in once, lurkers made an
          account and are thinking about it.
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
            <ul className="terminal-perks" aria-label="People">
              {people.map((person, i) => (
                <li key={`${person.github ?? "anon"}-${i}`}>
                  <span aria-hidden="true">{MARK[person.status]}</span>
                  <span>
                    {person.github ? (
                      <a href={`https://github.com/${person.github}`} className="underline underline-offset-4">
                        {person.github}
                      </a>
                    ) : (
                      "anonymous"
                    )}{" "}
                    <span className="terminal-muted">{LABEL[person.status]}</span>
                  </span>
                </li>
              ))}
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
