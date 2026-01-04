"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  useSyncExternalStore,
} from "react";
import { Copy, Download, History, RefreshCw, Code } from "lucide-react";

import { generate } from "@/lib/engine";
import type {
  GenerationResult,
  GeneratorParams,
  ToolConfig,
} from "@/lib/types";
import { Controls } from "@/components/generator/Controls";
import { Display } from "@/components/generator/Display";
import { Toast } from "@/components/ui/Toast";
import { WarningAlert } from "@/components/ui/WarningAlert";
import { addRecent } from "@/lib/userData";
import {
  validateGeneratorParams,
  validateHistoryArray,
  validateTicketLog,
  validateGenerationResult,
  safeParseAndValidate,
} from "@/lib/validators";
import {
  trackToolGenerate,
  trackToolCopy,
  trackToolExport,
} from "@/lib/analytics";
import { trackToolUsage } from "@/lib/usageTracker";
import { EmbedCode } from "@/components/tool/EmbedCode";
import { TicketLogViewer } from "@/components/generator/TicketLogViewer";

// Utility function for conditional className
const cn = (...classes: (string | false | undefined | null)[]) => {
  return classes.filter(Boolean).join(" ");
};

const isTypingElement = (el: Element | null) => {
  if (!el) return false;
  const tag = el.tagName;
  return tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT";
};

const TOOL_STATE_PREFIX = "ng:toolState:v1:";

const EMPTY_TICKET_LOG: Array<{
  timestamp: number;
  values: (string | number)[];
}> = [];
const EMPTY_STRING_ARRAY: string[] = [];

const parseBool = (v: string | null) =>
  v === "1" || v === "true" ? true : v === "0" || v === "false" ? false : null;

const parseNumber = (v: string | null) => {
  if (v === null) return null;
  const n = Number(v);
  return Number.isFinite(n) ? n : null;
};

const asRecord = (v: unknown): Record<string, unknown> | null => {
  if (!v || typeof v !== "object") return null;
  return v as Record<string, unknown>;
};

const asStringArray = (v: unknown): string[] | null => {
  if (!Array.isArray(v)) return null;
  if (!v.every((x) => typeof x === "string")) return null;
  return v as string[];
};

