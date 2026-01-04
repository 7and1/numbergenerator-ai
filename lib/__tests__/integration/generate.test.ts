/**
 * Integration tests for the main generate() function
 * Tests full generator flows with various parameters and error handling
 */

import { describe, it, expect } from "vitest";
import { generate } from "../../generators/index";
import type { GeneratorMode, GeneratorParams } from "../../types";

describe("generate() integration", () => {
  describe("result structure", () => {
    it("should return GenerationResult with required fields", () => {
      const result = generate("range", { min: 1, max: 10, count: 1 });
      expect(result).toHaveProperty("values");
      expect(result).toHaveProperty("formatted");
      expect(result).toHaveProperty("timestamp");
      expect(result.values).toBeInstanceOf(Array);
      expect(typeof result.formatted).toBe("string");
      expect(typeof result.timestamp).toBe("number");
    });

    it("should include optional fields when applicable", () => {
      const result = generate("lottery", {
        pool_a: { min: 1, max: 49, pick: 6 },
        pool_b: { min: 1, max: 10, pick: 1 },
      });
      expect(result).toHaveProperty("bonus_values");
      expect(result.bonus_values).toHaveLength(1);
    });

    it("should include warnings when applicable", () => {
      const result = generate("range", {
        min: 1,
        max: 3,
        count: 100,
        unique: true,
      });
      expect(result.warnings).toBeDefined();
      expect(result.warnings?.length).toBeGreaterThan(0);
    });

    it("should include meta when applicable", () => {
      const result = generate("dice", { dice_sides: 20, dice_rolls: 1 });
      expect(result.meta).toBeDefined();
      expect(result.meta?.sides).toBe(20);
    });
  });

  describe("mode routing", () => {
    const modes: GeneratorMode[] = [
      "range",
      "digit",
      "password",
      "lottery",
      "list",
      "shuffle",
      "dice",
      "coin",
      "ticket",
      "uuid",
      "color",
      "hex",
      "timestamp",
      "coordinates",
      "ipv4",
      "mac",
      "fraction",
      "percentage",
      "date",
      "bytes",
      "words",
      "alphabet",
      "prime",
      "roman",
      "unicode",
      "ascii",
      "temperature",
      "currency",
      "phone",
      "email",
      "username",
    ];

    it("should handle all valid modes", () => {
      modes.forEach((mode) => {
        expect(() => generate(mode, {})).not.toThrow();
      });
    });

    it("should return values for all modes", () => {
      const paramsForMode = (mode: GeneratorMode): GeneratorParams => {
        switch (mode) {
          case "range":
            return { min: 1, max: 10, count: 1 };
          case "digit":
            return { length: 4, count: 1 };
          case "password":
            return { length: 12, count: 1 };
          case "lottery":
            return { pool_a: { min: 1, max: 49, pick: 6 } };
          case "list":
            return { items: ["a", "b", "c"], pick: 1 };
          case "shuffle":
            return { items: ["a", "b", "c", "d"] };
          case "dice":
            return { dice_sides: 6, dice_rolls: 1 };
          case "coin":
            return { coin_flips: 1 };
          case "ticket":
            return { ticket_source: "range", min: 1, max: 10, count: 1 };
          case "words":
            return { count: 1, word_count: 5 };
          default:
            return { count: 1 };
        }
      };

      modes.forEach((mode) => {
        const result = generate(mode, paramsForMode(mode));
        expect(result.values.length).toBeGreaterThan(0);
      });
    });
  });

  describe("range mode integration", () => {
    it("should generate range with all parameters", () => {
      const params: GeneratorParams = {
        min: 1,
        max: 100,
        count: 10,
        step: 5,
        precision: 1,
        unique: true,
        sort: "asc",
      };
      const result = generate("range", params);
      expect(result.values).toHaveLength(10);
      result.values.forEach((v) => {
        expect(v).toBeGreaterThanOrEqual(1);
        expect(v).toBeLessThanOrEqual(100);
      });
    });

    it("should format range output correctly", () => {
      const result = generate("range", { min: 1, max: 10, count: 5 });
      expect(result.formatted).toContain(",");
      expect(result.formatted.split(",")).toHaveLength(5);
    });
  });

  describe("password mode integration", () => {
    it("should generate password with all options", () => {
      const params: GeneratorParams = {
        length: 16,
        charset: "strong",
        grouping: false,
        include_lower: true,
        include_upper: true,
        include_digits: true,
        include_symbols: true,
        exclude_ambiguous: true,
        ensure_each: true,
        count: 5,
      };
      const result = generate("password", params);
      expect(result.values).toHaveLength(5);
      result.values.forEach((pwd) => {
        expect(typeof pwd).toBe("string");
        expect((pwd as string).length).toBe(16);
      });
      expect(result.meta?.password).toBeDefined();
    });

    it("should format multiple passwords as lines", () => {
      const result = generate("password", { length: 12, count: 3 });
      expect(result.formatted).toMatch(/.+\n.+\n.+/);
    });
  });

  describe("lottery mode integration", () => {
    it("should generate lottery with dual pools", () => {
      const params: GeneratorParams = {
        pool_a: { min: 1, max: 69, pick: 5 },
        pool_b: { min: 1, max: 26, pick: 1 },
      };
      const result = generate("lottery", params);
      expect(result.values).toHaveLength(5);
      expect(result.bonus_values).toHaveLength(1);
      expect(result.formatted).toContain("+");
    });
  });

  describe("dice mode integration", () => {
    it("should generate dice with advantage", () => {
      const params: GeneratorParams = {
        dice_sides: 20,
        dice_rolls: 1,
        dice_adv: "advantage",
        dice_modifier: 5,
      };
      const result = generate("dice", params);
      expect(result.values).toHaveLength(1);
      expect(result.bonus_values).toHaveLength(1);
      expect(result.meta?.d20).toBeDefined();
    });

    it("should generate custom face dice", () => {
      const params: GeneratorParams = {
        dice_custom_faces: ["a", "b", "c", "d", "e", "f"],
        dice_rolls: 3,
      };
      const result = generate("dice", params);
      expect(result.values).toHaveLength(3);
      result.values.forEach((v) => {
        expect(["a", "b", "c", "d", "e", "f"]).toContain(v);
      });
    });
  });

  describe("list mode integration", () => {
    it("should pick from list", () => {
      const params: GeneratorParams = {
        items: ["apple", "banana", "cherry", "date"],
        pick: 2,
        unique: true,
      };
      const result = generate("list", params);
      expect(result.values).toHaveLength(2);
    });

    it("should use weighted picks", () => {
      const params: GeneratorParams = {
        items: ["a", "b", "c"],
        weights: [1, 100, 1],
        pick: 10,
      };
      const result = generate("list", params);
      expect(result.values).toHaveLength(10);
      // "b" should appear most often due to high weight
      const bCount = result.values.filter((v) => v === "b").length;
      expect(bCount).toBeGreaterThan(3);
    });
  });

  describe("shuffle mode integration", () => {
    it("should shuffle items", () => {
      const params: GeneratorParams = {
        items: ["a", "b", "c", "d", "e"],
      };
      const result = generate("shuffle", params);
      expect(result.values).toHaveLength(5);
      const unique = new Set(result.values);
      expect(unique.size).toBe(5);
    });

    it("should group shuffled items", () => {
      const params: GeneratorParams = {
        items: ["a", "b", "c", "d", "e", "f"],
        group_size: 2,
      };
      const result = generate("shuffle", params);
      expect(result.formatted).toContain(",");
    });
  });

  describe("coin mode integration", () => {
    it("should flip coin", () => {
      const result = generate("coin", { coin_flips: 10 });
      expect(result.values).toHaveLength(10);
      result.values.forEach((v) => {
        expect(["HEADS", "TAILS"]).toContain(v);
      });
    });

    it("should use custom labels", () => {
      const result = generate("coin", {
        coin_flips: 5,
        coin_labels: ["YES", "NO"],
      });
      expect(result.values).toHaveLength(5);
      result.values.forEach((v) => {
        expect(["YES", "NO"]).toContain(v);
      });
    });

    it("should include coin statistics in meta", () => {
      const result = generate("coin", { coin_flips: 100 });
      expect(result.meta?.heads).toBeDefined();
      expect(result.meta?.tails).toBeDefined();
      expect(
        (result.meta?.heads as number) + (result.meta?.tails as number),
      ).toBe(100);
    });
  });

  describe("data generation modes integration", () => {
    it("should generate UUID", () => {
      const result = generate("uuid", { count: 5 });
      expect(result.values).toHaveLength(5);
      result.values.forEach((uuid) => {
        expect(typeof uuid).toBe("string");
        expect((uuid as string).length).toBeGreaterThan(30);
      });
    });

    it("should generate colors", () => {
      const result = generate("color", { count: 10, color_format: "hex" });
      expect(result.values).toHaveLength(10);
      result.values.forEach((color) => {
        expect(color as string).toMatch(/^#[0-9A-Fa-f]{6}$/);
      });
    });

    it("should generate hex bytes", () => {
      const result = generate("hex", { count: 5, hex_bytes: 4 });
      expect(result.values).toHaveLength(5);
    });

    it("should generate timestamps", () => {
      const result = generate("timestamp", {
        count: 10,
        timestamp_format: "unix",
      });
      expect(result.values).toHaveLength(10);
      result.values.forEach((ts) => {
        const num = parseInt(ts as string, 10);
        expect(num).toBeGreaterThan(0);
      });
    });

    it("should generate coordinates", () => {
      const result = generate("coordinates", { count: 5 });
      expect(result.values).toHaveLength(5);
      result.values.forEach((coord) => {
        expect(typeof coord).toBe("string");
      });
    });

    it("should generate IPv4 addresses", () => {
      const result = generate("ipv4", { count: 10 });
      expect(result.values).toHaveLength(10);
      result.values.forEach((ip) => {
        expect(ip as string).toMatch(/^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/);
      });
    });

    it("should generate MAC addresses", () => {
      const result = generate("mac", { count: 5 });
      expect(result.values).toHaveLength(5);
    });

    it("should generate random bytes", () => {
      const result = generate("bytes", { bytes_length: 16, count: 5 });
      expect(result.values).toHaveLength(5);
    });
  });

  describe("math modes integration", () => {
    it("should generate fractions", () => {
      const result = generate("fraction", { count: 10 });
      expect(result.values).toHaveLength(10);
      result.values.forEach((frac) => {
        expect(typeof frac).toBe("string");
      });
    });

    it("should generate percentages", () => {
      const result = generate("percentage", { count: 10 });
      expect(result.values).toHaveLength(10);
      result.values.forEach((pct) => {
        expect(pct as string).toContain("%");
      });
    });

    it("should generate prime numbers", () => {
      const result = generate("prime", { count: 10 });
      expect(result.values).toHaveLength(10);
      result.values.forEach((prime) => {
        const num = parseInt(prime as string, 10);
        expect(isPrime(num)).toBe(true);
      });
    });

    it("should generate Roman numerals", () => {
      const result = generate("roman", { count: 10 });
      expect(result.values).toHaveLength(10);
      const romanNumerals = ["I", "V", "X", "L", "C", "D", "M"];
      result.values.forEach((roman) => {
        const str = roman as string;
        const hasKnownSymbol = romanNumerals.some((sym) => str.includes(sym));
        expect(hasKnownSymbol).toBe(true);
      });
    });
  });

  describe("text modes integration", () => {
    it("should generate words", () => {
      const result = generate("words", { word_count: 5 });
      expect(result.values).toHaveLength(1);
      expect((result.values[0] as string).split(" ").length).toBe(5);
    });

    it("should generate alphabet letters", () => {
      const result = generate("alphabet", { count: 10 });
      expect(result.values).toHaveLength(10);
      result.values.forEach((letter) => {
        expect(typeof letter).toBe("string");
        expect((letter as string).length).toBe(1);
      });
    });

    it("should generate unicode characters", () => {
      const result = generate("unicode", { count: 10 });
      expect(result.values).toHaveLength(10);
    });

    it("should generate ASCII characters", () => {
      const result = generate("ascii", { count: 10 });
      expect(result.values).toHaveLength(10);
    });
  });

  describe("simulation modes integration", () => {
    it("should generate temperatures", () => {
      const result = generate("temperature", { count: 10 });
      expect(result.values).toHaveLength(10);
    });

    it("should generate currency values", () => {
      const result = generate("currency", { count: 10 });
      expect(result.values).toHaveLength(10);
      result.values.forEach((money) => {
        expect(money as string).toContain("$");
      });
    });

    it("should generate phone numbers", () => {
      const result = generate("phone", { count: 10 });
      expect(result.values).toHaveLength(10);
    });

    it("should generate email addresses", () => {
      const result = generate("email", { count: 10 });
      expect(result.values).toHaveLength(10);
      result.values.forEach((email) => {
        expect(email as string).toContain("@");
      });
    });

    it("should generate usernames", () => {
      const result = generate("username", { count: 10 });
      expect(result.values).toHaveLength(10);
    });

    it("should generate dates", () => {
      const result = generate("date", { count: 10 });
      expect(result.values).toHaveLength(10);
    });
  });

  describe("edge cases and error handling", () => {
    it("should handle empty params", () => {
      const result = generate("range", {});
      expect(result.values).toHaveLength(1);
    });

    it("should handle unknown mode gracefully", () => {
      const result = generate("unknown" as GeneratorMode, {});
      expect(result.values).toEqual([]);
      expect(result.formatted).toBe("");
    });

    it("should handle very large count", () => {
      const result = generate("range", { min: 1, max: 10, count: 100000 });
      expect(result.values.length).toBeLessThanOrEqual(10000); // Should be clamped
    });

    it("should handle negative ranges", () => {
      const result = generate("range", { min: -100, max: -1, count: 10 });
      expect(result.values).toHaveLength(10);
      result.values.forEach((v) => {
        expect(v).toBeGreaterThanOrEqual(-100);
        expect(v).toBeLessThanOrEqual(-1);
      });
    });

    it("should handle min > max", () => {
      const result = generate("range", { min: 100, max: 1, count: 10 });
      expect(result.values).toHaveLength(10);
      result.values.forEach((v) => {
        expect(v).toBeGreaterThanOrEqual(1);
        expect(v).toBeLessThanOrEqual(100);
      });
    });

    it("should handle single value range", () => {
      const result = generate("range", { min: 5, max: 5, count: 3 });
      expect(result.values).toHaveLength(3);
      result.values.forEach((v) => {
        expect(v).toBe(5);
      });
    });
  });

  describe("timestamp", () => {
    it("should include recent timestamp", () => {
      const before = Date.now();
      const result = generate("range", { min: 1, max: 10, count: 1 });
      const after = Date.now();
      expect(result.timestamp).toBeGreaterThanOrEqual(before);
      expect(result.timestamp).toBeLessThanOrEqual(after);
    });
  });

  describe("formatted output", () => {
    it("should format single value correctly", () => {
      const result = generate("range", { min: 1, max: 10, count: 1 });
      expect(result.formatted).not.toContain(",");
    });

    it("should format multiple values with comma separator", () => {
      const result = generate("range", { min: 1, max: 10, count: 5 });
      expect(result.formatted).toContain(", ");
    });

    it("should append bonus values to formatted string", () => {
      const result = generate("lottery", {
        pool_a: { min: 1, max: 10, pick: 3 },
        pool_b: { min: 1, max: 5, pick: 1 },
      });
      expect(result.formatted).toContain(" + ");
    });
  });
});

// Helper function for primality test
function isPrime(n: number): boolean {
  if (n < 2) return false;
  if (n === 2) return true;
  if (n % 2 === 0) return false;
  for (let i = 3; i <= Math.sqrt(n); i += 2) {
    if (n % i === 0) return false;
  }
  return true;
}
