"use client";

import { useMemo } from "react";
import { Clock, Trash2 } from "lucide-react";
import { VirtualizedList } from "@/components/ui/VirtualizedList";

export interface TicketLogEntry {
  timestamp: number;
  values: (string | number)[];
}

export interface TicketLogViewerProps {
  log: TicketLogEntry[];
  onClear: () => void;
  onExport: (format: "csv" | "json" | "txt") => void;
  className?: string;
}

export function TicketLogViewer({
  log,
  onClear,
  onExport,
  className,
}: TicketLogViewerProps) {
  // Prepare items for virtualized list - reverse to show newest first
  const items = useMemo(() => {
    return [...log].reverse().map((entry, reversedIndex) => ({
      ...entry,
      drawIndex: log.length - reversedIndex,
    }));
  }, [log]);

  const isEmpty = log.length === 0;

  return (
    <div className={className}>
      <div className="flex items-center justify-between mb-3">
        <h2 className="flex items-center gap-2 text-xs text-zinc-400 font-bold uppercase tracking-wider">
          <Clock size={14} aria-hidden="true" /> Draw Log
        </h2>
        <div className="flex items-center gap-2">
          <span className="text-xs text-zinc-500 dark:text-zinc-400 font-mono">
            {log.length} {log.length === 1 ? "entry" : "entries"}
          </span>
          {!isEmpty && (
            <button
              type="button"
              onClick={onClear}
              className="h-8 px-2 rounded-lg border border-zinc-200 dark:border-zinc-800 text-xs font-bold text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-900 hover:text-red-600 dark:hover:text-red-400 transition-colors flex items-center gap-1"
              aria-label="Clear draw log"
            >
              <Trash2 size={12} aria-hidden="true" /> Clear
            </button>
          )}
        </div>
      </div>

      {isEmpty ? (
        <div className="rounded-xl border border-dashed border-zinc-300 dark:border-zinc-700 bg-zinc-50/50 dark:bg-zinc-900/30 p-6 text-center">
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            No draws yet. Generate some numbers to see your history here.
          </p>
        </div>
      ) : (
        <VirtualizedList
          items={items}
          renderItem={(item) => (
            <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3 py-2 border-b border-zinc-100 dark:border-zinc-800 last:border-0">
              <div className="flex items-center gap-2 shrink-0">
                <span className="text-xs font-mono text-zinc-400 w-16">
                  #{item.drawIndex}
                </span>
                <span className="text-xs text-zinc-500 dark:text-zinc-400">
                  {new Date(item.timestamp).toLocaleTimeString()}
                </span>
              </div>
              <div className="flex flex-wrap gap-1.5 text-sm font-mono text-zinc-700 dark:text-zinc-300">
                {item.values.map((v, i) => (
                  <span
                    key={i}
                    className="px-2 py-0.5 bg-zinc-100 dark:bg-zinc-800 rounded text-xs"
                  >
                    {String(v)}
                  </span>
                ))}
              </div>
            </div>
          )}
          getKey={(item) => String(item.timestamp)}
          estimatedItemHeight={50}
          maxHeight={240}
          emptyTitle="No draws yet"
          emptyDescription="Generate some numbers to see your history here."
          ariaLabel="Ticket draw log"
        />
      )}

      {!isEmpty && (
        <div className="mt-3 flex flex-wrap gap-2 justify-start">
          <button
            type="button"
            onClick={() => onExport("csv")}
            className="h-8 px-3 rounded-lg border border-zinc-200 dark:border-zinc-800 text-xs font-bold text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-colors"
          >
            Export CSV
          </button>
          <button
            type="button"
            onClick={() => onExport("json")}
            className="h-8 px-3 rounded-lg border border-zinc-200 dark:border-zinc-800 text-xs font-bold text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-colors"
          >
            Export JSON
          </button>
          <button
            type="button"
            onClick={() => onExport("txt")}
            className="h-8 px-3 rounded-lg border border-zinc-200 dark:border-zinc-800 text-xs font-bold text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-colors"
          >
            Export TXT
          </button>
        </div>
      )}
    </div>
  );
}
