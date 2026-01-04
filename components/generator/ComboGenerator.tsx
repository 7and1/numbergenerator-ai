"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Plus, Trash2, Copy, Download, RefreshCw } from "lucide-react";

import { CONFIG_MAP } from "@/lib/configMap";
import { generate } from "@/lib/engine";
import type { GenerationResult, GeneratorParams } from "@/lib/types";
import { Controls } from "@/components/generator/Controls";
import { Toast } from "@/components/ui/Toast";
import { trackComboGenerate } from "@/lib/analytics";

type ComboSlot = {
  id: string;
  toolSlug: string;
  params: GeneratorParams;
  result: GenerationResult | null;
};

const COMBO_STATE_PREFIX = "ng:combo:v1:";

const isBrowser = () =>
  typeof window !== "undefined" && typeof window.localStorage !== "undefined";

// Get the combo state key for a specific combo ID
const getComboStateKey = (comboId: string) => `${COMBO_STATE_PREFIX}${comboId}`;

// Save combo state to localStorage
const saveComboState = (comboId: string, slots: ComboSlot[]) => {
  if (!isBrowser()) return;
  try {
    const toSave = slots.map((s) => ({
      toolSlug: s.toolSlug,
      params: s.params,
      // Don't save results to reduce storage
    }));
    localStorage.setItem(getComboStateKey(comboId), JSON.stringify(toSave));
  } catch {
    // Ignore quota errors
  }
};

// Load combo state from localStorage
const loadComboState = (comboId: string): ComboSlot[] | null => {
  if (!isBrowser()) return null;
  try {
    const raw = localStorage.getItem(getComboStateKey(comboId));
    if (!raw) return null;
    const saved = JSON.parse(raw) as Array<{
      toolSlug: string;
      params: GeneratorParams;
    }>;
    return saved.map((s) => ({
      id: Math.random().toString(36).substring(2, 9),
      toolSlug: s.toolSlug,
      params: s.params as GeneratorParams,
      result: null,
    }));
  } catch {
    return null;
  }
};

// Generate a unique combo ID
const generateComboId = () => Math.random().toString(36).substring(2, 9);

const cn = (...classes: (string | false | undefined | null)[]) => {
  return classes.filter(Boolean).join(" ");
};

