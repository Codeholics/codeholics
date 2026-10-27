# Design

## Context

See [proposal.md](./proposal.md) for scope and [the capability delta](./specs/ui/github-projects/spec.md) for acceptance behavior.

### Observed implementation and development-page behavior

- `astro/src/pages/projects/index.astro` uses `publicAssetUrl` to reference the PNG. The hero already has decorative semantics, `fetchpriority="high"`, an unboxed layout, desktop split composition, a mobile crop, and a bottom divider.
- Local file signatures confirm that the `.png` is PNG and the `.webp` is RIFF/WEBP, not merely a renamed PNG. The WebP is 93,582 bytes versus 2,011,068 bytes for the PNG: approximately 95.35% smaller. Its intrinsic size is **1983 by 793**, not the current image attributes' 1920 by 768.
- The shared `https://dev.codeholics.com/projects/` page was inspected on 2026-10-27 in both themes. Its image URL still references the PNG.
- In light mode, computed hero colors remain `#F8FAFC` for the title, `#CBD5E1` for the summary, and `#67E8F9` for the eyebrow, despite `--bg` resolving to `#F8FAFC`. The screenshot shows near-white text on a light copy area.
- Both the desktop and mobile pseudo-element gradients retain hard-coded `rgba(7,13,24,...)` stops. Only one stop uses `--bg`, so light mode produces an abrupt light-to-dark edge rather than a coherent fade.
- `GithubProjects.astro`, `GithubProjectCard.astro`, and `CuratedProjects.astro` already use shared theme variables for most surfaces and copy. They need validation, not a speculative redesign.
- The current Playwright hero test explicitly expects `.png` and natural size 1920 by 768. Its visibility assertions cannot detect the light-mode contrast failure. Card contrast coverage does not explicitly initialize the starting theme and estimates the background from flat colors rather than the full composited backdrop.
- The accepted `ui/github-projects` spec explicitly says "dark gradient" in the desktop scenario. The delta intentionally replaces that wording; it preserves the layout and existing scenarios rather than silently violating an accepted requirement.
- Root `Design.md` defines the approved current violet/lavender/slate palette. No palette migration is authorized.

## Goals / Non-Goals

**Goals**

- Solve image delivery and page-local theme coupling at their source.
- Keep readability deterministic even where the image sits behind or near copy.
- Preserve the established dark presentation, desktop crop, navbar alignment, and content behavior.
- Reuse existing CSS variables, components, image assets, and testing infrastructure.

**Non-Goals**

- Site-wide color, typography, theme-storage, toggle-order, or component refactoring.
- CSS filters on artwork, generated alternate art, image conversion tooling, or new packages.
- Fixes from the broad review-only change, which can proceed independently.
- Deleting the PNG source or rewriting historical archived planning documents.

## Decisions

### 1. Use the existing full-size WebP directly

Change the hero path passed to `publicAssetUrl` to `cyberpunk_developer_desk_under_moonlight_fullsize.webp`. Set intrinsic attributes to 1983 by 793 and retain high-priority loading, empty alt, and the assistive-technology-hidden wrapper.

The existing public asset is already optimized and widely supported. Keep the existing desktop aspect-ratio composition; the new asset's ratio is effectively the same as the PNG's, so this is not a reason to redesign hero sizing.

**Alternatives:** importing into `src/assets` and adding Astro image processing, responsive derivatives, or a PNG fallback. These add asset movement or output variants that are unnecessary for this focused fix. A redundant PNG preload or fallback selected by supported test browsers would defeat the requested delivery correction.

### 2. Use the approved theme variables for hero UI text

Use `--page-heading` for the title, `--muted` for the summary, and `--accent` for the eyebrow. Retain `--surface-border` for the divider. This gives dark heading/body hierarchy in light mode and light heading/body hierarchy in dark mode, with the site's approved violet/lavender accent.

Do not treat cyan/blue colors inside the photograph as interface tokens: those pixels belong to the artwork and remain unchanged.

**Alternative:** keep white text and force the whole hero dark in light mode. Rejected because the requested behavior is a properly integrated light theme, not a permanently dark banner.

### 3. Derive image fades from the active page background

Keep the treatment in page-scoped CSS. Replace the hard-coded dark overlay colors in both desktop and mobile rules with `var(--bg)` and transparent mixes of that color. Use the existing inherited theme variables; page-local overlay variables are acceptable only where they remove repeated gradient definitions.

**Implementation note:** An opaque `var(--bg)` overlay left a visible seam in light mode. The body paints a `--bg` → `--bg-accent` gradient behind the copy, which is slightly darker than a flat `--bg`. The horizontal fade therefore uses a `mask-image` on the artwork container instead. The artwork becomes transparent behind the copy, so the actual page background shows through in either theme. A light `var(--bg)` vertical tint remains in the overlay. The mask is an alpha fade only: it does not recolor or filter the photograph.

