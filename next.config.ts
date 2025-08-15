import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Enable React Strict Mode for better development practices
  reactStrictMode: true,
  
  // Configure images for Next/Image with remote patterns
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  
  // Environment variables that should be available on the client
  env: {
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
  },
  
  // Webpack configuration (for non-Turbopack builds)
  webpack: (config, { isServer }) => {
    if (!isServer) {
      // Don't include certain packages in the client bundle
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
      };
    }
    return config;
  },
  
  // External packages that should be processed by Webpack
  serverExternalPackages: ["@prisma/client"],
  
  // Enable Turbopack in development
  experimental: {
    turbo: {
      // Add any Turbopack-specific configurations here
    },
  },
};

export default nextConfig;
