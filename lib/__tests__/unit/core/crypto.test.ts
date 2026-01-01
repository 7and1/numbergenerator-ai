/**
 * Unit tests for crypto utilities
 * Tests CSPRNG functions and security modes
 */

import { describe, it, expect } from "vitest";
import {
  getCrypto,
  getCryptoOptional,
  SECURE_MODE,
  type SecurityMode,
} from "../../../core/crypto";

describe("crypto", () => {
  describe("getCryptoOptional", () => {
    it("should return crypto when available", () => {
      const result = getCryptoOptional();
      // In Node.js environment with webcrypto, this should be available
      if (typeof globalThis.crypto !== "undefined") {
        expect(result).toBeDefined();
        expect(typeof result?.getRandomValues).toBe("function");
      } else {
        // If not available, test passes (no error thrown)
        expect(result).toBeUndefined();
      }
    });
  });

  describe("getCrypto", () => {
    it("should return crypto when available", () => {
      if (
        typeof globalThis.crypto !== "undefined" &&
        typeof globalThis.crypto.getRandomValues === "function"
      ) {
        const result = getCrypto();
        expect(result).toBeDefined();
        expect(typeof result.getRandomValues).toBe("function");
      }
      // If crypto not available, test passes (this is expected in some environments)
    });
  });

  describe("SECURE_MODE", () => {
    it("should be either 'SECURE' or 'BEST_EFFORT'", () => {
      expect(["SECURE", "BEST_EFFORT"]).toContain(SECURE_MODE);
    });

    it("should default to 'SECURE' for security-sensitive operations", () => {
      expect(SECURE_MODE).toBe("SECURE");
    });
  });

  describe("SecurityMode type", () => {
    it("should accept valid security modes", () => {
      const secure: SecurityMode = "SECURE";
      const bestEffort: SecurityMode = "BEST_EFFORT";
      expect(secure).toBe("SECURE");
      expect(bestEffort).toBe("BEST_EFFORT");
    });
  });

  describe("Crypto.getRandomValues integration", () => {
    it("should generate random values in Uint32Array", () => {
      const crypto = getCryptoOptional();
      if (!crypto) {
        // Skip test if crypto not available
        return;
      }

      const array = new Uint32Array(10);
      crypto.getRandomValues(array);

      expect(array).toHaveLength(10);
      expect(array.every((x) => typeof x === "number")).toBe(true);

      // Check that values are within valid range for Uint32
      expect(array.every((x) => x >= 0 && x <= 0xffffffff)).toBe(true);
    });

    it("should generate different values on subsequent calls", () => {
      const crypto = getCryptoOptional();
      if (!crypto) {
        return;
      }

      const array1 = new Uint32Array(100);
      const array2 = new Uint32Array(100);
      crypto.getRandomValues(array1);
      crypto.getRandomValues(array2);

      // With 100 values, probability of all being equal is astronomically low
      const someDifferent = array1.some((val, i) => val !== array2[i]);
      expect(someDifferent).toBe(true);
    });
  });
});
