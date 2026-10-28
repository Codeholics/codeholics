# Tasks

Rules for every task below: do not edit site code. Each task is done when its result is recorded in `openspec/changes/review-site-implementation/findings.md`, following the severity scale, the one-source-of-truth rule, and the report format in design.md.

## 1. Setup

- [x] 1.1 Create `findings.md` with a header that records the reviewed commit SHA, date, Node version, and the viewport matrix and themes from design.md. Add empty sections for the baseline, doc conflicts, each review pass (A–H), "noticed, not reviewed", and proposed follow-up changes. Verify: the file exists and every section heading is present.
- [x] 1.2 Record the doc conflict DC-3 (generic Astro 7 instructions vs the Astro-only, zero-JS repo rules). Record DC-1 (`DESIGN.md` filename casing) as resolved by the 2026-10-27 rename, and DC-2 (light/dark) as resolved by the 2026-10-27 DESIGN.md update. Verify: each entry cites the files and lines involved and states the decision needed or the decision taken.
- [ ] 1.3 Select the representative post sample (design decision 5) by searching `astro/src/content/posts` for code fences, tables, `youtube`, `mermaid`, `> [!`, `:emoji:` shortcodes, images, and posts missing optional front matter. Verify: findings.md lists each slug with the feature it covers, and every feature has at least one post.

## 2. Pass A: Automated baseline

- [x] 2.1 From `astro/`, run `npm run build` and record pass or fail, warnings, inline-code lint output, and page count. Verify: the baseline table row is filled in, and any failure is logged as a Critical finding.
- [x] 2.2 Run `npm run lint:inline-code:strict`, `npm run verify:legacy-content-parity`, and `npm run test:site-url`. Verify: one baseline row per command, with any failures logged as findings.
- [x] 2.3 Run the script tests: `test:post-metadata`, `test:github-projects`, `test:github-markdown-alerts`, `test:emoji-shortcodes`, `test:social-sharing`. Verify: one baseline row per command.
- [x] 2.4 Run `npm run test:e2e` and record whether the GitHub API was mocked. Verify: the baseline row lists the pass and fail counts per spec file, and each failure is logged as a finding with trace or screenshot evidence.
- [x] 2.5 Run `npx astro check` for type and template diagnostics. Verify: the baseline row shows the error and warning counts, and each error is logged as a finding.

## 3. Pass B: Spec conformance

- [x] 3.1 Review `ui/site-navigation`, `ui/dark-mode-readability`, and `ui/code-highlighting` against the built site, scenario by scenario. Verify: findings.md lists each requirement as met or not met, with a finding ID for each one not met.
- [x] 3.2 Review `ui/github-projects`, `frontend/social-sharing`, and `frontend/favicons`. Check rendered meta tags, OG images, and favicon links in `dist/`. Verify: each requirement is listed as met or not met.
- [x] 3.3 Review `content/*`: post-images, rss-feed, youtube-embeds, mermaid-diagrams, github-markdown-alerts, emoji-shortcodes, and ai-post-metadata-enforcement. Use the post sample from 1.3. Verify: each requirement is listed as met or not met.
- [x] 3.4 Review `deployment/site-url` and `deployment/astro-production-cutover` against `astro.config.mjs`, `site.config.mjs`, and `.github/workflows/build.yml` and `deploy.yml`. Verify: each requirement is listed as met or not met.
- [x] 3.5 List any site behavior that no accepted spec covers, such as search, pagination, categories and tags, about, and the 404 page. Verify: each gap is recorded as a Low or Medium finding proposing a spec.

## 4. Pass C: Design-system conformance

- [x] 4.1 Compare rendered colors in both themes against the approved `https://codeholics.com/` baseline captured in root DESIGN.md §2. Map the existing `:root` / `html.dark` variables in `global.css`, including gradients, alpha values, neutral primary actions, header colors, and hover states. Distinguish legacy Tailwind config entries from actual rendered colors. Do not flag existing variable names or compatibility overrides as palette defects, and do not propose the discarded sky/cyan palette. Verify: findings.md contains a current-variable mapping (dark implemented/expected → light implemented/expected → match or mismatch), with screenshots/computed styles for any difference.
- [x] 4.2 Compare typography against DESIGN.md §3 and §8: font families (IBM Plex Sans and JetBrains Mono), the type scale, prose width (65–75ch), and responsive scaling. Verify: findings for each mismatch include the computed style as evidence.
- [x] 4.3 Compare components against DESIGN.md §4: buttons, cards, GitHub repository cards, tags, inputs, navigation, code blocks, and callouts. Also check the radius, spacing, and elevation rules in §5 and §6. Verify: each component is recorded as conforming or deviating.
- [x] 4.4 Apply the AI Slop Test (DESIGN.md §7) to the home page, `/projects`, `/posts`, and a post page, citing concrete elements. Verify: every entry names an element and the DESIGN.md rule it breaks, or the page is recorded as passing.
- [x] 4.5 Check motion against DESIGN.md §10: transition durations, and `prefers-reduced-motion` handling in `global.css` and the components. Verify: findings are recorded or the pass is noted.
- [x] 4.6 Review theme behavior against DESIGN.md §2 Theme Modes and Theme Toggle:
  - System default, and live updates when the OS preference changes
  - the explicit choice persists
  - no flash of the wrong theme on load
  - `color-scheme` and the `theme-color` meta tags
  - readability with JS disabled
  - the toggle's accessible name and state, 44px target, and focus ring in both themes

  Verify: each rule is recorded as pass or fail, with evidence.

