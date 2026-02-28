import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // @ts-ignore - turbopack is a valid key in Next.js 15+ but might not be in the current types
  turbopack: {
    root: process.cwd(),
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'plus.unsplash.com',
      },
    ],
  },
};

export default nextConfig;
