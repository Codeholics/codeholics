# Site Implementation Review Findings

## Review metadata

- Reviewed commit: `8821ab786783ba387936ce157c2940ed0c3c3983`
- Review date: 2026-10-28
- Node version: `v22.23.2`
- Viewports: 375×812 (mobile), 768×1024 (tablet), 1280×800 (desktop), 1536×960 (large desktop)
- Themes: dark and light
- Motion preference: normal and `prefers-reduced-motion: reduce`

## Baseline

| Check | Result | Warnings / errors | Evidence |
|---|---|---|---|

## Document conflicts

### DC-1 — Design-system filename casing — Resolved 2026-10-27

- **Conflict:** `.github/copilot-instructions.md:52, 167, 172` points to `/DESIGN.md`, while the design file was previously named `astro/Design.md`.
- **Resolution:** Commit `8821ab786783ba387936ce157c2940ed0c3c3983` (2026-10-27) renamed `astro/Design.md` to the root `DESIGN.md`. The current file is `DESIGN.md:1`, and the repository instructions now resolve to that canonical path.
- **Decision taken:** Keep the root, uppercase `DESIGN.md` as the authoritative design-system file.

### DC-2 — Light/dark design guidance — Resolved 2026-10-27

- **Conflict:** Earlier design guidance did not accurately capture the approved live palette and both theme modes.
- **Resolution:** The 2026-10-27 update records System, Light, and Dark behavior and states that both themes are first-class (`DESIGN.md:72-90`). It records the approved accent colors and preserves existing token names (`DESIGN.md:102-113`); the page-background values are also specified for both themes (`DESIGN.md:159-160`). The change proposal records the date and scope of this resolution (`openspec/changes/review-site-implementation/proposal.md:17-18`).
- **Decision taken:** Use the approved live palette and current token names as the reference. Do not treat the earlier sky/cyan palette as a target or recommend a palette redesign; report measured contrast problems separately.

### DC-3 — Generic Astro guidance versus repository constraints — Open

- **Conflict:** The generic Astro guide targets Astro 7 and discusses multi-framework islands, optional SSR, framework components, server islands, Actions, and Sessions (`.github/Instructions/astro.instructions/astro.instructions.md:11-19, 46, 102, 109-154`). Repository guidance says production is Astro-only and defaults to zero client-side JavaScript (`.github/copilot-instructions.md:9-14, 87-110`).
- **Decision needed:** Confirm whether the generic Astro guide should remain general-purpose while repository-specific constraints govern this project, or whether the guide should be revised to remove guidance that does not apply here. Until that is decided, follow the repository-specific Astro-only and zero-JavaScript-by-default rules; the change design records this precedence (`openspec/changes/review-site-implementation/design.md:34`).

## Representative post sample

| Feature | Sample post | Evidence / coverage |
|---|---|---|
| Fenced code and long code lines | `mycroft-part-1`; `displaylink-dk1522-issue-after-opensuse-leap-42-3-upgrade` | Both contain fenced code; code blocks include long lines. |
| Inline code | `mycroft-part-1` | Inline code appears in the article text. |
| Tables | `mycroft-part-1`; `home-network-overhaul` | Markdown tables are present. |
| YouTube embeds | `how-a-cpu-works`; `7-gamers-1-cpu-ultimate-virtualized-gaming-build-log`; `how-to-make-a-motherboard-a-gigabyte-factory-tour`; `how-to-reveal-the-password-hidden-behind-asterisks`; `how-we-make-sd-cards`; `thirty-years-of-mac-ads-1984-2014` | Existing MDX posts import `YouTube`; production pages render `<lite-youtube>` players with their configured video IDs. `clamav-clamtk-anti-virus-for-ubuntu` has only an ordinary YouTube link. |
| Mermaid | `beyond-flock-the-quiet-standardization-of-Mass-Sureillance-(tldr)` | Contains a fenced Mermaid diagram. |
| Images and thumbnail | `mycroft-part-1` | Has a front matter thumbnail and an inline article image. |
| Missing optional front matter | `blocking-an-ip-on-a-linux-system-with-iptables` | Omits optional `summary` and `thumbnail` fields but is marked `status: draft`, so it has no published page. |
| GitHub Markdown alerts (`> [!`) | None found | No matching post exists; alert rendering cannot be verified against a post page. |
| Emoji shortcodes (`:emoji:`) | None found | No shortcode exists in the post corpus; shortcode rendering cannot be verified against a post page. |

No temporary fixture was added. The existing MDX YouTube posts provide real page examples. The missing alert and emoji-shortcode examples remain documented as coverage limitations, not implementation findings; task 1.3 remains unchecked because those features still have no representative post.

## Pass A: Automated baseline

| Check | Result | Warnings / errors | Evidence |
|---|---|---|---|
| `npm run build` (includes `npm run lint:inline-code`) | Pass; Astro reports 242 pages built | No build warnings or errors. Inline-code lint: no delimiter issues (`Mode=warn`). | Run from `astro/`; exit code 0; build completed in 9.16s. |
| `npm run lint:inline-code:strict` | Fail on Windows; equivalent direct strict invocation passes | npm script exits before running the linter because its POSIX-style environment assignment is not recognized. Direct PowerShell environment assignment: no delimiter issues (`Mode=error`). | `npm run` failure; `node scripts/lint-inline-code.mjs` with `$env:INLINE_CODE_LINT_MODE='error'`: exit code 0. |
| `npm run verify:legacy-content-parity` | Pass; no checks required | Legacy content root `content` is absent. | Script output: `[parity] No legacy content parity checks required.` |
| `npm run test:site-url` | Pass | Default, overridden, and invalid site URL checks pass, including RSS and social metadata. | Run from `astro/`; exit code 0. |
| `npm run test:post-metadata` | Pass | No reported failures. | Script output: `post-metadata validator tests passed`. |
| `npm run test:github-projects` | Pass | No reported failures. | Script output: `GitHub project metadata tests passed.` |
| `npm run test:github-markdown-alerts` | Fail | Alert rendering class assertions pass before the test fails because raw alert markers are present in the generated metadata description. | `astro/scripts/test-github-markdown-alerts.mjs:85`; the generated page's `<meta name="description">` contains the source alert marker. |
| `npm run test:emoji-shortcodes` | Pass | No reported failures. | Script output: `Emoji shortcode regression tests passed`. |
| `npm run test:social-sharing` | Pass | No reported failures. | Script output: `Social sharing fixtures passed: escaping, external images, blank/missing metadata, MDX excerpts, and draft exclusion.` |
| `npm run test:e2e` | Pass; 59 passed, 0 failed, 0 skipped | GitHub API was mocked by the configured E2E web server. | Per spec: `github-projects.spec.ts` 16/0, `link.spec.ts` 1/0, `navbar.spec.ts` 35/0, `rss.spec.ts` 2/0, `social-sharing.spec.ts` 5/0. Playwright JSON report is in the user-approved temp directory. |
| `npx astro check` | Fail | 29 errors, 0 warnings, 55 hints across 106 files. `@astrojs/check` and TypeScript were temporarily installed with no manifest or lockfile changes to run the check. | Exit code 1. Every error is listed as a finding below. |

