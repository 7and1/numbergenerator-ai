import type { ToolConfig } from "../types";

/**
 * Tool configuration modules
 * Each module contains related tool configurations organized by category
 */
import { rangeTools } from "./tools/range";
import { passwordTools } from "./tools/password";
import { lotteryTools } from "./tools/lottery";
import { diceTools } from "./tools/dice";
import { listTools } from "./tools/list";
import { developerTools } from "./tools/developer";
import { dataTools } from "./tools/data";
import { mathTools } from "./tools/math";

/**
 * Combined configuration map for all tools
 *
 * This map contains the configuration for every tool in the application.
 * Each config includes:
 * - slug: URL-friendly identifier
 * - title: Display name
 * - seo_title: SEO-optimized title
 * - description: Tool description
 * - mode: Generator mode (determines which engine to use)
 * - params: Default parameters for the generator
 * - ui: UI configuration
 * - keywords: SEO keywords
 * - priority: Sitemap priority (0-1)
 * - category: Tool category for grouping
 * - faq: Frequently asked questions
 * - how_to: Step-by-step usage instructions
 * - features: Feature highlights
 *
 * @example
 * ```ts
 * const config = CONFIG_MAP["1-100"];
 * console.log(config.title); // "Random Number 1-100"
 * ```
 */
export const CONFIG_MAP: Record<string, ToolConfig> = {
  ...rangeTools,
  ...passwordTools,
  ...lotteryTools,
  ...diceTools,
  ...listTools,
  ...developerTools,
  ...dataTools,
  ...mathTools,
};

/**
 * Get all tools excluding templates
 * @returns Array of tool configurations
 */
export function getAllTools(): ToolConfig[] {
  return Object.values(CONFIG_MAP).filter(
    (tool) => !tool.slug.startsWith("template-"),
  );
}

/**
 * Get tools by category
 * @param category - The category to filter by
 * @returns Array of tool configurations in the category
 */
export function getToolsByCategory(category: string): ToolConfig[] {
  return Object.values(CONFIG_MAP).filter(
    (tool) => tool.category === category && !tool.slug.startsWith("template-"),
  );
}

/**
 * Get tool configuration by slug
 * @param slug - The tool slug
 * @returns The tool configuration or undefined if not found
 */
export function getToolBySlug(slug: string): ToolConfig | undefined {
  return CONFIG_MAP[slug];
}

/**
 * Get all tool slugs
 * @returns Array of all tool slugs
 */
export function getAllToolSlugs(): string[] {
  return Object.keys(CONFIG_MAP).filter(
    (slug) => !slug.startsWith("template-"),
  );
}
