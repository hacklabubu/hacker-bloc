import type { NextConfig } from "next";

/*
 * `Vary: Accept` for the markdown content negotiation in proxy.ts is added by
 * instrumentation.ts, not here: a `headers` entry cannot win against Next's
 * own `Vary` overwrite during the page render.
 */

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
  ],
};

export default nextConfig;