| ID | Pass | Severity | Location (file / URL+viewport) | Issue | Source of truth | Evidence | Proposed follow-up |
|---|---|---|---|---|---|---|---|
| A-01 | A | Low | `astro/package.json:15` | The documented strict inline-code lint npm script uses POSIX environment assignment and fails before running on Windows. The same strict check passes when invoked with PowerShell's native environment assignment. | `astro/package.json:15` | npm reports `'INLINE_CODE_LINT_MODE' is not recognized`; direct strict invocation reports no delimiter issues and exits 0. | Make the strict lint script cross-platform. |
| A-02 | A | Low | `astro/scripts/test-github-markdown-alerts.mjs:85` | The regression test scans the entire generated HTML for unrendered alert markers and fails on the page description, despite its preceding body alert assertions passing. Reassess the excerpt behavior and scope of this assertion during the SEO review. | `astro/scripts/test-github-markdown-alerts.mjs:85` | Generated `meta description` contains `[!NOTE]` and similar markers; the failure is at the whole-document `doesNotMatch` assertion. | Decide whether to strip alert syntax from generated descriptions or limit the assertion to rendered article content. |
| A-03 | A | Low | `astro.config.mjs:14:23` | `process` is not defined in the configured TypeScript environment (`ts(2591)`). | `.github/Instructions/astro.instructions/astro.instructions.md:15, 31-41` | `astro check`: error 1 of 29. | Add or correctly configure Node.js types. |
| A-04 | A | Low | `src/layouts/Layout.astro:159:54` | `innerText` is not available on the inferred `Element` type (`ts(2339)`). | `.github/Instructions/astro.instructions/astro.instructions.md:15, 31-41` | `astro check`: error 2 of 29. | Narrow the element type or use a supported property. |
| A-05 | A | Low | `src/layouts/Layout.astro:134:15` | A `Promise` type expects an argument, but the code resolves it with none (`ts(2794)`). | `.github/Instructions/astro.instructions/astro.instructions.md:15, 31-41` | `astro check`: error 3 of 29. | Specify the promise result type or resolve with a value. |
| A-06 | A | Low | `src/layouts/Layout.astro:118:27` | The `text` parameter has implicit `any` type (`ts(7006)`). | `.github/Instructions/astro.instructions/astro.instructions.md:15, 31-41` | `astro check`: error 4 of 29. | Add an explicit parameter type. |
| A-07 | A | Low | `src/layouts/Layout.astro:91:35` | The `mode` parameter has implicit `any` type (`ts(7006)`). | `.github/Instructions/astro.instructions/astro.instructions.md:15, 31-41` | `astro check`: error 5 of 29. | Add an explicit parameter type. |
| A-08 | A | Low | `src/layouts/Layout.astro:87:37` | The `mode` parameter has implicit `any` type (`ts(7006)`). | `.github/Instructions/astro.instructions/astro.instructions.md:15, 31-41` | `astro check`: error 6 of 29. | Add an explicit parameter type. |
| A-09 | A | Low | `src/lib/posts.ts:131:23` | The `p` parameter has implicit `any` type (`ts(7006)`). | `.github/Instructions/astro.instructions/astro.instructions.md:15, 31-41` | `astro check`: error 7 of 29. | Type the helper parameter and its input collection. |
| A-10 | A | Low | `src/lib/posts.ts:129:40` | The `category` parameter has implicit `any` type (`ts(7006)`). | `.github/Instructions/astro.instructions/astro.instructions.md:15, 31-41` | `astro check`: error 8 of 29. | Add an explicit parameter type. |
| A-11 | A | Low | `src/lib/posts.ts:129:33` | The `posts` parameter has implicit `any` type (`ts(7006)`). | `.github/Instructions/astro.instructions/astro.instructions.md:15, 31-41` | `astro check`: error 9 of 29. | Add an explicit parameter type. |
| A-12 | A | Low | `src/lib/posts.ts:126:93` | The `s` parameter has implicit `any` type (`ts(7006)`). | `.github/Instructions/astro.instructions/astro.instructions.md:15, 31-41` | `astro check`: error 10 of 29. | Add an explicit parameter type. |
| A-13 | A | Low | `src/lib/posts.ts:126:23` | The `p` parameter has implicit `any` type (`ts(7006)`). | `.github/Instructions/astro.instructions/astro.instructions.md:15, 31-41` | `astro check`: error 11 of 29. | Add an explicit parameter type. |
| A-14 | A | Low | `src/lib/posts.ts:124:35` | The `tag` parameter has implicit `any` type (`ts(7006)`). | `.github/Instructions/astro.instructions/astro.instructions.md:15, 31-41` | `astro check`: error 12 of 29. | Add an explicit parameter type. |
| A-15 | A | Low | `src/lib/posts.ts:124:28` | The `posts` parameter has implicit `any` type (`ts(7006)`). | `.github/Instructions/astro.instructions/astro.instructions.md:15, 31-41` | `astro check`: error 13 of 29. | Add an explicit parameter type. |
| A-16 | A | Low | `src/lib/posts.ts:115:34` | The `posts` parameter has implicit `any` type (`ts(7006)`). | `.github/Instructions/astro.instructions/astro.instructions.md:15, 31-41` | `astro check`: error 14 of 29. | Add an explicit parameter type. |
| A-17 | A | Low | `src/lib/posts.ts:106:13` | The `t` parameter has implicit `any` type (`ts(7006)`). | `.github/Instructions/astro.instructions/astro.instructions.md:15, 31-41` | `astro check`: error 15 of 29. | Add an explicit parameter type. |
| A-18 | A | Low | `src/lib/posts.ts:100:28` | The `posts` parameter has implicit `any` type (`ts(7006)`). | `.github/Instructions/astro.instructions/astro.instructions.md:15, 31-41` | `astro check`: error 16 of 29. | Add an explicit parameter type. |
| A-19 | A | Low | `src/lib/posts.ts:90:26` | The `posts` parameter has implicit `any` type (`ts(7006)`). | `.github/Instructions/astro.instructions/astro.instructions.md:15, 31-41` | `astro check`: error 17 of 29. | Add an explicit parameter type. |
| A-20 | A | Low | `src/lib/posts.ts:37:9` | The post record requires `body: string`, but the collection entry body may be undefined (`ts(2322)`). | `.github/Instructions/astro.instructions/astro.instructions.md:15, 31-41` | `astro check`: error 18 of 29. | Align the post record type with the collection entry type. |
| A-21 | A | Low | `src/pages/index.astro:58:22` | The `post` parameter has implicit `any` type (`ts(7006)`). | `.github/Instructions/astro.instructions/astro.instructions.md:15, 31-41` | `astro check`: error 19 of 29. | Type the page data before mapping. |
| A-22 | A | Low | `src/pages/categories/[category]/index.astro:28:16` | The `p` parameter has implicit `any` type (`ts(7006)`). | `.github/Instructions/astro.instructions/astro.instructions.md:15, 31-41` | `astro check`: error 20 of 29. | Type the page data before mapping. |
| A-23 | A | Low | `src/pages/categories/[category]/page/[page].astro:36:16` | The `p` parameter has implicit `any` type (`ts(7006)`). | `.github/Instructions/astro.instructions/astro.instructions.md:15, 31-41` | `astro check`: error 21 of 29. | Type the page data before mapping. |
| A-24 | A | Low | `src/pages/page/[page].astro:25:16` | The `post` parameter has implicit `any` type (`ts(7006)`). | `.github/Instructions/astro.instructions/astro.instructions.md:15, 31-41` | `astro check`: error 22 of 29. | Type the page data before mapping. |
| A-25 | A | Low | `src/pages/projects/index.astro:9:3` | The `token` property is not accepted by the inferred component prop type (`ts(2353)`). | `.github/Instructions/astro.instructions/astro.instructions.md:15, 31-41` | `astro check`: error 23 of 29. | Align the component invocation with its declared prop type. |
| A-26 | A | Low | `src/pages/tags/[tag]/index.astro:28:16` | The `p` parameter has implicit `any` type (`ts(7006)`). | `.github/Instructions/astro.instructions/astro.instructions.md:15, 31-41` | `astro check`: error 24 of 29. | Type the page data before mapping. |
| A-27 | A | Low | `src/pages/tags/[tag]/page/[page].astro:37:16` | The `p` parameter has implicit `any` type (`ts(7006)`). | `.github/Instructions/astro.instructions/astro.instructions.md:15, 31-41` | `astro check`: error 25 of 29. | Type the page data before mapping. |
| A-28 | A | Low | `tests/github-projects.spec.ts:165:52` | `remove` is not available on the inferred `Node` type (`ts(2339)`). | `.github/Instructions/astro.instructions/astro.instructions.md:15, 31-41` | `astro check`: error 26 of 29. | Narrow the element type or use the appropriate DOM node API. |
| A-29 | A | Low | `tests/navbar.spec.ts:26:31` | The `page` parameter has implicit `any` type (`ts(7006)`). | `.github/Instructions/astro.instructions/astro.instructions.md:15, 31-41` | `astro check`: error 27 of 29. | Add the Playwright `Page` type. |
| A-30 | A | Low | `tests/navbar.spec.ts:3:41` | The `page` parameter has implicit `any` type (`ts(7006)`). | `.github/Instructions/astro.instructions/astro.instructions.md:15, 31-41` | `astro check`: error 28 of 29. | Add the Playwright `Page` type. |
| A-31 | A | Low | `tests/social-sharing.spec.ts:2:26` | The `node:fs/promises` module types cannot be found (`ts(2591)`). | `.github/Instructions/astro.instructions/astro.instructions.md:15, 31-41` | `astro check`: error 29 of 29. | Add or correctly configure Node.js types. |

## Pass B: Spec conformance

### 3.1 UI specifications

Reviewed the built preview at `http://127.0.0.1:4321/`, the representative post pages, the production output, and the 59 passing E2E tests.

| Specification | Requirement / scenario | Result | Evidence |
|---|---|---|---|
| `ui/site-navigation` | Brand and primary navigation at desktop and tablet breakpoints | Pass | E2E verifies all eight destinations inline at 1024px+ and in the drawer at 767, 768, and 1023px. |
| `ui/site-navigation` | Primary destination URLs | Pass | E2E checks the exact hrefs in both navigation variants. |
| `ui/site-navigation` | Social links at every viewport | Pass | E2E verifies four named links in the app bar at 1280px+, in the drawer below 1024px, and in a separate footer group at every tested width; footer links are at least 44x44px. |
| `ui/site-navigation` | Mobile menu open, keyboard operation, and desktop resize reset | Pass | E2E confirms visibility, `aria-expanded`, focus entering and returning from the drawer, Escape handling, and reset at the desktop breakpoint. |
| `ui/site-navigation` | Dark, light, and auto theme preference | Pass | E2E checks explicit-choice persistence across reloads and auto mode following emulated system preference changes. |
| `ui/site-navigation` | Keyboard navigation and desktop search | Pass | E2E confirms keyboard reachability, labels, focus transfer and restoration, `aria-expanded`, search submission, and unchanged navigation/utility positions while search opens. |
| `ui/site-navigation` | Light-mode app-bar readability and search | Pass | E2E measures at least 4.5:1 for brand/link text and 3:1 for icons at 1024px and 1280px, and checks the search form remains in the viewport without reflow. |
| `ui/site-navigation` | App-bar width, single-line brand, and link sizing | Pass | E2E checks four shared-layout pages at 320, 375, 767, 768, 1023, 1024, 1279, 1280, and 1536px; no overflow/clipping was reported, brand height is one line, and inline links meet the utility-button height. |
| `ui/dark-mode-readability` | Article heading, body, metadata, and distinct reading surface | Pass | On `/posts/mycroft-part-1` in dark mode, the article surface is a distinct dark tone; measured contrast is 17.15:1 for the heading, 14.56:1 for body copy, and 7.00:1 for metadata against the composited article surface. |
| `ui/dark-mode-readability` | Paragraph/list/blockquote spacing cues | Pass | On `/posts/defcon1` in dark mode, paragraph and list line-height is 28px with 20px vertical margins; the blockquote has a separate bottom margin and left border. Text remains `rgb(226, 232, 240)`. |
| `ui/dark-mode-readability` | Listing cards and interactive links | Pass | On the dark homepage, the first card title, summary, and metadata measured 17.15:1, 14.56:1, and 7.00:1 respectively against its composited surface. |
| `ui/dark-mode-readability` | Navbar and search controls | Pass | In dark mode, nav labels are `rgb(226, 232, 240)`; the opened search input uses a dark surface, `rgb(248, 250, 252)` entered text, and `rgb(203, 213, 225)` placeholder text, and receives focus. |
| `ui/dark-mode-readability` | Inline links and hover/focus distinction | Pass | An article link measured 6.59:1 against its dark reading surface; shared link styles define separate hover/focus states. |
| `ui/dark-mode-readability` | Code surfaces, tokens, and copy control | Pass | Dark code blocks use a distinct near-black surface; default text measured 13.51:1 against it. The `Defcon1` page renders multiple syntax-token colors and a copy control in dark mode. |
| `ui/code-highlighting` | Uppercase legacy aliases and supported-language syntax | Pass | The existing `Defcon1` post uses `HTML` and `Python` fences; production output renders `html` and `python` with Shiki token spans. Supported tokens resolve to dark and light colors when toggling themes. |
| `ui/code-highlighting` | Unknown-language fallback | Not verifiable in live content | No post uses an unknown fenced-language label. The normalizer maps unknown labels to `text` and emits a warning; no unknown-label page example exists to verify rendered output. |
| `ui/code-highlighting` | Emphasized lines | Not verifiable in live content | The sample pages contain no emphasized-line metadata. The stylesheet defines the `[data-highlighted-line]` treatment, but no real post exercises it. |
| `ui/code-highlighting` | Copy affordance and plain-text copying | Pass | Every rendered `Defcon1` code block has a labelled copy button. Activating one changed its state to `Copied`; the handler copies `code.innerText`. |
| `ui/code-highlighting` | Explicit highlighting configuration | Pass | `astro/astro.config.mjs` disables implicit Markdown highlighting and explicitly configures `rehype-pretty-code`, light/dark themes, language normalization, Markdown alerts, emoji, and Mermaid processing. |
| `ui/code-highlighting` | Valid inline code and legacy delimiter normalization | Pass | The `Mycroft Personal Assistant Setup Part 1` page renders inline code without delimiter leakage. The normalizer applies only its deterministic correction and logs it; ambiguous delimiters are diagnosed. The baseline lint found no current delimiter issues. |
| `ui/code-highlighting` | Warn-to-block enforcement phase | Partially verifiable; see B-02 | Warn and strict modes exist, and direct strict-mode lint passed. Both deployment workflows call the default warning-mode `npm run build`; the spec does not define when the cleanup window ends. |
| `ui/code-highlighting` | Contributor authoring/remediation guidance | Not met; see B-01 | `astro/README.md` and `.github/copilot-instructions.md` list lint commands, but do not explain canonical inline-code authoring or how to remediate a finding and rerun checks. |

