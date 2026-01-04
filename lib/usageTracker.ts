/**
 * Tool Usage Tracker - Tracks tool usage for heat map display
 */

const USAGE_KEY = "ng:usage:v1";
const MAX_USAGE_ENTRIES = 500;

export type UsageEntry = {
  toolSlug: string;
  toolTitle: string;
  count: number;
  lastUsed: number;
};

type UsageData = Record<
  string,
  { count: number; lastUsed: number; title: string }
>;

const isBrowser = () =>
  typeof window !== "undefined" && typeof window.localStorage !== "undefined";

/**
 * Get all usage data
 */
export function getUsageData(): UsageEntry[] {
  if (!isBrowser()) return [];

  try {
    const raw = window.localStorage.getItem(USAGE_KEY);
    if (!raw) return [];

    const data: UsageData = JSON.parse(raw);
    return Object.entries(data)
      .map(([slug, entry]) => ({
        toolSlug: slug,
        toolTitle: entry.title,
        count: entry.count,
        lastUsed: entry.lastUsed,
      }))
      .sort((a, b) => b.count - a.count); // Sort by usage count
  } catch {
    return [];
  }
}

/**
 * Increment usage count for a tool
 */
export function trackToolUsage(toolSlug: string, toolTitle: string): void {
  if (!isBrowser()) return;

  try {
    const raw = window.localStorage.getItem(USAGE_KEY);
    const data: UsageData = raw ? JSON.parse(raw) : {};

    if (!data[toolSlug]) {
      data[toolSlug] = { count: 0, lastUsed: 0, title: toolTitle };
    }

    data[toolSlug]!.count += 1;
    data[toolSlug]!.lastUsed = Date.now();
    data[toolSlug]!.title = toolTitle;

    // Cap entries to prevent unbounded localStorage growth.
    const slugs = Object.keys(data);
    if (slugs.length > MAX_USAGE_ENTRIES) {
      slugs
        .sort((a, b) => (data[a]?.lastUsed ?? 0) - (data[b]?.lastUsed ?? 0))
        .slice(0, Math.max(0, slugs.length - MAX_USAGE_ENTRIES))
        .forEach((slug) => {
          delete data[slug];
        });
    }

    window.localStorage.setItem(USAGE_KEY, JSON.stringify(data));
  } catch {
    // Ignore quota errors
  }
}

/**
 * Get most used tools
 */
export function getMostUsedTools(limit: number = 10): UsageEntry[] {
  return getUsageData().slice(0, limit);
}

/**
 * Get recently used tools
 */
export function getRecentlyUsedTools(limit: number = 10): UsageEntry[] {
  return getUsageData()
    .sort((a, b) => b.lastUsed - a.lastUsed)
    .slice(0, limit);
}

/**
 * Clear all usage data
 */
export function clearUsageData(): void {
  if (!isBrowser()) return;
  try {
    window.localStorage.removeItem(USAGE_KEY);
  } catch {
    // Ignore
  }
}

/**
 * Get usage count for a specific tool
 */
export function getToolUsageCount(toolSlug: string): number {
  const data = getUsageData();
  const entry = data.find((e) => e.toolSlug === toolSlug);
  return entry?.count ?? 0;
}
