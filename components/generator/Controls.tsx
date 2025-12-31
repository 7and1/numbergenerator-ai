"use client";

import { memo, useCallback, useMemo } from "react";
import type { GeneratorParams, ToolConfig } from "@/lib/types";
import { parseItemsText } from "@/lib/listText";

// Utility function for conditional className (replaces array join for better performance)
const cn = (...classes: (string | false | undefined | null)[]) => {
  return classes.filter(Boolean).join(" ");
};

const PASSWORD_SETS = {
  lower: "abcdefghijkmnpqrstuvwxyz",
  upper: "ABCDEFGHJKLMNPQRSTUVWXYZ",
  digits: "23456789",
  symbols: "!@#$%^&*()_+-=~[]{};:,.?",
} as const;

const AMBIGUOUS_CHARS = "0O1lI|`'\"\\,.:;";

const uniqCharsCount = (s: string) => new Set(s.split("")).size;

const removeChars = (source: string, remove: string) => {
  if (!remove) return source;
  const set = new Set(remove.split(""));
  return source
    .split("")
    .filter((c) => !set.has(c))
    .join("");
};

const estimateEntropyBits = (length: number, poolSize: number) => {
  if (!(length > 0) || !(poolSize > 1)) return 0;
  return length * Math.log2(poolSize);
};

const strengthLabel = (bits: number) => {
  if (bits >= 90)
    return { label: "Very Strong", pct: 100, color: "bg-emerald-500" };
  if (bits >= 70)
    return {
      label: "Strong",
      pct: Math.min(100, Math.round((bits / 90) * 100)),
      color: "bg-green-500",
    };
  if (bits >= 50)
    return {
      label: "Good",
      pct: Math.min(100, Math.round((bits / 90) * 100)),
      color: "bg-yellow-500",
    };
  if (bits >= 30)
    return {
      label: "Weak",
      pct: Math.min(100, Math.round((bits / 90) * 100)),
      color: "bg-orange-500",
    };
  return {
    label: "Very Weak",
    pct: Math.min(100, Math.round((bits / 90) * 100)),
    color: "bg-red-500",
  };
};

interface NumberFieldProps {
  label: string;
  value: number | undefined;
  onChange: (next: number) => void;
  min?: number;
  step?: number;
  max?: number;
  id?: string;
}

const NumberField = memo<NumberFieldProps>(
  ({ label, value, onChange, min, step, max, id }) => {
    const handleChange = useCallback(
      (e: React.ChangeEvent<HTMLInputElement>) => {
        onChange(Number(e.target.value));
      },
      [onChange],
    );

    const inputValue = useMemo(() => value ?? "", [value]);
    const inputId = useMemo(
      () => id || `input-${label.toLowerCase().replace(/\s+/g, "-")}`,
      [id, label],
    );

    return (
      <div className="bg-zinc-50 dark:bg-zinc-900/40 p-3 rounded-xl border border-zinc-200 dark:border-zinc-800 focus-within:ring-2 ring-black/70">
        <label
          htmlFor={inputId}
          className="block text-xs font-bold text-zinc-400 uppercase mb-1"
        >
          {label}
        </label>
        <input
          id={inputId}
          type="number"
          value={inputValue}
          min={min}
          max={max}
          step={step}
          onChange={handleChange}
          className="w-full bg-transparent text-xl font-bold text-zinc-900 dark:text-white outline-none font-mono"
          aria-describedby={`${inputId}-description`}
        />
      </div>
    );
  },
  (prevProps, nextProps) =>
    prevProps.label === nextProps.label &&
    prevProps.value === nextProps.value &&
    prevProps.min === nextProps.min &&
    prevProps.max === nextProps.max &&
    prevProps.step === nextProps.step,
);

NumberField.displayName = "NumberField";

interface TextAreaFieldProps {
  label: string;
  value: string;
  onChange: (next: string) => void;
  placeholder?: string;
  rows?: number;
  help?: string;
  id?: string;
}

