# Spec Delta

## ADDED Requirements

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
