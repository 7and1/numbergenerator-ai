# NumberGenerator.ai (P1: Engine First)

Pure frontend, config-driven random generators (Next.js App Router + SSG static export).

## Architecture

- `lib/engine.ts`: stateless generator engine (CSPRNG via Web Crypto when available)
- `lib/types.ts`: schema/types for tools and params
- `lib/configMap.ts`: tool registry (add new tools by config)
- `components/generator/*`: universal UI renderer
- `app/[slug]/page.tsx`: one dynamic route for all tools + SEO metadata

## Development

```bash
pnpm dev
```

## Tests

```bash
pnpm test:run
pnpm lint
pnpm typecheck
```

## Build (Static Export)

```bash
pnpm build
```

Output is generated in `out/` (deploy that folder to any static host).
