/**
 * List and shuffle mode generators.
 * Randomly selects from or shuffles a list of items.
 */

import type { GeneratorParams } from "../types";
import {
  clampInt,
  normalizedItemsAndWeights,
  shuffleInPlace,
} from "../core/arrays";
import {
  randomIntInclusive,
  sampleUniqueIndices,
  weightedPickIndex,
  weightedSampleWithoutReplacementIndices,
  setCurrentMode,
} from "../core/samplers";

export function generateList(params: GeneratorParams): {
  values: (string | number)[];
  meta: Record<string, unknown>;
  warnings: string[];
} {
  setCurrentMode("list");

  const { items = [], weights, count: rawCount, unique: rawUnique } = params;
  const { items: cleaned, weights: cleanedWeights } = normalizedItemsAndWeights(
    items,
    weights,
  );
  const warnings: string[] = [];

  if (!cleaned.length) return { values: [], meta: {}, warnings };

  const safeCount = clampInt(rawCount, 1, 5_000, 1);
  const unique = Boolean(rawUnique);

  let values: (string | number)[];
  let meta: Record<string, unknown>;

  if (unique) {
    const k = Math.min(safeCount, cleaned.length);
    if (safeCount > cleaned.length)
      warnings.push(
        `Only ${cleaned.length} unique items available; returning ${k}.`,
      );

    let indices: number[];
    if (cleanedWeights) {
      indices = weightedSampleWithoutReplacementIndices(cleanedWeights, k);
      if (indices.length < k) {
        warnings.push(
          "Some items had zero/invalid weight; filling the rest uniformly.",
        );
        const selected = new Set(indices);
        const remaining = Array.from(
          { length: cleaned.length },
          (_, i) => i,
        ).filter((i) => !selected.has(i));
        const need = k - indices.length;
        if (need > 0 && remaining.length > 0) {
          const extra = sampleUniqueIndices(
            remaining.length,
            Math.min(need, remaining.length),
          ).map((i) => remaining[i]!);
          indices = [...indices, ...extra];
        }
      }
    } else {
      indices = sampleUniqueIndices(cleaned.length, k);
    }

    values = shuffleInPlace(indices.map((i) => cleaned[i]!));
    meta = { selectedIndices: indices };
  } else {
    const indices: number[] = [];
    values = Array.from({ length: safeCount }, () => {
      const idx = cleanedWeights
        ? weightedPickIndex(cleanedWeights)
        : randomIntInclusive(0, cleaned.length - 1);
      indices.push(idx);
      return cleaned[idx]!;
    });
    meta = {
      selectedIndices: indices,
      selectedIndex: indices.length === 1 ? indices[0] : undefined,
    };
  }

  return { values, meta, warnings };
}

export function generateShuffle(params: GeneratorParams): {
  values: (string | number)[];
  meta: Record<string, unknown>;
} {
  setCurrentMode("shuffle");

  const { items = [], group_size: rawGroupSize } = params;
  const { items: cleaned } = normalizedItemsAndWeights(items);

  if (!cleaned.length) return { values: [], meta: {} };

  const shuffled = shuffleInPlace([...cleaned]);
  const values = shuffled;
  const groupSize = clampInt(rawGroupSize, 0, 1000, 0);
  const meta = { groupSize: groupSize > 0 ? groupSize : null };

  return { values, meta };
}
