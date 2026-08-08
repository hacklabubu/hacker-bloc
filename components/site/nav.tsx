"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BlocMark } from "@/components/site/logo";
import { ALIEN_BAZAAR } from "@/lib/site";

const LINKS = [
  { href: "/", label: "The Bloc" },
  { href: "/events", label: "Events" },
  { href: ALIEN_BAZAAR.url, label: "Alien Bazaar" },
  { href: "/partners", label: "Partners" },
] as const;

export function SiteNav() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-charcoal/95 backdrop-blur-sm">
      <div className="mx-auto flex max-w-6xl items-center gap-4 px-4 py-2 text-[10px] tracking-widest uppercase sm:text-xs">
        <Link href="/" className="flex shrink-0 items-center gap-2 text-beige">
          <BlocMark className="h-5 w-auto text-signal" />
          <span className="font-bold">HACKER BLOC</span>
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
        <Link
          href="/come-over"
          className={`shrink-0 border px-4 py-1.5 font-bold transition-colors ${
            pathname === "/come-over"
              ? "border-signal bg-signal text-on-signal"
              : "border-signal text-signal hover:bg-signal hover:text-on-signal"
          }`}
        >
          Come Over
        </Link>
      </div>
    </header>
  );
}
