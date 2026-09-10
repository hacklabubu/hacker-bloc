"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BrandLogo } from "@/components/site/brand-logo";
import { ThemeToggle } from "@/components/site/theme-toggle";
import { MAIN_NAV_LINKS } from "@/lib/navigation";

export function SiteNav() {
  const pathname = usePathname();

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
          <Link
            href="/members"
            aria-current={pathname === "/members" ? "page" : undefined}
          >
            Members
          </Link>
        </nav>
        <ThemeToggle />
      </div>
    </header>
  );
}
