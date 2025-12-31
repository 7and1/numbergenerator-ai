"use client";

import { useState, useCallback, useMemo } from "react";
import { Code, Copy, Check, Link2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface EmbedCodeProps {
  toolSlug: string;
  toolTitle: string;
  params?: Record<string, string>;
}

export function EmbedCode({ toolSlug, toolTitle, params }: EmbedCodeProps) {
  const [copied, setCopied] = useState(false);
  const [tab, setTab] = useState<"iframe" | "link">("iframe");

  // Generate iframe src with params
  const iframeSrc = useMemo(() => {
    const baseUrl = "https://numbergenerator.ai";
    const url = new URL(`${baseUrl}/${toolSlug}/`);

    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        url.searchParams.set(key, value);
      });
    }

    return url.toString();
  }, [toolSlug, params]);

  // Generate iframe embed code
  const iframeCode = useMemo(() => {
    return `<iframe
  src="${iframeSrc}"
  title="${toolTitle}"
  width="100%"
  height="600"
  frameborder="0"
  style="border:1px solid #e5e7eb;border-radius:12px;"
  loading="lazy"
  allow="clipboard-write"
></iframe>`;
  }, [iframeSrc, toolTitle]);

  // Generate direct link
  const directLink = iframeSrc;

  const handleCopy = useCallback(async () => {
    const textToCopy = tab === "iframe" ? iframeCode : directLink;
    try {
      await navigator.clipboard.writeText(textToCopy);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback for older browsers
      const textarea = document.createElement("textarea");
      textarea.value = textToCopy;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }, [tab, iframeCode, directLink]);

  return (
    <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950/30 overflow-hidden">
      {/* Tabs */}
      <div className="flex border-b border-zinc-200 dark:border-zinc-800">
        <button
          type="button"
          onClick={() => setTab("iframe")}
          className={cn(
            "flex-1 px-4 py-3 text-sm font-bold flex items-center justify-center gap-2 transition-colors",
            tab === "iframe"
              ? "bg-white dark:bg-zinc-900 text-black dark:text-white border-b-2 border-black dark:border-white"
              : "text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300",
          )}
        >
          <Code size={16} />
          Embed Code
        </button>
        <button
          type="button"
          onClick={() => setTab("link")}
          className={cn(
            "flex-1 px-4 py-3 text-sm font-bold flex items-center justify-center gap-2 transition-colors",
            tab === "link"
              ? "bg-white dark:bg-zinc-900 text-black dark:text-white border-b-2 border-black dark:border-white"
              : "text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300",
          )}
        >
          <Link2 size={16} />
          Direct Link
        </button>
      </div>

      {/* Content */}
      <div className="p-4">
        <pre
          className={cn(
            "bg-white dark:bg-zinc-900 rounded-xl p-4 overflow-x-auto text-sm font-mono",
            "border border-zinc-200 dark:border-zinc-800",
          )}
        >
          <code className="text-zinc-700 dark:text-zinc-300">
            {tab === "iframe" ? iframeCode : directLink}
          </code>
        </pre>

        {/* Copy button */}
        <button
          type="button"
          onClick={handleCopy}
          className={cn(
            "mt-3 w-full h-10 rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-all",
            copied
              ? "bg-emerald-500 text-white"
              : "bg-zinc-200 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-300 dark:hover:bg-zinc-700",
          )}
        >
          {copied ? (
            <>
              <Check size={16} />
              Copied!
            </>
          ) : (
            <>
              <Copy size={16} />
              Copy {tab === "iframe" ? "Embed Code" : "Link"}
            </>
          )}
        </button>

        {/* Instructions */}
        <div className="mt-4 text-xs text-zinc-500 dark:text-zinc-400">
          {tab === "iframe" ? (
            <p>
              Paste this code into your website to embed the {toolTitle} tool.
              The iframe will automatically adapt to mobile screens.
            </p>
          ) : (
            <p>
              Share this link to let others use the {toolTitle} tool with your
              current settings.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
