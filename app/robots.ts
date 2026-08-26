import type { MetadataRoute } from "next";
import { SITE } from "@/lib/site";

/*
 * Nothing here is private — the whole point of the site is to be found and
 * read, by crawlers and by agents alike. See public/llms.txt for the same map
 * written for the ones that read prose.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
    },
    sitemap: `${SITE.url}/sitemap.xml`,
  };
}
