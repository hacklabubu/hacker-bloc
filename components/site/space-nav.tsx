"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const LINKS = [
  { href: "/space", label: "Profile" },
  { href: "/space/billing", label: "Billing" },
] as const;

/* The sidebar of /space: two links, the current one marked with ">". */
export function SpaceNav({ email, founder = false }: { email: string; founder?: boolean }) {
  const pathname = usePathname();
  const links = founder ? [...LINKS, { href: "/space/admin", label: "Admin" }] : [...LINKS];
  return (
    <>
      <nav aria-label="Space">
        {links.map((link) => (
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
