/**
 * Unit tests for lottery generator
 */

import { describe, it, expect } from "vitest";
import { generateLottery } from "../../../generators/lottery";
import type { GeneratorParams } from "../../../types";

describe("generateLottery", () => {
  describe("basic functionality", () => {
    it("should generate empty result with no pools", () => {
      const result = generateLottery({});
      expect(result.values).toEqual([]);
      expect(result.bonus_values).toEqual([]);
    });

    it("should generate from pool_a", () => {
      const params: GeneratorParams = {
        pool_a: { min: 1, max: 49, pick: 6 },
      };
      const result = generateLottery(params);
      expect(result.values).toHaveLength(6);
      result.values.forEach((v) => {
        expect(v).toBeGreaterThanOrEqual(1);
        expect(v).toBeLessThanOrEqual(49);
      });
    });

    it("should generate from pool_b", () => {
      const params: GeneratorParams = {
        pool_b: { min: 1, max: 10, pick: 1 },
      };
      const result = generateLottery(params);
      expect(result.bonus_values).toHaveLength(1);
      result.bonus_values.forEach((v) => {
        expect(v).toBeGreaterThanOrEqual(1);
        expect(v).toBeLessThanOrEqual(10);
      });
    });

    it("should generate from both pools", () => {
      const params: GeneratorParams = {
        pool_a: { min: 1, max: 49, pick: 6 },
        pool_b: { min: 1, max: 10, pick: 1 },
      };
      const result = generateLottery(params);
      expect(result.values).toHaveLength(6);
      expect(result.bonus_values).toHaveLength(1);
    });
  });

  describe("unique values", () => {
    it("should generate unique values in pool_a", () => {
      const params: GeneratorParams = {
        pool_a: { min: 1, max: 49, pick: 6 },
      };
      const result = generateLottery(params);
      const unique = new Set(result.values);
      expect(unique.size).toBe(6);
    });

    it("should generate unique values in pool_b", () => {
      const params: GeneratorParams = {
        pool_b: { min: 1, max: 20, pick: 5 },
      };
      const result = generateLottery(params);
      const unique = new Set(result.bonus_values);
      expect(unique.size).toBe(5);
    });

    it("should keep pools independent (same values allowed across pools)", () => {
      const params: GeneratorParams = {
        pool_a: { min: 1, max: 10, pick: 5 },
        pool_b: { min: 1, max: 10, pick: 3 },
      };
      const result = generateLottery(params);
      // Pools are independent, so overlap is allowed
      expect(result.values).toHaveLength(5);
      expect(result.bonus_values).toHaveLength(3);
    });
  });

  describe("sorting", () => {
    it("should return sorted values for pool_a", () => {
      const params: GeneratorParams = {
        pool_a: { min: 1, max: 49, pick: 6 },
      };
      const result = generateLottery(params);
      for (let i = 1; i < result.values.length; i++) {
        expect(result.values[i]).toBeGreaterThan(result.values[i - 1]!);
      }
    });

    it("should return sorted bonus_values for pool_b", () => {
      const params: GeneratorParams = {
        pool_b: { min: 1, max: 20, pick: 5 },
      };
      const result = generateLottery(params);
      for (let i = 1; i < result.bonus_values.length; i++) {
        expect(result.bonus_values[i]).toBeGreaterThan(
          result.bonus_values[i - 1]!,
        );
      }
    });
  });

  describe("pool parameter validation", () => {
    it("should clamp pick to minimum of 0", () => {
      const params: GeneratorParams = {
        pool_a: { min: 1, max: 49, pick: -5 },
      };
      const result = generateLottery(params);
      expect(result.values).toHaveLength(0);
    });

    it("should clamp pick to maximum of 1000", () => {
      const params: GeneratorParams = {
        pool_a: { min: 1, max: 1000, pick: 2000 },
      };
      const result = generateLottery(params);
      expect(result.values).toHaveLength(1000);
    });

    it("should handle pick larger than range", () => {
      const params: GeneratorParams = {
        pool_a: { min: 1, max: 5, pick: 100 },
      };
      const result = generateLottery(params);
      // Should still generate values (with possible repeats via randomIntInclusive)
      expect(result.values.length).toBeGreaterThan(0);
    });
  });

  describe("edge cases", () => {
    it("should handle min = max", () => {
      const params: GeneratorParams = {
        pool_a: { min: 7, max: 7, pick: 1 },
      };
      const result = generateLottery(params);
      expect(result.values).toEqual([7]);
    });

    it("should handle min > max (swapped)", () => {
      const params: GeneratorParams = {
        pool_a: { min: 49, max: 1, pick: 6 },
      };
      const result = generateLottery(params);
      expect(result.values).toHaveLength(6);
      result.values.forEach((v) => {
        expect(v).toBeGreaterThanOrEqual(1);
        expect(v).toBeLessThanOrEqual(49);
      });
    });

    it("should handle pick = 0", () => {
      const params: GeneratorParams = {
        pool_a: { min: 1, max: 49, pick: 0 },
      };
      const result = generateLottery(params);
      expect(result.values).toEqual([]);
    });

    it("should handle negative ranges", () => {
      const params: GeneratorParams = {
        pool_a: { min: -10, max: -1, pick: 5 },
      };
      const result = generateLottery(params);
      expect(result.values).toHaveLength(5);
      result.values.forEach((v) => {
        expect(v).toBeGreaterThanOrEqual(-10);
        expect(v).toBeLessThanOrEqual(-1);
      });
    });

    it("should handle range crossing zero", () => {
      const params: GeneratorParams = {
        pool_a: { min: -5, max: 5, pick: 5 },
      };
      const result = generateLottery(params);
      expect(result.values).toHaveLength(5);
    });

    it("should handle large ranges", () => {
      const params: GeneratorParams = {
        pool_a: { min: 1, max: 1000000, pick: 10 },
      };
      const result = generateLottery(params);
      expect(result.values).toHaveLength(10);
      const unique = new Set(result.values);
      expect(unique.size).toBe(10);
    });

    it("should handle pick of 1", () => {
      const params: GeneratorParams = {
        pool_a: { min: 1, max: 49, pick: 1 },
        pool_b: { min: 1, max: 10, pick: 1 },
      };
      const result = generateLottery(params);
      expect(result.values).toHaveLength(1);
      expect(result.bonus_values).toHaveLength(1);
    });
  });

  describe("real-world scenarios", () => {
    it("should simulate Powerball format", () => {
      // Powerball: 5 numbers from 1-69, 1 Powerball from 1-26
      const params: GeneratorParams = {
        pool_a: { min: 1, max: 69, pick: 5 },
        pool_b: { min: 1, max: 26, pick: 1 },
      };
      const result = generateLottery(params);
      expect(result.values).toHaveLength(5);
      expect(result.bonus_values).toHaveLength(1);
      const mainUnique = new Set(result.values);
      expect(mainUnique.size).toBe(5);
    });

    it("should simulate Mega Millions format", () => {
      // Mega Millions: 5 numbers from 1-70, 1 Mega Ball from 1-25
      const params: GeneratorParams = {
        pool_a: { min: 1, max: 70, pick: 5 },
        pool_b: { min: 1, max: 25, pick: 1 },
      };
      const result = generateLottery(params);
      expect(result.values).toHaveLength(5);
      expect(result.bonus_values).toHaveLength(1);
    });

    it("should simulate UK National Lottery format", () => {
      // UK Lotto: 6 numbers from 1-59
      const params: GeneratorParams = {
        pool_a: { min: 1, max: 59, pick: 6 },
      };
      const result = generateLottery(params);
      expect(result.values).toHaveLength(6);
      const unique = new Set(result.values);
      expect(unique.size).toBe(6);
    });

    it("should simulate EuroMillions format", () => {
      // EuroMillions: 5 numbers from 1-50, 2 Lucky Stars from 1-12
      const params: GeneratorParams = {
        pool_a: { min: 1, max: 50, pick: 5 },
        pool_b: { min: 1, max: 12, pick: 2 },
      };
      const result = generateLottery(params);
      expect(result.values).toHaveLength(5);
      expect(result.bonus_values).toHaveLength(2);
      const bonusUnique = new Set(result.bonus_values);
      expect(bonusUnique.size).toBe(2);
    });
  });

  describe("randomness", () => {
    it("should generate different results on multiple calls", () => {
      const params: GeneratorParams = {
        pool_a: { min: 1, max: 49, pick: 6 },
      };
      const results: number[][] = [];
      for (let i = 0; i < 10; i++) {
        const result = generateLottery(params);
        results.push(result.values);
      }
      // Check that not all results are identical
      const first = JSON.stringify(results[0]);
      const allSame = results.every((r) => JSON.stringify(r) === first);
      expect(allSame).toBe(false);
    });

    it("should have uniform distribution over time", () => {
      const params: GeneratorParams = {
        pool_a: { min: 1, max: 10, pick: 1 },
      };
      const counts = new Array(10).fill(0);
      const iterations = 1000;

      for (let i = 0; i < iterations; i++) {
        const result = generateLottery(params);
        counts[result.values[0]! - 1]++;
      }

      // Each number should appear roughly 100 times (10%)
      // Allow significant margin due to randomness
      counts.forEach((count) => {
        expect(count).toBeGreaterThan(50); // At least 5%
        expect(count).toBeLessThan(150); // At most 15%
      });
    });
  });

  describe("pool data types", () => {
    it("should handle numeric min/max as numbers", () => {
      const params: GeneratorParams = {
        pool_a: { min: 1, max: 10, pick: 3 },
      };
      const result = generateLottery(params);
      expect(result.values).toHaveLength(3);
    });

    it("should handle pool with default values", () => {
      const params: GeneratorParams = {
        pool_a: {} as { min: number; max: number; pick: number },
      };
      const result = generateLottery(params);
      // Should handle gracefully - empty object means undefined min/max/pick
      expect(Array.isArray(result.values)).toBe(true);
    });
  });
});
