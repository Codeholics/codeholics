# Proposal

## Why

The Astro site was built incrementally across 23 archived OpenSpec changes, before the design system (now at root `DESIGN.md`), the Astro instructions, and the UI skills (`frontend-design`, `responsive-design`, `web-design-guidelines`, `web-design-reviewer`) existed. Nothing has been checked against those standards. A single structured review now gives future work a known baseline instead of having each change uncover drift one piece at a time.

## What Changes

- Run a structured, read-only review of the current Astro site against:
  - accepted specs in `openspec/specs/` (15 capabilities)
  - root `DESIGN.md` (colors, typography, layout, responsive, motion, AI Slop Test)
  - `.github/Instructions/astro.instructions/astro.instructions.md`
  - the `web-design-guidelines` and `web-design-reviewer` skills (accessibility, UX, visual inspection)
- Run the existing automated checks (build, lint, script tests, Playwright e2e) to establish a pass/fail baseline.
- Produce a triaged findings report (`findings.md` in this change) that lists each issue with its location, evidence, the violated source of truth, severity, and recommended follow-up.
- Group the findings into proposed follow-up OpenSpec changes. Name them in the report only; do not create them yet.
- Surface conflicts between the governing documents themselves for a human decision. Known remaining example: the generic Astro 7 instructions conflict with the Astro-only, zero-JS repo rules. The `DESIGN.md` filename casing was resolved on 2026-10-27, when the file was renamed to match the instructions. The light/dark conflict was resolved on 2026-10-27, when DESIGN.md captured the approved current live colors for both themes.
- Preserve the current palette from `https://codeholics.com/`, verified in both themes on 2026-10-27. Palette redesign and CSS token renaming are out of scope. Review actual contrast problems as specific findings, not as authorization to replace the palette.

No site code, content, specs, or design documents are changed by this change. All fixes go into follow-up changes.

## Capabilities

### New Capabilities

None. This is a review-only change and adds no system behavior.

### Modified Capabilities

None. Requirement changes that the review identifies will be proposed in follow-up changes. `skip_specs: true` is set in `.openspec.yaml`.

## Impact

- **Code:** none modified. Files reviewed: `astro/src/**` (pages, layouts, components, lib, styles), `astro/astro.config.mjs`, `astro/tailwind.config.cjs`, `astro/site.config.mjs`, `astro/public/**`, `astro/scripts/**`, `astro/tests/**`.
- **Docs/process:** produces `openspec/changes/review-site-implementation/findings.md`, and backlog entries for follow-up changes.
- **Tooling:** uses the existing npm scripts and Playwright. Runs the dev or preview server locally for visual inspection. No new dependencies.