| ID | Pass | Severity | Location (file / URL+viewport) | Issue | Source of truth | Evidence | Proposed follow-up |
|---|---|---|---|---|---|---|---|
| B-01 | B | Low | `astro/README.md`; `.github/copilot-instructions.md` | Contributor documentation names the inline-code lint commands but does not document canonical delimiter authoring, supported exceptions, or remediation steps. | `openspec/specs/ui/code-highlighting/spec.md`, Requirement: Contributor guidance documents canonical inline-code authoring | Targeted search found only command references in the two contributor-facing documents; no authoring or remediation guidance was found. | Add canonical inline-code authoring and remediation guidance to the Astro contributor documentation. |
| B-02 | B | Low | `openspec/specs/ui/code-highlighting/spec.md`; `astro/package.json`; `.github/workflows/build.yml`; `.github/workflows/deploy.yml` | The spec requires enforcement to become blocking after a cleanup window but defines no end date or completion trigger. The active build and deploy workflows run the default warning-mode build, so the current phase cannot be determined from the spec. | `openspec/specs/ui/code-highlighting/spec.md`, Requirement: Strict lint enforcement is phased from warn to block | `astro/package.json` provides separate warn and strict scripts; both workflows run `npm run build`, which invokes the warning-mode lint. | Define the cleanup-window end condition and the CI command that enforces blocking behavior afterward. |

### 3.2 Projects, social sharing, and favicons

| Specification | Requirement | Result | Evidence |
|---|---|---|---|
| `ui/github-projects` | Dedicated `/projects/` page and selected Codeholics repositories | Pass | The built route returns 200 with the `Featured Projects` heading and four repository cards; E2E verifies navigation and that the homepage has no project panel. |
| `ui/github-projects` | Curated categories, configured ordering, and accessible selection | Pass | The page renders four tabs; the E2E suite verifies selected state, keyboard operation, and switching the visible panel. |
| `ui/github-projects` | Build-time repository metadata, token handling, and safe GitHub requests | Pass | E2E verifies the page makes no browser-side GitHub API requests. The generated project HTML contained no GitHub API URL or token-like value; the metadata script tests pass, including invalid/unavailable repository cases. |
| `ui/github-projects` | Unavailable repository metadata affects only the failed entry | Pass | The `test:github-projects` script passed its metadata failure/validation checks; the E2E suite confirms the generated project page remains usable. |
| `ui/github-projects` | Responsive layouts, theme readability, hero contrast, and theme preference | Pass | All 16 GitHub-project E2E tests passed. They cover narrow/wide layouts, light/dark content and hero contrast, saved/System theme behavior, reduced-motion focus, and category controls. |
| `ui/github-projects` | Safe project links and keyboard access | Pass | E2E verifies external links use a new tab with `noopener noreferrer`, focus is visible, and the category controls are keyboard-operable. |
| `ui/github-projects` | Theme-aware concept-art hero and visual separation | Pass | The E2E suite covers hero composition, responsive behavior, theme blending, image placement, decorative semantics, and divider/layout expectations. |
| `ui/github-projects` | Optimized, prioritized WebP hero asset | Pass | The built page selects the `.webp` image, returns 200 with `image/webp` and RIFF/WEBP bytes, decodes at 1983x793 matching declared dimensions, has empty alt text inside an `aria-hidden` container, and sets `fetchpriority="high"` without lazy loading. The E2E image test passed. |
| `frontend/social-sharing` | Initial HTML metadata is unique, consistent, and page-specific | Not met; see B-12 | All 228 active site HTML documents contain one of each required title, description, canonical, Open Graph, and Twitter tag. Three published embed-only posts emit an empty description, contrary to the post-description requirement. |
| `frontend/social-sharing` | Homepage, summary, excerpt, and special-character descriptions | Not met; see B-12 | Homepage description identifies software/hardware/systems; posts with summaries and text bodies use expected descriptions and fixtures cover escaping. Three published posts have neither a nonempty summary nor plain-text body excerpt, so their description is empty. |
| `frontend/social-sharing` | Default and alternate canonical URLs | Pass | Production routes use `https://www.codeholics.com` and retain their page path; baseline site-URL tests pass default, override, and invalid URL checks. |
| `frontend/social-sharing` | Local, fallback, and externally hosted share images | Pass | Built posts use their local thumbnail or the branded fallback as appropriate; social-sharing fixtures pass external-host preservation and URL escaping, and the post-image E2E requests return successful image responses. |
| `frontend/social-sharing` | Default share image format, size, and Twitter parity | Pass | E2E verifies the default asset is a reachable 1200x630 PNG and matches the supplied hero-derived image; Open Graph and Twitter title/description/image values match. Custom post thumbnails do not advertise default dimensions. |
| `frontend/social-sharing` | Existing content behavior and author workflow documentation | Pass | E2E and fixtures cover published routes, body content, card thumbnails, draft exclusion, listing defaults, and favicon-tag presence. `astro/README.md` documents thumbnail/fallback usage, 1200x630 artwork, public absolute URLs, and Facebook Sharing Debugger refresh/cache limits. |
| `frontend/favicons` | Canonical PNG files at the web root | Not met; see B-03 | `/favicon-32x32.png` and `/favicon-16x16.png` both return 404. The linked nested paths `/favicon/favicon-32x32.png` and `/favicon/favicon-16x16.png` return valid 32x32 and 16x16 PNGs. |

| ID | Pass | Severity | Location (file / URL+viewport) | Issue | Source of truth | Evidence | Proposed follow-up |
|---|---|---|---|---|---|---|---|
| B-03 | B | High | `/favicon-32x32.png`; `/favicon-16x16.png`; `astro/src/layouts/Layout.astro` | The favicon capability requires the two PNG files at the web root, but those routes return 404; the shared layout links to files under `/favicon/` instead. The nested files are valid and correctly sized, so the browser-linked icons work, but the canonical URLs specified by the capability are absent. | `openspec/specs/frontend/favicons/spec.md`, Requirement: Provide canonical PNG favicons | Production preview: both required root paths return 404; both nested paths return 200 `image/png` with the specified intrinsic dimensions. The rendered head references the nested paths. | Align the canonical asset paths and emitted favicon links with the accepted favicon specification. |
| B-04 | B | High | `.github/workflows/build.yml`; `.github/workflows/deploy.yml` | Clean CI/deploy workflows install npm dependencies but do not install Playwright Chromium before building Mermaid diagrams. The local build succeeded with an already available browser, which does not establish a clean-runner build. | `openspec/specs/content/mermaid-diagrams/spec.md`, Requirement: Provision the diagram rendering runtime | `astro/README.md` instructs clean environments to run `npx playwright install chromium`; neither workflow runs that command before `npm run build`. | Install the required Chromium browser in the CI/deploy build path before the Astro build. |
| B-05 | B | Low | `README.md` | The active project README states the break-and-reindex policy and says legacy URLs are not guaranteed, but it does not explicitly tell operators that reindexing is expected after deployment. | `openspec/specs/deployment/astro-production-cutover/spec.md`, Requirement: Cutover policy permits URL changes and reindexing | Root README documents the policy in its Status section; the explicit post-deployment reindex expectation appears in the archived change proposal, not active operational guidance. | Add a brief post-deployment reindex expectation to the active deployment documentation. |

### 3.3 Content specifications

| Specification | Requirement | Result | Evidence |
|---|---|---|---|
| `content/post-images` | Thumbnail cards, image-free cards, Markdown body images, and author guidance | Pass | `/posts/` renders the `mycroft-part-1` thumbnail with alt text; a published card without a thumbnail (`git-gpg-signing-osx`) has no image element. The Mycroft article renders its root-relative public images with authored alt text. `astro/README.md` documents both thumbnail frontmatter and standard Markdown image syntax. |
| `content/rss-feed` | Published entries, canonical metadata, excerpt fallback, ordering, and build host | Pass | `/rss.xml` returns valid XML with 41 items, absolute post links, and descending publication dates. E2E verifies draft exclusion and item metadata; site-URL tests cover the default and overridden host. |
| `content/youtube-embeds` | Migrated MDX post route, matching playable video, draft/listing identity, and clean search excerpts | Pass | Existing MDX posts include `<YouTube id="cNN_tTXABUA" />` and other IDs. `/posts/how-a-cpu-works/` renders a registered `lite-youtube` control with `videoid="cNN_tTXABUA"` and a play control; `/posts/7-gamers-1-cpu-ultimate-virtualized-gaming-build-log/` renders its matching `LXOaCkbt4lI` ID. The generated page contains no raw legacy Liquid tag. Existing metadata/search fixtures cover clean excerpts and draft filtering. |
| `content/mermaid-diagrams` | Published Mermaid fences become static SVG and retain their label through processing | Pass | The `beyond-flock-the-quiet-standardization-of-mass-surveillance-(tldr)` page contains a rendered inline SVG and no Mermaid source fence. |
| `content/mermaid-diagrams` | Clean build environments install Chromium before the build | Not met; see B-04 | `astro/README.md` documents the install command, but neither active CI workflow installs Chromium before `npm run build`. |
| `content/github-markdown-alerts` | Supported alert variants, ordinary/unsupported blockquotes, and theme presentation | Not verifiable in live content | No published post contains `> [!` alert syntax. The existing regression fixture's body assertions cover supported variants and quote preservation, but its overall test fails at the metadata-description assertion recorded as A-02. No temporary page or fixture was added. |
| `content/emoji-shortcodes` | Recognized Markdown/MDX shortcodes and preservation of unknown/code-context text | Not verifiable in live content | No post contains an emoji shortcode. The existing regression fixtures pass for Markdown/MDX, unsupported aliases, and inline/fenced code preservation; no live article demonstrates the feature. |
| `content/ai-post-metadata-enforcement` | Required fields, warning-only behavior, and AI-flow-only automatic invocation | Pass | The validator tests pass complete, missing, empty, and absent-frontmatter cases. The CLI only auto-runs when `AI_ASSISTED_POST=1`, manual checks remain explicit, and metadata warnings do not set a failing exit status. |

### 3.4 Deployment specifications

| Specification | Requirement | Result | Evidence |
|---|---|---|---|
| `deployment/site-url` | Build-time `SITE_URL` override | Pass | `site.config.mjs` resolves the environment value and `astro.config.mjs` assigns it to Astro's `site`; `npm run test:site-url` verified override URLs in RSS and social metadata. |
| `deployment/site-url` | Production URL fallback | Pass | An unset or empty `SITE_URL` resolves to `https://www.codeholics.com`; the default build and URL checks pass. |
| `deployment/site-url` | Invalid URL rejection | Pass | `resolveSiteUrl` throws a clear absolute-URL error; the baseline test confirms an invalid override fails. |
| `deployment/astro-production-cutover` | Astro-only CI build and deploy output | Pass | `build.yml` installs Astro dependencies and runs `npm run build`; `deploy.yml` uses that workflow, builds Astro, and uploads `codeholics/astro/dist/*`. Neither workflow runs Pelican commands or consumes Pelican output. |
| `deployment/astro-production-cutover` | Migration parity gate before legacy removal | Pass for current automation; historical comparison unavailable | Both workflows run `npm run verify:legacy-content-parity` before building. The legacy `content/` root is now absent, so the current script reports that no comparisons are required; the archived cutover records the completed migration work. |
| `deployment/astro-production-cutover` | Break-and-reindex policy and post-deployment expectation | Partially met; see B-05 | The active root README says legacy URL compatibility is not guaranteed, but does not state that reindexing is expected after deployment. |
| `deployment/site-url` | Host selected by the current dev deploy | No workflow override configured; no nonconformance assigned | `deploy.yml` copies to `dev.codeholics.com` without setting `SITE_URL`, so that workflow uses the production fallback. The site-url spec verifies behavior when an override is supplied but does not require the workflow to select a specific host. Confirm whether production-canonical metadata on the dev host is intentional. |

