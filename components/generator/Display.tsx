"use client";

import type { GenerationResult, ToolConfig } from "@/lib/types";
import WheelDisplay from "@/components/generator/WheelDisplay";

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

export function Display({
  config,
  result,
  placeholder,
}: {
  config: ToolConfig;
  result: GenerationResult | null;
  placeholder?: string;
}) {
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

  return (
    <div className="w-full">
      {!result ? (
        <div className="flex flex-wrap gap-3 justify-center items-center">
          <div className="text-zinc-400 font-medium animate-pulse">
            {placeholder ?? "Press to Generate"}
          </div>
        </div>
      ) : result.values.length <= 1 && showAsCards ? (
        <div className="flex flex-wrap gap-3 justify-center items-center">
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
        <div className="flex flex-wrap gap-3 justify-center items-center">
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
        <div className="w-full max-h-[320px] overflow-auto rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950/30 p-4">
          <ol className="space-y-1.5">
            {result.values.map((v, i) => {
              const valueStr = String(v);
              const isColor = isColorValue(config.mode, valueStr);
              return (
                <li
                  key={i}
                  className="flex gap-3 text-sm sm:text-base text-zinc-800 dark:text-zinc-200"
                >
                  <span className="w-10 shrink-0 text-right font-mono text-zinc-400">
                    {i + 1}.
                  </span>
                  <span className="min-w-0 font-mono break-words">
                    {String(v)}
                  </span>
                  {isColor && (
                    <span
                      className="w-12 h-8 shrink-0 rounded-md border border-zinc-300 dark:border-zinc-600"
                      style={{ backgroundColor: valueStr }}
                      title={valueStr}
                    />
                  )}
                </li>
              );
            })}
            {result.bonus_values?.map((v, i) => (
              <li
                key={`b-${i}`}
                className="flex gap-3 text-sm sm:text-base text-red-700 dark:text-red-300"
              >
                <span className="w-10 shrink-0 text-right font-mono text-red-400">
                  +{i + 1}.
                </span>
                <span className="min-w-0 font-mono break-words">
                  {String(v)}
                </span>
              </li>
            ))}
          </ol>
        </div>
      )}

      {meta && (
        <div className="mt-4 grid sm:grid-cols-3 gap-3 text-xs">
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
}
