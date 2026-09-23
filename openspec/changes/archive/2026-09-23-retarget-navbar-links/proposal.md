# Proposal

## Why

The current navbar emphasizes site structure (`About`, `Posts`, `Tags`, `Categories`) instead of the topical content areas readers are most likely to browse first. Repointing the primary navigation to high-signal tag pages should make the site feel more content-driven while preserving the existing home entry point.

## What Changes

- Replace the current primary navbar links with topical tag-based links for `Coding`, `SysAdmin`, `InfoSec`, `OS`, `Hardware`, and `Reviews`, while keeping the `~/` home link unchanged.
- Update both desktop and mobile navigation so they expose the same link set and destinations.
- Define the `Reviews` navigation item as the existing `review` tag page rather than a broader aggregate of multiple review-related tags.

## Capabilities

### New Capabilities
- None.

### Modified Capabilities
- `ui/site-navigation`: change the primary navigation requirement so the app-bar exposes the new topic-based destinations and keeps desktop/mobile nav sets aligned.

## Impact

- `astro/src/components/Header.appbar.astro`
- Potential shared nav data/helpers if the implementation consolidates desktop and mobile link definitions
- Existing tag routes under `astro/src/pages/tags/`
