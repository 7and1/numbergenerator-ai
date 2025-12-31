"use client";

import { useEffect, useMemo, useState } from "react";

const COLORS = [
  "#111827", // zinc-900
  "#2563EB", // blue-600
  "#16A34A", // green-600
  "#DC2626", // red-600
  "#7C3AED", // purple-600
  "#EA580C", // orange-600
  "#0891B2", // cyan-600
  "#CA8A04", // yellow-600
] as const;

const clampInt = (v: unknown, min: number, max: number, fallback: number) => {
  const n =
    typeof v === "number" && Number.isFinite(v) ? Math.floor(v) : fallback;
  return Math.min(max, Math.max(min, n));
};

export default function WheelDisplay({
  items,
  selectedIndex,
  resultTimestamp,
}: {
  items: string[];
  selectedIndex?: number;
  resultTimestamp: number;
}) {
  const safeItems = useMemo(
    () => items.filter((s) => String(s).trim().length > 0).slice(0, 24),
    [items],
  );
  const n = safeItems.length || 2;

  const [rotation, setRotation] = useState(0);
  const [isReducedMotion, setIsReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setIsReducedMotion(mediaQuery.matches);
    const listener = () => setIsReducedMotion(mediaQuery.matches);
    mediaQuery.addEventListener("change", listener);
    return () => mediaQuery.removeEventListener("change", listener);
  }, []);

  useEffect(() => {
    if (typeof selectedIndex !== "number" || !Number.isFinite(selectedIndex))
      return;
    if (safeItems.length < 2) return;

    const idx = clampInt(selectedIndex, 0, safeItems.length - 1, 0);
    const seg = 360 / safeItems.length;
    const center = (idx + 0.5) * seg;

    const baseTurns = Math.floor(rotation / 360);
    const targetTurns = isReducedMotion ? baseTurns : baseTurns + 6;
    const target = targetTurns * 360 + (360 - center);
    setRotation(target);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [resultTimestamp, isReducedMotion]);

  const gradient = useMemo(() => {
    const parts: string[] = [];
    for (let i = 0; i < n; i++) {
      const c = COLORS[i % COLORS.length]!;
      const a = (i / n) * 360;
      const b = ((i + 1) / n) * 360;
      parts.push(`${c} ${a}deg ${b}deg`);
    }
    return `conic-gradient(${parts.join(",")})`;
  }, [n]);

  if (safeItems.length < 2) {
    return (
      <div
        className="w-full flex items-center justify-center rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950/30 p-6 text-sm text-zinc-500"
        role="status"
        aria-live="polite"
      >
        Add at least 2 items to spin.
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col items-center gap-4">
      <div className="relative w-[240px] h-[240px] sm:w-[280px] sm:h-[280px] md:w-[320px] md:h-[320px]">
        <div
          className="absolute left-1/2 -translate-x-1/2 -top-2 z-10"
          aria-hidden="true"
        >
          <div className="w-0 h-0 border-l-[10px] border-r-[10px] border-b-[18px] border-l-transparent border-r-transparent border-b-black dark:border-b-white" />
        </div>

        <div
          className="absolute inset-0 rounded-full border border-zinc-200 dark:border-zinc-800 shadow-sm overflow-hidden"
          style={{
            backgroundImage: gradient,
            transform: `rotate(${rotation}deg)`,
            transition: isReducedMotion
              ? "transform 0.3s ease-out"
              : "transform 1400ms cubic-bezier(0.12, 0.8, 0.15, 1)",
          }}
          role="img"
          aria-label={`Spinning wheel with ${safeItems.length} segments`}
        />

        <div
          className="absolute inset-3 rounded-full border border-white/50 dark:border-black/30 pointer-events-none"
          aria-hidden="true"
        />

        {/* Center indicator */}
        <div
          className="absolute inset-0 flex items-center justify-center pointer-events-none"
          aria-hidden="true"
        >
          <div className="w-4 h-4 rounded-full bg-white dark:bg-black border-2 border-zinc-200 dark:border-zinc-800 shadow-sm" />
        </div>
      </div>

      <div
        className="w-full max-w-[420px] grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs"
        role="list"
        aria-label="Wheel segments"
      >
        {safeItems.map((label, i) => {
          const active =
            typeof selectedIndex === "number" &&
            i === clampInt(selectedIndex, 0, safeItems.length - 1, -1);
          const color = COLORS[i % COLORS.length]!;
          return (
            <div
              key={`${label}-${i}`}
              role="listitem"
              aria-selected={active}
              className={[
                "flex items-center gap-2 rounded-xl border px-2 sm:px-3 py-2 transition-colors",
                active
                  ? "border-black dark:border-white bg-white dark:bg-black text-zinc-900 dark:text-white shadow-sm"
                  : "border-zinc-200 dark:border-zinc-800 bg-white/60 dark:bg-black/20 text-zinc-700 dark:text-zinc-300",
              ].join(" ")}
            >
              <span
                className="h-2.5 w-2.5 rounded-full flex-shrink-0"
                style={{ backgroundColor: color }}
                aria-hidden="true"
              />
              <span className="min-w-0 truncate font-mono text-xs sm:text-sm">
                {label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
