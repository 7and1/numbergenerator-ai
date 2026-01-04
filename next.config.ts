import type { NextConfig } from "next";
import TerserPlugin from "terser-webpack-plugin";

/**
 * Next.js static export for Cloudflare Pages.
 *
 * Note: `output: "export"` does not apply Next's `headers()` config.
 * Security & cache headers are configured via `public/_headers` (copied to `out/_headers`).
 */
const nextConfig: NextConfig = {
  // Memory optimization for development
  onDemandEntries: {
    maxInactiveAge: 15 * 1000,
    pagesBufferLength: 3,
  },

  output: "export",
  trailingSlash: true,
  images: { unoptimized: true },

  // Optimize compiler for faster builds
  compiler: {
    removeConsole: process.env.NODE_ENV === "production",
    // Remove prop-types to reduce bundle size (not needed with TypeScript)
    reactRemoveProperties: process.env.NODE_ENV === "production",
  },

  // Optimize package imports for tree-shaking
  modularizeImports: {
    "lucide-react": {
      transform: "lucide-react/dist/esm/icons/{{kebabCase member}}",
    },
  },

  // Reduce polyfills for modern browsers
  experimental: {
    optimizePackageImports: ["lucide-react"],
    // Optimize CSS
    optimizeCss: true,
  },

  // Production source maps (false for smaller bundles)
  productionBrowserSourceMaps: false,

  // Webpack configuration for bundle optimization
  webpack: (config, { isServer, webpack }) => {
    // Optimize chunk splitting for client bundles
    if (!isServer) {
      // Use terser for better minification in production
      if (process.env.NODE_ENV === "production") {
        config.optimization = {
          ...config.optimization,
          minimize: true,
          // Split chunks into smaller bundles for better caching
          splitChunks: {
            chunks: "all",
            maxSize: 200000, // ~200KB chunks before gzip for better parallel loading
            cacheGroups: {
              // React and React DOM in separate vendor chunk
              react: {
                test: /[\\/]node_modules[\\/](react|react-dom)[\\/]/,
                name: "react",
                priority: 30,
                reuseExistingChunk: true,
              },
              // Other vendor libraries
              vendor: {
                test: /[\\/]node_modules[\\/]/,
                name: "vendor",
                priority: 20,
                reuseExistingChunk: true,
              },
              // Common code shared across pages
              common: {
                minChunks: 2,
                priority: 10,
                reuseExistingChunk: true,
                name: "common",
              },
            },
          },
          // Enable module concatenation for smaller bundles
          concatenateModules: true,
          // Use deterministic module ids for better caching
          moduleIds: "deterministic",
          // Remove unused exports
          usedExports: true,
          // Side effect optimization
          sideEffects: true,
        };

        // Configure Terser for better minification
        config.optimization.minimizer = [
          new TerserPlugin({
            terserOptions: {
              compress: {
                drop_console: true,
                drop_debugger: true,
                pure_funcs: ["console.log", "console.info"],
              },
              format: {
                comments: false,
              },
            },
          }),
        ];
      }

      // Reduce build size by excluding server-only modules
      config.resolve = config.resolve || {};
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        path: false,
        crypto: false,
      };

      // Ignore moment.js locale files (not used but often bundled)
      config.plugins = config.plugins || [];
      config.plugins.push(
        new webpack.IgnorePlugin({
          resourceRegExp: /^\.\/locale$/,
          contextRegExp: /moment$/,
        }),
      );
    }

    return config;
  },
};

export default nextConfig;
