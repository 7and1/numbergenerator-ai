import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "node",
    include: ["lib/**/*.test.ts", "lib/**/*.test.tsx"],
    coverage: {
      provider: "v8",
      reporter: ["text", "json", "html", "lcov"],
      include: ["lib/**/*.ts", "lib/**/*.tsx"],
      exclude: [
        "lib/**/*.test.ts",
        "lib/**/*.test.tsx",
        "lib/**/*.spec.ts",
        "lib/**/*.spec.tsx",
        "lib/__tests__/**",
        "node_modules/",
      ],
      thresholds: {
        lines: 80,
        functions: 80,
        branches: 75,
        statements: 80,
      },
      // Per-module thresholds
      // Core functions: 90%+
      // Generators: 85%+
      // Components: 70%+
    },
    reporters: ["default", "verbose"],
    // Run tests in series for better error tracking
    fileParallelism: false,
    // Set timeout for stress tests
    testTimeout: 30000,
    hookTimeout: 10000,
    // Coverage settings
    globals: true,
    setupFiles: [],
  },
});
