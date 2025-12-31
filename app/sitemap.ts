import type { MetadataRoute } from "next";
import { CONFIG_MAP } from "@/lib/configMap";

const BASE_URL = "https://numbergenerator.ai";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  // Get tools with their priorities from config
  const tools = Object.entries(CONFIG_MAP)
    .filter(([slug]) => !slug.startsWith("template-"))
    .map(([slug, config]) => ({
      url: `${BASE_URL}/${slug}/`,
      lastModified: now,
      changeFrequency: "weekly" as const,
      // Use config priority or default to 0.7
      priority: config.priority ?? 0.7,
    }))
    // Sort by priority (descending) for better sitemap structure
    .sort((a, b) => b.priority - a.priority);

  return [
    {
      url: `${BASE_URL}/`,
      lastModified: now,
      changeFrequency: "daily",
      priority: 1.0,
    },
    ...tools,
  ];
}
