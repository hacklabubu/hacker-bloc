import type { MetadataRoute } from "next";
import { SITE } from "@/lib/site";

/*
 * Every indexable page, in the order a stranger would meet them. Frequencies
 * describe how often the copy actually moves: /events follows the live calendar,
 * and the trust pages sit still for months at a time.
 */
const ROUTES = [
  { path: "/", changeFrequency: "weekly", priority: 1 },
  { path: "/events", changeFrequency: "daily", priority: 0.9 },
  { path: "/how-it-works", changeFrequency: "monthly", priority: 0.9 },
  { path: "/membership", changeFrequency: "monthly", priority: 0.9 },
  { path: "/roadmap", changeFrequency: "monthly", priority: 0.8 },
  { path: "/wishlist", changeFrequency: "weekly", priority: 0.7 },
  { path: "/members", changeFrequency: "daily", priority: 0.7 },
  { path: "/rules", changeFrequency: "monthly", priority: 0.7 },
  { path: "/join", changeFrequency: "monthly", priority: 0.9 },
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
