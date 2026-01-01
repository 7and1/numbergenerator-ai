/**
 * Array manipulation utilities.
 * Provides functions for shuffling, character removal, and value utilities.
 */

import { randomIntInclusive } from "./samplers";

/**
 * Shuffle an array in place using Fisher-Yates algorithm.
 * @param arr - Array to shuffle
 * @returns The same array (shuffled in place)
 */
export const shuffleInPlace = <T>(arr: T[]): T[] => {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = randomIntInclusive(0, i);
    [arr[i], arr[j]] = [arr[j]!, arr[i]!];
  }
  return arr;
};

/**
 * Remove characters from a source string.
 * @param source - Source string
 * @param remove - Characters to remove
 * @returns Source string with specified characters removed
 */
export const removeChars = (source: string, remove: string) => {
  if (!remove) return source;
  const set = new Set(remove.split(""));
  return source
    .split("")
    .filter((c) => !set.has(c))
    .join("");
};

/**
 * Round a number to specified precision.
 * @param value - Value to round
 * @param precision - Number of decimal places
 * @returns Rounded value
 */
export const roundToPrecision = (value: number, precision: number): number => {
  if (!Number.isFinite(value)) return value;
  if (precision <= 0) return Math.round(value);
  return Number(value.toFixed(precision));
};

/**
 * Get a safe finite number with fallback.
 * @param value - Value to check
 * @param fallback - Fallback value if value is not a finite number
 * @returns The value or fallback
 */
export const safeFiniteNumber = (value: unknown, fallback: number): number => {
  return typeof value === "number" && Number.isFinite(value) ? value : fallback;
};

/**
 * Clamp an integer value between min and max with fallback.
 * @param value - Value to clamp
 * @param min - Minimum value
 * @param max - Maximum value
 * @param fallback - Fallback value if value is invalid
 * @returns Clamped integer value
 */
export const clampInt = (
  value: unknown,
  min: number,
  max: number,
  fallback: number,
): number => {
  const n =
    typeof value === "number" && Number.isFinite(value)
      ? Math.floor(value)
      : fallback;
  return Math.min(max, Math.max(min, n));
};

/**
 * Calculate the size of a range [min, max] with given step.
 * @param min - Range minimum
 * @param max - Range maximum
 * @param step - Step size
 * @returns Number of values in range, or 0 if invalid
 */
export const rangeSize = (min: number, max: number, step: number): number => {
  if (step <= 0) return 0;
  if (max < min) [min, max] = [max, min];
  const size = Math.floor((max - min) / step) + 1;
  return Number.isFinite(size) && size > 0 ? size : 0;
};

/**
 * Get the value at a given index in a range.
 * @param min - Range minimum
 * @param step - Step size
 * @param index - Index in the range
 * @returns Value at the index
 */
export const valueAtIndex = (min: number, step: number, index: number) =>
  min + index * step;

/**
 * Normalize items and weights, removing empty items and invalid weights.
 * @param items - Array of items to normalize
 * @param weights - Optional weights corresponding to items
 * @returns Normalized items and weights
 */
export const normalizedItemsAndWeights = (
  items: string[],
  weights?: number[],
) => {
  const cleaned: string[] = [];
  const cleanedWeights: number[] | undefined = Array.isArray(weights)
    ? []
    : undefined;

  for (let i = 0; i < items.length; i++) {
    const raw = items[i];
    const s = typeof raw === "string" ? raw.trim() : String(raw ?? "").trim();
    if (!s) continue;
    cleaned.push(s);
    if (cleanedWeights) {
      const w =
        typeof weights?.[i] === "number" && Number.isFinite(weights[i]!)
          ? weights[i]!
          : 1;
      cleanedWeights.push(w > 0 ? w : 0);
    }
  }

  const anyPositive = cleanedWeights
    ? cleanedWeights.some((w) => w > 0)
    : false;
  return {
    items: cleaned,
    weights: cleanedWeights && anyPositive ? cleanedWeights : undefined,
  };
};
