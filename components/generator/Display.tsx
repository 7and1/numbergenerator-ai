"use client";

import { memo, useMemo } from "react";
import type { GenerationResult, ToolConfig } from "@/lib/types";
import WheelDisplay from "@/components/generator/WheelDisplay";
import { VirtualizedList } from "@/components/ui/VirtualizedList";
import { calculatePasswordStrength } from "@/lib/passwordStrength";

const isColorValue = (mode: ToolConfig["mode"], value: string): boolean => {
  if (mode !== "color") return false;
  return (
    value.startsWith("#") ||
    value.startsWith("rgb(") ||
    value.startsWith("hsl(")
  );
};

const asRecord = (v: unknown): Record<string, unknown> | null => {
  if (!v || typeof v !== "object") return null;
  return v as Record<string, unknown>;
};

const getNumber = (
  rec: Record<string, unknown> | null,
  key: string,
): number | null => {
  if (!rec) return null;
  const v = rec[key];
  return typeof v === "number" && Number.isFinite(v) ? v : null;
};

const getResultClass = (
  type: ToolConfig["ui"]["result_type"],
  isBonus: boolean,
) => {
  const base = "font-bold transition-all cursor-default select-all";
  const color = isBonus
    ? "bg-red-500 text-white"
    : "bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-white";

  switch (type) {
    case "bubble":
      return `${base} ${color} w-14 h-14 md:w-16 md:h-16 flex items-center justify-center rounded-full text-2xl shadow-sm`;
    case "card":
      return `${base} ${color} px-4 py-3 md:px-6 md:py-4 rounded-xl text-4xl md:text-5xl border-2 border-zinc-200 dark:border-zinc-700 font-mono tracking-widest`;
    case "text":
    default:
      return `${base} text-4xl md:text-6xl tracking-tight break-all text-center`;
  }
};

// Extract IIFE functions to standalone helpers for better performance
const getStreakLength = (meta: Record<string, unknown>): string => {
  const streak = asRecord(meta.longestStreak);
  const len = getNumber(streak, "length");
  return len === null ? "—" : String(len);
};

const getStreakSide = (meta: Record<string, unknown>): string => {
  const streak = asRecord(meta.longestStreak);
  const side = streak && typeof streak.side === "string" ? streak.side : null;
  return side ?? "";
};

const getPasswordBatch = (meta: Record<string, unknown>): string => {
  const pw = asRecord(meta.password);
  const batch = getNumber(pw, "batch");
  return batch === null ? "—" : String(batch);
};

const hasPasswordBatch = (meta: Record<string, unknown>): boolean => {
  const pw = asRecord(meta.password);
  return getNumber(pw, "batch") !== null;
};

