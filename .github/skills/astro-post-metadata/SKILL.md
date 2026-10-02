---
name: astro-post-metadata
description: Validate Astro post front matter in warning-only mode, primarily for AI-assisted drafting workflows.
allowed-tools: Bash(node:*,npm:*)
license: MIT
compatibility: Any CLI/client that can run repository shell commands.
metadata:
  owner: codeholics
  version: "1.0"
---

# Astro Post Metadata (Warning-Only)

Use this skill when creating or revising posts in `astro/src/content/posts`, especially when AI generated or heavily edited the draft.

## Goal

Enforce repository metadata standards as warnings (never hard-fail):

- `title`
- `date`
- `category`
- `tags`
- `slug`
- `summary`

## Behavior

- Warnings are informational and must not block publish/build flows.
- Automatic checks are scoped to AI-assisted flow.
- Manual checks remain available for optional use on any post file.

## Commands

Run from repo root:

```bash
cd astro
```

AI-assisted flow (auto-gated, warning-only):

```bash
npm run ai:post:finalize -- --file src/content/posts/<slug>.md
```

Manual optional check (warning-only):

```bash
npm run lint:post-metadata -- --file src/content/posts/<slug>.md
```

## Success criteria

- Command exits successfully even when warnings exist.
- Warning output includes file path and missing/empty required keys.
- Metadata checks do not modify content files automatically.