const TextAreaField = memo<TextAreaFieldProps>(
  ({ label, value, onChange, placeholder, rows = 6, help, id }) => {
    const handleChange = useCallback(
      (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        onChange(e.target.value);
      },
      [onChange],
    );

    const inputId = useMemo(
      () => id || `textarea-${label.toLowerCase().replace(/\s+/g, "-")}`,
      [id, label],
    );
    const helpId = `${inputId}-help`;

    return (
      <div className="bg-zinc-50 dark:bg-zinc-900/40 p-3 rounded-xl border border-zinc-200 dark:border-zinc-800 focus-within:ring-2 ring-black/70">
        <label
          htmlFor={inputId}
          className="block text-xs font-bold text-zinc-400 uppercase mb-2"
        >
          {label}
        </label>
        <textarea
          id={inputId}
          value={value}
          onChange={handleChange}
          placeholder={placeholder}
          rows={rows}
          className="w-full bg-transparent text-sm font-semibold text-zinc-900 dark:text-white outline-none font-mono resize-y"
          aria-describedby={help ? helpId : undefined}
        />
        {help && (
          <div
            id={helpId}
            className="mt-2 text-xs text-zinc-500 dark:text-zinc-400"
          >
            {help}
          </div>
        )}
      </div>
    );
  },
  (prevProps, nextProps) =>
    prevProps.label === nextProps.label &&
    prevProps.value === nextProps.value &&
    prevProps.placeholder === nextProps.placeholder &&
    prevProps.rows === nextProps.rows &&
    prevProps.help === nextProps.help,
);

TextAreaField.displayName = "TextAreaField";

interface ToggleFieldProps {
  label: string;
  checked: boolean;
  onChange: (next: boolean) => void;
  description?: string;
  id?: string;
}

const ToggleField = memo<ToggleFieldProps>(
  ({ label, checked, onChange, description, id }) => {
    const handleChange = useCallback(
      (e: React.ChangeEvent<HTMLInputElement>) => {
        onChange(e.target.checked);
      },
      [onChange],
    );

    const inputId = useMemo(
      () => id || `toggle-${label.toLowerCase().replace(/\s+/g, "-")}`,
      [id, label],
    );
    const descriptionId = `${inputId}-description`;

    return (
      <label
        htmlFor={inputId}
        className="flex items-start gap-3 text-sm text-zinc-700 dark:text-zinc-200 select-none bg-zinc-50 dark:bg-zinc-900/40 p-3 rounded-xl border border-zinc-200 dark:border-zinc-800 cursor-pointer"
      >
        <input
          id={inputId}
          type="checkbox"
          checked={checked}
          onChange={handleChange}
          className="mt-0.5 h-4 w-4 accent-black"
          aria-describedby={description ? descriptionId : undefined}
        />
        <span className="min-w-0">
          <span className="block font-bold">{label}</span>
          {description && (
            <span
              id={descriptionId}
              className="block text-xs text-zinc-500 dark:text-zinc-400"
            >
              {description}
            </span>
          )}
        </span>
      </label>
    );
  },
  (prevProps, nextProps) =>
    prevProps.label === nextProps.label &&
    prevProps.checked === nextProps.checked &&
    prevProps.description === nextProps.description,
);

ToggleField.displayName = "ToggleField";

// Memoized pool calculation for password mode
const usePasswordPool = (
  charset: GeneratorParams["charset"],
  customCharset: string | undefined,
  includeLower: boolean | undefined,
  includeUpper: boolean | undefined,
  includeDigits: boolean | undefined,
  includeSymbols: boolean | undefined,
  excludeAmbiguous: boolean | undefined,
  excludeChars: string | undefined,
  showPro: boolean,
) => {
  return useMemo(() => {
    if (!showPro) {
      if (charset === "custom") return customCharset ?? "";
      if (charset === "numeric") return "0123456789";
      if (charset === "hex") return "0123456789ABCDEF";
      if (charset === "alphanumeric")
        return "23456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz";
      return "23456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz!@#$%^&*()_+-=";
    }
    const useLower = includeLower ?? true;
    const useUpper = includeUpper ?? true;
    const useDigits = includeDigits ?? true;
    const useSymbols = includeSymbols ?? true;
    const groups: string[] = [];
    if (useLower) groups.push(PASSWORD_SETS.lower);
    if (useUpper) groups.push(PASSWORD_SETS.upper);
    if (useDigits) groups.push(PASSWORD_SETS.digits);
    if (useSymbols) groups.push(PASSWORD_SETS.symbols);
    let p = groups.length
      ? groups.join("")
      : "23456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz!@#$%^&*()_+-=";
    if (excludeAmbiguous) p = removeChars(p, AMBIGUOUS_CHARS);
    if (typeof excludeChars === "string" && excludeChars.length)
      p = removeChars(p, excludeChars);
    return p;
  }, [
    charset,
    customCharset,
    includeLower,
    includeUpper,
    includeDigits,
    includeSymbols,
    excludeAmbiguous,
    excludeChars,
    showPro,
  ]);
};

