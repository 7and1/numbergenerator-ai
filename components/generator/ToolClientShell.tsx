"use client";

import { Copy, Share2, Star } from "lucide-react";
import { useEffect, useMemo, useState, useSyncExternalStore } from "react";

import type { ToolConfig } from "@/lib/types";
import UniversalGenerator from "@/components/generator/UniversalGenerator";
import { Toast } from "@/components/ui/Toast";
import {
  getUserDataServerSnapshot,
  getUserDataSnapshot,
  normalizePathKey,
  subscribeUserData,
  toggleFavorite,
} from "@/lib/userData";
import { sanitizeHtml } from "@/lib/sanitize";
import { trackToolShare, trackToolFavorite } from "@/lib/analytics";

declare global {
  interface Window {
    __PRELOADED_CONFIG__?: unknown;
  }
}

const isPlainObject = (value: unknown): value is Record<string, unknown> => {
  return (
    Boolean(value) &&
    typeof value === "object" &&
    Object.getPrototypeOf(value) === Object.prototype
  );
};

const mergeToolConfig = (base: ToolConfig, injected: unknown): ToolConfig => {
  if (!isPlainObject(injected)) return base;

  const next: ToolConfig = { ...base };

  if (typeof injected.slug === "string") next.slug = injected.slug;
  if (typeof injected.title === "string") next.title = injected.title;
  if (typeof injected.seo_title === "string")
    next.seo_title = injected.seo_title;
  if (typeof injected.description === "string")
    next.description = injected.description;

  if (typeof injected.mode === "string")
    next.mode = injected.mode as ToolConfig["mode"];

  if (isPlainObject(injected.ui))
    next.ui = {
      ...base.ui,
      ...(injected.ui as unknown as Partial<ToolConfig["ui"]>),
    };
  if (isPlainObject(injected.params))
    next.params = {
      ...base.params,
      ...(injected.params as unknown as Partial<ToolConfig["params"]>),
    };

  return next;
};

type InjectedExtras = {
  content_top_html: string | null;
  content_bottom_html: string | null;
  canonical_url: string | null;
  robots_content: string | null;
};

const readInjectedExtras = (injected: unknown): InjectedExtras => {
  if (!isPlainObject(injected)) {
    return {
      content_top_html: null,
      content_bottom_html: null,
      canonical_url: null,
      robots_content: null,
    };
  }
  const content_top_html =
    typeof injected.content_top_html === "string"
      ? injected.content_top_html
      : null;
  const content_bottom_html =
    typeof injected.content_bottom_html === "string"
      ? injected.content_bottom_html
      : null;
  const canonical_url =
    typeof injected.canonical_url === "string" ? injected.canonical_url : null;
  const robots_content =
    typeof injected.robots_content === "string"
      ? injected.robots_content
      : null;
  return {
    content_top_html,
    content_bottom_html,
    canonical_url,
    robots_content,
  };
};

const upsertMeta = (name: string, content: string) => {
  const selector = `meta[name="${CSS.escape(name)}"]`;
  const existing = document.head.querySelector<HTMLMetaElement>(selector);
  if (existing) {
    existing.setAttribute("content", content);
    return;
  }
  const meta = document.createElement("meta");
  meta.setAttribute("name", name);
  meta.setAttribute("content", content);
  document.head.append(meta);
};

const upsertCanonical = (href: string) => {
  const existing = document.head.querySelector<HTMLLinkElement>(
    'link[rel="canonical"]',
  );
  if (existing) {
    existing.setAttribute("href", href);
    return;
  }
  const link = document.createElement("link");
  link.setAttribute("rel", "canonical");
  link.setAttribute("href", href);
  document.head.append(link);
};

