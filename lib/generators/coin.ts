/**
 * Coin mode generator.
 * Simulates coin flips with streak tracking.
 */

import type { GeneratorParams } from "../types";
import { clampInt } from "../core/arrays";
import { randomIntInclusive, setCurrentMode } from "../core/samplers";

export function generateCoin(params: GeneratorParams): {
  values: string[];
  meta: Record<string, unknown>;
} {
  setCurrentMode("coin");

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

  const values = sequence;
  const meta = {
    flips,
    heads,
    tails,
    longestStreak: { length: longest, side: longestSide },
  };

  return { values, meta };
}