// Separate component for password mode with memoization
const PasswordControls = memo<{
  config: ToolConfig;
  params: GeneratorParams;
  onChange: (patch: Partial<GeneratorParams>) => void;
}>(
  ({ config, params, onChange }) => {
    const charset = params.charset ?? "strong";
    const showPro =
      config.slug.includes("password-pro") ||
      typeof params.include_lower === "boolean" ||
      typeof params.include_upper === "boolean" ||
      typeof params.include_digits === "boolean" ||
      typeof params.include_symbols === "boolean" ||
      typeof params.exclude_ambiguous === "boolean" ||
      typeof params.exclude_chars === "string" ||
      typeof params.ensure_each === "boolean";

    const len = params.length ?? 12;
    const pool = usePasswordPool(
      charset,
      params.custom_charset,
      params.include_lower,
      params.include_upper,
      params.include_digits,
      params.include_symbols,
      params.exclude_ambiguous,
      params.exclude_chars,
      showPro,
    );

    const poolSize = uniqCharsCount(pool);
    const bits = estimateEntropyBits(Math.max(0, Math.floor(len)), poolSize);
    const strength = strengthLabel(bits);

    const handleLengthChange = useCallback(
      (e: React.ChangeEvent<HTMLInputElement>) => {
        onChange({ length: Number(e.target.value) });
      },
      [onChange],
    );

    const handleCountChange = useCallback(
      (v: number) => {
        onChange({ count: v });
      },
      [onChange],
    );

    const handleGroupingChange = useCallback(
      (e: React.ChangeEvent<HTMLSelectElement>) => {
        onChange({ grouping: e.target.value === "1" });
      },
      [onChange],
    );

    const handleCharsetChange = useCallback(
      (e: React.ChangeEvent<HTMLSelectElement>) => {
        onChange({ charset: e.target.value as GeneratorParams["charset"] });
      },
      [onChange],
    );

    const handleCustomCharsetChange = useCallback(
      (e: React.ChangeEvent<HTMLInputElement>) => {
        onChange({ custom_charset: e.target.value });
      },
      [onChange],
    );

    const handleExcludeAmbiguousChange = useCallback(
      (v: boolean) => {
        onChange({ exclude_ambiguous: v });
      },
      [onChange],
    );

    const handleEnsureEachChange = useCallback(
      (v: boolean) => {
        onChange({ ensure_each: v });
      },
      [onChange],
    );

    const handleExcludeCharsChange = useCallback(
      (e: React.ChangeEvent<HTMLInputElement>) => {
        onChange({ exclude_chars: e.target.value });
      },
      [onChange],
    );

    const handleIncludeLowerChange = useCallback(
      (v: boolean) => {
        onChange({ include_lower: v });
      },
      [onChange],
    );

    const handleIncludeUpperChange = useCallback(
      (v: boolean) => {
        onChange({ include_upper: v });
      },
      [onChange],
    );

    const handleIncludeDigitsChange = useCallback(
      (v: boolean) => {
        onChange({ include_digits: v });
      },
      [onChange],
    );

    const handleIncludeSymbolsChange = useCallback(
      (v: boolean) => {
        onChange({ include_symbols: v });
      },
      [onChange],
    );

    return (
      <div className="space-y-4">
        <div className="grid grid-cols-1">
          <div className="flex items-center justify-between px-2 mb-1">
            <label className="text-xs font-bold text-zinc-500 uppercase">
              Length: {params.length ?? 12}
            </label>
          </div>
          <input
            type="range"
            min={4}
            max={64}
            value={params.length ?? 12}
            onChange={handleLengthChange}
            className="w-full h-2 bg-zinc-200 dark:bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-black"
          />
        </div>

        <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white/60 dark:bg-black/20 p-3">
          <div className="flex items-center justify-between gap-3 text-xs font-bold uppercase text-zinc-500 dark:text-zinc-400">
            <span>Strength</span>
            <span className="font-mono normal-case text-zinc-600 dark:text-zinc-300">
              {strength.label} · {Math.round(bits)} bits
            </span>
          </div>
          <div className="mt-2 h-2 rounded-full bg-zinc-200 dark:bg-zinc-800 overflow-hidden">
            <div
              className={cn("h-2", strength.color)}
              style={{ width: `${strength.pct}%` }}
            />
          </div>
          <div className="mt-2 text-xs text-zinc-500 dark:text-zinc-400">
            Pool size: {poolSize} · Length: {Math.floor(len)}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <NumberField
            label="Batch"
            value={params.count}
            min={1}
            max={200}
            step={1}
            onChange={handleCountChange}
          />
          <div className="bg-zinc-50 dark:bg-zinc-900/40 p-3 rounded-xl border border-zinc-200 dark:border-zinc-800">
            <label className="block text-xs font-bold text-zinc-400 uppercase mb-2">
              Grouping
            </label>
            <select
              value={Boolean(params.grouping) ? "1" : "0"}
              onChange={handleGroupingChange}
              className="w-full bg-transparent text-base font-semibold text-zinc-900 dark:text-white outline-none"
            >
              <option value="0">None</option>
              <option value="1">xxxx-xxxx</option>
            </select>
          </div>
        </div>

        {!showPro && (
          <div className="grid grid-cols-1">
            <div className="bg-zinc-50 dark:bg-zinc-900/40 p-3 rounded-xl border border-zinc-200 dark:border-zinc-800">
              <label className="block text-xs font-bold text-zinc-400 uppercase mb-2">
                Charset
              </label>
              <select
                value={charset}
                onChange={handleCharsetChange}
                className="w-full bg-transparent text-base font-semibold text-zinc-900 dark:text-white outline-none"
              >
                <option value="strong">Strong</option>
                <option value="alphanumeric">Alphanumeric</option>
                <option value="numeric">Numeric</option>
                <option value="hex">Hex</option>
                <option value="custom">Custom</option>
              </select>
            </div>
          </div>
        )}

        {!showPro && charset === "custom" && (
          <div className="bg-zinc-50 dark:bg-zinc-900/40 p-3 rounded-xl border border-zinc-200 dark:border-zinc-800 focus-within:ring-2 ring-black/70">
            <label className="block text-xs font-bold text-zinc-400 uppercase mb-1">
              Custom Charset
            </label>
            <input
              type="text"
              value={params.custom_charset ?? ""}
              onChange={handleCustomCharsetChange}
              placeholder="e.g. ABCD1234!@#$"
              className="w-full bg-transparent text-base font-semibold text-zinc-900 dark:text-white outline-none font-mono"
            />
          </div>
        )}

        {showPro && (
          <>
            <div className="grid grid-cols-2 gap-4">
              <ToggleField
                label="Exclude ambiguous"
                checked={Boolean(params.exclude_ambiguous)}
                onChange={handleExcludeAmbiguousChange}
                description="Removes 0/O, 1/l/I and other confusing characters."
              />
              <ToggleField
                label="Ensure each set"
                checked={Boolean(params.ensure_each)}
                onChange={handleEnsureEachChange}
                description="Guarantees at least 1 from each selected set."
              />
            </div>

            <div className="bg-zinc-50 dark:bg-zinc-900/40 p-3 rounded-xl border border-zinc-200 dark:border-zinc-800 focus-within:ring-2 ring-black/70">
              <label className="block text-xs font-bold text-zinc-400 uppercase mb-1">
                Exclude chars
              </label>
              <input
                type="text"
                value={params.exclude_chars ?? ""}
                onChange={handleExcludeCharsChange}
                placeholder="e.g. @#IlO0"
                className="w-full bg-transparent text-base font-semibold text-zinc-900 dark:text-white outline-none font-mono"
              />
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <ToggleField
                label="Include lowercase"
                checked={params.include_lower ?? true}
                onChange={handleIncludeLowerChange}
              />
              <ToggleField
                label="Include uppercase"
                checked={params.include_upper ?? true}
                onChange={handleIncludeUpperChange}
              />
              <ToggleField
                label="Include digits"
                checked={params.include_digits ?? true}
                onChange={handleIncludeDigitsChange}
              />
              <ToggleField
                label="Include symbols"
                checked={params.include_symbols ?? true}
                onChange={handleIncludeSymbolsChange}
              />
            </div>
          </>
        )}
      </div>
    );
  },
  (prevProps, nextProps) => {
    // Custom comparison for PasswordControls
    return (
      prevProps.config.slug === nextProps.config.slug &&
      prevProps.params.length === nextProps.params.length &&
      prevProps.params.count === nextProps.params.count &&
      prevProps.params.grouping === nextProps.params.grouping &&
      prevProps.params.charset === nextProps.params.charset &&
      prevProps.params.custom_charset === nextProps.params.custom_charset &&
      prevProps.params.include_lower === nextProps.params.include_lower &&
      prevProps.params.include_upper === nextProps.params.include_upper &&
      prevProps.params.include_digits === nextProps.params.include_digits &&
      prevProps.params.include_symbols === nextProps.params.include_symbols &&
      prevProps.params.exclude_ambiguous ===
        nextProps.params.exclude_ambiguous &&
      prevProps.params.exclude_chars === nextProps.params.exclude_chars &&
      prevProps.params.ensure_each === nextProps.params.ensure_each
    );
  },
);

