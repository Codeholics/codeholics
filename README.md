# Codeholics

Static site source for [codeholics.com](https://codeholics.com/), built and deployed with Astro.

## Status

- Astro is the only supported production stack in this repository.
- Legacy Pelican production paths have been retired.
- URL compatibility with legacy Pelican routes is not guaranteed (break-and-reindex policy).

## Quick start

```bash
cd astro
npm install
npm run dev
```

Recommended Node version: see `astro/package.json` (`engines.node`).

## Build and preview

```bash
cd astro
npm run build
npm run preview
```

## Migration parity check

Before destructive cleanup or cutover validation, verify that legacy post identities have Astro counterparts:

```bash
cd astro
npm run verify:legacy-content-parity
```

This check compares legacy `content/*.md` post names against `astro/src/content/posts/*.{md,mdx}` and fails if any counterpart is missing.

## AI-assisted Astro post metadata check (warning-only)

When AI helps draft/edit a post:

```bash
cd astro
npm run ai:post:finalize -- --file src/content/posts/<slug>.md
```

Optional manual run:

```bash
cd astro
npm run lint:post-metadata -- --file src/content/posts/<slug>.md
```

Required metadata keys for this warning-only check:
- `title`
- `date`
- `category`
- `tags`
- `slug`
- `summary`

## Deployment

CI workflows live in `.github/workflows/` and build/deploy Astro output from `astro/dist`.

## Resources

- Astro docs: https://docs.astro.build/
