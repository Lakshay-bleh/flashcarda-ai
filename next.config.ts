import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: true,

  // Enables SWC-based minification (faster and more effective than Terser)
  swcMinify: true,

  // Opt out of legacy JavaScript for smaller bundles on modern browsers
  experimental: {
    scrollRestoration: true, // may improve navigation performance
  },

  // Reduce image layout shifts (especially helpful for LCP)
  images: {
    formats: ['image/avif', 'image/webp'],
    minimumCacheTTL: 60,
  },

  // Optionally enable compression (like gzip or Brotli)
  compress: true,

  // Webpack customization (optional for tree-shaking or bundle analysis)
  webpack: async (config, { isServer }) => {
    if (process.env.ANALYZE === 'true') {
      const { BundleAnalyzerPlugin } = await import('webpack-bundle-analyzer');
      config.plugins.push(
        new BundleAnalyzerPlugin({
          analyzerMode: 'static',
          reportFilename: isServer ? '../analyze-server.html' : './analyze-client.html',
        })
      );
    }

    return config;
  },
};

export default nextConfig;
