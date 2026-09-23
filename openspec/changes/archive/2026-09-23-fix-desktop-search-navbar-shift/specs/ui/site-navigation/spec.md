# Spec Delta

## ADDED Requirements

### Requirement: Desktop search does not reflow the app-bar
On viewports >= 768px, the system SHALL present the header search UI in a way that does not change the overall app-bar layout width or move the inline primary navigation when search is opened or closed.

#### Scenario: Opening desktop search keeps navigation position stable
- **WHEN** a user opens search from the desktop app-bar
- **THEN** the search UI becomes visible without shifting the brand, inline primary navigation, or utility controls to a different horizontal position

#### Scenario: Desktop search remains keyboard accessible
- **WHEN** a keyboard user opens desktop search from the app-bar
- **THEN** focus moves into the desktop search input, the search control reports `aria-expanded="true"`, and closing the search UI restores focus to the search trigger
