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
import { addRecent, toggleFavorite } from "@/lib/userData";
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
  trackToolShare,
} from "@/lib/analytics";
import { trackToolUsage } from "@/lib/usageTracker";
import { EmbedCode } from "@/components/tool/EmbedCode";
import { ShortcutHint } from "@/components/ui/KeyboardShortcuts";
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

const safeParseJson = <T,>(raw: string | null): T | null => {
  if (!raw) return null;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
};

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
  const ticketLog = state.ticketLog ?? [];

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
  }, [handleGenerate, result?.formatted]);

  // Memoize patchParams to avoid creating new function on each render
  const patchParams = useCallback(
    (patch: Partial<GeneratorParams>) => {
      store.patchParams(patch);
    },
    [store],
  );

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

  const runWarnings = result?.warnings ?? [];
  const warnings = useMemo(
    () => [...preWarnings, ...runWarnings],
    [preWarnings, runWarnings],
  );

  // Memoize display className
  const displayClassName = useMemo(
    () =>
      cn(
        "relative bg-white dark:bg-zinc-900 rounded-3xl p-10 min-h-[240px] shadow-xl border border-zinc-100 dark:border-zinc-800",
        "flex flex-col items-center justify-center transition-transform duration-150",
        animating ? "scale-[0.98]" : "scale-100",
      ),
    [animating],
  );

  return (
    <div className="w-full max-w-xl mx-auto space-y-6">
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
            className="absolute top-4 right-4 flex items-center gap-2 p-2 text-zinc-300 hover:text-zinc-600 dark:hover:text-white transition-colors rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800"
          >
            <Copy size={20} aria-hidden="true" />
            {copied && <span className="text-xs font-semibold">Copied</span>}
          </button>
        )}
      </div>

      {warnings.length > 0 && (
        <div role="alert" aria-live="polite" className="space-y-2">
          {warnings.map((w, i) => (
            <WarningAlert key={i} variant="caution">
              {w}
            </WarningAlert>
          ))}
        </div>
      )}

      <Controls config={mergedConfig} params={params} onChange={patchParams} />

      <button
        type="button"
        onClick={handleGenerate}
        className="w-full h-16 bg-black dark:bg-white text-white dark:text-black rounded-2xl text-xl font-bold tracking-wide shadow-lg hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.99] transition-all flex items-center justify-center gap-2 focus-visible:ring-2 focus-visible:ring-black/50 focus-visible:ring-offset-2"
      >
        {animating && (
          <RefreshCw className="animate-spin" size={24} aria-hidden="true" />
        )}
        {!animating && (
          <>
            {mergedConfig.ui.button_text}
            <span className="text-xs font-normal opacity-60 ml-2 hidden sm:inline">
              <ShortcutHint keys={["Space", "Enter"]} />
            </span>
          </>
        )}
      </button>

      {result && (
        <div
          role="group"
          aria-label="Export options"
          className="flex flex-wrap gap-2 justify-center"
        >
          <button
            type="button"
            onClick={() => exportAs("txt")}
            className="h-10 px-4 rounded-xl border border-zinc-200 dark:border-zinc-800 font-bold text-sm inline-flex items-center gap-2 hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-colors focus-visible:ring-2 focus-visible:ring-zinc-400/50"
          >
            <Download size={16} aria-hidden="true" /> TXT
          </button>
          <button
            type="button"
            onClick={() => exportAs("csv")}
            className="h-10 px-4 rounded-xl border border-zinc-200 dark:border-zinc-800 font-bold text-sm inline-flex items-center gap-2 hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-colors focus-visible:ring-2 focus-visible:ring-zinc-400/50"
          >
            <Download size={16} aria-hidden="true" /> CSV
          </button>
          <button
            type="button"
            onClick={() => exportAs("json")}
            className="h-10 px-4 rounded-xl border border-zinc-200 dark:border-zinc-800 font-bold text-sm inline-flex items-center gap-2 hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-colors focus-visible:ring-2 focus-visible:ring-zinc-400/50"
          >
            <Download size={16} aria-hidden="true" /> JSON
          </button>

          {config.mode === "ticket" && ticketLog.length > 0 && (
            <>
              <button
                type="button"
                onClick={() => exportTicketLog("csv")}
                className="h-10 px-4 rounded-xl border border-zinc-200 dark:border-zinc-800 font-bold text-sm inline-flex items-center gap-2 hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-colors focus-visible:ring-2 focus-visible:ring-zinc-400/50"
              >
                <Download size={16} aria-hidden="true" /> Log CSV
              </button>
              <button
                type="button"
                onClick={() => exportTicketLog("json")}
                className="h-10 px-4 rounded-xl border border-zinc-200 dark:border-zinc-800 font-bold text-sm inline-flex items-center gap-2 hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-colors focus-visible:ring-2 focus-visible:ring-zinc-400/50"
              >
                <Download size={16} aria-hidden="true" /> Log JSON
              </button>
              <button
                type="button"
                onClick={clearTicketLog}
                className="h-10 px-4 rounded-xl border border-zinc-200 dark:border-zinc-800 font-bold text-sm inline-flex items-center gap-2 hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-colors focus-visible:ring-2 focus-visible:ring-zinc-400/50"
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
        <div className="pt-4 border-t border-zinc-100 dark:border-zinc-800">
          <h2 className="flex items-center gap-2 text-xs text-zinc-400 font-bold uppercase tracking-wider mb-3">
            <History size={14} aria-hidden="true" /> Recent
          </h2>
          <ul
            className="flex flex-wrap gap-2"
            role="list"
            aria-label="Recent results"
          >
            {history.map((h, i) => (
              <li
                key={`${result?.timestamp ?? "h"}-${i}`}
                className="px-3 py-1 bg-zinc-50 dark:bg-zinc-800 rounded-md text-sm text-zinc-600 dark:text-zinc-400 font-mono border border-zinc-200 dark:border-zinc-700"
              >
                {h}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Embed & Share Section */}
      <details className="group">
        <summary className="flex items-center justify-between cursor-pointer list-none px-4 py-3 rounded-xl border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-colors focus-visible:ring-2 focus-visible:ring-zinc-400/50 focus-visible:ring-offset-2">
          <span className="flex items-center gap-2 text-sm font-bold text-zinc-700 dark:text-zinc-300">
            <Code size={16} aria-hidden="true" />
            Embed & Share
          </span>
          <span
            className="text-xs text-zinc-500 group-open:rotate-180 transition-transform"
            aria-hidden="true"
          >
            ▼
          </span>
          <span className="sr-only">Toggle embed code section</span>
        </summary>
        <div className="mt-4" role="region" aria-label="Embed code options">
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
