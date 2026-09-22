# Tasks

## 1. Scaffolding & discovery

- [x] 1.1 Create `astro/src/components/Header.appbar.astro` scaffold and verify file exists
- [x] 1.2 Add `openspec/changes/modernize-navbar/notes.md` (optional) with any unresolved environment quirks found during local testing

## 2. UI markup and styles

- [x] 2.1 Implement app-bar markup: brand, primary nav, utility icons, hamburger, and mobile panel in `Header.appbar.astro`; verify layout matches design on desktop and mobile (manual visual check)
- [x] 2.2 Add Tailwind utility classes and minimal additions to `astro/src/styles/global.css` (focus-visible, motion, elevation); verify no visual regressions across main pages

## 3. Icons and assets

- [x] 3.1 Add inline SVG icons (hamburger/X, search, sun/moon) under `astro/src/components/icons/` and verify icons render correctly

## 4. Theme persistence and prepaint

- [x] 4.1 Add a tiny inline prepaint script in `astro/src/layouts/Layout.astro` to apply persisted theme before CSS paint; verify no flash of incorrect theme on reload
- [x] 4.2 Implement theme toggle control and theme JS module to persist preference in localStorage; verify toggling updates UI and persists across reloads

## 5. Mobile menu behavior and accessibility

- [x] 5.1 Implement mobile menu toggle logic, updating `aria-expanded` and transforming hamburger to X; verify `aria-expanded` reflects open state
- [x] 5.2 Implement basic focus management: return focus to hamburger on close and ensure tab order is logical; verify keyboard-only navigation (TAB/SHIFT+TAB) works across header controls

## 6. Testing & QA

- [x] 6.1 Manual accessibility smoke test: keyboard navigation, screen reader labels, and focus indicators; verify against spec scenarios in `specs/ui/site-navigation/spec.md`
- [x] 6.2 Cross-browser smoke tests (Chrome, Firefox, Safari, Mobile WebKit); verify menu and theme behavior are consistent

## 7. Deployment & cleanup

- [x] 7.2 Replace `Header.astro` import in `astro/src/layouts/Layout.astro` with `Header.appbar.astro` and verify build/local site works
- [x] 7.3 Remove old header files and any dead CSS after monitoring window


## Acceptance Criteria

- App-bar renders correctly on desktop and mobile and satisfies each scenario in `specs/ui/site-navigation/spec.md`.
- Theme preference persists across reloads and doesn't flash the wrong theme on first paint.
- Keyboard navigation and aria states function correctly (no regressions from current header).
- New code is small, dependency-free, and reviewed.