### 3.5 Unspecified site behavior

The accepted spec set contains 15 capabilities. The following page behaviors are implemented in the site but have no dedicated accepted specification; the existing navigation and project specs cover only their respective entry points or project-specific controls.

| ID | Pass | Severity | Location (file / URL+viewport) | Issue | Source of truth | Evidence | Proposed follow-up |
|---|---|---|---|---|---|---|---|
| B-06 | B | Low | `/search.html` | Search results behavior, query parsing, result ranking, empty states, and accessibility are not specified; the navigation spec only covers opening and submitting the header search. | Accepted spec inventory (`openspec/specs/**/*.md`); `ui/site-navigation` covers the search control only | The site has a search page and client-side result behavior, but no accepted search capability exists. | Propose a search-page behavior and accessibility spec. |
| B-07 | B | Low | `/posts/`; `/page/[page]/` | Post listing order, page size, pagination links, boundary behavior, and empty states are not specified. | Accepted spec inventory (`openspec/specs/**/*.md`) | The post index and paginated routes exist; no accepted capability defines their behavior. | Propose a post-listing and pagination spec. |
| B-08 | B | Low | `/categories/`; `/categories/[category]/` | Post-category indexes, counts, detail listings, pagination, and empty states are not specified; project repository categories are a separate feature. | Accepted spec inventory (`openspec/specs/**/*.md`); `ui/github-projects` covers curated repository tabs | Category routes exist, but no accepted content-taxonomy spec covers them. | Propose a category navigation and listing spec. |
| B-09 | B | Low | `/tags/`; `/tags/[tag]/` | Tag indexes, counts, detail listings, pagination, and empty states are not specified. | Accepted spec inventory (`openspec/specs/**/*.md`) | Tag routes exist, but no accepted content-taxonomy spec covers them. | Propose a tag navigation and listing spec. |
| B-10 | B | Low | `/about/` | The About page's purpose, content, layout, and accessible behavior have no accepted specification. | Accepted spec inventory (`openspec/specs/**/*.md`) | The page exists, but no accepted About-page capability is present. | Propose an About-page content and presentation spec. |
| B-11 | B | Low | `/404` | No custom 404 page or 404-specific behavior is specified; the build output uses Astro's generated fallback. | Accepted spec inventory (`openspec/specs/**/*.md`) | `design.md` records that no custom 404 page exists; no accepted spec defines not-found messaging or navigation recovery. | Decide whether to retain the generated fallback or specify a custom 404 experience. |
| B-12 | B | High | `astro/src/content/posts/7-gamers-1-cpu-ultimate-virtualized-gaming-build-log.mdx`; `how-we-make-sd-cards.mdx`; `thirty-years-of-mac-ads-1984-2014.mdx` | Three published posts have no authored summary and contain only a YouTube embed, leaving no plain-text body from which to generate the required excerpt. Their description meta tags, Open Graph descriptions, and Twitter descriptions are empty. | `openspec/specs/frontend/social-sharing/spec.md`, Requirement: Describe published post shares | Production HTML for all three routes has an empty `meta[name="description"]`; each source post contains only front matter, a YouTube import, and the embed component. `getPostDescription()` therefore returns an empty string. | Add a concise authored summary for each embed-only post or define an explicit nonempty fallback that preserves the spec's plain-text description requirement. |

## Pass C: Design-system conformance

### 4.1 Color baseline

The local production preview was evaluated at 1280px in both themes. Every current `:root` / `html.dark` token matches the approved baseline in `DESIGN.md` §2. Computed body gradients, alpha surfaces, and hover states also match; no palette finding was raised.

| Token | Dark implemented / expected | Light implemented / expected | Result |
|---|---|---|---|
| `--bg` | `#0B1220 / #0B1220` | `#F8FAFC / #F8FAFC` | Match |
| `--bg-accent` | `#071021 / #071021` | `#E2E8F0 / #E2E8F0` | Match |
| `--page-text` | `#E2E8F0 / #E2E8F0` | `#1E293B / #1E293B` | Match |
| `--page-heading` | `#F8FAFC / #F8FAFC` | `#020617 / #020617` | Match |
| `--muted` | `#CBD5E1 / #CBD5E1` | `#475569 / #475569` | Match |
| `--muted-soft` | `#94A3B8 / #94A3B8` | `#64748B / #64748B` | Match |
| `--accent` | `#A78BFA / #A78BFA` | `#7C3AED / #7C3AED` | Match |
| `--accent-hover` | `#C4B5FD / #C4B5FD` | `#6D28D9 / #6D28D9` | Match |
| `--surface-bg` | `rgba(15,23,42,0.9) / same` | `rgba(255,255,255,0.82) / same` | Match |
| `--surface-border` | `rgba(148,163,184,0.18) / same` | `rgba(148,163,184,0.28) / same` | Match |
| `--surface-shadow` | `0 18px 40px rgba(2,6,23,0.35) / same` | `0 18px 40px rgba(148,163,184,0.18) / same` | Match |
| `--code-bg` | `rgba(2,6,23,0.94) / same` | `rgba(15,23,42,0.04) / same` | Match |
| `--code-text` | `#CBD5E1 / #CBD5E1` | `#312E81 / #312E81` | Match |
| `--hero-bg` | `linear-gradient(90deg, rgba(124,58,237,0.14), rgba(124,58,237,0.08), transparent) / same` | Same / same | Match |
| `--chip-bg` | `rgba(255,255,255,0.08) / same` | `rgba(255,255,255,0.9) / same` | Match |
| `--chip-hover-bg` | `rgba(255,255,255,0.14) / same` | `rgba(226,232,240,0.92) / same` | Match |
| `--header-bg` | `rgba(15,23,42,0.68) / same` | `rgba(255,255,255,0.78) / same` | Match |
| `--header-bg-gradient-end` | `rgba(15,23,42,0.16) / same` | `rgba(255,255,255,0.18) / same` | Match |
| `--header-border` | `rgba(255,255,255,0.08) / same` | `rgba(148,163,184,0.24) / same` | Match |
| `--header-brand` | `#F8FAFC / #F8FAFC` | `#0F172A / #0F172A` | Match |
| `--header-link` | `#E2E8F0 / #E2E8F0` | `#1E293B / #1E293B` | Match |
| `--header-icon` | `#E2E8F0 / #E2E8F0` | `#334155 / #334155` | Match |
| `--header-hover-text` | `#FFFFFF / #FFFFFF` | `#020617 / #020617` | Match |
| `--header-hover-bg` | `rgba(255,255,255,0.08) / same` | `rgba(15,23,42,0.06) / same` | Match |
| `--header-focus-ring` | `rgba(255,255,255,0.12) / same` | `rgba(124,58,237,0.22) / same` | Match |
| `--header-search-bg` | `rgba(15,23,42,0.98) / same` | `rgba(255,255,255,0.96) / same` | Match |
| `--header-search-text` | `#F8FAFC / #F8FAFC` | `#0F172A / #0F172A` | Match |
| `--header-search-placeholder` | `#CBD5E1 / #CBD5E1` | `#64748B / #64748B` | Match |
| `--header-search-border` | `rgba(255,255,255,0.12) / same` | `rgba(148,163,184,0.36) / same` | Match |
| `--header-mobile-panel-bg` | `rgba(15,23,42,0.92) / same` | `rgba(255,255,255,0.96) / same` | Match |
| `--header-elev` | `0 6px 18px rgba(2,6,23,0.6) / same` | `0 6px 18px rgba(2,6,23,0.6) / same` | Match |
| `--alert-note` | `#60A5FA / #60A5FA` | `#2563EB / #2563EB` | Match |
| `--alert-tip` | `#4ADE80 / #4ADE80` | `#15803D / #15803D` | Match |
| `--alert-important` | `#C084FC / #C084FC` | `#7E22CE / #7E22CE` | Match |
| `--alert-warning` | `#FBBF24 / #FBBF24` | `#B45309 / #B45309` | Match |
| `--alert-caution` | `#F87171 / #F87171` | `#B91C1C / #B91C1C` | Match |

| Rendered role | Dark computed / expected | Light computed / expected | Result |
|---|---|---|---|
| Page gradient | `rgb(11,18,32) -> rgb(7,16,33)` / `#0B1220 -> #071021` | `rgb(248,250,252) -> rgb(226,232,240)` / `#F8FAFC -> #E2E8F0` | Match |
| Header gradient | `rgba(15,23,42,0.68) -> rgba(15,23,42,0.16)` / same | `rgba(255,255,255,0.78) -> rgba(255,255,255,0.18)` / same | Match |
| Primary action at rest | `#F8FAFC` background, `#0B1220` text / same | `#020617` background, `#F8FAFC` text / same | Match |
| Primary action hover | `#A78BFA` background, `#FFFFFF` text / same | `#7C3AED` background, `#FFFFFF` text / same | Match |
| Tag hover | `rgba(255,255,255,0.14)` / same | `rgba(226,232,240,0.92)` / same | Match |
| Header link hover | `rgba(255,255,255,0.08)` and `#FFFFFF` / same | `rgba(15,23,42,0.06)` and `#020617` / same | Match |

Evidence: computed root tokens and body gradients match in light and dark; primary-action hover measured `rgb(124,58,237)` / white in light and `rgb(167,139,250)` / white in dark. Tag and header-link hover computed values also match their tokens. CSS alpha values remain intact. The Tailwind config's legacy `primary: #60A5FA` and `bg: #0F1720` are not the rendered page or action tokens; `global.css` variables control those surfaces, as DESIGN.md §2 documents.

### 4.2 Typography

Computed styles were collected from the preview at 375×812 and 1280×800. The article prose width was measured at desktop by dividing the rendered text column by the computed font's `0` glyph width.

| Role / template | DESIGN.md target | Computed style | Result |
|---|---|---|---|
| UI and editorial family | IBM Plex Sans | `Inter, ui-sans-serif, system-ui, ...` on body, headings, links, and controls | Deviation C-01 |
| Monospace family | JetBrains Mono | `ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, ...` in code; `ui-monospace, monospace` for project labels | Deviation C-01 |
| Home hero title | 36px mobile; 56px desktop | 36px at 375px and 1280px | Mobile matches; desktop is undersized |
| Home section heading | 26px mobile; 32px desktop | 24px at 375px and 1280px | Undersized |
| Home section subheading | 21px mobile | 18px at 375px | Undersized |
| Posts index title | 32px mobile; 44px desktop | 24px at 1280px (`text-2xl`, no responsive size) | Undersized |
| Projects hero title | 44px page title or 56px display hero | 60px at 1280px; clamp minimum 36px | Desktop exceeds either target |
| Projects section headings | 26px mobile; 32px desktop | 16px at 1280px | Undersized |
| Article title | 32px mobile; 42px desktop | 30px at both 375px and 1280px | Undersized |
| Article body | 17px mobile; 18px desktop | 16px at 1280px | Undersized |
| Code | 14px, 1.65 line height | 14px, 24px line height, generic monospace | Size matches; line height is about 1.71 and family differs |
| Article prose width | 65–75ch | 69.5ch at 1280px | Match |

