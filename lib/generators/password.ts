/**
 * Password and PIN mode generators.
 * Generates secure passwords and PIN codes.
 */

import type { GeneratorParams } from "../types";
import { clampInt, removeChars, shuffleInPlace } from "../core/arrays";
import { randomIntInclusive, setCurrentMode } from "../core/samplers";

const CHARSETS = {
  numeric: "0123456789",
  hex: "0123456789ABCDEF",
  alphanumeric: "23456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz",
  strong:
    "23456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz!@#$%^&*()_+-=",
} as const;

const PASSWORD_SETS = {
  lower: "abcdefghijkmnpqrstuvwxyz",
  upper: "ABCDEFGHJKLMNPQRSTUVWXYZ",
  digits: "23456789",
  symbols: "!@#$%^&*()_+-=~[]{};:,.?",
} as const;

const AMBIGUOUS_CHARS = "0O1lI|`'\"\\,.:;";

export function generateDigit(params: GeneratorParams): { values: string[] } {
  setCurrentMode("digit");
  const { length = 4, pad_zero = true } = params;
  const safeLen = Math.max(1, Math.min(18, Math.floor(length)));

  // Avoid generating a single huge integer (would exceed JS safe integer range at ~16+ digits).
  // Generate digits directly to preserve exact length and uniform per-digit distribution.
  const digits = Array.from({ length: safeLen }, () =>
    String(randomIntInclusive(0, 9)),
  ).join("");

  const num = pad_zero ? digits : digits.replace(/^0+/, "") || "0";
  return {
    values: [num],
  };
}

export function generatePassword(params: GeneratorParams): {
  values: string[];
  meta: Record<string, unknown>;
  warnings: string[];
} {
  setCurrentMode("password");
  const {
    length = 12,
    charset = "strong",
    grouping = false,
    custom_charset,
    include_lower,
    include_upper,
    include_digits,
    include_symbols,
    exclude_ambiguous,
    exclude_chars,
    ensure_each,
    count: rawCount,
  } = params;
  const requestedLen =
    typeof length === "number" && Number.isFinite(length)
      ? Math.floor(length)
      : 12;
  const safeLen = Math.max(4, Math.min(256, Math.floor(length)));
  const batch = clampInt(rawCount, 1, 200, 1);

  const warningsSet = new Set<string>();
  const warn = (msg: string) => warningsSet.add(msg);

  const usePro =
    typeof include_lower === "boolean" ||
    typeof include_upper === "boolean" ||
    typeof include_digits === "boolean" ||
    typeof include_symbols === "boolean" ||
    typeof exclude_ambiguous === "boolean" ||
    typeof exclude_chars === "string" ||
    typeof ensure_each === "boolean";

  const generateOne = (): string => {
    if (!usePro) {
      const candidates =
        (typeof custom_charset === "string" && custom_charset.length > 0
          ? custom_charset
          : charset === "custom"
            ? ""
            : CHARSETS[charset]) || CHARSETS.strong;
      const chars = candidates.length > 0 ? candidates : CHARSETS.strong;

      const resultArr = Array.from({ length: safeLen }, () => {
        const idx = randomIntInclusive(0, chars.length - 1);
        return chars[idx]!;
      });
      let str = resultArr.join("");
      if (grouping && safeLen > 4) str = str.match(/.{1,4}/g)?.join("-") || str;
      return str;
    }

    const useLower = include_lower ?? true;
    const useUpper = include_upper ?? true;
    const useDigits = include_digits ?? true;
    const useSymbols = include_symbols ?? true;
    const groups: string[] = [];
    if (useLower) groups.push(PASSWORD_SETS.lower);
    if (useUpper) groups.push(PASSWORD_SETS.upper);
    if (useDigits) groups.push(PASSWORD_SETS.digits);
    if (useSymbols) groups.push(PASSWORD_SETS.symbols);
    if (groups.length === 0) groups.push(CHARSETS.strong);

    let pool = groups.join("");
    if (exclude_ambiguous) pool = removeChars(pool, AMBIGUOUS_CHARS);
    if (typeof exclude_chars === "string" && exclude_chars.length)
      pool = removeChars(pool, exclude_chars);
    if (!pool.length) {
      warn("All characters were excluded; falling back to strong charset.");
      pool = CHARSETS.strong;
    }

    const ensure = Boolean(ensure_each);
    const pieces: string[] = [];

    // If length is too short to include each selected set, warn and skip ensuring.
    // Use requestedLen in the message (even if we clamp to a higher safeLen).
    const ensureFeasible = safeLen >= groups.length;
    if (ensure && requestedLen < groups.length) {
      warn(`Length ${requestedLen} is too short to include each selected set.`);
    }
    if (ensure && ensureFeasible) {
      for (const g of groups) {
        let gg = g;
        if (exclude_ambiguous) gg = removeChars(gg, AMBIGUOUS_CHARS);
        if (typeof exclude_chars === "string" && exclude_chars.length)
          gg = removeChars(gg, exclude_chars);
        if (!gg.length) continue;
        const idx = randomIntInclusive(0, gg.length - 1);
        pieces.push(gg[idx]!);
      }
    }

    while (pieces.length < safeLen) {
      const idx = randomIntInclusive(0, pool.length - 1);
      pieces.push(pool[idx]!);
    }
    shuffleInPlace(pieces);

    let str = pieces.join("");
    if (grouping && safeLen > 4) str = str.match(/.{1,4}/g)?.join("-") || str;
    return str;
  };

  const values = Array.from({ length: batch }, generateOne);
  const meta = {
    password: {
      length: safeLen,
      batch,
    },
  };
  return { values, meta, warnings: Array.from(warningsSet) };
}
