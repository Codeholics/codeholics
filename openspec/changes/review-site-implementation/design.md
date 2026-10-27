# Design

## Context

See proposal.md (Why) for motivation. Current state relevant to the review approach:

- **Site surface** (`astro/src/pages`):
  - home `/`
  - post index `/posts` and pagination `/page/[page]`
  - post detail `/posts/[slug]`, 43 posts
  - categories and tags (index, detail, paginated)
  - `/projects`, `/about`, `/search.html`, `/rss.xml`
  - No custom 404 page exists.
- **Shared UI:**
  - `Layout.astro`
  - `Header.appbar.astro`, 352 lines, with an inline script
  - `Footer.astro`, `PostCard.astro`, `Welcome.astro`
  - `GithubProjects.astro`, `GithubProjectCard.astro`, `CuratedProjects.astro`, which has an inline script
  - `styles/global.css`, 588 lines
- **Client JS:** inline `<script>` in `Header.appbar.astro`, `Layout.astro` (×2), `CuratedProjects.astro`, and `search.html.astro`. No `client:*` islands. No `astro:assets` `<Image />` usage.
- **Styling:**
  - Tailwind v4 via `@config "../../tailwind.config.cjs"` (legacy JS config)
  - Root `DESIGN.md` now captures the approved live palette verified on 2026-10-27: `--accent` is `#A78BFA` dark / `#7C3AED` light; `--bg` is `#0B1220` dark / `#F8FAFC` light, with gradients and translucent surfaces.
  - Legacy Tailwind `primary: #60a5fa` and `bg: #0f1720` entries are not the global accent or rendered page-background variables. They are not automatic defects.
  - Typography plugin colors are based on slate and indigo
- **Existing automated checks:**
  - `npm run build`, which includes the inline-code lint
  - `npm run verify:legacy-content-parity`, `npm run test:site-url`
  - script tests: `test:post-metadata`, `test:github-projects`, `test:github-markdown-alerts`, `test:emoji-shortcodes`, `test:social-sharing`
  - Playwright e2e (`test:e2e`): `navbar`, `link`, `rss`, `social-sharing`, `github-projects`
- **Conflicts between governing documents:**
  1. *Resolved 2026-10-27.* The design system is at the repo root as `DESIGN.md`, matching the references in `.github/copilot-instructions.md`, the skills, and DESIGN.md §14–15.
  2. *Resolved 2026-10-27.* DESIGN.md defines both themes using the existing variable names and approved live violet/lavender/slate colors. The default follows the OS preference (System), with Light and Dark overrides. The earlier sky/cyan palette and proposed `--color-*` migration were documentation errors, not implementation requirements. Existing compatibility overrides are not automatic palette defects; pass C checks actual rendered differences and contrast.
  3. The Astro instructions are generic Astro 7 guidance: they mention React/Vue islands, SSR, Actions, and Sessions. The repo rules say to stay static, Astro-only, and zero-JS by default. Repo rules win under the instruction-authority order.

## Goals / Non-Goals

**Goals:**
- Produce reproducible findings, each tied to a specific source of truth.
- Cover every page template at mobile, tablet, desktop, and large-desktop widths.
- Separate "the implementation is wrong" from "the documents disagree" so fixes are not built on an undecided rule.
- Produce a findings list that can go straight into follow-up OpenSpec changes.

**Non-Goals:**
- Fixing anything, including small fixes.
- Replacing the approved live palette, renaming CSS tokens, or treating the old sky/cyan proposal as a target. A future palette redesign is separate work.
- Reviewing individual post prose for editorial quality. Content is reviewed only for rendering (images, code, tables, embeds, alerts, mermaid).
- Performance profiling beyond what the build output and page weight show.
- Re-litigating archived changes. Their specs are reviewed only as they stand now.

## Decisions

