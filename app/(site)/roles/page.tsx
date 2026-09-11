import type { Metadata } from "next";
import Link from "next/link";
import { connection } from "next/server";
import { AuthorityLadder } from "@/components/site/authority-ladder";
import type { LadderStep } from "@/lib/community";
import { ROLES, getPeople } from "@/lib/people";

export const metadata: Metadata = {
  title: "Roles",
  description:
    "The Hacker Bloc hierarchy: founder, resident, member, patron, lurker. Who decides what, and who is on each rung.",
};

/* Mirrored in lib/markdown.ts (rolesMarkdown); change both. */
export default async function RolesPage() {
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
      <section className="terminal-intro" aria-labelledby="roles-heading">
        <p className="terminal-location">Roles</p>
        <h1 id="roles-heading">Who decides what.</h1>
        <p className="terminal-muted">
          Every account holds one role. Highest rung first; the rung decides
          what you get a say in. The rules everyone follows are on{" "}
          <Link href="/rules" className="underline underline-offset-4">the rules page</Link>.
        </p>
      </section>

      <section className="terminal-section" aria-labelledby="hierarchy-heading">
        <h2 id="hierarchy-heading" className="terminal-legend">The hierarchy</h2>
        <div className="terminal-section-content">
          <AuthorityLadder steps={ladder} />
        </div>
      </section>
    </main>
  );
}
