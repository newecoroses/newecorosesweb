import type { NextConfig } from "next";
import path from "path";

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
    minimumCacheTTL: 1209600, // Cache images for 2 weeks (new products added weekly)
    qualities: [75, 85],
  },
  // Enable compression
  compress: true,
  // Optimize production builds
  poweredByHeader: false,
  reactStrictMode: false,
  // Force Turbopack to resolve tailwindcss from THIS project's node_modules,
  // not the parent C:\Users\FB0053AX\Downloads directory's package.json.
  turbopack: {
    resolveAlias: {
      tailwindcss: path.resolve(__dirname, "node_modules/tailwindcss"),
    },
  },
};

export default nextConfig;
