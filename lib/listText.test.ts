import { describe, expect, it } from "vitest";

import { parseItemsText } from "./listText";

describe("lib/listText.parseItemsText", () => {
  it("parses simple lines and ignores empty/comments", () => {
    const res = parseItemsText("\n# comment\nAlice\n\nBob\n");
    expect(res.items).toEqual(["Alice", "Bob"]);
    expect(res.warnings).toEqual([]);
  });

  it("parses weights with pipe/comma/tab", () => {
    const res = parseItemsText("Alice | 3\nBob,2\nCharlie\t5\n", {
      parseWeights: true,
    });
    expect(res.items).toEqual(["Alice", "Bob", "Charlie"]);
    expect(res.weights).toEqual([3, 2, 5]);
  });

  it("defaults invalid weights to 1", () => {
    const res = parseItemsText("Alice|x\nBob|-2\n", { parseWeights: true });
    expect(res.items).toEqual(["Alice|x", "Bob|-2"]);
    expect(res.weights).toEqual([1, 1]);
  });
});