1. **Sources of truth and precedence.** Use the instruction-authority order from `.github/copilot-instructions.md`: accepted specs, then existing architecture, then DESIGN.md, then Astro instructions, then skills. Each finding cites exactly one primary source. If two sources disagree, record a *document conflict* rather than an implementation defect.
   - The user's explicit current decision approves the colors on `https://codeholics.com/`. Use the verified live baseline and DESIGN.md §2 together. If another document still prescribes a different palette, correct or flag that document rather than recommending a recolor. Other design rules have not all been verified against production; distinguish a documentation mismatch from a confirmed implementation defect.
   - *Alternative:* treat every value in DESIGN.md as proof of the current production design. Rejected: the earlier palette was inaccurate, and unverified design guidance should not cause an unsolicited redesign.

2. **Review passes by lens, not by file.** The passes are:
   - (A) automated baseline
   - (B) spec conformance, one pass per capability
   - (C) design-system conformance (tokens, typography, spacing, components, AI Slop Test)
   - (D) responsive behavior
   - (E) accessibility and keyboard
   - (F) Astro architecture and JS budget
   - (G) content rendering on representative posts
   - (H) SEO, metadata, and feeds

   Each pass maps to one skill or document, so coverage is checkable.
   - *Alternative:* go file by file. Rejected: cross-cutting issues such as token drift would be reported many times over.

3. **Run against a production build.** Static review runs against `npm run build` followed by `npm run preview`, so the review sees real deploy output: base path, `site` URL, minified HTML. The dev server is used only to trace a finding back to source.

4. **Viewport matrix.** Use 375×812 (mobile), 768×1024 (tablet), 1280×800 (desktop), and 1536×960 (large). Check each in dark and light themes (DESIGN.md §2 Theme Modes), and also with `prefers-reduced-motion: reduce`. Use the Playwright MCP or browser tools for screenshots and snapshots.

5. **Representative content set.** The post sample includes posts that use:
   - fenced code with long lines
   - inline code
   - tables
   - YouTube embeds
   - mermaid diagrams
   - GitHub alerts
   - emoji shortcodes
   - hero and thumbnail images
   - missing optional metadata

   The specific slugs are selected during task 1.3 and recorded in findings.md.

6. **Severity scale.**
   - **Critical:** broken build or page, data loss, or a blocking accessibility failure (e.g. a keyboard trap or unusable navigation).
   - **High:** spec violation, WCAG AA failure, or a broken layout at a supported viewport.
   - **Medium:** DESIGN.md deviation that users can see, or unjustified JS.
   - **Low:** polish or consistency issues.
   - **Doc-conflict:** needs a human decision. Not ranked by severity.

7. **Report format.** One `findings.md` in this change. It has a header with the baseline table (each check and whether it passed or failed), then a table with columns `ID | Pass | Severity | Location (file / URL+viewport) | Issue | Source of truth | Evidence | Proposed follow-up`. Screenshots are stored under the session workspace and referenced, not committed.
   - *Alternative:* open GitHub issues directly. Deferred: findings should be triaged and grouped into changes first.

## Risks / Trade-offs

- [Theme coverage doubles the visual review] → Review dark first (the reference theme), then light. Tag findings that appear only in light.
- [Accurate palette capture is mistaken for accessibility certification] → Measure actual composited colors and hover/focus states. Propose any necessary contrast correction separately; preserving the approved palette does not hide genuine accessibility findings.
- [GitHub API calls during build or e2e may be rate-limited or flaky] → Use the existing `mock-github-api-for-e2e.mjs` and Playwright config. Record whether the network was mocked.
- [Review becomes unbounded] → Cap each pass with the checklist in tasks.md. Anything outside the checklist goes to a "noticed, not reviewed" list.
- [Findings get stale while waiting for fixes] → Record the commit SHA reviewed in the report header.
- [Visual review is subjective (AI Slop Test)] → Require a concrete element and the matching DESIGN.md rule for every design finding. "Feels generic" alone is not a finding.
