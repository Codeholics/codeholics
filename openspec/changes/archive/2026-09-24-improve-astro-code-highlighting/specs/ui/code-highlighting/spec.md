# Spec Delta

## Purpose

Define consistent markdown and MDX code highlighting behavior for Astro pages so fenced code blocks remain readable, language-aware, and presentation-enhanced without requiring mass content rewrites.

## ADDED Requirements

### Requirement: Legacy fence language labels resolve to supported grammars
The system SHALL normalize fenced code language labels before syntax highlighting so historical or non-canonical labels that are configured as aliases resolve to a supported language grammar.

#### Scenario: Uppercase legacy label is normalized
- **WHEN** a post includes a fenced code block labeled with a configured legacy alias such as `Python` or `HTML`
- **THEN** the renderer resolves that label to the mapped canonical language id
- **AND** the block is syntax highlighted using the canonical language grammar

#### Scenario: Alias behavior does not require content rewrites
- **WHEN** existing posts contain configured alias labels
- **THEN** those posts render with syntax highlighting
- **AND** no manual edit to each post file is required for those aliases

### Requirement: Highlighting pipeline provides deterministic fallback behavior
The system SHALL apply syntax highlighting to supported code languages and SHALL render unsupported language labels using a documented fallback behavior that remains readable.

#### Scenario: Supported language uses syntax tokens
- **WHEN** a fenced code block uses a configured supported language id
- **THEN** syntax tokens are rendered for that block in both light and dark themes

#### Scenario: Unsupported language remains readable
- **WHEN** a fenced code block uses an unconfigured or unknown language label
- **THEN** the code block still renders as a readable fenced block
- **AND** the output avoids broken markup or unrendered raw fence content

### Requirement: Code blocks expose enhanced presentation affordances
The system SHALL render fenced code blocks with enhanced presentation features configured for the project, including line-level emphasis support and a copy affordance.

#### Scenario: Line emphasis metadata is honored
- **WHEN** a fenced code block includes supported line-emphasis metadata
- **THEN** the rendered block visibly distinguishes emphasized lines from non-emphasized lines

#### Scenario: Copy affordance is available
- **WHEN** a user views a rendered fenced code block
- **THEN** a copy control is visible or discoverable for that block
- **AND** activating it copies the block content as plain text

### Requirement: Code highlighting configuration is explicit and project-owned
The system SHALL define code highlighting configuration in project code instead of relying on implicit framework defaults.

#### Scenario: Build uses explicit highlighting configuration
- **WHEN** the project builds markdown or MDX content
- **THEN** the build uses an explicit highlighting configuration that declares theme behavior and language handling strategy