PasswordControls.displayName = "PasswordControls";

export function Controls({
  config,
  params,
  onChange,
}: {
  config: ToolConfig;
  params: GeneratorParams;
  onChange: (patch: Partial<GeneratorParams>) => void;
}) {
  if (!config.ui.show_inputs) return null;

  if (config.mode === "range") {
    return (
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <NumberField
            label="Min"
            value={params.min}
            onChange={(v) => onChange({ min: v })}
          />
          <NumberField
            label="Max"
            value={params.max}
            onChange={(v) => onChange({ max: v })}
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <NumberField
            label="Count"
            value={params.count}
            min={1}
            max={10000}
            step={1}
            onChange={(v) => onChange({ count: v })}
          />
          <NumberField
            label="Step"
            value={params.step}
            min={0.000001}
            step={0.01}
            onChange={(v) => onChange({ step: v })}
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <NumberField
            label="Precision"
            value={params.precision}
            min={0}
            step={1}
            onChange={(v) => onChange({ precision: v })}
          />
          <div className="bg-zinc-50 dark:bg-zinc-900/40 p-3 rounded-xl border border-zinc-200 dark:border-zinc-800">
            <label className="block text-xs font-bold text-zinc-400 uppercase mb-2">
              Sort
            </label>
            <select
              value={params.sort ?? ""}
              onChange={(e) =>
                onChange({
                  sort: (e.target.value || null) as GeneratorParams["sort"],
                })
              }
              className="w-full bg-transparent text-base font-semibold text-zinc-900 dark:text-white outline-none"
            >
              <option value="">None</option>
              <option value="asc">Asc</option>
              <option value="desc">Desc</option>
            </select>
          </div>
        </div>
        <label className="flex items-center gap-3 text-sm text-zinc-600 dark:text-zinc-300 select-none">
          <input
            type="checkbox"
            checked={Boolean(params.unique)}
            onChange={(e) => onChange({ unique: e.target.checked })}
            className="h-4 w-4 accent-black"
          />
          Unique (no repeats)
        </label>
      </div>
    );
  }

  if (config.mode === "password") {
    return (
      <PasswordControls config={config} params={params} onChange={onChange} />
    );
  }

  if (config.mode === "list") {
    const text = params.items_text ?? params.items?.join("\n") ?? "";
    const weighted = Array.isArray(params.weights) && params.weights.length > 0;
    const count = params.count ?? params.pick ?? 1;

    return (
      <div className="space-y-4">
        <TextAreaField
          label="Items"
          value={text}
          onChange={(next) => {
            const parsed = parseItemsText(next, {
              parseWeights: weighted,
              maxItems: 50_000,
            });
            onChange({
              items_text: next,
              items: parsed.items,
              weights: parsed.weights,
            });
          }}
          placeholder={
            'One item per line.\nOptional weights: "Alice | 3" or "Alice,3".\nLines starting with # are ignored.'
          }
          help={
            weighted
              ? "Weights are supported: Name | weight"
              : "Tip: enable weights if you want weighted draws."
          }
        />

        <div className="grid grid-cols-2 gap-4">
          <NumberField
            label="Pick"
            value={typeof count === "number" ? count : 1}
            min={1}
            max={5000}
            step={1}
            onChange={(v) => onChange({ count: v, pick: v })}
          />
          <NumberField
            label="Group size"
            value={params.group_size}
            min={0}
            max={1000}
            step={1}
            onChange={(v) => onChange({ group_size: v })}
          />
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <ToggleField
            label="No repeats"
            checked={Boolean(params.unique)}
            onChange={(v) => onChange({ unique: v })}
            description="Draw without replacement."
          />
          <ToggleField
            label="Enable weights"
            checked={weighted}
            onChange={(v) => {
              const parsed = parseItemsText(text, {
                parseWeights: v,
                maxItems: 50_000,
              });
              onChange({
                weights: v ? parsed.weights : undefined,
                items: parsed.items,
                items_text: text,
              });
            }}
            description="Use “Name | weight” per line."
          />
        </div>
      </div>
    );
  }

  if (config.mode === "shuffle") {
    const text = params.items_text ?? params.items?.join("\n") ?? "";
    return (
      <div className="space-y-4">
        <TextAreaField
          label="List"
          value={text}
          onChange={(next) => {
            const parsed = parseItemsText(next, {
              parseWeights: false,
              maxItems: 50_000,
            });
            onChange({ items_text: next, items: parsed.items });
          }}
          placeholder={
            "Paste names (one per line)\nExample:\nAlice\nBob\nCharlie"
          }
        />
        <div className="grid grid-cols-2 gap-4">
          <NumberField
            label="Group size"
            value={params.group_size}
            min={0}
            max={1000}
            step={1}
            onChange={(v) => onChange({ group_size: v })}
          />
        </div>
      </div>
    );
  }

  if (config.mode === "dice") {
    const sides = params.dice_sides ?? 6;
    const rolls = params.dice_rolls ?? 1;
    const adv = params.dice_adv ?? "none";
    const customText =
      params.items_text ?? params.dice_custom_faces?.join("\n") ?? "";
    const usingCustom =
      sides === 0 ||
      (Array.isArray(params.dice_custom_faces) &&
        params.dice_custom_faces.length >= 2);

    return (
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-zinc-50 dark:bg-zinc-900/40 p-3 rounded-xl border border-zinc-200 dark:border-zinc-800">
            <label className="block text-xs font-bold text-zinc-400 uppercase mb-2">
              Sides
            </label>
            <select
              value={usingCustom ? "custom" : String(sides)}
              onChange={(e) => {
                const v = e.target.value;
                if (v === "custom") {
                  const parsed = parseItemsText(customText, {
                    parseWeights: false,
                    maxItems: 2000,
                  });
                  onChange({
                    dice_sides: 0,
                    dice_custom_faces: parsed.items,
                    items_text: customText,
                  });
                } else {
                  onChange({
                    dice_sides: Number(v),
                    dice_custom_faces: undefined,
                  });
                }
              }}
              className="w-full bg-transparent text-base font-semibold text-zinc-900 dark:text-white outline-none"
            >
              <option value="4">D4</option>
              <option value="6">D6</option>
              <option value="8">D8</option>
              <option value="10">D10</option>
              <option value="12">D12</option>
              <option value="20">D20</option>
              <option value="100">D100</option>
              <option value="custom">Custom faces</option>
            </select>
          </div>

          <NumberField
            label="Rolls"
            value={rolls}
            min={1}
            max={2000}
            step={1}
            onChange={(v) => onChange({ dice_rolls: v })}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <NumberField
            label="Modifier"
            value={params.dice_modifier}
            step={1}
            onChange={(v) => onChange({ dice_modifier: v })}
          />
          <div className="bg-zinc-50 dark:bg-zinc-900/40 p-3 rounded-xl border border-zinc-200 dark:border-zinc-800">
            <label className="block text-xs font-bold text-zinc-400 uppercase mb-2">
              Advantage
            </label>
            <select
              value={adv}
              disabled={!(!usingCustom && sides === 20 && rolls === 1)}
              onChange={(e) =>
                onChange({
                  dice_adv: e.target.value as GeneratorParams["dice_adv"],
                })
              }
              className="w-full bg-transparent text-base font-semibold text-zinc-900 dark:text-white outline-none disabled:opacity-50"
            >
              <option value="none">None</option>
              <option value="advantage">Advantage (2d20, keep high)</option>
              <option value="disadvantage">
                Disadvantage (2d20, keep low)
              </option>
            </select>
          </div>
        </div>

        {usingCustom && (
          <TextAreaField
            label="Custom faces"
            value={customText}
            onChange={(next) => {
              const parsed = parseItemsText(next, {
                parseWeights: false,
                maxItems: 2000,
              });
              onChange({
                items_text: next,
                dice_custom_faces: parsed.items,
                dice_sides: 0,
              });
            }}
            placeholder={"One face per line.\nExample:\nHit\nMiss\nCrit"}
            rows={5}
          />
        )}
      </div>
    );
  }

  if (config.mode === "coin") {
    return (
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <NumberField
            label="Flips"
            value={params.coin_flips ?? params.count}
            min={1}
            max={10000}
            step={1}
            onChange={(v) => onChange({ coin_flips: v, count: v })}
          />
          <div className="bg-zinc-50 dark:bg-zinc-900/40 p-3 rounded-xl border border-zinc-200 dark:border-zinc-800">
            <label className="block text-xs font-bold text-zinc-400 uppercase mb-2">
              Labels
            </label>
            <select
              value={(params.coin_labels ?? ["HEADS", "TAILS"]).join("|")}
              onChange={(e) => {
                const [a, b] = e.target.value.split("|");
                onChange({ coin_labels: [a!, b!] });
              }}
              className="w-full bg-transparent text-base font-semibold text-zinc-900 dark:text-white outline-none"
            >
              <option value="HEADS|TAILS">HEADS / TAILS</option>
              <option value="YES|NO">YES / NO</option>
              <option value="LEFT|RIGHT">LEFT / RIGHT</option>
            </select>
          </div>
        </div>
      </div>
    );
  }

  if (config.mode === "ticket") {
    const source = params.ticket_source ?? "range";
    const remaining = Array.isArray(params.ticket_remaining)
      ? params.ticket_remaining.length
      : null;
    const listText = params.items_text ?? params.items?.join("\n") ?? "";

    return (
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-zinc-50 dark:bg-zinc-900/40 p-3 rounded-xl border border-zinc-200 dark:border-zinc-800">
            <label className="block text-xs font-bold text-zinc-400 uppercase mb-2">
              Source
            </label>
            <select
              value={source}
              onChange={(e) =>
                onChange({
                  ticket_source: e.target
                    .value as GeneratorParams["ticket_source"],
                  ticket_remaining: [],
                })
              }
              className="w-full bg-transparent text-base font-semibold text-zinc-900 dark:text-white outline-none"
            >
              <option value="range">Number range</option>
              <option value="list">Custom list</option>
            </select>
          </div>
          <NumberField
            label="Draw"
            value={params.count ?? params.pick ?? 1}
            min={1}
            max={5000}
            step={1}
            onChange={(v) => onChange({ count: v, pick: v })}
          />
        </div>

        {source === "range" ? (
          <div className="grid grid-cols-2 gap-4">
            <NumberField
              label="Min"
              value={params.min}
              onChange={(v) => onChange({ min: v, ticket_remaining: [] })}
            />
            <NumberField
              label="Max"
              value={params.max}
              onChange={(v) => onChange({ max: v, ticket_remaining: [] })}
            />
          </div>
        ) : (
          <TextAreaField
            label="Tickets"
            value={listText}
            onChange={(next) => {
              const parsed = parseItemsText(next, {
                parseWeights: false,
                maxItems: 50_000,
              });
              onChange({
                items_text: next,
                items: parsed.items,
                ticket_remaining: [],
              });
            }}
            placeholder={"One ticket per line.\nExample:\nA-001\nA-002\nA-003"}
          />
        )}

        <div className="flex items-center justify-between">
          <div className="text-sm font-semibold text-zinc-600 dark:text-zinc-300">
            Remaining: {remaining === null ? "—" : remaining}
          </div>
          <button
            type="button"
            onClick={() => onChange({ ticket_remaining: [] })}
            className="h-10 px-4 rounded-xl border border-zinc-200 dark:border-zinc-800 font-bold text-sm hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-colors"
          >
            Reset
          </button>
        </div>
      </div>
    );
  }

  if (config.mode === "uuid") {
    return (
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <NumberField
            label="Count"
            value={params.count}
            min={1}
            max={10000}
            step={1}
            onChange={(v) => onChange({ count: v })}
          />
          <div className="bg-zinc-50 dark:bg-zinc-900/40 p-3 rounded-xl border border-zinc-200 dark:border-zinc-800">
            <label className="block text-xs font-bold text-zinc-400 uppercase mb-2">
              Case
            </label>
            <select
              value={Boolean(params.uuid_uppercase) ? "upper" : "lower"}
              onChange={(e) =>
                onChange({ uuid_uppercase: e.target.value === "upper" })
              }
              className="w-full bg-transparent text-base font-semibold text-zinc-900 dark:text-white outline-none"
            >
              <option value="lower">
                Lowercase (xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx)
              </option>
              <option value="upper">
                Uppercase (XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX)
              </option>
            </select>
          </div>
        </div>

        <ToggleField
          label="Include hyphens"
          checked={params.uuid_hyphens !== false}
          onChange={(v) => onChange({ uuid_hyphens: v })}
          description="Format as xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx or continuous 32 characters."
        />
      </div>
    );
  }

  if (config.mode === "color") {
    return (
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <NumberField
            label="Count"
            value={params.count}
            min={1}
            max={10000}
            step={1}
            onChange={(v) => onChange({ count: v })}
          />
          <div className="bg-zinc-50 dark:bg-zinc-900/40 p-3 rounded-xl border border-zinc-200 dark:border-zinc-800">
            <label className="block text-xs font-bold text-zinc-400 uppercase mb-2">
              Format
            </label>
            <select
              value={params.color_format ?? "hex"}
              onChange={(e) =>
                onChange({
                  color_format: e.target
                    .value as GeneratorParams["color_format"],
                })
              }
              className="w-full bg-transparent text-base font-semibold text-zinc-900 dark:text-white outline-none"
            >
              <option value="hex">HEX (#RRGGBB)</option>
              <option value="rgb">RGB (rgb(r, g, b))</option>
              <option value="hsl">HSL (hsl(h, s%, l%))</option>
            </select>
          </div>
        </div>
      </div>
    );
  }

  if (config.mode === "hex") {
    return (
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <NumberField
            label="Count"
            value={params.count}
            min={1}
            max={10000}
            step={1}
            onChange={(v) => onChange({ count: v })}
          />
          <NumberField
            label="Bytes"
            value={params.hex_bytes}
            min={1}
            max={1024}
            step={1}
            onChange={(v) => onChange({ hex_bytes: v })}
          />
        </div>

        <ToggleField
          label="Add 0x prefix"
          checked={Boolean(params.hex_prefix)}
          onChange={(v) => onChange({ hex_prefix: v })}
          description="Useful for programming. Example: 0x1A3F5C7E"
        />
      </div>
    );
  }

  return null;
}
