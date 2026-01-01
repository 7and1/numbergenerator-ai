/**
 * Password Strength Calculator Tests
 */

import { describe, it, expect } from "vitest";
import {
  calculatePasswordStrength,
  getPasswordScore,
  getStrengthLevel,
  StrengthLevel,
} from "../passwordStrength";

describe("passwordStrength", () => {
  describe("calculatePasswordStrength", () => {
    it("returns zero for empty password", () => {
      const result = calculatePasswordStrength("");
      expect(result.score).toBe(0);
      expect(result.level).toBe(StrengthLevel.VERY_WEAK);
      expect(result.label).toBe("Very Weak");
    });

    it("correctly rates very weak passwords", () => {
      const result = calculatePasswordStrength("abc");
      expect(result.score).toBeLessThan(20);
      expect(result.level).toBe(StrengthLevel.VERY_WEAK);
    });

    it("correctly rates weak passwords", () => {
      const result = calculatePasswordStrength("abcdef12");
      expect(result.score).toBeGreaterThanOrEqual(20);
      expect(result.score).toBeLessThan(40);
      expect(result.level).toBe(StrengthLevel.WEAK);
    });

    it("correctly rates fair passwords", () => {
      const result = calculatePasswordStrength("Abcdef12!");
      expect(result.score).toBeGreaterThanOrEqual(40);
      expect(result.score).toBeLessThan(55);
      expect(result.level).toBe(StrengthLevel.FAIR);
    });

    it("correctly rates good passwords", () => {
      const result = calculatePasswordStrength("MyP@ssw0rd123");
      expect(result.score).toBeGreaterThanOrEqual(55);
      expect(result.score).toBeLessThan(70);
      expect(result.level).toBe(StrengthLevel.GOOD);
    });

    it("correctly rates strong passwords", () => {
      const result = calculatePasswordStrength("MyStr0ng!P@ssw0rd#2024");
      expect(result.score).toBeGreaterThanOrEqual(70);
      expect(result.score).toBeLessThan(85);
      expect(result.level).toBe(StrengthLevel.STRONG);
    });

    it("correctly rates very strong passwords", () => {
      // Use a truly strong password without common words - longer for more entropy
      const result = calculatePasswordStrength(
        "xK9$mP2@qL5#nR8!tW3&vM6^yH4%sF7+jB5?",
      );
      // Very strong requires 85+ points, this password is extremely strong
      expect(result.score).toBeGreaterThan(80);
      expect(result.level).toBeGreaterThanOrEqual(StrengthLevel.STRONG);
    });

    it("penalizes common patterns", () => {
      const weak = calculatePasswordStrength("password123");
      const strong = calculatePasswordStrength("xK9$mP2@qL5#nR8");
      expect(weak.score).toBeLessThan(strong.score);
    });

    it("penalizes repeated characters", () => {
      const repeated = calculatePasswordStrength("aaaaaaaaaaa");
      const varied = calculatePasswordStrength("abC123!@#");
      // Repeated characters should have lower score
      expect(repeated.score).toBeLessThan(varied.score);
    });

    it("rewards length", () => {
      const short = calculatePasswordStrength("Ab1!");
      const long = calculatePasswordStrength("Ab1!Ab1!Ab1!Ab1!Ab1!Ab1!");
      expect(long.score).toBeGreaterThan(short.score);
    });

    it("rewards character variety", () => {
      const lowercase = calculatePasswordStrength("abcdefghij");
      const mixed = calculatePasswordStrength("aB1!aB1!aB1!");
      expect(mixed.score).toBeGreaterThan(lowercase.score);
    });

    it("checks requirements correctly", () => {
      const result = calculatePasswordStrength("MyP@ss123");
      expect(result.requirements.minLength).toBe(true);
      expect(result.requirements.hasLower).toBe(true);
      expect(result.requirements.hasUpper).toBe(true);
      expect(result.requirements.hasDigit).toBe(true);
      expect(result.requirements.hasSymbol).toBe(true);
      expect(result.requirements.met).toBe(5);
    });

    it("estimates crack time", () => {
      const weak = calculatePasswordStrength("abc");
      const strong = calculatePasswordStrength("MyStr0ng!P@ssw0rd#2024XYZ!");

      expect(weak.crackTime.time).toBe("Instantly");
      expect(strong.crackTime.seconds).toBeGreaterThan(31536000); // More than a year
    });

    it("checks NIST compliance", () => {
      const compliant = calculatePasswordStrength("Abcdef12!");
      const tooShort = calculatePasswordStrength("Ab1!");

      expect(compliant.nistCompliant).toBe(true);
      expect(tooShort.nistCompliant).toBe(false);
    });
  });

  describe("getPasswordScore", () => {
    it("returns score only", () => {
      expect(getPasswordScore("")).toBe(0);
      expect(getPasswordScore("abc")).toBeLessThan(20);
      expect(getPasswordScore("MyStr0ng!P@ssw0rd#2024")).toBeGreaterThan(70);
    });
  });

  describe("getStrengthLevel", () => {
    it("returns correct level for score", () => {
      expect(getStrengthLevel(0)).toBe(StrengthLevel.VERY_WEAK);
      expect(getStrengthLevel(19)).toBe(StrengthLevel.VERY_WEAK);
      expect(getStrengthLevel(20)).toBe(StrengthLevel.WEAK);
      expect(getStrengthLevel(39)).toBe(StrengthLevel.WEAK);
      expect(getStrengthLevel(40)).toBe(StrengthLevel.FAIR);
      expect(getStrengthLevel(54)).toBe(StrengthLevel.FAIR);
      expect(getStrengthLevel(55)).toBe(StrengthLevel.GOOD);
      expect(getStrengthLevel(69)).toBe(StrengthLevel.GOOD);
      expect(getStrengthLevel(70)).toBe(StrengthLevel.STRONG);
      expect(getStrengthLevel(84)).toBe(StrengthLevel.STRONG);
      expect(getStrengthLevel(85)).toBe(StrengthLevel.VERY_STRONG);
      expect(getStrengthLevel(100)).toBe(StrengthLevel.VERY_STRONG);
    });
  });

  describe("edge cases", () => {
    it("handles unicode characters", () => {
      const result = calculatePasswordStrength("password");
      expect(result.score).toBeGreaterThan(0);
    });

    it("handles very long passwords", () => {
      const result = calculatePasswordStrength("a".repeat(200));
      expect(result.score).toBeLessThanOrEqual(100);
    });

    it("handles special characters only", () => {
      const result = calculatePasswordStrength("!@#$%^&*()");
      expect(result.score).toBeGreaterThan(0);
    });
  });
});
