# Tasks

## 1. Navigation data and rendering

- [x] 1.1 Define a shared primary-nav item list in `astro/src/components/Header.appbar.astro` and verify both desktop and mobile nav render from the same source.
- [x] 1.2 Replace the existing primary nav labels and hrefs with `~/`, `Coding`, `SysAdmin`, `InfoSec`, `OS`, `Hardware`, and `Reviews`, and verify the rendered links target `/`, `/tags/coding`, `/tags/sysadmin`, `/tags/infosec`, `/tags/os`, `/tags/hardware`, and `/tags/review`.

## 2. Behavior verification

- [x] 2.1 Verify the desktop navbar still shows the topical links inline at `>= 768px` and that the hamburger remains hidden in that viewport.
- [x] 2.2 Verify the mobile panel exposes the same topical destinations as desktop and preserves the existing search and utility controls.

## 3. Regression check

- [x] 3.1 Run the Astro build and verify it succeeds after the navbar link refactor.
- [x] 3.2 Manually verify that the tag pages linked from the navbar load as expected for published content, especially `/tags/review`.
