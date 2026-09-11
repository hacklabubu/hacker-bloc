import type { Metadata } from "next";
import Link from "next/link";
import { connection } from "next/server";
import { startMembershipCheckout } from "@/app/actions/membership";
import { authConfigured, getSessionUser } from "@/lib/auth";
import { ROLES, getPeople, getStatusByEmail, roleOf, type PersonStatus } from "@/lib/people";
import { rememberProfile } from "@/lib/profile";
import { membershipCheckoutEnabled } from "@/lib/stripe";

export const metadata: Metadata = {
  title: "Members",
  description: "Everyone with an account at Hacker Bloc, by role: founders, residents, Hacklab team, founding members, members, patrons, and lurkers.",
  alternates: { canonical: "/members" },
};

const SINCE = new Intl.DateTimeFormat("en-GB", { month: "short", year: "numeric", timeZone: "Europe/Warsaw" });

/* Roles that still have a membership to buy. */
const CAN_JOIN: readonly PersonStatus[] = ["lurker", "patron"];

/* Mirrored in lib/markdown.ts (membersMarkdown); change both. */
export default async function MembersPage() {
  await connection();
  const [people, user] = await Promise.all([
    getPeople(),
    authConfigured() ? getSessionUser() : Promise.resolve(null),
  ]);
  if (user) await rememberProfile(user);
  const myStatus = user ? await getStatusByEmail(user.email) : null;
  const counts = Object.fromEntries(ROLES.map((role) => [role.id, 0])) as Record<PersonStatus, number>;
  for (const person of people ?? []) counts[person.status] += 1;

  /*
   * One call to action. Signed out: join (sign in, or create an account
   * from there). Signed in without a membership: pay. Members and above:
   * nothing to sell them.
   */
  let cta: React.ReactNode = null;
  if (!user) {
    cta = (
      <Link href="/auth/login?next=%2Fmembers" className="terminal-button">
        Join <span aria-hidden="true">↗</span>
      </Link>
    );
  } else if (myStatus && CAN_JOIN.includes(myStatus)) {
    cta = membershipCheckoutEnabled() ? (
      <form
        action={async () => {
          "use server";
          await startMembershipCheckout();
        }}
      >
        <button type="submit" className="terminal-button">
          Become a member <span aria-hidden="true">↗</span>
        </button>
      </form>
    ) : (
      <Link href="/membership#member" className="terminal-button">
        Become a member <span aria-hidden="true">↗</span>
      </Link>
    );
  }

  return (
    <main id="top" className="terminal-page">
      <section className="terminal-intro" aria-labelledby="members-heading">
        <p className="terminal-location">Members</p>
        <h1 id="members-heading">Everyone with a key to the Bloc.</h1>
        <ul className="terminal-perks" aria-label="People by role">
          {ROLES.map((role) => (
            <li key={role.id}>
              <span aria-hidden="true">{role.mark}</span>
              <span>
                {counts[role.id]} {role.plural}
              </span>
            </li>
          ))}
        </ul>
        <p className="terminal-muted">
          What each role means is on <Link href="/roles" className="underline underline-offset-4">the roles page</Link>.
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
          {cta ? <div className="terminal-actions">{cta}</div> : null}
        </div>
      </section>
    </main>
  );
}