| ID | Pass | Severity | Location (file / URL+viewport) | Issue | Source of truth | Evidence | Proposed follow-up |
|---|---|---|---|---|---|---|---|
| C-01 | C | Medium | `astro/src/styles/global.css:46`; `astro/src/layouts/Layout.astro:67-69`; `astro/src/pages/posts/[slug].astro:25` | UI/editorial typography uses Inter, and code/technical labels use generic system monospace, rather than IBM Plex Sans and JetBrains Mono. | `DESIGN.md` §3 Font Families | Computed body and heading family is `Inter, ui-sans-serif, system-ui, ...`; code block family is `ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, ...`. | Apply the specified font families consistently. |
| C-02 | C | Medium | `/`, `/posts/`, `/projects/`, `/posts/mycroft-part-1/` at 375×812 and 1280×800 | Several display and heading sizes do not follow the documented type scale or responsive sizes; the affected elements and measured values are listed above. Prose width is within range. | `DESIGN.md` §§3 and 8 | Computed measurements include home H1 36px at both widths (56px target at desktop), posts H1 24px (44px desktop target), project section H2 16px (32px target), article H1 30px (42px desktop target), and article body 16px (18px target). The article column is 69.5ch. | Use the documented semantic scale with responsive sizing, then verify every template. |

### 4.3 Components, spacing, and elevation

| Component / rule | Result | Evidence |
|---|---|---|
| Buttons and action links | Deviates; C-03/C-04 | Home actions measure 42px high, 16px/400, with 6px corners. The page-search input is 50px high; the desktop header search submit is 40px. Projects' "View all on GitHub" link is 34px high. At 375px and 768px, the mobile menu button is 40px, the theme button is 36px, and mobile search controls are 41px/40px. |
| Cards and reading surfaces | Deviates; C-04/C-08 | Post cards use 24px padding and the correct surface/border/shadow, but 8px corners rather than 12px. The project repository cards are transparent at rest with the specified 5% heading-color hover mix and accent border; their corners are 6px and padding is 12px. The home illustration panel uses 6px corners and 16px padding. The article frame is also a card; see 4.4. |
| GitHub repository cards | Mostly conforms | Cards show repository name, description, stars, forks, language, and link; the name is strongest. License, updated date, and topic tags are not present in the component data model, so their absence is not assigned as a presentation failure. |
| Tags | Deviates; C-01/C-04 | Home tags use 14px Inter and `rounded-full`; DESIGN.md specifies 12px JetBrains Mono and a 6px radius. Pills are permitted for tags, but the specified tag treatment is not used. |
| Inputs | Deviates; C-03/C-04 | The page-search input measures 50px high and uses 6px corners with `16px 12px` padding. The desktop header search input measures 42px high with 6px corners and `12px 8px` padding. The mobile drawer search input is 41px high at 375px and 768px. |
| Navigation | Partly conforms; C-03/C-06 | The app bar measures 65px against the 64px recommendation; desktop links share a consistent label style and the translucent gradient/blur match. Desktop and mobile drawer links are 40px high and no active item is marked or visually distinguished. The mobile menu control is 40px; social icon controls are 36px. |
| Code blocks | Mostly conforms; C-01/C-04 | The code block measures 14px with horizontal scrolling, themed code colors, a border, and copy control. It uses generic system monospace, a 12px radius (10px specified), and 24px line height (about 1.71 rather than 1.65). |
| Callouts | Conforms by implementation; live-page coverage unavailable | `global.css` uses a restrained tint, matching alert-tone border, icon, and heading. The alert fixture's body-render assertions pass, but no published post contains an alert (see task 1.3). |
| Spacing and container | Deviates; C-05 | Main content padding is fixed at 16px at all breakpoints; the header container is fixed at 24px. DESIGN.md recommends 16px mobile, 24px tablet, 32px desktop, and 40px large. |
| Elevation | Conforms | Surface shadows and header elevation match the documented values; repository cards have no resting shadow, as specified. |

| ID | Pass | Severity | Location (file / URL+viewport) | Issue | Source of truth | Evidence | Proposed follow-up |
|---|---|---|---|---|---|---|---|
| C-03 | C | Medium | `/`, `/search.html`, `/projects/`; `astro/src/components/Header.appbar.astro` | Several interactive targets are below 44px: home actions 42px; desktop header search input 42px and submit 40px; theme toggle 36px; desktop and mobile nav links 40px; mobile menu button 40px; mobile drawer search input 41px and submit 40px; mobile social icons 36px; project action link 34px; curated tabs 42px. | `DESIGN.md` §§4 Buttons/Inputs and 8 Touch Targets | At 375px and 768px, measurements are identical; header-control gaps are 12px, drawer-link and social-control gaps are 8px. The mobile drawer opens and closes, mobile search for “mycroft” returns two results, and theme selection persists. Home actions also use 16px/400 instead of the 14px/600 button style. | Bring interactive controls to the documented minimum target and button typography while preserving at least 8px spacing. |
| C-04 | C | Medium | `astro/src/components/PostCard.astro`; `astro/src/components/GithubProjectCard.astro`; `astro/src/pages/index.astro`; `astro/src/pages/search.html.astro`; `astro/src/styles/global.css` | Component corners and some compact spacing differ from the documented radius scale: buttons/inputs 6px vs 8px, post cards 8px vs 12px, repository cards 6px vs 12px, tags fully rounded vs 6px, and code blocks 12px vs 10px. | `DESIGN.md` §§4 and 5 Border Radius Scale | Computed styles: post card 8px/24px padding; repo card 6px/12px; search input and CTA 6px; code block 12px. | Align component radii with the semantic scale; retain intentional compactness only if documented. |
| C-05 | C | Medium | `astro/src/layouts/Layout.astro`; `astro/src/components/Header.appbar.astro` | Horizontal container padding does not scale with the documented breakpoint recommendations: main is fixed at 16px and the header at 24px, leaving desktop and large screens below the 32px/40px guidance. | `DESIGN.md` §5 Main Container | Layout classes are `px-4` and `px-6` without responsive padding variants; computed mobile main padding is 16px and desktop header padding is 24px. | Apply the documented responsive container padding. |
| C-06 | C | Low | `/projects/`; `astro/src/components/Header.appbar.astro` | The primary navigation has no active-location indicator or `aria-current` state; the Projects link appears like the other links on its own page. | `DESIGN.md` §4 Navigation | Navigation items are rendered from a static label/href list without active-route state or an active style. | Add a restrained active-location treatment and current-page semantics. |

### 4.4 AI Slop Test

| Page | Result | Concrete element and DESIGN.md rule |
|---|---|---|
| Home `/` | One low-severity concern; C-07 | The desktop hero's decorative panel is titled "Sleek & modern" and says "Readable posts, elegant layout, Tailwind-powered utilities." The copy describes the site's styling rather than helping a reader; it resembles generic landing-page filler. The rest of the page uses real posts, tags, and categories and does not rely on repeated metric cards or a centered gradient headline. |
| Projects `/projects/` | Pass | The hero art is paired with project-specific copy, followed by actual repository names, descriptions, and metadata. No repeated generic feature-card grid or decorative metrics were observed in the inspected structure. |
| Posts `/posts/` | Pass | The cards represent actual articles with titles, dates, and summaries; the two-column listing is content-driven rather than a set of interchangeable feature cards. |
| Post `/posts/mycroft-part-1/` | Deviation; C-08 | The article header and full body are enclosed by one bordered, shadowed, rounded `.theme-reading-surface`. DESIGN.md §11 says to avoid surrounding the article header with a card. |

| ID | Pass | Severity | Location (file / URL+viewport) | Issue | Source of truth | Evidence | Proposed follow-up |
|---|---|---|---|---|---|---|---|
| C-07 | C | Low | `astro/src/pages/index.astro:33-40`; `/` at 1280×800 | The hero's illustrative panel uses generic style-promotion copy instead of useful site content, an avoidable generic landing-page pattern. | `DESIGN.md` §7 The AI Slop Test | Rendered panel is titled "Sleek & modern" and describes "Tailwind-powered utilities"; it is a separate decorative card beside the hero copy. | Replace with useful site information or remove the panel. |
| C-08 | C | Medium | `astro/src/pages/posts/[slug].astro:23-25`; `/posts/mycroft-part-1/` at 1280×800 | The article header is surrounded by a rounded surface card with a border and shadow, contrary to the article-header guidance. | `DESIGN.md` §11 Article Header | Computed article frame is 768px wide with a surface fill, 1px border, 8px radius, 32px padding, and the surface shadow; it contains the title and all article content. | Let the article hierarchy establish itself without a card around the header. |

### 4.5 Motion

The shared transition declarations use 160ms, while `DESIGN.md` §10 sets 150ms as the default. More importantly, theme-specific colors animate during theme changes despite the instant-switch requirement. In a reduced-motion browser context, the primary action still interpolated from light `rgb(2,6,23)` to dark `rgb(248,250,252)`; after 70ms its sampled background was `rgb(150,152,160)`.

The `prefers-reduced-motion: reduce` media query is present only for the repository card, where it disables that card's transition. With reduced motion active, the theme toggle, header links, primary action, chips, and secondary action still report 160ms transitions. The `.reduced-motion` utility in `global.css` is not wired to the media preference. The hamburger also transitions transform and opacity without a reduced-motion override.

| ID | Pass | Severity | Location (file / URL+viewport) | Issue | Source of truth | Evidence | Proposed follow-up |
|---|---|---|---|---|---|---|---|
| C-09 | C | Medium | `astro/src/styles/global.css:116-129,204-272,568`; `astro/src/components/GithubProjectCard.astro:91,200-203` | Theme-dependent colors animate for 160ms instead of switching instantly, and most shared transitions remain active when `prefers-reduced-motion: reduce` is set. Only the repository card disables its transition. | `DESIGN.md` §10 Motion & Interaction | Browser reports 160ms transitions for the theme toggle, navigation links, primary action, chips, and secondary action under reduced motion; the primary action's background was an intermediate color 70ms after a theme change. | Make theme switching instant and consistently honor reduced-motion preferences; align ordinary interaction durations to the documented scale. |

### 4.6 Theme behavior

| Requirement | Result | Evidence |
|---|---|---|
| System default and live OS updates | Pass | Missing/invalid stored mode falls back to `auto`; the preview followed emulated light and dark OS preferences live while `data-theme-mode="auto"`. |
| Explicit choice persists | Pass | The selected mode is stored in `localStorage`; the existing navbar E2E test selects Dark, reloads, and verifies the stored/resolved Dark state. |
| No flash of the wrong theme | Pass | `Layout.astro` has a blocking head script that resolves and applies the stored/system theme before first paint. |
| `color-scheme` | Pass | Computed `color-scheme` is `light` in light mode and `dark` in dark mode. |
| `theme-color` metadata | Fail; C-13 | No `meta[name="theme-color"]` exists in the shared layout or rendered page. |
| Readability without JavaScript | Pass for color/content fallback | CSS defaults to the light palette and applies body background and text colors without JavaScript. The theme toggle and mobile-menu interaction themselves require JavaScript and are covered separately. |
| Toggle accessible name and state | Fail; C-11 | Accessible name remains "Toggle theme"; only the `title` changes to "Theme: auto/light/dark", and no pressed/current-mode state is exposed to assistive technology. |
| Mode cycle | Fail; C-12 | Current order is Auto → Dark → Light → Auto, while DESIGN.md specifies System → Light → Dark → System. |
| 44px target | Fail; C-03 | The theme button measures 36×36px at 375px and 1280px. |
| Visible focus ring in both themes | Pass visually; token deviation C-14 | Keyboard focus shows a 3px violet outline plus a 2px current-color ring: white in dark mode and `#020617` in light mode. The declared `--header-focus-ring` token is not used by the header focus styles. |

