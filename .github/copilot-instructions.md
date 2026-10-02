# Copilot instructions for Codeholics

Quick reference for future Copilot sessions working in this repository.

## Active stack

- This repository is Astro-first and Astro-only for production workflows.
- Legacy Pelican production paths are retired.
- URL migration policy is break-and-reindex (do not assume legacy URL preservation).

## Build, test, and lint commands (Astro)

From `astro/`:

- Install dependencies: `npm install`
- Dev server: `astro dev --background`
- Stop/status/logs: `astro dev stop`, `astro dev status`, `astro dev logs`
- Build: `npm run build`
- Preview: `npm run preview`
- Legacy parity gate: `npm run verify:legacy-content-parity`
- Inline code lint: `npm run lint:inline-code`
- Inline code strict: `npm run lint:inline-code:strict`
- Metadata warning check (AI flow): `npm run ai:post:finalize -- --file src/content/posts/<slug>.md`
- Metadata warning check (manual): `npm run lint:post-metadata -- --file src/content/posts/<slug>.md`

## High-level architecture

- Astro app root: `astro/`
- Post content: `astro/src/content/posts`
- Public assets: `astro/public`
- Build output: `astro/dist`
- CI/deploy workflows: `.github/workflows/build.yml`, `.github/workflows/deploy.yml`

## Key conventions

- Do not reintroduce Pelican build/deploy instructions in active docs or workflows.
- Keep metadata checks warning-only unless explicitly changed by a future spec.
- For content migration/cutover work, run `npm run verify:legacy-content-parity` before destructive removals.
- Prefer minimal, focused edits aligned to existing Astro structure and scripts.
