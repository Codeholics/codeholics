# Tasks

## 1. Enable MDX and embed support

- [x] 1.1 Add `@astrojs/mdx` and `astro-embed` to the Astro project and verify `astro/package.json` and `astro/astro.config.mjs` both reflect the new MDX-enabled setup.
- [x] 1.2 Update `astro/tailwind.config.cjs` to scan MDX-authored post content and verify the configured content globs include both `.md` and `.mdx` sources under `src/content/posts/`.

## 2. Update the mixed Markdown/MDX content pipeline

- [x] 2.1 Update `astro/src/lib/posts.ts` to load post modules and raw content from both `.md` and `.mdx` files while preserving slug generation and draft filtering, then verify migrated posts still resolve to their existing slugs in the built Astro site.
- [x] 2.2 Update the raw-text cleanup used by excerpts and `astro/src/pages/search.html.astro` to strip MDX imports and component markup as well as legacy YouTube tag syntax, then verify search data for migrated posts contains only reader-facing text.

## 3. Migrate the affected Astro posts

- [x] 3.1 Rename the six Astro posts that still contain `{% youtube <id> %}` from `.md` to `.mdx`, replace each legacy tag with the Astro YouTube embed component, and verify every migrated file preserves its existing frontmatter slug and YouTube ID.
- [x] 3.2 Run `npm run build` in `astro/` and verify the site builds successfully, the migrated posts render as playable YouTube embeds, and no raw liquid-tag syntax appears in the resulting post pages or search excerpts.
