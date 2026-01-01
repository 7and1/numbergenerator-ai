# Phase 2 (pSEO Engine)

Goal: serve 10k+ keyword landing pages by injecting SEO + generator config at the edge.

## Components

- **P1 Shell**: this repo builds to `out/` (static export, deploy to Cloudflare Pages)
- **Brain**: PocketBase on your VPS (stores `keywords` + `seo_templates`)
- **Interceptor**: Cloudflare Worker/Pages Function that:
  - fetches the shell HTML from Pages
  - fetches keyword/template data from PocketBase
  - rewrites HTML + injects `window.__PRELOADED_CONFIG__`

## Anti-sandbox indexing gate

- Core pages: indexable (normal)
- pSEO pages: default `noindex, follow`
- Flip a keyword to indexable by setting `keywords.allow_indexing = true`
- Optional: serve `GET /sitemap-pseo.xml` from the worker for only indexable keywords

## Quick start (VPS)

1. Install PocketBase:
   - `sudo bash pseo/pocketbase/install_pocketbase.sh`
2. Run once (manual):
   - `/opt/number-pb/pocketbase serve --http=0.0.0.0:8090`
3. Or systemd:
   - `sudo cp pseo/pocketbase/number-pb.service /etc/systemd/system/number-pb.service`
   - `sudo systemctl daemon-reload`
   - `sudo systemctl enable --now number-pb`

## Seed (first batch)

```bash
PB_URL="http://YOUR_VPS_IP:8090" node pseo/seed/seed_pseo.mjs
```

If your PocketBase rules require auth:

```bash
PB_URL="http://YOUR_VPS_IP:8090" PB_IDENTITY="you@example.com" PB_PASSWORD="..." node pseo/seed/seed_pseo.mjs
```
