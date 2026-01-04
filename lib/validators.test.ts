import { describe, expect, it } from "vitest";

import {
  isPlainObject,
  isNonEmptyString,
  isFiniteNumber,
  isBoolean,
  isArray,
  validateGeneratorParams,
  validateHistoryArray,
  validateTicketLog,
  validateTicketLogEntry,
  validateGenerationResult,
  safeParseAndValidate,
} from "./validators";

describe("validators - type guards", () => {
  describe("isPlainObject", () => {
    it("returns true for plain objects", () => {
      expect(isPlainObject({})).toBe(true);
      expect(isPlainObject({ a: 1 })).toBe(true);
      expect(isPlainObject(Object.create(null))).toBe(false);
    });

    it("returns false for non-objects", () => {
      expect(isPlainObject(null)).toBe(false);
      expect(isPlainObject(undefined)).toBe(false);
      expect(isPlainObject([])).toBe(false);
      expect(isPlainObject("string")).toBe(false);
      expect(isPlainObject(123)).toBe(false);
      expect(isPlainObject(true)).toBe(false);
      expect(isPlainObject(new Date())).toBe(false);
      expect(isPlainObject(/regex/)).toBe(false);
    });
  });

  describe("isNonEmptyString", () => {
    it("returns true for non-empty strings", () => {
      expect(isNonEmptyString("hello")).toBe(true);
      expect(isNonEmptyString(" ")).toBe(true);
      expect(isNonEmptyString("a")).toBe(true);
    });

    it("returns false for non-strings or empty strings", () => {
      expect(isNonEmptyString("")).toBe(false);
      expect(isNonEmptyString(null)).toBe(false);
      expect(isNonEmptyString(undefined)).toBe(false);
      expect(isNonEmptyString(123)).toBe(false);
      expect(isNonEmptyString({})).toBe(false);
      expect(isNonEmptyString([])).toBe(false);
    });
  });

  describe("isFiniteNumber", () => {
    it("returns true for finite numbers", () => {
      expect(isFiniteNumber(0)).toBe(true);
      expect(isFiniteNumber(123)).toBe(true);
      expect(isFiniteNumber(-123)).toBe(true);
      expect(isFiniteNumber(1.5)).toBe(true);
      expect(isFiniteNumber(Number.MAX_SAFE_INTEGER)).toBe(true);
    });

    it("returns false for non-numbers or special values", () => {
      expect(isFiniteNumber(NaN)).toBe(false);
      expect(isFiniteNumber(Infinity)).toBe(false);
      expect(isFiniteNumber(-Infinity)).toBe(false);
      expect(isFiniteNumber(null)).toBe(false);
      expect(isFiniteNumber(undefined)).toBe(false);
      expect(isFiniteNumber("123")).toBe(false);
      expect(isFiniteNumber({})).toBe(false);
    });
  });

  describe("isBoolean", () => {
    it("returns true for booleans", () => {
      expect(isBoolean(true)).toBe(true);
      expect(isBoolean(false)).toBe(true);
    });

    it("returns false for non-booleans", () => {
      expect(isBoolean(null)).toBe(false);
      expect(isBoolean(undefined)).toBe(false);
      expect(isBoolean(1)).toBe(false);
      expect(isBoolean(0)).toBe(false);
      expect(isBoolean("true")).toBe(false);
    });
  });

  describe("isArray", () => {
    it("returns true for arrays", () => {
      expect(isArray([])).toBe(true);
      expect(isArray([1, 2, 3])).toBe(true);
      expect(isArray(Array.from([]))).toBe(true);
    });

    it("returns false for non-arrays", () => {
      expect(isArray(null)).toBe(false);
      expect(isArray(undefined)).toBe(false);
      expect(isArray({})).toBe(false);
      expect(isArray("string")).toBe(false);
    });
  });
});

