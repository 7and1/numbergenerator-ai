/**
 * Unit tests for password and PIN generators
 */

import { describe, it, expect } from "vitest";
import { generatePassword, generateDigit } from "../../../generators/password";
import type { GeneratorParams } from "../../../types";

describe("generatePassword", () => {
  describe("basic functionality", () => {
    it("should generate a password", () => {
      const result = generatePassword({});
      expect(result.values).toHaveLength(1);
      expect(result.values[0]).toBeTruthy();
      expect(typeof result.values[0]).toBe("string");
    });

    it("should return metadata", () => {
      const result = generatePassword({ length: 16, count: 1 });
      expect(result.meta).toBeDefined();
      expect(result.meta?.password).toEqual({
        length: 16,
        batch: 1,
      });
    });
  });

  describe("length parameter", () => {
    it("should generate password of specified length", () => {
      const result = generatePassword({ length: 20 });
      expect(result.values[0]?.length).toBe(20);
    });

    it("should clamp minimum length to 4", () => {
      const result = generatePassword({ length: 1 });
      expect(result.values[0]?.length).toBe(4);
    });

    it("should clamp maximum length to 256", () => {
      const result = generatePassword({ length: 500 });
      expect(result.values[0]?.length).toBe(256);
    });

    it("should use default length of 12", () => {
      const result = generatePassword({});
      expect(result.values[0]?.length).toBe(12);
    });
  });

  describe("batch/count parameter", () => {
    it("should generate multiple passwords", () => {
      const result = generatePassword({ length: 8, count: 5 });
      expect(result.values).toHaveLength(5);
    });

    it("should clamp count to minimum of 1", () => {
      const result = generatePassword({ count: 0 });
      expect(result.values).toHaveLength(1);
    });

    it("should clamp count to maximum of 200", () => {
      const result = generatePassword({ count: 500 });
      expect(result.values).toHaveLength(200);
    });
  });

  describe("charset parameter", () => {
    it("should use strong charset by default", () => {
      const result = generatePassword({ length: 50 });
      const password = result.values[0]!;
      // Strong charset includes lowercase, uppercase, digits, symbols
      expect(/[a-z]/.test(password)).toBe(true);
      expect(/[A-Z]/.test(password)).toBe(true);
      expect(/[0-9]/.test(password)).toBe(true);
      expect(/[!@#$%^&*()_+\-=]/.test(password)).toBe(true);
    });

    it("should use numeric charset", () => {
      const result = generatePassword({ charset: "numeric", length: 20 });
      const password = result.values[0]!;
      expect(/^[0-9]+$/.test(password)).toBe(true);
    });

    it("should use hex charset", () => {
      const result = generatePassword({ charset: "hex", length: 20 });
      const password = result.values[0]!;
      expect(/^[0-9A-F]+$/.test(password)).toBe(true);
    });

    it("should use alphanumeric charset", () => {
      const result = generatePassword({ charset: "alphanumeric", length: 50 });
      const password = result.values[0]!;
      expect(/^[a-zA-Z0-9]+$/.test(password)).toBe(true);
      // No symbols
      expect(/[!@#$%^&*()]/.test(password)).toBe(false);
    });
  });

  describe("custom charset", () => {
    it("should use custom charset when provided", () => {
      const result = generatePassword({
        charset: "custom",
        custom_charset: "ABC123",
        length: 20,
      });
      const password = result.values[0]!;
      expect(/^[ABC123]+$/.test(password)).toBe(true);
    });

    it("should fall back to strong charset for empty custom", () => {
      const result = generatePassword({
        charset: "custom",
        custom_charset: "",
        length: 20,
      });
      const password = result.values[0]!;
      expect(password.length).toBe(20);
    });
  });

  describe("grouping parameter", () => {
    it("should add grouping when enabled", () => {
      const result = generatePassword({
        length: 16,
        grouping: true,
        count: 1,
      });
      const password = result.values[0]!;
      expect(password).toContain("-");
      expect(password.split("-").length).toBeGreaterThan(1);
    });

    it("should not add grouping when disabled", () => {
      const result = generatePassword({
        length: 16,
        grouping: false,
        count: 1,
      });
      const password = result.values[0]!;
      expect(password).not.toContain("-");
    });

    it("should not group short passwords", () => {
      const result = generatePassword({
        length: 4,
        grouping: true,
        count: 1,
      });
      const password = result.values[0]!;
      // No grouping for length <= 4
      expect(password).not.toContain("-");
    });
  });

  describe("pro options", () => {
    it("should include lowercase when include_lower=true", () => {
      const result = generatePassword({
        length: 50,
        include_lower: true,
        include_upper: false,
        include_digits: false,
        include_symbols: false,
        count: 1,
      });
      const password = result.values[0]!;
      expect(/[a-z]/.test(password)).toBe(true);
      expect(/[A-Z]/.test(password)).toBe(false);
    });

    it("should include uppercase when include_upper=true", () => {
      const result = generatePassword({
        length: 50,
        include_lower: false,
        include_upper: true,
        include_digits: false,
        include_symbols: false,
        count: 1,
      });
      const password = result.values[0]!;
      expect(/[A-Z]/.test(password)).toBe(true);
      expect(/[a-z]/.test(password)).toBe(false);
    });

    it("should include digits when include_digits=true", () => {
      const result = generatePassword({
        length: 50,
        include_lower: false,
        include_upper: false,
        include_digits: true,
        include_symbols: false,
        count: 1,
      });
      const password = result.values[0]!;
      expect(/[0-9]/.test(password)).toBe(true);
      expect(/[a-zA-Z]/.test(password)).toBe(false);
    });

    it("should include symbols when include_symbols=true", () => {
      const result = generatePassword({
        length: 50,
        include_lower: false,
        include_upper: false,
        include_digits: false,
        include_symbols: true,
        count: 1,
      });
      const password = result.values[0]!;
      expect(/[!@#$%^&*()_+\-=~\[\]{};:,.?]/.test(password)).toBe(true);
      expect(/[a-zA-Z0-9]/.test(password)).toBe(false);
    });
  });

  describe("exclude ambiguous", () => {
    it("should exclude ambiguous characters", () => {
      const result = generatePassword({
        length: 100,
        include_lower: true,
        include_upper: true,
        include_digits: true,
        include_symbols: false,
        exclude_ambiguous: true,
        count: 1,
      });
      const password = result.values[0]!;
      // Check for common ambiguous chars
      expect(password).not.toContain("0");
      expect(password).not.toContain("O");
      expect(password).not.toContain("1");
      expect(password).not.toContain("l");
      expect(password).not.toContain("I");
    });
  });

  describe("exclude chars", () => {
    it("should exclude specified characters", () => {
      const result = generatePassword({
        length: 50,
        include_lower: true,
        include_upper: true,
        include_digits: true,
        include_symbols: false,
        exclude_chars: "aeiouAEIOU",
        count: 1,
      });
      const password = result.values[0]!;
      expect(/[aeiouAEIOU]/.test(password)).toBe(false);
    });
  });

  describe("ensure each", () => {
    it("should include at least one from each selected set", () => {
      const result = generatePassword({
        length: 20,
        include_lower: true,
        include_upper: true,
        include_digits: true,
        include_symbols: false,
        ensure_each: true,
        count: 10,
      });
      result.values.forEach((password) => {
        expect(/[a-z]/.test(password as string)).toBe(true);
        expect(/[A-Z]/.test(password as string)).toBe(true);
        expect(/[0-9]/.test(password as string)).toBe(true);
      });
    });

    it("should include all four sets when ensure_each=true", () => {
      const result = generatePassword({
        length: 30,
        include_lower: true,
        include_upper: true,
        include_digits: true,
        include_symbols: true,
        ensure_each: true,
        count: 5,
      });
      result.values.forEach((password) => {
        expect(/[a-z]/.test(password as string)).toBe(true);
        expect(/[A-Z]/.test(password as string)).toBe(true);
        expect(/[0-9]/.test(password as string)).toBe(true);
        expect(/[!@#$%^&*()_+\-=~\[\]{};:,.?]/.test(password as string)).toBe(
          true,
        );
      });
    });
  });

  describe("uniqueness", () => {
    it("should generate different passwords", () => {
      const result = generatePassword({ length: 16, count: 100 });
      const unique = new Set(result.values);
      // With 100 16-character passwords, probability of collision is extremely low
      expect(unique.size).toBeGreaterThan(95);
    });

    it("should generate different passwords in batch", () => {
      const result = generatePassword({ length: 12, count: 10 });
      const unique = new Set(result.values);
      expect(unique.size).toBeGreaterThan(8);
    });
  });

  describe("edge cases", () => {
    it("should handle empty params", () => {
      const result = generatePassword({});
      expect(result.values).toHaveLength(1);
      expect(result.values[0]?.length).toBeGreaterThan(0);
    });

    it("should handle minimum viable length with ensure_each", () => {
      const result = generatePassword({
        length: 4,
        include_lower: true,
        include_upper: true,
        include_digits: true,
        include_symbols: true,
        ensure_each: true,
        count: 1,
      });
      const password = result.values[0]!;
      // With 4 sets and length 4, should get one from each
      expect(password.length).toBe(4);
    });
  });
});

describe("generateDigit", () => {
  describe("basic functionality", () => {
    it("should generate a PIN", () => {
      const result = generateDigit({});
      expect(result.values).toHaveLength(1);
      expect(/^\d+$/.test(result.values[0] as string)).toBe(true);
    });

    it("should generate numeric string", () => {
      const result = generateDigit({ length: 6 });
      expect(typeof result.values[0]).toBe("string");
      expect(/^\d+$/.test(result.values[0] as string)).toBe(true);
    });
  });

  describe("length parameter", () => {
    it("should generate PIN of specified length", () => {
      const result = generateDigit({ length: 8 });
      expect(result.values[0]?.length).toBe(8);
    });

    it("should clamp minimum length to 1", () => {
      const result = generateDigit({ length: 0 });
      expect(result.values[0]?.length).toBe(1);
    });

    it("should clamp maximum length to 18", () => {
      const result = generateDigit({ length: 50 });
      expect(result.values[0]?.length).toBe(18);
    });

    it("should use default length of 4", () => {
      const result = generateDigit({});
      expect(result.values[0]?.length).toBe(4);
    });
  });

  describe("pad_zero parameter", () => {
    it("should pad with zeros when pad_zero=true", () => {
      const result = generateDigit({ length: 6, pad_zero: true });
      const pin = result.values[0]!;
      expect(pin.length).toBe(6);
      // Even if value is small, it should be padded
      expect(pin).toMatch(/^\d{6}$/);
    });

    it("should not pad when pad_zero=false", () => {
      const result = generateDigit({ length: 6, pad_zero: false });
      const pin = result.values[0]!;
      // Without padding, length might be less than specified
      expect(typeof pin).toBe("string");
    });

    it("should use pad_zero=true by default", () => {
      const result = generateDigit({ length: 4 });
      const pin = result.values[0]!;
      expect(pin.length).toBe(4);
    });
  });

  describe("value range", () => {
    it("should generate values within valid range", () => {
      const result = generateDigit({ length: 4, pad_zero: false });
      const pin = result.values[0]!;
      const num = parseInt(pin, 10);
      expect(num).toBeGreaterThanOrEqual(0);
      expect(num).toBeLessThanOrEqual(9999);
    });

    it("should respect max value for length", () => {
      const result = generateDigit({ length: 2, pad_zero: false });
      const pin = result.values[0]!;
      const num = parseInt(pin, 10);
      expect(num).toBeGreaterThanOrEqual(0);
      expect(num).toBeLessThanOrEqual(99);
    });
  });

  describe("uniqueness", () => {
    it("should generate different PINs", () => {
      const results: string[] = [];
      for (let i = 0; i < 50; i++) {
        const result = generateDigit({ length: 6, pad_zero: false });
        results.push(result.values[0] as string);
      }
      const unique = new Set(results);
      // With 6 digits, should have good variety
      expect(unique.size).toBeGreaterThan(40);
    });
  });

  describe("edge cases", () => {
    it("should handle length 1", () => {
      const result = generateDigit({ length: 1 });
      expect(result.values[0]?.length).toBe(1);
      expect(/^\d$/.test(result.values[0] as string)).toBe(true);
    });

    it("should handle empty params", () => {
      const result = generateDigit({});
      expect(result.values[0]?.length).toBe(4);
    });

    it("should pad single digit", () => {
      // Generate multiple times, probability of getting a single digit is high
      const results: string[] = [];
      for (let i = 0; i < 20; i++) {
        const result = generateDigit({ length: 4, pad_zero: true });
        results.push(result.values[0] as string);
      }
      // All should be 4 characters
      results.forEach((pin) => {
        expect(pin.length).toBe(4);
      });
    });
  });
});
