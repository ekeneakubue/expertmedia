import type { NextConfig } from "next";
import path from "node:path";

const nextConfig: NextConfig = {
  turbopack: {
    root: path.resolve(__dirname),
  },
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: '**.blob.vercel-storage.com' },
      { protocol: 'https', hostname: 'blob.vercel-storage.com' },
      // Product, team, and hero images can be any HTTPS URL from admin uploads (S3, CDNs, etc.)
      { protocol: 'https', hostname: '**' },
    ],
  },
};

export default nextConfig;
