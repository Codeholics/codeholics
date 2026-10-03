# Tasks

## 1. Configure shortcode transformation

- [x] 1.1 Add the maintained `remark-gemoji` dependency in `astro/` and verify `npm install` completes successfully.
- [x] 1.2 Register the shortcode transformer after the existing code-language normalizer and before GitHub alert processing, without changing Mermaid or Pretty Code ordering; verify `npm run build` succeeds.

## 2. Verify and document authoring behavior

- [x] 2.1 Add or extend a generated-output regression check with Markdown and MDX fixtures for recognized aliases such as `:rocket:` and `:tada:`, then verify both render Unicode emoji without retaining their source aliases.
- [x] 2.2 Extend the regression check for an unknown alias and recognized aliases in inline and fenced code, then verify they remain literal text and do not fail the production build.
- [x] 2.3 Document GitHub-style emoji shortcode authoring, supported conversion behavior, and literal fallback behavior in `astro/README.md`, then verify each documented example builds as written.

## 3. Validate production integration

- [x] 3.1 Run `npm run build` and inspect generated fixture output to verify converted Unicode emoji, literal fallback cases, and existing alert, Mermaid, and code-highlight output remain present.
