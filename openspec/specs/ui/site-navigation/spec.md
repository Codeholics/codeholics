# ui/site-navigation Specification

## Purpose

Provide a modern, accessible app-bar navigation component for the site that improves discoverability and usability across device sizes. The spec describes observable behavior (markup, keyboard interaction, and theme persistence) without prescribing implementation details.

## Requirements

### Requirement: App-bar renders brand and primary navigation
The system SHALL render a top app-bar with three areas:
- **Left:** the `# Codeholics` brand, which links home.
- **Center:** primary navigation links for `~/`, `Coding`, `SysAdmin`, `InfoSec`, `OS`, `Hardware`, `Projects`, and `Reviews`.
- **Right:** utility controls, including search, the theme toggle, and, when space allows, a social-link group for X, Facebook, Github, and RSS.

From 1024px wide the primary navigation SHALL be visible inline. Below 1024px the same destinations SHALL remain available through the mobile navigation panel. The social links SHALL remain reachable at every viewport width.

#### Scenario: Desktop navigation visible
- **WHEN** the viewport width is >= 1024px
- **THEN** the app-bar shows the primary navigation inline and the hamburger button is not visible

#### Scenario: Tablet widths use the navigation panel
- **WHEN** the viewport width is from 768px to 1023px
- **THEN** the hamburger button is visible, the inline primary navigation is not shown, and the mobile navigation panel provides every primary destination

#### Scenario: Primary links route to topic pages
- **WHEN** a user opens the primary navigation on desktop or mobile
- **THEN** the nav includes links to `/`, `/tags/coding`, `/tags/sysadmin`, `/tags/infosec`, `/tags/os`, `/tags/hardware`, `/projects/`, and `/tags/review`

#### Scenario: Social links are available on desktop and mobile
- **WHEN** a user views the page at any viewport width
- **THEN** icon links to `https://twitter.com/root_codeholics`, `https://www.facebook.com/RootCodeholics`, `https://www.github.com/Codeholics`, and `/rss.xml` are reachable without horizontal scrolling
- **AND** at widths >= 1280px they appear in the app-bar
- **AND** below 1024px they appear in the mobile navigation panel
- **AND** they also appear at every width as a distinct icon group in the site footer, visually separate from copyright and credits
- **AND** each footer icon link has an accessible name

### Requirement: Mobile menu toggles and exposes navigation
The system SHALL provide a hamburger control that toggles a mobile navigation panel at viewport widths below 1024px. The hamburger control SHALL change its accessible state (`aria-expanded`) and visually transform to an X when open.

#### Scenario: Mobile menu open
- **WHEN** a keyboard or pointer user activates the hamburger button at viewport < 1024px
- **THEN** the mobile navigation panel becomes visible, focus moves into the panel, and `aria-expanded="true"` is set on the control

#### Scenario: Open menu resets when crossing into the desktop layout
- **WHEN** the mobile navigation panel is open and the viewport is resized to >= 1024px
- **THEN** the panel is hidden, the hamburger reports `aria-expanded="false"`, and the inline primary navigation is shown

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
On viewports >= 1024px, the system SHALL present the header search UI in a way that does not change the overall app-bar layout width or move the inline primary navigation when search is opened or closed.

#### Scenario: Opening desktop search keeps navigation position stable
- **WHEN** a user opens search from the desktop app-bar
- **THEN** the search UI becomes visible without shifting the brand, inline primary navigation, or utility controls to a different horizontal position

#### Scenario: Desktop search remains keyboard accessible
- **WHEN** a keyboard user opens desktop search from the app-bar
- **THEN** focus moves into the desktop search input, the search control reports `aria-expanded="true"`, and closing the search UI restores focus to the search trigger

### Requirement: Light-mode app-bar contrast remains readable
When the site resolves to light mode, the system SHALL render the app-bar surface, brand text, navigation links, utility icons, and search controls with sufficient contrast for comfortable reading and interaction without switching the header to a dark theme.

#### Scenario: Desktop navigation remains readable in light mode
- **WHEN** the site is in light mode on a viewport width >= 1024px
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
- **WHEN** the site is in light mode on a viewport width < 1024px
- **THEN** the visible top-bar controls, including the brand, theme toggle, and hamburger button, remain readable against the light app-bar surface

### Requirement: App-bar fits the viewport at every width
The shared app-bar SHALL fit within the viewport at every supported width on every page. It SHALL NOT cause horizontal page scrolling, and its brand SHALL remain on a single line, so the header height stays consistent between the mobile and desktop layouts.

#### Scenario: No horizontal overflow across breakpoints
- **WHEN** any page that uses the shared layout, such as the homepage, a tag page, an article, or Projects, is viewed at a width from 320px to 1536px, including 767, 768, 1023, 1024, 1279, and 1280px
- **THEN** the document's scroll width does not exceed the viewport width
- **AND** no app-bar control is clipped or pushed outside the visible viewport

#### Scenario: Brand stays on one line
- **WHEN** the app-bar is shown at any supported width
- **THEN** the `# Codeholics` brand renders on a single line
- **AND** the app-bar height does not grow because a brand, link, or control wraps

#### Scenario: Inline navigation remains comfortably sized
- **WHEN** inline primary navigation is shown at 1024px or wider
- **THEN** every primary link uses the same label size
- **AND** each link keeps a visible, keyboard-focusable hit area at least as tall as the existing utility icon buttons
