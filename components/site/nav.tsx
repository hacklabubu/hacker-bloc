"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { BrandLogo } from "@/components/site/brand-logo";
import { ThemeToggle } from "@/components/site/theme-toggle";
import { MAIN_NAV_LINKS } from "@/lib/navigation";
import { createClient } from "@/lib/supabase/client";

const AUTH_CONFIGURED = Boolean(
  process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
);

export function SiteNav() {
  const pathname = usePathname();
  /* Session is read in the browser so every public page stays static. */
  const [signedIn, setSignedIn] = useState(false);

  useEffect(() => {
    if (!AUTH_CONFIGURED) return;
    const supabase = createClient();
    supabase.auth.getSession().then(({ data }) => setSignedIn(Boolean(data.session)));
    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      setSignedIn(Boolean(session));
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  const account = signedIn
    ? { href: "/members", label: "Members" }
    : { href: "/auth/sign-up", label: "Sign up" };

  return (
    <header className="terminal-nav">
      <div className="terminal-nav-inner">
        <Link href="/" className="terminal-home" aria-label="Hacker Bloc — home">
          <BrandLogo />
        </Link>
        <nav aria-label="Main">
          {MAIN_NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              aria-current={pathname === link.href ? "page" : undefined}
            >
              {link.label}
            </Link>
          ))}
          {AUTH_CONFIGURED ? (
            <Link
              href={account.href}
              aria-current={pathname === account.href ? "page" : undefined}
            >
              {account.label}
            </Link>
          ) : null}
        </nav>
        <ThemeToggle />
      </div>
    </header>
  );
}
