/**
 * Unit tests for sampling and random selection utilities
 */

import { describe, it, expect, beforeEach } from "vitest";
import {
  setCurrentMode,
  randomUint32,
  randomUint53,
  randomIntInclusive,
  sampleUniqueIndices,
  weightedPickIndex,
  weightedSampleWithoutReplacementIndices,
} from "../../../core/samplers";

describe("samplers", () => {
  beforeEach(() => {
    // Reset to default mode before each test
    setCurrentMode("range");
  });

  describe("setCurrentMode", () => {
    it("should set the current generator mode", () => {
      setCurrentMode("password");
      setCurrentMode("range");
      // Mode is set for security context tracking
      // No direct getter, so we just verify no error is thrown
      expect(() => setCurrentMode("lottery")).not.toThrow();
    });
  });

  describe("randomUint32", () => {
    it("should return a number", () => {
      const result = randomUint32();
      expect(typeof result).toBe("number");
    });

    it("should return a value within Uint32 range", () => {
      for (let i = 0; i < 100; i++) {
        const result = randomUint32();
        expect(result).toBeGreaterThanOrEqual(0);
        expect(result).toBeLessThanOrEqual(0xffffffff);
      }
    });

    it("should return integer values", () => {
      for (let i = 0; i < 100; i++) {
        const result = randomUint32();
        expect(Number.isInteger(result)).toBe(true);
      }
    });

    it("should generate different values", () => {
      const results = new Set<number>();
      for (let i = 0; i < 100; i++) {
        results.add(randomUint32());
      }
      // With 100 samples, we should have some variety
      expect(results.size).toBeGreaterThan(1);
    });

    it("should work in password mode", () => {
      setCurrentMode("password");
      const result = randomUint32();
      expect(typeof result).toBe("number");
      expect(result).toBeGreaterThanOrEqual(0);
      expect(result).toBeLessThanOrEqual(0xffffffff);
    });

    it("should work in digit mode", () => {
      setCurrentMode("digit");
      const result = randomUint32();
      expect(typeof result).toBe("number");
    });
  });

  describe("randomUint53", () => {
    it("should return a number", () => {
      const result = randomUint53();
      expect(typeof result).toBe("number");
    });

    it("should return an integer within safe range", () => {
      const result = randomUint53();
      expect(Number.isInteger(result)).toBe(true);
      expect(result).toBeGreaterThanOrEqual(0);
      expect(result).toBeLessThan(0x20_0000_0000_0000);
      expect(Number.isSafeInteger(result)).toBe(true);
    });
  });

  describe("randomIntInclusive", () => {
    it("should return value within range [min, max]", () => {
      for (let i = 0; i < 100; i++) {
        const result = randomIntInclusive(1, 10);
        expect(result).toBeGreaterThanOrEqual(1);
        expect(result).toBeLessThanOrEqual(10);
      }
    });

    it("should handle single value range", () => {
      for (let i = 0; i < 10; i++) {
        const result = randomIntInclusive(5, 5);
        expect(result).toBe(5);
      }
    });

    it("should swap min and max when min > max", () => {
      const results = new Set<number>();
      for (let i = 0; i < 50; i++) {
        results.add(randomIntInclusive(10, 1));
      }
      // Should get values between 1 and 10
      results.forEach((val) => {
        expect(val).toBeGreaterThanOrEqual(1);
        expect(val).toBeLessThanOrEqual(10);
      });
    });

    it("should handle negative numbers", () => {
      const results = new Set<number>();
      for (let i = 0; i < 50; i++) {
        results.add(randomIntInclusive(-10, -1));
      }
      results.forEach((val) => {
        expect(val).toBeGreaterThanOrEqual(-10);
        expect(val).toBeLessThanOrEqual(-1);
      });
    });

    it("should handle range crossing zero", () => {
      const results = new Set<number>();
      for (let i = 0; i < 100; i++) {
        results.add(randomIntInclusive(-5, 5));
      }
      results.forEach((val) => {
        expect(val).toBeGreaterThanOrEqual(-5);
        expect(val).toBeLessThanOrEqual(5);
      });
      // Should get both negative and positive values
      expect(results.has(-5)).toBe(true);
      expect(results.has(5)).toBe(true);
    });

    it("should handle large ranges", () => {
      const result = randomIntInclusive(0, 1000000);
      expect(result).toBeGreaterThanOrEqual(0);
      expect(result).toBeLessThanOrEqual(1000000);
    });

    it("should handle ranges larger than 2^32 without hanging", () => {
      const max = 63_072_000_000; // ~2 years in ms
      const result = randomIntInclusive(0, max);
      expect(result).toBeGreaterThanOrEqual(0);
      expect(result).toBeLessThanOrEqual(max);
    });

    it("should throw error for non-finite min", () => {
      expect(() => randomIntInclusive(NaN, 10)).toThrow(
        "min/max must be finite numbers",
      );
      expect(() => randomIntInclusive(Infinity, 10)).toThrow(
        "min/max must be finite numbers",
      );
    });

    it("should throw error for non-finite max", () => {
      expect(() => randomIntInclusive(1, NaN)).toThrow(
        "min/max must be finite numbers",
      );
    });

    it("should throw error for non-integer min", () => {
      expect(() => randomIntInclusive(1.5, 10)).toThrow(
        "min/max must be integers",
      );
    });

    it("should throw error for non-integer max", () => {
      expect(() => randomIntInclusive(1, 10.5)).toThrow(
        "min/max must be integers",
      );
    });

    it("should have uniform distribution", () => {
      const trials = 10000;
      const min = 1;
      const max = 5;
      const counts = new Array(max - min + 1).fill(0);

      for (let i = 0; i < trials; i++) {
        const result = randomIntInclusive(min, max);
        counts[result - min]++;
      }

      // Each value should appear approximately 20% of the time
      // Allow 5% margin of error for statistical variance
      counts.forEach((count) => {
        const ratio = count / trials;
        expect(ratio).toBeGreaterThan(0.15);
        expect(ratio).toBeLessThan(0.25);
      });
    });
  });

  describe("sampleUniqueIndices", () => {
    it("should return correct number of samples", () => {
      const result = sampleUniqueIndices(100, 10);
      expect(result).toHaveLength(10);
    });

    it("should return unique indices", () => {
      const result = sampleUniqueIndices(100, 50);
      const unique = new Set(result);
      expect(unique.size).toBe(50);
    });

    it("should return indices within valid range", () => {
      const populationSize = 100;
      const sampleSize = 20;
      const result = sampleUniqueIndices(populationSize, sampleSize);

      result.forEach((idx) => {
        expect(idx).toBeGreaterThanOrEqual(0);
        expect(idx).toBeLessThan(populationSize);
      });
    });

    it("should handle sample size equal to population", () => {
      const result = sampleUniqueIndices(10, 10);
      expect(result).toHaveLength(10);
      const sorted = [...result].sort((a, b) => a - b);
      expect(sorted).toEqual([0, 1, 2, 3, 4, 5, 6, 7, 8, 9]);
    });

    it("should handle sample size of 1", () => {
      const result = sampleUniqueIndices(100, 1);
      expect(result).toHaveLength(1);
      expect(result[0]).toBeGreaterThanOrEqual(0);
      expect(result[0]).toBeLessThan(100);
    });

    it("should handle large populations", () => {
      const result = sampleUniqueIndices(1000000, 100);
      expect(result).toHaveLength(100);
      const unique = new Set(result);
      expect(unique.size).toBe(100);
    });

    it("should use Floyd's algorithm efficiently", () => {
      // This is a stress test for performance and correctness
      const start = Date.now();
      const result = sampleUniqueIndices(10000, 5000);
      const duration = Date.now() - start;

      expect(result).toHaveLength(5000);
      const unique = new Set(result);
      expect(unique.size).toBe(5000);
      // Should complete in reasonable time (< 1 second)
      expect(duration).toBeLessThan(1000);
    });
  });

  describe("weightedPickIndex", () => {
    it("should return valid index", () => {
      const weights = [1, 2, 3];
      const result = weightedPickIndex(weights);
      expect(result).toBeGreaterThanOrEqual(0);
      expect(result).toBeLessThan(weights.length);
    });

    it("should return index 0 for single weight", () => {
      const result = weightedPickIndex([5]);
      expect(result).toBe(0);
    });

    it("should handle empty weights array", () => {
      const result = weightedPickIndex([]);
      // Empty array has no valid index
      expect(result).toBe(-1);
    });

    it("should handle all zero weights", () => {
      const weights = [0, 0, 0];
      const result = weightedPickIndex(weights);
      expect(result).toBeGreaterThanOrEqual(0);
      expect(result).toBeLessThan(weights.length);
    });

    it("should handle negative weights (treat as zero)", () => {
      const weights = [-5, 10, -5];
      const counts = [0, 0, 0];

      for (let i = 0; i < 100; i++) {
        const result = weightedPickIndex(weights);
        counts[result]++;
      }

      // Index 1 should be selected most often (only positive weight)
      expect(counts[1]).toBeGreaterThan(50);
    });

    it("should handle infinity weights", () => {
      const weights = [1, Infinity, 1];
      const result = weightedPickIndex(weights);
      expect(typeof result).toBe("number");
      expect(result).toBeGreaterThanOrEqual(0);
      expect(result).toBeLessThan(weights.length);
    });

    it("should respect weight distribution", () => {
      const weights = [1, 9]; // 10% vs 90% probability
      const counts = [0, 0];

      for (let i = 0; i < 1000; i++) {
        const result = weightedPickIndex(weights);
        counts[result]++;
      }

      // Index 1 should be selected significantly more often
      expect(counts[1]).toBeGreaterThan(counts[0] * 5);
    });
  });

  describe("weightedSampleWithoutReplacementIndices", () => {
    it("should return k samples", () => {
      const weights = [1, 2, 3, 4, 5];
      const result = weightedSampleWithoutReplacementIndices(weights, 3);
      expect(result).toHaveLength(3);
    });

    it("should return unique indices", () => {
      const weights = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
      const result = weightedSampleWithoutReplacementIndices(weights, 5);
      const unique = new Set(result);
      expect(unique.size).toBe(5);
    });

    it("should handle k larger than valid weights", () => {
      const weights = [1, 0, 0]; // Only first weight is valid
      const result = weightedSampleWithoutReplacementIndices(weights, 5);
      expect(result.length).toBeLessThanOrEqual(1);
    });

    it("should handle all zero or invalid weights", () => {
      const weights = [0, 0, -1, 0];
      const result = weightedSampleWithoutReplacementIndices(weights, 2);
      expect(result).toHaveLength(0);
    });

    it("should return indices within valid range", () => {
      const weights = [5, 3, 7, 2, 9];
      const result = weightedSampleWithoutReplacementIndices(weights, 3);

      result.forEach((idx) => {
        expect(idx).toBeGreaterThanOrEqual(0);
        expect(idx).toBeLessThan(weights.length);
      });
    });

    it("should favor higher weights", () => {
      const weights = [1, 100, 1, 1, 1]; // Index 1 has much higher weight
      const counts = [0, 0, 0, 0, 0];

      for (let i = 0; i < 100; i++) {
        const result = weightedSampleWithoutReplacementIndices(weights, 1);
        counts[result[0]!]++;
      }

      // Index 1 should be selected most often
      expect(counts[1]).toBeGreaterThan(50);
    });

    it("should handle k=0", () => {
      const weights = [1, 2, 3];
      const result = weightedSampleWithoutReplacementIndices(weights, 0);
      expect(result).toHaveLength(0);
    });
  });
});
