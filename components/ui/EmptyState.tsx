"use client";

import { type ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Package, Search, FileText, Inbox } from "lucide-react";

export type EmptyStateType =
  | "no-data"
  | "no-results"
  | "no-content"
  | "no-items";

const emptyStateConfig = {
  "no-data": {
    icon: Inbox,
    title: "No data yet",
    description: "Get started by adding some data.",
  },
  "no-results": {
    icon: Search,
    title: "No results found",
    description: "Try adjusting your search or filter criteria.",
  },
  "no-content": {
    icon: FileText,
    title: "No content",
    description: "There is no content to display at the moment.",
  },
  "no-items": {
    icon: Package,
    title: "No items",
    description: "There are no items in this list.",
  },
};

export interface EmptyStateProps {
  type?: EmptyStateType;
  title?: string;
  description?: string;
  icon?: ReactNode;
  action?: ReactNode;
  className?: string;
  size?: "sm" | "md" | "lg";
}

export function EmptyState({
  type = "no-data",
  title,
  description,
  icon,
  action,
  className,
  size = "md",
}: EmptyStateProps) {
  const config = emptyStateConfig[type];
  const Icon = config.icon;

  const sizeStyles = {
    sm: { icon: "w-10 h-10", text: "text-sm" },
    md: { icon: "w-14 h-14", text: "text-base" },
    lg: { icon: "w-20 h-20", text: "text-lg" },
  };

  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center text-center p-8",
        "bg-zinc-50 dark:bg-zinc-900/30",
        "rounded-2xl border border-zinc-200 dark:border-zinc-800",
        className,
      )}
    >
      <div
        className={cn(
          "flex items-center justify-center rounded-full",
          "bg-zinc-100 dark:bg-zinc-800",
          "text-zinc-400 dark:text-zinc-500",
          "mb-4",
          sizeStyles[size].icon,
          size === "sm" ? "p-2" : size === "lg" ? "p-4" : "p-3",
        )}
      >
        {icon ? (
          <div className="w-1/2 h-1/2 flex items-center justify-center">
            {icon}
          </div>
        ) : (
          <Icon className="w-1/2 h-1/2" aria-hidden="true" />
        )}
      </div>

      {title && (
        <h3
          className={cn(
            "font-semibold text-zinc-900 dark:text-white",
            sizeStyles[size].text,
          )}
        >
          {title}
        </h3>
      )}
      {!title && (
        <h3
          className={cn(
            "font-semibold text-zinc-900 dark:text-white",
            sizeStyles[size].text,
          )}
        >
          {config.title}
        </h3>
      )}

      {description && (
        <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400 max-w-xs">
          {description}
        </p>
      )}
      {!description && (
        <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400 max-w-xs">
          {config.description}
        </p>
      )}

      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}
