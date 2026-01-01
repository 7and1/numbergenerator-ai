import type { NextConfig } from "next";
import TerserPlugin from "terser-webpack-plugin";

/**
 * Security Headers Configuration for Cloudflare Pages
 *
 * Content-Security-Policy (CSP):
 * - Restricts sources of content to prevent XSS attacks
 * - Allows scripts from self and inline (for Next.js) + Umami analytics
 * - Allows images from self, data: URIs, and HTTPS
 * - Allows connections to Umami analytics endpoint
 * - Blocks plugins, frames, and restricts form actions
 *
 * Additional Security Headers:
 * - X-Content-Type-Options: Prevents MIME sniffing
 * - X-Frame-Options: Prevents clickjacking
 * - X-XSS-Protection: Legacy XSS filter (for older browsers)
 * - Referrer-Policy: Controls referrer information leakage
 * - Permissions-Policy: Disables sensitive device features
 *
 * Cache Headers:
 * - Static assets (images, fonts, JS, CSS): 1 year immutable
 * - HTML: no-cache to ensure fresh content
 *
 * Performance Optimizations:
 * - Code splitting by route and vendor
 * - Tree shaking for unused code
 * - Module concatenation for smaller bundles
 * - SWC minification
 * - Production-only optimizations
 */
const nextConfig: NextConfig = {
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

  // Security headers for Cloudflare Pages
  headers: async () => {
    return [
      {
        source: "/(.*)",
        headers: [
          // Content Security Policy
          {
            key: "Content-Security-Policy",
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-inline' https://umami.expertbeacon.com",
              "style-src 'self' 'unsafe-inline'",
              "img-src 'self' data: https:",
              "connect-src 'self' https://umami.expertbeacon.com",
              "font-src 'self'",
              "object-src 'none'",
              "base-uri 'self'",
              "form-action 'self'",
              "frame-ancestors 'none'",
            ].join("; "),
          },
          // X-Content-Type-Options: Prevent MIME sniffing
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          // X-Frame-Options: Prevent clickjacking
          {
            key: "X-Frame-Options",
            value: "DENY",
          },
          // X-XSS-Protection: Legacy XSS filter
          {
            key: "X-XSS-Protection",
            value: "1; mode=block",
          },
          // Referrer-Policy: Control referrer leakage
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
          // Permissions-Policy: Disable sensitive features
          {
            key: "Permissions-Policy",
            value: "geolocation=(), microphone=(), camera=()",
          },
        ],
      },
      // Cache headers for static assets (1 year immutable)
      {
        source: "/_next/static/(.*)",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
      {
        source: "/images/(.*)",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
      {
        source: "/fonts/(.*)",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
      {
        source: "/favicon.ico",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
      {
        source: "/(.*).png",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
      {
        source: "/(.*).jpg",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
      {
        source: "/(.*).jpeg",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
      {
        source: "/(.*).svg",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
      {
        source: "/(.*).webp",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
      {
        source: "/(.*).woff2",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
      // HTML pages: no-cache to ensure fresh content
      {
        source: "/(.*)",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=0, must-revalidate",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