export default function ToolClientShell({ config }: { config: ToolConfig }) {
  const [
    {
      effectiveConfig,
      injectedContentTop,
      injectedContentBottom,
      injectedCanonical,
      injectedRobots,
    },
  ] = useState<{
    effectiveConfig: ToolConfig;
    injectedContentTop: string | null;
    injectedContentBottom: string | null;
    injectedCanonical: string | null;
    injectedRobots: string | null;
  }>(() => {
    if (typeof window === "undefined") {
      return {
        effectiveConfig: config,
        injectedContentTop: null,
        injectedContentBottom: null,
        injectedCanonical: null,
        injectedRobots: null,
      };
    }
    const injected = window.__PRELOADED_CONFIG__;
    const extras = readInjectedExtras(injected);
    return {
      effectiveConfig: mergeToolConfig(config, injected),
      injectedContentTop: extras.content_top_html ?? null,
      injectedContentBottom: extras.content_bottom_html ?? null,
      injectedCanonical: extras.canonical_url ?? null,
      injectedRobots: extras.robots_content ?? null,
    };
  });

  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error" | "info";
  } | null>(null);

  const { favorites } = useSyncExternalStore(
    subscribeUserData,
    getUserDataSnapshot,
    getUserDataServerSnapshot,
  ) as { favorites: { key: string }[] };

  const pathKey = useMemo(() => {
    if (typeof window === "undefined") return `/${effectiveConfig.slug}/`;
    return normalizePathKey(window.location.pathname);
  }, [effectiveConfig.slug]);

  const href = useMemo(() => {
    if (typeof window === "undefined") return `/${effectiveConfig.slug}/`;
    return `${window.location.pathname}${window.location.search}`;
  }, [effectiveConfig.slug]);

  const isFav = useMemo(
    () => favorites.some((f) => f.key === pathKey),
    [favorites, pathKey],
  );

  const canonicalAbs = useMemo(() => {
    // For injected pages we want canonical to match the request URL, not the template slug.
    if (typeof window === "undefined")
      return `https://numbergenerator.ai/${effectiveConfig.slug}/`;
    if (injectedCanonical) return injectedCanonical;
    const path = window.location.pathname.endsWith("/")
      ? window.location.pathname
      : `${window.location.pathname}/`;
    return new URL(path, window.location.origin).toString();
  }, [effectiveConfig.slug, injectedCanonical]);

  useEffect(() => {
    // Keep <title>/<meta> aligned with Worker-injected values (prevents client reversion).
    document.title = effectiveConfig.seo_title;
    upsertMeta("description", effectiveConfig.description);
    if (injectedRobots) upsertMeta("robots", injectedRobots);
    upsertCanonical(canonicalAbs);
  }, [
    effectiveConfig.seo_title,
    effectiveConfig.description,
    canonicalAbs,
    injectedRobots,
  ]);

  const fireToast = (
    msg: string,
    type: "success" | "error" | "info" = "success",
  ) => {
    setToast({ message: msg, type });
  };

  const copyLink = async () => {
    const abs =
      typeof window === "undefined"
        ? href
        : new URL(href, window.location.origin).toString();
    try {
      await navigator.clipboard.writeText(abs);
      fireToast("Link copied", "success");
    } catch {
      fireToast("Copy blocked", "error");
    }
  };

  const shareLink = async () => {
    const abs =
      typeof window === "undefined"
        ? href
        : new URL(href, window.location.origin).toString();
    const title = effectiveConfig.seo_title;
    const text = effectiveConfig.description;

    if (typeof navigator !== "undefined" && "share" in navigator) {
      const share = (
        navigator as unknown as { share?: (data: ShareData) => Promise<void> }
      ).share;
      if (share) {
        try {
          await share({ title, text, url: abs });
          fireToast("Shared successfully", "success");
          trackToolShare(effectiveConfig.slug, "native");
          return;
        } catch {
          // user cancelled or blocked; fallback to copy
        }
      }
    }
    await copyLink();
    trackToolShare(effectiveConfig.slug, "copy");
  };

  const toggleFav = () => {
    toggleFavorite({
      key: pathKey,
      href,
      title: effectiveConfig.title,
      description: effectiveConfig.description,
    });
    fireToast(
      isFav ? "Removed from favorites" : "Saved to favorites",
      "success",
    );
    trackToolFavorite(effectiveConfig.slug, !isFav);
  };

  return (
    <>
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          duration={2000}
          onClose={() => setToast(null)}
        />
      )}
      <header className="text-center mb-8 md:mb-12">
        <nav className="flex justify-end mb-4" aria-label="Page actions">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={toggleFav}
              aria-label={isFav ? "Remove from favorites" : "Add to favorites"}
              aria-pressed={isFav}
              className="h-10 w-10 inline-flex items-center justify-center rounded-xl border border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-colors"
            >
              <Star
                size={18}
                fill={isFav ? "currentColor" : "none"}
                aria-hidden="true"
              />
            </button>
            <button
              type="button"
              onClick={shareLink}
              aria-label="Share this page"
              className="h-10 w-10 inline-flex items-center justify-center rounded-xl border border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-colors"
            >
              <Share2 size={18} aria-hidden="true" />
            </button>
            <button
              type="button"
              onClick={copyLink}
              aria-label="Copy link to clipboard"
              className="h-10 w-10 inline-flex items-center justify-center rounded-xl border border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-colors"
            >
              <Copy size={18} aria-hidden="true" />
            </button>
          </div>
        </nav>
        <div className="flex flex-col md:flex-row md:items-start md:justify-center gap-4 md:gap-0">
          <div className="flex-1" />
          <div className="flex-1">
            <h1
              id="tool-title"
              className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-zinc-900 dark:text-white mb-4"
            >
              {effectiveConfig.title}
            </h1>
            <p
              id="tool-description"
              className="text-base md:text-lg text-zinc-500 dark:text-zinc-400 font-medium"
            >
              {effectiveConfig.description}
            </p>
          </div>
          <div className="flex-1 hidden md:block" />
        </div>
      </header>

      <UniversalGenerator key={effectiveConfig.slug} config={effectiveConfig} />

      <article className="mt-20 prose prose-zinc dark:prose-invert mx-auto">
        <hr />
        <section
          id="pseo-content-top"
          dangerouslySetInnerHTML={{ __html: sanitizeHtml(injectedContentTop) }}
        />
        <h2>About this tool</h2>
        <p>
          This tool uses a cryptographically secure pseudo-random number
          generator (CSPRNG) to ensure fairness and security.
        </p>
        <p>
          Tip: press <strong>Space</strong> to generate again.
        </p>
        <section
          id="pseo-content-bottom"
          dangerouslySetInnerHTML={{
            __html: sanitizeHtml(injectedContentBottom),
          }}
        />
      </article>
    </>
  );
}
