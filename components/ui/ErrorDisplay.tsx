"use client";

import { useState } from "react";
import {
  AlertTriangle,
  AlertCircle,
  XCircle,
  ChevronDown,
  ChevronUp,
  Copy,
  Mail,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "./Button";
import { trackEvent } from "@/lib/analytics";

export type ErrorSeverity = "warning" | "error" | "critical";

export interface ErrorDisplayProps {
  title: string;
  message: string;
  severity?: ErrorSeverity;
  errorId?: string;
  technicalDetails?: string;
  actions?: Array<{
    label: string;
    onClick: () => void;
    variant?: "primary" | "secondary" | "ghost" | "danger";
  }>;
  onDismiss?: () => void;
  className?: string;
  compact?: boolean;
}

const severityConfig = {
  warning: {
    bgClass: "bg-amber-50 dark:bg-amber-950/30",
    borderClass: "border-amber-200 dark:border-amber-800",
    iconBgClass: "bg-amber-100 dark:bg-amber-900/50",
    icon: AlertTriangle,
    iconClass: "text-amber-600 dark:text-amber-400",
    titleClass: "text-amber-900 dark:text-amber-100",
    messageClass: "text-amber-700 dark:text-amber-200",
  },
  error: {
    bgClass: "bg-orange-50 dark:bg-orange-950/30",
    borderClass: "border-orange-200 dark:border-orange-800",
    iconBgClass: "bg-orange-100 dark:bg-orange-900/50",
    icon: AlertCircle,
    iconClass: "text-orange-600 dark:text-orange-400",
    titleClass: "text-orange-900 dark:text-orange-100",
    messageClass: "text-orange-700 dark:text-orange-200",
  },
  critical: {
    bgClass: "bg-red-50 dark:bg-red-950/30",
    borderClass: "border-red-200 dark:border-red-800",
    iconBgClass: "bg-red-100 dark:bg-red-900/50",
    icon: XCircle,
    iconClass: "text-red-600 dark:text-red-400",
    titleClass: "text-red-900 dark:text-red-100",
    messageClass: "text-red-700 dark:text-red-200",
  },
};

export function ErrorDisplay({
  title,
  message,
  severity = "error",
  errorId,
  technicalDetails,
  actions,
  onDismiss,
  className,
  compact = false,
}: ErrorDisplayProps) {
  const [showTechnical, setShowTechnical] = useState(false);
  const [copied, setCopied] = useState(false);
  const config = severityConfig[severity];
  const Icon = config.icon;

  const handleCopyErrorId = () => {
    if (errorId) {
      navigator.clipboard.writeText(errorId);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      trackEvent("error_copy_id", { severity, errorId });
    }
  };

  const handleReport = () => {
    const subject = encodeURIComponent(
      "Error Report: " + (errorId || "unknown"),
    );
    const body = encodeURIComponent(
      "Error ID: " +
        (errorId || "N/A") +
        "\n" +
        "Title: " +
        title +
        "\n" +
        "Message: " +
        message +
        "\n" +
        "Severity: " +
        severity +
        "\n" +
        "URL: " +
        (typeof window !== "undefined" ? window.location.href : "N/A") +
        "\n" +
        "Timestamp: " +
        new Date().toISOString() +
        "\n\n" +
        (technicalDetails
          ? "Technical Details:\n" + technicalDetails + "\n\n"
          : "") +
        "Please describe what you were doing:\n",
    );
    window.location.href =
      "mailto:support@numbergenerator.ai?subject=" + subject + "&body=" + body;
    trackEvent("error_report", { severity, errorId });
  };

  if (compact) {
    return (
      <div
        className={cn(
          "flex items-start gap-3 p-4 rounded-xl border",
          config.bgClass,
          config.borderClass,
          className,
        )}
        role="alert"
        aria-live="assertive"
      >
        <div className={cn("flex-shrink-0 p-2 rounded-lg", config.iconBgClass)}>
          <Icon
            className={cn("w-5 h-5", config.iconClass)}
            aria-hidden="true"
          />
        </div>
        <div className="flex-1 min-w-0">
          <h4 className={cn("font-semibold text-sm", config.titleClass)}>
            {title}
          </h4>
          <p className={cn("text-sm mt-1", config.messageClass)}>{message}</p>
          {errorId && (
            <button
              type="button"
              onClick={handleCopyErrorId}
              className="mt-2 text-xs font-mono opacity-60 hover:opacity-100 transition-opacity flex items-center gap-1"
            >
              <Copy className="w-3 h-3" />
              {copied ? "Copied!" : errorId}
            </button>
          )}
        </div>
        {onDismiss && (
          <button
            type="button"
            onClick={onDismiss}
            className={cn(
              "flex-shrink-0 p-1 rounded-lg transition-colors",
              "hover:bg-black/5 dark:hover:bg-white/10",
              config.titleClass,
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
        "w-full p-6 rounded-2xl border",
        config.bgClass,
        config.borderClass,
        className,
      )}
      role="alert"
      aria-live="assertive"
    >
      {/* Header with icon and title */}
      <div className="flex items-start gap-4">
        <div className={cn("flex-shrink-0 p-3 rounded-xl", config.iconBgClass)}>
          <Icon
            className={cn("w-6 h-6", config.iconClass)}
            aria-hidden="true"
          />
        </div>
        <div className="flex-1">
          <h3 className={cn("text-lg font-semibold", config.titleClass)}>
            {title}
          </h3>
          <p className={cn("text-sm mt-1", config.messageClass)}>{message}</p>
        </div>
        {onDismiss && (
          <button
            type="button"
            onClick={onDismiss}
            className={cn(
              "flex-shrink-0 p-1 rounded-lg transition-colors",
              "hover:bg-black/5 dark:hover:bg-white/10",
              config.titleClass,
            )}
            aria-label="Dismiss error"
          >
            <XCircle className="w-5 h-5" aria-hidden="true" />
          </button>
        )}
      </div>

      {/* Error ID */}
      {errorId && (
        <div className="mt-4 flex items-center gap-2">
          <span className="text-xs font-semibold uppercase tracking-wider opacity-60">
            Error ID:
          </span>
          <code className="text-xs font-mono px-2 py-1 rounded bg-white/50 dark:bg-black/20">
            {errorId}
          </code>
          <button
            type="button"
            onClick={handleCopyErrorId}
            className="p-1 rounded hover:bg-white/30 dark:hover:bg-black/30 transition-colors"
            aria-label="Copy error ID"
          >
            <Copy className="w-3 h-3 opacity-60" />
          </button>
          {copied && <span className="text-xs opacity-60">Copied!</span>}
        </div>
      )}

      {/* Action Buttons */}
      <div className="mt-4 flex flex-wrap gap-2">
        {actions?.map((action, index) => (
          <Button
            key={index}
            variant={action.variant || "secondary"}
            size="sm"
            onClick={action.onClick}
          >
            {action.label}
          </Button>
        ))}
        <Button
          variant="ghost"
          size="sm"
          icon={<Mail className="w-4 h-4" />}
          onClick={handleReport}
        >
          Report
        </Button>
      </div>

      {/* Technical Details (collapsible) */}
      {technicalDetails && (
        <details className="mt-4">
          <summary
            className="flex items-center gap-2 cursor-pointer text-sm font-semibold opacity-60 hover:opacity-100 transition-opacity select-none"
            onClick={(e) => {
              e.preventDefault();
              setShowTechnical(!showTechnical);
            }}
          >
            {showTechnical ? (
              <ChevronUp className="w-4 h-4" aria-hidden="true" />
            ) : (
              <ChevronDown className="w-4 h-4" aria-hidden="true" />
            )}
            Technical Details
          </summary>
          {showTechnical && (
            <pre className="mt-2 p-3 text-xs font-mono overflow-auto max-h-40 rounded-lg bg-white/50 dark:bg-black/20">
              {technicalDetails}
            </pre>
          )}
        </details>
      )}

      {/* Development stack trace */}
      {process.env.NODE_ENV === "development" && technicalDetails && (
        <details className="mt-2">
          <summary className="flex items-center gap-2 cursor-pointer text-xs font-mono opacity-40 hover:opacity-100 transition-opacity select-none">
            Stack Trace (Dev)
          </summary>
          <pre className="mt-2 p-3 text-xs font-mono overflow-auto max-h-32 rounded-lg bg-black/5 dark:bg-white/5">
            {technicalDetails}
          </pre>
        </details>
      )}
    </div>
  );
}
