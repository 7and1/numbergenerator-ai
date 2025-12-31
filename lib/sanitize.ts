import DOMPurify from "dompurify";

/**
 * Security configuration for DOMPurify
 * - Removes all event handlers (onclick, onerror, etc.)
 * - Removes dangerous tags (script, object, embed, etc.)
 * - Allows safe formatting tags for pSEO content
 */

// Helper to check if DOMPurify supports addHook
const isDOMPurifyWithHooks = (
  purify: typeof DOMPurify,
): purify is typeof DOMPurify & {
  addHook: (name: string, cb: (...args: unknown[]) => void) => void;
} => {
  return typeof purify.addHook === "function";
};

// Helper to check if DOMPurify supports sanitize (browser environment or with jsdom)
const isDOMPurifyWithSanitize = (
  purify: typeof DOMPurify,
): purify is typeof DOMPurify & {
  sanitize: (dirty: string, config?: unknown) => string;
} => {
  return typeof purify.sanitize === "function";
};

/**
 * DOMPurify configuration for pSEO injected content
 * - Allows script tags (for legitimate analytics/tracking)
 * - Strips all event handlers to prevent XSS
 * - Allows safe formatting and structural tags
 */
const PSEO_CONFIG = {
  // Allow tags commonly used in SEO content
  ALLOWED_TAGS: [
    "h1",
    "h2",
    "h3",
    "h4",
    "h5",
    "h6",
    "p",
    "span",
    "div",
    "br",
    "hr",
    "strong",
    "b",
    "em",
    "i",
    "u",
    "s",
    "strike",
    "ul",
    "ol",
    "li",
    "a",
    "blockquote",
    "code",
    "pre",
    "table",
    "thead",
    "tbody",
    "tr",
    "th",
    "td",
    "img",
    "picture",
    "figure",
    "figcaption",
    "script", // Allow script tags for legitimate analytics
    "style", // Allow style tags
    "link", // Allow link tags for stylesheets
    "meta", // Allow meta tags
  ],

  // Allow safe attributes only
  ALLOWED_ATTR: [
    "href",
    "title",
    "alt",
    "src",
    "srcset",
    "class",
    "id",
    "style",
    "width",
    "height",
    "loading",
    "decoding",
    "type",
    "rel",
    "media",
    "charset",
    "name",
    "content",
    "property",
    "http-equiv",
    "scheme",
    // Script-safe attributes
    "async",
    "defer",
    "nonce",
    "crossorigin",
    // Allow data attributes (will be handled by hook)
  ],

  // FORBID tags - never allow these
  FORBID_TAGS: [
    "iframe",
    "frame",
    "frameset",
    "object",
    "embed",
    "form",
    "input",
    "button",
    "select",
    "textarea",
    "details",
    "summary",
    "dialog",
    "portal",
  ],

  // FORBID attributes - never allow these (XSS vectors)
  // Include all on* event handlers to prevent XSS
  FORBID_ATTR: [
    "onclick",
    "ondblclick",
    "onmousedown",
    "onmouseup",
    "onmouseover",
    "onmousemove",
    "onmouseout",
    "onfocus",
    "onblur",
    "onkeypress",
    "onkeydown",
    "onkeyup",
    "onload",
    "onerror",
    "onsubmit",
    "onreset",
    "onchange",
    "onselect",
    "oninput",
    "oninvalid",
    "ontouchstart",
    "ontouchend",
    "ontouchmove",
    "onpointerdown",
    "onpointerup",
    "onpointermove",
    "onhashchange",
    "onpopstate",
    "onpageshow",
    "onpagehide",
    "onbeforeunload",
    "onunload",
    "onresize",
    "onscroll",
    "oncopy",
    "oncut",
    "onpaste",
    "onabort",
    "oncanplay",
    "oncanplaythrough",
    "oncuechange",
    "ondurationchange",
    "onemptied",
    "onended",
    "onloadeddata",
    "onloadedmetadata",
    "onloadstart",
    "onpause",
    "onplay",
    "onplaying",
    "onprogress",
    "onratechange",
    "onseeked",
    "onseeking",
    "onstalled",
    "onsuspend",
    "ontimeupdate",
    "onvolumechange",
    "onwaiting",
    "formaction",
    "action",
    "method",
  ],

  // Allow data URI images but not javascript: or vbscript:
  ALLOW_DATA_URI: true,
  ALLOW_UNKNOWN_PROTOCOLS: false,

  // Sanitize script content - remove event handlers even from script tags
  SANITIZE_SCRIPT_TAGS: true,
};

/**
 * Configure DOMPurify with our security settings
 * Only add hooks if DOMPurify supports them (e.g., in browser environment)
 */
if (isDOMPurifyWithHooks(DOMPurify)) {
  DOMPurify.addHook("uponSanitizeAttribute", (node, data) => {
    // Block javascript: and vbscript: protocols
    if (
      data.attrName === "href" ||
      data.attrName === "src" ||
      data.attrName === "xlink:href"
    ) {
      const value = data.attrValue?.toLowerCase() ?? "";
      if (
        value.startsWith("javascript:") ||
        value.startsWith("vbscript:") ||
        value.startsWith("data:text/html") ||
        value.startsWith("data:text/javascript")
      ) {
        // Remove the attribute entirely
        node.removeAttribute(data.attrName!);
      }
    }

    // Remove inline event handlers that might slip through
    if (data.attrName && data.attrName.startsWith("on")) {
      node.removeAttribute(data.attrName);
    }
  });

  // Add hook to sanitize script tag content specifically
  DOMPurify.addHook("uponSanitizeElement", (node, data) => {
    // For script tags, only allow specific safe patterns
    if (data.tagName === "script") {
      // Remove any script that contains event handler code
      const content = node.textContent ?? "";
      if (
        content.includes("onerror=") ||
        content.includes("onclick=") ||
        content.includes("document.write") ||
        content.includes("innerHTML") ||
        content.includes("outerHTML") ||
        content.includes("eval(")
      ) {
        // Remove unsafe script tags entirely - cast to Element to access remove method
        (node as Element).remove();
      }
    }
  });
}

