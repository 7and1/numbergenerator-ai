"use client";

import { useEffect } from "react";
import { AlertTriangle, RefreshCw, Home, Mail } from "lucide-react";
import { trackEvent } from "@/lib/analytics";

const SUPPORT_EMAIL = "support@numbergenerator.ai";

interface GlobalErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

function generateErrorId(): string {
  return "err-" + Date.now() + "-" + Math.random().toString(36).substring(2, 9);
}

export default function GlobalError({ error, reset }: GlobalErrorProps) {
  const errorId = generateErrorId();

  useEffect(() => {
    // Log error in development
    if (process.env.NODE_ENV === "development") {
      console.error("Global error boundary caught:", error);
    }

    // Track error to analytics
    trackEvent("error_global", {
      errorId,
      message: error.message,
      digest: error.digest,
      timestamp: Date.now(),
    });
  }, [error, errorId]);

  const handleReset = () => {
    // Track reset action
    trackEvent("error_global_reset", { errorId });
    reset();
  };

  const handleGoHome = () => {
    // Track navigation home
    trackEvent("error_global_home", { errorId });
    window.location.href = "/";
  };

  const handleReportError = () => {
    const subject = encodeURIComponent("Error Report: " + errorId);
    const body = encodeURIComponent(
      "Error ID: " +
        errorId +
        "\n" +
        "Message: " +
        error.message +
        "\n" +
        "Digest: " +
        (error.digest || "N/A") +
        "\n" +
        "URL: " +
        (typeof window !== "undefined" ? window.location.href : "N/A") +
        "\n" +
        "User Agent: " +
        (typeof navigator !== "undefined" ? navigator.userAgent : "N/A") +
        "\n" +
        "Timestamp: " +
        new Date().toISOString() +
        "\n\n" +
        "Please describe what you were doing:\n",
    );
    window.location.href =
      "mailto:" + SUPPORT_EMAIL + "?subject=" + subject + "&body=" + body;
  };

  return (
    <html lang="en">
      <body>
        <div className="min-h-screen bg-white dark:bg-black flex items-center justify-center p-4">
          <div className="max-w-lg w-full space-y-6">
            {/* Error Icon */}
            <div className="flex justify-center">
              <div className="flex items-center justify-center w-20 h-20 rounded-full bg-red-100 dark:bg-red-950/30">
                <AlertTriangle
                  className="w-10 h-10 text-red-600 dark:text-red-400"
                  aria-hidden="true"
                />
              </div>
            </div>

            {/* Error Message */}
            <div className="text-center space-y-2">
              <h1 className="text-3xl font-black text-zinc-900 dark:text-white">
                Something went wrong
              </h1>
              <p className="text-zinc-600 dark:text-zinc-400">
                We encountered an unexpected error. The issue has been logged
                and we will look into it.
              </p>
            </div>

            {/* Error ID */}
            <div className="bg-zinc-100 dark:bg-zinc-900 rounded-xl p-4">
              <p className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider mb-1">
                Error ID
              </p>
              <code className="text-sm font-mono text-zinc-900 dark:text-white">
                {errorId}
              </code>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                type="button"
                onClick={handleReset}
                className="flex-1 inline-flex items-center justify-center gap-2 h-12 px-6 rounded-xl bg-black text-white dark:bg-white dark:text-black font-bold hover:opacity-90 transition-opacity"
              >
                <RefreshCw className="w-4 h-4" aria-hidden="true" />
                Try Again
              </button>
              <button
                type="button"
                onClick={handleGoHome}
                className="flex-1 inline-flex items-center justify-center gap-2 h-12 px-6 rounded-xl bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white border-2 border-zinc-200 dark:border-zinc-800 font-bold hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors"
              >
                <Home className="w-4 h-4" aria-hidden="true" />
                Go Home
              </button>
            </div>

            {/* Report Error */}
            <button
              type="button"
              onClick={handleReportError}
              className="w-full inline-flex items-center justify-center gap-2 h-10 px-4 rounded-xl text-sm font-semibold text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors"
            >
              <Mail className="w-4 h-4" aria-hidden="true" />
              Report this error
            </button>

            {/* Technical Details (collapsible in dev) */}
            {process.env.NODE_ENV === "development" && error.message && (
              <details className="bg-red-50 dark:bg-red-950/20 rounded-xl border border-red-200 dark:border-red-900">
                <summary className="px-4 py-3 cursor-pointer text-sm font-semibold text-red-900 dark:text-red-100">
                  Technical Details (Dev Only)
                </summary>
                <div className="px-4 pb-4">
                  <pre className="text-xs font-mono text-red-800 dark:text-red-200 overflow-auto max-h-40 whitespace-pre-wrap">
                    {error.stack || error.message}
                  </pre>
                </div>
              </details>
            )}
          </div>
        </div>
      </body>
    </html>
  );
}
