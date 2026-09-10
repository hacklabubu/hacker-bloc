export const MAIN_NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/events", label: "Events" },
  { href: "/membership", label: "Membership" },
  { href: "/roadmap", label: "Roadmap" },
  { href: "/wishlist", label: "Wishlist" },
] as const;

export function isMainPage(pathname: string) {
  return MAIN_NAV_LINKS.some((link) => link.href === pathname);
}