const parseParamsFromUrl = (
  mode: ToolConfig["mode"],
  sp: URLSearchParams,
): Partial<GeneratorParams> => {
  if (mode === "range") {
    const min = parseNumber(sp.get("min"));
    const max = parseNumber(sp.get("max"));
    const step = parseNumber(sp.get("step"));
    const precision = parseNumber(sp.get("precision"));
    const count = parseNumber(sp.get("count"));
    const unique = parseBool(sp.get("unique"));
    const sort = sp.get("sort");
    return {
      ...(min !== null ? { min } : {}),
      ...(max !== null ? { max } : {}),
      ...(step !== null ? { step } : {}),
      ...(precision !== null ? { precision } : {}),
      ...(count !== null ? { count } : {}),
      ...(unique !== null ? { unique } : {}),
      ...(sort === "asc" || sort === "desc" ? { sort } : {}),
    };
  }
  if (mode === "password") {
    const length = parseNumber(sp.get("length"));
    const grouping = parseBool(sp.get("grouping"));
    const count = parseNumber(sp.get("count"));
    const charset = sp.get("charset");
    const include_lower = parseBool(sp.get("include_lower"));
    const include_upper = parseBool(sp.get("include_upper"));
    const include_digits = parseBool(sp.get("include_digits"));
    const include_symbols = parseBool(sp.get("include_symbols"));
    const exclude_ambiguous = parseBool(sp.get("exclude_ambiguous"));
    const ensure_each = parseBool(sp.get("ensure_each"));
    return {
      ...(length !== null ? { length } : {}),
      ...(grouping !== null ? { grouping } : {}),
      ...(count !== null ? { count } : {}),
      ...(charset ? { charset: charset as GeneratorParams["charset"] } : {}),
      ...(charset === "custom"
        ? { custom_charset: sp.get("custom_charset") ?? "" }
        : {}),
      ...(include_lower !== null ? { include_lower } : {}),
      ...(include_upper !== null ? { include_upper } : {}),
      ...(include_digits !== null ? { include_digits } : {}),
      ...(include_symbols !== null ? { include_symbols } : {}),
      ...(exclude_ambiguous !== null ? { exclude_ambiguous } : {}),
      ...(ensure_each !== null ? { ensure_each } : {}),
      ...(sp.get("exclude_chars")
        ? { exclude_chars: sp.get("exclude_chars") ?? "" }
        : {}),
    };
  }
  if (mode === "list") {
    const count = parseNumber(sp.get("count"));
    const unique = parseBool(sp.get("unique"));
    const group_size = parseNumber(sp.get("group_size"));
    return {
      ...(count !== null ? { count } : {}),
      ...(unique !== null ? { unique } : {}),
      ...(group_size !== null ? { group_size } : {}),
    };
  }
  if (mode === "shuffle") {
    const group_size = parseNumber(sp.get("group_size"));
    return { ...(group_size !== null ? { group_size } : {}) };
  }
  if (mode === "dice") {
    const dice_sides = parseNumber(sp.get("sides"));
    const dice_rolls = parseNumber(sp.get("rolls"));
    const dice_modifier = parseNumber(sp.get("mod"));
    const dice_adv = sp.get("adv");
    return {
      ...(dice_sides !== null ? { dice_sides } : {}),
      ...(dice_rolls !== null ? { dice_rolls } : {}),
      ...(dice_modifier !== null ? { dice_modifier } : {}),
      ...(dice_adv === "none" ||
      dice_adv === "advantage" ||
      dice_adv === "disadvantage"
        ? { dice_adv }
        : {}),
    };
  }
  if (mode === "coin") {
    const coin_flips = parseNumber(sp.get("flips"));
    return {
      ...(coin_flips !== null ? { coin_flips, count: coin_flips } : {}),
    };
  }
  if (mode === "ticket") {
    const source = sp.get("source");
    const min = parseNumber(sp.get("min"));
    const max = parseNumber(sp.get("max"));
    const count = parseNumber(sp.get("count"));
    return {
      ...(source === "range" || source === "list"
        ? { ticket_source: source }
        : {}),
      ...(min !== null ? { min } : {}),
      ...(max !== null ? { max } : {}),
      ...(count !== null ? { count, pick: count } : {}),
    };
  }
  return {};
};

const buildSearchParams = (
  mode: ToolConfig["mode"],
  params: GeneratorParams,
): URLSearchParams => {
  const sp = new URLSearchParams();
  if (mode === "range") {
    if (typeof params.min === "number") sp.set("min", String(params.min));
    if (typeof params.max === "number") sp.set("max", String(params.max));
    if (typeof params.step === "number") sp.set("step", String(params.step));
    if (typeof params.precision === "number")
      sp.set("precision", String(params.precision));
    if (typeof params.count === "number") sp.set("count", String(params.count));
    if (typeof params.unique === "boolean")
      sp.set("unique", params.unique ? "1" : "0");
    if (params.sort === "asc" || params.sort === "desc")
      sp.set("sort", params.sort);
  }
  if (mode === "password") {
    if (typeof params.length === "number")
      sp.set("length", String(params.length));
    if (typeof params.grouping === "boolean")
      sp.set("grouping", params.grouping ? "1" : "0");
    if (typeof params.count === "number") sp.set("count", String(params.count));
    if (params.charset) sp.set("charset", params.charset);
    if (params.charset === "custom")
      sp.set("custom_charset", params.custom_charset ?? "");

    if (typeof params.include_lower === "boolean")
      sp.set("include_lower", params.include_lower ? "1" : "0");
    if (typeof params.include_upper === "boolean")
      sp.set("include_upper", params.include_upper ? "1" : "0");
    if (typeof params.include_digits === "boolean")
      sp.set("include_digits", params.include_digits ? "1" : "0");
    if (typeof params.include_symbols === "boolean")
      sp.set("include_symbols", params.include_symbols ? "1" : "0");
    if (typeof params.exclude_ambiguous === "boolean")
      sp.set("exclude_ambiguous", params.exclude_ambiguous ? "1" : "0");
    if (typeof params.ensure_each === "boolean")
      sp.set("ensure_each", params.ensure_each ? "1" : "0");
    if (typeof params.exclude_chars === "string" && params.exclude_chars.length)
      sp.set("exclude_chars", params.exclude_chars);
  }
  if (mode === "list") {
    if (typeof params.count === "number") sp.set("count", String(params.count));
    if (typeof params.unique === "boolean")
      sp.set("unique", params.unique ? "1" : "0");
    if (typeof params.group_size === "number")
      sp.set("group_size", String(params.group_size));
  }
  if (mode === "shuffle") {
    if (typeof params.group_size === "number")
      sp.set("group_size", String(params.group_size));
  }
  if (mode === "dice") {
    if (typeof params.dice_sides === "number")
      sp.set("sides", String(params.dice_sides));
    if (typeof params.dice_rolls === "number")
      sp.set("rolls", String(params.dice_rolls));
    if (typeof params.dice_modifier === "number")
      sp.set("mod", String(params.dice_modifier));
    if (typeof params.dice_adv === "string") sp.set("adv", params.dice_adv);
  }
  if (mode === "coin") {
    if (typeof params.coin_flips === "number")
      sp.set("flips", String(params.coin_flips));
  }
  if (mode === "ticket") {
    if (params.ticket_source) sp.set("source", params.ticket_source);
    if (typeof params.min === "number") sp.set("min", String(params.min));
    if (typeof params.max === "number") sp.set("max", String(params.max));
    if (typeof params.count === "number") sp.set("count", String(params.count));
  }
  return sp;
};

