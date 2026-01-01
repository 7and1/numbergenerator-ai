"use client";

import { memo, useMemo } from "react";
import type { PasswordStrengthResult } from "@/lib/passwordStrength";
import {
  Shield,
  ShieldAlert,
  ShieldCheck,
  ShieldX,
  Clock,
  Check,
  X,
} from "lucide-react";

const cn = (...classes: (string | false | undefined | null)[]) => {
  return classes.filter(Boolean).join(" ");
};

interface PasswordStrengthMeterProps {
  strength: PasswordStrengthResult;
  showFeedback?: boolean;
  showRequirements?: boolean;
  showCrackTime?: boolean;
  showNistBadge?: boolean;
  compact?: boolean;
  className?: string;
}

const StrengthBar = memo<{
  score: number;
  color: string;
  animated?: boolean;
}>(({ score, color, animated = true }) => {
  const segments = useMemo(() => {
    return [0, 1, 2, 3, 4].map((i) => {
      const threshold = (i + 1) * 20;
      const isActive = score >= threshold;
      const isPartial = score > i * 20 && score < threshold;
      const partialPercent = isPartial ? ((score - i * 20) / 20) * 100 : 0;

      return (
        <div
          key={i}
          className={cn(
            "h-2 rounded-full transition-all duration-300 ease-out",
            isActive ? "opacity-100" : "opacity-20",
            animated && "transition-all",
          )}
          style={{
            backgroundColor: isActive ? color : undefined,
            backgroundImage: isPartial
              ? `linear-gradient(to right, ${color} ${partialPercent}%, transparent ${partialPercent}%)`
              : undefined,
          }}
          aria-label={`Strength segment ${i + 1}`}
        />
      );
    });
  }, [score, color, animated]);

  return (
    <div className="flex gap-1" role="progressbar" aria-valuenow={score}>
      {segments}
    </div>
  );
});

StrengthBar.displayName = "StrengthBar";

const RequirementItem = memo<{
  met: boolean;
  label: string;
}>(({ met, label }) => {
  return (
    <li
      className={cn(
        "flex items-center gap-2 text-sm transition-colors",
        met
          ? "text-green-600 dark:text-green-400"
          : "text-zinc-500 dark:text-zinc-400",
      )}
    >
      {met ? (
        <Check size={14} className="shrink-0" aria-hidden="true" />
      ) : (
        <X size={14} className="shrink-0" aria-hidden="true" />
      )}
      <span>{label}</span>
    </li>
  );
});

RequirementItem.displayName = "RequirementItem";

const StrengthIcon = memo<{ score: number }>(({ score }) => {
  if (score >= 70) {
    return (
      <ShieldCheck size={20} className="text-green-500" aria-hidden="true" />
    );
  }
  if (score >= 40) {
    return <Shield size={20} className="text-yellow-500" aria-hidden="true" />;
  }
  if (score >= 20) {
    return (
      <ShieldAlert size={20} className="text-orange-500" aria-hidden="true" />
    );
  }
  return <ShieldX size={20} className="text-red-500" aria-hidden="true" />;
});

StrengthIcon.displayName = "StrengthIcon";

// Export internal components for advanced use cases
export { StrengthBar, RequirementItem, StrengthIcon };

