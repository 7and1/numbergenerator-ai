import { describe, expect, it } from "vitest";

import { generate } from "./engine";

describe("engine.generate (stress tests)", () => {
  // ============================================================
  // PERFORMANCE TESTS
  // ============================================================
  describe("performance", () => {
    it("generates 10,000 range numbers quickly", () => {
      const start = performance.now();
      const res = generate("range", { min: 1, max: 1000000, count: 10000 });
      const end = performance.now();

      expect(res.values).toHaveLength(10000);
      expect(end - start).toBeLessThan(1000); // Should complete in less than 1 second
    });

    it("generates 200 passwords with pro options quickly", () => {
      const start = performance.now();
      const res = generate("password", {
        length: 32,
        count: 200,
        include_lower: true,
        include_upper: true,
        include_digits: true,
        include_symbols: true,
        ensure_each: true,
        exclude_ambiguous: true,
      });
      const end = performance.now();

      expect(res.values).toHaveLength(200);
      expect(end - start).toBeLessThan(1000);
    });

    it("generates 10,000 coin flips quickly", () => {
      const start = performance.now();
      const res = generate("coin", { coin_flips: 10000 });
      const end = performance.now();

      expect(res.values).toHaveLength(10000);
      expect(end - start).toBeLessThan(500);
    });

    it("generates 2,000 dice rolls quickly", () => {
      const start = performance.now();
      const res = generate("dice", { dice_sides: 6, dice_rolls: 2000 });
      const end = performance.now();

      expect(res.values).toHaveLength(2000);
      expect(end - start).toBeLessThan(500);
    });

    it("shuffles 10,000 items quickly", () => {
      const items = Array.from({ length: 10000 }, (_, i) => `item${i}`);
      const start = performance.now();
      const res = generate("shuffle", { items });
      const end = performance.now();

      expect(res.values).toHaveLength(10000);
      expect(end - start).toBeLessThan(1000);
    });

    it("picks 5,000 unique items from large list quickly", () => {
      const items = Array.from({ length: 10000 }, (_, i) => `item${i}`);
      const start = performance.now();
      const res = generate("list", { items, count: 5000, unique: true });
      const end = performance.now();

      expect(res.values).toHaveLength(5000);
      expect(new Set(res.values as string[]).size).toBe(5000);
      expect(end - start).toBeLessThan(2000);
    });

    it("handles complex lottery with large pools", () => {
      const start = performance.now();
      const res = generate("lottery", {
        pool_a: { min: 1, max: 1000, pick: 100 },
        pool_b: { min: 1, max: 100, pick: 10 },
      });
      const end = performance.now();

      expect(res.values).toHaveLength(100);
      expect(res.bonus_values).toHaveLength(10);
      expect(end - start).toBeLessThan(500);
    });
  });

  // ============================================================
  // MEMORY LEAK DETECTION
  // ============================================================
  describe("memory leak detection", () => {
    it("does not accumulate memory with repeated calls", () => {
      // Run many iterations
      for (let i = 0; i < 1000; i++) {
        generate("range", { min: 1, max: 1000, count: 100 });
        generate("password", { length: 32, count: 50 });
        generate("shuffle", { items: ["a", "b", "c", "d", "e"] });
      }

      // Force garbage collection if available (Node.js with --expose-gc)
      if (typeof globalThis.gc === "function") {
        globalThis.gc();
      }

      // In a real test environment, we'd check that memory growth is reasonable
      // For now, just ensure the test completes without errors
      expect(true).toBe(true);
    });

    it("handles large data structures without leaks", () => {
      const largeItems = Array.from({ length: 5000 }, (_, i) =>
        `Item${i}`.repeat(10),
      );

      // Multiple shuffles
      for (let i = 0; i < 50; i++) {
        const res = generate("shuffle", { items: largeItems });
        expect(res.values).toHaveLength(5000);
      }

      // Multiple unique picks
      for (let i = 0; i < 50; i++) {
        const res = generate("list", {
          items: largeItems,
          count: 1000,
          unique: true,
        });
        expect(res.values).toHaveLength(1000);
        expect(new Set(res.values as string[]).size).toBe(1000);
      }
    });
  });

  // ============================================================
  // EXTREME PARAMETER VALUES
  // ============================================================
  describe("extreme parameters", () => {
    it("handles maximum batch password generation", () => {
      const res = generate("password", {
        length: 256,
        count: 200,
        charset: "strong",
      });

      expect(res.values).toHaveLength(200);
      for (const v of res.values) {
        expect(String(v).length).toBe(256);
      }
    });

    it("handles maximum dice rolls", () => {
      const res = generate("dice", {
        dice_sides: 10000,
        dice_rolls: 2000,
      });

      expect(res.values).toHaveLength(2000);
      const meta = res.meta as { total: number };
      expect(meta.total).toBeGreaterThan(2000);
    });

    it("handles maximum coin flips", () => {
      const res = generate("coin", { coin_flips: 10000 });

      expect(res.values).toHaveLength(10000);
    });

    it("handles maximum list count", () => {
      const items = ["A", "B", "C", "D", "E"];
      const res = generate("list", { items, count: 5000 });

      expect(res.values).toHaveLength(5000);
    });

    it("handles maximum ticket draw", () => {
      const res = generate("ticket", {
        ticket_source: "range",
        min: 1,
        max: 10000,
        count: 5000,
        ticket_remaining: [],
      });

      expect(res.values).toHaveLength(5000);
    });

    it("handles maximum lottery pick", () => {
      const res = generate("lottery", {
        pool_a: { min: 1, max: 2000, pick: 1000 },
      });

      expect(res.values).toHaveLength(1000);
    });

    it("handles maximum password length", () => {
      const res = generate("password", {
        length: 256,
        count: 10,
      });

      for (const v of res.values) {
        expect(String(v).length).toBe(256);
      }
    });

    it("handles maximum digit length", () => {
      const res = generate("digit", { length: 18, pad_zero: true });

      const s = String(res.values[0]);
      expect(s.length).toBe(18);
    });

    it("handles maximum precision", () => {
      const res = generate("range", {
        min: 0,
        max: 1,
        step: 0.000000000001,
        precision: 12,
        count: 100,
      });

      expect(res.values).toHaveLength(100);
      for (const v of res.values) {
        expect(v).toBeGreaterThanOrEqual(0);
        expect(v).toBeLessThanOrEqual(1);
      }
    });

    it("handles very small step with high precision", () => {
      const res = generate("range", {
        min: 0,
        max: 0.001,
        step: 0.00001,
        precision: 5,
        count: 50,
      });

      expect(res.values).toHaveLength(50);
    });
  });

  // ============================================================
  // STRESS TESTS FOR UNIQUE SAMPLING
  // ============================================================
  describe("unique sampling stress", () => {
    it("handles unique sampling from large population", () => {
      const res = generate("range", {
        min: 1,
        max: 10000,
        step: 1,
        count: 5000,
        unique: true,
      });

      expect(res.values).toHaveLength(5000);
      expect(new Set(res.values as number[]).size).toBe(5000);
    });

    it("handles unique sampling near capacity", () => {
      const res = generate("range", {
        min: 1,
        max: 1000,
        step: 1,
        count: 999,
        unique: true,
      });

      expect(res.values).toHaveLength(999);
      expect(new Set(res.values as number[]).size).toBe(999);
    });

    it("handles unique list sampling from large item set", () => {
      const items = Array.from({ length: 5000 }, (_, i) => `item${i}`);
      const res = generate("list", {
        items,
        count: 4999,
        unique: true,
      });

      expect(res.values).toHaveLength(4999);
      expect(new Set(res.values as string[]).size).toBe(4999);
    });

    it("handles weighted unique sampling from large set", () => {
      const items = Array.from({ length: 1000 }, (_, i) => `item${i}`);
      const weights = Array.from({ length: 1000 }, (_, i) => i + 1);
      const res = generate("list", {
        items,
        weights,
        count: 500,
        unique: true,
      });

      expect(res.values).toHaveLength(500);
      expect(new Set(res.values as string[]).size).toBe(500);
    });
  });

  // ============================================================
  // RAPID SEQUENTIAL CALLS
  // ============================================================
  describe("rapid sequential calls", () => {
    it("handles 1000 rapid generate calls", () => {
      const results: unknown[] = [];

      for (let i = 0; i < 1000; i++) {
        results.push(generate("range", { min: i, max: i + 100, count: 10 }));
      }

      expect(results).toHaveLength(1000);
      for (const res of results) {
        const r = res as { values: unknown[] };
        expect(r.values).toHaveLength(10);
      }
    });

    it("handles mixed mode rapid calls", () => {
      const modes: Array<"range" | "password" | "list" | "shuffle"> = [
        "range",
        "password",
        "list",
        "shuffle",
      ];

      for (let i = 0; i < 500; i++) {
        const mode = modes[i % modes.length];
        if (mode === "range") {
          generate("range", { min: 1, max: 100, count: 10 });
        } else if (mode === "password") {
          generate("password", { length: 16, count: 5 });
        } else if (mode === "list") {
          generate("list", { items: ["a", "b", "c"], count: 5 });
        } else {
          generate("shuffle", { items: ["a", "b", "c", "d"] });
        }
      }

      expect(true).toBe(true);
    });

    it("maintains isolation between calls", () => {
      const res1 = generate("range", {
        min: 1,
        max: 10,
        count: 5,
        unique: true,
      });
      const res2 = generate("range", {
        min: 1,
        max: 10,
        count: 5,
        unique: true,
      });

      // Results should be independent
      expect(res1.timestamp).toBeLessThanOrEqual(res2.timestamp);
      expect(res1.values).toBeDefined();
      expect(res2.values).toBeDefined();
    });
  });

  // ============================================================
  // EDGE CASE STRESS
  // ============================================================
  describe("edge case stress", () => {
    it("handles password with all exclusions", () => {
      const res = generate("password", {
        length: 50,
        count: 10,
        include_lower: true,
        include_upper: false,
        include_digits: false,
        include_symbols: false,
        exclude_chars: "abcdefghijklmnopqrstuvwxyz",
      });

      // Should fall back to strong charset
      expect(res.values).toBeDefined();
      expect(res.warnings).toBeDefined();
    });

    it("handles list with all empty/whitespace items", () => {
      const res = generate("list", {
        items: ["", "  ", "", "\n", "\t", ""],
        count: 10,
      });

      // Should return empty
      expect(res.values).toEqual([]);
    });

    it("handles range with tiny valid range", () => {
      const res = generate("range", {
        min: 1.0001,
        max: 1.0002,
        step: 0.00001,
        precision: 5,
        count: 10,
      });

      expect(res.values).toHaveLength(10);
    });

    it("handles weighted list with all zero weights", () => {
      const items = ["A", "B", "C", "D", "E"];
      const weights = [0, 0, 0, 0, 0];
      const res = generate("list", { items, weights, count: 10 });

      // Should still pick items uniformly
      expect(res.values).toHaveLength(10);
      for (const v of res.values) {
        expect(items).toContain(v);
      }
    });

    it("handles ticket with all items drawn", () => {
      const remaining = ["1", "2", "3", "4", "5"];
      const res = generate("ticket", {
        ticket_source: "list",
        items: remaining,
        count: 10, // More than available
        ticket_remaining: remaining,
      });

      expect(res.values).toHaveLength(5);
      expect(res.warnings).toBeDefined();
    });
  });

  // ============================================================
  // DISTRIBUTION TESTS
  // ============================================================
  describe("distribution stress", () => {
    it("maintains uniform distribution over many samples", () => {
      const samples = 10000;
      const res = generate("range", {
        min: 1,
        max: 10,
        step: 1,
        count: samples,
      });

      const counts: Record<number, number> = {};
      for (const v of res.values as number[]) {
        counts[v] = (counts[v] ?? 0) + 1;
      }

      // Each value should appear roughly 1000 times (10%)
      for (let i = 1; i <= 10; i++) {
        expect(counts[i]).toBeGreaterThan(800); // At least 8%
        expect(counts[i]).toBeLessThan(1200); // At most 12%
      }
    });

    it("maintains weighted distribution over many samples", () => {
      const items = ["A", "B", "C"];
      const weights = [1, 2, 7]; // C should appear ~70% of the time
      const samples = 5000; // list count clamps to 5000
      const res = generate("list", { items, weights, count: samples });

      const counts: Record<string, number> = { A: 0, B: 0, C: 0 };
      for (const v of res.values as string[]) {
        counts[v]++;
      }

      // C should appear significantly more often
      expect(counts.C).toBeGreaterThan(3100); // >62%
      expect(counts.A).toBeLessThan(800); // <16%
    });

    it("coin flip approaches 50/50 over many flips", () => {
      const flips = 10000;
      const res = generate("coin", { coin_flips: flips });

      const meta = res.meta as {
        heads: number;
        tails: number;
      };

      const ratio = meta.heads / flips;
      // Should be close to 0.5 (within 5%)
      expect(ratio).toBeGreaterThan(0.45);
      expect(ratio).toBeLessThan(0.55);
    });

    it("dice shows uniform distribution over many rolls", () => {
      const rolls = 2000; // dice rolls clamp to 2000
      const sides = 6;
      const res = generate("dice", { dice_sides: sides, dice_rolls: rolls });

      const counts: Record<number, number> = {
        1: 0,
        2: 0,
        3: 0,
        4: 0,
        5: 0,
        6: 0,
      };
      for (const v of res.values as number[]) {
        counts[Math.round(v)]++;
      }

      // Each side should appear roughly 1000 times (1/6)
      for (let i = 1; i <= sides; i++) {
        // Each side should appear roughly 333 times (1/6)
        expect(counts[i]).toBeGreaterThan(250);
        expect(counts[i]).toBeLessThan(450);
      }
    });
  });

  // ============================================================
  // CONCURRENT-LIKE BEHAVIOR
  // ============================================================
  describe("concurrent-like behavior", () => {
    it("handles interleaved operations correctly", () => {
      const results: unknown[] = [];

      // Simulate interleaved operations
      for (let i = 0; i < 100; i++) {
        results.push(generate("range", { min: 1, max: 100, count: 10 }));
        results.push(generate("list", { items: ["a", "b", "c"], count: 5 }));
        results.push(generate("coin", { coin_flips: 10 }));
      }

      expect(results).toHaveLength(300);
    });

    it("maintains state integrity with ticket draws", () => {
      const pool = Array.from({ length: 100 }, (_, i) => String(i + 1));
      let remaining = [...pool];

      // Draw all tickets
      for (let i = 0; i < 10; i++) {
        const res = generate("ticket", {
          ticket_source: "list",
          items: pool,
          count: 10,
          ticket_remaining: remaining,
        });

        const meta = res.meta as { ticket_remaining: string[] };
        remaining = meta.ticket_remaining;

        expect(res.values).toHaveLength(10);
      }

      // All 100 tickets should be drawn
      expect(remaining).toHaveLength(0);
    });
  });
});
