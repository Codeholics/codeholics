# Tasks

## 1. Consolidate Astro dark-theme tokens

- [x] 1.1 Update `astro/src/styles/global.css` with the approved dark palette roles and verify `cd astro && npm run build` succeeds with the new tokens in place
- [x] 1.2 Expand the shared theme helpers and `.prose` dark-mode rules for links, metadata, blockquotes, inline code, fenced code, and borders, and verify a code-heavy post renders those elements with readable contrast in dark mode during local preview

## 2. Apply the palette to content-heavy Astro surfaces

- [x] 2.1 Replace light-first surface/text classes in `astro/src/components/PostCard.astro` with semantic theme helpers and verify homepage or listing cards show readable title, summary, and metadata text in dark mode
- [x] 2.2 Update `astro/src/pages/posts/[slug].astro` to use the shared themed reading-surface classes and verify the post title, date, body copy, and links remain readable in dark mode
- [x] 2.3 Audit any remaining Astro search or shared content surfaces that hard-code light-only classes and verify search inputs/results stay readable and visually consistent with the updated dark palette

## 3. Validate the dark-mode reading experience

- [x] 3.1 Run `cd astro && npm run build` after the theme updates and verify the production build completes without styling/runtime errors
- [x] 3.2 Manually review representative Astro pages in dark mode (homepage/listing, post detail, and search) and verify the page background, content surfaces, body text, links, and code blocks match the readability requirements from `ui/dark-mode-readability`
