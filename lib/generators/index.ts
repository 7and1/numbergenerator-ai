/**
 * Main generator entry point.
 * Routes generate() calls to appropriate generator modules.
 */

import type {
  GenerationResult,
  GeneratorMode,
  GeneratorParams,
} from "../types";

// Import all generator functions
import { generateRange } from "./range";
import { generateDigit, generatePassword } from "./password";
import { generateLottery } from "./lottery";
import { generateList, generateShuffle } from "./list";
import { generateDice } from "./dice";
import { generateCoin } from "./coin";
import { generateTicket } from "./ticket";
import {
  generateUUID,
  generateColor,
  generateHex,
  generateTimestamp,
  generateCoordinates,
  generateIPv4,
  generateMAC,
  generateBytes,
} from "./data";
import {
  generateFraction,
  generatePercentage,
  generatePrime,
  generateRoman,
} from "./math";
import {
  generateWords,
  generateAlphabet,
  generateUnicode,
  generateASCII,
} from "./text";
import {
  generateDate,
  generateTemperature,
  generateCurrency,
  generatePhone,
  generateEmail,
  generateUsername,
} from "./simulation";

// Import utility functions
import { clampInt } from "../core/arrays";
import { setCurrentMode } from "../core/samplers";

/**
 * Format values with optional grouping for display.
 */
function formatGroupedLines(
  vals: (string | number)[],
  groupSize: number,
): string {
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
}

/**
 * Main generator function.
 * Routes to the appropriate generator based on mode.
 *
 * @param mode - The generator mode to use
 * @param params - Generator parameters specific to the mode
 * @returns GenerationResult with values, formatted output, and optional metadata
 */
export function generate(
  mode: GeneratorMode,
  params: GeneratorParams,
): GenerationResult {
  const safeParams: GeneratorParams =
    params && typeof params === "object"
      ? (params as GeneratorParams)
      : ({} as GeneratorParams);

  let values: (string | number)[] = [];
  let bonus_values: (string | number)[] = [];
  const warnings: string[] = [];
  let meta: Record<string, unknown> | undefined;

  switch (mode) {
    case "range": {
      const result = generateRange(safeParams);
      values = result.values;
      warnings.push(...result.warnings);
      break;
    }

    case "digit": {
      const result = generateDigit(safeParams);
      values = result.values;
      break;
    }

    case "password": {
      const result = generatePassword(safeParams);
      values = result.values;
      meta = result.meta;
      if (result.warnings.length) warnings.push(...result.warnings);
      break;
    }

    case "lottery": {
      const result = generateLottery(safeParams);
      values = result.values;
      bonus_values = result.bonus_values;
      break;
    }

    case "list": {
      const result = generateList(safeParams);
      values = result.values;
      meta = result.meta;
      warnings.push(...result.warnings);
      break;
    }

    case "shuffle": {
      const result = generateShuffle(safeParams);
      values = result.values;
      meta = result.meta;
      break;
    }

    case "dice": {
      const result = generateDice(safeParams);
      values = result.values;
      bonus_values = result.bonus_values;
      meta = result.meta;
      break;
    }

    case "coin": {
      const result = generateCoin(safeParams);
      values = result.values;
      meta = result.meta;
      break;
    }

    case "ticket": {
      const result = generateTicket(safeParams);
      values = result.values;
      meta = result.meta;
      warnings.push(...result.warnings);
      break;
    }

    case "uuid": {
      const result = generateUUID(safeParams);
      values = result.values;
      break;
    }

    case "color": {
      const result = generateColor(safeParams);
      values = result.values;
      meta = result.meta;
      break;
    }

    case "hex": {
      const result = generateHex(safeParams);
      values = result.values;
      meta = result.meta;
      break;
    }

    case "timestamp": {
      const result = generateTimestamp(safeParams);
      values = result.values;
      meta = result.meta;
      break;
    }

    case "coordinates": {
      const result = generateCoordinates(safeParams);
      values = result.values;
      meta = result.meta;
      break;
    }

    case "ipv4": {
      const result = generateIPv4(safeParams);
      values = result.values;
      meta = result.meta;
      break;
    }

    case "mac": {
      const result = generateMAC(safeParams);
      values = result.values;
      meta = result.meta;
      break;
    }

    case "fraction": {
      const result = generateFraction(safeParams);
      values = result.values;
      meta = result.meta;
      break;
    }

    case "percentage": {
      const result = generatePercentage(safeParams);
      values = result.values;
      meta = result.meta;
      break;
    }

    case "date": {
      const result = generateDate(safeParams);
      values = result.values;
      meta = result.meta;
      break;
    }

    case "bytes": {
      const result = generateBytes(safeParams);
      values = result.values;
      meta = result.meta;
      break;
    }

    case "words": {
      const result = generateWords(safeParams);
      values = result.values;
      meta = result.meta;
      break;
    }

    case "alphabet": {
      const result = generateAlphabet(safeParams);
      values = result.values;
      meta = result.meta;
      break;
    }

    case "prime": {
      const result = generatePrime(safeParams);
      values = result.values;
      meta = result.meta;
      break;
    }

    case "roman": {
      const result = generateRoman(safeParams);
      values = result.values;
      meta = result.meta;
      break;
    }

    case "unicode": {
      const result = generateUnicode(safeParams);
      values = result.values;
      meta = result.meta;
      break;
    }

    case "ascii": {
      const result = generateASCII(safeParams);
      values = result.values;
      meta = result.meta;
      break;
    }

    case "temperature": {
      const result = generateTemperature(safeParams);
      values = result.values;
      meta = result.meta;
      break;
    }

    case "currency": {
      const result = generateCurrency(safeParams);
      values = result.values;
      meta = result.meta;
      break;
    }

    case "phone": {
      const result = generatePhone(safeParams);
      values = result.values;
      meta = result.meta;
      break;
    }

    case "email": {
      const result = generateEmail(safeParams);
      values = result.values;
      meta = result.meta;
      break;
    }

    case "username": {
      const result = generateUsername(safeParams);
      values = result.values;
      meta = result.meta;
      break;
    }

    default:
      // Unknown mode - return empty result
      setCurrentMode(mode as GeneratorMode);
      break;
  }

  // Format output based on mode
  let formatted: string;
  if (mode === "password" && values.length > 1) formatted = values.join("\n");
  else if (mode === "shuffle")
    formatted = formatGroupedLines(
      values,
      clampInt(safeParams.group_size, 0, 10_000, 0),
    );
  else if (mode === "ticket") formatted = values.join("\n");
  else if (mode === "list" && values.length > 1)
    formatted = formatGroupedLines(
      values,
      clampInt(safeParams.group_size, 0, 10_000, 0),
    );
  else formatted = values.join(", ");

  if (bonus_values.length > 0) formatted += " + " + bonus_values.join(", ");

  return {
    values,
    bonus_values,
    formatted,
    timestamp: Date.now(),
    ...(warnings.length ? { warnings } : {}),
    ...(meta ? { meta } : {}),
  };
}

// Re-export types for convenience
export type {
  GenerationResult,
  GeneratorMode,
  GeneratorParams,
} from "../types";
