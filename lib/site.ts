/*
 * HACKER BLOC — single source of truth for names, links, and dates.
 * Anything marked TODO is a placeholder waiting on a real URL.
 */

/*
 * The house address, split the way schema.org's PostalAddress wants it. The
 * one-line `SITE.address` every page prints is composed from this, so there is
 * only ever one place to change the street.
 */
const POSTAL = {
  streetAddress: "Kosiarzy 21B",
  postalCode: "02-953",
  addressLocality: "Warszawa",
  addressCountry: "PL",
} as const;

export const SITE = {
  name: "HACKER BLOC",
  /* Canonical origin — sitemap, robots, and JSON-LD all build URLs from this. */
  url: "https://www.hackerbloc.com",
  tagline: "The bloc where Warsaw builds.",
  city: "Warsaw, PL",
  postal: POSTAL,
  address: `${POSTAL.streetAddress}, ${POSTAL.postalCode} ${POSTAL.addressLocality}`,
  district: "Wilanów",
  coordinates: { lat: 52.1701645, lng: 21.0787472 },
  mapsUrl: "https://maps.google.com/?q=Kosiarzy+21B,+02-953+Warszawa",
  email: "matt@hacklab.so",
  sponsorEmail: "matt@homebrew.so",
  calendlyUrl: "https://cal.com/mattbratos/30min",
} as const;

/*
 * The party a member contracts with — printed on the terms, refund policy,
 * and privacy page. TODO: replace with the registered legal name, legal form,
 * and register numbers (KRS / NIP / REGON) of the entity that owns the Stripe
 * account before taking live payments; every "Polish law requires" line on
 * /terms assumes they are here.
 */
export const OPERATOR = {
  legalName: "Hacklab",
  address: SITE.address,
  country: "Poland",
  email: SITE.email,
  /* e.g. "KRS 0000000000 · NIP 0000000000 · REGON 000000000"; null hides the line. */
  registration: null as string | null,
} as const;

export const LUMA = {
  slug: "hacklab",
  calendarUrl: "https://luma.com/hacklab",
  calendarApiId: "cal-etIK3K7lyA614ZD",
} as const;

export const ALIEN_BAZAAR = {
  /* 100 builders. hardware only. built in the dungeons. */
  date: "2026-09-19T09:00:00+02:00",
  url: "/alien-bazaar",
  // TODO: real registration link — points at the Luma calendar until then
  registerUrl: "https://luma.com/hacklab",
} as const;

export const SOCIALS = [
  // TODO: confirm real handles — IG is live, the rest are best guesses
  { label: "X", handle: "@hacklabubu", url: "https://x.com/hacklabubu" },
  { label: "IG", handle: "@hacklabubu", url: "https://instagram.com/hacklabubu" },
  { label: "YT / ERROR 529", handle: "error 529", url: "https://youtube.com/@hacklabubu" },
  { label: "LI", handle: "hacklab", url: "https://linkedin.com/company/hacklabubu" },
] as const;

export const PARTNERS = {
  operating: { name: "EPIKOR", role: "operating partner // runs the dungeons" },
  motto: "Powered by people who build",
  wall: [
    {
      name: "Hacklab",
      href: "https://hacklab.so",
      src: "/logos/hacklab.png",
      role: "founders",
      wide: true,
      width: 5184,
      height: 3351,
    },
    {
      name: "Epikor",
      href: "https://epikor.eu",
      src: "/logos/epicor.svg",
      role: "dungeons",
      wide: false,
      width: 2522,
      height: 986,
    },
  ],
} as const;

/* One million euro to buy Kosiarzy 21B and stand the house up. */
export const FUNDING = {
  totalEur: 1_000_000,
  buildingEur: 800_000,
  setupEur: 200_000,
  movedIn: "2026-07-01",
} as const;

export function formatEur(amount: number) {
  return new Intl.NumberFormat("pl-PL", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatEurPlain(amount: number) {
  return new Intl.NumberFormat("pl-PL", { maximumFractionDigits: 0 }).format(
    amount,
  );
}
