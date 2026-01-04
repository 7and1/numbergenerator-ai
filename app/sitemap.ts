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

  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: `${BASE_URL}/combo/`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/guides/`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.6,
    },
    {
      url: `${BASE_URL}/faq/`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: `${BASE_URL}/about/`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: `${BASE_URL}/privacy/`,
      lastModified: now,
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: `${BASE_URL}/terms/`,
      lastModified: now,
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: `${BASE_URL}/cookies/`,
      lastModified: now,
      changeFrequency: "yearly",
      priority: 0.3,
    },
  ];

  return [
    {
      url: `${BASE_URL}/`,
      lastModified: now,
      changeFrequency: "daily",
      priority: 1.0,
    },
    ...tools,
    ...staticPages,
  ];
}
