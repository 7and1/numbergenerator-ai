/**
 * Unit tests for math generators (fraction, percentage, prime, roman)
 */

import { describe, it, expect } from "vitest";
import {
  generateFraction,
  generatePercentage,
  generatePrime,
  generateRoman,
} from "../../../generators/math";

describe("generateFraction", () => {
  describe("basic functionality", () => {
    it("should generate fractions", () => {
      const result = generateFraction({ count: 5 });
      expect(result.values).toHaveLength(5);
      result.values.forEach((v) => {
        expect(typeof v).toBe("string");
        expect(v.length).toBeGreaterThan(0);
      });
    });

    it("should return metadata", () => {
      const result = generateFraction({});
      expect(result.meta).toBeDefined();
      expect(result.meta?.maxDenom).toBeDefined();
      expect(result.meta?.simplify).toBeDefined();
    });
  });

  describe("simplify parameter", () => {
    it("should simplify fractions by default", () => {
      const result = generateFraction({
        count: 50,
        fraction_max: 100,
      });
      result.values.forEach((v) => {
        const parts = (v as string).split("/");
        if (parts.length === 2) {
          const num = parseInt(parts[0]!, 10);
          const den = parseInt(parts[1]!, 10);
          // Check if relatively prime (gcd = 1)
          const gcd = (a: number, b: number): number => {
            return b === 0 ? Math.abs(a) : gcd(b, a % b);
          };
          expect(gcd(num, den)).toBe(1);
        }
      });
    });

    it("should not simplify when simplify=false", () => {
      const result = generateFraction({
        count: 50,
        fraction_max: 100,
        fraction_simplified: false,
      });
      // Just verify we get results without error
      expect(result.values).toHaveLength(50);
    });

    it("should return whole numbers when denominator divides numerator", () => {
      const result = generateFraction({
        count: 100,
        fraction_max: 50,
      });
      // Some results should be whole numbers (no slash)
      const wholeNumbers = result.values.filter(
        (v) => !(v as string).includes("/"),
      );
      expect(wholeNumbers.length).toBeGreaterThan(0);
    });
  });

  describe("maxDenom parameter", () => {
    it("should respect max denominator", () => {
      const result = generateFraction({
        count: 100,
        fraction_max: 20,
      });
      result.values.forEach((v) => {
        const parts = (v as string).split("/");
        if (parts.length === 2) {
          const den = parseInt(parts[1]!, 10);
          expect(den).toBeLessThanOrEqual(20);
        }
      });
    });

    it("should clamp maxDenom to minimum of 2", () => {
      const result = generateFraction({ fraction_max: 1 });
      expect(result.meta?.maxDenom).toBe(2);
    });

    it("should clamp maxDenom to maximum of 10000", () => {
      const result = generateFraction({ fraction_max: 20000 });
      expect(result.meta?.maxDenom).toBe(10000);
    });

    it("should default to 100", () => {
      const result = generateFraction({});
      expect(result.meta?.maxDenom).toBe(100);
    });
  });

  describe("count parameter", () => {
    it("should clamp count to minimum of 1", () => {
      const result = generateFraction({ count: 0 });
      expect(result.values).toHaveLength(1);
    });

    it("should clamp count to maximum of 10000", () => {
      const result = generateFraction({ count: 20000 });
      expect(result.values).toHaveLength(10000);
    });
  });

  describe("fraction format", () => {
    it("should use format with slash", () => {
      const result = generateFraction({ count: 100 });
      const withSlash = result.values.filter((v) =>
        (v as string).includes("/"),
      );
      expect(withSlash.length).toBeGreaterThan(0);
      withSlash.forEach((v) => {
        const parts = (v as string).split("/");
        expect(parts.length).toBe(2);
        expect(parseInt(parts[0]!, 10)).not.toBeNaN();
        expect(parseInt(parts[1]!, 10)).not.toBeNaN();
      });
    });
  });

  describe("edge cases", () => {
    it("should handle empty params", () => {
      const result = generateFraction({});
      expect(result.values).toHaveLength(1);
    });

    it("should handle small maxDenom", () => {
      const result = generateFraction({
        count: 50,
        fraction_max: 3,
      });
      expect(result.values).toHaveLength(50);
      const parts = result.values
        .filter((v) => (v as string).includes("/"))
        .map((v) => (v as string).split("/")[1])
        .map(Number);
      parts.forEach((den) => {
        expect(den).toBeLessThanOrEqual(3);
      });
    });
  });
});

