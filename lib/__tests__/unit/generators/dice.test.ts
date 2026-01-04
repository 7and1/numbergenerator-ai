/**
 * Unit tests for dice generator
 */

import { describe, it, expect } from "vitest";
import { generateDice } from "../../../generators/dice";

describe("generateDice", () => {
  describe("basic functionality", () => {
    it("should generate dice rolls", () => {
      const result = generateDice({});
      expect(result.values).toHaveLength(1);
      expect(result.bonus_values).toEqual([]);
      expect(result.meta).toBeDefined();
    });

    it("should generate multiple rolls", () => {
      const result = generateDice({ dice_rolls: 5 });
      expect(result.values).toHaveLength(5);
    });

    it("should return metadata", () => {
      const result = generateDice({ dice_sides: 6, dice_rolls: 3 });
      expect(result.meta).toBeDefined();
      expect(result.meta?.sides).toBe(6);
      expect(result.meta?.rolls).toBe(3);
    });
  });

  describe("standard dice", () => {
    it("should generate D4 values", () => {
      const result = generateDice({ dice_sides: 4, dice_rolls: 10 });
      expect(result.values).toHaveLength(10);
      result.values.forEach((v) => {
        expect(v).toBeGreaterThanOrEqual(1);
        expect(v).toBeLessThanOrEqual(4);
      });
    });

    it("should generate D6 values", () => {
      const result = generateDice({ dice_sides: 6, dice_rolls: 10 });
      expect(result.values).toHaveLength(10);
      result.values.forEach((v) => {
        expect(v).toBeGreaterThanOrEqual(1);
        expect(v).toBeLessThanOrEqual(6);
      });
    });

    it("should generate D8 values", () => {
      const result = generateDice({ dice_sides: 8, dice_rolls: 10 });
      expect(result.values).toHaveLength(10);
      result.values.forEach((v) => {
        expect(v).toBeGreaterThanOrEqual(1);
        expect(v).toBeLessThanOrEqual(8);
      });
    });

    it("should generate D10 values", () => {
      const result = generateDice({ dice_sides: 10, dice_rolls: 10 });
      expect(result.values).toHaveLength(10);
      result.values.forEach((v) => {
        expect(v).toBeGreaterThanOrEqual(1);
        expect(v).toBeLessThanOrEqual(10);
      });
    });

    it("should generate D12 values", () => {
      const result = generateDice({ dice_sides: 12, dice_rolls: 10 });
      expect(result.values).toHaveLength(10);
      result.values.forEach((v) => {
        expect(v).toBeGreaterThanOrEqual(1);
        expect(v).toBeLessThanOrEqual(12);
      });
    });

    it("should generate D20 values", () => {
      const result = generateDice({ dice_sides: 20, dice_rolls: 10 });
      expect(result.values).toHaveLength(10);
      result.values.forEach((v) => {
        expect(v).toBeGreaterThanOrEqual(1);
        expect(v).toBeLessThanOrEqual(20);
      });
    });

    it("should generate D100 values", () => {
      const result = generateDice({ dice_sides: 100, dice_rolls: 10 });
      expect(result.values).toHaveLength(10);
      result.values.forEach((v) => {
        expect(v).toBeGreaterThanOrEqual(1);
        expect(v).toBeLessThanOrEqual(100);
      });
    });
  });

  describe("modifier parameter", () => {
    it("should add modifier to rolls", () => {
      const result = generateDice({
        dice_sides: 20,
        dice_rolls: 5,
        dice_modifier: 5,
      });
      result.values.forEach((v) => {
        expect(v).toBeGreaterThanOrEqual(6); // 1 + 5
        expect(v).toBeLessThanOrEqual(25); // 20 + 5
      });
    });

    it("should handle negative modifier", () => {
      const result = generateDice({
        dice_sides: 20,
        dice_rolls: 5,
        dice_modifier: -2,
      });
      result.values.forEach((v) => {
        expect(v).toBeGreaterThanOrEqual(-1); // 1 - 2
        expect(v).toBeLessThanOrEqual(18); // 20 - 2
      });
    });

    it("should include raw values in metadata", () => {
      const result = generateDice({
        dice_sides: 6,
        dice_rolls: 3,
        dice_modifier: 2,
      });
      expect(result.meta?.raw).toBeDefined();
      expect((result.meta?.raw as number[]).length).toBe(3);
    });

    it("should calculate total in metadata", () => {
      const result = generateDice({
        dice_sides: 6,
        dice_rolls: 3,
        dice_modifier: 2,
      });
      expect(result.meta?.total).toBeDefined();
      const total = result.values.reduce((sum, v) => sum + (v as number), 0);
      expect(result.meta?.total).toBe(total);
    });
  });

  describe("advantage/disadvantage", () => {
    it("should handle advantage with D20", () => {
      const result = generateDice({
        dice_sides: 20,
        dice_rolls: 1,
        dice_adv: "advantage",
      });
      expect(result.values).toHaveLength(1);
      expect(result.bonus_values).toHaveLength(1);
      expect(result.meta?.d20).toBeDefined();
      expect((result.meta?.d20 as { mode: string }).mode).toBe("advantage");
    });

    it("should handle disadvantage with D20", () => {
      const result = generateDice({
        dice_sides: 20,
        dice_rolls: 1,
        dice_adv: "disadvantage",
      });
      expect(result.values).toHaveLength(1);
      expect(result.bonus_values).toHaveLength(1);
      expect((result.meta?.d20 as { mode: string }).mode).toBe("disadvantage");
    });

    it("should keep higher roll for advantage", () => {
      const result = generateDice({
        dice_sides: 20,
        dice_rolls: 1,
        dice_adv: "advantage",
      });
      const meta = result.meta?.d20 as { a: number; b: number; kept: number };
      expect(result.values[0]).toBe(Math.max(meta.a, meta.b));
      expect(result.bonus_values[0]).toBe(Math.min(meta.a, meta.b));
    });

    it("should keep lower roll for disadvantage", () => {
      const result = generateDice({
        dice_sides: 20,
        dice_rolls: 1,
        dice_adv: "disadvantage",
      });
      const meta = result.meta?.d20 as { a: number; b: number; kept: number };
      expect(result.values[0]).toBe(Math.min(meta.a, meta.b));
      expect(result.bonus_values[0]).toBe(Math.max(meta.a, meta.b));
    });

    it("should apply modifier to advantage roll", () => {
      const result = generateDice({
        dice_sides: 20,
        dice_rolls: 1,
        dice_adv: "advantage",
        dice_modifier: 5,
      });
      const meta = result.meta?.d20 as {
        a: number;
        b: number;
        kept: number;
        modifier: number;
      };
      expect(meta.modifier).toBe(5);
      expect(result.values[0]).toBe(Math.max(meta.a, meta.b) + 5);
    });

    it("should only apply advantage to D20 with single roll", () => {
      // D20 but multiple rolls - should not use advantage
      const result = generateDice({
        dice_sides: 20,
        dice_rolls: 3,
        dice_adv: "advantage",
      });
      expect(result.values).toHaveLength(3);
      expect(result.meta?.d20).toBeUndefined();

      // D10 with advantage - should not use advantage
      const result2 = generateDice({
        dice_sides: 10,
        dice_rolls: 1,
        dice_adv: "advantage",
      });
      expect(result2.values).toHaveLength(1);
      expect(result2.meta?.d20).toBeUndefined();
    });
  });

  describe("custom faces", () => {
    it("should generate from custom faces", () => {
      const result = generateDice({
        dice_custom_faces: ["a", "b", "c", "d", "e", "f"],
        dice_rolls: 10,
      });
      expect(result.values).toHaveLength(10);
      result.values.forEach((v) => {
        expect(["a", "b", "c", "d", "e", "f"]).toContain(v as string);
      });
    });

    it("should include selected indices in metadata", () => {
      const result = generateDice({
        dice_custom_faces: ["a", "b", "c", "d"],
        dice_rolls: 3,
      });
      expect(result.meta?.selectedIndices).toBeDefined();
      expect((result.meta?.selectedIndices as number[]).length).toBe(3);
      (result.meta?.selectedIndices as number[]).forEach((idx) => {
        expect(idx).toBeGreaterThanOrEqual(0);
        expect(idx).toBeLessThan(4);
      });
    });

    it("should handle custom faces with numbers as strings", () => {
      const result = generateDice({
        dice_custom_faces: ["1", "2", "3", "4", "5", "6"],
        dice_rolls: 5,
      });
      expect(result.values).toHaveLength(5);
      result.values.forEach((v) => {
        expect(typeof v).toBe("string");
      });
    });

    it("should handle custom faces with emoji", () => {
      const result = generateDice({
        dice_custom_faces: ["", "", "", "", "", ""],
        dice_rolls: 10,
      });
      expect(result.values).toHaveLength(10);
    });

    it("should handle two custom faces minimum", () => {
      const result = generateDice({
        dice_custom_faces: ["heads", "tails"],
        dice_rolls: 5,
      });
      expect(result.values).toHaveLength(5);
    });
  });

  describe("parameter clamping", () => {
    it("should clamp rolls to minimum of 1", () => {
      const result = generateDice({ dice_rolls: 0 });
      expect(result.values).toHaveLength(1);
    });

    it("should clamp rolls to maximum of 2000", () => {
      const result = generateDice({ dice_rolls: 5000 });
      expect(result.values).toHaveLength(2000);
    });

    it("should clamp sides to minimum of 2", () => {
      const result = generateDice({ dice_sides: 1, dice_rolls: 10 });
      expect(result.values).toHaveLength(10);
      result.values.forEach((v) => {
        expect(v).toBeGreaterThanOrEqual(1);
        expect(v).toBeLessThanOrEqual(2);
      });
    });

    it("should clamp sides to maximum of 10000", () => {
      const result = generateDice({ dice_sides: 20000, dice_rolls: 10 });
      expect(result.values).toHaveLength(10);
      result.values.forEach((v) => {
        expect(v).toBeGreaterThanOrEqual(1);
        expect(v).toBeLessThanOrEqual(10000);
      });
    });

    it("should default to 6 sides", () => {
      const result = generateDice({});
      expect(result.meta?.sides).toBe(6);
    });

    it("should default to 1 roll", () => {
      const result = generateDice({});
      expect(result.meta?.rolls).toBe(1);
    });

    it("should default modifier to 0", () => {
      const result = generateDice({});
      expect(result.meta?.modifier).toBe(0);
    });

    it("should default dice_adv to none", () => {
      const result = generateDice({});
      expect(result.meta?.d20).toBeUndefined();
    });
  });

  describe("edge cases", () => {
    it("should handle empty params", () => {
      const result = generateDice({});
      expect(result.values).toHaveLength(1);
      expect(result.values[0]).toBeGreaterThanOrEqual(1);
      expect(result.values[0]).toBeLessThanOrEqual(6);
    });

    it("should handle large number of rolls", () => {
      const result = generateDice({ dice_sides: 6, dice_rolls: 1000 });
      expect(result.values).toHaveLength(1000);
    });

    it("should return bonus_values as empty array for standard rolls", () => {
      const result = generateDice({ dice_sides: 6, dice_rolls: 5 });
      expect(result.bonus_values).toEqual([]);
    });
  });

  describe("randomness", () => {
    it("should generate different results", () => {
      const results: number[][] = [];
      for (let i = 0; i < 10; i++) {
        const result = generateDice({ dice_sides: 6, dice_rolls: 5 });
        results.push(result.values as number[]);
      }
      // Not all should be identical
      const first = JSON.stringify(results[0]);
      const allSame = results.every((r) => JSON.stringify(r) === first);
      expect(allSame).toBe(false);
    });

    it("should have uniform distribution over time", () => {
      const counts = new Array(6).fill(0);
      const iterations = 6000;

      for (let i = 0; i < iterations; i++) {
        const result = generateDice({ dice_sides: 6, dice_rolls: 1 });
        counts[(result.values[0] as number) - 1]++;
      }

      // Each face should appear roughly 1000 times
      counts.forEach((count) => {
        expect(count).toBeGreaterThan(900); // At least 15%
        expect(count).toBeLessThan(1100); // At most ~18%
      });
    });
  });

  describe("D&D scenarios", () => {
    it("should simulate attack roll with advantage", () => {
      const result = generateDice({
        dice_sides: 20,
        dice_rolls: 1,
        dice_adv: "advantage",
        dice_modifier: 5,
      });
      expect(result.values).toHaveLength(1);
      expect(result.bonus_values).toHaveLength(1);
      expect(result.values[0] as number).toBeGreaterThanOrEqual(6);
      expect(result.values[0] as number).toBeLessThanOrEqual(25);
    });

    it("should simulate saving throw with disadvantage", () => {
      const result = generateDice({
        dice_sides: 20,
        dice_rolls: 1,
        dice_adv: "disadvantage",
        dice_modifier: 3,
      });
      expect(result.values).toHaveLength(1);
      expect(result.bonus_values).toHaveLength(1);
    });

    it("should simulate 4D6 drop lowest (character stat)", () => {
      const result = generateDice({
        dice_sides: 6,
        dice_rolls: 4,
      });
      expect(result.values).toHaveLength(4);
      const values = result.values as number[];
      const sorted = [...values].sort((a, b) => a - b);
      // User would manually drop lowest (sorted[0])
      expect(sorted).toHaveLength(4);
    });

    it("should simulate 2D10 damage roll", () => {
      const result = generateDice({
        dice_sides: 10,
        dice_rolls: 2,
        dice_modifier: 5,
      });
      expect(result.values).toHaveLength(2);
      expect(result.meta?.total).toBeDefined();
      expect(result.meta?.total as number).toBeGreaterThan(0);
    });

    it("should simulate fireball 8D6", () => {
      const result = generateDice({
        dice_sides: 6,
        dice_rolls: 8,
      });
      expect(result.values).toHaveLength(8);
      expect(result.meta?.total).toBeDefined();
      expect(result.meta?.total as number).toBeGreaterThanOrEqual(8);
      expect(result.meta?.total as number).toBeLessThanOrEqual(48);
    });
  });
});