describe("validators - validateGeneratorParams", () => {
  it("validates and returns valid params", () => {
    const input = {
      min: 1,
      max: 100,
      count: 10,
      unique: true,
      sort: "asc",
      charset: "strong",
      include_lower: true,
      include_upper: true,
    };

    const result = validateGeneratorParams(input);

    expect(result).toBeDefined();
    expect(result?.min).toBe(1);
    expect(result?.max).toBe(100);
    expect(result?.count).toBe(10);
    expect(result?.unique).toBe(true);
    expect(result?.sort).toBe("asc");
    expect(result?.charset).toBe("strong");
    expect(result?.include_lower).toBe(true);
    expect(result?.include_upper).toBe(true);
  });

  it("filters out invalid values", () => {
    const input = {
      min: NaN,
      max: Infinity,
      count: "not a number" as unknown as number,
      unique: "not a boolean",
      sort: "invalid",
      charset: "invalid",
    };

    const result = validateGeneratorParams(input);

    expect(result).toBeDefined();
    expect(result?.min).toBeUndefined();
    expect(result?.max).toBeUndefined();
    expect(result?.count).toBeUndefined();
    expect(result?.unique).toBeUndefined();
    expect(result?.sort).toBeUndefined();
    expect(result?.charset).toBeUndefined();
  });

  it("validates pool_a object", () => {
    const input = {
      pool_a: { min: 1, max: 69, pick: 5 },
    };

    const result = validateGeneratorParams(input);

    expect(result?.pool_a).toEqual({ min: 1, max: 69, pick: 5 });
  });

  it("rejects invalid pool_a object", () => {
    const input = {
      pool_a: { min: "invalid", max: 69, pick: 5 },
    };

    const result = validateGeneratorParams(input);

    expect(result?.pool_a).toBeUndefined();
  });

  it("validates items array", () => {
    const input = {
      items: ["a", "b", "c", "", "  d  "],
    };

    const result = validateGeneratorParams(input);

    expect(result?.items).toEqual(["a", "b", "c", "d"]);
  });

  it("validates weights array", () => {
    const input = {
      weights: [1, 2, 3, -5, 0],
    };

    const result = validateGeneratorParams(input);

    expect(result?.weights).toEqual([1, 2, 3, 0, 0]);
  });

  it("returns empty params for null input", () => {
    const result = validateGeneratorParams(null);

    expect(result).toBeNull();
  });

  it("returns empty params for non-object input", () => {
    expect(validateGeneratorParams("string")).toBeNull();
    expect(validateGeneratorParams(123)).toBeNull();
    expect(validateGeneratorParams([])).toBeNull();
  });
});

describe("validators - validateHistoryArray", () => {
  it("validates and trims history array", () => {
    const input = ["item1", "item2", "item3", "   spaces   ", ""];
    const result = validateHistoryArray(input, 10);

    expect(result).toEqual(["item1", "item2", "item3", "spaces"]);
  });

  it("limits array length", () => {
    const input = Array.from({ length: 100 }, (_, i) => `item${i}`);
    const result = validateHistoryArray(input, 5);

    expect(result).toHaveLength(5);
  });

  it("returns empty array for invalid input", () => {
    expect(validateHistoryArray(null)).toEqual([]);
    expect(validateHistoryArray(undefined)).toEqual([]);
    expect(validateHistoryArray("string")).toEqual([]);
    expect(validateHistoryArray({})).toEqual([]);
  });

  it("filters out non-string items", () => {
    const input = ["valid", 123, null, undefined, { key: "value" }, ["array"]];
    const result = validateHistoryArray(input);

    expect(result).toEqual(["valid"]);
  });
});

describe("validators - validateTicketLogEntry", () => {
  it("validates correct ticket log entry", () => {
    const input = {
      timestamp: 1234567890,
      values: ["1", "2", "3"],
    };

    const result = validateTicketLogEntry(input);

    expect(result).toEqual({
      timestamp: 1234567890,
      values: ["1", "2", "3"],
    });
  });

  it("uses current timestamp if missing", () => {
    const input = {
      values: ["1", "2", "3"],
    };

    const result = validateTicketLogEntry(input);

    expect(result?.values).toEqual(["1", "2", "3"]);
    expect(result?.timestamp).toBeGreaterThan(0);
  });

  it("filters out invalid values", () => {
    const input = {
      timestamp: 1234567890,
      values: ["1", 123, "", null, undefined, "2"],
    };

    const result = validateTicketLogEntry(input);

    expect(result?.values).toEqual(["1", 123, "2"]);
  });

  it("returns null for invalid input", () => {
    expect(validateTicketLogEntry(null)).toBeNull();
    expect(validateTicketLogEntry(undefined)).toBeNull();
    expect(validateTicketLogEntry("string")).toBeNull();
    expect(validateTicketLogEntry([])).toBeNull();
    expect(validateTicketLogEntry({})).toBeNull();
  });
});

