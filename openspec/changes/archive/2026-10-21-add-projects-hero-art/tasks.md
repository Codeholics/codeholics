# Tasks

## 1. Hero Artwork and Styling

- [x] 1.1 Refine the Featured Projects hero to match the supplied unboxed concept: keep it directly beneath the navbar without a top gutter, preserve the desktop artwork's vertical scene using its natural proportions, and keep the unboxed blend and subtle divider; verify navbar-to-image alignment, desktop aspect ratio, mobile layout, and no overflow with `npm run test:e2e -- tests/github-projects.spec.ts`.

## 2. Integration Verification

- [x] 2.1 Run the Astro production build and focused Featured Projects browser tests; inspect the generated page to verify the local artwork is emitted, the hero heading and introduction remain present, and no unrelated page sections or theme behavior regress.

## 3. Full-size Artwork

- [x] 3.1 Replace the smaller hero asset with the supplied 1920-by-768 full-size image, retaining its actual PNG format and preserving the approved composition and CSS effects. Update dimensions, documentation, and browser assertions; verify the focused Projects tests and emitted production asset.
