"use client";

import { useEffect, useState } from "react";
import { Keyboard, X } from "lucide-react";
import { cn } from "@/lib/utils";

type Shortcut = {
  keys: string[];
  description: string;
};

const isMac =
  typeof navigator !== "undefined" &&
  /Mac|iPod|iPhone|iPad/.test(navigator.platform);

export function KeyboardShortcutsModal() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ctrl/Cmd + / or ? to open shortcuts
      if ((e.ctrlKey || e.metaKey) && (e.key === "/" || e.key === "?")) {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      }
      // Escape to close
      if (e.key === "Escape" && isOpen) {
        setIsOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  const shortcuts: Shortcut[] = [
    { keys: ["Space"], description: "Generate new result" },
    { keys: [isMac ? "Cmd" : "Ctrl", "C"], description: "Copy result" },
    { keys: [isMac ? "Cmd" : "Ctrl", "/"], description: "Show shortcuts" },
    { keys: ["Enter"], description: "Generate new result" },
    { keys: ["Esc"], description: "Close modals" },
  ];

  if (!isOpen) {
    return (
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="fixed bottom-4 right-4 w-12 h-12 rounded-full bg-black dark:bg-white text-white dark:text-black shadow-lg hover:shadow-xl hover:scale-105 transition-all flex items-center justify-center z-40"
        aria-label="Show keyboard shortcuts"
        title={isMac ? "Press Cmd+/" : "Press Ctrl+/"}
      >
        <Keyboard size={20} />
      </button>
    );
  }

  return (
    <div
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={() => setIsOpen(false)}
    >
      <div
        className="bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl max-w-md w-full max-h-[80vh] overflow-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-6 border-b border-zinc-200 dark:border-zinc-800">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <Keyboard size={24} />
            Keyboard Shortcuts
          </h2>
          <button
            type="button"
            onClick={() => setIsOpen(false)}
            className="p-2 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
            aria-label="Close"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-6 space-y-4">
          {shortcuts.map((shortcut, index) => (
            <div
              key={index}
              className="flex items-center justify-between gap-4"
            >
              <span className="text-sm text-zinc-600 dark:text-zinc-400">
                {shortcut.description}
              </span>
              <div className="flex items-center gap-1">
                {shortcut.keys.map((key, keyIndex) => (
                  <span
                    key={keyIndex}
                    className={cn(
                      "px-2 py-1 text-xs font-bold rounded",
                      "bg-zinc-100 dark:bg-zinc-800",
                      "text-zinc-700 dark:text-zinc-300",
                      "border border-zinc-200 dark:border-zinc-700",
                    )}
                  >
                    {key}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="p-6 pt-0">
          <p className="text-xs text-zinc-500 text-center">
            Press {isMac ? "Cmd+/" : "Ctrl+/"} or Esc to close
          </p>
        </div>
      </div>
    </div>
  );
}

// Small inline component for showing shortcuts
export function ShortcutHint({ keys }: { keys: string[] }) {
  return (
    <span className="inline-flex items-center gap-1">
      {keys.map((key, index) => (
        <span
          key={index}
          className="px-1.5 py-0.5 text-xs font-medium rounded bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 border border-zinc-200 dark:border-zinc-700"
        >
          {key}
        </span>
      ))}
    </span>
  );
}