const Display = memo(function Display({
  config,
  result,
  placeholder,
}: {
  config: ToolConfig;
  result: GenerationResult | null;
  placeholder?: string;
}) {
  // Calculate password strength for first password if applicable
  const passwordStrength = useMemo(() => {
    if (config.mode !== "password" || !result?.values?.length) return null;
    const firstPassword = String(result.values[0]);
    return calculatePasswordStrength(firstPassword);
  }, [config.mode, result?.values]);

  if (config.ui.result_type === "wheel") {
    const items = (config.params.items ?? []).map((v) => String(v));
    const selectedIndex =
      typeof result?.meta?.selectedIndex === "number"
        ? (result.meta.selectedIndex as number)
        : undefined;
    return (
      <div className="w-full flex flex-col items-center gap-4">
        {!result ? (
          <div className="text-zinc-400 font-medium animate-pulse">
            {placeholder ?? "Press to Spin"}
          </div>
        ) : null}
        <WheelDisplay
          items={items}
          selectedIndex={selectedIndex}
          resultTimestamp={result?.timestamp ?? 0}
        />
        {result?.values?.length ? (
          <div className="text-3xl md:text-4xl font-black tracking-tight text-zinc-900 dark:text-white">
            {String(result.values[0])}
          </div>
        ) : null}
      </div>
    );
  }

  const showAsCards =
    (config.ui.result_type === "bubble" || config.ui.result_type === "card") &&
    (result?.values?.length ?? 0) <= 40;
  const meta = asRecord(result?.meta);
  const resultId = `generated-result-${config.slug}`;
  const resultLabel = result
    ? `Generated ${result.values.length} ${result.values.length === 1 ? "value" : "values"}`
    : "No result generated yet";

  return (
    <div className="w-full">
      {!result ? (
        <div
          className="flex flex-wrap gap-3 justify-center items-center"
          role="status"
          aria-live="polite"
        >
          <div className="text-zinc-400 font-medium animate-pulse">
            {placeholder ?? "Press to Generate"}
          </div>
        </div>
      ) : result.values.length <= 1 && showAsCards ? (
        <div
          className="flex flex-wrap gap-3 justify-center items-center"
          role="status"
          aria-live="polite"
          aria-label={resultLabel}
        >
          {result.values.map((v, i) => (
            <span
              key={i}
              className={getResultClass(config.ui.result_type, false)}
            >
              {v}
            </span>
          ))}
          {result.bonus_values?.map((v, i) => (
            <span
              key={`b-${i}`}
              className={getResultClass(config.ui.result_type, true)}
            >
              {v}
            </span>
          ))}
        </div>
      ) : showAsCards ? (
        <div
          className="flex flex-wrap gap-3 justify-center items-center"
          role="status"
          aria-live="polite"
          aria-label={resultLabel}
        >
          {result.values.map((v, i) => (
            <span
              key={i}
              className={getResultClass(config.ui.result_type, false)}
            >
              {v}
            </span>
          ))}
          {result.bonus_values?.map((v, i) => (
            <span
              key={`b-${i}`}
              className={getResultClass(config.ui.result_type, true)}
            >
              {v}
            </span>
          ))}
        </div>
      ) : (
        <VirtualizedList
          items={[
            ...result.values.map((v, i) => ({
              value: v,
              index: i,
              type: "normal" as const,
            })),
            ...(result.bonus_values?.map((v, i) => ({
              value: v,
              index: i,
              type: "bonus" as const,
            })) ?? []),
          ]}
          renderItem={(item, i) => {
            const valueStr = String(item.value);
            const isColor = isColorValue(config.mode, valueStr);
            const isBonus = item.type === "bonus";
            return (
              <div className="flex gap-3 text-sm sm:text-base text-zinc-800 dark:text-zinc-200">
                <span className="w-10 shrink-0 text-right font-mono text-zinc-400">
                  {isBonus ? `+${item.index + 1}.` : `${i + 1}.`}
                </span>
                <span className="min-w-0 font-mono break-words">
                  {valueStr}
                </span>
                {isColor && (
                  <span
                    className="w-12 h-8 shrink-0 rounded-md border border-zinc-300 dark:border-zinc-600"
                    style={{ backgroundColor: valueStr }}
                    title={valueStr}
                  />
                )}
              </div>
            );
          }}
          getKey={(item) => `${item.type}-${item.index}`}
          estimatedItemHeight={36}
          maxHeight={320}
          ariaLabel="Generated results"
        />
      )}

      {meta && (
        <div
          className="mt-4 grid sm:grid-cols-3 gap-3 text-xs"
          role="region"
          aria-label="Generation statistics"
        >
          {config.mode === "dice" && getNumber(meta, "total") !== null && (
            <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white/70 dark:bg-black/30 p-3">
              <div className="text-zinc-400 font-bold uppercase">Total</div>
              <div className="mt-1 text-lg font-black tabular-nums">
                {String(getNumber(meta, "total"))}
              </div>
            </div>
          )}
          {config.mode === "coin" &&
            getNumber(meta, "heads") !== null &&
            getNumber(meta, "tails") !== null && (
              <>
                <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white/70 dark:bg-black/30 p-3">
                  <div className="text-zinc-400 font-bold uppercase">Heads</div>
                  <div className="mt-1 text-lg font-black tabular-nums">
                    {String(getNumber(meta, "heads"))}
                  </div>
                </div>
                <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white/70 dark:bg-black/30 p-3">
                  <div className="text-zinc-400 font-bold uppercase">Tails</div>
                  <div className="mt-1 text-lg font-black tabular-nums">
                    {String(getNumber(meta, "tails"))}
                  </div>
                </div>
                <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white/70 dark:bg-black/30 p-3">
                  <div className="text-zinc-400 font-bold uppercase">
                    Longest Streak
                  </div>
                  <div className="mt-1 text-lg font-black tabular-nums">
                    {(() => {
                      const streak = asRecord(meta.longestStreak);
                      const len = getNumber(streak, "length");
                      return len === null ? "—" : String(len);
                    })()}
                  </div>
                  <div className="mt-1 text-xs text-zinc-500 dark:text-zinc-400 font-mono">
                    {(() => {
                      const streak = asRecord(meta.longestStreak);
                      const side =
                        streak && typeof streak.side === "string"
                          ? streak.side
                          : null;
                      return side ?? "";
                    })()}
                  </div>
                </div>
              </>
            )}
          {config.mode === "ticket" &&
            getNumber(meta, "remainingCount") !== null && (
              <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white/70 dark:bg-black/30 p-3">
                <div className="text-zinc-400 font-bold uppercase">
                  Remaining
                </div>
                <div className="mt-1 text-lg font-black tabular-nums">
                  {String(getNumber(meta, "remainingCount"))}
                </div>
              </div>
            )}
          {config.mode === "password" &&
            (() => {
              const pw = asRecord(meta.password);
              const batch = getNumber(pw, "batch");
              return batch !== null;
            })() && (
              <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white/70 dark:bg-black/30 p-3">
                <div className="text-zinc-400 font-bold uppercase">Batch</div>
                <div className="mt-1 text-lg font-black tabular-nums">
                  {(() => {
                    const pw = asRecord(meta.password);
                    const batch = getNumber(pw, "batch");
                    return batch === null ? "—" : String(batch);
                  })()}
                </div>
              </div>
            )}
          {config.mode === "password" && passwordStrength && (
            <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white/70 dark:bg-black/30 p-3">
              <div className="text-zinc-400 font-bold uppercase">Strength</div>
              <div className="mt-1 flex items-center gap-2">
                <div className="flex-1 h-2 rounded-full bg-zinc-200 dark:bg-zinc-700 overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-300"
                    style={{
                      width: `${passwordStrength.score}%`,
                      backgroundColor: passwordStrength.color,
                    }}
                  />
                </div>
                <span
                  className="text-xs font-bold tabular-ns"
                  style={{ color: passwordStrength.color }}
                >
                  {passwordStrength.label}
                </span>
              </div>
              <div className="mt-1 text-xs text-zinc-500 dark:text-zinc-400 font-mono">
                {passwordStrength.entropyBits} bits
              </div>
            </div>
          )}
          {config.mode === "color" &&
            (() => {
              const format = meta.format as string | undefined;
              return (
                format && (
                  <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white/70 dark:bg-black/30 p-3">
                    <div className="text-zinc-400 font-bold uppercase">
                      Format
                    </div>
                    <div className="mt-1 text-lg font-black tabular-nums">
                      {String(format)}
                    </div>
                  </div>
                )
              );
            })()}
          {config.mode === "hex" && getNumber(meta, "bytes") !== null && (
            <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white/70 dark:bg-black/30 p-3">
              <div className="text-zinc-400 font-bold uppercase">Bytes</div>
              <div className="mt-1 text-lg font-black tabular-nums">
                {String(getNumber(meta, "bytes"))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
});

export { Display };
Display.displayName = "Display";
