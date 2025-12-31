"use client";

import { type ReactNode } from "react";
import { cn } from "@/lib/utils";
import { AlertTriangle, RefreshCw, XCircle } from "lucide-react";

export type ErrorSeverity = "low" | "medium" | "high";

export interface ErrorStateProps {
  title?: string;
  message: string;
  severity?: ErrorSeverity;
  onRetry?: () => void;
  onDismiss?: () => void;
  className?: string;
  compact?: boolean;
  action?: ReactNode;
}

const severityStyles = {
  low: {
    bgClass: "bg-amber-50 dark:bg-amber-950/30",
    borderClass: "border-amber-200 dark:border-amber-800",
    iconClass: "text-amber-600 dark:text-amber-400",
    titleClass: "text-amber-900 dark:text-amber-100",
    messageClass: "text-amber-700 dark:text-amber-200",
  },
  medium: {
    bgClass: "bg-orange-50 dark:bg-orange-950/30",
    borderClass: "border-orange-200 dark:border-orange-800",
    iconClass: "text-orange-600 dark:text-orange-400",
    titleClass: "text-orange-900 dark:text-orange-100",
    messageClass: "text-orange-700 dark:text-orange-200",
  },
  high: {
    bgClass: "bg-red-50 dark:bg-red-950/30",
    borderClass: "border-red-200 dark:border-red-800",
    iconClass: "text-red-600 dark:text-red-400",
    titleClass: "text-red-900 dark:text-red-100",
    messageClass: "text-red-700 dark:text-red-200",
  },
};

export function ErrorState({
  title,
  message,
  severity = "medium",
  onRetry,
  onDismiss,
  className,
  compact = false,
  action,
}: ErrorStateProps) {
  const styles = severityStyles[severity];

  if (compact) {
    return (
      <div
        className={cn(
          "flex items-start gap-3 p-4 rounded-xl border",
          styles.bgClass,
          styles.borderClass,
          className,
        )}
        role="alert"
        aria-live="assertive"
      >
        <AlertTriangle
          className={cn("w-5 h-5 flex-shrink-0 mt-0.5", styles.iconClass)}
          aria-hidden="true"
        />
        <div className="flex-1 min-w-0">
          {title && (
            <p className={cn("font-semibold text-sm", styles.titleClass)}>
              {title}
            </p>
          )}
          <p
            className={cn(
              "text-sm",
              title ? styles.messageClass : styles.titleClass,
            )}
          >
            {message}
          </p>
          {action && <div className="mt-2">{action}</div>}
        </div>
        {onDismiss && (
          <button
            type="button"
            onClick={onDismiss}
            className={cn(
              "flex-shrink-0 p-1 rounded-lg transition-colors",
              "hover:bg-black/5 dark:hover:bg-white/10",
              styles.titleClass,
            )}
            aria-label="Dismiss error"
          >
            <XCircle className="w-4 h-4" aria-hidden="true" />
          </button>
        )}
      </div>
    );
  }

  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center text-center p-8 rounded-2xl border",
        styles.bgClass,
        styles.borderClass,
        className,
      )}
      role="alert"
      aria-live="assertive"
    >
      <div
        className={cn(
          "flex items-center justify-center w-16 h-16 rounded-full",
          "bg-white/50 dark:bg-black/20",
          styles.iconClass,
          "mb-4",
        )}
      >
        <AlertTriangle className="w-8 h-8" aria-hidden="true" />
      </div>

      {title && (
        <h3 className={cn("text-lg font-semibold", styles.titleClass)}>
          {title}
        </h3>
      )}

      <p className={cn("text-sm max-w-md mt-1", styles.messageClass)}>
        {message}
      </p>

      <div className="flex gap-3 mt-4">
        {onRetry && (
          <button
            type="button"
            onClick={onRetry}
            className={cn(
              "inline-flex items-center gap-2 px-4 py-2 rounded-lg font-semibold text-sm",
              "bg-white dark:bg-black",
              "border-2 border-current",
              styles.titleClass,
              "hover:bg-black/5 dark:hover:bg-white/10",
              "transition-colors",
            )}
          >
            <RefreshCw className="w-4 h-4" aria-hidden="true" />
            Try Again
          </button>
        )}
        {onDismiss && (
          <button
            type="button"
            onClick={onDismiss}
            className={cn(
              "inline-flex items-center gap-2 px-4 py-2 rounded-lg font-semibold text-sm",
              "hover:bg-black/5 dark:hover:bg-white/10",
              styles.titleClass,
              "transition-colors",
            )}
          >
            Dismiss
          </button>
        )}
        {action}
      </div>
    </div>
  );
}
