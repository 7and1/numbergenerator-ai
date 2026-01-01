/**
 * Unit tests for validator utilities
 */

import { describe, it, expect } from "vitest";
import {
  isPlainObject,
  isNonEmptyString,
  isFiniteNumber,
  isArray,
  isBoolean,
  validateGeneratorParams,
  validateHistoryArray,
  validateTicketLogEntry,
  validateTicketLog,
  validateGenerationResult,
  safeParseAndValidate,
} from "../../../validators";
import type { GeneratorParams } from "../../../types";

describe("validators", () => {
  describe("isPlainObject", () => {
    it("should return true for plain objects", () => {
      expect(isPlainObject({})).toBe(true);
      expect(isPlainObject({ a: 1 })).toBe(true);
      // Object.create(null) has null prototype, not Object.prototype
      // The implementation checks for Object.prototype specifically
      expect(isPlainObject(Object.create(null))).toBe(false);
    });

    it("should return false for non-objects", () => {
      expect(isPlainObject(null)).toBe(false);
      expect(isPlainObject(undefined)).toBe(false);
      expect(isPlainObject(123)).toBe(false);
      expect(isPlainObject("string")).toBe(false);
      expect(isPlainObject(true)).toBe(false);
    });

    it("should return false for arrays", () => {
      expect(isPlainObject([])).toBe(false);
      expect(isPlainObject([1, 2, 3])).toBe(false);
    });

    it("should return false for built-in objects", () => {
      expect(isPlainObject(new Date())).toBe(false);
      expect(isPlainObject(new RegExp("test"))).toBe(false);
      expect(isPlainObject(new Map())).toBe(false);
      expect(isPlainObject(new Set())).toBe(false);
    });
  });

  describe("isNonEmptyString", () => {
    it("should return true for non-empty strings", () => {
      expect(isNonEmptyString("hello")).toBe(true);
      expect(isNonEmptyString("a")).toBe(true);
      expect(isNonEmptyString(" ")).toBe(true); // Space is not empty
    });

    it("should return false for non-strings", () => {
      expect(isNonEmptyString(null)).toBe(false);
      expect(isNonEmptyString(undefined)).toBe(false);
      expect(isNonEmptyString(123)).toBe(false);
      expect(isNonEmptyString({})).toBe(false);
      expect(isNonEmptyString([])).toBe(false);
    });

    it("should return false for empty string", () => {
      expect(isNonEmptyString("")).toBe(false);
    });
  });

  describe("isFiniteNumber", () => {
    it("should return true for finite numbers", () => {
      expect(isFiniteNumber(0)).toBe(true);
      expect(isFiniteNumber(123)).toBe(true);
      expect(isFiniteNumber(-456)).toBe(true);
      expect(isFiniteNumber(1.5)).toBe(true);
    });

    it("should return false for non-numbers", () => {
      expect(isFiniteNumber(null)).toBe(false);
      expect(isFiniteNumber(undefined)).toBe(false);
      expect(isFiniteNumber("123")).toBe(false);
      expect(isFiniteNumber({})).toBe(false);
      expect(isFiniteNumber([])).toBe(false);
    });

    it("should return false for Infinity and NaN", () => {
      expect(isFiniteNumber(Infinity)).toBe(false);
      expect(isFiniteNumber(-Infinity)).toBe(false);
      expect(isFiniteNumber(NaN)).toBe(false);
    });
  });

  describe("isArray", () => {
    it("should return true for arrays", () => {
      expect(isArray([])).toBe(true);
      expect(isArray([1, 2, 3])).toBe(true);
      expect(isArray(["a", "b"])).toBe(true);
    });

    it("should return false for non-arrays", () => {
      expect(isArray(null)).toBe(false);
      expect(isArray(undefined)).toBe(false);
      expect(isArray({})).toBe(false);
      expect(isArray(123)).toBe(false);
      expect(isArray("string")).toBe(false);
    });
  });

  describe("isBoolean", () => {
    it("should return true for booleans", () => {
      expect(isBoolean(true)).toBe(true);
      expect(isBoolean(false)).toBe(true);
    });

    it("should return false for non-booleans", () => {
      expect(isBoolean(null)).toBe(false);
      expect(isBoolean(undefined)).toBe(false);
      expect(isBoolean(1)).toBe(false);
      expect(isBoolean(0)).toBe(false);
      expect(isBoolean("true")).toBe(false);
    });
  });

  describe("validateGeneratorParams", () => {
    it("should return null for non-objects", () => {
      expect(validateGeneratorParams(null)).toBe(null);
      expect(validateGeneratorParams(undefined)).toBe(null);
      expect(validateGeneratorParams("string")).toBe(null);
      expect(validateGeneratorParams(123)).toBe(null);
    });

    it("should validate numeric properties", () => {
      const input = {
        min: 1,
        max: 100,
        count: 10,
        step: 5,
        precision: 2,
      };
      const result = validateGeneratorParams(input);
      expect(result?.min).toBe(1);
      expect(result?.max).toBe(100);
      expect(result?.count).toBe(10);
      expect(result?.step).toBe(5);
      expect(result?.precision).toBe(2);
    });

    it("should filter out non-finite numeric values", () => {
      const input = {
        min: 1,
        max: NaN,
        count: Infinity,
        step: undefined,
      };
      const result = validateGeneratorParams(input);
      expect(result?.min).toBe(1);
      expect(result?.max).toBeUndefined();
      expect(result?.count).toBeUndefined();
      expect(result?.step).toBeUndefined();
    });

    it("should validate boolean properties", () => {
      const input = {
        unique: true,
        sort: "asc" as const,
        pad_zero: false,
      };
      const result = validateGeneratorParams(input);
      expect(result?.unique).toBe(true);
      expect(result?.sort).toBe("asc");
      expect(result?.pad_zero).toBe(false);
    });

    it("should accept string representations of booleans", () => {
      const input1 = { unique: "true" };
      const input2 = { unique: "false" };
      const input3 = { unique: 1 };
      const input4 = { unique: 0 };

      expect(validateGeneratorParams(input1)?.unique).toBe(true);
      expect(validateGeneratorParams(input2)?.unique).toBe(false);
      expect(validateGeneratorParams(input3)?.unique).toBe(true);
      expect(validateGeneratorParams(input4)?.unique).toBe(false);
    });

    it("should validate string properties", () => {
      const input = {
        custom_charset: "ABC123",
        exclude_chars: "0O1lI",
      };
      const result = validateGeneratorParams(input);
      expect(result?.custom_charset).toBe("ABC123");
      expect(result?.exclude_chars).toBe("0O1lI");
    });

    it("should filter empty strings", () => {
      const input = {
        custom_charset: "",
        exclude_chars: "   ",
      };
      const result = validateGeneratorParams(input);
      expect(result?.custom_charset).toBeUndefined();
      // Whitespace-only strings are NOT filtered (length > 0)
      expect(result?.exclude_chars).toBe("   ");
    });

    it("should validate charset property", () => {
      const validCharsets = [
        "numeric",
        "hex",
        "alphanumeric",
        "strong",
        "custom",
      ] as const;
      validCharsets.forEach((charset) => {
        const input = { charset };
        const result = validateGeneratorParams(input);
        expect(result?.charset).toBe(charset);
      });
    });

    it("should reject invalid charset values", () => {
      const input = { charset: "invalid" };
      const result = validateGeneratorParams(input);
      expect(result?.charset).toBeUndefined();
    });

    it("should validate dice_adv property", () => {
      const validAdv = ["none", "advantage", "disadvantage"] as const;
      validAdv.forEach((adv) => {
        const input = { dice_adv: adv };
        const result = validateGeneratorParams(input);
        expect(result?.dice_adv).toBe(adv);
      });
    });

    it("should validate pool_a object", () => {
      const input = {
        pool_a: { min: 1, max: 10, pick: 5 },
      };
      const result = validateGeneratorParams(input);
      expect(result?.pool_a).toEqual({ min: 1, max: 10, pick: 5 });
    });

    it("should reject invalid pool_a", () => {
      const input = {
        pool_a: { min: "invalid" as unknown, max: 10, pick: 5 },
      };
      const result = validateGeneratorParams(input);
      expect(result?.pool_a).toBeUndefined();
    });

    it("should validate items array", () => {
      const input = {
        items: ["apple", "banana", "cherry"],
      };
      const result = validateGeneratorParams(input);
      expect(result?.items).toEqual(["apple", "banana", "cherry"]);
    });

    it("should filter empty items", () => {
      const input = {
        items: ["apple", "", "banana", null, undefined, "cherry", "  "],
      };
      const result = validateGeneratorParams(input);
      expect(result?.items).toEqual(["apple", "banana", "cherry"]);
    });

    it("should validate weights array", () => {
      const input = {
        weights: [1, 2, 3, 4, 5],
      };
      const result = validateGeneratorParams(input);
      expect(result?.weights).toEqual([1, 2, 3, 4, 5]);
    });

    it("should clamp negative weights to 0", () => {
      const input = {
        weights: [1, -2, 3, -4, 5],
      };
      const result = validateGeneratorParams(input);
      expect(result?.weights).toEqual([1, 0, 3, 0, 5]);
    });

    it("should validate dice_custom_faces", () => {
      const input = {
        dice_custom_faces: ["a", "b", "c"],
      };
      const result = validateGeneratorParams(input);
      expect(result?.dice_custom_faces).toEqual(["a", "b", "c"]);
    });

    it("should reject dice_custom_faces with less than 2 items", () => {
      const input = { dice_custom_faces: ["a"] };
      const result = validateGeneratorParams(input);
      expect(result?.dice_custom_faces).toBeUndefined();
    });

    it("should validate coin_labels", () => {
      const input = {
        coin_labels: ["HEADS", "TAILS", "extra"],
      };
      const result = validateGeneratorParams(input);
      expect(result?.coin_labels).toEqual(["HEADS", "TAILS"]);
    });

    it("should handle empty coin_labels", () => {
      const input = { coin_labels: [] };
      const result = validateGeneratorParams(input);
      expect(result?.coin_labels).toBeUndefined();
    });

    it("should validate ticket_remaining", () => {
      const input = {
        ticket_remaining: ["A-001", "A-002", 123],
      };
      const result = validateGeneratorParams(input);
      expect(result?.ticket_remaining).toEqual(["A-001", "A-002", "123"]);
    });

    it("should return empty object for invalid input", () => {
      const result = validateGeneratorParams({ invalid: true });
      expect(Object.keys(result ?? {})).toHaveLength(0);
    });
  });

  describe("validateHistoryArray", () => {
    it("should return empty array for non-array input", () => {
      expect(validateHistoryArray(null)).toEqual([]);
      expect(validateHistoryArray(undefined)).toEqual([]);
      expect(validateHistoryArray("string")).toEqual([]);
      expect(validateHistoryArray({})).toEqual([]);
    });

    it("should validate array of strings", () => {
      const input = ["entry1", "entry2", "entry3"];
      const result = validateHistoryArray(input);
      expect(result).toEqual(["entry1", "entry2", "entry3"]);
    });

    it("should filter non-string values", () => {
      const input = ["entry1", 123, null, undefined, "entry2"];
      const result = validateHistoryArray(input);
      expect(result).toEqual(["entry1", "entry2"]);
    });

    it("should trim strings", () => {
      const input = ["  entry1  ", "entry2"];
      const result = validateHistoryArray(input);
      expect(result).toEqual(["entry1", "entry2"]);
    });

    it("should limit entry length", () => {
      const longString = "a".repeat(300);
      const result = validateHistoryArray([longString]);
      expect(result[0]?.length).toBe(200);
    });

    it("should limit total entries", () => {
      const input = Array.from({ length: 100 }, (_, i) => `entry${i}`);
      const result = validateHistoryArray(input, 50);
      expect(result).toHaveLength(50);
    });
  });

  describe("validateTicketLogEntry", () => {
    it("should return null for non-object input", () => {
      expect(validateTicketLogEntry(null)).toBe(null);
      expect(validateTicketLogEntry([])).toBe(null);
      expect(validateTicketLogEntry("string")).toBe(null);
    });

    it("should validate valid entry", () => {
      const input = {
        timestamp: 1234567890,
        values: [1, 2, 3],
      };
      const result = validateTicketLogEntry(input);
      expect(result?.timestamp).toBe(1234567890);
      expect(result?.values).toEqual([1, 2, 3]);
    });

    it("should use current timestamp if missing", () => {
      const input = { values: [1, 2, 3] };
      const result = validateTicketLogEntry(input);
      expect(result?.timestamp).toBeGreaterThan(0);
      expect(Date.now() - result!.timestamp).toBeLessThan(1000);
    });

    it("should filter invalid values", () => {
      const input = {
        timestamp: 1234567890,
        values: ["valid", "", null, undefined, 123],
      };
      const result = validateTicketLogEntry(input);
      // The validator keeps finite numbers as-is, not converted to strings
      expect(result?.values).toEqual(["valid", 123]);
    });

    it("should return null if no valid values", () => {
      const input = {
        timestamp: 1234567890,
        values: ["", null, undefined],
      };
      const result = validateTicketLogEntry(input);
      expect(result).toBe(null);
    });

    it("should handle legacy format (values as array in root)", () => {
      const input = [1, 2, 3];
      const result = validateTicketLogEntry(input);
      expect(result).toBe(null); // Legacy format requires isPlainObject check first
    });
  });

  describe("validateTicketLog", () => {
    it("should return empty array for non-array input", () => {
      expect(validateTicketLog(null)).toEqual([]);
      expect(validateTicketLog(undefined)).toEqual([]);
      expect(validateTicketLog({})).toEqual([]);
    });

    it("should validate array of entries", () => {
      const input = [
        { timestamp: 1, values: [1, 2] },
        { timestamp: 2, values: [3, 4] },
      ];
      const result = validateTicketLog(input);
      expect(result).toHaveLength(2);
    });

    it("should filter invalid entries", () => {
      const input = [
        { timestamp: 1, values: [1, 2] },
        null,
        undefined,
        { timestamp: 2, values: [] }, // Empty values
        { timestamp: 3, values: [3, 4] },
      ];
      const result = validateTicketLog(input);
      expect(result).toHaveLength(2);
    });

    it("should limit total entries", () => {
      const input = Array.from({ length: 100 }, (_, i) => ({
        timestamp: i,
        values: [i],
      }));
      const result = validateTicketLog(input, 50);
      expect(result).toHaveLength(50);
    });
  });

  describe("validateGenerationResult", () => {
    it("should return null for non-object input", () => {
      expect(validateGenerationResult(null)).toBe(null);
      expect(validateGenerationResult([])).toBe(null);
    });

    it("should validate valid result", () => {
      const input = {
        values: [1, 2, 3],
        formatted: "1, 2, 3",
        timestamp: 1234567890,
      };
      const result = validateGenerationResult(input);
      expect(result?.values).toEqual([1, 2, 3]);
      expect(result?.formatted).toBe("1, 2, 3");
      expect(result?.timestamp).toBe(1234567890);
    });

    it("should use current timestamp if missing", () => {
      const input = { values: [1, 2, 3], formatted: "1, 2, 3" };
      const result = validateGenerationResult(input);
      expect(result?.timestamp).toBeGreaterThan(0);
    });

    it("should validate bonus_values", () => {
      const input = {
        values: [1, 2],
        bonus_values: [3, 4],
        formatted: "1, 2",
        timestamp: 123,
      };
      const result = validateGenerationResult(input);
      expect(result?.bonus_values).toEqual([3, 4]);
    });

    it("should validate warnings", () => {
      const input = {
        values: [1],
        warnings: ["warning1", "warning2"],
        formatted: "1",
        timestamp: 123,
      };
      const result = validateGenerationResult(input);
      expect(result?.warnings).toEqual(["warning1", "warning2"]);
    });

    it("should limit warnings", () => {
      const warnings = Array.from({ length: 20 }, (_, i) => `warning${i}`);
      const input = {
        values: [1],
        warnings,
        formatted: "1",
        timestamp: 123,
      };
      const result = validateGenerationResult(input);
      expect(result?.warnings).toHaveLength(10);
    });

    it("should validate meta", () => {
      const meta = { key: "value", count: 5 };
      const input = {
        values: [1],
        meta,
        formatted: "1",
        timestamp: 123,
      };
      const result = validateGenerationResult(input);
      expect(result?.meta).toEqual(meta);
    });

    it("should limit formatted string length", () => {
      const longString = "a".repeat(20000);
      const input = {
        values: [1],
        formatted: longString,
        timestamp: 123,
      };
      const result = validateGenerationResult(input);
      expect(result?.formatted.length).toBe(10000);
    });

    it("should return null if no valid values", () => {
      const input = {
        values: [],
        formatted: "",
        timestamp: 123,
      };
      expect(validateGenerationResult(input)).toBe(null);
    });
  });

  describe("safeParseAndValidate", () => {
    it("should return fallback for null input", () => {
      const fallback = { default: true };
      expect(safeParseAndValidate(null, () => null, fallback)).toBe(fallback);
    });

    it("should return fallback for empty string", () => {
      const fallback = { default: true };
      expect(safeParseAndValidate("", () => null, fallback)).toBe(fallback);
    });

    it("should return fallback for invalid JSON", () => {
      const fallback = { default: true };
      expect(safeParseAndValidate("invalid json", () => null, fallback)).toBe(
        fallback,
      );
    });

    it("should parse and validate valid JSON", () => {
      const input = JSON.stringify({ value: 42 });
      const validator = (v: unknown) =>
        typeof v === "object" && v !== null && "value" in v
          ? (v as { value: number })
          : null;
      const result = safeParseAndValidate(input, validator, { value: 0 });
      expect(result).toEqual({ value: 42 });
    });

    it("should return fallback if validator returns null", () => {
      const input = JSON.stringify({ value: 42 });
      const validator = () => null;
      const fallback = { value: 0 };
      const result = safeParseAndValidate(input, validator, fallback);
      expect(result).toBe(fallback);
    });

    it("should handle validator returning non-null", () => {
      const input = JSON.stringify({ test: "value" });
      const validator = (v: unknown): { test: string } | null =>
        typeof v === "object" && v !== null && "test" in v
          ? (v as { test: string })
          : null;
      const result = safeParseAndValidate(input, validator, {
        test: "default",
      });
      expect(result).toEqual({ test: "value" });
    });
  });
});