| ID | Pass | Severity | Location (file / URL+viewport) | Issue | Source of truth | Evidence | Proposed follow-up |
|---|---|---|---|---|---|---|---|
| C-11 | C | Medium | `astro/src/components/Header.appbar.astro:95,190` | The theme toggle's accessible name is static and does not state the current mode or the next action; the dynamic title does not replace the accessible name. | `DESIGN.md` §2 Theme Toggle | The rendered button has `aria-label="Toggle theme"`, `title="Theme: auto"`, and no `aria-pressed`; its accessible name remains "Toggle theme" in all modes. | Expose the current mode and next action through the accessible name and state. |
| C-12 | C | Low | `astro/src/components/Header.appbar.astro:147-151`; `astro/tests/navbar.spec.ts:93-130` | The toggle cycles Auto → Dark → Light → Auto instead of the specified System → Light → Dark → System order. | `DESIGN.md` §2 Theme Toggle | The implementation sequence and passing E2E assertions confirm the current, opposite order. | Align the cycle with the documented order or offer the three modes explicitly. |
| C-13 | C | Low | `astro/src/layouts/Layout.astro` | Shared page metadata omits both light- and dark-scheme `theme-color` tags. | `DESIGN.md` §2 Theme Modes | The rendered page has zero `meta[name="theme-color"]` elements; no such tag is present in `Layout.astro`. | Add scheme-specific theme-color metadata using the page background tokens. |
| C-14 | C | Low | `astro/src/styles/global.css:30,84`; `astro/src/components/Header.appbar.astro:95` | The declared `--header-focus-ring` colors are unused; header controls instead receive a current-color Tailwind ring plus the global violet outline. Focus remains visible in both themes. | `DESIGN.md` §2 Alerts and Focus | `rg` finds only the two token declarations; computed keyboard focus is 2px white in dark mode and 2px `#020617` in light mode, alongside the 3px violet outline. | Either wire the documented token into header focus styling or update the design-system statement to reflect the intentional treatment. |

## Pass D: Responsive behavior

### 5.1 Template × viewport coverage

Full-page screenshots are saved in the session files subfolder `review-site-responsive/` (88 PNGs). Every requested route returned HTTP 200; the browser batch verified CSS viewport dimensions at 375×812, 768×1024, 1280×800, and 1920×1080 for both light and dark themes. Filenames use `<template>-<width>x<height>-<theme>.png`.

| Template | Route | 375×812 | 768×1024 | 1280×800 | 1920×1080 |
|---|---|---|---|---|---|
| Home | `/` | Light + dark | Light + dark | Light + dark | Light + dark |
| Posts index | `/posts/` | Light + dark | Light + dark | Light + dark | Light + dark |
| Paginated index | `/page/2/` | Light + dark | Light + dark | Light + dark | Light + dark |
| Post | `/posts/mycroft-part-1/` | Light + dark | Light + dark | Light + dark | Light + dark |
| Categories | `/categories/` | Light + dark | Light + dark | Light + dark | Light + dark |
| Category detail | `/categories/Hardware/` | Light + dark | Light + dark | Light + dark | Light + dark |
| Tags | `/tags/` | Light + dark | Light + dark | Light + dark | Light + dark |
| Tag detail | `/tags/coding/` | Light + dark | Light + dark | Light + dark | Light + dark |
| Projects | `/projects/` | Light + dark | Light + dark | Light + dark | Light + dark |
| About | `/about/` | Light + dark | Light + dark | Light + dark | Light + dark |
| Search | `/search.html` | Light + dark | Light + dark | Light + dark | Light + dark |

### 5.2 Mobile overflow at 375px

Checked the 11 templates plus four representative posts at 375×812. All 15 routes returned HTTP 200; document and body widths measured 365–375 CSS px, never exceeding the 375px viewport. No page-level horizontal scrolling, broken grid, or clipped title was found.

| Content checked | URL (375×812) | Element and result |
|---|---|---|
| Long title | `/posts/the-death-of-the-self-taught-hacker/` | The H1 fits its 268px content column and wraps; its right edge is at x=317px. No clipping. |
| Long code lines | `/posts/mycroft-part-1/` | `<pre>` blocks are 267px wide with `overflow-x: auto`; the longest measured block is 1,067px of scrollable content. Scrolling stays inside the code block and does not widen the page. |
| Inline path in prose | `/posts/mycroft-part-1/` | The list item containing `~/.config/mycroft/mycroft.conf` has a 248px scroll width against a 242px box, a 6px protrusion beyond its list-item/prose width. It remains visible within the article surface and viewport; no clipping or page overflow. |
| Narrow technical table | `/posts/mycroft-part-1/` | The two-column hardware table is 268px wide and fits the prose column. |
| Wide table with images | `/posts/home-network-overhaul/` | The four-column network-icon table is 268px wide and fits the prose column. |
| Four-column table | `/posts/beyond-flock-the-quiet-standardization-of-mass-surveillance-(tldr)/` | The table is 287px versus a 268px prose column, extending 19px into the article's right padding; its right edge remains inside the article surface (x=336 versus x=349). This is visible and does not create viewport overflow. |
| Mermaid diagram | `/posts/beyond-flock-the-quiet-standardization-of-mass-surveillance-(tldr)/` | The chart renders as an SVG 268px wide and fits the prose column. |
| Embed | `/posts/clamav-clamtk-anti-virus-for-ubuntu/` | No iframe or embedded media exists in the sample; the YouTube URL is a plain external link, so there is no embedded frame to overflow. |
| Horizontally scrollable controls | `/projects/` | `.curated-tabs` measures 600px of content in a 345px viewport and uses `overflow-x: auto`; it scrolls internally without widening the page. |

### 5.3 Mobile navigation, search, theme, and touch targets

The mobile drawer is available at both 375px and 768px. It opens and closes from the menu button; its search form submits `mycroft` to `/search.html?q=mycroft` and returns two results at both widths. The theme toggle changes Dark to Light and stores the explicit choice; the drawer remains open when the theme changes. The page-level search form also fits: its input/button are 49px/48px high at 375px and 49px/48px at 768px.

| Target at 375px and 768px | Measured size | Spacing / result |
|---|---:|---|
| Header theme toggle | 36×36px | 12px from the menu button |
| Mobile menu button | 40×40px | 12px from the theme toggle |
| Drawer navigation links | 40px high | 8px vertical gap |
| Drawer social icons | 36×36px | 8px gap |
| Drawer search input | 41px high | 8px from submit button |
| Drawer search submit | 77×40px | Search succeeds at both viewports |
| Page-level search input | 49px high | 12px from submit button |
| Page-level search submit | 48px high | Search form remains within the viewport |

The drawer spacing meets the documented 8px minimum, but all 36px and 40–41px controls listed above are undersized relative to the 44×44px target and are included in C-03.

## Pass E: Accessibility and keyboard

### 6.1 Automated WCAG scan

Ran axe-core 4.10.3 on all 11 page templates in light and dark modes, filtering to WCAG 2.0 A/AA, WCAG 2.1 A/AA, and WCAG 2.2 A/AA tags. All routes returned HTTP 200. No WCAG-tagged violations were reported in any of the 22 scans.

| Template | Route | Light violations | Dark violations |
|---|---|---:|---:|
| Home | `/` | 0 | 0 |
| Posts index | `/posts/` | 0 | 0 |
| Paginated index | `/page/2/` | 0 | 0 |
| Post | `/posts/mycroft-part-1/` | 0 | 0 |
| Categories | `/categories/` | 0 | 0 |
| Category detail | `/categories/Hardware/` | 0 | 0 |
| Tags | `/tags/` | 0 | 0 |
| Tag detail | `/tags/coding/` | 0 | 0 |
| Projects | `/projects/` | 0 | 0 |
| About | `/about/` | 0 | 0 |
| Search | `/search.html` | 0 | 0 |

Each scan returned three incomplete WCAG checks, which axe does not count as violations:

| Rule ID | Node(s) / template coverage | Incomplete result |
|---|---|---|
| `aria-prohibited-attr` (WCAG 4.1.2) | `.gap-1`, `.featured-projects-grid`, and repository `.project-metric[aria-label]`; present across all 22 scans | Axe asks for review of `aria-label` on generic elements without an explicit role. The metric labels and social group are included in the semantic review at 6.3. |
| `aria-valid-attr-value` (WCAG 4.1.2) | `#theme-icon`; present across all 22 scans | `aria-hidden` is serialized as an empty value. This is reviewed with the decorative icon semantics at 6.3. |
| `color-contrast` (WCAG 1.4.3) | 513 distinct nodes across all 22 scans, including `.theme-appbar-brand`, nav links, headings, and form controls | Axe cannot calculate foreground/background contrast where the page uses gradients. Computed contrast samples for key shared and article surfaces are documented in Pass B; this automated result is incomplete, not a pass. |

### 6.2 Keyboard-only walkthrough

| Control / behavior | Result | Evidence |
|---|---|---|
| Skip link | Fail; E-01 | No skip link exists in `src/`; the first Tab focuses the `# Codeholics` brand link. The page has a main landmark, but keyboard users have no direct focusable shortcut past the repeated header. |
| Header navigation | Pass | Desktop Tab order is brand, `~/`, Coding, SysAdmin, InfoSec, OS, Hardware, Projects, Reviews, X, Facebook, Github, RSS, Search, then theme toggle. Focus-visible is true on tested links and controls. |
| Desktop search | Pass | Enter on Search opens the form and focuses `desktop-search-input`; Escape closes it and restores focus to `search-btn`. |
| Theme toggle | Pass for keyboard operation | Enter on the focused toggle changes Dark to Light, persists `light`, and leaves focus on the toggle. Its static accessible name is tracked separately in C-11. |
| Mobile menu | Pass | At 375px, Enter opens the menu and focuses its first link; Escape closes it, sets `aria-expanded="false"`, and restores focus to `nav-toggle`. |
| Mobile search | Pass | Tab reaches `mobile-search-input` after the drawer links; typing “mycroft” and pressing Enter navigates to `/search.html?q=mycroft` and returns two results. |
| Pagination | Pass | Keyboard traversal reaches the `/page/3` Older link on page 2 after 27 Tab presses; it has visible `:focus-visible`. |
| Project cards | Pass | Keyboard traversal reaches the `Codeholics/PAC` repository link after 17 Tab presses; it has visible `:focus-visible`. |

| ID | Pass | Severity | Location (file / URL+viewport) | Issue | Source of truth | Evidence | Proposed follow-up |
|---|---|---|---|---|---|---|---|
| E-01 | E | Medium | `astro/src/layouts/Layout.astro`; `/` at 1280×800 | There is no focusable skip-to-content link before the repeated header. A main landmark is present, but keyboard-only users must tab through the brand, navigation, social links, search, and theme controls to reach page content. | WCAG 2.4.1 Bypass Blocks; repository accessibility guidance | No skip-link markup or styles exist under `astro/src`; the first Tab focuses the brand link and all 15 header controls precede the first focusable main-content item. | Add a visible-on-focus “Skip to content” link targeting the main landmark. |

