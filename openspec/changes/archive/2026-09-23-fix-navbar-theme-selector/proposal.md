# Proposal

## Why

The navbar theme selector currently changes stored state without producing a reliable visual distinction between light, dark, and auto modes. This leaves the theme control feeling broken and makes the navigation spec's theme-toggle behavior incomplete for users who expect a real three-state selector.

## What Changes

- Fix the navbar theme selector so light, dark, and auto each resolve to a distinct and observable site theme.
- Align initial page bootstrapping, runtime toggle behavior, and navbar icon state around the same theme-selection model.
- Expand regression coverage so the selector is validated across mode changes and page reloads instead of only proving that dark mode can be enabled once.

## Capabilities

### New Capabilities
- None.

### Modified Capabilities
- `ui/site-navigation`: refine the theme-toggle requirement so the navbar selector must support real light, dark, and auto behavior with persisted preference and observable visual changes.

## Impact

- Affected code: `astro/src/layouts/Layout.astro`, `astro/src/components/Header.appbar.astro`, `astro/src/styles/global.css`
- Affected tests: `astro/tests/navbar.spec.ts`
- Affected behavior: initial theme bootstrapping, navbar theme toggle state, and visible site theming
- No API or dependency changes expected
