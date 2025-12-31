import type { GenerationResult, GeneratorParams } from "./types";

/**
 * Runtime validation utilities for localStorage data.
 * Prevents runtime errors from corrupted or malicious data.
 */

/**
 * Validates if a value is a plain object (not null, not array, not Date, etc.)
 */
export const isPlainObject = (
  value: unknown,
): value is Record<string, unknown> => {
  return (
    Boolean(value) &&
    typeof value === "object" &&
    Object.getPrototypeOf(value) === Object.prototype
  );
};

/**
 * Validates if a value is a non-empty string
 */
export const isNonEmptyString = (value: unknown): value is string => {
  return typeof value === "string" && value.length > 0;
};

/**
 * Validates if a value is a finite number
 */
export const isFiniteNumber = (value: unknown): value is number => {
  return typeof value === "number" && Number.isFinite(value);
};

/**
 * Validates if a value is an array
 */
export const isArray = (value: unknown): value is unknown[] => {
  return Array.isArray(value);
};

/**
 * Validates if a value is a boolean
 */
export const isBoolean = (value: unknown): value is boolean => {
  return typeof value === "boolean";
};

/**
 * Validates GeneratorParams structure
 * Ensures all values are of expected types to prevent runtime errors
 */
export const validateGeneratorParams = (
  value: unknown,
): GeneratorParams | null => {
  if (!isPlainObject(value)) return null;

  const params: GeneratorParams = {};

  // Validate numeric properties
  const numericKeys: Array<keyof GeneratorParams> = [
    "min",
    "max",
    "step",
    "precision",
    "count",
    "length",
    "dice_sides",
    "dice_rolls",
    "dice_modifier",
    "coin_flips",
    "group_size",
  ];
  for (const key of numericKeys) {
    if (key in value && isFiniteNumber(value[key])) {
      (params as Record<string, unknown>)[key] = value[key] as number;
    }
  }

  // Validate boolean properties
  const booleanKeys: Array<keyof GeneratorParams> = [
    "unique",
    "sort",
    "pad_zero",
    "grouping",
    "include_lower",
    "include_upper",
    "include_digits",
    "include_symbols",
    "exclude_ambiguous",
    "ensure_each",
  ];
  for (const key of booleanKeys) {
    if (key in value) {
      const v = value[key];
      if (isBoolean(v) || v === "true" || v === "false" || v === 1 || v === 0) {
        (params as Record<string, unknown>)[key] =
          v === true || v === "true" || v === 1;
      }
    }
  }

  // Validate string properties (excluding those with special validation)
  const stringKeys: Array<keyof GeneratorParams> = [
    "custom_charset",
    "exclude_chars",
    "ticket_source",
  ];
  for (const key of stringKeys) {
    if (key in value && isNonEmptyString(value[key])) {
      (params as Record<string, unknown>)[key] = value[key] as string;
    }
  }

  // Validate sort specific values
  if ("sort" in value) {
    const v = value.sort;
    if (v === "asc" || v === "desc") {
      params.sort = v;
    }
  }

  // Validate dice_adv specific values
  if ("dice_adv" in value) {
    const v = value.dice_adv;
    if (v === "none" || v === "advantage" || v === "disadvantage") {
      params.dice_adv = v;
    }
  }

  // Validate charset specific values
  if ("charset" in value) {
    const v = value.charset;
    if (
      ["numeric", "hex", "alphanumeric", "strong", "custom"].includes(
        v as string,
      )
    ) {
      params.charset = v as GeneratorParams["charset"];
    }
  }

  // Validate pool_a object
  if ("pool_a" in value && isPlainObject(value.pool_a)) {
    const pool = value.pool_a;
    if (
      isFiniteNumber(pool.min) &&
      isFiniteNumber(pool.max) &&
      isFiniteNumber(pool.pick)
    ) {
      params.pool_a = {
        min: pool.min,
        max: pool.max,
        pick: pool.pick,
      };
    }
  }

  // Validate pool_b object
  if ("pool_b" in value && isPlainObject(value.pool_b)) {
    const pool = value.pool_b;
    if (
      isFiniteNumber(pool.min) &&
      isFiniteNumber(pool.max) &&
      isFiniteNumber(pool.pick)
    ) {
      params.pool_b = {
        min: pool.min,
        max: pool.max,
        pick: pool.pick,
      };
    }
  }

  // Validate items array
  if ("items" in value && isArray(value.items)) {
    const items = value.items
      .filter((item) => isNonEmptyString(item))
      .map((item) => String(item).trim())
      .filter((s) => s.length > 0);
    if (items.length > 0) {
      params.items = items;
    }
  }

  // Validate weights array
  if ("weights" in value && isArray(value.weights)) {
    const weights = value.weights
      .filter(isFiniteNumber)
      .map((n) => Math.max(0, n));
    if (weights.length > 0) {
      params.weights = weights;
    }
  }

  // Validate dice_custom_faces array
  if ("dice_custom_faces" in value && isArray(value.dice_custom_faces)) {
    const faces = value.dice_custom_faces
      .filter((item) => item !== null && item !== undefined && item !== "")
      .map((item) => String(item));
    if (faces.length >= 2) {
      params.dice_custom_faces = faces;
    }
  }

  // Validate coin_labels tuple
  if (
    "coin_labels" in value &&
    isArray(value.coin_labels) &&
    value.coin_labels.length >= 2
  ) {
    const labels = value.coin_labels
      .slice(0, 2)
      .filter(isNonEmptyString)
      .map((s) => String(s));
    if (labels.length === 2) {
      params.coin_labels = [labels[0]!, labels[1]!];
    }
  }

  // Validate ticket_remaining array
  if ("ticket_remaining" in value && isArray(value.ticket_remaining)) {
    const remaining = value.ticket_remaining
      .filter((item) => isNonEmptyString(item) || isFiniteNumber(item))
      .map((item) => String(item));
    if (remaining.length > 0) {
      params.ticket_remaining = remaining;
    }
  }

  return params;
};

