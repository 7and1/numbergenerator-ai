import { describe, expect, it } from "vitest";

import { generate } from "./engine";
import type { GeneratorMode, GeneratorParams } from "./types";

const asRecord = (v: unknown): Record<string, unknown> | null => {
  if (!v || typeof v !== "object") return null;
  return v as Record<string, unknown>;
};

describe("engine.generate", () => {
  // ============================================================
  // RANGE MODE TESTS
  // ============================================================
  describe("range mode", () => {
    it("stays within bounds and aligns to step", () => {
      const res = generate("range", {
        min: 1,
        max: 10,
        step: 2,
        precision: 0,
        count: 50,
      });

      expect(res.values).toHaveLength(50);
      for (const v of res.values) {
        expect(typeof v).toBe("number");
        const n = v as number;
        expect(n).toBeGreaterThanOrEqual(1);
        expect(n).toBeLessThanOrEqual(10);
        expect((n - 1) % 2).toBe(0);
      }
    });

    it("generates values within range with default step", () => {
      const res = generate("range", { min: 5, max: 15, count: 100 });

      for (const v of res.values) {
        const n = v as number;
        expect(n).toBeGreaterThanOrEqual(5);
        expect(n).toBeLessThanOrEqual(15);
      }
    });

    it("unique respects capacity when possible", () => {
      const res = generate("range", {
        min: 1,
        max: 10,
        step: 1,
        count: 10,
        unique: true,
      });
      expect(res.values).toHaveLength(10);
      expect(new Set(res.values as number[]).size).toBe(10);
    });

    it("unique warns when capacity exceeded", () => {
      const res = generate("range", {
        min: 1,
        max: 5,
        step: 1,
        count: 10,
        unique: true,
      });

      expect(res.warnings).toBeDefined();
      expect(res.warnings).toHaveLength(1);
      expect(res.warnings![0]).toContain("Unique is impossible");
    });

    it("sorts ascending when sort=asc", () => {
      const res = generate("range", {
        min: 1,
        max: 10,
        step: 1,
        count: 20,
        sort: "asc",
      });

      const values = res.values as number[];
      for (let i = 1; i < values.length; i++) {
        expect(values[i]!).toBeGreaterThanOrEqual(values[i - 1]!);
      }
    });

    it("sorts descending when sort=desc", () => {
      const res = generate("range", {
        min: 1,
        max: 10,
        step: 1,
        count: 20,
        sort: "desc",
      });

      const values = res.values as number[];
      for (let i = 1; i < values.length; i++) {
        expect(values[i]!).toBeLessThanOrEqual(values[i - 1]!);
      }
    });

    it("handles negative ranges", () => {
      const res = generate("range", { min: -50, max: -10, step: 1, count: 50 });

      for (const v of res.values) {
        const n = v as number;
        expect(n).toBeGreaterThanOrEqual(-50);
        expect(n).toBeLessThanOrEqual(-10);
      }
    });

    it("handles ranges crossing zero", () => {
      const res = generate("range", { min: -10, max: 10, step: 1, count: 50 });

      for (const v of res.values) {
        const n = v as number;
        expect(n).toBeGreaterThanOrEqual(-10);
        expect(n).toBeLessThanOrEqual(10);
      }
    });

    it("swaps min/max when min > max", () => {
      const res = generate("range", { min: 100, max: 1, step: 1, count: 50 });

      for (const v of res.values) {
        const n = v as number;
        expect(n).toBeGreaterThanOrEqual(1);
        expect(n).toBeLessThanOrEqual(100);
      }
    });

    it("respects precision parameter", () => {
      const res = generate("range", {
        min: 0,
        max: 1,
        step: 0.01,
        precision: 2,
        count: 50,
      });

      for (const v of res.values) {
        const s = String(v as number);
        const decimalPart = s.split(".")[1];
        if (decimalPart) {
          expect(decimalPart.length).toBeLessThanOrEqual(2);
        }
      }
    });

    it("handles very small step values", () => {
      const res = generate("range", {
        min: 0,
        max: 1,
        step: 0.001,
        precision: 3,
        count: 100,
      });

      for (const v of res.values) {
        const n = v as number;
        expect(n).toBeGreaterThanOrEqual(0);
        expect(n).toBeLessThanOrEqual(1);
      }
    });

    it("handles decimal step values", () => {
      const res = generate("range", {
        min: 0,
        max: 10,
        step: 0.5,
        precision: 1,
        count: 50,
      });

      for (const v of res.values) {
        const n = v as number;
        expect(n).toBeGreaterThanOrEqual(0);
        expect(n).toBeLessThanOrEqual(10);
        expect((n * 2) % 1).toBe(0); // Should be multiple of 0.5
      }
    });

    it("includes formatted output", () => {
      const res = generate("range", { min: 1, max: 10, count: 5 });

      expect(res.formatted).toBeDefined();
      expect(typeof res.formatted).toBe("string");
      expect(res.formatted.length).toBeGreaterThan(0);
    });

    it("includes timestamp", () => {
      const before = Date.now();
      const res = generate("range", { min: 1, max: 10, count: 1 });
      const after = Date.now();

      expect(res.timestamp).toBeGreaterThanOrEqual(before);
      expect(res.timestamp).toBeLessThanOrEqual(after);
    });

    it("handles zero step with min=max (returns that value)", () => {
      // When min=max, step becomes 1, so we get that value repeated
      const res = generate("range", { min: 10, max: 10, step: 0, count: 5 });

      expect(res.values).toHaveLength(5);
      expect(res.values).toEqual([10, 10, 10, 10, 10]);
    });
  });

  // ============================================================
  // BOUNDARY VALUE TESTS
  // ============================================================
  describe("boundary values", () => {
    it("handles min = max (single value)", () => {
      const res = generate("range", { min: 42, max: 42, step: 1, count: 10 });

      expect(res.values).toHaveLength(10);
      for (const v of res.values) {
        expect(v).toBe(42);
      }
    });

    it("handles very large negative numbers", () => {
      const res = generate("range", {
        min: -1000000,
        max: -999900,
        step: 1,
        count: 50,
      });

      for (const v of res.values) {
        const n = v as number;
        expect(n).toBeGreaterThanOrEqual(-1000000);
        expect(n).toBeLessThanOrEqual(-999900);
      }
    });

    it("handles very large positive numbers", () => {
      const res = generate("range", {
        min: 999999000,
        max: 1000000000,
        step: 1,
        count: 50,
      });

      for (const v of res.values) {
        const n = v as number;
        expect(n).toBeGreaterThanOrEqual(999999000);
        expect(n).toBeLessThanOrEqual(1000000000);
      }
    });

    it("handles extremely small step", () => {
      const res = generate("range", {
        min: 0,
        max: 1,
        step: 0.0001,
        precision: 4,
        count: 10,
      });

      expect(res.values).toHaveLength(10);
      for (const v of res.values) {
        const n = v as number;
        expect(n).toBeGreaterThanOrEqual(0);
        expect(n).toBeLessThanOrEqual(1);
      }
    });

    it("handles very large count (max clamp)", () => {
      const res = generate("range", { min: 1, max: 1000000, count: 99999 });

      expect(res.values).toHaveLength(10000); // Clamped to max
    });

    it("handles count of 1", () => {
      const res = generate("range", { min: 1, max: 100, count: 1 });

      expect(res.values).toHaveLength(1);
    });

    it("handles precision of 0 (integers only)", () => {
      const res = generate("range", {
        min: 0,
        max: 100,
        step: 0.5,
        precision: 0,
        count: 50,
      });

      for (const v of res.values) {
        const n = v as number;
        expect(Number.isInteger(n)).toBe(true);
      }
    });

    it("handles max precision of 12", () => {
      const res = generate("range", {
        min: 0,
        max: 1,
        step: 0.000000000001,
        precision: 12,
        count: 10,
      });

      expect(res.values).toHaveLength(10);
    });

    it("respects precision clamp (above max becomes 12)", () => {
      const res = generate("range", {
        min: 0,
        max: 1,
        step: 0.1,
        precision: 999,
        count: 10,
      });

      expect(res.values).toHaveLength(10);
    });

    it("handles negative precision (treated as 0)", () => {
      const res = generate("range", {
        min: 0,
        max: 10,
        step: 0.5,
        precision: -5,
        count: 10,
      });

      for (const v of res.values) {
        expect(Number.isInteger(v)).toBe(true);
      }
    });
  });

  // ============================================================
  // DECIMAL PRECISION TESTS
  // ============================================================
  describe("decimal precision", () => {
    it("rounds to 1 decimal place", () => {
      const res = generate("range", {
        min: 0,
        max: 1,
        step: 0.01,
        precision: 1,
        count: 50,
      });

      for (const v of res.values) {
        const s = String(v as number);
        const decimalPart = s.split(".")[1];
        const decimals = decimalPart ? decimalPart.length : 0;
        expect(decimals).toBeLessThanOrEqual(1);
      }
    });

    it("rounds to 3 decimal places", () => {
      const res = generate("range", {
        min: 0,
        max: 1,
        step: 0.001,
        precision: 3,
        count: 50,
      });

      for (const v of res.values) {
        const s = String(v as number);
        const decimalPart = s.split(".")[1];
        const decimals = decimalPart ? decimalPart.length : 0;
        expect(decimals).toBeLessThanOrEqual(3);
      }
    });

    it("handles precision with rounding up", () => {
      const res = generate("range", {
        min: 0,
        max: 1,
        step: 0.333,
        precision: 2,
        count: 10,
      });

      for (const v of res.values) {
        const n = v as number;
        expect(n).toBeLessThanOrEqual(1);
      }
    });

    it("produces consistent precision across all values", () => {
      const res = generate("range", {
        min: 0,
        max: 10,
        step: 0.123,
        precision: 2,
        count: 100,
      });

      const precisions = new Set<number>();
      for (const v of res.values) {
        const s = String(v as number);
        const decimalPart = s.split(".")[1];
        precisions.add(decimalPart?.length ?? 0);
      }

      // All should have <= 2 decimal places
      for (const p of precisions) {
        expect(p).toBeLessThanOrEqual(2);
      }
    });
  });

  // ============================================================
  // ERROR SCENARIO TESTS
  // ============================================================
  describe("error scenarios", () => {
    it("handles empty params object", () => {
      const res = generate("range", {});

      expect(res.values).toBeDefined();
      expect(Array.isArray(res.values)).toBe(true);
    });

    it("handles null params", () => {
      const res = generate("range", null as unknown as GeneratorParams);

      expect(res.values).toBeDefined();
    });

    it("handles undefined params", () => {
      const res = generate("range", undefined as unknown as GeneratorParams);

      expect(res.values).toBeDefined();
    });

    it("handles NaN min", () => {
      const res = generate("range", { min: NaN, max: 100, count: 10 });

      for (const v of res.values) {
        expect(v).not.toBeNaN();
      }
    });

    it("handles Infinity min", () => {
      const res = generate("range", { min: Infinity, max: 100, count: 10 });

      // Falls back to defaults
      expect(res.values).toBeDefined();
    });

    it("handles negative step (treated as invalid, becomes 1)", () => {
      const res = generate("range", { min: 1, max: 10, step: -1, count: 10 });

      for (const v of res.values) {
        const n = v as number;
        expect(n).toBeGreaterThanOrEqual(1);
        expect(n).toBeLessThanOrEqual(10);
      }
    });

    it("handles zero step (becomes 1)", () => {
      const res = generate("range", { min: 1, max: 10, step: 0, count: 10 });

      for (const v of res.values) {
        const n = v as number;
        expect(n).toBeGreaterThanOrEqual(1);
        expect(n).toBeLessThanOrEqual(10);
      }
    });

    it("handles string count (converted)", () => {
      const res = generate("range", {
        min: 1,
        max: 10,
        count: "5" as unknown as number,
      });

      expect(res.values).toBeDefined();
    });

    it("handles zero count (becomes 1)", () => {
      const res = generate("range", { min: 1, max: 10, count: 0 });

      expect(res.values).toHaveLength(1);
    });

    it("handles negative count (becomes 1)", () => {
      const res = generate("range", { min: 1, max: 10, count: -5 });

      expect(res.values).toHaveLength(1);
    });

    it("handles boolean unique param", () => {
      const res = generate("range", {
        min: 1,
        max: 10,
        count: 5,
        unique: true,
      });

      expect(res.values).toBeDefined();
    });

    it("handles null sort (no sorting)", () => {
      const res = generate("range", { min: 1, max: 10, count: 50, sort: null });

      expect(res.values).toBeDefined();
    });
  });

  // ============================================================
  // DIGIT MODE TESTS
  // ============================================================
  describe("digit mode", () => {
    it("pads to requested length", () => {
      const res = generate("digit", { length: 6, pad_zero: true });
      expect(res.values).toHaveLength(1);
      const s = String(res.values[0]);
      expect(s).toMatch(/^\d{6}$/);
    });

    it("does not pad when pad_zero is false", () => {
      const res = generate("digit", { length: 6, pad_zero: false });
      const s = String(res.values[0]);
      expect(s.length).toBeLessThanOrEqual(6);
    });

    it("generates values within correct range", () => {
      const res = generate("digit", { length: 4, pad_zero: true });
      const val = Number(res.values[0]);

      expect(val).toBeGreaterThanOrEqual(0);
      expect(val).toBeLessThanOrEqual(9999);
    });

    it("handles length 1", () => {
      const res = generate("digit", { length: 1, pad_zero: true });
      const s = String(res.values[0]);

      expect(s).toMatch(/^\d$/);
    });

    it("handles max length (18)", () => {
      const res = generate("digit", { length: 18, pad_zero: true });
      const s = String(res.values[0]);

      expect(s).toMatch(/^\d{18}$/);
    });

    it("clamps length above max to 18", () => {
      const res = generate("digit", { length: 999, pad_zero: true });
      const s = String(res.values[0]);

      expect(s).toMatch(/^\d{18}$/);
    });

    it("clamps length below min to 1", () => {
      const res = generate("digit", { length: 0, pad_zero: true });

      expect(res.values).toBeDefined();
    });

    it("includes timestamp", () => {
      const res = generate("digit", { length: 4 });

      expect(res.timestamp).toBeDefined();
      expect(res.timestamp).toBeGreaterThan(0);
    });
  });

  // ============================================================
  // PASSWORD MODE TESTS
  // ============================================================
  describe("password mode", () => {
    it("generates password of correct length", () => {
      const res = generate("password", {
        length: 16,
        charset: "strong",
        grouping: false,
      });

      const s = String(res.values[0]);
      expect(s.length).toBe(16);
    });

    it("grouping inserts dashes", () => {
      const res = generate("password", {
        length: 16,
        charset: "numeric",
        grouping: true,
      });
      expect(res.values).toHaveLength(1);
      const s = String(res.values[0]);
      expect(s.split("-")).toHaveLength(4);
      expect(s.replace(/-/g, "")).toMatch(/^\d{16}$/);
    });

    it("handles non-grouped output", () => {
      const res = generate("password", {
        length: 12,
        charset: "numeric",
        grouping: false,
      });

      const s = String(res.values[0]);
      expect(s).not.toContain("-");
    });

    it("generates multiple passwords with count parameter", () => {
      const res = generate("password", {
        length: 12,
        charset: "strong",
        count: 10,
      });

      expect(res.values).toHaveLength(10);
    });

    it("uses numeric charset", () => {
      const res = generate("password", {
        length: 20,
        charset: "numeric",
        grouping: false,
      });
      const s = String(res.values[0]);

      expect(s).toMatch(/^[0-9]+$/);
    });

    it("uses hex charset", () => {
      const res = generate("password", {
        length: 20,
        charset: "hex",
        grouping: false,
      });
      const s = String(res.values[0]);

      expect(s).toMatch(/^[0-9A-F]+$/);
    });

    it("uses alphanumeric charset", () => {
      const res = generate("password", {
        length: 20,
        charset: "alphanumeric",
        grouping: false,
      });
      const s = String(res.values[0]);

      expect(s).toMatch(
        /^[2-9ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz]+$/,
      );
    });

    it("uses strong charset (default)", () => {
      const res = generate("password", {
        length: 20,
        charset: "strong",
        grouping: false,
      });
      const s = String(res.values[0]);

      expect(s.length).toBe(20);
      // Should contain variety of characters
      const hasLower = /[a-z]/.test(s);
      const hasUpper = /[A-Z]/.test(s);
      const hasDigit = /[0-9]/.test(s);
      const hasSymbol = /[!@#$%^&*()_+\-=]/.test(s);

      // At least some variety
      expect(hasLower || hasUpper || hasDigit || hasSymbol).toBe(true);
    });

    it("uses custom charset when provided", () => {
      const res = generate("password", {
        length: 10,
        charset: "custom",
        custom_charset: "ABCDEF",
        grouping: false,
      });
      const s = String(res.values[0]);

      expect(s).toMatch(/^[ABCDEF]+$/);
    });

    it("falls back to strong charset when custom is empty", () => {
      const res = generate("password", {
        length: 10,
        charset: "custom",
        custom_charset: "",
        grouping: false,
      });
      const s = String(res.values[0]);

      expect(s.length).toBe(10);
    });

    it("clamps length to max 256", () => {
      const res = generate("password", {
        length: 999,
        charset: "strong",
        grouping: false,
      });
      const s = String(res.values[0]);

      expect(s.length).toBe(256);
    });

    it("clamps length to min 4", () => {
      const res = generate("password", {
        length: 1,
        charset: "strong",
        grouping: false,
      });
      const s = String(res.values[0]);

      expect(s.length).toBe(4);
    });

    it("includes meta with password info", () => {
      const res = generate("password", { length: 16, count: 5 });

      const meta = asRecord(res.meta);
      expect(meta).toBeDefined();

      const passwordMeta = asRecord(meta?.password);
      expect(passwordMeta?.length).toBe(16);
      expect(passwordMeta?.batch).toBe(5);
    });

    it("pro can ensure each selected set", () => {
      const res = generate("password", {
        length: 12,
        count: 10,
        grouping: false,
        include_lower: true,
        include_upper: true,
        include_digits: true,
        include_symbols: true,
        ensure_each: true,
        exclude_ambiguous: true,
      });

      expect(res.values).toHaveLength(10);
      for (const v of res.values as string[]) {
        expect(v).toMatch(/[a-z]/);
        expect(v).toMatch(/[A-Z]/);
        expect(v).toMatch(/[0-9]/);
        expect(v).toMatch(/[^A-Za-z0-9]/);
      }
    });

    it("pro excludes ambiguous characters when flag set", () => {
      const res = generate("password", {
        length: 100,
        count: 1,
        grouping: false,
        include_lower: true,
        include_upper: true,
        include_digits: true,
        exclude_ambiguous: true,
      });

      const s = String(res.values[0]);
      // Should not contain 0, O, 1, l, I
      expect(s).not.toContain("0");
      expect(s).not.toContain("O");
      expect(s).not.toContain("1");
      expect(s).not.toContain("l");
      expect(s).not.toContain("I");
    });

    it("pro excludes custom characters", () => {
      const res = generate("password", {
        length: 50,
        count: 1,
        grouping: false,
        include_lower: true,
        include_upper: true,
        include_digits: true,
        exclude_chars: "abc123",
      });

      const s = String(res.values[0]);
      expect(s).not.toContain("a");
      expect(s).not.toContain("b");
      expect(s).not.toContain("c");
      expect(s).not.toContain("1");
      expect(s).not.toContain("2");
      expect(s).not.toContain("3");
    });

    it("pro warns when all characters are excluded", () => {
      const res = generate("password", {
        length: 12,
        include_lower: true,
        include_upper: false,
        include_digits: false,
        include_symbols: false,
        exclude_chars: "abcdefghijklmnopqrstuvwxyz",
      });

      expect(res.warnings).toBeDefined();
      expect(res.warnings).toContain(
        "All characters were excluded; falling back to strong charset.",
      );
    });

    it("pro warns when length is too short for ensure_each", () => {
      const res = generate("password", {
        length: 2,
        include_lower: true,
        include_upper: true,
        include_digits: true,
        include_symbols: true,
        ensure_each: true,
      });

      expect(res.warnings).toBeDefined();
      expect(res.warnings).toContain(
        "Length 2 is too short to include each selected set.",
      );
    });

    it("pro handles only lowercase", () => {
      const res = generate("password", {
        length: 20,
        include_lower: true,
        include_upper: false,
        include_digits: false,
        include_symbols: false,
      });

      const s = String(res.values[0]);
      expect(s).toMatch(/^[abcdefghijkmnpqrstuvwxyz]+$/);
    });

    it("pro handles only uppercase", () => {
      const res = generate("password", {
        length: 20,
        include_lower: false,
        include_upper: true,
        include_digits: false,
        include_symbols: false,
      });

      const s = String(res.values[0]);
      expect(s).toMatch(/^[ABCDEFGHJKLMNPQRSTUVWXYZ]+$/);
    });

    it("pro handles only digits", () => {
      const res = generate("password", {
        length: 20,
        include_lower: false,
        include_upper: false,
        include_digits: true,
        include_symbols: false,
      });

      const s = String(res.values[0]);
      expect(s).toMatch(/^[23456789]+$/);
    });

    it("pro handles only symbols", () => {
      const res = generate("password", {
        length: 20,
        include_lower: false,
        include_upper: false,
        include_digits: false,
        include_symbols: true,
      });

      const s = String(res.values[0]);
      expect(s).toMatch(/^[!@#$%^&*()_+\-=~\[\]{};:,.?]+$/);
    });

    it("pro handles all sets off (falls back to strong)", () => {
      const res = generate("password", {
        length: 20,
        include_lower: false,
        include_upper: false,
        include_digits: false,
        include_symbols: false,
      });

      const s = String(res.values[0]);
      expect(s.length).toBe(20);
    });
  });

  // ============================================================
  // LOTTERY MODE TESTS
  // ============================================================
  describe("lottery mode", () => {
    it("powerball shape", () => {
      const res = generate("lottery", {
        pool_a: { min: 1, max: 69, pick: 5 },
        pool_b: { min: 1, max: 26, pick: 1 },
      });

      expect(res.values).toHaveLength(5);
      expect(res.bonus_values).toHaveLength(1);
      for (const n of res.values as number[]) {
        expect(n).toBeGreaterThanOrEqual(1);
        expect(n).toBeLessThanOrEqual(69);
      }
      for (const n of res.bonus_values as number[]) {
        expect(n).toBeGreaterThanOrEqual(1);
        expect(n).toBeLessThanOrEqual(26);
      }
    });

    it("pool only (no bonus)", () => {
      const res = generate("lottery", {
        pool_a: { min: 1, max: 49, pick: 6 },
      });

      expect(res.values).toHaveLength(6);
      expect(res.bonus_values).toEqual([]);
    });

    it("generates unique numbers within each pool", () => {
      const res = generate("lottery", {
        pool_a: { min: 1, max: 10, pick: 5 },
      });

      const uniqueValues = new Set(res.values as number[]);
      expect(uniqueValues.size).toBe(5);
    });

    it("sorts pool values in ascending order", () => {
      const res = generate("lottery", {
        pool_a: { min: 1, max: 50, pick: 5 },
      });

      const values = res.values as number[];
      for (let i = 1; i < values.length; i++) {
        expect(values[i]!).toBeGreaterThan(values[i - 1]!);
      }
    });

    it("sorts bonus values in ascending order", () => {
      const res = generate("lottery", {
        pool_b: { min: 1, max: 50, pick: 3 },
      });

      const bonus = res.bonus_values as number[];
      for (let i = 1; i < bonus.length; i++) {
        expect(bonus[i]!).toBeGreaterThan(bonus[i - 1]!);
      }
    });

    it("handles pool where pick equals range size", () => {
      const res = generate("lottery", {
        pool_a: { min: 1, max: 5, pick: 5 },
      });

      expect(res.values).toHaveLength(5);
      const sorted = [...res.values].sort(
        (a, b) => (a as number) - (b as number),
      );
      expect(sorted).toEqual([1, 2, 3, 4, 5]);
    });

    it("handles pick larger than range (allows duplicates)", () => {
      const res = generate("lottery", {
        pool_a: { min: 1, max: 3, pick: 10 },
      });

      expect(res.values).toHaveLength(10);
    });

    it("handles pick of 0", () => {
      const res = generate("lottery", {
        pool_a: { min: 1, max: 10, pick: 0 },
      });

      expect(res.values).toEqual([]);
    });

    it("handles reversed min/max", () => {
      const res = generate("lottery", {
        pool_a: { min: 50, max: 1, pick: 5 },
      });

      expect(res.values).toHaveLength(5);
      for (const n of res.values as number[]) {
        expect(n).toBeGreaterThanOrEqual(1);
        expect(n).toBeLessThanOrEqual(50);
      }
    });

    it("clamps pick to max 1000", () => {
      const res = generate("lottery", {
        pool_a: { min: 1, max: 1000, pick: 9999 },
      });

      expect(res.values).toHaveLength(1000);
    });

    it("includes formatted output with bonus values", () => {
      const res = generate("lottery", {
        pool_a: { min: 1, max: 10, pick: 3 },
        pool_b: { min: 1, max: 5, pick: 1 },
      });

      expect(res.formatted).toContain("+");
    });
  });

  // ============================================================
  // LIST MODE TESTS
  // ============================================================
  describe("list mode", () => {
    it("picks only from items", () => {
      const items = ["HEADS", "TAILS"];
      const res = generate("list", { items, count: 25 });
      expect(res.values).toHaveLength(25);
      for (const v of res.values) expect(items).toContain(v);
    });

    it("picks single item when count is 1", () => {
      const items = ["A", "B", "C", "D", "E"];
      const res = generate("list", { items, count: 1 });

      expect(res.values).toHaveLength(1);
      expect(items).toContain(res.values[0]);
    });

    it("unique returns no duplicates (when possible)", () => {
      const items = ["A", "B", "C", "D", "E"];
      const res = generate("list", { items, count: 5, unique: true });
      expect(res.values).toHaveLength(5);
      expect(new Set(res.values as string[]).size).toBe(5);
    });

    it("unique warns when count exceeds items", () => {
      const items = ["A", "B", "C"];
      const res = generate("list", { items, count: 10, unique: true });

      expect(res.warnings).toBeDefined();
      expect(res.warnings).toContain(
        "Only 3 unique items available; returning 3.",
      );
      expect(res.values).toHaveLength(3);
    });

    it("handles empty items array", () => {
      const res = generate("list", { items: [], count: 5 });

      expect(res.values).toEqual([]);
    });

    it("handles single item", () => {
      const res = generate("list", { items: ["ONLY"], count: 5 });

      expect(res.values).toHaveLength(5);
      expect(res.values).toEqual(["ONLY", "ONLY", "ONLY", "ONLY", "ONLY"]);
    });

    it("handles items with whitespace", () => {
      const items = ["  A  ", "  B  ", "  C  "];
      const res = generate("list", { items, count: 5 });

      // Should trim whitespace
      for (const v of res.values) {
        expect(["A", "B", "C"]).toContain(v);
      }
    });

    it("filters out empty strings", () => {
      const items = ["A", "", "B", "", "C", ""];
      const res = generate("list", { items, count: 10 });

      for (const v of res.values) {
        expect(["A", "B", "C"]).toContain(v);
      }
    });

    it("handles weighted picks", () => {
      const items = ["A", "B", "C"];
      const weights = [100, 1, 1]; // A heavily weighted
      const res = generate("list", { items, weights, count: 100 });

      // With 100 samples, A should appear most frequently
      const counts: Record<string, number> = { A: 0, B: 0, C: 0 };
      for (const v of res.values) {
        counts[v as string]++;
      }
      expect(counts.A).toBeGreaterThan(counts.B);
    });

    it("handles zero/negative weights (uses 1 as fallback)", () => {
      const items = ["A", "B", "C"];
      const weights = [0, -5, 10];
      const res = generate("list", { items, weights, count: 50 });

      expect(res.values).toHaveLength(50);
      for (const v of res.values) {
        expect(["A", "B", "C"]).toContain(v);
      }
    });

    it("handles weights array shorter than items", () => {
      const items = ["A", "B", "C", "D"];
      const weights = [1, 2];
      const res = generate("list", { items, weights, count: 10 });

      expect(res.values).toHaveLength(10);
    });

    it("unique weighted sampling", () => {
      const items = ["A", "B", "C", "D", "E"];
      const weights = [10, 8, 6, 4, 2];
      const res = generate("list", { items, weights, count: 3, unique: true });

      expect(res.values).toHaveLength(3);
      expect(new Set(res.values as string[]).size).toBe(3);
    });

    it("includes meta with selected indices for single pick", () => {
      const items = ["A", "B", "C"];
      const res = generate("list", { items, count: 1 });

      const meta = asRecord(res.meta);
      expect(typeof meta?.selectedIndex).toBe("number");
      expect(meta?.selectedIndex).toBeGreaterThanOrEqual(0);
      expect(meta?.selectedIndex).toBeLessThan(3);
    });

    it("includes meta with selected indices for multiple picks", () => {
      const items = ["A", "B", "C", "D", "E"];
      const res = generate("list", { items, count: 3 });

      const meta = asRecord(res.meta);
      const indices = meta?.selectedIndices as number[];
      expect(Array.isArray(indices)).toBe(true);
      expect(indices).toHaveLength(3);
    });

    it("clamps count to max 5000", () => {
      const items = ["A", "B", "C"];
      const res = generate("list", { items, count: 99999 });

      expect(res.values).toHaveLength(5000);
    });

    it("groups output when group_size is set", () => {
      const items = ["A", "B", "C", "D", "E", "F"];
      const res = generate("list", { items, count: 6, group_size: 3 });

      expect(res.formatted).toContain("\n");
    });

    it("unique weighted warns when some items have zero weight", () => {
      const items = ["A", "B", "C"];
      const weights = [0, 0, 1];
      const res = generate("list", { items, weights, count: 2, unique: true });

      // Should still return items, possibly with warning
      expect(res.values).toBeDefined();
    });
  });

  // ============================================================
  // SHUFFLE MODE TESTS
  // ============================================================
  describe("shuffle mode", () => {
    it("returns a permutation of items", () => {
      const items = ["a", "b", "c", "d", "e", "f"];
      const res = generate("shuffle", { items });
      expect(res.values).toHaveLength(items.length);
      expect(new Set(res.values as string[]).size).toBe(items.length);
      for (const v of items) expect(res.values).toContain(v);
    });

    it("handles empty array", () => {
      const res = generate("shuffle", { items: [] });

      expect(res.values).toEqual([]);
    });

    it("handles single item", () => {
      const res = generate("shuffle", { items: ["only"] });

      expect(res.values).toEqual(["only"]);
    });

    it("handles large arrays", () => {
      const items = Array.from({ length: 1000 }, (_, i) => `item${i}`);
      const res = generate("shuffle", { items });

      expect(res.values).toHaveLength(1000);
      expect(new Set(res.values as string[]).size).toBe(1000);
    });

    it("includes group size in meta", () => {
      const items = ["a", "b", "c"];
      const res = generate("shuffle", { items, group_size: 2 });

      const meta = asRecord(res.meta);
      expect(meta?.groupSize).toBe(2);
    });

    it("handles zero group size", () => {
      const items = ["a", "b", "c"];
      const res = generate("shuffle", { items, group_size: 0 });

      const meta = asRecord(res.meta);
      expect(meta?.groupSize).toBe(null);
    });

    it("groups output when group_size is set", () => {
      const items = ["a", "b", "c", "d", "e", "f"];
      const res = generate("shuffle", { items, group_size: 3 });

      expect(res.formatted).toContain("\n");
      const lines = res.formatted.split("\n");
      expect(lines.length).toBe(2);
    });

    it("clamps group_size to max 10000", () => {
      const items = ["a", "b", "c"];
      const res = generate("shuffle", { items, group_size: 99999 });

      const meta = asRecord(res.meta);
      expect(meta?.groupSize).toBe(10000);
    });

    it("handles items with whitespace", () => {
      const items = ["  a  ", "  b  ", "  c  "];
      const res = generate("shuffle", { items });

      for (const v of res.values) {
        expect(["a", "b", "c"]).toContain(v);
      }
    });

    it("filters empty strings", () => {
      const items = ["a", "", "b", "", "c"];
      const res = generate("shuffle", { items });

      expect(res.values).toHaveLength(3);
      expect(res.values).not.toContain("");
    });
  });

  // ============================================================
  // DICE MODE TESTS
  // ============================================================
  describe("dice mode", () => {
    it("produces valid rolls and total", () => {
      const res = generate("dice", { dice_sides: 6, dice_rolls: 25 });
      expect(res.values).toHaveLength(25);
      for (const v of res.values as number[]) {
        expect(typeof v).toBe("number");
        expect(v).toBeGreaterThanOrEqual(1);
        expect(v).toBeLessThanOrEqual(6);
      }
      const meta = asRecord(res.meta);
      expect(typeof meta?.total).toBe("number");
    });

    it("advantage/disadvantage returns kept + dropped", () => {
      const res = generate("dice", {
        dice_sides: 20,
        dice_rolls: 1,
        dice_adv: "advantage",
      });
      expect(res.values).toHaveLength(1);
      expect(res.bonus_values).toHaveLength(1);
      const kept = res.values[0] as number;
      const dropped = res.bonus_values![0] as number;
      expect(kept).toBeGreaterThanOrEqual(1);
      expect(kept).toBeLessThanOrEqual(20);
      expect(dropped).toBeGreaterThanOrEqual(1);
      expect(dropped).toBeLessThanOrEqual(20);
    });

    it("advantage keeps the higher roll", () => {
      const res = generate("dice", {
        dice_sides: 20,
        dice_rolls: 1,
        dice_adv: "advantage",
      });

      const meta = asRecord(res.meta);
      const d20 = asRecord(meta?.d20);
      expect(d20?.mode).toBe("advantage");
      expect(d20?.kept as number).toBeGreaterThanOrEqual(
        d20?.dropped as number,
      );
    });

    it("disadvantage keeps the lower roll", () => {
      const res = generate("dice", {
        dice_sides: 20,
        dice_rolls: 1,
        dice_adv: "disadvantage",
      });

      const meta = asRecord(res.meta);
      const d20 = asRecord(meta?.d20);
      expect(d20?.mode).toBe("disadvantage");
      expect(d20?.kept as number).toBeLessThanOrEqual(d20?.dropped as number);
    });

    it("handles custom faces", () => {
      const faces = ["Apple", "Banana", "Cherry", "Date"];
      const res = generate("dice", {
        dice_custom_faces: faces,
        dice_rolls: 10,
      });

      expect(res.values).toHaveLength(10);
      for (const v of res.values) {
        expect(faces).toContain(v);
      }
    });

    it("handles modifier addition", () => {
      const res = generate("dice", {
        dice_sides: 6,
        dice_rolls: 10,
        dice_modifier: 5,
      });

      for (const v of res.values as number[]) {
        expect(v).toBeGreaterThanOrEqual(6); // 1 + 5
        expect(v).toBeLessThanOrEqual(11); // 6 + 5
      }
    });

    it("handles negative modifier", () => {
      const res = generate("dice", {
        dice_sides: 6,
        dice_rolls: 10,
        dice_modifier: -2,
      });

      for (const v of res.values as number[]) {
        expect(v).toBeGreaterThanOrEqual(-1); // 1 - 2
        expect(v).toBeLessThanOrEqual(4); // 6 - 2
      }
    });

    it("handles D4", () => {
      const res = generate("dice", { dice_sides: 4, dice_rolls: 100 });

      for (const v of res.values as number[]) {
        expect(v).toBeGreaterThanOrEqual(1);
        expect(v).toBeLessThanOrEqual(4);
      }
    });

    it("handles D8", () => {
      const res = generate("dice", { dice_sides: 8, dice_rolls: 100 });

      for (const v of res.values as number[]) {
        expect(v).toBeGreaterThanOrEqual(1);
        expect(v).toBeLessThanOrEqual(8);
      }
    });

    it("handles D10", () => {
      const res = generate("dice", { dice_sides: 10, dice_rolls: 100 });

      for (const v of res.values as number[]) {
        expect(v).toBeGreaterThanOrEqual(1);
        expect(v).toBeLessThanOrEqual(10);
      }
    });

    it("handles D12", () => {
      const res = generate("dice", { dice_sides: 12, dice_rolls: 100 });

      for (const v of res.values as number[]) {
        expect(v).toBeGreaterThanOrEqual(1);
        expect(v).toBeLessThanOrEqual(12);
      }
    });

    it("handles D20", () => {
      const res = generate("dice", { dice_sides: 20, dice_rolls: 100 });

      for (const v of res.values as number[]) {
        expect(v).toBeGreaterThanOrEqual(1);
        expect(v).toBeLessThanOrEqual(20);
      }
    });

    it("handles D100", () => {
      const res = generate("dice", { dice_sides: 100, dice_rolls: 100 });

      for (const v of res.values as number[]) {
        expect(v).toBeGreaterThanOrEqual(1);
        expect(v).toBeLessThanOrEqual(100);
      }
    });

    it("clamps sides to min 2", () => {
      const res = generate("dice", { dice_sides: 1, dice_rolls: 10 });

      for (const v of res.values as number[]) {
        expect(v).toBeGreaterThanOrEqual(1);
        expect(v).toBeLessThanOrEqual(6); // Falls back to default
      }
    });

    it("clamps sides to max 10000", () => {
      const res = generate("dice", { dice_sides: 99999, dice_rolls: 10 });

      expect(res.values).toHaveLength(10);
      const meta = asRecord(res.meta);
      expect(meta?.sides).toBe(10000);
    });

    it("clamps rolls to min 1", () => {
      const res = generate("dice", { dice_sides: 6, dice_rolls: 0 });

      expect(res.values).toHaveLength(1);
    });

    it("clamps rolls to max 2000", () => {
      const res = generate("dice", { dice_sides: 6, dice_rolls: 9999 });

      expect(res.values).toHaveLength(2000);
    });

    it("includes meta with dice information", () => {
      const res = generate("dice", {
        dice_sides: 6,
        dice_rolls: 5,
        dice_modifier: 3,
      });

      const meta = asRecord(res.meta);
      expect(meta?.sides).toBe(6);
      expect(meta?.rolls).toBe(5);
      expect(meta?.modifier).toBe(3);
      expect(typeof meta?.total).toBe("number");
    });

    it("includes raw rolls in meta", () => {
      const res = generate("dice", {
        dice_sides: 6,
        dice_rolls: 3,
        dice_modifier: 2,
      });

      const meta = asRecord(res.meta);
      const raw = meta?.raw as number[];
      expect(Array.isArray(raw)).toBe(true);
      expect(raw).toHaveLength(3);
    });
  });

  // ============================================================
  // COIN MODE TESTS
  // ============================================================
  describe("coin mode", () => {
    it("stats sum to flips", () => {
      const flips = 200;
      const res = generate("coin", {
        coin_flips: flips,
        coin_labels: ["H", "T"],
      });
      expect(res.values).toHaveLength(flips);
      const meta = asRecord(res.meta);
      expect(meta?.flips).toBe(flips);
      expect(typeof meta?.heads).toBe("number");
      expect(typeof meta?.tails).toBe("number");
      expect((meta!.heads as number) + (meta!.tails as number)).toBe(flips);
      const streak = asRecord(meta?.longestStreak);
      expect(streak).not.toBeNull();
      expect(typeof streak!.length).toBe("number");
      expect(streak!.length as number).toBeGreaterThanOrEqual(1);
      expect(streak!.length as number).toBeLessThanOrEqual(flips);
    });

    it("uses default labels when not provided", () => {
      const res = generate("coin", { coin_flips: 10 });

      expect(res.values).toContain("HEADS");
      expect(res.values).toContain("TAILS");
    });

    it("uses custom labels", () => {
      const res = generate("coin", {
        coin_flips: 10,
        coin_labels: ["WIN", "LOSE"],
      });

      expect(res.values).toContain("WIN");
      expect(res.values).toContain("LOSE");
      expect(res.values).not.toContain("HEADS");
    });

    it("uses items as fallback for labels", () => {
      const res = generate("coin", { coin_flips: 10, items: ["YES", "NO"] });

      expect(res.values).toContain("YES");
      expect(res.values).toContain("NO");
    });

    it("handles single flip", () => {
      const res = generate("coin", { coin_flips: 1 });

      expect(res.values).toHaveLength(1);
      expect(["HEADS", "TAILS"]).toContain(res.values[0]);
    });

    it("handles large number of flips", () => {
      const res = generate("coin", { coin_flips: 10000 });

      expect(res.values).toHaveLength(10000);
    });

    it("clamps flips to min 1", () => {
      const res = generate("coin", { coin_flips: 0 });

      expect(res.values).toHaveLength(1);
    });

    it("clamps flips to max 10000", () => {
      const res = generate("coin", { coin_flips: 99999 });

      expect(res.values).toHaveLength(10000);
    });

    it("tracks longest streak correctly", () => {
      const res = generate("coin", { coin_flips: 100 });

      const meta = asRecord(res.meta);
      const streak = asRecord(meta?.longestStreak);
      expect(streak?.length).toBeGreaterThanOrEqual(1);
      expect(streak?.length).toBeLessThanOrEqual(100);
      expect(["HEADS", "TAILS"]).toContain(streak?.side);
    });

    it("includes both heads and tails in multi-flip sequence", () => {
      const res = generate("coin", { coin_flips: 100 });

      const meta = asRecord(res.meta);
      expect(meta!.heads as number).toBeGreaterThan(0);
      expect(meta!.tails as number).toBeGreaterThan(0);
    });
  });

  // ============================================================
  // TICKET MODE TESTS
  // ============================================================
  describe("ticket mode", () => {
    it("carries remaining forward via params", () => {
      const first = generate("ticket", {
        ticket_source: "range",
        min: 1,
        max: 10,
        count: 3,
        ticket_remaining: [],
      });
      expect(first.values).toHaveLength(3);
      const meta = asRecord(first.meta);
      const remaining = Array.isArray(meta?.ticket_remaining)
        ? (meta!.ticket_remaining as unknown[])
        : null;
      expect(Array.isArray(remaining)).toBe(true);
      const remainingStrings = (remaining ?? []).filter(
        (x) => typeof x === "string",
      ) as string[];
      expect(remainingStrings.length).toBe(7);

      const second = generate("ticket", {
        ticket_source: "range",
        min: 1,
        max: 10,
        count: 7,
        ticket_remaining: remainingStrings,
      });
      expect(second.values).toHaveLength(7);
      expect(
        new Set([...(first.values as string[]), ...(second.values as string[])])
          .size,
      ).toBe(10);
    });

    it("draws from list source", () => {
      const items = ["Alice", "Bob", "Charlie", "David", "Eve"];
      const res = generate("ticket", {
        ticket_source: "list",
        items,
        count: 2,
        ticket_remaining: [],
      });

      expect(res.values).toHaveLength(2);
      for (const v of res.values) {
        expect(items).toContain(v);
      }
    });

    it("draws unique tickets from remaining", () => {
      const remaining = ["1", "2", "3", "4", "5"];
      const res = generate("ticket", {
        ticket_source: "list",
        items: remaining,
        count: 3,
        ticket_remaining: remaining,
      });

      expect(res.values).toHaveLength(3);
      expect(new Set(res.values as string[]).size).toBe(3);
    });

    it("warns when draw exceeds remaining", () => {
      const remaining = ["1", "2", "3"];
      const res = generate("ticket", {
        ticket_source: "list",
        items: remaining,
        count: 10,
        ticket_remaining: remaining,
      });

      expect(res.warnings).toBeDefined();
      expect(res.warnings).toContain("Only 3 tickets left; drawing 3.");
      expect(res.values).toHaveLength(3);
    });

    it("returns updated remaining list in meta", () => {
      const remaining = ["1", "2", "3", "4", "5"];
      const res = generate("ticket", {
        ticket_source: "list",
        items: remaining,
        count: 2,
        ticket_remaining: remaining,
      });

      const meta = asRecord(res.meta);
      const nextRemaining = meta?.ticket_remaining as string[];
      expect(Array.isArray(nextRemaining)).toBe(true);
      expect(nextRemaining).toHaveLength(3);
    });

    it("treats empty remaining list as reset", () => {
      const res = generate("ticket", {
        ticket_source: "list",
        items: ["a", "b"],
        count: 1,
        ticket_remaining: [],
      });

      expect(res.values).toHaveLength(1);
    });

    it("handles range source with swapped min/max", () => {
      const res = generate("ticket", {
        ticket_source: "range",
        min: 100,
        max: 1,
        count: 5,
        ticket_remaining: [],
      });

      expect(res.values).toHaveLength(5);
    });

    it("clamps count to max 5000", () => {
      const res = generate("ticket", {
        ticket_source: "range",
        min: 1,
        max: 10000,
        count: 9999,
        ticket_remaining: [],
      });

      expect(res.values).toHaveLength(5000);
    });

    it("clamps count to min 1", () => {
      const res = generate("ticket", {
        ticket_source: "range",
        min: 1,
        max: 10,
        count: 0,
        ticket_remaining: [],
      });

      expect(res.values).toHaveLength(1);
    });

    it("formats output as newline-separated", () => {
      const res = generate("ticket", {
        ticket_source: "range",
        min: 1,
        max: 10,
        count: 5,
        ticket_remaining: [],
      });

      const lines = res.formatted.split("\n");
      expect(lines.length).toBe(5);
    });

    it("uses count alias for pick parameter", () => {
      const res = generate("ticket", {
        ticket_source: "range",
        min: 1,
        max: 10,
        pick: 3,
        ticket_remaining: [],
      });

      expect(res.values).toHaveLength(3);
    });

    it("handles list with whitespace", () => {
      const items = ["  A  ", "  B  ", "  C  "];
      const res = generate("ticket", {
        ticket_source: "list",
        items,
        count: 2,
        ticket_remaining: items,
      });

      for (const v of res.values) {
        expect(["A", "B", "C"]).toContain(v);
      }
    });

    it("filters empty items from list source", () => {
      const items = ["A", "", "B", "", "C"];
      const res = generate("ticket", {
        ticket_source: "list",
        items,
        count: 3,
        ticket_remaining: items,
      });

      expect(res.values).toHaveLength(3);
    });
  });

  // ============================================================
  // PARAMETER COMBINATION TESTS
  // ============================================================
  describe("parameter combinations", () => {
    it("range with all parameters", () => {
      const res = generate("range", {
        min: 1.5,
        max: 10.5,
        step: 0.5,
        precision: 2,
        count: 20,
        unique: true,
        sort: "asc",
      });

      expect(res.values).toHaveLength(20);
      expect(res.warnings).toBeDefined();
      expect(res.warnings).toContain(
        "Unique is impossible: requested 20 but capacity is 19.",
      );
      expect(new Set(res.values as number[]).size).toBeLessThanOrEqual(19);
    });

    it("password with pro options and grouping", () => {
      const res = generate("password", {
        length: 20,
        count: 5,
        charset: "strong",
        grouping: true,
        include_lower: true,
        include_upper: true,
        include_digits: true,
        include_symbols: true,
        ensure_each: true,
        exclude_ambiguous: true,
      });

      expect(res.values).toHaveLength(5);
      for (const v of res.values) {
        expect(String(v)).toContain("-");
      }
    });

    it("lottery with both pools and extreme ranges", () => {
      const res = generate("lottery", {
        pool_a: { min: 1, max: 999, pick: 5 },
        pool_b: { min: 1, max: 99, pick: 1 },
      });

      expect(res.values).toHaveLength(5);
      expect(res.bonus_values).toHaveLength(1);
    });

    it("list with weights, unique, and grouping", () => {
      const items = ["A", "B", "C", "D", "E"];
      const weights = [5, 4, 3, 2, 1];
      const res = generate("list", {
        items,
        weights,
        count: 3,
        unique: true,
        group_size: 2,
      });

      expect(res.values).toHaveLength(3);
      expect(new Set(res.values as string[]).size).toBe(3);
    });

    it("dice with modifier and custom faces", () => {
      const faces = ["Win", "Lose", "Draw", "Reroll"];
      const res = generate("dice", {
        dice_custom_faces: faces,
        dice_rolls: 5,
        dice_modifier: 0,
      });

      expect(res.values).toHaveLength(5);
    });

    it("coin with custom labels and many flips", () => {
      const res = generate("coin", {
        coin_flips: 1000,
        coin_labels: ["Custom1", "Custom2"],
      });

      expect(res.values).toHaveLength(1000);
      expect(res.values).toContain("Custom1");
      expect(res.values).toContain("Custom2");
    });

    it("shuffle with large group size", () => {
      const items = Array.from({ length: 100 }, (_, i) => `Item${i}`);
      const res = generate("shuffle", { items, group_size: 10 });

      expect(res.values).toHaveLength(100);
      const lines = res.formatted.split("\n");
      expect(lines.length).toBe(10);
    });

    it("range with negative values and precision", () => {
      const res = generate("range", {
        min: -10.5,
        max: 10.5,
        step: 0.1,
        precision: 1,
        count: 50,
      });

      for (const v of res.values) {
        const n = v as number;
        expect(n).toBeGreaterThanOrEqual(-10.5);
        expect(n).toBeLessThanOrEqual(10.5);
      }
    });
  });

  // ============================================================
  // TIMESTAMP AND WARNINGS VALIDATION
  // ============================================================
  describe("timestamp and warnings", () => {
    it("includes timestamp in all modes", () => {
      const modes: Array<GeneratorMode> = [
        "range",
        "digit",
        "password",
        "lottery",
        "list",
        "shuffle",
        "dice",
        "coin",
        "ticket",
      ];

      for (const mode of modes) {
        const res = generate(mode, { count: 1 });
        expect(res.timestamp).toBeDefined();
        expect(res.timestamp).toBeGreaterThan(0);
        expect(typeof res.timestamp).toBe("number");
      }
    });

    it("timestamps are recent", () => {
      const before = Date.now() - 1000; // 1 second ago
      const res = generate("range", { min: 1, max: 10, count: 1 });
      const after = Date.now() + 1000; // 1 second future

      expect(res.timestamp).toBeGreaterThan(before);
      expect(res.timestamp).toBeLessThan(after);
    });

    it("includes warnings array when issues exist", () => {
      const res = generate("range", {
        min: 1,
        max: 5,
        count: 100,
        unique: true,
      });

      expect(res.warnings).toBeDefined();
      expect(Array.isArray(res.warnings)).toBe(true);
    });

    it("does not include warnings property when no issues", () => {
      const res = generate("range", { min: 1, max: 100, count: 10 });

      expect(res.warnings).toBeUndefined();
    });

    it("warnings contain descriptive messages", () => {
      const res = generate("list", {
        items: ["A", "B"],
        count: 10,
        unique: true,
      });

      if (res.warnings && res.warnings.length > 0) {
        for (const warning of res.warnings) {
          expect(typeof warning).toBe("string");
          expect(warning.length).toBeGreaterThan(0);
        }
      }
    });
  });

  // ============================================================
  // FORMATTED OUTPUT VALIDATION
  // ============================================================
  describe("formatted output", () => {
    it("range mode uses comma separation", () => {
      const res = generate("range", { min: 1, max: 10, count: 5 });

      expect(res.formatted).toContain(", ");
      expect(res.formatted).not.toContain("\n");
    });

    it("password mode with count uses newline separation", () => {
      const res = generate("password", { length: 12, count: 5 });

      const lines = res.formatted.split("\n");
      expect(lines).toHaveLength(5);
    });

    it("single password does not have newlines", () => {
      const res = generate("password", { length: 12, count: 1 });

      expect(res.formatted).not.toContain("\n");
    });

    it("lottery with bonus shows separator", () => {
      const res = generate("lottery", {
        pool_a: { min: 1, max: 10, pick: 3 },
        pool_b: { min: 1, max: 5, pick: 1 },
      });

      expect(res.formatted).toContain(" + ");
    });

    it("ticket mode uses newline separation", () => {
      const res = generate("ticket", {
        ticket_source: "range",
        min: 1,
        max: 10,
        count: 5,
        ticket_remaining: [],
      });

      expect(res.formatted).toContain("\n");
    });

    it("list mode with group_size uses grouped format", () => {
      const items = ["A", "B", "C", "D"];
      const res = generate("list", { items, count: 4, group_size: 2 });

      const lines = res.formatted.split("\n");
      expect(lines).toHaveLength(2);
    });

    it("shuffle mode with group_size uses grouped format", () => {
      const items = ["A", "B", "C", "D", "E", "F"];
      const res = generate("shuffle", { items, group_size: 3 });

      const lines = res.formatted.split("\n");
      expect(lines).toHaveLength(2);
    });

    it("formatted output is always a string", () => {
      const res = generate("range", { min: 1, max: 10, count: 1 });

      expect(typeof res.formatted).toBe("string");
    });

    it("formatted output matches values length for comma-separated", () => {
      const res = generate("range", { min: 1, max: 10, count: 5 });

      const parts = res.formatted.split(", ");
      expect(parts.length).toBe(5);
    });

    it("digit mode formatted matches value", () => {
      const res = generate("digit", { length: 4, pad_zero: true });

      expect(res.formatted).toBe(String(res.values[0]));
    });

    it("coin mode formatted shows all flips", () => {
      const res = generate("coin", { coin_flips: 10 });

      const parts = res.formatted.split(", ");
      expect(parts.length).toBe(10);
    });
  });
});
