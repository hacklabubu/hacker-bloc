import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { SpaceNav } from "@/components/site/space-nav";
import { authConfigured, getSessionUser } from "@/lib/auth";

/* Reads the session cookie on every request; never prerender. */
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Space",
  description: "Your Hacker Bloc membership.",
  robots: { index: false, follow: false },
};

/*
 * The signed-in area. Sign-in is Supabase Auth (app/auth); everything under
 * /space assumes a session and gets the sidebar. Membership data comes from
 * the Stripe mirror in Neon, matched by the signed-in email.
 */
export default async function SpaceLayout({ children }: { children: React.ReactNode }) {
  if (!authConfigured()) {
    return (
      <main id="top" className="terminal-page">
        <section className="terminal-intro">
          <p className="terminal-location">Space</p>
          <h1>Accounts open soon.</h1>
        </section>
      </main>
    );
  }

  const user = await getSessionUser();
  if (!user) redirect("/auth/login?next=%2Fspace");

  return (
    <main id="top" className="terminal-page space">
      <aside className="space-side">
        <SpaceNav email={user.email} />
      </aside>
      <div className="space-main">{children}</div>
    </main>
  );
}
