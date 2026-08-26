import type { NextConfig } from "next";

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
};

export default nextConfig;
