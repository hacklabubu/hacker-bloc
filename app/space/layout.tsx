import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { BrandLogo } from "@/components/site/brand-logo";
import { SpaceNav } from "@/components/site/space-nav";
import { ThemeToggle } from "@/components/site/theme-toggle";
import { authConfigured, getSessionUser } from "@/lib/auth";
import { isFounder } from "@/lib/founders";
import { rememberProfile } from "@/lib/profile";

/* Reads the session cookie on every request; never prerender. */
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Space",
  description: "Your Hacker Bloc membership.",
  robots: { index: false, follow: false },
};

/*
 * The signed-in area, with its own chrome: no site header or footer, just a
 * sidebar. Sign-in is Supabase Auth (app/auth); membership data is the
 * Stripe mirror in Neon, matched by the signed-in email.
 */
export default async function SpaceLayout({ children }: { children: React.ReactNode }) {
  if (!authConfigured()) {
    return (
      <main id="top" className="terminal-page">
        <section className="terminal-intro">
          <p className="terminal-location">Space</p>
          <h1>Accounts open soon.</h1>
          <p><Link href="/" className="underline underline-offset-4">Back to the site</Link></p>
        </section>
      </main>
    );
  }

  const user = await getSessionUser();
  if (!user) redirect("/auth/login?next=%2Fspace");
  await rememberProfile(user);

  return (
    <div className="space-shell">
      <aside className="space-side">
        <Link href="/" className="terminal-home space-home" aria-label="Hacker Bloc — home">
          <BrandLogo />
        </Link>
        <SpaceNav email={user.email} founder={isFounder(user.email)} />
        <div className="space-side-foot">
          <Link href="/">← hackerbloc.com</Link>
          <ThemeToggle />
        </div>
      </aside>
      <main id="top" className="space-main">{children}</main>
    </div>
  );
}
