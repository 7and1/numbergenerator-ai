/**
 * Unit tests for range generator
 */

import { describe, it, expect } from "vitest";
import { generateRange } from "../../../generators/range";
import type { GeneratorParams } from "../../../types";

describe("generateRange", () => {
  const baseParams: GeneratorParams = {
    min: 1,
    max: 10,
    count: 5,
  };

  describe("basic functionality", () => {
    it("should generate requested count of values", () => {
      const result = generateRange(baseParams);
      expect(result.values).toHaveLength(5);
    });

    it("should generate values within range", () => {
      const result = generateRange(baseParams);
      result.values.forEach((v) => {
        expect(v).toBeGreaterThanOrEqual(1);
        expect(v).toBeLessThanOrEqual(10);
      });
    });

    it("should handle single value range", () => {
      const result = generateRange({ min: 5, max: 5, count: 3 });
      result.values.forEach((v) => {
        expect(v).toBe(5);
      });
    });

    it("should swap min and max when min > max", () => {
      const result = generateRange({ min: 10, max: 1, count: 5 });
      result.values.forEach((v) => {
        expect(v).toBeGreaterThanOrEqual(1);
        expect(v).toBeLessThanOrEqual(10);
      });
    });

    it("should handle negative ranges", () => {
      const result = generateRange({ min: -10, max: -1, count: 5 });
      result.values.forEach((v) => {
        expect(v).toBeGreaterThanOrEqual(-10);
        expect(v).toBeLessThanOrEqual(-1);
      });
    });

    it("should handle range crossing zero", () => {
      const result = generateRange({ min: -5, max: 5, count: 20 });
      result.values.forEach((v) => {
        expect(v).toBeGreaterThanOrEqual(-5);
        expect(v).toBeLessThanOrEqual(5);
      });
    });

    it("should handle large ranges", () => {
      const result = generateRange({ min: 0, max: 1000000, count: 10 });
      expect(result.values).toHaveLength(10);
      result.values.forEach((v) => {
        expect(v).toBeGreaterThanOrEqual(0);
        expect(v).toBeLessThanOrEqual(1000000);
      });
    });
  });

  describe("unique parameter", () => {
    it("should generate unique values when unique=true", () => {
      const result = generateRange({ ...baseParams, unique: true, count: 5 });
      const unique = new Set(result.values);
      expect(unique.size).toBe(5);
    });

    it("should allow duplicates when unique=false", () => {
      // With small range and high count, duplicates are likely
      const result = generateRange({
        min: 1,
        max: 3,
        count: 100,
        unique: false,
      });
      // We just check it runs without error, and has some values
      expect(result.values.length).toBeGreaterThan(0);
    });

    it("should add warning when unique is impossible", () => {
      const result = generateRange({
        min: 1,
        max: 3,
        count: 100,
        unique: true,
      });
      expect(result.warnings).toHaveLength(1);
      expect(result.warnings[0]).toContain("Unique is impossible");
    });

    it("should handle unique with exact count", () => {
      const result = generateRange({
        min: 1,
        max: 5,
        count: 5,
        unique: true,
      });
      const unique = new Set(result.values);
      expect(unique.size).toBe(5);
      unique.forEach((v) => {
        expect(v).toBeGreaterThanOrEqual(1);
        expect(v).toBeLessThanOrEqual(5);
      });
    });
  });

  describe("sort parameter", () => {
    it("should sort ascending when sort=asc", () => {
      const result = generateRange({
        ...baseParams,
        sort: "asc",
        unique: true,
      });
      for (let i = 1; i < result.values.length; i++) {
        expect(
          (result.values[i] as number) >= (result.values[i - 1] as number),
        ).toBe(true);
      }
    });

    it("should sort descending when sort=desc", () => {
      const result = generateRange({
        ...baseParams,
        sort: "desc",
        unique: true,
      });
      for (let i = 1; i < result.values.length; i++) {
        expect(
          (result.values[i] as number) <= (result.values[i - 1] as number),
        ).toBe(true);
      }
    });

    it("should not sort when sort=null", () => {
      const result = generateRange({ ...baseParams, sort: null });
      expect(result.values).toHaveLength(5);
      // No particular order expected
    });
  });

  describe("step parameter", () => {
    it("should use step=1 by default", () => {
      const result = generateRange({ min: 0, max: 10, count: 50, step: 1 });
      result.values.forEach((v) => {
        expect(Number.isInteger(v)).toBe(true);
      });
    });

    it("should respect custom step", () => {
      const result = generateRange({ min: 0, max: 20, count: 10, step: 5 });
      result.values.forEach((v) => {
        expect((v as number) % 5).toBe(0);
      });
    });

    it("should handle fractional step", () => {
      const result = generateRange({ min: 0, max: 1, count: 10, step: 0.1 });
      result.values.forEach((v) => {
        expect(v).toBeGreaterThanOrEqual(0);
        expect(v).toBeLessThanOrEqual(1);
      });
    });

    it("should default to step=1 when step <= 0", () => {
      const result = generateRange({ min: 0, max: 10, count: 5, step: 0 });
      result.values.forEach((v) => {
        expect(v).toBeGreaterThanOrEqual(0);
        expect(v).toBeLessThanOrEqual(10);
      });
    });
  });

  describe("precision parameter", () => {
    it("should round to specified precision", () => {
      const result = generateRange({
        min: 0,
        max: 10,
        count: 5,
        step: 1.2345,
        precision: 2,
      });
      result.values.forEach((v) => {
        const decimalPlaces =
          (v as number).toString().split(".")[1]?.length ?? 0;
        expect(decimalPlaces).toBeLessThanOrEqual(2);
      });
    });

    it("should handle precision 0", () => {
      const result = generateRange({
        min: 0,
        max: 10,
        count: 5,
        step: 1.5,
        precision: 0,
      });
      result.values.forEach((v) => {
        expect(Number.isInteger(v)).toBe(true);
      });
    });

    it("should handle negative precision", () => {
      const result = generateRange({
        min: 0,
        max: 10,
        count: 5,
        step: 1.5,
        precision: -2,
      });
      expect(result.values).toHaveLength(5);
    });
  });

  describe("count parameter", () => {
    it("should use count=1 by default", () => {
      const result = generateRange({ min: 1, max: 10 });
      expect(result.values).toHaveLength(1);
    });

    it("should clamp count to minimum of 1", () => {
      const result = generateRange({ min: 1, max: 10, count: 0 });
      expect(result.values).toHaveLength(1);
    });

    it("should clamp count to maximum of 10000", () => {
      const result = generateRange({ min: 1, max: 10, count: 20000 });
      expect(result.values).toHaveLength(10000);
    });

    it("should handle large count within range", () => {
      const result = generateRange({ min: 1, max: 100, count: 5000 });
      expect(result.values).toHaveLength(5000);
    });
  });

  describe("edge cases", () => {
    it("should return values when step=0 (defaults to step=1)", () => {
      const result = generateRange({ min: 1, max: 1, step: 0, count: 5 });
      // step of 0 defaults to 1, so generates [1,1,1,1,1] for range of 1-1
      expect(result.values).toEqual([1, 1, 1, 1, 1]);
    });

    it("should handle very small range", () => {
      const result = generateRange({ min: 1, max: 2, count: 10 });
      expect(result.values).toHaveLength(10);
      result.values.forEach((v) => {
        expect([1, 2]).toContain(v as number);
      });
    });

    it("should handle invalid min/max defaults", () => {
      const result = generateRange({});
      expect(result.values).toHaveLength(1);
      result.values.forEach((v) => {
        expect(v).toBeGreaterThanOrEqual(1);
        expect(v).toBeLessThanOrEqual(100);
      });
    });

    it("should handle undefined params", () => {
      const result = generateRange({});
      expect(result.values).toHaveLength(1);
    });

    it("should return numbers not strings", () => {
      const result = generateRange(baseParams);
      result.values.forEach((v) => {
        expect(typeof v).toBe("number");
      });
    });
  });

  describe("default parameters", () => {
    it("should use min=1 when not specified", () => {
      const result = generateRange({ max: 10, count: 1 });
      expect(result.values[0]).toBeGreaterThanOrEqual(1);
    });

    it("should use max=100 when not specified", () => {
      const result = generateRange({ min: 1, count: 1 });
      expect(result.values[0]).toBeLessThanOrEqual(100);
    });

    it("should use step=1 when not specified", () => {
      const result = generateRange({ min: 0, max: 10, count: 10 });
      result.values.forEach((v) => {
        expect(Number.isInteger(v)).toBe(true);
      });
    });

    it("should use precision=0 when not specified", () => {
      const result = generateRange({ min: 0, max: 10, count: 5 });
      result.values.forEach((v) => {
        expect(Number.isInteger(v)).toBe(true);
      });
    });
  });
});