/**
 * Validates history array
 * Ensures all elements are non-empty strings with reasonable length
 */
export const validateHistoryArray = (
  value: unknown,
  maxLength = 50,
): string[] => {
  if (!isArray(value)) return [];

  return value
    .filter(isNonEmptyString)
    .map((s) => String(s).trim().slice(0, 200)) // Limit each entry length
    .filter((s) => s.length > 0)
    .slice(0, maxLength);
};

/**
 * Validates ticket log entry
 */
export const validateTicketLogEntry = (
  value: unknown,
): { timestamp: number; values: (string | number)[] } | null => {
  if (!isPlainObject(value)) return null;

  const timestamp = isFiniteNumber(value.timestamp)
    ? value.timestamp
    : Date.now();

  if (!isArray(value.values) && !isArray(value.timestamp)) {
    // Legacy format check
    return null;
  }

  const valuesArray = isArray(value.values) ? value.values : [];

  const values = valuesArray
    .filter((item) => isNonEmptyString(item) || isFiniteNumber(item))
    .map((item) => (typeof item === "string" ? item.trim() : item))
    .filter((item) => item !== "" && item !== null && item !== undefined);

  if (values.length === 0) return null;

  return { timestamp, values };
};

/**
 * Validates ticket log array
 */
export const validateTicketLog = (
  value: unknown,
  maxEntries = 500,
): Array<{ timestamp: number; values: (string | number)[] }> => {
  if (!isArray(value)) return [];

  return value
    .map(validateTicketLogEntry)
    .filter((entry): entry is NonNullable<typeof entry> => entry !== null)
    .slice(0, maxEntries);
};

/**
 * Validates GenerationResult
 */
export const validateGenerationResult = (
  value: unknown,
): GenerationResult | null => {
  if (!isPlainObject(value)) return null;

  const values = isArray(value.values)
    ? value.values.filter(
        (item) => isNonEmptyString(item) || isFiniteNumber(item),
      )
    : [];

  if (values.length === 0) return null;

  const result: GenerationResult = {
    values,
    bonus_values: undefined,
    formatted: isNonEmptyString(value.formatted)
      ? String(value.formatted).slice(0, 10000)
      : "",
    timestamp: isFiniteNumber(value.timestamp) ? value.timestamp : Date.now(),
  };

  if (isArray(value.bonus_values) && value.bonus_values.length > 0) {
    result.bonus_values = value.bonus_values.filter(
      (item) => isNonEmptyString(item) || isFiniteNumber(item),
    );
  }

  if (isArray(value.warnings) && value.warnings.length > 0) {
    result.warnings = value.warnings.filter(isNonEmptyString).slice(0, 10);
  }

  if (isPlainObject(value.meta)) {
    result.meta = value.meta;
  }

  return result;
};

/**
 * Safe JSON parser with validation
 */
export const safeParseAndValidate = <T>(
  raw: string | null,
  validator: (value: unknown) => T | null,
  fallback: T,
): T => {
  if (!raw) return fallback;

  try {
    const parsed = JSON.parse(raw);
    const validated = validator(parsed);
    return validated ?? fallback;
  } catch {
    return fallback;
  }
};
