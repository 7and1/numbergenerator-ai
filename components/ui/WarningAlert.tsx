"use client";

import { type ReactNode } from "react";
import { cn } from "@/lib/utils";
import { AlertTriangle, Info, X } from "lucide-react";

export type WarningVariant = "caution" | "info" | "tip";

export interface WarningAlertProps {
  variant?: WarningVariant;
  title?: string;
  children: ReactNode;
  dismissible?: boolean;
  onDismiss?: () => void;
  className?: string;
}

const variantConfig = {
  caution: {
    icon: AlertTriangle,
    bgClass: "bg-amber-50 dark:bg-amber-950/30",
    borderClass: "border-amber-200 dark:border-amber-800",
    iconClass: "text-amber-600 dark:text-amber-400",
    titleClass: "text-amber-900 dark:text-amber-100",
    textClass: "text-amber-800 dark:text-amber-200",
  },
  info: {
    icon: Info,
    bgClass: "bg-blue-50 dark:bg-blue-950/30",
    borderClass: "border-blue-200 dark:border-blue-800",
    iconClass: "text-blue-600 dark:text-blue-400",
    titleClass: "text-blue-900 dark:text-blue-100",
    textClass: "text-blue-800 dark:text-blue-200",
  },
  tip: {
    icon: Info,
    bgClass: "bg-emerald-50 dark:bg-emerald-950/30",
    borderClass: "border-emerald-200 dark:border-emerald-800",
    iconClass: "text-emerald-600 dark:text-emerald-400",
    titleClass: "text-emerald-900 dark:text-emerald-100",
    textClass: "text-emerald-800 dark:text-emerald-200",
  },
};

export function WarningAlert({
  variant = "caution",
  title,
  children,
  dismissible = false,
  onDismiss,
  className,
}: WarningAlertProps) {
  const config = variantConfig[variant];
  const Icon = config.icon;

  return (
    <div
      className={cn(
        "flex items-start gap-3 p-4 rounded-xl border",
        config.bgClass,
        config.borderClass,
        className,
      )}
      role="alert"
      aria-live={variant === "caution" ? "assertive" : "polite"}
    >
      <Icon
        className={cn("w-5 h-5 flex-shrink-0 mt-0.5", config.iconClass)}
        aria-hidden="true"
      />
      <div className="flex-1 min-w-0">
        {title && (
          <p className={cn("font-semibold text-sm mb-1", config.titleClass)}>
            {title}
          </p>
        )}
        <div className={cn("text-sm", config.textClass)}>{children}</div>
      </div>
      {dismissible && onDismiss && (
        <button
          type="button"
          onClick={onDismiss}
          className={cn(
            "flex-shrink-0 p-1 rounded-lg transition-colors",
            "hover:bg-black/5 dark:hover:bg-white/10",
            config.titleClass,
          )}
          aria-label="Dismiss warning"
        >
          <X className="w-4 h-4" aria-hidden="true" />
        </button>
      )}
    </div>
  );
}
