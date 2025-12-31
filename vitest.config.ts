import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "node",
    include: ["lib/**/*.test.ts"],
    coverage: {
      provider: "v8",
      reporter: ["text", "json", "html", "lcov"],
      include: ["lib/**/*.ts"],
      exclude: ["lib/**/*.test.ts", "lib/**/*.spec.ts", "node_modules/"],
      thresholds: {
        lines: 80,
        functions: 80,
        branches: 75,
        statements: 80,
      },
    },
    reporters: ["default", "verbose"],
    // Run tests in series for better error tracking
    fileParallelism: false,
    // Set timeout for stress tests
    testTimeout: 30000,
    hookTimeout: 10000,
  },
});
