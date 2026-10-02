# Tasks

## 1. Highlighting foundation and dependencies

- [x] 1.1 Add required highlighting/presentation dependencies in `astro/package.json` and verify installation succeeds with the project package manager.
- [x] 1.2 Add explicit markdown highlighting configuration in `astro/astro.config.mjs` and verify `astro build` completes with no markdown configuration errors.
- [x] 1.3 Define supported language list and alias normalization mappings (including legacy uppercase labels) and verify sample fences like `Python` and `HTML` resolve to highlighted output.

## 2. Code-block presentation and theming

- [x] 2.1 Integrate the selected code-block presentation layer (line emphasis + copy affordance) into the markdown rendering pipeline and verify emphasized lines render distinctly in generated pages.
- [x] 2.2 Add or adjust code-block styling in `astro/src/styles/global.css` for dark and light themes and verify contrast/readability on representative post pages.
- [x] 2.3 Implement copy-to-clipboard behavior for rendered fenced blocks and verify copied text matches displayed code content without markup artifacts.

## 3. Fallback behavior and diagnostics

- [x] 3.1 Implement readable fallback rendering for unsupported language labels and verify unknown labels render as readable fenced blocks without build failure.
- [x] 3.2 Decide and implement diagnostic behavior for unknown labels (CI-only warnings vs local+CI warnings) and verify diagnostics appear in the selected environments.

## 4. Validation and rollout safety

- [x] 4.1 Validate updated behavior against spec scenarios for `ui/code-highlighting` and `ui/dark-mode-readability` and verify each requirement has at least one demonstrable check result.
- [x] 4.2 Document canonical language ids and alias policy in project documentation and verify contributors can add new mappings without changing historic post content.
- [x] 4.3 Run end-to-end Astro build verification on representative legacy posts and verify no regression in post rendering, dark mode readability, or code-block UX.
