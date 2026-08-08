import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Luma event covers
    remotePatterns: [{ protocol: "https", hostname: "images.lumacdn.com" }],
  },
};

export default nextConfig;
