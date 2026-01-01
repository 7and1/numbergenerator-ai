# P2 Interceptor Worker (Shell Injection)

This worker sits in front of the static `out/` site and injects SEO + initial generator config at the edge.

## What it does

- Pass-through for core static pages and assets (`/_next/*`, `robots.txt`, `sitemap.xml`, `*.js`, `*.css`, ...)
- For dynamic pSEO URLs (e.g. `/1-520/`):
  - Reads `keywords` from PocketBase by `slug`
  - Applies `seo_templates` by `type` (optional)
  - Injects:
    - `<title>`, `<meta name="description">`, `<meta name="robots">`, `<link rel="canonical">`
    - `window.__PRELOADED_CONFIG__` (full ToolConfig + optional HTML blocks)
  - Serves a static shell from `out/template-range/index.html`

## Required PocketBase collections

### `seo_templates`

- `type` (text) – e.g. `range`
- `title_template` (text) – e.g. `Random Number {{min}}-{{max}}`
- `meta_desc` (text)
- `content_top` (text/html)
- `content_bottom` (text/html)

### `keywords`

- `slug` (text, unique) – e.g. `1-520`
- `type` (select/text) – e.g. `range`
- `params` (json) – e.g. `{ "min": 1, "max": 520 }`
- `allow_indexing` (bool, default false)

## Indexing gate (anti-sandbox)

- Core pages: served as-is (indexable)
- Dynamic pages:
  - default: `noindex, follow`
  - when `allow_indexing = true`: `index, follow`

## Deploy notes

This can be deployed either as:

- a standalone Worker routed on your domain, **or**
- a Cloudflare Pages Function (recommended if you want automatic `ASSETS` binding).

You must configure:

- `PB_URL` (Worker var)
- `ASSETS` (Fetcher binding to your Pages deployment)
- optional `CACHE_KV` (KV binding)

The worker also serves `GET /sitemap-pseo.xml` (only slugs with `allow_indexing=true`).
