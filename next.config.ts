import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "picsum.photos",
      },
      {
        protocol: "https",
        hostname: "cdn.pixabay.com",
      },
      {
        protocol: "https",
        hostname: "media.istockphoto.com",
      },
      {
        protocol: "https",
        hostname: "tdttgbmoaskpmmkvjenq.supabase.co",
      },
    ],
    // Optimize image loading
    formats: ['image/webp', 'image/avif'],
    minimumCacheTTL: 31536000, // Cache images for 1 year
    qualities: [75, 85],
  },
  // Enable compression
  compress: true,
  // Optimize production builds
  poweredByHeader: false,
  reactStrictMode: false,
};

export default nextConfig;
