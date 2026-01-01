/**
 * Simulation mode generators.
 * Generates realistic simulated data like temperature, currency, phone, email, username, and dates.
 */

import type { GeneratorParams } from "../types";
import { clampInt, safeFiniteNumber } from "../core/arrays";
import { randomIntInclusive, setCurrentMode } from "../core/samplers";

const ADJECTIVES = [
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

const NOUNS = [
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

const USERNAME_WORDS = [
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

export function generateDate(params: GeneratorParams): {
  values: string[];
  meta: Record<string, unknown>;
} {
  setCurrentMode("date");
  const count = clampInt(params.count, 1, 10_000, 1);
  const format = params.date_format ?? "iso";

  const now = Date.now();
  const defaultStart = new Date(now - 31536000000).toISOString();
  const defaultEnd = new Date(now + 31536000000).toISOString();

  const startDate = new Date(params.date_start || defaultStart);
  const endDate = new Date(params.date_end || defaultEnd);

  const [minDate, maxDate] =
    startDate <= endDate ? [startDate, endDate] : [endDate, startDate];

  const generateOne = (): string => {
    const minTime = minDate.getTime();
    const maxTime = maxDate.getTime();
    const range = maxTime - minTime;
    const randomTime = minTime + (range > 0 ? randomIntInclusive(0, range) : 0);
    const date = new Date(randomTime);

    switch (format) {
      case "us":
        return (
          (date.getMonth() + 1).toString().padStart(2, "0") +
          "/" +
          date.getDate().toString().padStart(2, "0") +
          "/" +
          date.getFullYear()
        );
      case "eu":
        return (
          date.getDate().toString().padStart(2, "0") +
          "/" +
          (date.getMonth() + 1).toString().padStart(2, "0") +
          "/" +
          date.getFullYear()
        );
      case "iso":
      default:
        return date.toISOString().split("T")[0]!;
    }
  };

  const values = Array.from({ length: count }, generateOne);
  const meta = {
    format,
    range: { start: minDate.toISOString(), end: maxDate.toISOString() },
  };
  return { values, meta };
}

export function generateTemperature(params: GeneratorParams): {
  values: string[];
  meta: Record<string, unknown>;
} {
  setCurrentMode("temperature");
  const count = clampInt(params.count, 1, 10_000, 10);
  const unit = params.temp_unit ?? "celsius";
  const minTemp = safeFiniteNumber(params.temp_min, -50);
  const maxTemp = safeFiniteNumber(params.temp_max, 50);
  const decimals = clampInt(params.temp_decimals, 0, 2, 1);

  const [min, max] =
    minTemp <= maxTemp ? [minTemp, maxTemp] : [maxTemp, minTemp];

  const generateOne = (): string => {
    const raw = min + (max - min) * (randomIntInclusive(0, 1000) / 1000);
    const value = Number(raw.toFixed(decimals));

    switch (unit) {
      case "fahrenheit":
        return value + "F";
      case "kelvin":
        return value + "K";
      case "celsius":
      default:
        return value + "C";
    }
  };

  const values = Array.from({ length: count }, generateOne);
  const meta = { unit, range: [min, max], decimals };
  return { values, meta };
}

export function generateCurrency(params: GeneratorParams): {
  values: string[];
  meta: Record<string, unknown>;
} {
  setCurrentMode("currency");
  const count = clampInt(params.count, 1, 10_000, 10);
  const symbol = params.currency_symbol ?? "$";
  const decimals = clampInt(params.currency_decimals, 0, 4, 2);
  const minAmount = safeFiniteNumber(params.currency_min, 0);
  const maxAmount = safeFiniteNumber(params.currency_max, 1000);

  const [min, max] =
    minAmount <= maxAmount ? [minAmount, maxAmount] : [maxAmount, minAmount];

  const values = Array.from({ length: count }, () => {
    const raw =
      min + (max - min) * (randomIntInclusive(0, 1_000_000) / 1_000_000);
    const value = raw.toFixed(decimals);
    return symbol + value;
  });
  const meta = { symbol, range: [min, max], decimals };
  return { values, meta };
}

export function generatePhone(params: GeneratorParams): {
  values: string[];
  meta: Record<string, unknown>;
} {
  setCurrentMode("phone");
  const count = clampInt(params.count, 1, 10_000, 10);
  const country = params.phone_country ?? "international";

  const formats: Record<string, () => string> = {
    us: () => {
      const area = randomIntInclusive(200, 999);
      const exchange = randomIntInclusive(200, 999);
      const number = randomIntInclusive(1000, 9999);
      return "+1 (" + area + ") " + exchange + "-" + number;
    },
    uk: () => {
      const area = randomIntInclusive(100, 999);
      const number = randomIntInclusive(1000000, 9999999);
      return "+44 " + area + " " + number;
    },
    cn: () => {
      const prefix = randomIntInclusive(130, 189);
      const number = randomIntInclusive(10000000, 99999999);
      return "+86 " + prefix + " " + number;
    },
    jp: () => {
      const area = randomIntInclusive(10, 99);
      const number = randomIntInclusive(1000000, 9999999);
      return "+81 " + area + " " + number;
    },
    de: () => {
      const area = randomIntInclusive(100, 999);
      const number = randomIntInclusive(10000000, 99999999);
      return "+49 " + area + " " + number;
    },
    fr: () => {
      const area = randomIntInclusive(100, 999);
      const number = randomIntInclusive(10000000, 99999999);
      return "+33 " + area + " " + number;
    },
    international: () => {
      const countryCode = randomIntInclusive(1, 999);
      const area = randomIntInclusive(100, 999);
      const number = randomIntInclusive(1000000, 9999999);
      return "+" + countryCode + " " + area + " " + number;
    },
  };

  const formatFn = formats[country] || formats.international;

  const values = Array.from({ length: count }, formatFn);
  const meta = { country };
  return { values, meta };
}

export function generateEmail(params: GeneratorParams): {
  values: string[];
  meta: Record<string, unknown>;
} {
  setCurrentMode("email");
  const count = clampInt(params.count, 1, 10_000, 10);
  const domain = params.email_domain ?? "example.com";
  const style = params.email_user_style ?? "random";

  const generateUsername = (): string => {
    switch (style) {
      case "simple":
        return "user" + randomIntInclusive(1000, 9999);
      case "professional":
        return (
          ADJECTIVES[randomIntInclusive(0, ADJECTIVES.length - 1)] +
          "." +
          NOUNS[randomIntInclusive(0, NOUNS.length - 1)] +
          randomIntInclusive(1, 99)
        );
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

  const values = Array.from({ length: count }, () => {
    return generateUsername() + "@" + domain;
  });
  const meta = { domain, style };
  return { values, meta };
}

export function generateUsername(params: GeneratorParams): {
  values: string[];
  meta: Record<string, unknown>;
} {
  setCurrentMode("username");
  const count = clampInt(params.count, 1, 10_000, 10);
  const style = params.username_style ?? "mixed";
  const separator = params.username_separator ?? "_";

  const generateOne = (): string => {
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
        return USERNAME_WORDS[
          randomIntInclusive(0, USERNAME_WORDS.length - 1)
        ]!;
      case "number":
        return "user" + num;
      case "mixed":
      default:
        const word =
          USERNAME_WORDS[randomIntInclusive(0, USERNAME_WORDS.length - 1)]!;
        return randomIntInclusive(0, 1) === 0
          ? word + separator + num
          : word +
              separator +
              USERNAME_WORDS[randomIntInclusive(0, USERNAME_WORDS.length - 1)]!;
    }
  };

  const values = Array.from({ length: count }, generateOne);
  const meta = { style, separator };
  return { values, meta };
}
