/**
 * Sampling and random selection utilities.
 * Provides functions for random integer generation, unique sampling,
 * and weighted selection.
 */

import type { GeneratorMode } from "../types";
import { SECURE_MODE, getCrypto, getCryptoOptional } from "./crypto";

/**
 * Current execution context for security-sensitive operations.
 * This is set at the start of generate() to track which mode is active.
 */
let currentMode: GeneratorMode = "range";

/**
 * Set the current generator mode for security context.
 * Exported so the main generate function can update this.
 */
export function setCurrentMode(mode: GeneratorMode): void {
  currentMode = mode;
}

/**
 * Generate a cryptographically secure random 32-bit integer.
 * For password and PIN modes, this will throw an error if crypto is unavailable.
 * For other modes, it falls back to Math.random() for compatibility.
 */
export const randomUint32 = (): number => {
  // For security-sensitive modes, require crypto
  if (
    (currentMode === "password" || currentMode === "digit") &&
    SECURE_MODE === "SECURE"
  ) {
    const crypto = getCrypto();
    const array = new Uint32Array(1);
    crypto.getRandomValues(array);
    return array[0]!;
  }

  // For non-security modes or BEST_EFFORT mode, use optional crypto
  const crypto = getCryptoOptional();
  if (crypto) {
    const array = new Uint32Array(1);
    crypto.getRandomValues(array);
    return array[0]!;
  }
  return Math.floor(Math.random() * 0x1_0000_0000);
};

/**
 * Generate a random integer in [0, 2^53).
 * Uses two Uint32 draws to build a 53-bit integer (safe integer range).
 */
export const randomUint53 = (): number => {
  // 21 high bits + 32 low bits = 53 bits
  const hi = randomUint32() & 0x1f_ffff;
  const lo = randomUint32();
  return hi * 0x1_0000_0000 + lo;
};

/**
 * Generate a random integer in the inclusive range [min, max].
 * Uses rejection sampling for uniform distribution.
 * @throws {Error} If min/max are not finite integers or range is invalid
 */
export const randomIntInclusive = (min: number, max: number): number => {
  if (!Number.isFinite(min) || !Number.isFinite(max)) {
    throw new Error("randomIntInclusive: min/max must be finite numbers");
  }
  if (!Number.isInteger(min) || !Number.isInteger(max)) {
    throw new Error("randomIntInclusive: min/max must be integers");
  }
  if (max < min) [min, max] = [max, min];

  const range = max - min + 1;
  if (range <= 0) throw new Error("randomIntInclusive: invalid range");

  // Fast-path for ranges that fit in uint32 space.
  if (range <= 0x1_0000_0000) {
    const limit = Math.floor(0x1_0000_0000 / range) * range;
    while (true) {
      const x = randomUint32();
      if (x < limit) return min + (x % range);
    }
  }

  // Larger ranges (e.g., milliseconds across years) need >32-bit sampling.
  // Use 53-bit rejection sampling within JS safe integer space.
  const MAX_SPACE = 0x20_0000_0000_0000; // 2^53
  if (range > Number.MAX_SAFE_INTEGER) {
    throw new Error("randomIntInclusive: range exceeds MAX_SAFE_INTEGER");
  }
  const limit = Math.floor(MAX_SPACE / range) * range;
  while (true) {
    const x = randomUint53();
    if (x < limit) return min + (x % range);
  }
};

/**
 * Sample k unique indices from a population of size n.
 * Uses Floyd's algorithm: O(k) time, O(k) memory, no population array needed.
 *
 * @param populationSize - Size of the population to sample from (n)
 * @param sampleSize - Number of unique samples to draw (k)
 * @returns Array of k unique indices in range [0, populationSize)
 */
export const sampleUniqueIndices = (
  populationSize: number,
  sampleSize: number,
): number[] => {
  const result = new Set<number>();
  for (let j = populationSize - sampleSize; j < populationSize; j++) {
    const t = randomIntInclusive(0, j);
    if (result.has(t)) result.add(j);
    else result.add(t);
  }
  return Array.from(result);
};

/**
 * Select an index based on weighted probabilities.
 * Uses integer roulette wheel selection in uint32 space.
 *
 * @param weights - Array of non-negative weights
 * @returns Selected index
 */
export const weightedPickIndex = (weights: number[]): number => {
  if (weights.length === 0) return -1;
  let total = 0;
  for (const w of weights) total += w > 0 && Number.isFinite(w) ? w : 0;
  if (total <= 0) return randomIntInclusive(0, weights.length - 1);

  const r = (randomUint32() / 0x1_0000_0000) * total;
  let acc = 0;
  for (let i = 0; i < weights.length; i++) {
    const w = weights[i]!;
    acc += w > 0 && Number.isFinite(w) ? w : 0;
    if (r < acc) return i;
  }
  return weights.length - 1;
};

/**
 * Sample k unique indices based on weights using Efraimidis-Spirakis algorithm.
 * Uses key = -ln(U)/w, takes k smallest keys.
 * Complexity: O(n log k) with partial sort.
 *
 * @param weights - Array of non-negative weights
 * @param k - Number of samples to draw
 * @returns Array of k unique indices
 */
export const weightedSampleWithoutReplacementIndices = (
  weights: number[],
  k: number,
): number[] => {
  const candidates: Array<{ idx: number; key: number }> = [];
  for (let i = 0; i < weights.length; i++) {
    const w = weights[i]!;
    if (!(w > 0) || !Number.isFinite(w)) continue;
    const u = (randomUint32() + 1) / (0x1_0000_0000 + 1);
    const key = -Math.log(u) / w;
    candidates.push({ idx: i, key });
  }
  if (candidates.length <= k) return candidates.map((c) => c.idx);

  candidates.sort((a, b) => a.key - b.key);
  return candidates.slice(0, k).map((c) => c.idx);
};
