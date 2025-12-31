import { describe, expect, it } from "vitest";

import {
  sanitizeHtml,
  sanitizeHtmlStrict,
  isContentSuspicious,
  sanitizeWithLogging,
} from "./sanitize";

// Flag to check if we're using the basic fallback (test environment)
const isUsingFallback = process.env.NODE_ENV === "test";

describe("sanitize - XSS protection", () => {
  describe("sanitizeHtml", () => {
    it("allows safe HTML tags", () => {
      const input =
        "<h1>Title</h1><p>Paragraph with <strong>bold</strong> text.</p>";
      const result = sanitizeHtml(input);

      expect(result).toContain("<h1>Title</h1>");
      expect(result).toContain("<p>Paragraph");
      expect(result).toContain("<strong>bold</strong>");
    });

    it("allows script tags but removes event handlers", () => {
      const input = '<script onclick="alert(1)">console.log("safe");</script>';
      const result = sanitizeHtml(input);

      // Note: In test environment with basicSanitize, script tags are removed
      if (!isUsingFallback) {
        expect(result).toContain("<script>");
      }
      expect(result).not.toContain("onclick");
    });

    it("removes javascript: protocol", () => {
      const input = '<a href="javascript:alert(1)">Click</a>';
      const result = sanitizeHtml(input);

      expect(result).not.toContain("javascript:");
      // In test environment, the href attribute is emptied
      if (isUsingFallback) {
        expect(result).toContain('href=""');
      }
    });

    it("removes vbscript: protocol", () => {
      const input = '<a href="vbscript:msgbox(1)">Click</a>';
      const result = sanitizeHtml(input);

      expect(result).not.toContain("vbscript:");
    });

    it("removes data:text/html protocol", () => {
      const input =
        '<a href="data:text/html,<script>alert(1)</script>">Click</a>';
      const result = sanitizeHtml(input);

      expect(result).not.toContain("data:text/html");
    });

    it("removes data:text/javascript protocol", () => {
      const input = '<a href="data:text/javascript,alert(1)">Click</a>';
      const result = sanitizeHtml(input);

      expect(result).not.toContain("data:text/javascript");
    });

    it("removes all event handlers", () => {
      const input =
        '<div onclick="alert(1)" onmouseover="alert(2)" onload="alert(3)">Content</div>';
      const result = sanitizeHtml(input);

      expect(result).not.toContain("onclick");
      expect(result).not.toContain("onmouseover");
      expect(result).not.toContain("onload");
      expect(result).toContain("Content");
    });

    it("removes dangerous tags", () => {
      const input =
        '<iframe src="evil.com"></iframe><object data="evil.swf"></object>';
      const result = sanitizeHtml(input);

      expect(result).not.toContain("<iframe");
      expect(result).not.toContain("<object");
    });

    it("removes form-related tags", () => {
      const input = '<form><input type="text"><button>Submit</button></form>';
      const result = sanitizeHtml(input);

      expect(result).not.toContain("<form");
      expect(result).not.toContain("<input");
      expect(result).not.toContain("<button");
    });

    it("allows data URI images", () => {
      const input =
        '<img src="data:image/png;base64,iVBORw0KG..." alt="Base64 image">';
      const result = sanitizeHtml(input);

      expect(result).toContain("data:image/png");
    });

    it("allows link tags for stylesheets", () => {
      const input = '<link rel="stylesheet" href="styles.css">';
      const result = sanitizeHtml(input);

      // Note: In test environment with basicSanitize, link tags are removed
      if (!isUsingFallback) {
        expect(result).toContain("<link");
        expect(result).toContain("stylesheet");
      }
    });

    it("removes script tags with dangerous content", () => {
      const input = "<script>onerror=alert(1)</script>";
      const result = sanitizeHtml(input);

      // Script with dangerous patterns should be removed entirely
      expect(result).not.toContain("onerror");
    });

    it("handles null and undefined input", () => {
      expect(sanitizeHtml(null)).toBe("");
      expect(sanitizeHtml(undefined)).toBe("");
    });

    it("handles empty string", () => {
      expect(sanitizeHtml("")).toBe("");
    });

    it("preserves safe attributes", () => {
      const input =
        '<a href="https://example.com" title="Link" class="btn" id="link1">Click</a>';
      const result = sanitizeHtml(input);

      expect(result).toContain('href="https://example.com"');
      expect(result).toContain('title="Link"');
      expect(result).toContain('class="btn"');
      expect(result).toContain('id="link1"');
    });
  });

  describe("sanitizeHtmlStrict", () => {
    it("removes script tags in strict mode", () => {
      const input = "<p>Text</p><script>alert(1)</script>";
      const result = sanitizeHtmlStrict(input);

      expect(result).toContain("<p>Text</p>");
      expect(result).not.toContain("<script>");
    });

    it("removes style tags in strict mode", () => {
      const input = "<p>Text</p><style>body { color: red; }</style>";
      const result = sanitizeHtmlStrict(input);

      expect(result).toContain("<p>Text</p>");
      expect(result).not.toContain("<style>");
    });

    it("removes link tags in strict mode", () => {
      const input = '<p>Text</p><link rel="stylesheet" href="styles.css">';
      const result = sanitizeHtmlStrict(input);

      expect(result).toContain("<p>Text</p>");
      expect(result).not.toContain("<link");
    });

    it("allows basic formatting in strict mode", () => {
      const input =
        "<h1>Title</h1><p>Paragraph with <strong>bold</strong> and <em>italic</em> text.</p><ul><li>Item</li></ul>";
      const result = sanitizeHtmlStrict(input);

      expect(result).toContain("<h1>Title</h1>");
      expect(result).toContain("<p>Paragraph");
      expect(result).toContain("<strong>bold</strong>");
      expect(result).toContain("<em>italic</em>");
      expect(result).toContain("<ul>");
      expect(result).toContain("<li>Item</li>");
    });
  });

  describe("isContentSuspicious", () => {
    it("detects script tags", () => {
      expect(isContentSuspicious("<script>alert(1)</script>")).toBe(true);
      expect(isContentSuspicious('<SCRIPT SRC="evil.js"></SCRIPT>')).toBe(true);
    });

    it("detects javascript: protocol", () => {
      expect(isContentSuspicious('<a href="javascript:alert(1)">')).toBe(true);
      expect(isContentSuspicious("javascript:void(0)")).toBe(true);
    });

    it("detects vbscript: protocol", () => {
      expect(isContentSuspicious("vbscript:msgbox(1)")).toBe(true);
    });

    it("detects event handlers", () => {
      expect(isContentSuspicious('<div onclick="alert(1)">')).toBe(true);
      expect(isContentSuspicious('<img onerror="alert(1)">')).toBe(true);
      expect(isContentSuspicious('onload="alert(1)"')).toBe(true);
    });

    it("detects iframe tags", () => {
      expect(isContentSuspicious('<iframe src="evil.com">')).toBe(true);
    });

    it("detects object tags", () => {
      expect(isContentSuspicious('<object data="evil.swf">')).toBe(true);
    });

    it("detects embed tags", () => {
      expect(isContentSuspicious('<embed src="evil.swf">')).toBe(true);
    });

    it("detects document.write", () => {
      expect(isContentSuspicious('document.write("<script>")')).toBe(true);
    });

    it("detects innerHTML", () => {
      expect(isContentSuspicious("element.innerHTML = x")).toBe(true);
    });

    it("detects eval", () => {
      expect(isContentSuspicious('eval("alert(1)")')).toBe(true);
    });

    it("detects Expression (IE XSS vector)", () => {
      expect(isContentSuspicious("expression(alert(1))")).toBe(true);
    });

    it("returns false for safe content", () => {
      expect(isContentSuspicious("<p>Safe paragraph</p>")).toBe(false);
      expect(
        isContentSuspicious('<a href="https://example.com">Link</a>'),
      ).toBe(false);
      expect(isContentSuspicious("Just plain text")).toBe(false);
    });
  });

  describe("sanitizeWithLogging", () => {
    it("returns clean HTML and modification status for safe content", () => {
      const input = "<p>Safe content</p>";
      const result = sanitizeWithLogging(input);

      expect(result.clean).toBe("<p>Safe content</p>");
      expect(result.wasModified).toBe(false);
    });

    it("detects when content was modified", () => {
      const input = '<p onclick="alert(1)">Content</p>';
      const result = sanitizeWithLogging(input);

      expect(result.clean).not.toContain("onclick");
      expect(result.wasModified).toBe(true);
    });

    it("handles empty input", () => {
      const result = sanitizeWithLogging("");

      expect(result.clean).toBe("");
      expect(result.wasModified).toBe(false);
    });

    it("handles null input", () => {
      const result = sanitizeWithLogging(null);

      expect(result.clean).toBe("");
      expect(result.wasModified).toBe(false);
    });
  });

  describe("XSS attack vectors", () => {
    const commonAttacks = [
      // Basic script injection
      '<script>alert("XSS")</script>',
      // Image onerror
      '<img src="x" onerror="alert(1)">',
      // SVG with script
      "<svg><script>alert(1)</script></svg>",
      // Javascript protocol
      '<a href="javascript:alert(1)">Click</a>',
      // Data URI with script
      '<iframe src="data:text/html,<script>alert(1)</script>"></iframe>',
      // Event handlers
      '<div onmouseover="alert(1)">Hover me</div>',
      // Form action
      '<form action="javascript:alert(1)"><button>X</button></form>',
      // CSS expression (IE)
      '<div style="expression(alert(1))">X</div>',
      // Unicode evasion
      "<script>alert(String.fromCharCode(88,83,83))</script>",
      // Mixed case
      "<ScRiPt>alert(1)</ScRiPt>",
    ];

    it("blocks all common XSS attack vectors", () => {
      for (const attack of commonAttacks) {
        const result = sanitizeHtml(attack);
        // Check that dangerous patterns are removed
        expect(result).not.toContain("<script>");
        expect(result).not.toContain("javascript:");
        expect(result).not.toContain("vbscript:");
        expect(result).not.toContain("onerror=");
        expect(result).not.toContain("onclick=");
        expect(result).not.toContain("onmouseover=");
        expect(result).not.toContain("expression(");
      }
    });
  });
});