describe("validators - validateTicketLog", () => {
  it("validates ticket log array", () => {
    const input = [
      { timestamp: 1000, values: ["a", "b"] },
      { timestamp: 2000, values: ["c", "d"] },
    ];

    const result = validateTicketLog(input, 10);

    expect(result).toHaveLength(2);
    expect(result[0]?.values).toEqual(["a", "b"]);
    expect(result[1]?.values).toEqual(["c", "d"]);
  });

  it("filters out invalid entries", () => {
    const input = [
      { timestamp: 1000, values: ["a"] },
      null,
      undefined,
      "invalid",
      { timestamp: 2000, values: ["b"] },
    ];

    const result = validateTicketLog(input);

    expect(result).toHaveLength(2);
  });

  it("limits number of entries", () => {
    const input = Array.from({ length: 100 }, (_, i) => ({
      timestamp: i * 1000,
      values: [`${i}`],
    }));

    const result = validateTicketLog(input, 5);

    expect(result).toHaveLength(5);
  });

  it("returns empty array for invalid input", () => {
    expect(validateTicketLog(null)).toEqual([]);
    expect(validateTicketLog(undefined)).toEqual([]);
    expect(validateTicketLog("string")).toEqual([]);
    expect(validateTicketLog({})).toEqual([]);
  });
});

describe("validators - validateGenerationResult", () => {
  it("validates correct generation result", () => {
    const input = {
      values: [1, 2, 3],
      bonus_values: [4, 5],
      formatted: "1, 2, 3",
      timestamp: 1234567890,
      warnings: ["Warning message"],
      meta: { key: "value" },
    };

    const result = validateGenerationResult(input);

    expect(result?.values).toEqual([1, 2, 3]);
    expect(result?.bonus_values).toEqual([4, 5]);
    expect(result?.formatted).toBe("1, 2, 3");
    expect(result?.timestamp).toBe(1234567890);
    expect(result?.warnings).toEqual(["Warning message"]);
    expect(result?.meta).toEqual({ key: "value" });
  });

  it("handles result without bonus_values or warnings", () => {
    const input = {
      values: ["a", "b", "c"],
      formatted: "a, b, c",
      timestamp: 1234567890,
    };

    const result = validateGenerationResult(input);

    expect(result?.values).toEqual(["a", "b", "c"]);
    expect(result?.bonus_values).toBeUndefined();
    expect(result?.warnings).toBeUndefined();
  });

  it("filters invalid values from bonus_values", () => {
    const input = {
      values: [1, 2],
      bonus_values: [3, "", null, 4],
      formatted: "1, 2",
      timestamp: 1234567890,
    };

    const result = validateGenerationResult(input);

    expect(result?.bonus_values).toEqual([3, 4]);
  });

  it("limits formatted string length", () => {
    const longString = "x".repeat(20000);
    const input = {
      values: [1],
      formatted: longString,
      timestamp: 1234567890,
    };

    const result = validateGenerationResult(input);

    expect(result?.formatted.length).toBe(10000);
  });

  it("limits warnings count", () => {
    const input = {
      values: [1],
      formatted: "result",
      timestamp: 1234567890,
      warnings: Array.from({ length: 20 }, (_, i) => `Warning ${i}`),
    };

    const result = validateGenerationResult(input);

    expect(result?.warnings).toHaveLength(10);
  });

  it("returns null for invalid input", () => {
    expect(validateGenerationResult(null)).toBeNull();
    expect(validateGenerationResult(undefined)).toBeNull();
    expect(validateGenerationResult("string")).toBeNull();
    expect(validateGenerationResult([])).toBeNull();
    expect(validateGenerationResult({})).toBeNull(); // Missing values
  });
});

describe("validators - safeParseAndValidate", () => {
  it("parses and validates JSON string", () => {
    const input = '{"min": 1, "max": 100}';
    const result = safeParseAndValidate(input, validateGeneratorParams, {
      min: 0,
      max: 10,
    });

    expect(result?.min).toBe(1);
    expect(result?.max).toBe(100);
  });

  it("returns fallback for null input", () => {
    const fallback = { min: 0, max: 10 };
    const result = safeParseAndValidate(
      null,
      validateGeneratorParams,
      fallback,
    );

    expect(result).toBe(fallback);
  });

  it("returns fallback for empty string", () => {
    const fallback = { min: 0, max: 10 };
    const result = safeParseAndValidate("", validateGeneratorParams, fallback);

    expect(result).toBe(fallback);
  });

  it("returns fallback for invalid JSON", () => {
    const fallback = { min: 0, max: 10 };
    const result = safeParseAndValidate(
      "invalid json",
      validateGeneratorParams,
      fallback,
    );

    expect(result).toBe(fallback);
  });

  it("returns fallback when validator returns null", () => {
    const fallback = { min: 0, max: 10 };
    const result = safeParseAndValidate("null", () => null, fallback);

    expect(result).toBe(fallback);
  });
});