const PasswordStrengthMeter = memo<PasswordStrengthMeterProps>(
  ({
    strength,
    showFeedback = true,
    showRequirements = true,
    showCrackTime = true,
    showNistBadge = true,
    compact = false,
    className = "",
  }) => {
    const {
      score,
      label,
      color,
      entropyBits,
      crackTime,
      requirements,
      nistCompliant,
      feedback,
      poolSize,
    } = strength;

    const ariaLabel = `Password strength: ${label}, ${score} out of 100`;

    if (compact) {
      return (
        <div
          className={cn(
            "flex items-center gap-3 p-3 rounded-xl border bg-zinc-50 dark:bg-zinc-900/40",
            className,
          )}
          role="region"
          aria-label={ariaLabel}
        >
          <StrengthIcon score={score} />
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-bold text-zinc-500 uppercase">
                Strength
              </span>
              <span className="text-xs font-bold" style={{ color }}>
                {label}
              </span>
            </div>
            <StrengthBar score={score} color={color} />
          </div>
        </div>
      );
    }

    return (
      <div
        className={cn(
          "rounded-xl border bg-zinc-50 dark:bg-zinc-900/40 overflow-hidden",
          className,
        )}
        role="region"
        aria-label={ariaLabel}
      >
        {/* Header with strength indicator */}
        <div className="p-4 border-b border-zinc-200 dark:border-zinc-800">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <StrengthIcon score={score} />
              <h3 className="font-bold text-zinc-900 dark:text-white">
                Password Strength
              </h3>
            </div>
            <div className="flex items-center gap-2">
              {nistCompliant && showNistBadge && (
                <span
                  className="px-2 py-1 text-xs font-bold rounded-md bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300"
                  title="Meets NIST SP 800-63B guidelines"
                >
                  NIST Compliant
                </span>
              )}
              <span
                className="text-lg font-black tabular-nums"
                style={{ color }}
              >
                {score}
              </span>
            </div>
          </div>

          {/* Strength bar */}
          <StrengthBar score={score} color={color} />

          {/* Strength label and entropy */}
          <div className="flex items-center justify-between mt-2 text-xs text-zinc-600 dark:text-zinc-400">
            <span className="font-bold uppercase" style={{ color }}>
              {label}
            </span>
            <span className="font-mono">
              {entropyBits} bits entropy · Pool: {poolSize}
            </span>
          </div>
        </div>

        {/* Crack time estimate */}
        {showCrackTime && (
          <div className="px-4 py-3 border-b border-zinc-200 dark:border-zinc-800 bg-zinc-100/50 dark:bg-zinc-800/30">
            <div className="flex items-center gap-2 text-sm">
              <Clock size={14} className="text-zinc-500" aria-hidden="true" />
              <span className="text-zinc-600 dark:text-zinc-400">
                Time to crack:{" "}
                <span className="font-bold text-zinc-900 dark:text-white">
                  {crackTime.time}
                </span>
              </span>
            </div>
          </div>
        )}

        {/* Requirements checklist */}
        {showRequirements && (
          <div className="p-4 border-b border-zinc-200 dark:border-zinc-800">
            <h4 className="text-xs font-bold text-zinc-500 uppercase mb-3">
              Requirements ({requirements.met}/{requirements.total})
            </h4>
            <ul className="space-y-1.5">
              <RequirementItem
                met={requirements.minLength}
                label="8+ characters"
              />
              <RequirementItem
                met={requirements.hasLower}
                label="Lowercase (a-z)"
              />
              <RequirementItem
                met={requirements.hasUpper}
                label="Uppercase (A-Z)"
              />
              <RequirementItem
                met={requirements.hasDigit}
                label="Numbers (0-9)"
              />
              <RequirementItem
                met={requirements.hasSymbol}
                label="Symbols (!@#$...)"
              />
            </ul>
          </div>
        )}

        {/* Feedback */}
        {showFeedback && feedback.length > 0 && (
          <div className="p-4">
            <h4 className="text-xs font-bold text-zinc-500 uppercase mb-2">
              Suggestions
            </h4>
            <ul className="space-y-1">
              {feedback.slice(0, 3).map((item, i) => (
                <li
                  key={i}
                  className="text-sm text-zinc-600 dark:text-zinc-400 flex items-start gap-2"
                >
                  <span className="text-zinc-400">•</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    );
  },
);

PasswordStrengthMeter.displayName = "PasswordStrengthMeter";

export { PasswordStrengthMeter };
export { PasswordStrengthMeter as default };
export type { PasswordStrengthMeterProps };
