/**
 * Breadcrumb category hierarchy configuration
 * Maps tool slugs to their navigation paths with proper category structure
 */

import type { ToolCategory } from "./types";

export interface BreadcrumbItem {
  name: string;
  href: string;
  current?: boolean;
}

export interface CategoryInfo {
  name: string;
  href: string;
  description: string;
}

/**
 * Category hierarchy mapping
 * Organizes tool categories with their display names and URLs
 */
export const CATEGORY_HIERARCHY: Record<ToolCategory | "math", CategoryInfo> = {
  "random-numbers": {
    name: "Number Generators",
    href: "/#numbers",
    description: "Random number generators for any range",
  },
  "passwords-pins": {
    name: "Passwords & PINs",
    href: "/#passwords",
    description: "Secure password and PIN generators",
  },
  lottery: {
    name: "Lottery Tools",
    href: "/#lottery",
    description: "Lottery number pickers and generators",
  },
  dice: {
    name: "Dice & Coins",
    href: "/#dice-coins",
    description: "Virtual dice, coins, and random games",
  },
  coins: {
    name: "Dice & Coins",
    href: "/#dice-coins",
    description: "Virtual dice, coins, and random games",
  },
  "list-tools": {
    name: "List Tools",
    href: "/#list-tools",
    description: "Pick from lists, shuffle, and wheel spinners",
  },
  "developer-tools": {
    name: "Developer Tools",
    href: "/#developer",
    description: "UUID, hex, IP, and developer utilities",
  },
  "data-generation": {
    name: "Data Generators",
    href: "/#data-generation",
    description: "Random data for testing and simulation",
  },
  math: {
    name: "Math Tools",
    href: "/#math",
    description: "Mathematical random generators",
  },
};

/**
 * Special page breadcrumbs
 * Maps non-tool pages to their breadcrumb paths
 */
export const PAGE_BREADCRUMBS: Record<string, BreadcrumbItem[]> = {
  "/combo": [
    { name: "Home", href: "/" },
    { name: "Combo Generator", href: "/combo", current: true },
  ],
  "/guides": [
    { name: "Home", href: "/" },
    { name: "Guides", href: "/guides", current: true },
  ],
  "/faq": [
    { name: "Home", href: "/" },
    { name: "FAQ", href: "/faq", current: true },
  ],
  "/about": [
    { name: "Home", href: "/" },
    { name: "About", href: "/about", current: true },
  ],
  "/privacy": [
    { name: "Home", href: "/" },
    { name: "Privacy Policy", href: "/privacy", current: true },
  ],
  "/terms": [
    { name: "Home", href: "/" },
    { name: "Terms of Service", href: "/terms", current: true },
  ],
  "/cookies": [
    { name: "Home", href: "/" },
    { name: "Cookie Policy", href: "/cookies", current: true },
  ],
};

/**
 * Get breadcrumb items for a tool page
 * @param slug - Tool slug
 * @param title - Tool title
 * @returns Array of breadcrumb items
 */
export function getToolBreadcrumbs(
  slug: string,
  title: string,
  category?: ToolCategory,
): BreadcrumbItem[] {
  const breadcrumbs: BreadcrumbItem[] = [{ name: "Home", href: "/" }];

  if (category && CATEGORY_HIERARCHY[category]) {
    breadcrumbs.push({
      name: CATEGORY_HIERARCHY[category].name,
      href: CATEGORY_HIERARCHY[category].href,
    });
  }

  breadcrumbs.push({
    name: title,
    href: `/${slug}`,
    current: true,
  });

  return breadcrumbs;
}

/**
 * Get breadcrumb items for any page
 * @param pathname - Current pathname
 * @param title - Current page title
 * @param category - Optional category for tool pages
 * @returns Array of breadcrumb items
 */
export function getBreadcrumbs(
  pathname: string,
  title?: string,
  category?: ToolCategory,
): BreadcrumbItem[] {
  // Check if it's a special page
  if (PAGE_BREADCRUMBS[pathname]) {
    return PAGE_BREADCRUMBS[pathname];
  }

  // Tool pages ( /[slug]/ format )
  const toolMatch = pathname.match(/^\/([^/]+)\/?$/);
  if (toolMatch && title) {
    return getToolBreadcrumbs(toolMatch[1], title, category);
  }

  // Default to home only
  return [{ name: "Home", href: "/", current: pathname === "/" }];
}

/**
 * Generate Schema.org BreadcrumbList structured data
 * @param breadcrumbs - Array of breadcrumb items
 * @returns JSON-LD structured data object
 */
export function generateBreadcrumbSchema(breadcrumbs: BreadcrumbItem[]) {
  const baseUrl = "https://numbergenerator.ai";

  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: breadcrumbs.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: `${baseUrl}${item.href}`,
    })),
  };
}
