# Spec Delta

## Purpose

Provide a modern, accessible app-bar navigation component for the site that improves discoverability and usability across device sizes. The spec describes observable behavior (markup, keyboard interaction, and theme persistence) without prescribing implementation details.

## ADDED Requirements

### Requirement: App-bar renders brand and primary navigation
The system SHALL render a top app-bar containing (left) brand logo and site title, (center) primary navigation links, and (right) utility controls (search, theme toggle). On wide viewports the primary navigation SHALL be visible inline; on narrow viewports the primary navigation SHALL be hidden behind a hamburger menu.

#### Scenario: Desktop navigation visible
- **WHEN** the viewport width is >= 768px
- **THEN** the app-bar shows the primary navigation inline and the hamburger button is not visible

### Requirement: Mobile menu toggles and exposes navigation
The system SHALL provide a hamburger control that toggles a mobile navigation panel. The hamburger control SHALL change its accessible state (`aria-expanded`) and visually transform to an X when open.

#### Scenario: Mobile menu open
- **WHEN** a keyboard or pointer user activates the hamburger button at viewport < 768px
- **THEN** the mobile navigation panel becomes visible, focus moves into the panel, and `aria-expanded="true"` is set on the control

### Requirement: Theme toggle persists preference
The system SHALL expose a theme toggle that switches between light and dark themes. The chosen theme SHALL persist across page loads using the user's `prefers-color-scheme` when available, falling back to a stored preference (localStorage) when explicitly toggled.

#### Scenario: Theme persists
- **WHEN** a user toggles theme to dark and reloads the page
- **THEN** the site renders in dark theme

### Requirement: Keyboard and screen-reader accessibility
Navigation controls SHALL be reachable via keyboard (TAB/SHIFT+TAB) with visible focus indicators. Important interactive elements (hamburger, theme toggle, search) SHALL include appropriate aria-labels and state (`aria-expanded`, etc.).

#### Scenario: Keyboard navigation
- **WHEN** a user navigates the header using the keyboard
- **THEN** each interactive control receives focus in logical order and has a visible focus ring

## Notes
- This spec intentionally defines behavior and observable outcomes. Implementation (Tailwind classes, SVGs, or JS module) is described in design.md, not here.
