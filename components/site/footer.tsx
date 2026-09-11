import Link from "next/link";
import { ThemeToggle } from "@/components/site/theme-toggle";
import { SITE } from "@/lib/site";

export function SiteFooter() {
  return (
    <footer className="terminal-footer">
      <ThemeToggle />
      <div>
        <a href={`mailto:${SITE.email}`}>Contact <span aria-hidden="true">↗</span></a>
        <Link href="/rules">Rules</Link>
        <Link href="/join">Apply</Link>
        <Link href="/terms">Terms</Link>
        <Link href="/refunds">Refunds</Link>
        <Link href="/privacy">Privacy</Link>
      </div>
    </footer>
  );
}