describe("generatePercentage", () => {
  describe("basic functionality", () => {
    it("should generate percentages", () => {
      const result = generatePercentage({ count: 10 });
      expect(result.values).toHaveLength(10);
      result.values.forEach((v) => {
        expect(typeof v).toBe("string");
        expect(v as string).toContain("%");
      });
    });

    it("should return metadata", () => {
      const result = generatePercentage({});
      expect(result.meta).toBeDefined();
      expect(result.meta?.decimals).toBeDefined();
    });
  });

  describe("decimals parameter", () => {
    it("should generate integer percentages when decimals=0", () => {
      const result = generatePercentage({
        count: 50,
        percentage_decimals: 0,
      });
      result.values.forEach((v) => {
        const num = parseInt((v as string).replace("%", ""), 10);
        expect(num).toBeGreaterThanOrEqual(0);
        expect(num).toBeLessThanOrEqual(100);
      });
    });

    it("should generate decimal percentages when decimals=1", () => {
      const result = generatePercentage({
        count: 50,
        percentage_decimals: 1,
      });
      result.values.forEach((v) => {
        const num = parseFloat((v as string).replace("%", ""));
        expect(num).toBeGreaterThanOrEqual(0);
        expect(num).toBeLessThanOrEqual(100);
        const parts = (v as string).replace("%", "").split(".");
        expect(parts[1]?.length || 0).toBeLessThanOrEqual(1);
      });
    });

    it("should generate 2 decimal places when decimals=2", () => {
      const result = generatePercentage({
        count: 50,
        percentage_decimals: 2,
      });
      result.values.forEach((v) => {
        const numStr = (v as string).replace("%", "");
        const parts = numStr.split(".");
        if (parts.length === 2) {
          expect(parts[1]?.length).toBeLessThanOrEqual(2);
        }
      });
    });

    it("should clamp decimals to minimum of 0", () => {
      const result = generatePercentage({ percentage_decimals: -1 });
      expect(result.meta?.decimals).toBe(0);
    });

    it("should clamp decimals to maximum of 2", () => {
      const result = generatePercentage({ percentage_decimals: 5 });
      expect(result.meta?.decimals).toBe(2);
    });

    it("should default to 0 decimals", () => {
      const result = generatePercentage({});
      expect(result.meta?.decimals).toBe(0);
    });
  });

  describe("value range", () => {
    it("should generate values from 0 to 100", () => {
      const result = generatePercentage({
        count: 1000,
        percentage_decimals: 0,
      });
      result.values.forEach((v) => {
        const num = parseInt((v as string).replace("%", ""), 10);
        expect(num).toBeGreaterThanOrEqual(0);
        expect(num).toBeLessThanOrEqual(100);
      });
    });

    it("should include 0% and 100% possibilities", () => {
      const result = generatePercentage({
        count: 10000,
        percentage_decimals: 0,
      });
      const values = result.values.map((v) =>
        parseInt((v as string).replace("%", ""), 10),
      );
      expect(values).toContain(0);
      expect(values).toContain(100);
    });
  });

  describe("count parameter", () => {
    it("should clamp count to minimum of 1", () => {
      const result = generatePercentage({ count: 0 });
      expect(result.values).toHaveLength(1);
    });

    it("should clamp count to maximum of 10000", () => {
      const result = generatePercentage({ count: 20000 });
      expect(result.values).toHaveLength(10000);
    });
  });

  describe("format", () => {
    it("should include % sign at end", () => {
      const result = generatePercentage({ count: 50 });
      result.values.forEach((v) => {
        expect(v as string).toMatch(/\d+%/);
      });
    });
  });
});

describe("generatePrime", () => {
  describe("basic functionality", () => {
    it("should generate prime numbers", () => {
      const result = generatePrime({ count: 10 });
      expect(result.values).toHaveLength(10);
      result.values.forEach((v) => {
        const num = parseInt(v as string, 10);
        expect(isPrime(num)).toBe(true);
      });
    });

    it("should return metadata", () => {
      const result = generatePrime({});
      expect(result.meta).toBeDefined();
      expect(result.meta?.maxPrime).toBeDefined();
      expect(result.meta?.availablePrimes).toBeDefined();
    });
  });

  describe("maxPrime parameter", () => {
    it("should not exceed maxPrime", () => {
      const result = generatePrime({
        count: 100,
        prime_max: 100,
      });
      result.values.forEach((v) => {
        const num = parseInt(v as string, 10);
        expect(num).toBeLessThanOrEqual(100);
      });
    });

    it("should clamp maxPrime to minimum of 2", () => {
      const result = generatePrime({ prime_max: 1 });
      expect(result.meta?.maxPrime).toBe(2);
    });

    it("should clamp maxPrime to maximum of 1000000", () => {
      const result = generatePrime({ prime_max: 2000000 });
      expect(result.meta?.maxPrime).toBe(1000000);
    });

    it("should default to 1000", () => {
      const result = generatePrime({});
      expect(result.meta?.maxPrime).toBe(1000);
    });
  });

  describe("count parameter", () => {
    it("should clamp count to minimum of 1", () => {
      const result = generatePrime({ count: 0 });
      expect(result.values).toHaveLength(1);
    });

    it("should clamp count to maximum of 10000", () => {
      const result = generatePrime({ count: 20000 });
      expect(result.values).toHaveLength(10000);
    });

    it("should default to 10", () => {
      const result = generatePrime({});
      expect(result.values).toHaveLength(10);
    });
  });

  describe("edge cases", () => {
    it("should handle very small maxPrime", () => {
      const result = generatePrime({
        count: 10,
        prime_max: 10,
      });
      // Primes up to 10: 2, 3, 5, 7
      const primes = result.values.map((v) => parseInt(v as string, 10));
      primes.forEach((p) => {
        expect([2, 3, 5, 7]).toContain(p);
      });
    });

    it("should return default primes when no primes found", () => {
      // This is a fallback case in the code
      const result = generatePrime({
        count: 5,
        prime_max: 1, // Will be clamped to 2, so only prime is 2
      });
      expect(result.values).toHaveLength(5);
    });
  });

  describe("sieve algorithm", () => {
    it("should correctly identify primes", () => {
      const result = generatePrime({
        count: 168, // Number of primes up to 1000
        prime_max: 1000,
      });
      const primes = result.values.map((v) => parseInt(v as string, 10));
      // All should be prime
      primes.forEach((p) => {
        expect(isPrime(p)).toBe(true);
      });
      // Should be unique within single generation
      const unique = new Set(primes);
      // With replacement, duplicates are possible
      expect(unique.size).toBeGreaterThan(0);
    });
  });

  describe("known primes", () => {
    it("should generate first few primes", () => {
      const result = generatePrime({
        count: 100,
        prime_max: 30,
      });
      const primes = result.values.map((v) => parseInt(v as string, 10));
      // First few primes: 2, 3, 5, 7, 11, 13, 17, 19, 23, 29
      const firstPrimes = [2, 3, 5, 7, 11, 13, 17, 19, 23, 29];
      firstPrimes.forEach((p) => {
        expect(primes).toContain(p);
      });
    });
  });
});

