/**
 * Lottery mode generator.
 * Generates lottery numbers with dual pool support.
 */

import type { GeneratorParams } from "../types";
import {
  clampInt,
  rangeSize,
  safeFiniteNumber,
  valueAtIndex,
} from "../core/arrays";
import {
  randomIntInclusive,
  sampleUniqueIndices,
  setCurrentMode,
} from "../core/samplers";

export function generateLottery(params: GeneratorParams): {
  values: number[];
  bonus_values: number[];
} {
  setCurrentMode("lottery");

  const { pool_a, pool_b } = params;
  let values: number[] = [];
  let bonus_values: number[] = [];

  if (pool_a) {
    const min = safeFiniteNumber(pool_a.min, 1);
    const max = safeFiniteNumber(pool_a.max, 1);
    const pick = clampInt(pool_a.pick, 0, 1_000, 0);
    const size = rangeSize(min, max, 1);
    if (size > 0 && pick > 0) {
      const indices =
        pick <= size
          ? sampleUniqueIndices(size, pick)
          : Array.from({ length: pick }, () => randomIntInclusive(0, size - 1));
      values = indices
        .map((idx) => Math.round(valueAtIndex(Math.min(min, max), 1, idx)))
        .sort((a, b) => a - b);
    }
  }
  if (pool_b) {
    const min = safeFiniteNumber(pool_b.min, 1);
    const max = safeFiniteNumber(pool_b.max, 1);
    const pick = clampInt(pool_b.pick, 0, 1_000, 0);
    const size = rangeSize(min, max, 1);
    if (size > 0 && pick > 0) {
      const indices =
        pick <= size
          ? sampleUniqueIndices(size, pick)
          : Array.from({ length: pick }, () => randomIntInclusive(0, size - 1));
      bonus_values = indices
        .map((idx) => Math.round(valueAtIndex(Math.min(min, max), 1, idx)))
        .sort((a, b) => a - b);
    }
  }

  return { values, bonus_values };
}
