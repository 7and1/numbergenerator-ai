import type { GenerationResult, GeneratorMode, GeneratorParams } from "./types";

const CHARSETS = {
  numeric: "0123456789",
  hex: "0123456789ABCDEF",
  alphanumeric: "23456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz", // 去除易混淆字符
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

/**
 * Security modes for password/PIN generation
 * - SECURE: Requires crypto API, throws error if unavailable
 * - BEST_EFFORT: Falls back to Math.random() if crypto unavailable
 */
export type SecurityMode = "SECURE" | "BEST_EFFORT";

/**
 * Global security mode setting. Set to "SECURE" for password/PIN generation.
 * This prevents insecure fallback to Math.random() for security-sensitive operations.
 */
export const SECURE_MODE: SecurityMode = "SECURE";

const getCrypto = (): Crypto => {
  const c = (globalThis as unknown as { crypto?: Crypto }).crypto;
  if (c && typeof c.getRandomValues === "function") return c as Crypto;
  throw new Error(
    "Secure random number generator not available. " +
      "Please use a modern browser with Web Crypto API support.",
  );
};

/**
 * Get crypto with fallback support for non-security-critical operations.
 * Used for modes like 'range', 'lottery', 'list', etc. where predictability
 * is less critical than for passwords and PINs.
 */
const getCryptoOptional = (): Crypto | undefined => {
  const c = (globalThis as unknown as { crypto?: Crypto }).crypto;
  if (c && typeof c.getRandomValues === "function") return c as Crypto;
  return undefined;
};

/**
 * Current execution context for security-sensitive operations.
 * This is set at the start of generate() to track which mode is active.
 */
let currentMode: GeneratorMode = "range";

/**
 * Generate a cryptographically secure random 32-bit integer.
 * For password and PIN modes, this will throw an error if crypto is unavailable.
 * For other modes, it falls back to Math.random() for compatibility.
 */
const randomUint32 = (): number => {
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

const randomIntInclusive = (min: number, max: number): number => {
  if (!Number.isFinite(min) || !Number.isFinite(max)) {
    throw new Error("randomIntInclusive: min/max must be finite numbers");
  }
  if (!Number.isInteger(min) || !Number.isInteger(max)) {
    throw new Error("randomIntInclusive: min/max must be integers");
  }
  if (max < min) [min, max] = [max, min];

  const range = max - min + 1;
  if (range <= 0) throw new Error("randomIntInclusive: invalid range");

  const limit = Math.floor(0x1_0000_0000 / range) * range;
  while (true) {
    const x = randomUint32();
    if (x < limit) return min + (x % range);
  }
};

const roundToPrecision = (value: number, precision: number): number => {
  if (!Number.isFinite(value)) return value;
  if (precision <= 0) return Math.round(value);
  return Number(value.toFixed(precision));
};

const safeFiniteNumber = (value: unknown, fallback: number): number => {
  return typeof value === "number" && Number.isFinite(value) ? value : fallback;
};

const clampInt = (
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

const rangeSize = (min: number, max: number, step: number): number => {
  if (step <= 0) return 0;
  if (max < min) [min, max] = [max, min];
  const size = Math.floor((max - min) / step) + 1;
  return Number.isFinite(size) && size > 0 ? size : 0;
};

const valueAtIndex = (min: number, step: number, index: number) =>
  min + index * step;

const sampleUniqueIndices = (
  populationSize: number,
  sampleSize: number,
): number[] => {
  // Floyd's algorithm: O(k) time, O(k) memory, no population array needed.
  const result = new Set<number>();
  for (let j = populationSize - sampleSize; j < populationSize; j++) {
    const t = randomIntInclusive(0, j);
    if (result.has(t)) result.add(j);
    else result.add(t);
  }
  return Array.from(result);
};

const shuffleInPlace = <T>(arr: T[]): T[] => {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = randomIntInclusive(0, i);
    [arr[i], arr[j]] = [arr[j]!, arr[i]!];
  }
  return arr;
};

const normalizedItemsAndWeights = (items: string[], weights?: number[]) => {
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

const weightedPickIndex = (weights: number[]): number => {
  let total = 0;
  for (const w of weights) total += w > 0 && Number.isFinite(w) ? w : 0;
  if (total <= 0) return randomIntInclusive(0, weights.length - 1);

  // Use integer roulette in uint32 space to avoid float edge issues for large totals.
  const r = (randomUint32() / 0x1_0000_0000) * total;
  let acc = 0;
  for (let i = 0; i < weights.length; i++) {
    const w = weights[i]!;
    acc += w > 0 && Number.isFinite(w) ? w : 0;
    if (r < acc) return i;
  }
  return weights.length - 1;
};

const weightedSampleWithoutReplacementIndices = (
  weights: number[],
  k: number,
): number[] => {
  // Efraimidis–Spirakis: key = -ln(U)/w, take k smallest.
  // Complexity: O(n log k) with partial sort.
  const candidates: Array<{ idx: number; key: number }> = [];
  for (let i = 0; i < weights.length; i++) {
    const w = weights[i]!;
    if (!(w > 0) || !Number.isFinite(w)) continue;
    const u = (randomUint32() + 1) / (0x1_0000_0000 + 1); // (0,1)
    const key = -Math.log(u) / w;
    candidates.push({ idx: i, key });
  }
  if (candidates.length <= k) return candidates.map((c) => c.idx);

  candidates.sort((a, b) => a.key - b.key);
  return candidates.slice(0, k).map((c) => c.idx);
};

const removeChars = (source: string, remove: string) => {
  if (!remove) return source;
  const set = new Set(remove.split(""));
  return source
    .split("")
    .filter((c) => !set.has(c))
    .join("");
};

export const generate = (
  mode: GeneratorMode,
  params: GeneratorParams,
): GenerationResult => {
  // Set the current mode for security context
  currentMode = mode;

  let values: (string | number)[] = [];
  let bonus_values: (string | number)[] = [];
  const warnings: string[] = [];
  let meta: Record<string, unknown> | undefined;

  switch (mode) {
    case "range": {
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
      if (size <= 0) break;

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
      break;
    }

    case "digit": {
      const { length = 4, pad_zero = true } = params;
      const safeLen = Math.max(1, Math.min(18, Math.floor(length)));
      const maxVal = 10 ** safeLen - 1;
      const num = randomIntInclusive(0, maxVal);
      values = [pad_zero ? String(num).padStart(safeLen, "0") : String(num)];
      break;
    }

    case "password": {
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
      const safeLen = Math.max(4, Math.min(256, Math.floor(length)));
      const batch = clampInt(rawCount, 1, 200, 1);

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
          if (grouping && safeLen > 4)
            str = str.match(/.{1,4}/g)?.join("-") || str;
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
          warnings.push(
            "All characters were excluded; falling back to strong charset.",
          );
          pool = CHARSETS.strong;
        }

        const ensure = Boolean(ensure_each);
        const pieces: string[] = [];
        if (ensure) {
          if (safeLen < groups.length) {
            warnings.push(
              `Length ${safeLen} is too short to include each selected set.`,
            );
          } else {
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
        }

        while (pieces.length < safeLen) {
          const idx = randomIntInclusive(0, pool.length - 1);
          pieces.push(pool[idx]!);
        }
        shuffleInPlace(pieces);

        let str = pieces.join("");
        if (grouping && safeLen > 4)
          str = str.match(/.{1,4}/g)?.join("-") || str;
        return str;
      };

      values = Array.from({ length: batch }, generateOne);
      meta = {
        password: {
          length: safeLen,
          batch,
        },
      };
      break;
    }

    case "lottery": {
      const { pool_a, pool_b } = params;

      if (pool_a) {
        const min = safeFiniteNumber(pool_a.min, 1);
        const max = safeFiniteNumber(pool_a.max, 1);
        const pick = clampInt(pool_a.pick, 0, 1_000, 0);
        const size = rangeSize(min, max, 1);
        if (size > 0 && pick > 0) {
          const indices =
            pick <= size
              ? sampleUniqueIndices(size, pick)
              : Array.from({ length: pick }, () =>
                  randomIntInclusive(0, size - 1),
                );
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
              : Array.from({ length: pick }, () =>
                  randomIntInclusive(0, size - 1),
                );
          bonus_values = indices
            .map((idx) => Math.round(valueAtIndex(Math.min(min, max), 1, idx)))
            .sort((a, b) => a - b);
        }
      }
      break;
    }

    case "list": {
      const {
        items = [],
        weights,
        count: rawCount,
        unique: rawUnique,
      } = params;
      const { items: cleaned, weights: cleanedWeights } =
        normalizedItemsAndWeights(items, weights);
      if (!cleaned.length) break;

      const safeCount = clampInt(rawCount, 1, 5_000, 1);
      const unique = Boolean(rawUnique);

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
      break;
    }

    case "shuffle": {
      const { items = [], group_size: rawGroupSize } = params;
      const { items: cleaned } = normalizedItemsAndWeights(items);
      if (!cleaned.length) break;
      const shuffled = shuffleInPlace([...cleaned]);
      values = shuffled;
      const groupSize = clampInt(rawGroupSize, 0, 1000, 0);
      meta = { groupSize: groupSize > 0 ? groupSize : null };
      break;
    }

    case "dice": {
      const {
        dice_sides,
        dice_rolls,
        dice_adv,
        dice_custom_faces,
        dice_modifier,
      } = params;
      const rolls = clampInt(dice_rolls, 1, 2_000, 1);
      const modifier = safeFiniteNumber(dice_modifier, 0);
      const adv = dice_adv ?? "none";

      if (Array.isArray(dice_custom_faces) && dice_custom_faces.length >= 2) {
        const faces = dice_custom_faces.map((f) => String(f));
        const indices: number[] = [];
        values = Array.from({ length: rolls }, () => {
          const idx = randomIntInclusive(0, faces.length - 1);
          indices.push(idx);
          return faces[idx]!;
        });
        meta = { faces: faces.length, selectedIndices: indices };
        break;
      }

      const sides = clampInt(dice_sides, 2, 10_000, 6);

      if (
        (adv === "advantage" || adv === "disadvantage") &&
        sides === 20 &&
        rolls === 1
      ) {
        const a = randomIntInclusive(1, 20);
        const b = randomIntInclusive(1, 20);
        const kept = adv === "advantage" ? Math.max(a, b) : Math.min(a, b);
        const dropped = kept === a ? b : a;
        const keptWithMod = kept + modifier;
        values = [keptWithMod];
        bonus_values = [dropped + modifier];
        meta = { d20: { a, b, kept, dropped, modifier, mode: adv } };
        break;
      }

      const numericRolls: number[] = Array.from({ length: rolls }, () =>
        randomIntInclusive(1, sides),
      );
      const withMod = modifier
        ? numericRolls.map((n) => n + modifier)
        : numericRolls;
      values = withMod;
      const total = withMod.reduce((acc, n) => acc + n, 0);
      meta = { sides, rolls, modifier, total, raw: numericRolls };
      break;
    }

    case "coin": {
      const flips = clampInt(params.coin_flips ?? params.count, 1, 10_000, 1);
      const labels =
        params.coin_labels ??
        (Array.isArray(params.items) && params.items.length >= 2
          ? [String(params.items[0]), String(params.items[1])]
          : ["HEADS", "TAILS"]);
      const [headsLabel, tailsLabel] = labels;
      const sequence: string[] = [];
      let heads = 0;
      let tails = 0;
      let longest = 0;
      let longestSide: string | null = null;
      let current = 0;
      let currentSide: string | null = null;

      for (let i = 0; i < flips; i++) {
        const isHeads = randomIntInclusive(0, 1) === 0;
        const side = isHeads ? headsLabel : tailsLabel;
        sequence.push(side);
        if (isHeads) heads++;
        else tails++;

        if (currentSide === side) current++;
        else {
          currentSide = side;
          current = 1;
        }
        if (current > longest) {
          longest = current;
          longestSide = currentSide;
        }
      }

      values = sequence;
      meta = {
        flips,
        heads,
        tails,
        longestStreak: { length: longest, side: longestSide },
      };
      break;
    }

    case "ticket": {
      const source = params.ticket_source ?? "range";
      const draw = clampInt(params.count ?? params.pick, 1, 5_000, 1);
      let pool: string[] = [];

      if (source === "list") {
        const { items: cleaned } = normalizedItemsAndWeights(
          params.items ?? [],
        );
        pool = cleaned;
      } else {
        let min = safeFiniteNumber(params.min, 1);
        let max = safeFiniteNumber(params.max, 100);
        if (max < min) [min, max] = [max, min];
        const size = rangeSize(min, max, 1);
        pool = Array.from({ length: size }, (_, i) =>
          String(Math.round(valueAtIndex(min, 1, i))),
        );
      }

      const remaining =
        Array.isArray(params.ticket_remaining) && params.ticket_remaining.length
          ? params.ticket_remaining
          : pool;
      if (!remaining.length) break;

      const k = Math.min(draw, remaining.length);
      if (draw > remaining.length)
        warnings.push(`Only ${remaining.length} tickets left; drawing ${k}.`);

      const indices = sampleUniqueIndices(remaining.length, k);
      const drawn = shuffleInPlace(indices.map((i) => remaining[i]!));
      const drawnSet = new Set(indices);
      const nextRemaining = remaining.filter((_, i) => !drawnSet.has(i));

      values = drawn;
      meta = {
        remainingCount: nextRemaining.length,
        ticket_remaining: nextRemaining,
      };
      break;
    }

    case "uuid": {
      const count = clampInt(params.count, 1, 10_000, 1);
      const uppercase = Boolean(params.uuid_uppercase);
      const withHyphens = params.uuid_hyphens !== false; // default true

      const generateUUID = (): string => {
        // UUID v4: xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx
        // where x is random 4 bits, y is random 4 bits with top bits set to 01xx (8, 9, A, or B)
        const bytes = new Uint8Array(16);
        const crypto = getCryptoOptional();
        if (crypto) {
          crypto.getRandomValues(bytes);
        } else {
          for (let i = 0; i < 16; i++) bytes[i] = randomIntInclusive(0, 255);
        }

        // Set version bits (4)
        bytes[6] = (bytes[6]! & 0x0f) | 0x40;
        // Set variant bits (8, 9, A, or B)
        bytes[8] = (bytes[8]! & 0x3f) | 0x80;

        const hex = uppercase ? "0123456789ABCDEF" : "0123456789abcdef";
        const toHex = (b: number) => hex[(b >> 4) & 0xf] + hex[b & 0xf];

        if (withHyphens) {
          return (
            toHex(bytes[0]!) +
            toHex(bytes[1]!) +
            toHex(bytes[2]!) +
            toHex(bytes[3]!) +
            "-" +
            toHex(bytes[4]!) +
            toHex(bytes[5]!) +
            "-" +
            toHex(bytes[6]!) +
            toHex(bytes[7]!) +
            "-" +
            toHex(bytes[8]!) +
            toHex(bytes[9]!) +
            "-" +
            toHex(bytes[10]!) +
            toHex(bytes[11]!) +
            toHex(bytes[12]!) +
            toHex(bytes[13]!) +
            toHex(bytes[14]!) +
            toHex(bytes[15]!)
          );
        } else {
          return (
            toHex(bytes[0]!) +
            toHex(bytes[1]!) +
            toHex(bytes[2]!) +
            toHex(bytes[3]!) +
            toHex(bytes[4]!) +
            toHex(bytes[5]!) +
            toHex(bytes[6]!) +
            toHex(bytes[7]!) +
            toHex(bytes[8]!) +
            toHex(bytes[9]!) +
            toHex(bytes[10]!) +
            toHex(bytes[11]!) +
            toHex(bytes[12]!) +
            toHex(bytes[13]!) +
            toHex(bytes[14]!) +
            toHex(bytes[15]!)
          );
        }
      };

      values = Array.from({ length: count }, generateUUID);
      break;
    }

    case "color": {
      const count = clampInt(params.count, 1, 10_000, 1);
      const format = params.color_format ?? "hex";

      const generateColor = (): string => {
        const r = randomIntInclusive(0, 255);
        const g = randomIntInclusive(0, 255);
        const b = randomIntInclusive(0, 255);

        switch (format) {
          case "rgb": {
            return `rgb(${r}, ${g}, ${b})`;
          }
          case "hsl": {
            // Convert RGB to HSL
            const rn = r / 255;
            const gn = g / 255;
            const bn = b / 255;
            const max = Math.max(rn, gn, bn);
            const min = Math.min(rn, gn, bn);
            let h = 0;
            let s = 0;
            const l = (max + min) / 2;

            if (max !== min) {
              const d = max - min;
              s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
              switch (max) {
                case rn:
                  h = ((gn - bn) / d + (gn < bn ? 6 : 0)) / 6;
                  break;
                case gn:
                  h = ((bn - rn) / d + 2) / 6;
                  break;
                case bn:
                  h = ((rn - gn) / d + 4) / 6;
                  break;
              }
            }
            return `hsl(${Math.round(h * 360)}, ${Math.round(s * 100)}%, ${Math.round(l * 100)}%)`;
          }
          case "hex":
          default: {
            const toHex = (n: number) =>
              (n < 16 ? "0" : "") + n.toString(16).toUpperCase();
            return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
          }
        }
      };

      values = Array.from({ length: count }, generateColor);
      meta = { format };
      break;
    }

    case "hex": {
      const count = clampInt(params.count, 1, 10_000, 1);
      const bytes = clampInt(params.hex_bytes, 1, 1024, 4); // default 4 bytes = 8 hex chars
      const withPrefix = Boolean(params.hex_prefix);
      const uppercase = true; // hex is typically uppercase

      const generateHex = (): string => {
        const byteCount = Math.max(1, bytes);
        const arr = new Uint8Array(byteCount);
        const crypto = getCryptoOptional();
        if (crypto) {
          crypto.getRandomValues(arr);
        } else {
          for (let i = 0; i < byteCount; i++)
            arr[i] = randomIntInclusive(0, 255);
        }

        const hex = uppercase ? "0123456789ABCDEF" : "0123456789abcdef";
        let result = "";
        for (let i = 0; i < byteCount; i++) {
          const b = arr[i]!;
          result += hex[(b >> 4) & 0xf] + hex[b & 0xf];
        }

        return withPrefix ? "0x" + result : result;
      };

      values = Array.from({ length: count }, generateHex);
      meta = { bytes };
      break;
    }

    case "timestamp": {
      const count = clampInt(params.count, 1, 10_000, 1);
      const format = params.timestamp_format ?? "unix";
      const defaultStart = Math.floor(Date.now() / 1000) - 31536000; // 1 year ago
      const defaultEnd = Math.floor(Date.now() / 1000) + 31536000; // 1 year ahead
      const start = safeFiniteNumber(params.timestamp_start, defaultStart);
      const end = safeFiniteNumber(params.timestamp_end, defaultEnd);

      const [minTs, maxTs] = start <= end ? [start, end] : [end, start];

      const generateTimestamp = (): string => {
        // Generate random timestamp in range
        const range = maxTs - minTs;
        const ts = minTs + (range > 0 ? randomIntInclusive(0, range) : 0);

        switch (format) {
          case "unix-ms":
            return String(ts * 1000 + randomIntInclusive(0, 999));
          case "iso":
            return new Date(ts * 1000).toISOString();
          case "unix":
          default:
            return String(ts);
        }
      };

      values = Array.from({ length: count }, generateTimestamp);
      meta = { format, range: { start: minTs, end: maxTs } };
      break;
    }

    case "coordinates": {
      const count = clampInt(params.count, 1, 10_000, 1);
      const format = params.coord_format ?? "decimal";
      const latMin = safeFiniteNumber(params.lat_min, -90);
      const latMax = safeFiniteNumber(params.lat_max, 90);
      const lngMin = safeFiniteNumber(params.lng_min, -180);
      const lngMax = safeFiniteNumber(params.lng_max, 180);

      const [minLat, maxLat] =
        latMin <= latMax ? [latMin, latMax] : [latMax, latMin];
      const [minLng, maxLng] =
        lngMin <= lngMax ? [lngMin, lngMax] : [lngMax, lngMin];

      const toDMS = (decimal: number, isLat: boolean): string => {
        const dir = isLat
          ? decimal >= 0
            ? "N"
            : "S"
          : decimal >= 0
            ? "E"
            : "W";
        const abs = Math.abs(decimal);
        const deg = Math.floor(abs);
        const min = Math.floor((abs - deg) * 60);
        const sec = Math.round(((abs - deg) * 60 - min) * 60 * 100) / 100;
        return `${deg}°${min}'${sec.toFixed(2)}"${dir}`;
      };

      const generateCoordinates = (): string => {
        // Generate lat/lng with 6 decimal precision
        const lat =
          minLat +
          (maxLat - minLat) * (randomIntInclusive(0, 1_000_000) / 1_000_000);
        const lng =
          minLng +
          (maxLng - minLng) * (randomIntInclusive(0, 1_000_000) / 1_000_000);

        switch (format) {
          case "dms":
            return `${toDMS(lat, true)}, ${toDMS(lng, false)}`;
          case "decimal":
          default:
            return `${lat.toFixed(6)}, ${lng.toFixed(6)}`;
        }
      };

      values = Array.from({ length: count }, generateCoordinates);
      meta = { latRange: [minLat, maxLat], lngRange: [minLng, maxLng], format };
      break;
    }

    case "ipv4": {
      const count = clampInt(params.count, 1, 10_000, 1);
      const includePrivate = Boolean(params.ipv4_private);
      const includeReserved = Boolean(params.ipv4_reserved);

      // Private ranges: 10.0.0.0/8, 172.16.0.0/12, 192.168.0.0/16, 169.254.0.0/16
      const isPrivate = (a: number, b: number): boolean => {
        return (
          a === 10 ||
          (a === 172 && b >= 16 && b <= 31) ||
          (a === 192 && b === 168) ||
          (a === 169 && b === 254)
        );
      };

      // Reserved ranges: 0.0.0.0/8, 127.0.0.0/8, 224.0.0.0/4, etc.
      const isReserved = (a: number): boolean => {
        return a === 0 || a === 127 || a >= 224;
      };

      const generateIPv4 = (): string => {
        let a: number, b: number, c: number, d: number;
        let attempts = 0;

        do {
          a = randomIntInclusive(1, 223);
          b = randomIntInclusive(0, 255);
          c = randomIntInclusive(0, 255);
          d = randomIntInclusive(1, 254);
          attempts++;
        } while (
          attempts < 100 &&
          ((!includePrivate && isPrivate(a, b)) ||
            (!includeReserved && isReserved(a)))
        );

        return `${a}.${b}.${c}.${d}`;
      };

      values = Array.from({ length: count }, generateIPv4);
      meta = { includePrivate, includeReserved };
      break;
    }

    case "mac": {
      const count = clampInt(params.count, 1, 10_000, 1);
      const separator = params.mac_separator ?? ":";
      const upperCase = params.mac_case !== "lower";

      const generateMAC = (): string => {
        const hex = upperCase ? "0123456789ABCDEF" : "0123456789abcdef";
        let result = "";
        for (let i = 0; i < 6; i++) {
          if (i > 0 && separator) result += separator;
          result += hex[randomIntInclusive(0, 15)];
          result += hex[randomIntInclusive(0, 15)];
        }
        return result;
      };

      values = Array.from({ length: count }, generateMAC);
      meta = { separator, case: upperCase ? "upper" : "lower" };
      break;
    }

    case "fraction": {
      const count = clampInt(params.count, 1, 10_000, 1);
      const maxDenom = clampInt(params.fraction_max, 2, 10_000, 100);
      const simplify = params.fraction_simplified !== false;

      const gcd = (a: number, b: number): number => {
        return b === 0 ? Math.abs(a) : gcd(b, a % b);
      };

      const generateFraction = (): string => {
        const numerator = randomIntInclusive(1, maxDenom - 1);
        const denominator = randomIntInclusive(2, maxDenom);

        if (simplify) {
          const divisor = gcd(numerator, denominator);
          const simpNum = numerator / divisor;
          const simpDen = denominator / divisor;
          return simpDen === 1 ? String(simpNum) : `${simpNum}/${simpDen}`;
        }
        return `${numerator}/${denominator}`;
      };

      values = Array.from({ length: count }, generateFraction);
      meta = { maxDenom, simplify };
      break;
    }

    case "percentage": {
      const count = clampInt(params.count, 1, 10_000, 1);
      const decimals = clampInt(params.percentage_decimals, 0, 2, 0);

      const generatePercentage = (): string => {
        const raw = randomIntInclusive(0, decimals > 0 ? 10000 : 100);
        const value = decimals > 0 ? raw / 100 : raw;
        return `${value.toFixed(decimals)}%`;
      };

      values = Array.from({ length: count }, generatePercentage);
      meta = { decimals };
      break;
    }

    case "date": {
      const count = clampInt(params.count, 1, 10_000, 1);
      const format = params.date_format ?? "iso";

      // Default date range: past year to next year
      const now = Date.now();
      const defaultStart = new Date(now - 31536000000).toISOString();
      const defaultEnd = new Date(now + 31536000000).toISOString();

      const startDate = new Date(params.date_start || defaultStart);
      const endDate = new Date(params.date_end || defaultEnd);

      const [minDate, maxDate] =
        startDate <= endDate ? [startDate, endDate] : [endDate, startDate];

      const generateDate = (): string => {
        const minTime = minDate.getTime();
        const maxTime = maxDate.getTime();
        const range = maxTime - minTime;
        const randomTime =
          minTime + (range > 0 ? randomIntInclusive(0, range) : 0);
        const date = new Date(randomTime);

        switch (format) {
          case "us":
            return `${(date.getMonth() + 1).toString().padStart(2, "0")}/${date
              .getDate()
              .toString()
              .padStart(2, "0")}/${date.getFullYear()}`;
          case "eu":
            return `${date.getDate().toString().padStart(2, "0")}/${(
              date.getMonth() + 1
            )
              .toString()
              .padStart(2, "0")}/${date.getFullYear()}`;
          case "iso":
          default:
            return date.toISOString().split("T")[0]!;
        }
      };

      values = Array.from({ length: count }, generateDate);
      meta = {
        format,
        range: { start: minDate.toISOString(), end: maxDate.toISOString() },
      };
      break;
    }

    case "bytes": {
      const count = clampInt(params.count, 1, 1000, 1);
      const length = clampInt(params.bytes_length, 1, 1048576, 16);
      const format = params.bytes_format ?? "base64";

      const generateBytes = (): string => {
        const arr = new Uint8Array(length);
        const crypto = getCryptoOptional();
        if (crypto) {
          crypto.getRandomValues(arr);
        } else {
          for (let i = 0; i < length; i++) arr[i] = randomIntInclusive(0, 255);
        }

        switch (format) {
          case "hex": {
            const hex = "0123456789ABCDEF";
            let result = "";
            for (let i = 0; i < length; i++) {
              const b = arr[i]!;
              result += hex[(b >> 4) & 0xf] + hex[b & 0xf];
            }
            return result;
          }
          case "array":
            return `[${Array.from(arr).join(", ")}]`;
          case "base64":
          default: {
            if (typeof btoa === "function") {
              const binary = Array.from(arr, (b) =>
                String.fromCharCode(b),
              ).join("");
              return btoa(binary);
            }
            // Fallback for Node.js environment
            return Buffer.from(arr).toString("base64");
          }
        }
      };

      values = Array.from({ length: count }, generateBytes);
      meta = { length, format };
      break;
    }

    case "words": {
      const wordCount = clampInt(params.word_count, 1, 1000, 10);
      const wordType = params.word_type ?? "all";

      // Common English words by type
      const wordLists = {
        nouns: [
          "time",
          "year",
          "people",
          "way",
          "day",
          "man",
          "woman",
          "child",
          "world",
          "life",
          "hand",
          "part",
          "place",
          "case",
          "week",
          "company",
          "system",
          "program",
          "question",
          "work",
          "government",
          "number",
          "night",
          "point",
          "home",
          "water",
          "room",
          "mother",
          "area",
          "money",
          "story",
          "fact",
          "month",
          "lot",
          "right",
          "study",
          "book",
          "eye",
          "job",
          "word",
          "business",
          "issue",
          "side",
          "kind",
          "head",
          "house",
          "service",
          "friend",
          "father",
          "power",
          "hour",
          "game",
          "line",
          "end",
          "member",
          "law",
          "car",
          "city",
          "community",
          "name",
          "team",
          "minute",
          "idea",
          "kid",
          "body",
          "information",
          "back",
          "parent",
          "face",
          "others",
          "level",
          "office",
          "door",
          "health",
          "person",
          "art",
          "war",
          "history",
          "party",
          "result",
          "change",
          "morning",
          "reason",
          "research",
          "girl",
          "guy",
          "moment",
          "air",
          "teacher",
          "force",
          "education",
        ],
        verbs: [
          "be",
          "have",
          "do",
          "say",
          "go",
          "get",
          "make",
          "know",
          "think",
          "take",
          "see",
          "come",
          "want",
          "look",
          "use",
          "find",
          "give",
          "tell",
          "work",
          "call",
          "try",
          "ask",
          "need",
          "feel",
          "become",
          "leave",
          "put",
          "mean",
          "keep",
          "let",
          "begin",
          "seem",
          "help",
          "talk",
          "turn",
          "start",
          "show",
          "hear",
          "play",
          "run",
          "move",
          "like",
          "live",
          "believe",
          "hold",
          "bring",
          "happen",
          "write",
          "sit",
          "stand",
          "lose",
          "pay",
          "meet",
          "include",
          "continue",
          "set",
          "change",
          "lead",
          "understand",
          "watch",
          "follow",
          "stop",
          "create",
          "speak",
          "read",
          "allow",
          "add",
          "spend",
          "grow",
          "open",
          "walk",
          "win",
          "offer",
          "remember",
          "love",
          "consider",
          "appear",
          "buy",
          "wait",
          "serve",
          "die",
          "send",
          "expect",
          "build",
          "stay",
          "fall",
          "cut",
          "reach",
          "kill",
          "remain",
        ],
        adjectives: [
          "good",
          "new",
          "first",
          "last",
          "long",
          "great",
          "little",
          "own",
          "other",
          "old",
          "right",
          "big",
          "high",
          "different",
          "small",
          "large",
          "next",
          "early",
          "young",
          "important",
          "few",
          "public",
          "bad",
          "same",
          "able",
          "to",
          "of",
          "in",
          "for",
          "on",
          "with",
          "at",
          "from",
          "by",
          "about",
          "as",
          "into",
          "like",
          "through",
          "after",
          "over",
          "between",
          "out",
          "against",
          "during",
          "without",
          "before",
          "under",
          "around",
          "among",
          "white",
          "black",
          "red",
          "blue",
          "green",
          "yellow",
          "hot",
          "cold",
          "warm",
          "cool",
          "fast",
          "slow",
          "hard",
          "soft",
          "easy",
          "difficult",
          "happy",
          "sad",
          "angry",
          "afraid",
          "beautiful",
          "ugly",
          "clean",
          "dirty",
          "rich",
          "poor",
          "full",
          "empty",
          "heavy",
          "light",
          "loud",
          "quiet",
          "sharp",
          "dull",
          "wet",
          "dry",
          "sweet",
          "sour",
          "fresh",
          "stale",
          "strong",
          "weak",
          "brave",
          "cowardly",
          "wise",
          "foolish",
          "kind",
          "cruel",
          "calm",
          "wild",
        ],
      };

      // Combine all words for "all" type
      const allWords = [
        ...wordLists.nouns,
        ...wordLists.verbs,
        ...wordLists.adjectives,
      ];

      const wordList =
        wordType === "nouns"
          ? wordLists.nouns
          : wordType === "verbs"
            ? wordLists.verbs
            : wordType === "adjectives"
              ? wordLists.adjectives
              : allWords;

      values = Array.from({ length: wordCount }, () => {
        const idx = randomIntInclusive(0, wordList.length - 1);
        return wordList[idx]!;
      });
      meta = { count: wordCount, type: wordType, totalWords: wordList.length };
      break;
    }

    case "alphabet": {
      const count = clampInt(params.count, 1, 10_000, 10);
      const letterCase = params.alphabet_case ?? "mixed";
      const vowelsOnly = Boolean(params.alphabet_vowels_only);

      const vowels = "AEIOU";
      const consonants = "BCDFGHJKLMNPQRSTVWXYZ";

      const generateLetter = (): string => {
        const source = vowelsOnly ? vowels : consonants + vowels;
        const letter = source[randomIntInclusive(0, source.length - 1)]!;

        switch (letterCase) {
          case "upper":
            return letter.toUpperCase();
          case "lower":
            return letter.toLowerCase();
          case "mixed":
            return randomIntInclusive(0, 1) === 0
              ? letter.toUpperCase()
              : letter.toLowerCase();
        }
      };

      values = Array.from({ length: count }, generateLetter);
      meta = { case: letterCase, vowelsOnly };
      break;
    }

    case "prime": {
      const count = clampInt(params.count, 1, 10_000, 10);
      const maxPrime = clampInt(params.prime_max, 2, 1_000_000, 1000);

      // Sieve of Eratosthenes to generate primes up to maxPrime
      const sieve = new Uint8Array(maxPrime + 1);
      const primes: number[] = [];
      for (let i = 2; i <= maxPrime; i++) {
        if (sieve[i] === 0) {
          primes.push(i);
          for (let j = i * i; j <= maxPrime && j > 0; j += i) {
            sieve[j] = 1;
          }
        }
      }

      if (primes.length === 0) {
        values = ["2", "3", "5", "7", "11"];
      } else {
        values = Array.from({ length: count }, () => {
          const idx = randomIntInclusive(0, primes.length - 1);
          return primes[idx]!;
        });
      }
      meta = { maxPrime, availablePrimes: primes.length };
      break;
    }

    case "roman": {
      const count = clampInt(params.count, 1, 10_000, 10);
      const maxValue = clampInt(params.roman_max, 1, 3999, 100);

      const toRoman = (num: number): string => {
        const values = [1000, 900, 500, 400, 100, 90, 50, 40, 10, 9, 5, 4, 1];
        const numerals = [
          "M",
          "CM",
          "D",
          "CD",
          "C",
          "XC",
          "L",
          "XL",
          "X",
          "IX",
          "V",
          "IV",
          "I",
        ];
        let result = "";
        for (let i = 0; i < values.length; i++) {
          while (num >= values[i]!) {
            result += numerals[i];
            num -= values[i]!;
          }
        }
        return result;
      };

      values = Array.from({ length: count }, () => {
        const num = randomIntInclusive(1, maxValue);
        return toRoman(num);
      });
      meta = { maxValue };
      break;
    }

    case "unicode": {
      const count = clampInt(params.count, 1, 10_000, 10);
      const charsPerResult = clampInt(params.unicode_count, 1, 100, 1);
      const range = params.unicode_range ?? "basic";

      const ranges: Record<string, Array<[number, number]>> = {
        basic: [[0x0020, 0x007e]], // ASCII printable
        latin: [
          [0x0020, 0x007e],
          [0x00a0, 0x00ff],
          [0x0100, 0x017f],
        ], // Latin Extended-A
        emoji: [[0x1f300, 0x1f9ff]], // Emoji range
        symbols: [
          [0x2000, 0x206f],
          [0x2100, 0x214f],
          [0x2190, 0x21ff],
        ], // Various symbols
        all: [[0x0020, 0xffff]], // Basic Multilingual Plane
      };

      const selectedRanges = ranges[range] || ranges.basic;

      const getRandomChar = (): string => {
        const randomRange =
          selectedRanges[randomIntInclusive(0, selectedRanges.length - 1)]!;
        const [min, max] = randomRange;
        const codePoint = randomIntInclusive(min, max);
        return String.fromCodePoint(codePoint);
      };

      values = Array.from({ length: count }, () => {
        let result = "";
        for (let i = 0; i < charsPerResult; i++) {
          result += getRandomChar();
        }
        return result;
      });
      meta = { range, charsPerResult };
      break;
    }

    case "ascii": {
      const count = clampInt(params.count, 1, 10_000, 10);
      const charsPerResult = clampInt(params.ascii_count, 1, 1000, 10);
      const printableOnly = params.ascii_printable !== false;

      const min = printableOnly ? 32 : 0;
      const max = printableOnly ? 126 : 255;

      values = Array.from({ length: count }, () => {
        let result = "";
        for (let i = 0; i < charsPerResult; i++) {
          result += String.fromCharCode(randomIntInclusive(min, max));
        }
        return result;
      });
      meta = { printableOnly, charsPerResult };
      break;
    }

    case "temperature": {
      const count = clampInt(params.count, 1, 10_000, 10);
      const unit = params.temp_unit ?? "celsius";
      const minTemp = safeFiniteNumber(params.temp_min, -50);
      const maxTemp = safeFiniteNumber(params.temp_max, 50);
      const decimals = clampInt(params.temp_decimals, 0, 2, 1);

      const [min, max] =
        minTemp <= maxTemp ? [minTemp, maxTemp] : [maxTemp, minTemp];

      const generateTemp = (): string => {
        const raw = min + (max - min) * (randomIntInclusive(0, 1000) / 1000);
        const value = Number(raw.toFixed(decimals));

        switch (unit) {
          case "fahrenheit":
            return `${value}°F`;
          case "kelvin":
            return `${value}K`;
          case "celsius":
          default:
            return `${value}°C`;
        }
      };

      values = Array.from({ length: count }, generateTemp);
      meta = { unit, range: [min, max], decimals };
      break;
    }

    case "currency": {
      const count = clampInt(params.count, 1, 10_000, 10);
      const symbol = params.currency_symbol ?? "$";
      const decimals = clampInt(params.currency_decimals, 0, 4, 2);
      const minAmount = safeFiniteNumber(params.currency_min, 0);
      const maxAmount = safeFiniteNumber(params.currency_max, 1000);

      const [min, max] =
        minAmount <= maxAmount
          ? [minAmount, maxAmount]
          : [maxAmount, minAmount];

      values = Array.from({ length: count }, () => {
        const raw =
          min + (max - min) * (randomIntInclusive(0, 1_000_000) / 1_000_000);
        const value = raw.toFixed(decimals);
        return `${symbol}${value}`;
      });
      meta = { symbol, range: [min, max], decimals };
      break;
    }

    case "phone": {
      const count = clampInt(params.count, 1, 10_000, 10);
      const country = params.phone_country ?? "international";

      const formats: Record<string, () => string> = {
        us: () => {
          const area = randomIntInclusive(200, 999);
          const exchange = randomIntInclusive(200, 999);
          const number = randomIntInclusive(1000, 9999);
          return `+1 (${area}) ${exchange}-${number}`;
        },
        uk: () => {
          const area = randomIntInclusive(100, 999);
          const number = randomIntInclusive(1000000, 9999999);
          return `+44 ${area} ${number}`;
        },
        cn: () => {
          const prefix = randomIntInclusive(130, 189);
          const number = randomIntInclusive(10000000, 99999999);
          return `+86 ${prefix} ${number}`;
        },
        jp: () => {
          const area = randomIntInclusive(10, 99);
          const number = randomIntInclusive(1000000, 9999999);
          return `+81 ${area} ${number}`;
        },
        de: () => {
          const area = randomIntInclusive(100, 999);
          const number = randomIntInclusive(10000000, 99999999);
          return `+49 ${area} ${number}`;
        },
        fr: () => {
          const area = randomIntInclusive(100, 999);
          const number = randomIntInclusive(10000000, 99999999);
          return `+33 ${area} ${number}`;
        },
        international: () => {
          const countryCode = randomIntInclusive(1, 999);
          const area = randomIntInclusive(100, 999);
          const number = randomIntInclusive(1000000, 9999999);
          return `+${countryCode} ${area} ${number}`;
        },
      };

      const formatFn = formats[country] || formats.international;

      values = Array.from({ length: count }, formatFn);
      meta = { country };
      break;
    }

    case "email": {
      const count = clampInt(params.count, 1, 10_000, 10);
      const domain = params.email_domain ?? "example.com";
      const style = params.email_user_style ?? "random";

      const adjectives = [
        "happy",
        "lucky",
        "swift",
        "bright",
        "clever",
        "brave",
        "calm",
        "eager",
        "gentle",
        "kind",
        "proud",
        "wise",
        "bold",
        "cool",
        "dear",
        "fair",
        "glad",
        "keen",
        "merry",
        "nice",
      ];
      const nouns = [
        "fox",
        "bear",
        "hawk",
        "wolf",
        "lion",
        "tiger",
        "eagle",
        "shark",
        "owl",
        "deer",
        "cat",
        "dog",
        "bird",
        "fish",
        "star",
        "moon",
        "sun",
        "sky",
        "wave",
        "wind",
      ];

      const generateUsername = (): string => {
        switch (style) {
          case "simple":
            return `user${randomIntInclusive(1000, 9999)}`;
          case "professional":
            return `${adjectives[randomIntInclusive(0, adjectives.length - 1)]}.${nouns[randomIntInclusive(0, nouns.length - 1)]}${randomIntInclusive(1, 99)}`;
          case "random":
          default:
            const chars = "abcdefghijklmnopqrstuvwxyz";
            let result = "";
            const len = randomIntInclusive(6, 12);
            for (let i = 0; i < len; i++) {
              result += chars[randomIntInclusive(0, chars.length - 1)];
            }
            return result;
        }
      };

      values = Array.from({ length: count }, () => {
        return `${generateUsername()}@${domain}`;
      });
      meta = { domain, style };
      break;
    }

    case "username": {
      const count = clampInt(params.count, 1, 10_000, 10);
      const style = params.username_style ?? "mixed";
      const separator = params.username_separator ?? "_";

      const words = [
        "shadow",
        "storm",
        "blaze",
        "crystal",
        "phoenix",
        "dragon",
        "wolf",
        "raven",
        "hunter",
        "warrior",
        "ninja",
        "legend",
        "master",
        "chief",
        "king",
        "queen",
        "star",
        "moon",
        "sky",
        "night",
      ];

      const generateUsername = (): string => {
        const num = randomIntInclusive(1, 9999);

        switch (style) {
          case "random":
            const chars = "abcdefghijklmnopqrstuvwxyz";
            let result = "";
            const len = randomIntInclusive(6, 12);
            for (let i = 0; i < len; i++) {
              result += chars[randomIntInclusive(0, chars.length - 1)];
            }
            return result;
          case "word":
            return words[randomIntInclusive(0, words.length - 1)]!;
          case "number":
            return `user${num}`;
          case "mixed":
          default:
            const word = words[randomIntInclusive(0, words.length - 1)]!;
            return randomIntInclusive(0, 1) === 0
              ? `${word}${separator}${num}`
              : `${word}${separator}${words[randomIntInclusive(0, words.length - 1)]!}`;
        }
      };

      values = Array.from({ length: count }, generateUsername);
      meta = { style, separator };
      break;
    }
  }

  const formatGroupedLines = (vals: (string | number)[], groupSize: number) => {
    if (!groupSize || groupSize <= 0) return vals.map(String).join("\n");
    const lines: string[] = [];
    for (let i = 0; i < vals.length; i += groupSize) {
      lines.push(
        vals
          .slice(i, i + groupSize)
          .map(String)
          .join(", "),
      );
    }
    return lines.join("\n");
  };

  let formatted: string;
  if (mode === "password" && values.length > 1) formatted = values.join("\n");
  else if (mode === "shuffle")
    formatted = formatGroupedLines(
      values,
      clampInt(params.group_size, 0, 10_000, 0),
    );
  else if (mode === "ticket") formatted = values.join("\n");
  else if (mode === "list" && values.length > 1)
    formatted = formatGroupedLines(
      values,
      clampInt(params.group_size, 0, 10_000, 0),
    );
  else formatted = values.join(", ");
  if (bonus_values.length > 0) formatted += ` + ${bonus_values.join(", ")}`;

  return {
    values,
    bonus_values,
    formatted,
    timestamp: Date.now(),
    ...(warnings.length ? { warnings } : {}),
    ...(meta ? { meta } : {}),
  };
};
