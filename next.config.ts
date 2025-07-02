import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: true,

  experimental: {
    scrollRestoration: true,
  },

  images: {
    formats: ['image/avif', 'image/webp'],
    minimumCacheTTL: 60,
    domains: ['img.clerk.com'],  // Add this line to whitelist the domain
  },

  compress: true,
};

export default nextConfig;
