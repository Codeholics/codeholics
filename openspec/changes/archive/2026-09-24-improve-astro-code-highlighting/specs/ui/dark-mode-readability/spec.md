# Spec Delta

## MODIFIED Requirements

### Requirement: Code and syntax-highlighted content remain readable in dark mode
When dark mode is active, the system SHALL render inline code, fenced code blocks, and syntax-highlighted snippets with a dark code surface and token colors that remain readable without reverting to light-theme backgrounds or low-contrast token colors.

#### Scenario: Highlighted code remains legible
- **WHEN** a user views a syntax-highlighted code block in dark mode
- **THEN** the code block background is a dark surface distinct from the article body
- **AND** default code text and syntax tokens remain readable against that surface
- **AND** line-number or emphasis styles do not introduce black text on dark backgrounds

#### Scenario: Enhanced code block controls remain readable in dark mode
- **WHEN** a user views or interacts with code block presentation controls in dark mode
- **THEN** interactive code-block UI elements (including copy controls and line-emphasis treatments) remain visually distinguishable from the code surface
- **AND** text or iconography used by those elements remains readable against their immediate background

