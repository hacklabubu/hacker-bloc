export const MAIN_NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/events", label: "Events" },
  { href: "/membership", label: "Membership" },
  { href: "/support", label: "Support the Bloc" },
] as const;

export function isMainPage(pathname: string) {
  return MAIN_NAV_LINKS.some((link) => link.href === pathname);
}