### 6.3 Semantics by template

The fetched Web Interface Guidelines require semantic HTML, hierarchical headings, named links, descriptive page titles, and alternative text for meaningful images. Browser inspection found `lang="en"` and exactly one H1 on every template; every rendered link had an accessible name. No image lacked an `alt` attribute. The project hero art uses an empty alt inside an `aria-hidden` container, which is appropriate for decorative imagery.

| Template | Route | Page `<title>` | Landmarks and heading hierarchy | Images |
|---|---|---|---|---|
| Home | `/` | `Codeholics` | Has two nested `main` landmarks; heading-level jumps H1→H3 and H2→H4. | 11 images, all with alt text. |
| Posts index | `/posts/` | `Codeholics` (generic) | One main landmark; H1 followed by H2 post-card headings. | 7 images, all with alt text. |
| Paginated index | `/page/2/` | `Codeholics` (generic) | One main landmark; H1, H2 post-card headings, and pagination navigation. | No images. |
| Post | `/posts/mycroft-part-1/` | `Mycroft Personal Assistant Setup Part 1` | One main landmark; article H1 is followed by H3 “Intro.” | 3 images, all with alt text. |
| Categories | `/categories/` | `Codeholics` (generic) | One main landmark; page H1 and category list. | No images. |
| Category detail | `/categories/Hardware/` | `Codeholics` (generic) | One main landmark; H1 followed by H2 post-card headings. | 2 images, all with alt text. |
| Tags | `/tags/` | `Codeholics` (generic) | One main landmark; page H1 and tag list. | No images. |
| Tag detail | `/tags/coding/` | `Codeholics` (generic) | One main landmark; H1 followed by H2 post-card headings. | 4 images, all with alt text. |
| Projects | `/projects/` | `Featured Projects \| Codeholics` | One main landmark; H1, H2 sections, and H3 repository cards. | One decorative image with `alt=""`. |
| About | `/about/` | `Codeholics` (generic) | One main landmark; page H1. | No images. |
| Search | `/search.html` | `Codeholics` (generic) | One main landmark; H1 search heading and H2 result headings. | No images. |

| ID | Pass | Severity | Location (file / URL+viewport) | Issue | Source of truth | Evidence | Proposed follow-up |
|---|---|---|---|---|---|---|---|
| E-02 | E | Medium | `astro/src/pages/index.astro:47`; `/` | The homepage introduces a second `<main>` inside the layout's existing `<main>`, creating nested main landmarks. | Web Interface Guidelines: semantic HTML; HTML main landmark semantics | DOM contains two `main` elements on `/`; all other reviewed templates contain one. | Remove the nested landmark and retain a single page-level `<main>`. |
| E-03 | E | Medium | `astro/src/pages/index.astro:37,72,81`; `astro/src/content/posts/mycroft-part-1.md:12` | Heading levels skip: home uses H3 “Sleek & modern” under H1 and H4 sidebar headings after H2; the post body begins with H3 “Intro” after its H1. | Web Interface Guidelines: hierarchical headings | The rendered hierarchy has two level jumps on the home page and one on the post template; other reviewed templates have no level jumps. | Use sequential heading levels for meaningful sections, or use non-heading text for decorative labels. |
| E-04 | E | High | `astro/src/layouts/Layout.astro:21`; `/posts/`, `/page/2/`, `/categories/`, `/categories/Hardware/`, `/tags/`, `/tags/coding/`, `/about/`, `/search.html` | Eight templates inherit the generic `<title>Codeholics</title>`, which does not identify the page's purpose or current category/tag. | WCAG 2.4.2 Page Titled; Web Interface Guidelines: accessibility | Of 228 active site HTML documents, 186 use the generic title and there are only 43 distinct title values. | Pass a descriptive title from each template, including category/tag and pagination context. |
| E-05 | E | Low | `astro/src/components/Header.appbar.astro:42,118`; `astro/src/components/GithubProjects.astro:21`; `astro/src/components/GithubProjectCard.astro:56,62` | `aria-label` is attached to generic `div`/`span` elements for social groups, the repository grid, and star/fork metrics; those names are not reliably exposed for generic roles. | Web Interface Guidelines: use semantic HTML before ARIA; axe `aria-prohibited-attr` (incomplete) | The issue appears in the DOM on every template for social groups and on Projects for the grid/metrics. Individual social links remain named, but project metric labels may be announced as bare numbers. | Use a named semantic group/section where needed and provide star/fork meaning as supported text or semantics. |
| E-06 | E | Low | `astro/src/components/Header.appbar.astro:97,104` | Decorative theme and hamburger SVGs use a bare `aria-hidden` attribute, serialized as `aria-hidden=""`, which is not an explicit valid ARIA token. | Web Interface Guidelines: decorative icons need `aria-hidden="true"`; axe `aria-valid-attr-value` (incomplete) | `#theme-icon` and `#hamburger` have empty `aria-hidden` values in every template. | Set `aria-hidden="true"` on both decorative SVGs. |

## Pass F: Astro architecture and JavaScript budget

### 7.1 Inline-script budget

Measured the built HTML after production build. These byte counts are the emitted inline script bodies in `dist` (not compressed transfer sizes).

| Source | Purpose | Emitted bytes | HTML/CSS alternative | Behavior with JavaScript disabled |
|---|---|---:|---|---|
| `astro/src/layouts/Layout.astro` (head script) | Applies the saved/system theme before rendering to avoid a theme flash. | 397 | CSS can follow the system preference but cannot read the saved explicit choice; persistence and early application require JS. | Content remains readable with the default light styling; saved theme and system-dark selection are not applied. |
| `astro/src/components/Header.appbar.astro` | Theme cycling, desktop search disclosure, mobile menu, Escape/focus handling, and system-theme updates. | 3,566 | Native disclosure markup could cover a basic menu/search disclosure; saved theme behavior and the current focus/keyboard behavior require JS. | Desktop links remain available. At 375px the mobile panel stays hidden; search and theme controls do not operate. |
| `astro/src/layouts/Layout.astro` (body script) | Normalizes a narrow inline-code serialization case and adds clipboard buttons to code blocks. | 1,577 | Copy requires JS; the deterministic inline-code normalization could instead be handled during rendering/build. | Article text and code remain visible; copy buttons are absent and normalization is not applied. |
| `astro/src/components/CuratedProjects.astro` | Implements the curated-project tab selection and arrow/Home/End keyboard behavior. | 654 | A non-tab disclosure or rendering all category sections would provide a no-JS fallback, but the current tab interaction needs JS. | One of four panels is visible; the other three stay hidden and the tab buttons are inert. |
| `astro/src/pages/search.html.astro` | Embeds the search index and renders client-side full-text results. | 114,679 | A static client-side full-text search needs JS; CSS/HTML alone cannot filter the index. | `/search.html?q=mycroft` returns HTTP 200 but has no status message and zero rendered results. |

With scripts enabled, all five functions operate as designed. The project remains readable without JS, but the mobile menu, search, theme selection, copy buttons, and non-selected curated categories are unavailable. The search payload is confined to the search page. The inspected scripts serve real interactive or early-theme behavior; no complete script was judged unjustified. The code-normalization portion is build-time-capable, but it shares the clipboard script and did not warrant a separate finding.

### 7.2 Images

No `astro:assets` import or `<Image />` component is used in `astro/src`. `PostCard.astro` uses a plain `<img>` with `loading="lazy"` but no intrinsic dimensions; article Markdown images also render as plain images. The Projects hero uses a plain image with explicit `width="1983"` and `height="793"` and `fetchpriority="high"`. The production output contains 163 `<img>` instances from 37 distinct `src` values: 162 instances lack both width and height, 131 explicitly use lazy loading, and 32 have no `loading` attribute. The 36 files in `public/images` total 6.96 MiB: 29 WebP, 6 JPEG, and 1 PNG.

| ID | Pass | Severity | Location (file / URL+viewport) | Issue | Source of truth | Evidence | Proposed follow-up |
|---|---|---|---|---|---|---|---|
| F-01 | F | Low | `astro/src/components/PostCard.astro`; Markdown-rendered post images | Almost all rendered images lack intrinsic dimensions, and some content images have no explicit lazy-loading behavior. This can cause layout shifts and unnecessary offscreen image loading. | Astro Development Instructions: Image Optimization | In `dist`, 162/163 image instances lack width/height and 32/163 have no `loading` attribute. No `astro:assets` usage exists; `public/images` contains 36 files / 6.96 MiB. | Supply intrinsic dimensions and lazy-load below-fold content images; use Astro image optimization for eligible source assets without forcing hero imagery to lazy-load. |

### 7.3 Structure and unused assets

| Candidate | Review result | Usage/evidence check |
|---|---|---|
| Repeated post-list markup | The paginated, category, and tag templates reuse `Layout` and `PostCard`, but repeat the heading, mapped-card section, and pagination shell across five route files. A shared listing/pagination component could reduce drift while retaining route-specific labels and URLs. | Compared `src/pages/page/[page].astro`, `src/pages/categories/[category]/index.astro`, `src/pages/categories/[category]/page/[page].astro`, `src/pages/tags/[tag]/index.astro`, and `src/pages/tags/[tag]/page/[page].astro`. Finding F-02. |
| `Header.appbar.astro` size | 346 lines / 13,546 bytes; it owns the site header and its menu, search, and theme behaviors. Size alone is not a defect; no unrelated header responsibility was identified. | Source length and 7.1 script-purpose review. No separate finding. |
| `global.css` size | 588 lines / 15,173 bytes; the stylesheet centralizes global tokens and site-wide rules. No measured duplication or specific maintenance failure was identified from size alone. | Source length and review of its global token/rule organization. No separate finding. |
| `public/theme/` | Unreferenced by active Astro source, but copied into production output. It includes legacy Bootstrap Icons, Sass, and JavaScript assets. | No `/theme/` asset references in `astro/src`; `dist/theme/` contains 2,239 files / 3.92 MiB. Finding F-03. |
| `Welcome.astro` and `src/assets/astro.svg` | The component imports the Astro logo, but no active page imports or renders `Welcome.astro`; neither the component nor logo appears in generated site HTML. | Repository search found only the component's internal logo import and no active `Welcome` use. Finding F-03. |
| `src/content.config.ts` schema imports | The Content Layer file uses the `glob()` loader and current `content.config.ts` location, but imports `z` from `astro:content` rather than `astro/zod`. | Project uses Astro 7.3.2; current Astro docs show `defineCollection` from `astro:content`, `glob` from `astro/loaders`, and `z` from `astro/zod`; Astro 6+ deprecates the `z` export from `astro:content`. The build still succeeds. Finding F-04. |