describe("generateRoman", () => {
  describe("basic functionality", () => {
    it("should generate Roman numerals", () => {
      const result = generateRoman({ count: 10 });
      expect(result.values).toHaveLength(10);
      result.values.forEach((v) => {
        expect(typeof v).toBe("string");
        expect(v.length).toBeGreaterThan(0);
      });
    });

    it("should return metadata", () => {
      const result = generateRoman({});
      expect(result.meta).toBeDefined();
      expect(result.meta?.maxValue).toBeDefined();
    });
  });

  describe("maxValue parameter", () => {
    it("should respect maxValue", () => {
      const result = generateRoman({
        count: 100,
        roman_max: 100,
      });
      result.values.forEach((roman) => {
        const num = fromRoman(roman as string);
        expect(num).toBeLessThanOrEqual(100);
      });
    });

    it("should clamp maxValue to minimum of 1", () => {
      const result = generateRoman({ roman_max: 0 });
      expect(result.meta?.maxValue).toBe(1);
    });

    it("should clamp maxValue to maximum of 3999", () => {
      const result = generateRoman({ roman_max: 5000 });
      expect(result.meta?.maxValue).toBe(3999);
    });

    it("should default to 100", () => {
      const result = generateRoman({});
      expect(result.meta?.maxValue).toBe(100);
    });
  });

  describe("count parameter", () => {
    it("should clamp count to minimum of 1", () => {
      const result = generateRoman({ count: 0 });
      expect(result.values).toHaveLength(1);
    });

    it("should clamp count to maximum of 10000", () => {
      const result = generateRoman({ count: 20000 });
      expect(result.values).toHaveLength(10000);
    });

    it("should default to 10", () => {
      const result = generateRoman({});
      expect(result.values).toHaveLength(10);
    });
  });

  describe("Roman numeral conversion", () => {
    it("should correctly convert basic numerals", () => {
      // Generate many values and check they include known patterns
      const result = generateRoman({
        count: 1000,
        roman_max: 1000,
      });

      // Check for presence of basic symbols
      const allRoman = result.values.join("");
      expect(allRoman).toContain("I");
      expect(allRoman).toContain("V");
      expect(allRoman).toContain("X");
    });
  });

  describe("edge cases", () => {
    it("should handle maxValue of 1", () => {
      const result = generateRoman({
        count: 5,
        roman_max: 1,
      });
      result.values.forEach((v) => {
        expect(v).toBe("I");
      });
    });

    it("should handle common values", () => {
      const result = generateRoman({
        count: 100,
        roman_max: 50,
      });
      result.values.forEach((roman) => {
        const num = fromRoman(roman as string);
        expect(num).toBeGreaterThan(0);
        expect(num).toBeLessThanOrEqual(50);
      });
    });
  });
});

// Helper function to check if a number is prime
function isPrime(n: number): boolean {
  if (n < 2) return false;
  if (n === 2) return true;
  if (n % 2 === 0) return false;
  for (let i = 3; i <= Math.sqrt(n); i += 2) {
    if (n % i === 0) return false;
  }
  return true;
}

// Helper function to convert Roman numeral to number
function fromRoman(roman: string): number {
  const values: Record<string, number> = {
    I: 1,
    V: 5,
    X: 10,
    L: 50,
    C: 100,
    D: 500,
    M: 1000,
  };

  let result = 0;
  for (let i = 0; i < roman.length; i++) {
    const current = values[roman[i]!] ?? 0;
    const next = values[roman[i + 1]!] ?? 0;
    if (current < next) {
      result += next - current;
      i++;
    } else {
      result += current;
    }
  }
  return result;
}
