"use client";

import Link from "next/link";
import { ChevronRight, Home } from "lucide-react";
import { cn } from "@/lib/utils";
import type { BreadcrumbItem } from "@/lib/breadcrumbs";

export interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  className?: string;
  /**
   * Maximum number of breadcrumb items to show on mobile
   * If exceeded, intermediate items will be collapsed
   * @default 3
   */
  maxMobileItems?: number;
}

/**
 * Breadcrumb navigation component with Schema.org structured data support
 *
 * Features:
 * - Home > Category > Current page hierarchy
 * - Clickable navigation links
 * - Mobile-friendly truncation
 * - Separator icons
 * - ARIA labels for accessibility
 *
 * @example
 * ```tsx
 * <Breadcrumbs items={[
 *   { name: "Home", href: "/" },
 *   { name: "Number Generators", href: "/#numbers" },
 *   { name: "Random Number 1-100", href: "/1-100", current: true }
 * ]} />
 * ```
 */
export function Breadcrumbs({
  items,
  className,
  maxMobileItems = 3,
}: BreadcrumbsProps) {
  // For mobile: show first item + last item if too many
  const mobileItems =
    items.length <= maxMobileItems
      ? items
      : [items[0], { name: "...", href: "#" }, ...items.slice(-2)];

  return (
    <>
      {/* Schema.org structured data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: items.map((item, index) => ({
              "@type": "ListItem",
              position: index + 1,
              name: item.name,
              item: `https://numbergenerator.ai${item.href}`,
            })),
          }),
        }}
      />

      {/* Visible breadcrumbs */}
      <nav
        className={cn("w-full", className)}
        aria-label="Breadcrumb"
        itemScope
        itemType="https://schema.org/BreadcrumbList"
      >
        {/* Desktop: full breadcrumbs */}
        <ol className="hidden md:flex items-center gap-2 text-sm">
          {items.map((item, index) => (
            <li
              key={item.href}
              className="flex items-center gap-2"
              itemProp="itemListElement"
              itemScope
              itemType="https://schema.org/ListItem"
            >
              <meta itemProp="position" content={String(index + 1)} />

              {index === 0 && (
                <Home className="w-4 h-4 text-zinc-400" aria-hidden="true" />
              )}

              {item.current ? (
                <span
                  className="text-zinc-900 dark:text-zinc-100 font-medium"
                  itemProp="name"
                  aria-current="page"
                >
                  {item.name}
                </span>
              ) : (
                <Link
                  href={item.href}
                  className="text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors"
                  itemProp="item"
                >
                  <span itemProp="name">{item.name}</span>
                </Link>
              )}

              {index < items.length - 1 && (
                <ChevronRight
                  className="w-4 h-4 text-zinc-300 dark:text-zinc-700"
                  aria-hidden="true"
                />
              )}
            </li>
          ))}
        </ol>

        {/* Mobile: truncated breadcrumbs */}
        <ol className="md:hidden flex items-center gap-1 text-sm">
          {mobileItems.map((item, index) => (
            <li
              key={item.href}
              className="flex items-center gap-1"
              itemProp="itemListElement"
              itemScope
              itemType="https://schema.org/ListItem"
            >
              <meta itemProp="position" content={String(index + 1)} />

              {item.name === "..." ? (
                <span className="text-zinc-400 px-1">...</span>
              ) : item.current ? (
                <span
                  className="text-zinc-900 dark:text-zinc-100 font-medium truncate max-w-[150px]"
                  itemProp="name"
                  aria-current="page"
                >
                  {item.name}
                </span>
              ) : (
                <Link
                  href={item.href}
                  className={cn(
                    "transition-colors",
                    index === 0
                      ? "text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100"
                      : "text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 truncate max-w-[100px]",
                  )}
                  itemProp="item"
                >
                  <span itemProp="name">{item.name}</span>
                </Link>
              )}

              {index < mobileItems.length - 1 && item.name !== "..." && (
                <ChevronRight
                  className="w-3.5 h-3.5 text-zinc-300 dark:text-zinc-700 flex-shrink-0"
                  aria-hidden="true"
                />
              )}
            </li>
          ))}
        </ol>
      </nav>
    </>
  );
}

/**
 * Compact breadcrumb variant for smaller spaces
 * Shows only the category and current page on mobile
 */
export interface CompactBreadcrumbsProps {
  items: BreadcrumbItem[];
  categoryLabel?: string;
  className?: string;
}

export function CompactBreadcrumbs({
  items,
  categoryLabel = "Tools",
  className,
}: CompactBreadcrumbsProps) {
  if (items.length < 2) return null;

  // Find category (second-to-last item) and current (last item)
  const category = items[items.length - 2];
  const current = items[items.length - 1];
  const categoryName = category.name === "..." ? categoryLabel : category.name;

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: items.map((item, index) => ({
              "@type": "ListItem",
              position: index + 1,
              name: item.name,
              item: `https://numbergenerator.ai${item.href}`,
            })),
          }),
        }}
      />

      <nav
        className={cn("flex items-center gap-2 text-sm", className)}
        aria-label="Breadcrumb"
      >
        <Link
          href={category.href}
          className="text-zinc-500 dark:text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-300 transition-colors"
        >
          {categoryName}
        </Link>
        <ChevronRight className="w-3.5 h-3.5 text-zinc-300 dark:text-zinc-700" />
        <span className="text-zinc-900 dark:text-zinc-100 font-medium">
          {current.name}
        </span>
      </nav>
    </>
  );
}
