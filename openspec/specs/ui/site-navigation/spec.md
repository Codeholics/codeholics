# ui/site-navigation Specification

## Purpose

Provide a modern, accessible app-bar navigation component for the site that improves discoverability and usability across device sizes. The spec describes observable behavior (markup, keyboard interaction, and theme persistence) without prescribing implementation details.

## Requirements

### Requirement: App-bar renders brand and primary navigation
The system SHALL render a top app-bar containing (left) the `~/` home link, (center) primary navigation links for `Coding`, `SysAdmin`, `InfoSec`, `OS`, `Hardware`, and `Reviews`, and (right) utility controls including search, theme toggle, and a social-link group for X, Facebook, Github, and RSS. On wide viewports the primary navigation SHALL be visible inline; on narrow viewports the same destinations SHALL remain available through the mobile navigation panel.

#### Scenario: Desktop navigation visible
- **WHEN** the viewport width is >= 768px
- **THEN** the app-bar shows the primary navigation inline and the hamburger button is not visible

#### Scenario: Primary links route to topic pages
- **WHEN** a user opens the primary navigation on desktop or mobile
- **THEN** the nav includes links to `/tags/coding`, `/tags/sysadmin`, `/tags/infosec`, `/tags/os`, `/tags/hardware`, and `/tags/review`

#### Scenario: Social links are available on desktop and mobile
- **WHEN** a user views the desktop header or opens the mobile navigation panel
- **THEN** the UI exposes icon links to `https://twitter.com/root_codeholics`, `https://www.facebook.com/RootCodeholics`, `https://www.github.com/Codeholics`, and `/rss.xml`

### Requirement: Mobile menu toggles and exposes navigation
The system SHALL provide a hamburger control that toggles a mobile navigation panel. The hamburger control SHALL change its accessible state (`aria-expanded`) and visually transform to an X when open.

#### Scenario: Mobile menu open
- **WHEN** a keyboard or pointer user activates the hamburger button at viewport < 768px
- **THEN** the mobile navigation panel becomes visible, focus moves into the panel, and `aria-expanded="true"` is set on the control

### Requirement: Theme toggle persists preference
The system SHALL expose a navbar theme selector that supports explicit `light`, explicit `dark`, and `auto` behavior. The selector SHALL persist the chosen mode across page loads, SHALL apply the correct visual theme on initial page render, and SHALL make `auto` follow the user's current `prefers-color-scheme` setting when no explicit light or dark override is selected.

#### Scenario: Dark mode persists across reloads
- **WHEN** a user selects dark mode and reloads the page
- **THEN** the site renders in dark theme and the persisted theme preference remains dark

#### Scenario: Light mode is visibly distinct
- **WHEN** a user selects light mode from the navbar selector
- **THEN** the site renders in a visibly light theme instead of leaving the page in the same appearance as dark mode

#### Scenario: Auto mode follows system preference
- **WHEN** a user selects auto mode
- **THEN** the site resolves its theme from the current `prefers-color-scheme` result instead of forcing the last explicit light or dark override

### Requirement: Keyboard and screen-reader accessibility
Navigation controls SHALL be reachable via keyboard (TAB/SHIFT+TAB) with visible focus indicators. Important interactive elements (hamburger, theme toggle, search) SHALL include appropriate aria-labels and state (`aria-expanded`, etc.).

#### Scenario: Keyboard navigation
- **WHEN** a user navigates the header using the keyboard
- **THEN** each interactive control receives focus in logical order and has a visible focus ring

### Requirement: Desktop search does not reflow the app-bar
On viewports >= 768px, the system SHALL present the header search UI in a way that does not change the overall app-bar layout width or move the inline primary navigation when search is opened or closed.

#### Scenario: Opening desktop search keeps navigation position stable
- **WHEN** a user opens search from the desktop app-bar
- **THEN** the search UI becomes visible without shifting the brand, inline primary navigation, or utility controls to a different horizontal position

#### Scenario: Desktop search remains keyboard accessible
- **WHEN** a keyboard user opens desktop search from the app-bar
- **THEN** focus moves into the desktop search input, the search control reports `aria-expanded="true"`, and closing the search UI restores focus to the search trigger

### Requirement: Light-mode app-bar contrast remains readable
When the site resolves to light mode, the system SHALL render the app-bar surface, brand text, navigation links, utility icons, and search controls with sufficient contrast for comfortable reading and interaction without switching the header to a dark theme.

#### Scenario: Desktop navigation remains readable in light mode
- **WHEN** the site is in light mode on a viewport width >= 768px
- **THEN** the app-bar background remains visibly light
- **AND** the brand text, primary navigation links, and utility icons are rendered in dark-enough foreground colors to remain readable against that surface
- **AND** no desktop navigation label relies on white or near-white text against the light app-bar background

#### Scenario: Header interactions stay visible in light mode
- **WHEN** a user hovers or focuses a light-mode app-bar control
- **THEN** the resulting text, icon, background, and focus-ring states remain visually distinguishable from the resting light-mode header surface

#### Scenario: Desktop search stays readable in light mode
- **WHEN** a user opens the desktop search UI while the site is in light mode
- **THEN** the search trigger, search input, placeholder text, entered text, and submit control remain readable against their immediate surfaces
- **AND** the search UI still avoids reflowing the app-bar layout

#### Scenario: Mobile top-bar controls stay readable in light mode
- **WHEN** the site is in light mode on a viewport width < 768px
- **THEN** the visible top-bar controls, including the brand, theme toggle, and hamburger button, remain readable against the light app-bar surface
