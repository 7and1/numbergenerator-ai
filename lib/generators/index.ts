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
  let values: (string | number)[] = [];
  let bonus_values: (string | number)[] = [];
  const warnings: string[] = [];
  let meta: Record<string, unknown> | undefined;

  switch (mode) {
    case "range": {
      const result = generateRange(params);
      values = result.values;
      warnings.push(...result.warnings);
      break;
    }

    case "digit": {
      const result = generateDigit(params);
      values = result.values;
      break;
    }

    case "password": {
      const result = generatePassword(params);
      values = result.values;
      meta = result.meta;
      break;
    }

    case "lottery": {
      const result = generateLottery(params);
      values = result.values;
      bonus_values = result.bonus_values;
      break;
    }

    case "list": {
      const result = generateList(params);
      values = result.values;
      meta = result.meta;
      warnings.push(...result.warnings);
      break;
    }

    case "shuffle": {
      const result = generateShuffle(params);
      values = result.values;
      meta = result.meta;
      break;
    }

    case "dice": {
      const result = generateDice(params);
      values = result.values;
      bonus_values = result.bonus_values;
      meta = result.meta;
      break;
    }

    case "coin": {
      const result = generateCoin(params);
      values = result.values;
      meta = result.meta;
      break;
    }

    case "ticket": {
      const result = generateTicket(params);
      values = result.values;
      meta = result.meta;
      warnings.push(...result.warnings);
      break;
    }

    case "uuid": {
      const result = generateUUID(params);
      values = result.values;
      break;
    }

    case "color": {
      const result = generateColor(params);
      values = result.values;
      meta = result.meta;
      break;
    }

    case "hex": {
      const result = generateHex(params);
      values = result.values;
      meta = result.meta;
      break;
    }

    case "timestamp": {
      const result = generateTimestamp(params);
      values = result.values;
      meta = result.meta;
      break;
    }

    case "coordinates": {
      const result = generateCoordinates(params);
      values = result.values;
      meta = result.meta;
      break;
    }

    case "ipv4": {
      const result = generateIPv4(params);
      values = result.values;
      meta = result.meta;
      break;
    }

    case "mac": {
      const result = generateMAC(params);
      values = result.values;
      meta = result.meta;
      break;
    }

    case "fraction": {
      const result = generateFraction(params);
      values = result.values;
      meta = result.meta;
      break;
    }

    case "percentage": {
      const result = generatePercentage(params);
      values = result.values;
      meta = result.meta;
      break;
    }

    case "date": {
      const result = generateDate(params);
      values = result.values;
      meta = result.meta;
      break;
    }

    case "bytes": {
      const result = generateBytes(params);
      values = result.values;
      meta = result.meta;
      break;
    }

    case "words": {
      const result = generateWords(params);
      values = result.values;
      meta = result.meta;
      break;
    }

    case "alphabet": {
      const result = generateAlphabet(params);
      values = result.values;
      meta = result.meta;
      break;
    }

    case "prime": {
      const result = generatePrime(params);
      values = result.values;
      meta = result.meta;
      break;
    }

    case "roman": {
      const result = generateRoman(params);
      values = result.values;
      meta = result.meta;
      break;
    }

    case "unicode": {
      const result = generateUnicode(params);
      values = result.values;
      meta = result.meta;
      break;
    }

    case "ascii": {
      const result = generateASCII(params);
      values = result.values;
      meta = result.meta;
      break;
    }

    case "temperature": {
      const result = generateTemperature(params);
      values = result.values;
      meta = result.meta;
      break;
    }

    case "currency": {
      const result = generateCurrency(params);
      values = result.values;
      meta = result.meta;
      break;
    }

    case "phone": {
      const result = generatePhone(params);
      values = result.values;
      meta = result.meta;
      break;
    }

    case "email": {
      const result = generateEmail(params);
      values = result.values;
      meta = result.meta;
      break;
    }

    case "username": {
      const result = generateUsername(params);
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
      clampInt(params.group_size, 0, 10_000, 0),
    );
  else if (mode === "ticket") formatted = values.join("\n");
  else if (mode === "list" && values.length > 1)
    formatted = formatGroupedLines(
      values,
      clampInt(params.group_size, 0, 10_000, 0),
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
