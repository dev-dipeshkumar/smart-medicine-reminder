import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Remove standalone output for Netlify - it uses its own build system
  // output: "standalone",
  
  typescript: {
    ignoreBuildErrors: true,
  },
  reactStrictMode: false,
  
  // Required for Netlify deployment
  images: {
    remotePatterns: [],
    unoptimized: true,
  },
  
  // Experimental features for better Netlify support
  experimental: {
    serverComponentsExternalPackages: ['@prisma/client', 'prisma'],
  },
};

export default nextConfig;
