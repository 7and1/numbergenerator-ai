/**
 * Dice mode generator.
 * Simulates dice rolls with support for advantage/disadvantage and custom faces.
 */

import type { GeneratorParams } from "../types";
import { clampInt, safeFiniteNumber } from "../core/arrays";
import { randomIntInclusive, setCurrentMode } from "../core/samplers";

export function generateDice(params: GeneratorParams): {
  values: (string | number)[];
  bonus_values: (string | number)[];
  meta: Record<string, unknown>;
} {
  setCurrentMode("dice");

  const { dice_sides, dice_rolls, dice_adv, dice_custom_faces, dice_modifier } =
    params;
  const rolls = clampInt(dice_rolls, 1, 2_000, 1);
  const modifier = safeFiniteNumber(dice_modifier, 0);
  const adv = dice_adv ?? "none";

  if (Array.isArray(dice_custom_faces) && dice_custom_faces.length >= 2) {
    const faces = dice_custom_faces.map((f) => String(f));
    const indices: number[] = [];
    const values = Array.from({ length: rolls }, () => {
      const idx = randomIntInclusive(0, faces.length - 1);
      indices.push(idx);
      return faces[idx]!;
    });
    const meta = { faces: faces.length, selectedIndices: indices };
    return { values, bonus_values: [], meta };
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
    const values = [keptWithMod];
    const bonus_values = [dropped + modifier];
    const meta = { d20: { a, b, kept, dropped, modifier, mode: adv } };
    return { values, bonus_values, meta };
  }

  const numericRolls: number[] = Array.from({ length: rolls }, () =>
    randomIntInclusive(1, sides),
  );
  const withMod = modifier
    ? numericRolls.map((n) => n + modifier)
    : numericRolls;
  const values = withMod;
  const total = withMod.reduce((acc, n) => acc + n, 0);
  const meta = { sides, rolls, modifier, total, raw: numericRolls };

  return { values, bonus_values: [], meta };
}
