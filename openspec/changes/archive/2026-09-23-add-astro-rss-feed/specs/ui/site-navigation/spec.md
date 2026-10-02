# Spec Delta

## MODIFIED Requirements

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
