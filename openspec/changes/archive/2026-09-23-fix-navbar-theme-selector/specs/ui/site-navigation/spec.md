# Spec Delta

## MODIFIED Requirements

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
