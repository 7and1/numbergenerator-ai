/**
 * Unit tests for array utilities
 */

import { describe, it, expect } from "vitest";
import {
  shuffleInPlace,
  removeChars,
  roundToPrecision,
  safeFiniteNumber,
  clampInt,
  rangeSize,
  valueAtIndex,
  normalizedItemsAndWeights,
} from "../../../core/arrays";

describe("arrays", () => {
  describe("shuffleInPlace", () => {
    it("should shuffle array in place", () => {
      const arr = [1, 2, 3, 4, 5];
      const originalLength = arr.length;
      const result = shuffleInPlace(arr);

      expect(result).toBe(arr); // Same reference
      expect(arr).toHaveLength(originalLength);
    });

    it("should not change array contents (same elements)", () => {
      const arr = [1, 2, 3, 4, 5];
      const sorted = [...arr].sort((a, b) => a - b);
      shuffleInPlace(arr);
      arr.sort((a, b) => a - b);

      expect(arr).toEqual(sorted);
    });

    it("should likely change order", () => {
      const arr = Array.from({ length: 100 }, (_, i) => i);
      const original = [...arr];
      shuffleInPlace(arr);

      // With 100 elements, very unlikely to stay in same order
      const same = arr.every((val, i) => val === original[i]);
      expect(same).toBe(false);
    });

    it("should handle single element array", () => {
      const arr = [1];
      shuffleInPlace(arr);
      expect(arr).toEqual([1]);
    });

    it("should handle empty array", () => {
      const arr: number[] = [];
      shuffleInPlace(arr);
      expect(arr).toEqual([]);
    });

    it("should handle string arrays", () => {
      const arr = ["a", "b", "c", "d", "e"];
      const original = [...arr];
      shuffleInPlace(arr);

      expect(arr.sort()).toEqual(original.sort());
    });
  });

  describe("removeChars", () => {
    it("should remove specified characters", () => {
      expect(removeChars("hello world", "lo")).toBe("he wrd");
    });

    it("should remove all occurrences", () => {
      expect(removeChars("ababab", "a")).toBe("bbb");
    });

    it("should return original string if remove is empty", () => {
      expect(removeChars("hello", "")).toBe("hello");
    });

    it("should return original string if remove is undefined", () => {
      expect(removeChars("hello", undefined as unknown as string)).toBe(
        "hello",
      );
    });

    it("should handle removing multiple different chars", () => {
      expect(removeChars("abcdefghijklmnopqrstuvwxyz", "aeiou")).toBe(
        "bcdfghjklmnpqrstvwxyz",
      );
    });

    it("should handle empty source string", () => {
      expect(removeChars("", "abc")).toBe("");
    });

    it("should handle all chars being removed", () => {
      expect(removeChars("aaa", "a")).toBe("");
    });
  });

  describe("roundToPrecision", () => {
    it("should round to given precision", () => {
      expect(roundToPrecision(3.14159, 2)).toBe(3.14);
      expect(roundToPrecision(3.14159, 4)).toBe(3.1416);
    });

    it("should handle precision 0", () => {
      expect(roundToPrecision(3.7, 0)).toBe(4);
      expect(roundToPrecision(3.2, 0)).toBe(3);
    });

    it("should handle negative precision", () => {
      expect(roundToPrecision(123.456, -1)).toBe(123);
      expect(roundToPrecision(123.456, -2)).toBe(123);
    });

    it("should return non-finite values as-is", () => {
      expect(roundToPrecision(NaN, 2)).toBeNaN();
      expect(roundToPrecision(Infinity, 2)).toBe(Infinity);
      expect(roundToPrecision(-Infinity, 2)).toBe(-Infinity);
    });

    it("should handle zero", () => {
      expect(roundToPrecision(0, 2)).toBe(0);
    });

    it("should handle negative numbers", () => {
      expect(roundToPrecision(-3.14159, 2)).toBe(-3.14);
    });

    it("should handle very small precision", () => {
      expect(roundToPrecision(1.23456789, 6)).toBe(1.234568);
    });
  });

  describe("safeFiniteNumber", () => {
    it("should return number if finite", () => {
      expect(safeFiniteNumber(42, 0)).toBe(42);
      expect(safeFiniteNumber(-3.14, 0)).toBe(-3.14);
      expect(safeFiniteNumber(0, 1)).toBe(0);
    });

    it("should return fallback for non-finite", () => {
      expect(safeFiniteNumber(Infinity, 0)).toBe(0);
      expect(safeFiniteNumber(-Infinity, 0)).toBe(0);
      expect(safeFiniteNumber(NaN, 0)).toBe(0);
    });

    it("should return fallback for non-numbers", () => {
      expect(safeFiniteNumber(null, 0)).toBe(0);
      expect(safeFiniteNumber(undefined, 0)).toBe(0);
      expect(safeFiniteNumber("42", 0)).toBe(0);
      expect(safeFiniteNumber({}, 0)).toBe(0);
    });

    it("should use custom fallback", () => {
      expect(safeFiniteNumber(NaN, -1)).toBe(-1);
      expect(safeFiniteNumber(null, 100)).toBe(100);
    });
  });

  describe("clampInt", () => {
    it("should clamp value above max", () => {
      expect(clampInt(150, 0, 100, 0)).toBe(100);
      expect(clampInt(1000, 1, 10, 5)).toBe(10);
    });

    it("should clamp value below min", () => {
      expect(clampInt(-50, 0, 100, 0)).toBe(0);
      expect(clampInt(0, 1, 10, 5)).toBe(1);
    });

    it("should return value within range", () => {
      expect(clampInt(50, 0, 100, 0)).toBe(50);
      expect(clampInt(5, 1, 10, 5)).toBe(5);
    });

    it("should floor the value", () => {
      expect(clampInt(5.7, 0, 10, 0)).toBe(5);
      expect(clampInt(5.2, 0, 10, 0)).toBe(5);
    });

    it("should return fallback for non-finite", () => {
      expect(clampInt(NaN, 0, 100, 50)).toBe(50);
      // Infinity is NOT finite, so it returns the fallback
      expect(clampInt(Infinity, 0, 100, 50)).toBe(50);
      expect(clampInt(-Infinity, 0, 100, 0)).toBe(0);
    });

    it("should return fallback for non-numbers", () => {
      expect(clampInt(null, 0, 100, 50)).toBe(50);
      expect(clampInt("50", 0, 100, 50)).toBe(50);
    });

    it("should handle negative ranges", () => {
      expect(clampInt(-5, -10, 10, 0)).toBe(-5);
      expect(clampInt(-15, -10, 10, 0)).toBe(-10);
      expect(clampInt(15, -10, 10, 0)).toBe(10);
    });
  });

  describe("rangeSize", () => {
    it("should calculate size of positive range", () => {
      expect(rangeSize(1, 10, 1)).toBe(10); // 1,2,3,4,5,6,7,8,9,10
      expect(rangeSize(0, 5, 1)).toBe(6); // 0,1,2,3,4,5
    });

    it("should handle swapped min/max", () => {
      expect(rangeSize(10, 1, 1)).toBe(10);
      expect(rangeSize(5, 0, 1)).toBe(6);
    });

    it("should handle step > 1", () => {
      expect(rangeSize(0, 10, 2)).toBe(6); // 0,2,4,6,8,10
      expect(rangeSize(1, 10, 3)).toBe(4); // 1,4,7,10
    });

    it("should return 0 for invalid step", () => {
      expect(rangeSize(1, 10, 0)).toBe(0);
      expect(rangeSize(1, 10, -1)).toBe(0);
    });

    it("should handle min = max", () => {
      expect(rangeSize(5, 5, 1)).toBe(1);
    });

    it("should handle negative numbers", () => {
      expect(rangeSize(-10, -1, 1)).toBe(10);
      expect(rangeSize(-5, 5, 1)).toBe(11);
    });

    it("should return 0 for inverted range with invalid step", () => {
      expect(rangeSize(10, 1, 0)).toBe(0);
    });

    it("should handle floating point step", () => {
      expect(rangeSize(0, 1, 0.1)).toBe(11);
      expect(rangeSize(0, 5, 0.5)).toBe(11);
    });
  });

  describe("valueAtIndex", () => {
    it("should calculate value at index", () => {
      expect(valueAtIndex(0, 1, 0)).toBe(0);
      expect(valueAtIndex(5, 1, 2)).toBe(7);
      expect(valueAtIndex(10, 5, 3)).toBe(25);
    });

    it("should handle negative min", () => {
      expect(valueAtIndex(-10, 2, 0)).toBe(-10);
      expect(valueAtIndex(-10, 2, 5)).toBe(0);
    });

    it("should handle step of 0", () => {
      expect(valueAtIndex(5, 0, 10)).toBe(5);
    });

    it("should handle fractional step", () => {
      expect(valueAtIndex(0, 0.5, 2)).toBe(1);
      expect(valueAtIndex(0, 0.1, 10)).toBe(1);
    });
  });

  describe("normalizedItemsAndWeights", () => {
    it("should clean items array", () => {
      const result = normalizedItemsAndWeights(["a", "b", "c"]);
      expect(result.items).toEqual(["a", "b", "c"]);
      expect(result.weights).toBeUndefined();
    });

    it("should trim and filter empty items", () => {
      const result = normalizedItemsAndWeights([
        "  a  ",
        "",
        "b",
        null,
        undefined,
        "  ",
        "c",
      ]);
      expect(result.items).toEqual(["a", "b", "c"]);
    });

    it("should convert non-strings to strings", () => {
      const result = normalizedItemsAndWeights([123, true, null, "text"]);
      expect(result.items).toEqual(["123", "true", "text"]);
    });

    it("should handle empty items array", () => {
      const result = normalizedItemsAndWeights([]);
      expect(result.items).toEqual([]);
      expect(result.weights).toBeUndefined();
    });

    it("should validate weights when provided", () => {
      const result = normalizedItemsAndWeights(["a", "b", "c"], [1, 2, 3]);
      expect(result.items).toEqual(["a", "b", "c"]);
      expect(result.weights).toEqual([1, 2, 3]);
    });

    it("should ignore weights for empty items", () => {
      const result = normalizedItemsAndWeights(["", null, "a"], [1, 2, 3]);
      expect(result.items).toEqual(["a"]);
      // Weights should only include non-empty items
      expect(result.weights).toEqual([3]);
    });

    it("should clamp negative weights to 0", () => {
      const result = normalizedItemsAndWeights(["a", "b", "c"], [1, -2, 3]);
      expect(result.weights).toEqual([1, 0, 3]);
    });

    it("should handle non-numeric weights", () => {
      const result = normalizedItemsAndWeights(
        ["a", "b", "c"],
        [1, NaN, Infinity],
      );
      // NaN and Infinity are NOT finite, so they become 1 (default weight)
      expect(result.weights).toEqual([1, 1, 1]);
    });

    it("should return undefined weights if all weights are 0 or invalid", () => {
      const result = normalizedItemsAndWeights(["a", "b", "c"], [0, 0, 0]);
      expect(result.weights).toBeUndefined();
    });

    it("should handle undefined weights", () => {
      const result = normalizedItemsAndWeights(["a", "b"], undefined);
      expect(result.items).toEqual(["a", "b"]);
      expect(result.weights).toBeUndefined();
    });

    it("should handle items and weights length mismatch", () => {
      const result = normalizedItemsAndWeights(["a", "b", "c"], [1, 2]);
      expect(result.items).toEqual(["a", "b", "c"]);
      // Extra item without weight gets default weight of 1
      expect(result.weights).toEqual([1, 2, 1]);
    });
  });
});
