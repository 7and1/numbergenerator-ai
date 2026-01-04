import { describe, expect, it } from "vitest";

import {
  sanitizeHtml,
  sanitizeHtmlStrict,
  isContentSuspicious,
  sanitizeWithLogging,
} from "./sanitize";

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

    it("removes event handlers (even if tag is otherwise allowed)", () => {
      const input =
        '<script onclick="alert(1)">console.log("safe");</script><div onmouseover="alert(2)">X</div>';
      const result = sanitizeHtml(input);

      expect(result).not.toContain("onclick");
      expect(result).not.toContain("onmouseover");
    });

    it("removes javascript: protocol", () => {
      const input = '<a href="javascript:alert(1)">Click</a>';
      const result = sanitizeHtml(input);

      expect(result).not.toContain("javascript:");
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

    it("removes dangerous tags", () => {
      const input =
        '<iframe src="evil.com"></iframe><object data="evil.swf"></object><embed src="evil.swf"></embed>';
      const result = sanitizeHtml(input);

      expect(result).not.toContain("<iframe");
      expect(result).not.toContain("<object");
      expect(result).not.toContain("<embed");
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
  });

  describe("isContentSuspicious", () => {
    it("detects common XSS patterns", () => {
      expect(isContentSuspicious("<script>alert(1)</script>")).toBe(true);
      expect(isContentSuspicious('onload="alert(1)"')).toBe(true);
      expect(isContentSuspicious("javascript:alert(1)")).toBe(true);
      expect(isContentSuspicious("<iframe src=x></iframe>")).toBe(true);
      expect(isContentSuspicious("document.write('<p>x</p>')")).toBe(true);
    });

    it("returns false for safe content", () => {
      expect(isContentSuspicious("<p>Safe paragraph</p>")).toBe(false);
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
  });

  describe("common attack vectors", () => {
    const commonAttacks = [
      '<script>alert("XSS")</script>',
      '<img src="x" onerror="alert(1)">',
      "<svg><script>alert(1)</script></svg>",
      '<a href="javascript:alert(1)">Click</a>',
      '<iframe src="data:text/html,<script>alert(1)</script>"></iframe>',
      '<div onmouseover="alert(1)">Hover me</div>',
      '<form action="javascript:alert(1)"><button>X</button></form>',
      '<div style="expression(alert(1))">X</div>',
      "<ScRiPt>alert(1)</ScRiPt>",
    ];

    it("blocks obvious XSS patterns", () => {
      for (const attack of commonAttacks) {
        const result = sanitizeHtml(attack);
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
