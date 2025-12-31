export type ParsedList = {
  items: string[];
  weights?: number[];
  warnings: string[];
};

const parseWeight = (raw: string): number | null => {
  const n = Number(raw.trim());
  if (!Number.isFinite(n)) return null;
  if (n <= 0) return null;
  return n;
};

export const parseItemsText = (
  text: string,
  opts?: { parseWeights?: boolean; maxItems?: number },
): ParsedList => {
  const parseWeights = Boolean(opts?.parseWeights);
  const maxItems =
    typeof opts?.maxItems === "number"
      ? Math.max(1, Math.floor(opts.maxItems))
      : 50_000;

  const warnings: string[] = [];
  const items: string[] = [];
  const weights: number[] = [];

  const lines = String(text ?? "")
    .replace(/\r\n/g, "\n")
    .split("\n");

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) continue;
    if (trimmed.startsWith("#")) continue;

    if (!parseWeights) {
      items.push(trimmed);
    } else {
      // Accept: "Name | 3", "Name,3", "Name\t3"
      const parts = trimmed.split(/\s*[|,\t]\s*/);
      if (parts.length >= 2) {
        const maybeWeight = parseWeight(parts[parts.length - 1]!);
        const name = parts.slice(0, -1).join(" ").trim();
        if (name && maybeWeight !== null) {
          items.push(name);
          weights.push(maybeWeight);
        } else {
          items.push(trimmed);
          weights.push(1);
        }
      } else {
        items.push(trimmed);
        weights.push(1);
      }
    }

    if (items.length >= maxItems) {
      warnings.push(`List truncated to ${maxItems} items.`);
      break;
    }
  }

  const result: ParsedList = { items, warnings };
  if (parseWeights) result.weights = weights;
  return result;
};
