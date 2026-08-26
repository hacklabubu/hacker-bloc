import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Luma event covers
    remotePatterns: [{ protocol: "https", hostname: "images.lumacdn.com" }],
    // 50 for the dither hero (50% opacity under a canvas overlay), 75 default
    qualities: [50, 75],
  },
};

export default nextConfig;
