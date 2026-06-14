import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Unsplash URLs are already sized via query params and served from a fast
    // CDN, so skip the on-demand optimizer (removes a per-image processing hop).
    unoptimized: true,
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "**.supabase.co" },
    ],
  },
};

export default nextConfig;
