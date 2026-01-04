/**
 * Math-related generators.
 * Generates fractions, percentages, primes, and Roman numerals.
 */

import type { GeneratorParams } from "../types";
import { clampInt } from "../core/arrays";
import { randomIntInclusive, setCurrentMode } from "../core/samplers";

export function generateFraction(params: GeneratorParams): {
  values: string[];
  meta: Record<string, unknown>;
} {
  setCurrentMode("fraction");
  const count = clampInt(params.count, 1, 10_000, 1);
  const maxDenom = clampInt(params.fraction_max, 2, 10_000, 100);
  const simplify = params.fraction_simplified !== false;

  const gcd = (a: number, b: number): number => {
    return b === 0 ? Math.abs(a) : gcd(b, a % b);
  };

  const generateOne = (): string => {
    const numerator = randomIntInclusive(1, maxDenom - 1);
    const denominator = randomIntInclusive(2, maxDenom);

    if (simplify) {
      const divisor = gcd(numerator, denominator);
      const simpNum = numerator / divisor;
      const simpDen = denominator / divisor;
      return simpDen === 1 ? String(simpNum) : "" + simpNum + "/" + simpDen;
    }
    return "" + numerator + "/" + denominator;
  };

  const values = Array.from({ length: count }, generateOne);
  const meta = { maxDenom, simplify };
  return { values, meta };
}

export function generatePercentage(params: GeneratorParams): {
  values: string[];
  meta: Record<string, unknown>;
} {
  setCurrentMode("percentage");
  const count = clampInt(params.count, 1, 10_000, 1);
  const decimals = clampInt(params.percentage_decimals, 0, 2, 0);

  const generateOne = (): string => {
    const raw = randomIntInclusive(0, decimals > 0 ? 10000 : 100);
    const value = decimals > 0 ? raw / 100 : raw;
    return value.toFixed(decimals) + "%";
  };

  const values = Array.from({ length: count }, generateOne);
  const meta = { decimals };
  return { values, meta };
}

export function generatePrime(params: GeneratorParams): {
  values: string[];
  meta: Record<string, unknown>;
} {
  setCurrentMode("prime");
  const count = clampInt(params.count, 1, 10_000, 10);
  const maxPrime = clampInt(params.prime_max, 2, 1_000_000, 1000);

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

  const values: string[] = [];
  if (primes.length === 0) {
    values.push("2", "3", "5", "7", "11");
  } else {
    for (let i = 0; i < count; i++) {
      const idx = randomIntInclusive(0, primes.length - 1);
      values.push(String(primes[idx]!));
    }
  }
  const meta = { maxPrime, availablePrimes: primes.length };
  return { values, meta };
}

export function generateRoman(params: GeneratorParams): {
  values: string[];
  meta: Record<string, unknown>;
} {
  setCurrentMode("roman");
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

  const values = Array.from({ length: count }, () => {
    const num = randomIntInclusive(1, maxValue);
    return toRoman(num);
  });
  const meta = { maxValue };
  return { values, meta };
}