const downloadText = (filename: string, text: string) => {
  const blob = new Blob([text], { type: "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
};

const rangeCapacity = (min?: number, max?: number, step?: number) => {
  if (
    typeof min !== "number" ||
    typeof max !== "number" ||
    typeof step !== "number"
  )
    return null;
  if (
    !Number.isFinite(min) ||
    !Number.isFinite(max) ||
    !Number.isFinite(step) ||
    step <= 0
  )
    return null;
  const lo = Math.min(min, max);
  const hi = Math.max(min, max);
  const size = Math.floor((hi - lo) / step) + 1;
  return Number.isFinite(size) && size > 0 ? size : null;
};

type ToolState = {
  params: GeneratorParams;
  result: GenerationResult | null;
  history: string[];
  ticketLog?: Array<{ timestamp: number; values: (string | number)[] }>;
};

type ToolListener = () => void;

const createToolStore = (cfg: ToolConfig) => {
  let state: ToolState = {
    params: cfg.params,
    result: null,
    history: [],
    ticketLog: [],
  };
  const listeners = new Set<ToolListener>();
  const serverSnapshot: ToolState = {
    params: cfg.params,
    result: null,
    history: [],
    ticketLog: [],
  };

  const notify = () => {
    for (const l of listeners) l();
  };

  const stateKey = `${TOOL_STATE_PREFIX}${cfg.slug}`;

  const persist = () => {
    if (typeof window === "undefined") return;
    try {
      window.localStorage.setItem(stateKey, JSON.stringify(state));
    } catch {
      // ignore
    }
  };

  const syncUrl = () => {
    if (typeof window === "undefined") return;
    if (!cfg.ui.show_inputs) return;
    const sp = buildSearchParams(cfg.mode, state.params);
    const next = sp.toString();
    const url = new URL(window.location.href);
    url.search = next ? `?${next}` : "";
    window.history.replaceState(null, "", url.toString());
  };

  const setState = (next: ToolState) => {
    state = next;
    persist();
    syncUrl();
    notify();
  };

  return {
    key: cfg.slug,
    subscribe: (listener: ToolListener) => {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
    getSnapshot: () => state,
    getServerSnapshot: () => serverSnapshot,
    patchParams: (patch: Partial<GeneratorParams>) =>
      setState({ ...state, params: { ...state.params, ...patch } }),
    hydrateFromBrowser: (meta: { title: string; description: string }) => {
      if (typeof window === "undefined") return;

      // Use validators for secure data parsing from localStorage
      const rawSaved = window.localStorage.getItem(stateKey);
      const saved = safeParseAndValidate(
        rawSaved,
        (value: unknown) => {
          if (!value || typeof value !== "object") return null;
          const record = value as Record<string, unknown>;

          return {
            params: record.params
              ? validateGeneratorParams(record.params)
              : undefined,
            history: record.history
              ? validateHistoryArray(record.history, 8)
              : undefined,
            last: record.last
              ? validateGenerationResult(record.last)
              : undefined,
            ticketLog: record.ticketLog
              ? validateTicketLog(record.ticketLog, 500)
              : undefined,
          };
        },
        {
          params: undefined,
          history: undefined,
          last: undefined,
          ticketLog: undefined,
        },
      );

      const urlParams = parseParamsFromUrl(
        cfg.mode,
        new URLSearchParams(window.location.search),
      );
      const validatedParams = validateGeneratorParams({
        ...cfg.params,
        ...saved.params,
        ...urlParams,
      });

      // Fallback to config params if validation fails
      const finalParams = validatedParams ?? cfg.params;

      state = {
        params: finalParams,
        history: saved.history ?? [],
        result: saved.last ?? null,
        ticketLog: saved.ticketLog ?? [],
      };
      syncUrl();
      notify();

      addRecent({
        key: window.location.pathname,
        href: `${window.location.pathname}${window.location.search}`,
        title: meta.title,
        description: meta.description,
      });
    },
    setGenerated: (
      res: GenerationResult,
      meta: { title: string; description: string },
    ) => {
      const compact = res.formatted
        ? res.formatted.replace(/\s+/g, " ").slice(0, 140) +
          (res.formatted.length > 140 ? "…" : "")
        : "";
      const nextHistory = compact
        ? [compact, ...state.history].slice(0, 8)
        : state.history;
      const nextTicketLog =
        cfg.mode === "ticket"
          ? [
              { timestamp: res.timestamp, values: res.values },
              ...(state.ticketLog ?? []),
            ].slice(0, 500)
          : state.ticketLog;
      setState({
        ...state,
        result: res,
        history: nextHistory,
        ticketLog: nextTicketLog,
      });

      if (typeof window !== "undefined") {
        addRecent({
          key: window.location.pathname,
          href: `${window.location.pathname}${window.location.search}`,
          title: meta.title,
          description: meta.description,
        });
      }
    },
    clearTicketLog: () => {
      if (cfg.mode !== "ticket") return;
      setState({ ...state, ticketLog: [] });
    },
  };
};

export default function UniversalGenerator({ config }: { config: ToolConfig }) {
  const storeRef = useRef<ReturnType<typeof createToolStore> | null>(null);
  if (!storeRef.current || storeRef.current.key !== config.slug) {
    storeRef.current = createToolStore(config);
  }
  const store = storeRef.current;
  const state = useSyncExternalStore(
    store.subscribe,
    store.getSnapshot,
    store.getServerSnapshot,
  );

  const params = state.params;
  const result = state.result;
  const history = state.history;
  const ticketLog = state.ticketLog ?? EMPTY_TICKET_LOG;

  const [animating, setAnimating] = useState(false);
  const [copied, setCopied] = useState(false);
  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "info";
  } | null>(null);

  // Fixed: only depend on config, not params (params changes frequently)
  // mergedConfig is used for UI props which don't change with params
  const mergedConfig = useMemo<ToolConfig>(() => ({ ...config }), [config]);

  useEffect(() => {
    store.hydrateFromBrowser({
      title: config.title,
      description: config.description,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [config.slug]);

  const handleGenerate = useCallback(() => {
    if (typeof navigator !== "undefined" && navigator.vibrate)
      navigator.vibrate(15);

    setAnimating(true);
    window.setTimeout(() => setAnimating(false), 200);

    const currentParams = store.getSnapshot().params;
    let res = generate(config.mode, currentParams);
    if (config.mode === "ticket") {
      const meta = asRecord(res.meta);
      const remaining = meta ? asStringArray(meta["ticket_remaining"]) : null;
      if (remaining) {
        store.patchParams({ ticket_remaining: remaining });
        if (meta) {
          const rest = { ...meta };
          delete rest["ticket_remaining"];
          res = { ...res, meta: rest };
        }
      }
    }
    store.setGenerated(res, {
      title: config.title,
      description: config.description,
    });

    // Track analytics
    trackToolGenerate(config.slug, config.mode, currentParams);
    trackToolUsage(config.slug, config.title);
  }, [config.mode, config.slug, config.title, config.description, store]);

  // Memoize copyToClipboard
  const copyToClipboard = useCallback(async () => {
    if (!result?.formatted) return;
    try {
      await navigator.clipboard.writeText(result.formatted);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 800);
      trackToolCopy(config.slug);
    } catch {
      // ignore (some browsers block clipboard without gesture / permissions)
    }
  }, [result?.formatted, config.slug]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (isTypingElement(document.activeElement)) return;

      // Space or Enter to generate
      if ((e.code === "Space" || e.code === "Enter") && !e.repeat) {
        e.preventDefault();
        handleGenerate();
      }

      // Ctrl/Cmd + C to copy (when result exists)
      if ((e.ctrlKey || e.metaKey) && e.code === "KeyC" && result?.formatted) {
        e.preventDefault();
        copyToClipboard();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [handleGenerate, copyToClipboard, result?.formatted]);

  // Memoize patchParams to avoid creating new function on each render
  const patchParams = useCallback(
    (patch: Partial<GeneratorParams>) => {
      store.patchParams(patch);
    },
    [store],
  );

  // Memoize export handlers
  const exportAs = useCallback(
    (fmt: "txt" | "csv" | "json") => {
      if (!result) return;
      const baseName = `${config.slug}-${new Date(result.timestamp).toISOString().replace(/[:.]/g, "-")}`;
      if (fmt === "txt") {
        downloadText(`${baseName}.txt`, result.formatted);
        setToast({ message: "Downloaded as TXT", type: "success" });
        window.setTimeout(() => setToast(null), 1500);
        trackToolExport(config.slug, "txt");
        return;
      }
      if (fmt === "csv") {
        const csv = [
          result.values.join(","),
          ...(result.bonus_values?.length
            ? [result.bonus_values.join(",")]
            : []),
        ].join("\n");
        downloadText(`${baseName}.csv`, csv);
        setToast({ message: "Downloaded as CSV", type: "success" });
        window.setTimeout(() => setToast(null), 1500);
        trackToolExport(config.slug, "csv");
        return;
      }
      const json = JSON.stringify(result, null, 2);
      downloadText(`${baseName}.json`, json);
      setToast({ message: "Downloaded as JSON", type: "success" });
      window.setTimeout(() => setToast(null), 1500);
      trackToolExport(config.slug, "json");
    },
    [result, config.slug],
  );

  const exportTicketLog = useCallback(
    (fmt: "csv" | "json" | "txt") => {
      if (config.mode !== "ticket") return;
      if (!ticketLog.length) return;
      const baseName = `${config.slug}-log-${new Date().toISOString().replace(/[:.]/g, "-")}`;

      const entries = [...ticketLog].reverse(); // oldest -> newest
      if (fmt === "json") {
        downloadText(`${baseName}.json`, JSON.stringify(entries, null, 2));
        setToast({ message: "Downloaded log as JSON", type: "success" });
        window.setTimeout(() => setToast(null), 1500);
        return;
      }

      if (fmt === "csv") {
        const lines: string[] = ["timestamp,draw_index,value"];
        entries.forEach((e, i) => {
          const ts = new Date(e.timestamp).toISOString();
          for (const v of e.values) {
            const value = String(v).replace(/"/g, '""');
            lines.push(`"${ts}",${i + 1},"${value}"`);
          }
        });
        downloadText(`${baseName}.csv`, lines.join("\n"));
        setToast({ message: "Downloaded log as CSV", type: "success" });
        window.setTimeout(() => setToast(null), 1500);
        return;
      }

      const txt = entries
        .map(
          (e, i) =>
            `#${i + 1} ${new Date(e.timestamp).toLocaleString()}\n${e.values.join(", ")}\n`,
        )
        .join("\n");
      downloadText(`${baseName}.txt`, txt);
      setToast({ message: "Downloaded log as TXT", type: "success" });
      window.setTimeout(() => setToast(null), 1500);
    },
    [config.mode, config.slug, ticketLog],
  );

  const clearTicketLog = useCallback(() => {
    store.clearTicketLog();
  }, [store]);

  // Memoize preWarnings calculation
  const preWarnings = useMemo(() => {
    if (config.mode !== "range" || !params.unique) return [];
    const cap = rangeCapacity(params.min, params.max, params.step ?? 1);
    const count =
      typeof params.count === "number" ? Math.floor(params.count) : 1;
    if (cap !== null && count > cap)
      return [
        `Unique is impossible here (capacity ${cap}). Repeats may occur.`,
      ];
    return [];
  }, [
    config.mode,
    params.unique,
    params.min,
    params.max,
    params.step,
    params.count,
  ]);

  const runWarnings = result?.warnings ?? EMPTY_STRING_ARRAY;
  const warnings = useMemo(
    () => [...preWarnings, ...runWarnings],
    [preWarnings, runWarnings],
  );

  // Memoize display className
  const displayClassName = useMemo(
    () =>
      cn(
        "relative bg-white/90 dark:bg-zinc-900/70 backdrop-blur-xl rounded-[2.5rem] p-8 sm:p-14 min-h-[320px]",
        "shadow-[0_20px_60px_-12px_rgba(0,0,0,0.12)] dark:shadow-[0_20px_60px_-12px_rgba(0,0,0,0.5)]",
        "border border-zinc-200/60 dark:border-zinc-800/60",
        "flex flex-col items-center justify-center transition-all duration-200 ease-out will-change-transform",
        "ring-1 ring-zinc-900/5 dark:ring-white/5",
        animating
          ? "scale-[0.98] opacity-80 blur-[2px] grayscale-[0.2]"
          : "scale-100 opacity-100 blur-0 grayscale-0",
      ),
    [animating],
  );

  return (
    <div className="w-full max-w-3xl mx-auto space-y-10">
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          duration={1500}
          onClose={() => setToast(null)}
          position="top"
        />
      )}

      <div
        className={displayClassName}
        role="region"
        aria-live="polite"
        aria-label="Generated result"
      >
        <Display config={mergedConfig} result={result} />

        {result && (
          <button
            type="button"
            onClick={copyToClipboard}
            aria-label="Copy result to clipboard"
            className="absolute top-5 right-5 sm:top-8 sm:right-8 flex items-center gap-2 p-3 text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-all rounded-2xl hover:bg-zinc-100/80 dark:hover:bg-zinc-800/80 group backdrop-blur-sm"
          >
            <Copy
              size={20}
              className="group-hover:scale-110 transition-transform"
              aria-hidden="true"
            />
            {copied && (
              <span className="text-xs font-bold text-green-500 animate-in fade-in slide-in-from-left-2 duration-300">
                Copied
              </span>
            )}
          </button>
        )}
      </div>

      {warnings.length > 0 && (
        <div role="alert" aria-live="polite" className="space-y-3 px-2">
          {warnings.map((w, i) => (
            <WarningAlert key={i} variant="caution">
              {w}
            </WarningAlert>
          ))}
        </div>
      )}

      <div className="bg-white/90 dark:bg-zinc-900/60 backdrop-blur-md rounded-[2rem] p-6 sm:p-10 border border-zinc-200/60 dark:border-zinc-800/60 shadow-lg">
        <Controls
          config={mergedConfig}
          params={params}
          onChange={patchParams}
        />
      </div>

      <button
        type="button"
        onClick={handleGenerate}
        className="group relative w-full h-20 sm:h-24 bg-gradient-to-br from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 dark:from-violet-500 dark:to-indigo-500 dark:hover:from-violet-400 dark:hover:to-indigo-400 text-white rounded-[2rem] text-2xl sm:text-3xl font-black tracking-tight shadow-[0_20px_40px_-12px_rgba(139,92,246,0.35)] dark:shadow-[0_20px_40px_-12px_rgba(139,92,246,0.25)] hover:shadow-[0_25px_50px_-12px_rgba(139,92,246,0.45)] dark:hover:shadow-[0_25px_50px_-12px_rgba(139,92,246,0.35)] hover:-translate-y-1 active:translate-y-0 active:scale-[0.98] transition-all duration-200 ease-out flex items-center justify-center gap-4 focus-visible:ring-4 focus-visible:ring-violet-500/50 overflow-hidden shine-effect"
      >
        <div className="absolute inset-0 bg-gradient-to-tr from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200" />

        {animating && (
          <RefreshCw
            className="animate-spin relative z-10"
            size={32}
            aria-hidden="true"
          />
        )}
        {!animating && (
          <>
            <span className="relative z-10 drop-shadow-sm">
              {mergedConfig.ui.button_text}
            </span>
            <span className="hidden sm:inline-flex items-center justify-center h-8 px-3 rounded-lg bg-white/20 dark:bg-black/10 text-xs font-bold uppercase tracking-wider opacity-60 group-hover:opacity-100 transition-opacity backdrop-blur-sm">
              Space
            </span>
          </>
        )}
      </button>

      {result && (
        <div
          role="group"
          aria-label="Export options"
          className="flex flex-wrap gap-3 justify-center py-4"
        >
          {(["txt", "csv", "json"] as const).map((fmt) => (
            <button
              key={fmt}
              type="button"
              onClick={() => exportAs(fmt)}
              className="h-12 px-6 rounded-2xl border border-zinc-200/60 dark:border-zinc-800/60 bg-white/90 dark:bg-zinc-900/60 backdrop-blur-sm font-bold text-sm uppercase tracking-wide text-zinc-600 dark:text-zinc-400 hover:text-violet-600 dark:hover:text-violet-400 hover:border-violet-300 dark:hover:border-violet-700/50 hover:bg-violet-50/80 dark:hover:bg-violet-950/20 hover:-translate-y-0.5 transition-all duration-200 active:scale-95 flex items-center gap-2.5 shadow-sm hover:shadow-md"
            >
              <Download size={16} aria-hidden="true" /> {fmt}
            </button>
          ))}

          {config.mode === "ticket" && ticketLog.length > 0 && (
            <>
              <div className="w-px h-10 bg-zinc-200/60 dark:bg-zinc-800/60 mx-2 hidden sm:block" />
              <button
                type="button"
                onClick={() => exportTicketLog("csv")}
                className="h-12 px-6 rounded-2xl border border-zinc-200/60 dark:border-zinc-800/60 bg-white/90 dark:bg-zinc-900/60 backdrop-blur-sm font-bold text-sm uppercase tracking-wide text-zinc-600 dark:text-zinc-400 hover:text-violet-600 dark:hover:text-violet-400 hover:border-violet-300 dark:hover:border-violet-700/50 hover:bg-violet-50/80 dark:hover:bg-violet-950/20 hover:-translate-y-0.5 transition-all duration-200 active:scale-95 flex items-center gap-2.5 shadow-sm hover:shadow-md"
              >
                <Download size={16} aria-hidden="true" /> Log CSV
              </button>
              <button
                type="button"
                onClick={clearTicketLog}
                className="h-12 px-6 rounded-2xl border border-rose-200/60 dark:border-rose-900/30 bg-rose-50/80 dark:bg-rose-950/20 backdrop-blur-sm font-bold text-sm uppercase tracking-wide text-rose-600 dark:text-rose-400 hover:bg-rose-100 dark:hover:bg-rose-900/30 hover:border-rose-300 dark:hover:border-rose-800/50 hover:-translate-y-0.5 transition-all duration-200 active:scale-95 flex items-center gap-2.5 shadow-sm hover:shadow-md hover:shadow-rose-500/10"
              >
                Clear Log
              </button>
            </>
          )}
        </div>
      )}

      {/* Ticket Log Viewer - shown below export buttons for ticket mode */}
      {config.mode === "ticket" && (
        <TicketLogViewer
          log={ticketLog.map((entry) => ({
            timestamp: entry.timestamp,
            values: entry.values,
          }))}
          onClear={clearTicketLog}
          onExport={exportTicketLog}
        />
      )}

      {history.length > 0 && (
        <div className="pt-10 border-t border-zinc-200/60 dark:border-zinc-800/60">
          <h2 className="flex items-center gap-3 text-xs font-black text-zinc-400 uppercase tracking-widest mb-6 px-2">
            <History size={14} aria-hidden="true" /> Recent History
          </h2>
          <ul
            className="flex flex-wrap gap-3"
            role="list"
            aria-label="Recent results"
          >
            {history.map((h, i) => (
              <li
                key={`${result?.timestamp ?? "h"}-${i}`}
                className="px-4 py-2 bg-zinc-50/80 dark:bg-zinc-900/40 rounded-xl text-sm text-zinc-600 dark:text-zinc-400 font-mono border border-zinc-200/60 dark:border-zinc-800/60 select-all hover:bg-zinc-100 dark:hover:bg-zinc-800 hover:text-zinc-900 dark:hover:text-zinc-200 hover:border-zinc-300 dark:hover:border-zinc-700 transition-all cursor-default"
              >
                {h}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Embed & Share Section */}
      <details className="group">
        <summary className="flex items-center justify-between cursor-pointer list-none px-6 py-5 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/20 hover:bg-zinc-50 dark:hover:bg-zinc-800/30 transition-all shadow-sm">
          <span className="flex items-center gap-3 text-sm font-bold text-zinc-600 dark:text-zinc-300">
            <Code size={18} aria-hidden="true" className="text-zinc-400" />
            Embed & Developers
          </span>
          <span
            className="text-zinc-400 group-open:rotate-180 transition-transform duration-300 p-1 rounded-lg bg-zinc-100 dark:bg-zinc-800"
            aria-hidden="true"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="w-4 h-4"
            >
              <path d="m6 9 6 6 6-6" />
            </svg>
          </span>
        </summary>
        <div
          className="mt-4 p-1 animate-in slide-in-from-top-2 duration-300"
          role="region"
          aria-label="Embed code options"
        >
          <EmbedCode
            toolSlug={config.slug}
            toolTitle={config.title}
            params={buildSearchParamsForEmbed(config.mode, params)}
          />
        </div>
      </details>
    </div>
  );
}

/**
 * Build URL params for embed code (filtered for security)
 */
function buildSearchParamsForEmbed(
  mode: ToolConfig["mode"],
  params: GeneratorParams,
): Record<string, string> {
  const result: Record<string, string> = {};

  if (mode === "range") {
    if (typeof params.min === "number") result.min = String(params.min);
    if (typeof params.max === "number") result.max = String(params.max);
    if (typeof params.count === "number") result.count = String(params.count);
    if (typeof params.step === "number") result.step = String(params.step);
    if (typeof params.precision === "number")
      result.precision = String(params.precision);
    if (typeof params.unique === "boolean")
      result.unique = params.unique ? "1" : "0";
    if (params.sort) result.sort = params.sort;
  }

  if (mode === "password") {
    if (typeof params.length === "number")
      result.length = String(params.length);
    if (typeof params.count === "number") result.count = String(params.count);
    if (typeof params.grouping === "boolean")
      result.grouping = params.grouping ? "1" : "0";
    if (params.charset) result.charset = params.charset;
  }

  if (mode === "list") {
    if (typeof params.count === "number") result.count = String(params.count);
    if (typeof params.unique === "boolean")
      result.unique = params.unique ? "1" : "0";
  }

  if (mode === "dice") {
    if (typeof params.dice_sides === "number")
      result.sides = String(params.dice_sides);
    if (typeof params.dice_rolls === "number")
      result.rolls = String(params.dice_rolls);
    if (typeof params.dice_modifier === "number")
      result.mod = String(params.dice_modifier);
  }

  if (mode === "coin") {
    if (typeof params.coin_flips === "number")
      result.flips = String(params.coin_flips);
  }

  if (mode === "uuid") {
    if (typeof params.count === "number") result.count = String(params.count);
    if (typeof params.uuid_uppercase === "boolean")
      result.uppercase = params.uuid_uppercase ? "1" : "0";
    if (typeof params.uuid_hyphens === "boolean")
      result.hyphens = params.uuid_hyphens ? "1" : "0";
  }

  if (mode === "color") {
    if (typeof params.count === "number") result.count = String(params.count);
    if (params.color_format) result.format = params.color_format;
  }

  return result;
}
