import type { GeneratorParams } from "./types";

/**
 * Umami Analytics Integration
 * Tracks tool usage and user interactions
 */

const UMAMI_WEBSITE_ID = "c9de8b9d-5ff1-4e3f-8f12-3b4f5e6a7c8d"; // Replace with actual ID
const UMAMI_URL = "https://umami.expertbeacon.com/api/collect";

type EventType =
  | "pageview"
  | "tool_generate"
  | "tool_copy"
  | "tool_export"
  | "tool_favorite"
  | "tool_share"
  | "combo_generate"
  | "error_global"
  | "error_global_reset"
  | "error_global_home"
  | "error_generator"
  | "error_generator_reset"
  | "error_copy_id"
  | "error_report";

interface EventData {
  [key: string]: string | number | boolean | undefined;
}

let isInitialized = false;
let queue: Array<{ type: EventType; data?: EventData }> = [];

/**
 * Initialize Umami analytics
 */
export function initAnalytics(): void {
  if (typeof window === "undefined") return;
  if (isInitialized) return;

  // Enable debug mode in development
  const isDev = process.env.NODE_ENV === "development";

  // Load Umami script
  const script = document.createElement("script");
  script.async = true;
  script.defer = true;
  script.dataset.websiteId = UMAMI_WEBSITE_ID;
  script.dataset.hostUrl = UMAMI_URL;
  if (isDev) {
    script.dataset.debug = "true";
  }
  script.src = `${UMAMI_URL}/script.js`;

  script.onload = () => {
    isInitialized = true;
    // Process queued events
    queue.forEach(({ type, data }) => trackEvent(type, data));
    queue = [];
  };

  script.onerror = () => {
    console.warn("Umami analytics failed to load");
    // Still mark as initialized to prevent retries
    isInitialized = true;
  };

  document.head.appendChild(script);
}

/**
 * Track a page view
 */
export function trackPageview(pathname: string): void {
  if (typeof window === "undefined") return;

  if (
    typeof (window as unknown as { umami?: { track: (url: string) => void } })
      .umami?.track === "function"
  ) {
    (
      window as unknown as { umami: { track: (url: string) => void } }
    ).umami.track(pathname);
  }
}

/**
 * Track a custom event
 */
export function trackEvent(type: EventType, data?: EventData): void {
  if (typeof window === "undefined") return;

  if (!isInitialized) {
    queue.push({ type, data });
    return;
  }

  const umami = (
    window as unknown as {
      umami?: { trackEvent: (name: string, data?: EventData) => void };
    }
  ).umami;
  if (typeof umami?.trackEvent === "function") {
    umami.trackEvent(type, data);
  }
}

/**
 * Track tool generation
 */
export function trackToolGenerate(
  toolSlug: string,
  toolMode: string,
  params?: GeneratorParams | Record<string, unknown>,
): void {
  trackEvent("tool_generate", {
    tool: toolSlug,
    mode: toolMode,
    ...formatParams(params),
  });
}

/**
 * Track tool copy action
 */
export function trackToolCopy(toolSlug: string): void {
  trackEvent("tool_copy", { tool: toolSlug });
}

/**
 * Track tool export action
 */
export function trackToolExport(toolSlug: string, format: string): void {
  trackEvent("tool_export", { tool: toolSlug, format });
}

/**
 * Track tool favorite action
 */
export function trackToolFavorite(toolSlug: string, added: boolean): void {
  trackEvent("tool_favorite", {
    tool: toolSlug,
    action: added ? "add" : "remove",
  });
}

/**
 * Track tool share action
 */
export function trackToolShare(toolSlug: string, method: string): void {
  trackEvent("tool_share", { tool: toolSlug, method });
}

/**
 * Track combo generator usage
 */
export function trackComboGenerate(tools: string[]): void {
  trackEvent("combo_generate", { tools: tools.join(","), count: tools.length });
}

/**
 * Format parameters for analytics (remove sensitive data)
 */
function formatParams(
  params?: GeneratorParams | Record<string, unknown>,
): Record<string, string | number | boolean> {
  if (!params) return {};

  const formatted: Record<string, string | number | boolean> = {};
  const sensitiveKeys = [
    "password",
    "pin",
    "custom_charset",
    "items",
    "ticket_remaining",
  ];

  // Convert GeneratorParams to Record for iteration
  const paramsRecord: Record<string, unknown> = params as Record<
    string,
    unknown
  >;

  for (const [key, value] of Object.entries(paramsRecord)) {
    // Skip sensitive keys
    if (sensitiveKeys.some((sk) => key.includes(sk))) continue;

    if (
      typeof value === "string" ||
      typeof value === "number" ||
      typeof value === "boolean"
    ) {
      formatted[key] = value;
    } else if (Array.isArray(value)) {
      formatted[`${key}_count`] = value.length;
    }
  }

  return formatted;
}

/**
 * Get current page path
 */
export function getCurrentPath(): string {
  if (typeof window === "undefined") return "/";
  return window.location.pathname;
}