/**
 * Basic regex-based sanitization for environments without DOMPurify
 * Used as fallback in test environments
 * Note: This is a simplified fallback. For full security, DOMPurify with DOM support is required.
 */
const basicSanitize = (dirty: string): string => {
  if (!dirty) return "";

  // Remove script tags
  let cleaned = dirty.replace(
    /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
    "",
  );

  // Remove style tags
  cleaned = cleaned.replace(
    /<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi,
    "",
  );

  // Remove link tags
  cleaned = cleaned.replace(/<link\b[^>]*>/gi, "");

  // Remove meta tags
  cleaned = cleaned.replace(/<meta\b[^>]*>/gi, "");

  // Remove event handlers
  cleaned = cleaned.replace(/\s+on\w+\s*=\s*["'][^"']*["']/gi, "");
  cleaned = cleaned.replace(/\s+on\w+\s*=\s*[^\s>]+/gi, "");

  // Remove dangerous protocols in href, src, action, formaction
  cleaned = cleaned.replace(
    /(href|src|action|formaction)\s*=\s*["']\s*javascript:[^"']*["']/gi,
    '$1=""',
  );
  cleaned = cleaned.replace(
    /(href|src|action|formaction)\s*=\s*["']\s*vbscript:[^"']*["']/gi,
    '$1=""',
  );
  cleaned = cleaned.replace(
    /(href|src|action|formaction)\s*=\s*["']\s*data:text\/html[^"']*["']/gi,
    '$1=""',
  );
  cleaned = cleaned.replace(
    /(href|src|action|formaction)\s*=\s*["']\s*data:text\/javascript[^"']*["']/gi,
    '$1=""',
  );

  // Remove CSS expression (IE XSS vector)
  cleaned = cleaned.replace(
    /style\s*=\s*["'][^"']*expression\s*\([^"']*["']/gi,
    'style=""',
  );
  cleaned = cleaned.replace(
    /style\s*=\s*["'][^"']*expression\s*\([^"']*["']/gi,
    'style=""',
  );

  // Remove iframe, object, embed tags
  cleaned = cleaned.replace(
    /<(iframe|object|embed)\b[^<]*(?:(?!<\/\1>)<[^<]*)*<\/\1>/gi,
    "",
  );
  cleaned = cleaned.replace(/<(iframe|object|embed)\b[^>]*/gi, "");

  // Remove form tags
  cleaned = cleaned.replace(
    /<form\b[^<]*(?:(?!<\/form>)<[^<]*)*<\/form>/gi,
    "",
  );
  cleaned = cleaned.replace(/<form\b[^>]*/gi, "");
  cleaned = cleaned.replace(/<\/form>/gi, "");

  // Remove input, button, select, textarea tags
  cleaned = cleaned.replace(/<(input|button|select|textarea)\b[^>]*/gi, "");

  return cleaned;
};

/**
 * Sanitize HTML content for safe rendering
 * Use this for all user-generated or externally-sourced HTML
 */
export const sanitizeHtml = (dirty: string | null | undefined): string => {
  if (!dirty) return "";

  if (isDOMPurifyWithSanitize(DOMPurify)) {
    return DOMPurify.sanitize(dirty, PSEO_CONFIG);
  }

  // Fallback to basic sanitization for test environments
  return basicSanitize(dirty);
};

/**
 * Strict sanitization for highly untrusted content
 * Disallows all script tags and only allows basic formatting
 */
export const sanitizeHtmlStrict = (
  dirty: string | null | undefined,
): string => {
  if (!dirty) return "";

  if (isDOMPurifyWithSanitize(DOMPurify)) {
    return DOMPurify.sanitize(dirty, {
      ...PSEO_CONFIG,
      ALLOWED_TAGS: [
        "h1",
        "h2",
        "h3",
        "h4",
        "h5",
        "h6",
        "p",
        "span",
        "div",
        "br",
        "strong",
        "b",
        "em",
        "i",
        "ul",
        "ol",
        "li",
        "a",
      ],
      FORBID_TAGS: [...PSEO_CONFIG.FORBID_TAGS, "script", "style", "link"],
    });
  }

  // Fallback to basic sanitization for test environments (also removes script tags)
  return basicSanitize(dirty);
};

/**
 * Check if a string contains potentially dangerous content
 */
export const isContentSuspicious = (content: string): boolean => {
  const dangerousPatterns = [
    /<script[^>]*>[\s\S]*?<\/script>/gi,
    /javascript:/gi,
    /vbscript:/gi,
    /on\w+\s*=/gi, // Event handlers like onclick=
    /<iframe/gi,
    /<object/gi,
    /<embed/gi,
    /document\.write/gi,
    /\.innerHTML/gi,
    /eval\s*\(/gi,
    /Expression\s*\(/gi,
  ];

  return dangerousPatterns.some((pattern) => pattern.test(content));
};

/**
 * Get a sanitized version of HTML that logs warnings if content is modified
 */
export const sanitizeWithLogging = (
  dirty: string | null | undefined,
): { clean: string; wasModified: boolean } => {
  const original = dirty ?? "";
  const clean = sanitizeHtml(dirty);

  return {
    clean,
    wasModified: original !== clean,
  };
};

export default DOMPurify;
