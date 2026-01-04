/**
 * Ticket draw mode generator.
 * Draws tickets from a pool without replacement.
 */

import type { GeneratorParams } from "../types";
import {
  clampInt,
  safeFiniteNumber,
  normalizedItemsAndWeights,
  rangeSize,
  valueAtIndex,
  shuffleInPlace,
} from "../core/arrays";
import { sampleUniqueIndices, setCurrentMode } from "../core/samplers";

export function generateTicket(params: GeneratorParams): {
  values: string[];
  meta: Record<string, unknown>;
  warnings: string[];
} {
  setCurrentMode("ticket");
  const source = params.ticket_source ?? "range";
  const draw = clampInt(params.count ?? params.pick, 1, 5_000, 1);
  const warnings: string[] = [];
  let pool: string[] = [];

  if (source === "list") {
    const { items: cleaned } = normalizedItemsAndWeights(params.items ?? []);
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
      ? normalizedItemsAndWeights(params.ticket_remaining).items
      : pool;
  if (!remaining.length) return { values: [], meta: {}, warnings };

  const k = Math.min(draw, remaining.length);
  if (draw > remaining.length)
    warnings.push(
      "Only " + remaining.length + " tickets left; drawing " + k + ".",
    );

  const indices = sampleUniqueIndices(remaining.length, k);
  const drawn = shuffleInPlace(indices.map((i) => remaining[i]!));
  const drawnSet = new Set(indices);
  const nextRemaining = remaining.filter((_, i) => !drawnSet.has(i));

  const values = drawn;
  const meta = {
    remainingCount: nextRemaining.length,
    ticket_remaining: nextRemaining,
  };
  return { values, meta, warnings };
}
