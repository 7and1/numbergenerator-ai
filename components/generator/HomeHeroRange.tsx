"use client";

import { useCallback, useMemo, useState } from "react";
import { Copy, RefreshCw, Share2 } from "lucide-react";

import { generate } from "@/lib/engine";

const clampInt = (value: number, fallback: number) => {
  if (!Number.isFinite(value)) return fallback;
  return Math.trunc(value);
};

const buildSharePath = (min: number, max: number) => {
  let a = clampInt(min, 1);
  let b = clampInt(max, 10);
  if (b < a) [a, b] = [b, a];
  return `/${a}-${b}/`;
};

export default function HomeHeroRange({
  defaultMin = 1,
  defaultMax = 10,
}: {
  defaultMin?: number;
  defaultMax?: number;
}) {
  const [min, setMin] = useState<number>(defaultMin);
  const [max, setMax] = useState<number>(defaultMax);
  const [result, setResult] = useState<string | null>(null);
  const [animating, setAnimating] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  const shareUrl = useMemo(() => {
    if (typeof window === "undefined") return "";
    return new URL(buildSharePath(min, max), window.location.origin).toString();
  }, [min, max]);

  const displayRange = useMemo(() => {
    let a = clampInt(min, defaultMin);
    let b = clampInt(max, defaultMax);
    if (b < a) [a, b] = [b, a];
    return { min: a, max: b };
  }, [min, max, defaultMin, defaultMax]);

  const fireToast = (msg: string) => {
    setToast(msg);
    window.setTimeout(() => setToast(null), 1200);
  };

  const handleGenerate = useCallback(() => {
    if (typeof navigator !== "undefined" && navigator.vibrate)
      navigator.vibrate(10);
    setAnimating(true);
    window.setTimeout(() => setAnimating(false), 200);

    const res = generate("range", {
      min: displayRange.min,
      max: displayRange.max,
      count: 1,
      step: 1,
      precision: 0,
    });
    setResult(String(res.values[0] ?? res.formatted));
  }, [displayRange.max, displayRange.min]);

  const handleCopy = async () => {
    const text = result ? `${result}\n${shareUrl}` : shareUrl;
    try {
      await navigator.clipboard.writeText(text);
      fireToast("Copied");
    } catch {
      fireToast("Copy blocked");
    }
  };

  const handleShare = async () => {
    const title = `Random Number ${displayRange.min}-${displayRange.max}`;
    const text = result
      ? `Random number: ${result}`
      : "Generate a random number instantly.";

    // Prefer Web Share API on mobile; fallback to clipboard.
    if (typeof navigator !== "undefined" && "share" in navigator) {
      const share = (
        navigator as unknown as { share?: (data: ShareData) => Promise<void> }
      ).share;
      try {
        if (share) await share({ title, text, url: shareUrl });
        fireToast("Shared");
        return;
      } catch {
        // user canceled or blocked; fallback
      }
    }
    await handleCopy();
  };

  return (
    <section className="rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950/30 shadow-sm overflow-hidden">
      <div className="relative p-6 sm:p-8">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="text-xs font-bold tracking-wider uppercase text-zinc-400">
              Random Number Generator
            </div>
            <div className="mt-1 text-2xl sm:text-3xl font-black tracking-tight">
              {displayRange.min}–{displayRange.max}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleShare}
              aria-label="Share"
              className="h-10 w-10 inline-flex items-center justify-center rounded-xl border border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-colors"
            >
              <Share2 size={18} />
            </button>
            <button
              type="button"
              onClick={handleCopy}
              aria-label="Copy"
              className="h-10 w-10 inline-flex items-center justify-center rounded-xl border border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-colors"
            >
              <Copy size={18} />
            </button>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-6 items-stretch">
          <div
            className={[
              "sm:col-span-2 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-black",
              "min-h-[140px] flex items-center justify-start px-6",
              animating ? "scale-[0.995]" : "scale-100",
              "transition-transform duration-150",
            ].join(" ")}
          >
            <div className="text-6xl sm:text-7xl font-black tracking-tight text-zinc-900 dark:text-white tabular-nums">
              {result ?? "—"}
            </div>
          </div>

          <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-black p-4 space-y-4">
            <label className="block">
              <div className="text-xs font-bold text-zinc-400 uppercase mb-1">
                Min
              </div>
              <input
                type="number"
                value={min}
                onChange={(e) => setMin(Number(e.target.value))}
                className="w-full bg-transparent text-2xl font-black text-zinc-900 dark:text-white outline-none font-mono"
              />
            </label>
            <label className="block">
              <div className="text-xs font-bold text-zinc-400 uppercase mb-1">
                Max
              </div>
              <input
                type="number"
                value={max}
                onChange={(e) => setMax(Number(e.target.value))}
                className="w-full bg-transparent text-2xl font-black text-zinc-900 dark:text-white outline-none font-mono"
              />
            </label>
          </div>
        </div>

        {toast && (
          <div className="absolute top-4 left-1/2 -translate-x-1/2 px-3 py-1.5 rounded-full text-xs font-bold bg-black text-white dark:bg-white dark:text-black shadow">
            {toast}
          </div>
        )}
      </div>

      <button
        type="button"
        onClick={handleGenerate}
        className="w-full h-14 bg-black text-white dark:bg-white dark:text-black font-black tracking-wide flex items-center justify-center gap-2"
      >
        {animating && <RefreshCw className="animate-spin" size={20} />}
        GENERATE
      </button>
    </section>
  );
}
