import Link from "next/link";
import { ThemeToggle } from "@/components/site/theme-toggle";
import { SITE } from "@/lib/site";

export function SiteFooter() {
  return (
    <footer className="terminal-footer">
      <ThemeToggle />
      <div>
        <Link href="/events">Events</Link>
        <Link href="/membership">Membership</Link>
        <Link href="/roadmap">Roadmap</Link>
        <Link href="/wishlist">Wishlist</Link>
        <Link href="/rules">Rules</Link>
        <Link href="/roles">Roles</Link>
        <Link href="/join">Apply</Link>
        <Link href="/terms">Terms</Link>
        <Link href="/refunds">Refunds</Link>
        <Link href="/privacy">Privacy</Link>
        <a href={`mailto:${SITE.email}`}>Contact <span aria-hidden="true">↗</span></a>
      </div>
    </footer>
  );
}
