/*
 * HACKER BLOC — single source of truth for names, links, and dates.
 * Anything marked TODO is a placeholder waiting on a real URL.
 */

export const SITE = {
  name: "HACKER BLOC",
  tagline: "The bloc where Warsaw builds.",
  city: "Warsaw, PL",
  address: "Kosiarzy 21B, 02-953 Warszawa",
  district: "Wilanów Niski",
  coordinates: { lat: 52.1701645, lng: 21.0787472 },
  mapsUrl: "https://maps.google.com/?q=Kosiarzy+21B,+02-953+Warszawa",
  email: "core@hackerblock.wtf",
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
  operating: { name: "EPICOR", role: "operating partner // runs the dungeons" },
  motto: "Powered by people who build",
} as const;