export function ComboGenerator() {
  const comboIdRef = useRef<string | null>(null);
  const [slots, setSlots] = useState<ComboSlot[]>([]);
  const [animatingSlots, setAnimatingSlots] = useState<Set<string>>(new Set());
  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error" | "info";
  } | null>(null);

  // Initialize combo state
  useEffect(() => {
    // Check for existing combo or create new
    const urlParams = new URLSearchParams(window.location.search);
    const comboId = urlParams.get("combo");

    if (comboId) {
      comboIdRef.current = comboId;
      const loaded = loadComboState(comboId);
      if (loaded) {
        setSlots(loaded);
      }
    } else {
      // Create new combo with default slot
      const newId = generateComboId();
      comboIdRef.current = newId;
      const newUrl = new URL(window.location.href);
      newUrl.searchParams.set("combo", newId);
      window.history.replaceState(null, "", newUrl.toString());

      // Add default slots
      const defaultSlots: ComboSlot[] = [
        {
          id: "1",
          toolSlug: "1-100",
          params: CONFIG_MAP["1-100"]?.params ?? {},
          result: null,
        },
        {
          id: "2",
          toolSlug: "password-strong",
          params: CONFIG_MAP["password-strong"]?.params ?? {},
          result: null,
        },
      ];
      setSlots(defaultSlots);
      saveComboState(newId, defaultSlots);
    }
  }, []);

  // Add a new slot
  const addSlot = useCallback(() => {
    const newSlot: ComboSlot = {
      id: Math.random().toString(36).substring(2, 9),
      toolSlug: "1-100",
      params: CONFIG_MAP["1-100"]?.params ?? {},
      result: null,
    };
    const newSlots = [...slots, newSlot];
    setSlots(newSlots);
    if (comboIdRef.current) {
      saveComboState(comboIdRef.current, newSlots);
    }
  }, [slots]);

  // Remove a slot
  const removeSlot = useCallback(
    (slotId: string) => {
      const newSlots = slots.filter((s) => s.id !== slotId);
      setSlots(newSlots);
      if (comboIdRef.current) {
        saveComboState(comboIdRef.current, newSlots);
      }
    },
    [slots],
  );

  // Update slot tool
  const updateSlotTool = useCallback(
    (slotId: string, toolSlug: string) => {
      const newSlots = slots.map((s) =>
        s.id === slotId
          ? {
              ...s,
              toolSlug,
              params: CONFIG_MAP[toolSlug]?.params ?? {},
              result: null,
            }
          : s,
      );
      setSlots(newSlots);
      if (comboIdRef.current) {
        saveComboState(comboIdRef.current, newSlots);
      }
    },
    [slots],
  );

  // Update slot params
  const updateSlotParams = useCallback(
    (slotId: string, params: Record<string, unknown>) => {
      const newSlots = slots.map((s) =>
        s.id === slotId ? { ...s, params, result: null } : s,
      );
      setSlots(newSlots);
      if (comboIdRef.current) {
        saveComboState(comboIdRef.current, newSlots);
      }
    },
    [slots],
  );

  // Generate all slots
  const generateAll = useCallback(() => {
    if (typeof navigator !== "undefined" && navigator.vibrate) {
      navigator.vibrate(20);
    }

    // Animate all slots
    setAnimatingSlots(new Set(slots.map((s) => s.id)));

    // Generate results
    const newSlots = slots.map((slot) => {
      const config = CONFIG_MAP[slot.toolSlug];
      if (!config) return slot;

      try {
        const result = generate(config.mode, slot.params);
        return { ...slot, result };
      } catch {
        return slot;
      }
    });

    setSlots(newSlots);

    // Clear animation after delay
    setTimeout(() => {
      setAnimatingSlots(new Set());
    }, 300);

    // Track analytics
    trackComboGenerate(slots.map((s) => s.toolSlug));

    // Save results
    if (comboIdRef.current) {
      saveComboState(comboIdRef.current, newSlots);
    }
  }, [slots]);

  // Generate a single slot
  const generateSlot = useCallback(
    (slotId: string) => {
      const slot = slots.find((s) => s.id === slotId);
      if (!slot) return;

      if (typeof navigator !== "undefined" && navigator.vibrate) {
        navigator.vibrate(15);
      }

      setAnimatingSlots((prev) => new Set([...prev, slotId]));

      const config = CONFIG_MAP[slot.toolSlug];
      if (!config) return;

      try {
        const result = generate(config.mode, slot.params);
        const newSlots = slots.map((s) =>
          s.id === slotId ? { ...s, result } : s,
        );
        setSlots(newSlots);

        if (comboIdRef.current) {
          saveComboState(comboIdRef.current, newSlots);
        }
      } finally {
        setTimeout(() => {
          setAnimatingSlots((prev) => {
            const next = new Set(prev);
            next.delete(slotId);
            return next;
          });
        }, 200);
      }
    },
    [slots],
  );

  // Copy all results
  const copyAllResults = useCallback(async () => {
    const results = slots
      .filter((s) => s.result?.formatted)
      .map(
        (s) =>
          `${CONFIG_MAP[s.toolSlug]?.title ?? s.toolSlug}: ${s.result?.formatted}`,
      )
      .join("\n");

    if (!results) {
      setToast({ message: "No results to copy", type: "info" });
      setTimeout(() => setToast(null), 1500);
      return;
    }

    try {
      await navigator.clipboard.writeText(results);
      setToast({ message: "All results copied", type: "success" });
      setTimeout(() => setToast(null), 1500);
    } catch {
      setToast({ message: "Copy blocked", type: "error" });
      setTimeout(() => setToast(null), 1500);
    }
  }, [slots]);

  // Export results
  const exportResults = useCallback(
    (format: "txt" | "csv" | "json") => {
      const timestamp = new Date().toISOString().replace(/[:.]/g, "-");

      if (format === "json") {
        const data = slots
          .filter((s) => s.result)
          .map((s) => ({
            tool: CONFIG_MAP[s.toolSlug]?.title ?? s.toolSlug,
            result: s.result?.values,
          }));
        const blob = new Blob([JSON.stringify(data, null, 2)], {
          type: "application/json",
        });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `combo-${timestamp}.json`;
        a.click();
        a.remove();
        URL.revokeObjectURL(url);
        setToast({ message: "Exported as JSON", type: "success" });
        setTimeout(() => setToast(null), 1500);
        return;
      }

      if (format === "csv") {
        const rows = [
          "Tool,Result",
          ...slots
            .filter((s) => s.result?.formatted)
            .map(
              (s) =>
                `"${CONFIG_MAP[s.toolSlug]?.title ?? s.toolSlug}","${s.result?.formatted}"`,
            ),
        ];
        const blob = new Blob([rows.join("\n")], { type: "text/csv" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `combo-${timestamp}.csv`;
        a.click();
        a.remove();
        URL.revokeObjectURL(url);
        setToast({ message: "Exported as CSV", type: "success" });
        setTimeout(() => setToast(null), 1500);
        return;
      }

      // TXT format
      const text = slots
        .filter((s) => s.result?.formatted)
        .map(
          (s) =>
            `${CONFIG_MAP[s.toolSlug]?.title ?? s.toolSlug}:\n${s.result?.formatted}`,
        )
        .join("\n\n");
      const blob = new Blob([text], { type: "text/plain" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `combo-${timestamp}.txt`;
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
      setToast({ message: "Exported as TXT", type: "success" });
      setTimeout(() => setToast(null), 1500);
    },
    [slots],
  );

  // Available tools (exclude templates and combo itself)
  const availableTools = useMemo(() => {
    return Object.entries(CONFIG_MAP)
      .filter(([slug]) => !slug.startsWith("template-") && slug !== "combo")
      .map(([slug, config]) => ({ slug, title: config.title }))
      .sort((a, b) => a.title.localeCompare(b.title));
  }, []);

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          duration={1500}
          onClose={() => setToast(null)}
          position="top"
        />
      )}

      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-zinc-900 dark:text-white mb-2">
          Combination Generator
        </h1>
        <p className="text-zinc-500 dark:text-zinc-400">
          Run multiple generators at once with a single click.
        </p>
      </div>

      {/* Generate All Button */}
      <div
        className="flex flex-wrap gap-3 justify-center"
        role="group"
        aria-label="Generator controls"
      >
        <button
          type="button"
          onClick={generateAll}
          className="h-14 px-8 bg-black dark:bg-white text-white dark:text-black rounded-xl text-lg font-bold shadow-lg hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0 transition-all flex items-center gap-2"
          aria-label={`Generate all ${slots.length} tools`}
        >
          <RefreshCw
            size={20}
            className={
              animatingSlots.size === slots.length ? "animate-spin" : ""
            }
            aria-hidden="true"
          />
          <span aria-hidden="true">Generate All ({slots.length})</span>
        </button>

        {slots.some((s) => s.result) && (
          <>
            <button
              type="button"
              onClick={copyAllResults}
              className="h-14 px-6 rounded-xl border border-zinc-200 dark:border-zinc-800 font-bold hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-colors flex items-center gap-2"
              aria-label="Copy all results to clipboard"
            >
              <Copy size={18} aria-hidden="true" />
              <span aria-hidden="true">Copy All</span>
            </button>

            <button
              type="button"
              onClick={() => exportResults("json")}
              className="h-14 px-6 rounded-xl border border-zinc-200 dark:border-zinc-800 font-bold hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-colors flex items-center gap-2"
              aria-label="Export results as JSON"
            >
              <Download size={18} aria-hidden="true" />
              <span aria-hidden="true">Export</span>
            </button>
          </>
        )}

        <button
          type="button"
          onClick={addSlot}
          className="h-14 px-6 rounded-xl border-2 border-dashed border-zinc-300 dark:border-zinc-700 font-bold text-zinc-500 hover:border-zinc-400 dark:hover:border-zinc-600 hover:text-zinc-700 dark:hover:text-zinc-300 transition-colors flex items-center gap-2"
          aria-label="Add new tool generator"
        >
          <Plus size={18} aria-hidden="true" />
          <span aria-hidden="true">Add Tool</span>
        </button>
      </div>

      {/* Slots Grid */}
      <div className="grid md:grid-cols-2 gap-6">
        {slots.map((slot, index) => {
          const config = CONFIG_MAP[slot.toolSlug];
          const isAnimating = animatingSlots.has(slot.id);

          return (
            <div
              key={slot.id}
              className={cn(
                "bg-white dark:bg-zinc-900 rounded-3xl p-6 shadow-lg border border-zinc-200 dark:border-zinc-800 transition-all",
                isAnimating && "scale-[0.98]",
              )}
            >
              {/* Slot Header */}
              <div className="flex items-start justify-between gap-3 mb-4">
                <div className="flex-1 min-w-0">
                  <label
                    htmlFor={`tool-select-${slot.id}`}
                    className="block text-xs font-bold text-zinc-400 uppercase mb-2"
                  >
                    Tool #{index + 1}
                  </label>
                  <select
                    id={`tool-select-${slot.id}`}
                    value={slot.toolSlug}
                    onChange={(e) => updateSlotTool(slot.id, e.target.value)}
                    className="w-full bg-zinc-50 dark:bg-zinc-950 rounded-lg px-3 py-2 text-sm font-bold text-zinc-900 dark:text-white border border-zinc-200 dark:border-zinc-800"
                  >
                    {availableTools.map((tool) => (
                      <option key={tool.slug} value={tool.slug}>
                        {tool.title}
                      </option>
                    ))}
                  </select>
                </div>

                {slots.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeSlot(slot.id)}
                    className="p-2 text-zinc-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-lg transition-colors"
                    aria-label={`Remove tool ${index + 1}: ${config?.title || slot.toolSlug}`}
                  >
                    <Trash2 size={18} aria-hidden="true" />
                  </button>
                )}
              </div>

              {/* Slot Result */}
              <div
                className={cn(
                  "min-h-[120px] flex items-center justify-center rounded-2xl p-4 mb-4 border transition-all",
                  slot.result
                    ? "bg-zinc-50 dark:bg-zinc-950/50 border-zinc-200 dark:border-zinc-800"
                    : "bg-zinc-100 dark:bg-zinc-900/30 border-dashed border-zinc-300 dark:border-zinc-700",
                )}
                role="status"
                aria-live="polite"
                aria-label={`Result for tool ${index + 1}`}
              >
                {slot.result ? (
                  <div className="text-center">
                    <div className="text-2xl md:text-3xl font-black text-zinc-900 dark:text-white">
                      {slot.result.formatted}
                    </div>
                  </div>
                ) : (
                  <div className="text-zinc-400 font-medium">No result yet</div>
                )}
              </div>

              {/* Slot Controls */}
              {config && (
                <div className="mb-3">
                  <Controls
                    config={config}
                    params={slot.params}
                    onChange={(patch) =>
                      updateSlotParams(slot.id, { ...slot.params, ...patch })
                    }
                  />
                </div>
              )}

              {/* Generate Single Button */}
              <button
                type="button"
                onClick={() => generateSlot(slot.id)}
                className="w-full h-12 bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 rounded-xl font-bold hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
                aria-label={`Generate result for ${config?.title || slot.toolSlug}`}
              >
                <RefreshCw
                  size={16}
                  className={isAnimating ? "animate-spin" : ""}
                  aria-hidden="true"
                />
                <span aria-hidden="true">Generate</span>
              </button>
            </div>
          );
        })}
      </div>

      {slots.length === 0 && (
        <div className="text-center py-12">
          <p className="text-zinc-400 mb-4">No tools added yet.</p>
          <button
            type="button"
            onClick={addSlot}
            className="px-6 py-3 bg-black dark:bg-white text-white dark:text-black rounded-xl font-bold hover:opacity-90 transition-opacity"
          >
            Add Your First Tool
          </button>
        </div>
      )}
    </div>
  );
}
