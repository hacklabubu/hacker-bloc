"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BlocMark } from "@/components/site/logo";

const LINKS = [
  { href: "/", label: "The Bloc" },
  { href: "/community", label: "Community" },
  { href: "/partners", label: "Partners" },
] as const;

export function SiteNav() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-charcoal/95 backdrop-blur-sm">
      <div className="mx-auto flex max-w-6xl items-center gap-4 px-4 py-2 text-[10px] tracking-widest uppercase sm:text-xs">
        <Link href="/" className="flex shrink-0 items-center gap-2 text-beige">
          <BlocMark className="h-6 w-auto text-signal" />
        </Link>
        <nav
          aria-label="Main"
          className="flex flex-1 items-center justify-center gap-1 overflow-x-auto tracking-[0.2em]"
        >
          {LINKS.map((l) => (
            <Link
              key={l.label}
              href={l.href}
              className={`shrink-0 px-3 py-2 transition-colors ${
                pathname === l.href
                  ? "text-signal"
                  : "text-concrete hover:text-beige"
              }`}
            >
              {l.label}
            </Link>
          ))}
        </nav>
        <div className="flex shrink-0 items-center gap-2">
          <Link
            href="/join"
            className={`border px-5 py-2.5 text-xs font-bold tracking-widest transition-colors sm:px-6 sm:py-3 sm:text-sm ${
              pathname === "/join"
                ? "border-signal bg-signal text-on-signal"
                : "border-signal text-signal hover:bg-signal hover:text-on-signal"
            }`}
          >
            Join
          </Link>
          <Link
            href="/sponsor"
            className={`border px-5 py-2.5 text-xs font-bold tracking-widest transition-colors sm:px-6 sm:py-3 sm:text-sm ${
              pathname === "/sponsor"
                ? "border-beige bg-beige text-charcoal"
                : "border-beige/50 bg-beige/5 text-beige hover:border-beige hover:bg-beige/10"
            }`}
          >
            Sponsor
          </Link>
        </div>
      </div>
    </header>
  );
}
