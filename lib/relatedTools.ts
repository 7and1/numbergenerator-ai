import type { ToolConfig } from "./types";
import { CONFIG_MAP } from "./config";

/**
 * Get related tools for a given tool based on category and mode
 * @param currentSlug - The current tool's slug
 * @param limit - Maximum number of related tools to return (default: 4)
 * @returns Array of related tool configurations
 */
export function getRelatedTools(currentSlug: string, limit = 4): ToolConfig[] {
  const current = CONFIG_MAP[currentSlug];
  if (!current) return [];

  const allTools = Object.values(CONFIG_MAP).filter(
    (t) => t.slug !== currentSlug && !t.slug.startsWith("template-"),
  );

  // Score tools by relevance
  const scored = allTools.map((tool) => {
    let score = 0;

    // Same category = highest priority
    if (tool.category === current.category) {
      score += 100;
    }

    // Same mode = medium priority
    if (tool.mode === current.mode) {
      score += 50;
    }

    // High priority tools get a boost
    score += (tool.priority ?? 0) * 10;

    return { tool, score };
  });

  // Sort by score descending, then by priority
  return scored
    .sort(
      (a, b) =>
        b.score - a.score || (b.tool.priority ?? 0) - (a.tool.priority ?? 0),
    )
    .slice(0, limit)
    .map((s) => s.tool);
}

/**
 * Get category label for display
 */
export function getCategoryLabel(category: string): string {
  const labels: Record<string, string> = {
    "random-numbers": "Random Numbers",
    "passwords-pins": "Passwords & PINs",
    lottery: "Lottery",
    dice: "Dice & Coins",
    list: "List Tools",
    developer: "Developer Tools",
    data: "Data Generators",
    math: "Math & Education",
  };
  return labels[category] || category;
}
