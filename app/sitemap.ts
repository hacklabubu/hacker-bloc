import type { MetadataRoute } from "next";
import { SITE } from "@/lib/site";

/*
 * Every indexable page, in the order a stranger would meet them. Frequencies
 * describe how often the copy actually moves: /events follows the live calendar,
 * /community is redrawn whenever the CRM changes, and the trust pages sit still
 * for months at a time.
 */
const ROUTES = [
  { path: "/", changeFrequency: "weekly", priority: 1 },
  { path: "/events", changeFrequency: "daily", priority: 0.9 },
  { path: "/membership", changeFrequency: "monthly", priority: 0.9 },
  { path: "/roadmap", changeFrequency: "monthly", priority: 0.8 },
  { path: "/wishlist", changeFrequency: "weekly", priority: 0.7 },
  { path: "/community", changeFrequency: "weekly", priority: 0.8 },
  { path: "/rules", changeFrequency: "monthly", priority: 0.7 },
  { path: "/join", changeFrequency: "monthly", priority: 0.9 },
  { path: "/partners", changeFrequency: "monthly", priority: 0.6 },
  { path: "/sponsor", changeFrequency: "weekly", priority: 0.9 },
  { path: "/about", changeFrequency: "monthly", priority: 0.6 },
  { path: "/contact", changeFrequency: "monthly", priority: 0.6 },
  { path: "/terms", changeFrequency: "yearly", priority: 0.3 },
  { path: "/refunds", changeFrequency: "yearly", priority: 0.3 },
  { path: "/privacy", changeFrequency: "yearly", priority: 0.3 },
] as const satisfies ReadonlyArray<{
  path: string;
  changeFrequency: NonNullable<MetadataRoute.Sitemap[number]["changeFrequency"]>;
  priority: number;
}>;

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  return ROUTES.map((route) => ({
    url: route.path === "/" ? SITE.url : `${SITE.url}${route.path}`,
    lastModified,
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }));
}
