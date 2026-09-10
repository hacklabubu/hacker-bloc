import Link from "next/link";
import { SITE } from "@/lib/site";

export function SiteFooter() {
  return (
    <footer className="terminal-footer">
      <p>Hacker Bloc / Warsaw, PL</p>
      <div>
        <a href={`mailto:${SITE.email}`}>Contact</a>
        <Link href="/rules">Rules</Link>
        <Link href="/join">Join</Link>
        <Link href="/terms">Terms</Link>
        <Link href="/refunds">Refunds</Link>
        <Link href="/privacy">Privacy</Link>
      </div>
    </footer>
  );
}
