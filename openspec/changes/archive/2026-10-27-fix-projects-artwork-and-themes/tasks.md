# Tasks

Implement only after this plan is approved. Follow root `Design.md` and the existing Astro instructions; preserve the current palette and keep changes local to the Projects page and directly coupled styles/tests. Commands below run from `astro/`.

## 1. Deliver the existing WebP artwork

- [x] 1.1 Change the hero source in `src/pages/projects/index.astro` to the existing full-size `.webp` through `publicAssetUrl`, update intrinsic attributes to 1983 by 793, and retain decorative semantics and prioritized loading. Verify: the browser's selected image URL and natural/declared dimensions match the WebP; no asset conversion or deletion is needed.
- [x] 1.2 Update the hero delivery test in `tests/github-projects.spec.ts`; observe requests before navigation and assert successful WebP MIME/content signature, selected URL, dimensions, and no corresponding PNG hero request/preload. Preserve the existing empty-alt/hidden-wrapper assertions. Verify: the focused delivery test passes and would fail with the original PNG source or a PNG renamed to `.webp`.
- [x] 1.3 Update the Featured Projects section of `README.md` with the canonical WebP path, actual dimensions, and preserved source-asset policy. Verify: the documented path exists and its dimensions agree with the passing delivery test.

## 2. Make the hero follow both themes

- [x] 2.1 Replace hard-coded hero UI text colors with `--page-heading`, `--muted`, and `--accent`; retain the existing themed divider. Verify: computed colors match the active root variables in explicitly initialized light and dark states, with no global palette edits.
- [x] 2.2 Replace desktop and mobile dark-only gradient stops with theme-derived fades and protect the complete copy footprint from photograph detail. Retain the unboxed split composition on desktop and a readable crop/stack on mobile. Verify: both-theme screenshots show a coherent image-to-page transition, visible artwork, readable wrapped copy, no enclosing card, and no new navbar gutter.
- [x] 2.3 Extend the hero tests across widths 320, 375, 640, 641, 768, 1024, 1280, and 1536 in both themes. Reuse/refine the existing contrast helper to account for the actual copy backdrop, gradients, and transparency rather than assuming the body's flat background. Verify: heading contrast is at least 3:1, eyebrow/summary at least 4.5:1, and all existing relevant alignment/crop/divider/no-overflow assertions pass.
- [x] 2.4 Document the theme-derived text and image blending in the existing Featured Projects documentation. Verify: the documentation describes light and dark behavior without prescribing new global colors, theme scripts, or permanent dark banners.

## 3. Verify the complete Projects page and theme transitions

- [x] 3.1 Extend the existing card/category checks to explicitly initialized light and dark states, covering repository titles, descriptions, metadata, tabs, active panels, empty states, links, hover, and keyboard focus. Exercise a populated curated panel through a scoped test fixture if needed without changing production category selections. Correct only demonstrated, coupled component-style defects. Verify: normal text meets 4.5:1 and meaningful control/focus indicators meet 3:1 against their rendered backdrops; external-link and keyboard-tab assertions remain green.
- [x] 3.2 Add saved-Light/saved-Dark cases against an opposing OS preference, plus System with each OS preference; exercise the real theme control, reload persistence, and live OS changes after returning to System. Wait for the resolved theme before measuring. Verify: the hero, remaining Projects content, and navigation agree without reloading on a theme change or resetting the active category.
- [x] 3.3 Verify keyboard navigation and focused controls under `prefers-reduced-motion: reduce`, and ensure the category row's local scrolling does not become horizontal page overflow. Verify: focused controls remain visible/reachable, no new animation or page script was introduced, and both-theme mobile checks pass.

## 4. Production regression checks and visual acceptance

- [x] 4.1 Run `npm run test:e2e -- tests/github-projects.spec.ts tests/navbar.spec.ts` using the existing mocked-GitHub production-build/preview configuration. Verify: the focused Projects and shared-navigation suites pass, repository metadata is still static, and no browser GitHub API calls are introduced.
- [x] 4.2 Run `npm run build`, including its inline-code lint. Verify: production generation succeeds and the generated Projects HTML references the correct WebP with the intended image attributes and no PNG hero preload.
- [x] 4.3 Use the responsive-design, web-design-guidelines, and web-design-reviewer checks for final screenshots at 375, 768, 1280, and 1536 pixels in both themes. Save evidence in the session workspace. Verify: light text is no longer washed out, dark mode retains its atmosphere, fades have no harsh seam, the focal scene and desktop navbar alignment are preserved, and all full-page controls/states remain understandable. Review against root `Design.md` and its AI Slop Test; confirm only directly scoped files changed.

## Workflow follow-up

- After review and deployment approval, verify `/projects/` on the deployed target: successful WebP response, no PNG hero request, correct light/dark presentation, and no cache-stale artwork reference.
- Sync the approved delta and archive through the normal OpenSpec workflow when implementation and verification are complete.
