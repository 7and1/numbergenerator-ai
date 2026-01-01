export interface Env {
  ASSETS?: Fetcher;
  PB_URL: string;
  ASSETS_ORIGIN?: string;
  CACHE_KV?: KVNamespace;
}

type KeywordRecord = {
  slug: string;
  type: string;
  params: Record<string, unknown>;
  allow_indexing?: boolean;
};

type TemplateRecord = {
  type: string;
  title_template?: string;
  meta_desc?: string;
  content_top?: string;
  content_bottom?: string;
};

const CORE_SLUGS = new Set([
  "1-10",
  "1-100",
  "password-strong",
  "pin-4",
  "pin-6",
  "lottery-powerball",
  "dice-d6",
  "coin-flip",
]);

const isStaticAsset = (pathname: string) => {
  if (pathname === "/") return true;
  if (pathname.startsWith("/_next")) return true;
  if (pathname === "/robots.txt" || pathname === "/sitemap.xml") return true;
  return pathname.includes(".");
};

const normalizeSlug = (pathname: string) => pathname.replace(/^\/+|\/+$/g, "");

const fetchAssets = (request: Request, env: Env) => {
  if (env.ASSETS) return env.ASSETS.fetch(request);
  const origin = env.ASSETS_ORIGIN || "http://127.0.0.1:3000";
  const url = new URL(request.url);
  const target = new URL(url.pathname + url.search, origin);
  return fetch(new Request(target, request));
};

const renderTemplate = (
  template: string,
  vars: Record<string, string | number>,
) => {
  return template.replace(/\{\{\s*([a-zA-Z0-9_]+)\s*\}\}/g, (_, key) => {
    const val = vars[key];
    return val === undefined ? "" : String(val);
  });
};