## 5. Pass D: Responsive behavior

- [x] 5.1 Using the `responsive-design` and `web-design-reviewer` skills, take screenshots of every page template (home, posts index, paginated index, post, categories, category detail, tags, tag detail, projects, about, search) at all four viewports in both themes. Verify: screenshots are saved under the session `files/` folder, and findings.md lists the template × viewport coverage.
- [x] 5.2 Check for horizontal overflow, broken grids, and clipped text at 375px. Cover long titles, long code lines, wide tables, embeds, and mermaid diagrams on sample posts. Verify: each overflow is recorded with the URL, viewport, and offending element.
- [x] 5.3 Check the mobile navigation (drawer or menu), search, and theme toggle at 375px and 768px. Also check touch targets of at least 44×44px with 8px spacing. Verify: measured sizes are recorded for any undersized target.

## 6. Pass E: Accessibility and keyboard

- [x] 6.1 Run an automated accessibility scan (for example axe via Playwright `browser_evaluate` or `@axe-core/playwright` run ad hoc, without adding a dependency) on each template in both themes. Verify: violations are recorded with rule ID, node, and template, at WCAG AA or higher.
- [x] 6.2 Do a keyboard-only walkthrough: skip link, header nav, mobile menu open and close and Escape, search, theme toggle, pagination, and project cards. Check visible focus and focus order. Verify: each control is recorded as pass or fail.
- [x] 6.3 Check semantics with the `web-design-guidelines` skill: landmarks, the heading hierarchy on each template, link text, alt text on hero, thumbnail, and post images, `lang`, and the page `<title>`. Verify: findings are recorded per template.

## 7. Pass F: Astro architecture and JS budget

- [x] 7.1 Audit each inline `<script>` (`Header.appbar.astro`, `Layout.astro` ×2, `CuratedProjects.astro`, `search.html.astro`). For each one, record its purpose, its size in `dist/`, whether HTML or CSS could do the job instead, and whether the page still works with JS disabled. Verify: there is a JS budget table, and any unjustified script is logged as a Medium finding.
- [x] 7.2 Review images: plain `<img>` vs `astro:assets` `<Image />`, width and height attributes, lazy loading, and the formats served from `public/images`. Verify: findings cite the files and the DESIGN.md §9 or Astro instructions rule involved.
- [x] 7.3 Review the structure: duplicated markup across the paginated, category, and tag pages; the size of `Header.appbar.astro` and `global.css`; dead assets such as `public/theme/` (bootstrap-icons, sass, js), `Welcome.astro`, and `src/assets/astro.svg`; and whether the `content.config.ts` schema matches the Astro 7 Content Layer conventions. Verify: each candidate has a usage check (grep or `dist/` reference) recorded as evidence.

## 8. Passes G and H: Content rendering, SEO, and feeds

- [x] 8.1 For each post in the sample, verify that code blocks, inline code, tables, embeds, alerts, mermaid, emoji, and images render correctly in both themes. Verify: one result row per post.
- [x] 8.2 Check SEO and metadata in `dist/`: unique titles and descriptions, the canonical URL, OG and Twitter tags, `rss.xml` validity and linking, and whether a sitemap and a 404 page exist. Verify: findings are recorded, or a pass is noted for each item.

## 9. Triage and handoff

- [x] 9.1 De-duplicate findings, set the final severity, and sort them by severity. Verify: there are no duplicate IDs, and every finding has a source of truth and evidence.
- [x] 9.2 Group the findings into proposed follow-up OpenSpec changes, each with a kebab-case name, a one-line scope, the finding IDs it covers, and its dependency on a DC decision. Put the doc-conflict resolution change first. Verify: every non-doc-conflict finding maps to exactly one proposed change.
- [x] 9.3 Present the summary to the user: counts by severity, the doc conflicts that need a decision, and the proposed change list. Verify: `openspec validate review-site-implementation` passes, and the review added no modifications outside this change directory, compared with the worktree state recorded at review start.

## Workflow follow-up

- After the user decides on DC-3, create the accepted follow-up changes with `/opsx-propose`. A palette redesign or token-renaming migration is not an expected follow-up. Propose only evidence-backed corrections, keeping any necessary accessibility adjustment focused and separate from a future palette redesign.
- Archive this change once the findings are accepted.
