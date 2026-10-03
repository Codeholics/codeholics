# Tasks

## 1. Configure alert transformation

- [x] 1.1 Select and add a maintained Unified-compatible dependency that recognizes GitHub-style alerts in both Astro Markdown and MDX, then verify `npm install` completes successfully in `astro/`.
- [x] 1.2 Register the alert transformer in the existing Astro Markdown pipeline without changing Mermaid or Pretty Code ordering, then verify `npm run build` succeeds.

## 2. Render and style alerts

- [x] 2.1 Add a focused Markdown/MDX fixture or regression check covering `NOTE`, `TIP`, `IMPORTANT`, `WARNING`, and `CAUTION`, then verify each generates an identified callout without repeating its marker text.
- [x] 2.2 Verify an ordinary blockquote and an unsupported marker such as `[!CUSTOM]` retain standard blockquote output and do not fail the production build.
- [x] 2.3 Add alert-specific prose styles using the existing light/dark theme roles, then verify every supported alert remains readable and distinct from an ordinary quote in both themes.

## 3. Document and validate authoring

- [x] 3.1 Document the five supported GitHub alert forms in `astro/README.md`, including the fallback behavior for unsupported markers, then verify each example builds as documented.
- [x] 3.2 Run `npm run build` and inspect generated output for an alert-bearing post or fixture, then verify callout markup is present and ordinary blockquotes remain unchanged.