| ID | Pass | Severity | Location (file / URL+viewport) | Issue | Source of truth | Evidence | Proposed follow-up |
|---|---|---|---|---|---|---|---|
| F-02 | F | Low | Post-list route templates under `astro/src/pages/page/`, `categories/`, and `tags/` | Five route templates repeat the post-list heading/section/pagination structure. The shared `PostCard` already removes card duplication, but the surrounding route shell can still drift. | Astro Development Instructions: keep components focused and composable | The five inspected files each map `PostCard` inside the same section and render a two-sided Newer/Older navigation shell, with route-specific heading and href strings. | Consider a semantic shared listing/pagination component while keeping route-specific data and URLs in the page templates. |
| F-03 | F | Low | `astro/public/theme/`; `astro/src/components/Welcome.astro`; `astro/src/assets/astro.svg` | Legacy theme assets and the unused Astro starter component/logo remain in the Astro tree. The entire `public/theme/` subtree is copied into deployment despite no active source reference. | Astro Development Instructions: Performance Optimization | `dist/theme/` contains 2,239 unreferenced files totaling 3.92 MiB; `Welcome.astro` and its logo have no active page usage. | Remove obsolete assets in a separately scoped cleanup after confirming no external deployment consumer depends on their public URLs. |
| F-04 | F | Low | `astro/src/content.config.ts:1`; `astro/package.json` | The collection schema imports `z` from `astro:content`, which Astro 6+ deprecates in favor of `astro/zod`. The content collection otherwise uses the current Content Layer config and loader shape. | Astro 7 Content Collections guide; Astro 6 upgrade guide | The package resolves Astro 7.3.2; current docs use `import { z } from 'astro/zod'`, and the upgrade guide marks the `astro:content` export deprecated. The production build succeeds. | Change the schema import to `astro/zod` during a focused compatibility cleanup. |

## Pass G: Content rendering

### 8.1 Representative post rendering

The published sample was opened in both themes in the production preview. All listed routes returned HTTP 200; the requested `data-theme` was applied in both modes, and feature counts were identical in Dark and Light. Earlier Pass B checks record computed code, table, and content-surface colors. No alert block or emoji shortcode exists in the published post corpus, so neither feature has a page example to render-test. The draft post is excluded from production and cannot be tested as a published route.

| Post | Dark result | Light result |
|---|---|---|
| `mycroft-part-1` | 200; 5 code blocks, 13 inline-code spans, 1 table, 3 images; all present. | Same feature counts; theme applied. |
| `displaylink-dk1522-issue-after-opensuse-leap-42-3-upgrade` | 200; 4 code blocks, 2 inline-code spans; all present. | Same feature counts; theme applied. |
| `home-network-overhaul` | 200; 1 inline-code span, 1 table, 12 images; all present. | Same feature counts; theme applied. |
| `beyond-flock-the-quiet-standardization-of-mass-surveillance-(tldr)` | 200; 1 inline-code span, 1 table, 1 Mermaid SVG, 1 image; all present. | Same feature counts; theme applied. |
| `how-a-cpu-works` | 200; one `lite-youtube` embed control. | Same embed control; theme applied. |
| `7-gamers-1-cpu-ultimate-virtualized-gaming-build-log` | 200; one `lite-youtube` embed control. | Same embed control; theme applied. |
| `how-to-make-a-motherboard-a-gigabyte-factory-tour` | 200; one `lite-youtube` embed control. | Same embed control; theme applied. |
| `how-to-reveal-the-password-hidden-behind-asterisks` | 200; one `lite-youtube` embed control. | Same embed control; theme applied. |
| `how-we-make-sd-cards` | 200; one `lite-youtube` embed control. | Same embed control; theme applied. |
| `thirty-years-of-mac-ads-1984-2014` | 200; one `lite-youtube` embed control. | Same embed control; theme applied. |
| `clamav-clamtk-anti-virus-for-ubuntu` | 200; ordinary external YouTube link (not an embed), 2 images; present. | Same content counts; theme applied. |
| `blocking-an-ip-on-a-linux-system-with-iptables` | Draft; no published page (request returns the generated 404 fallback). Content-render verification is not applicable. | Draft; no published page (request returns the generated 404 fallback). |

## Pass H: SEO, metadata, and feeds

### 8.2 Built SEO and feed audit

Scanned 228 active site HTML documents under `dist` (excluding two legacy test HTML files copied from the unused `public/theme/` subtree; see F-03). The scan checks emitted metadata only, not search-engine rankings.

| Check | Result | Evidence / finding |
|---|---|---|
| Unique page titles | Not met; see E-04 | 43 distinct title values across 228 active documents; 186 documents inherit the generic `Codeholics` title. |
| Unique descriptions | Not met for all routes | 41 distinct values; 186 documents share the valid site-level default description, and three embed-only post pages have an empty description (B-12). The social-sharing spec permits site-level defaults for other routes. |
| Canonical URL | Pass | All 228 pages have exactly one canonical on `https://www.codeholics.com`; it matches `og:url` and retains the current path. |
| Open Graph and Twitter metadata | Pass with the B-12 description exception | All 228 active pages contain exactly one of each required title, description, canonical, Open Graph (`og:title`, `og:description`, `og:image`, `og:type`, `og:url`, `og:site_name`), and Twitter (`card`, title, description, image) tag. |
| RSS validity and linking | Pass | `dist/rss.xml` parses as XML and contains 41 published-post items with absolute `https://www.codeholics.com/posts/...` URLs. All 228 active site HTML documents link to `/rss.xml`. |
| Sitemap | Not present; see H-01 | No sitemap file exists anywhere under `dist`; `robots.txt` is also absent. |
| Custom 404 page | Not present; see B-11 | No `dist/404.html` exists; the site uses Astro's generated fallback. No custom behavior is required by an accepted spec. |

| ID | Pass | Severity | Location (file / URL+viewport) | Issue | Source of truth | Evidence | Proposed follow-up |
|---|---|---|---|---|---|---|---|
| H-01 | H | Low | Astro production output; `astro/astro.config.mjs` | The build emits no sitemap, reducing the machine-readable route inventory available to search crawlers. | Astro Development Instructions: SEO and Meta Management | Recursive inspection of `astro/dist` found no sitemap file; there is no sitemap integration in the current production output. | Add and validate a sitemap for published routes, ensuring it uses the configured canonical host. |

## Noticed, not reviewed

- No published post contains a GitHub Markdown alert or an emoji shortcode, so those content cases remain unverifiable; task 1.3 stays open as previously decided. No temporary content fixture was added.
- Search-engine ranking, Core Web Vitals, external social-platform cache behavior, and editorial quality beyond concrete UI copy were not measured; these remain outside the review scope.

## Proposed follow-up changes

### 9.1 Deduplicated severity triage

The pass-specific tables contain 67 distinct findings. No finding row has a duplicate ID, and every row has a source of truth and evidence. Cross-references such as “see E-04” are references to the original row, not additional findings. The index below provides the global severity order; detailed findings remain grouped by review pass.

| Severity | Count | Finding IDs |
|---|---:|---|
| High | 4 | B-03, B-04, B-12, E-04 |
| Medium | 11 | C-01, C-02, C-03, C-04, C-05, C-08, C-09, C-11, E-01, E-02, E-03 |
| Low | 52 | A-01–A-31; B-01, B-02, B-05–B-11; C-06, C-07, C-12–C-14; E-05, E-06; F-01–F-04; H-01 |

### 9.2 Proposed follow-up changes

These are recommendations only; this review does not create the changes. The first entry is the outstanding documentation decision. Unless a row says otherwise, no DC decision is required and the repository-specific Astro-only/zero-JavaScript rules continue to govern.

| Proposed change (kebab-case) | One-line scope | Finding IDs | Dependency on a DC decision |
|---|---|---|---|
| `resolve-astro-instruction-precedence` | Decide whether the generic Astro guide remains general-purpose or is revised to remove guidance that conflicts with repository-specific rules. | DC-3 | Requires the user's decision before changing the guide. |
| `make-inline-code-lint-cross-platform` | Make the strict inline-code lint npm script run on Windows as well as POSIX shells. | A-01 | None. |
| `scope-github-alert-test-to-content` | Limit the alert regression assertion to rendered post content, not unrelated metadata. | A-02 | None. |
| `fix-astro-typecheck-diagnostics` | Resolve the 29 Astro-check errors and migrate the deprecated collection-schema Zod import. | A-03–A-31, F-04 | None. |
| `align-favicon-routes` | Provide the canonical root-level PNG favicon paths required by the accepted capability. | B-03 | None. |
| `provision-mermaid-build-runtime` | Install the required Chromium runtime in clean CI/deploy build environments. | B-04 | None. |
| `clarify-inline-code-lint-policy` | Document strict/warning-mode author commands and define an explicit cleanup window for blocking lint. | B-01, B-02 | None. |
| `document-cutover-reindexing` | Add the post-deployment reindex expectation to active cutover documentation. | B-05 | None. |
| `specify-search-and-post-listing` | Specify search behavior plus post ordering, pagination, boundary, and empty states. | B-06, B-07 | None. |
| `specify-category-and-tag-pages` | Define category and tag indexes, counts, detail listings, pagination, and empty states. | B-08, B-09 | None. |
| `specify-about-and-not-found-pages` | Decide and specify About-page behavior and whether a custom 404 experience is required. | B-10, B-11 | None. |
| `fix-post-share-descriptions` | Ensure every published post has the summary or plain-text excerpt required for share metadata. | B-12 | None. |
| `align-design-system-typography` | Apply the specified font families and responsive type scale across templates. | C-01, C-02 | None. |
| `align-controls-and-spacing` | Correct undersized controls, component radii, container padding, and the unused focus-ring token. | C-03, C-04, C-05, C-14 | None. |
| `align-navigation-and-theme-metadata` | Add current-location state, use the specified theme-mode cycle, and provide theme-color metadata. | C-06, C-12, C-13 | None. |
| `refine-home-and-article-composition` | Replace generic home-hero copy and remove the article-wide card treatment. | C-07, C-08 | None. |
| `honor-reduced-motion-guidance` | Make theme changes instant and apply the documented reduced-motion behavior consistently. | C-09 | None. |
| `fix-accessibility-landmarks-headings-aria` | Add a skip link and correct page landmarks, heading hierarchy, title specificity, and ARIA semantics. | C-11, E-01–E-06 | None. |
| `optimize-content-images` | Provide intrinsic image dimensions and appropriate optimization/lazy-loading for eligible content images. | F-01 | None. |
| `deduplicate-post-list-templates` | Extract only the repeated post-list/pagination shell while keeping route-specific labels and URLs in page templates. | F-02 | None. |
| `remove-unused-theme-assets` | Remove the unused legacy theme subtree and Astro starter component/logo after confirming no external URL consumers. | F-03 | None. |
| `add-xml-sitemap` | Generate and validate a sitemap using the configured canonical host. | H-01 | None. |

### 9.3 Validation and worktree comparison

- `openspec validate review-site-implementation` passes; the CLI reports the expected `skip_specs` informational message for this review-only change.
- The task list will finish at 32/33: task 1.3 remains unchecked because no published post contains a GitHub Markdown alert or emoji shortcode, and the user declined adding a fixture. Task 9.3 is the final checklist item.
- Compared with the worktree baseline recorded before the remaining review passes, the pre-existing header/footer, content, image, archived-change, and spec edits remain unchanged. Review-generated `.playwright-mcp` artifacts were removed by exact filename. No site source, package manifest, or lockfile was changed by this review; the only review edits are in this change directory. The responsive screenshots remain in the user-approved session `files/` location.
