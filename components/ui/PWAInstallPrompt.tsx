"use client";

import { useEffect, useState, useCallback } from "react";
import { X, Download, Info } from "lucide-react";
import { cn } from "@/lib/utils";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

let deferredPrompt: BeforeInstallPromptEvent | null = null;

if (typeof window !== "undefined") {
  window.addEventListener("beforeinstallprompt", (e) => {
    e.preventDefault();
    deferredPrompt = e as BeforeInstallPromptEvent;
  });
}

export function PWAInstallPrompt() {
  const [showPrompt, setShowPrompt] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    // Check if running on iOS
    const isIOSDevice =
      /iPad|iPhone|iPod/.test(navigator.userAgent) ||
      (navigator.platform === "MacIntel" &&
        (navigator as unknown as { maxTouchPoints?: number }).maxTouchPoints! >
          1);

    setIsIOS(isIOSDevice);

    // Check if already installed
    if (window.matchMedia("(display-mode: standalone)").matches) {
      setIsInstalled(true);
      return;
    }

    // Check if previously dismissed
    const dismissed = localStorage.getItem("pwa-prompt-dismissed");
    const lastDismissal = dismissed ? parseInt(dismissed, 10) : 0;
    const daysSinceDismissal =
      (Date.now() - lastDismissal) / (1000 * 60 * 60 * 24);

    // Show prompt if not dismissed in last 7 days
    if (daysSinceDismissal > 7) {
      // For iOS, show after 3 page visits
      const visitCount = parseInt(
        localStorage.getItem("visit-count") || "0",
        10,
      );
      if (isIOSDevice && visitCount >= 3) {
        setShowPrompt(true);
      }
      // For other platforms, show if deferredPrompt exists
      else if (!isIOSDevice && deferredPrompt) {
        // Show after first page load with a slight delay
        const timer = setTimeout(() => setShowPrompt(true), 3000);
        return () => clearTimeout(timer);
      }
    }

    // Increment visit count
    const currentVisitCount = parseInt(
      localStorage.getItem("visit-count") || "0",
      10,
    );
    localStorage.setItem("visit-count", String(currentVisitCount + 1));
  }, []);

  const handleInstall = useCallback(async () => {
    if (!deferredPrompt) {
      setShowPrompt(false);
      return;
    }

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;

    if (outcome === "accepted") {
      setIsInstalled(true);
    }

    deferredPrompt = null;
    setShowPrompt(false);
  }, []);

  const handleDismiss = useCallback(() => {
    localStorage.setItem("pwa-prompt-dismissed", String(Date.now()));
    setShowPrompt(false);
  }, []);

  if (isInstalled || !showPrompt) return null;

  return (
    <div
      className={cn(
        "fixed bottom-4 left-4 right-4 sm:left-auto sm:right-4 sm:w-96",
        "bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl border border-zinc-200 dark:border-zinc-800",
        "p-4 z-50 animate-in slide-in-from-bottom-full sm:slide-in-from-right-full",
        "duration-500 ease-out",
      )}
      role="dialog"
      aria-labelledby="pwa-install-title"
    >
      <button
        type="button"
        onClick={handleDismiss}
        className="absolute top-3 right-3 p-1 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
        aria-label="Dismiss"
      >
        <X size={18} />
      </button>

      <div className="flex items-start gap-4">
        <div className="p-3 bg-black dark:bg-white rounded-xl flex-shrink-0">
          <Download className="w-6 h-6 text-white dark:text-black" />
        </div>

        <div className="flex-1 min-w-0">
          <h3
            id="pwa-install-title"
            className="font-bold text-zinc-900 dark:text-white mb-1"
          >
            Install App
          </h3>

          {isIOS ? (
            <div className="space-y-2">
              <p className="text-sm text-zinc-600 dark:text-zinc-400">
                Install NumberGenerator.ai on your device:
              </p>
              <ol className="text-sm text-zinc-600 dark:text-zinc-400 space-y-1">
                <li className="flex items-start gap-2">
                  <span className="flex-shrink-0 w-5 h-5 rounded bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-xs font-bold">
                    1
                  </span>
                  <span>Tap the Share button</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="flex-shrink-0 w-5 h-5 rounded bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-xs font-bold">
                    2
                  </span>
                  <span>Scroll down and tap "Add to Home Screen"</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="flex-shrink-0 w-5 h-5 rounded bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-xs font-bold">
                    3
                  </span>
                  <span>Tap "Add" to confirm</span>
                </li>
              </ol>
            </div>
          ) : (
            <p className="text-sm text-zinc-600 dark:text-zinc-400">
              Install NumberGenerator.ai for quick access and offline support.
            </p>
          )}

          {!isIOS && (
            <button
              type="button"
              onClick={handleInstall}
              className="mt-3 w-full h-10 bg-black dark:bg-white text-white dark:text-black rounded-xl text-sm font-bold hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
            >
              <Download size={16} />
              Install Now
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// Component to show offline indicator
export function OfflineIndicator() {
  const [isOnline, setIsOnline] = useState(true);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    setIsOnline(navigator.onLine);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  if (isOnline) return null;

  return (
    <div className="fixed top-0 left-0 right-0 bg-amber-500 text-white px-4 py-2 text-center text-sm font-medium z-50 flex items-center justify-center gap-2">
      <Info size={16} />
      You are offline. Some features may be limited.
    </div>
  );
}