const escapeFilterValue = (value: string) => value.replace(/'/g, "\\'");

const fetchJson = async <T>(url: URL, init?: RequestInit): Promise<T> => {
  const res = await fetch(url, init);
  if (!res.ok) throw new Error(`fetch failed: ${res.status} ${url.toString()}`);
  return (await res.json()) as T;
};

const getKeyword = async (
  slug: string,
  env: Env,
  ctx: ExecutionContext,
): Promise<KeywordRecord | null> => {
  const cacheKey = `kw:${slug}`;
  if (env.CACHE_KV) {
    const cached = await env.CACHE_KV.get(cacheKey, { type: "json" });
    if (cached) return cached as KeywordRecord;
  }

  const url = new URL(
    `${env.PB_URL.replace(/\/+$/g, "")}/api/collections/keywords/records`,
  );
  url.searchParams.set("perPage", "1");
  url.searchParams.set("page", "1");
  url.searchParams.set("filter", `(slug='${escapeFilterValue(slug)}')`);

  try {
    const data = await fetchJson<{ items?: any[] }>(url);
    const item = data.items?.[0];
    if (!item) return null;

    const rec: KeywordRecord = {
      slug: String(item.slug ?? slug),
      type: String(item.type ?? "range"),
      params: (item.params ?? {}) as Record<string, unknown>,
      allow_indexing: Boolean(item.allow_indexing),
    };

    if (env.CACHE_KV)
      ctx.waitUntil(
        env.CACHE_KV.put(cacheKey, JSON.stringify(rec), {
          expirationTtl: 3600,
        }),
      );
    return rec;
  } catch {
    return null;
  }
};

const getTemplate = async (
  type: string,
  env: Env,
  ctx: ExecutionContext,
): Promise<TemplateRecord | null> => {
  const cacheKey = `tpl:${type}`;
  if (env.CACHE_KV) {
    const cached = await env.CACHE_KV.get(cacheKey, { type: "json" });
    if (cached) return cached as TemplateRecord;
  }

  const url = new URL(
    `${env.PB_URL.replace(/\/+$/g, "")}/api/collections/seo_templates/records`,
  );
  url.searchParams.set("perPage", "1");
  url.searchParams.set("page", "1");
  url.searchParams.set("filter", `(type='${escapeFilterValue(type)}')`);

  try {
    const data = await fetchJson<{ items?: any[] }>(url);
    const item = data.items?.[0];
    if (!item) return null;

    const rec: TemplateRecord = {
      type: String(item.type ?? type),
      title_template:
        typeof item.title_template === "string"
          ? item.title_template
          : undefined,
      meta_desc:
        typeof item.meta_desc === "string" ? item.meta_desc : undefined,
      content_top:
        typeof item.content_top === "string" ? item.content_top : undefined,
      content_bottom:
        typeof item.content_bottom === "string"
          ? item.content_bottom
          : undefined,
    };

    if (env.CACHE_KV)
      ctx.waitUntil(
        env.CACHE_KV.put(cacheKey, JSON.stringify(rec), {
          expirationTtl: 3600,
        }),
      );
    return rec;
  } catch {
    return null;
  }
};

const isRangeSlug = (slug: string) => /^(\d+)-(\d+)$/.test(slug);

const parseRangeSlug = (slug: string): { min: number; max: number } | null => {
  const m = slug.match(/^(\d+)-(\d+)$/);
  if (!m) return null;
  const min = Number(m[1]);
  const max = Number(m[2]);
  if (!Number.isFinite(min) || !Number.isFinite(max)) return null;
  return { min, max };
};

const buildInjectedConfig = (
  slug: string,
  type: string,
  vars: Record<string, string | number>,
) => {
  // Full ToolConfig shape (P1 client reads it to avoid hydration mismatch).
  if (type === "range") {
    const title = `Random Number ${vars.min}-${vars.max}`;
    return {
      slug,
      title: `${title}`,
      seo_title: `${title}`,
      description: `Generate a random number between ${vars.min} and ${vars.max}.`,
      mode: "range",
      params: {
        min: vars.min,
        max: vars.max,
        count: 1,
        step: 1,
        precision: 0,
        unique: false,
        sort: null,
      },
      ui: { show_inputs: true, result_type: "text", button_text: "Generate" },
    };
  }

  return {
    slug,
    title: `Random Generator`,
    seo_title: `Random Generator`,
    description: `Generate random results instantly.`,
    mode: "range",
    params: { min: 1, max: 100, count: 1 },
    ui: { show_inputs: true, result_type: "text", button_text: "Generate" },
  };
};

class TextHandler {
  private readonly content: string;
  constructor(content: string) {
    this.content = content;
  }
  element(e: Element) {
    e.setInnerContent(this.content);
  }
}

class MetaAttrHandler {
  private readonly content: string;
  constructor(content: string) {
    this.content = content;
  }
  element(e: Element) {
    e.setAttribute("content", this.content);
  }
}

class CanonicalHandler {
  private readonly href: string;
  constructor(href: string) {
    this.href = href;
  }
  element(e: Element) {
    e.setAttribute("href", this.href);
  }
}

class HeadAppendHandler {
  private readonly html: string;
  constructor(html: string) {
    this.html = html;
  }
  element(e: Element) {
    e.append(this.html, { html: true });
  }
}

class HtmlContentHandler {
  private readonly html: string;
  constructor(html: string) {
    this.html = html;
  }
  element(e: Element) {
    e.setInnerContent(this.html, { html: true });
  }
}

class JsonLdHandler {
  private readonly json: string;
  constructor(json: string) {
    this.json = json;
  }
  element(e: Element) {
    e.setInnerContent(this.json);
  }
}

const xmlEscape = (s: string) =>
  s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");

const sitemapResponse = (urls: string[]) => {
  const now = new Date().toISOString();
  const body =
    `<?xml version="1.0" encoding="UTF-8"?>\n` +
    `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
    urls
      .map(
        (u) =>
          `  <url><loc>${xmlEscape(u)}</loc><lastmod>${xmlEscape(now)}</lastmod><changefreq>weekly</changefreq><priority>0.6</priority></url>\n`,
      )
      .join("") +
    `</urlset>\n`;
  return new Response(body, {
    headers: {
      "content-type": "application/xml; charset=utf-8",
      "cache-control": "public, max-age=300",
    },
  });
};

const getIndexableSlugs = async (env: Env): Promise<string[]> => {
  // Simple paging (PocketBase default perPage=30). Increase if you have more.
  const base = `${env.PB_URL.replace(/\/+$/g, "")}/api/collections/keywords/records`;
  const urls: string[] = [];
  let page = 1;
  while (page <= 20) {
    const url = new URL(base);
    url.searchParams.set("perPage", "200");
    url.searchParams.set("page", String(page));
    url.searchParams.set("filter", "(allow_indexing=true)");
    const data = await fetchJson<{ items?: any[]; totalPages?: number }>(url);
    const items = data.items ?? [];
    for (const item of items) {
      if (typeof item.slug === "string" && item.slug.length)
        urls.push(item.slug);
    }
    const totalPages =
      typeof data.totalPages === "number" ? data.totalPages : page;
    if (page >= totalPages) break;
    page++;
  }
  return urls;
};

export default {
  async fetch(
    request: Request,
    env: Env,
    ctx: ExecutionContext,
  ): Promise<Response> {
    const url = new URL(request.url);

    if (url.pathname === "/sitemap-pseo.xml") {
      const slugs = await getIndexableSlugs(env);
      const out = slugs.map((s) => new URL(`/${s}/`, url.origin).toString());
      return sitemapResponse(out);
    }

    if (isStaticAsset(url.pathname)) return fetchAssets(request, env);

    const slug = normalizeSlug(url.pathname);
    if (!slug) return fetchAssets(request, env);

    if (CORE_SLUGS.has(slug)) return fetchAssets(request, env);

    const keyword = await getKeyword(slug, env, ctx);

    // Default policy: dynamic pages are accessible, but not indexable unless explicitly allowed.
    let shouldIndex = false;
    let type = "range";
    let vars: Record<string, string | number> = { slug };
    let contentTop: string | undefined;
    let contentBottom: string | undefined;

    if (keyword) {
      shouldIndex = Boolean(keyword.allow_indexing);
      type = keyword.type || "range";
      const min =
        typeof keyword.params?.min === "number"
          ? (keyword.params.min as number)
          : undefined;
      const max =
        typeof keyword.params?.max === "number"
          ? (keyword.params.max as number)
          : undefined;
      if (
        type === "range" &&
        typeof min === "number" &&
        typeof max === "number"
      )
        vars = { min, max, slug };

      const tpl = await getTemplate(type, env, ctx);
      if (tpl?.content_top) contentTop = tpl.content_top;
      if (tpl?.content_bottom) contentBottom = tpl.content_bottom;

      if (
        tpl?.title_template &&
        vars.min !== undefined &&
        vars.max !== undefined
      ) {
        vars = { ...vars, seo_title: renderTemplate(tpl.title_template, vars) };
      }
      if (tpl?.meta_desc && vars.min !== undefined && vars.max !== undefined) {
        vars = { ...vars, seo_desc: renderTemplate(tpl.meta_desc, vars) };
      }
    } else if (isRangeSlug(slug)) {
      const parsed = parseRangeSlug(slug);
      if (!parsed) return fetchAssets(request, env);
      type = "range";
      vars = { min: parsed.min, max: parsed.max, slug };
      shouldIndex = false;
    } else {
      return fetchAssets(request, env);
    }

    const robotsContent = shouldIndex ? "index, follow" : "noindex, follow";
    const canonicalUrl = new URL(`/${slug}/`, url.origin).toString();

    const injectedToolConfig = buildInjectedConfig(slug, type, vars);
    const seoTitle =
      typeof (vars as any).seo_title === "string" &&
      (vars as any).seo_title.length
        ? String((vars as any).seo_title)
        : injectedToolConfig.seo_title;
    const seoDesc =
      typeof (vars as any).seo_desc === "string" &&
      (vars as any).seo_desc.length
        ? String((vars as any).seo_desc)
        : injectedToolConfig.description;

    const templatePath = "/template-range/";
    const templateReq = new Request(
      new URL(templatePath, request.url),
      request,
    );
    const baseResponse = await fetchAssets(templateReq, env);

    const injected = {
      ...injectedToolConfig,
      seo_title: seoTitle,
      description: seoDesc,
      robots_content: robotsContent,
      content_top_html:
        contentTop && Object.keys(vars).length
          ? renderTemplate(contentTop, vars as any)
          : (contentTop ?? null),
      content_bottom_html:
        contentBottom && Object.keys(vars).length
          ? renderTemplate(contentBottom, vars as any)
          : (contentBottom ?? null),
      canonical_url: canonicalUrl,
    };

    const injectScript = `<script>window.__PRELOADED_CONFIG__=${JSON.stringify(injected)};</script>`;

    const jsonLd = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "WebApplication",
      name: injectedToolConfig.title,
      description: seoDesc,
      applicationCategory: "UtilitiesApplication",
      operatingSystem: "All",
      url: canonicalUrl,
    });

    // Rewrite the shell HTML.
    return new HTMLRewriter()
      .on("title", new TextHandler(seoTitle))
      .on('meta[name="description"]', new MetaAttrHandler(seoDesc))
      .on('meta[name="robots"]', new MetaAttrHandler(robotsContent))
      .on('link[rel="canonical"]', new CanonicalHandler(canonicalUrl))
      .on('meta[property="og:title"]', new MetaAttrHandler(seoTitle))
      .on('meta[property="og:description"]', new MetaAttrHandler(seoDesc))
      .on('meta[property="og:url"]', new MetaAttrHandler(canonicalUrl))
      .on('meta[name="twitter:title"]', new MetaAttrHandler(seoTitle))
      .on('meta[name="twitter:description"]', new MetaAttrHandler(seoDesc))
      .on("#tool-title", new TextHandler(injectedToolConfig.title))
      .on("#tool-description", new TextHandler(seoDesc))
      .on(
        "#pseo-content-top",
        new HtmlContentHandler((injected as any).content_top_html || ""),
      )
      .on(
        "#pseo-content-bottom",
        new HtmlContentHandler((injected as any).content_bottom_html || ""),
      )
      .on('script[type="application/ld+json"]', new JsonLdHandler(jsonLd))
      .on("head", new HeadAppendHandler(injectScript))
      .transform(baseResponse);
  },
};