The image stays atmospheric; do not wash out the entire photograph in light mode. Preserve the desktop artwork-right/copy-left layout and unboxed page. Keep the copy area free of competing image detail by reserving an opaque theme-background portion beneath the full text footprint before the fade becomes translucent. At narrow widths, adjust the fade/copy allocation or use the already-permitted stacked composition so every wrapped line has a protected backdrop.

The copy protection must blend into the page, without adding an enclosing card, rounded outline, shadow, filters, or a site-wide background change. A subtle shift between the solid base background and the existing body gradient is preferable to unreadable copy or a dark stripe.

**Alternatives:** retaining dark-only stops, CSS-inverting the photograph, adding separate light artwork, or adding JavaScript to calculate the overlay. Rejected because they either preserve the defect, change the artwork, or add unnecessary complexity.

### 4. Validate the rest of the page and correct only coupled theme defects

Cover My Projects, Recommended Projects, category controls, populated panels, empty states, repository metadata, external links, hover, and keyboard focus in both themes. Existing shared variables should already supply most of this behavior. If a concrete Projects-only issue appears, fix the narrowest corresponding component style and add a regression assertion.

Do not change repository loading, categories, global palette, safe-link attributes, or tab keyboard semantics. Use existing mocked GitHub responses for deterministic tests; if populated curated coverage needs a fixture, add a narrowly scoped test fixture without altering production category selections.

### 5. Extend the existing tests rather than add a new test stack

Use `astro/tests/github-projects.spec.ts` and the existing Playwright production-build/preview setup, which already imports `mock-github-api-for-e2e.mjs`.

- Register hero request/response observation **before navigation**. Assert the selected WebP URL, successful response, `image/webp` content type, RIFF/WEBP signature, natural dimensions, declared dimensions, and absence of PNG hero requests. A filename assertion alone is insufficient.
- Establish explicit light and dark states before page load. Cover saved preference against an opposing OS preference, System resolving to each OS theme, and live switching through the existing UI. Wait for the resolved theme instead of reading styles immediately after a media-preference change.
- Extend the existing contrast calculations with correctly initialized themes and actual local backdrops. Use the protected, opaque copy zone for deterministic hero contrast assertions; do not claim image/gradient contrast from `body.backgroundColor` alone. Where a translucent surface or gradient matters, composite all relevant layers or sample the rendered background separately from the glyphs.
- Assert at least 3:1 for the large hero heading, 4.5:1 for eyebrow/summary and normal-sized Projects text, and 3:1 for meaningful focus/control indicators.
- Keep existing decorative semantics, static metadata, external-link, navbar alignment, divider, no-box/no-shadow, crop, keyboard-tab, and overflow checks.

**Alternative:** screenshot-only tests or a global snapshot-baseline overhaul. Rejected because visibility and visual impressions alone do not catch delivery or measurable contrast failures. Screenshots remain necessary for image fade/crop quality, without requiring new snapshot tooling.

### 6. Use a defined responsive and interaction matrix

Automated layout/contrast checks cover widths **320, 375, 640, 641, 768, 1024, 1280, and 1536 CSS pixels** in both themes. The 640/641 pair specifically exercises the current hero breakpoint.

Save and visually review screenshots at 375, 768, 1280, and 1536 pixels in both themes. Check no horizontal page overflow, legible wrapped copy, useful image crop, desktop art beneath the navbar, and the theme-aware image-to-copy seam. Keep intended horizontal scrolling local to the category tab row.

Cover hover, keyboard focus, category switching, saved theme after reload, and reduced motion. The fix adds no animation or client-side code.

## Risks / Trade-offs

- [The WebP dimensions differ from the PNG even though the scene ratio is nearly identical] -> Update intrinsic attributes and natural-size assertions together; verify the visual crop instead of forcing the old pixel dimensions.
- [Light-theme overlays can obscure too much of the photograph] -> Keep the protected copy zone limited to text, taper the blend into the art, and compare both-theme screenshots at the defined viewports.
- [A flat-background contrast helper can falsely pass over an image or gradient] -> Protect the copy backdrop deliberately and validate compositing; never use text visibility as a substitute for contrast.
- [New contrast checks may reveal a related Projects control defect] -> Permit narrow component style corrections with tests; do not broaden into global palette redesign.
- [An existing theme preference can mask OS emulation] -> Initialize preference state explicitly and wait for the resolved class/data attributes.
- [Shared browser inspection can alter the user's preferences] -> Inspect with reversible OS-theme emulation and leave stored preferences untouched. The planning inspection restored dark OS emulation after checking light.

## Migration Plan

No data migration or deployment configuration is needed. Implement and review the page/test/documentation changes, run the focused Projects and navbar Playwright specs plus the production build, then verify the deployed Projects page serves WebP and renders both themes. Roll back the page-local implementation if required; retain the image assets and leave global theme behavior unchanged.
