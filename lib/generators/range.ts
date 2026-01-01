/**
 * Range mode generator.
 * Generates random numbers within a specified range.
 */

import type { GeneratorParams } from "../types";
import {
  clampInt,
  rangeSize,
  safeFiniteNumber,
  valueAtIndex,
  roundToPrecision,
} from "../core/arrays";
import {
  randomIntInclusive,
  sampleUniqueIndices,
  setCurrentMode,
} from "../core/samplers";

const MODE = "range" as const;

export function generateRange(params: GeneratorParams): {
  values: (string | number)[];
  warnings: string[];
} {
  setCurrentMode(MODE);

  const {
    min: rawMin,
    max: rawMax,
    count: rawCount,
    unique: rawUnique,
    sort = null,
    step: rawStep,
    precision: rawPrecision,
  } = params;

  let min = safeFiniteNumber(rawMin, 1);
  let max = safeFiniteNumber(rawMax, 100);
  let step = safeFiniteNumber(rawStep, 1);
  const precision = clampInt(rawPrecision, 0, 12, 0);
  const count = clampInt(rawCount, 1, 10_000, 1);
  const unique = Boolean(rawUnique);

  if (step <= 0) step = 1;
  if (max < min) [min, max] = [max, min];

  const size = rangeSize(min, max, step);
  const warnings: string[] = [];

  if (size <= 0) return { values: [], warnings };

  let values: (string | number)[];

  if (unique && count > 1) {
    if (count > size) {
      warnings.push(
        `Unique is impossible: requested ${count} but capacity is ${size}.`,
      );
      values = Array.from({ length: count }, () => {
        const idx = randomIntInclusive(0, size - 1);
        return roundToPrecision(valueAtIndex(min, step, idx), precision);
      });
    } else {
      const indices = sampleUniqueIndices(size, count);
      values = indices.map((idx) =>
        roundToPrecision(valueAtIndex(min, step, idx), precision),
      );
    }
  } else {
    values = Array.from({ length: count }, () => {
      const idx = randomIntInclusive(0, size - 1);
      return roundToPrecision(valueAtIndex(min, step, idx), precision);
    });
  }

  if (sort === "asc") values.sort((a, b) => (a as number) - (b as number));
  if (sort === "desc") values.sort((a, b) => (b as number) - (a as number));

  return { values, warnings };
}
