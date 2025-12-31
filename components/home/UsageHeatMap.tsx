"use client";

import Link from "next/link";
import { BarChart3, Flame, Trash2 } from "lucide-react";
import { useSyncExternalStore } from "react";
import { cn } from "@/lib/utils";
import {
  getUsageData,
  clearUsageData,
  type UsageEntry,
} from "@/lib/usageTracker";

const subscribeUsage = (callback: () => void) => {
  // Listen for storage events from other tabs
  const handler = () => callback();
  window.addEventListener("storage", handler);
  window.addEventListener("ng:usage-updated", callback);
  return () => {
    window.removeEventListener("storage", handler);
    window.removeEventListener("ng:usage-updated", callback);
  };
};

const getUsageSnapshot = () => {
  return getUsageData();
};

const getServerSnapshot = () => {
  return [];
};

function HeatBar({ percentage }: { percentage: number }) {
  return (
    <div className="h-2 bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden flex-1">
      <div
        className={cn(
          "h-full rounded-full transition-all duration-500",
          percentage >= 50
            ? "bg-gradient-to-r from-orange-500 to-red-500"
            : "bg-gradient-to-r from-yellow-400 to-orange-400",
        )}
        style={{ width: `${Math.min(100, percentage)}%` }}
      />
    </div>
  );
}

export function UsageHeatMap() {
  const usageData = useSyncExternalStore(
    subscribeUsage,
    getUsageSnapshot,
    getServerSnapshot,
  ) as UsageEntry[];

  if (usageData.length === 0) {
    return null;
  }

  const maxCount = Math.max(...usageData.map((e) => e.count), 1);
  const topTools = usageData.slice(0, 8);

  const handleClear = () => {
    if (confirm("Clear all usage history?")) {
      clearUsageData();
      window.dispatchEvent(new Event("ng:usage-updated"));
    }
  };

  return (
    <section className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950/30 p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Flame className="w-5 h-5 text-orange-500" />
          <h2 className="text-lg font-bold tracking-tight">Most Used Tools</h2>
        </div>
        <button
          type="button"
          onClick={handleClear}
          className="text-xs font-bold text-zinc-500 hover:text-zinc-900 dark:hover:text-white inline-flex items-center gap-2"
        >
          <Trash2 size={14} />
          Clear
        </button>
      </div>

      <div className="space-y-3">
        {topTools.map((entry) => {
          const percentage = (entry.count / maxCount) * 100;
          return (
            <Link
              key={entry.toolSlug}
              href={`/${entry.toolSlug}`}
              className="block group"
            >
              <div className="flex items-center gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-medium text-zinc-900 dark:text-white group-hover:underline truncate">
                      {entry.toolTitle}
                    </span>
                    <span className="text-xs font-mono text-zinc-500 flex-shrink-0 ml-2">
                      {entry.count}x
                    </span>
                  </div>
                  <HeatBar percentage={percentage} />
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      {usageData.length > 8 && (
        <div className="mt-4 pt-4 border-t border-zinc-200 dark:border-zinc-800 text-center">
          <Link
            href="/"
            className="text-sm font-bold text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white inline-flex items-center gap-2"
          >
            <BarChart3 size={16} />
            View all tools
          </Link>
        </div>
      )}
    </section>
  );
}
