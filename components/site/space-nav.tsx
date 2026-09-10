"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const LINKS = [
  { href: "/space", label: "Profile" },
  { href: "/space/billing", label: "Billing" },
  { href: "/members", label: "Members" },
] as const;

/* The sidebar of /space: two links, the current one marked with ">". */
export function SpaceNav({ email }: { email: string }) {
  const pathname = usePathname();
  return (
    <>
      <nav aria-label="Space">
        {LINKS.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            aria-current={pathname === link.href ? "page" : undefined}
          >
            {link.label}
          </Link>
        ))}
      </nav>
      <p className="terminal-muted">{email}</p>
    </>
  );
}
