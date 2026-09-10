import type { NextConfig } from "next";

/*
 * The HTML half of the markdown content negotiation in proxy.ts.
 *
 * `Vary: Accept` has to be on BOTH representations, not just the markdown one:
 * without it any shared cache that saw one variant first will hand it to the
 * wrong audience — raw markdown to a browser, or `<div>` soup to an agent.
 * https://acceptmarkdown.com/guides/vary-accept
 *
 * Why it is declared here instead of being appended in proxy.ts (which is where
 * it belongs, and where the markdown and 406 branches do get it): Next 16
 * *overwrites* `Vary` while rendering an App Router page. See
 * node_modules/next/dist/build/templates/app-page.js —
 *
 *     const varyHeader = routeModule.getVaryHeader(...)
 *     res.setHeader('Vary', varyHeader)
 *
 * — an unconditional `setHeader`, run after proxy's response headers and after
 * this config's have already been applied to the response ("Headers are checked
 * before the filesystem which includes pages", per the `headers` docs). Nothing
 * inside the app can append to it: a Server Component cannot set response
 * headers, and proxy runs too early. Route handlers are unaffected, which is
 * why /api/markdown's own `Vary: Accept` survives.
 *
 * What this entry buys, then, is the deploy target: `headers` compile into
 * routes-manifest.json, and Vercel applies those at its routing layer on the
 * way back out — after the function has returned and after Next's overwrite.
 * Under `next start` it is inert; the page render still wins.
 *
 * The value therefore repeats Next's own list verbatim rather than being the
 * bare "Accept" it should be, so that the routing layer setting this header
 * cannot drop the RSC tokens Next put there. Next's client does not actually
 * depend on them — per the CDN caching guide it hashes the same headers into
 * the `_rsc` search param precisely because CDNs ignore `Vary` — but losing
 * them silently is not this feature's call to make. If a Next release stops
 * overwriting `Vary`, delete this whole block: proxy.ts already appends
 * correctly on its own.
 */
const APP_ROUTER_VARY =
  "rsc, next-router-state-tree, next-router-prefetch, next-router-segment-prefetch";

/* The negotiated pages: app/sitemap.ts's routes. */
const NEGOTIATED_PAGES = [
  "/",
  "/events",
  "/membership",
  "/roadmap",
  "/wishlist",
  "/rules",
  "/join",
  "/privacy",
] as const;

const nextConfig: NextConfig = {
  images: {
    // Luma event covers
    remotePatterns: [{ protocol: "https", hostname: "images.lumacdn.com" }],
    // 35 for the dither hero (50% opacity under a canvas overlay), 75 default
    qualities: [35, 75],
    /*
     * webp only: the site's photos are dithered/halftone-heavy, which AVIF
     * encodes dramatically WORSE than webp (the hero's q35 variant measured
     * 118KB as AVIF vs 18KB as webp).
     */
    formats: ["image/webp"],
  },
  /* Support the Bloc became the wishlist; old links keep working. */
  redirects: async () => [
    { source: "/support", destination: "/wishlist", permanent: true },
    /* The signed-in area moved from /members to /space. */
    { source: "/members", destination: "/space", permanent: true },
  ],
  headers: async () =>
    NEGOTIATED_PAGES.map((source) => ({
      source,
      headers: [{ key: "Vary", value: `${APP_ROUTER_VARY}, Accept` }],
    })),
};

export default nextConfig;
