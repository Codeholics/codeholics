# ui/code-highlighting Specification

## Purpose

Define consistent markdown and MDX code highlighting behavior for Astro pages so fenced code blocks remain readable, language-aware, and presentation-enhanced without requiring mass content rewrites.

## Requirements

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

### Requirement: Inline code delimiters render without literal marker leakage
The system SHALL render valid markdown inline code spans without exposing delimiter markers in visible article text and SHALL avoid introducing additional marker leakage when legacy malformed delimiters are encountered.

#### Scenario: Valid inline code renders as code text only
- **WHEN** a post includes a valid inline code span such as `` `mycroft.conf` ``
- **THEN** the rendered output shows only the inline code content
- **AND** no surrounding backtick markers are shown to readers

#### Scenario: Legacy malformed inline code remains readable
- **WHEN** a post includes a known malformed legacy inline-code delimiter pattern
- **THEN** the rendered output remains human-readable and does not show duplicated or dangling delimiter markers beyond the original content

### Requirement: Transitional normalizer is constrained and observable
The system SHALL support a temporary normalization mode for clearly recognizable malformed inline-code delimiter patterns in existing content, and SHALL report when normalization is applied.

#### Scenario: Safe malformed pattern is normalized
- **WHEN** content matches a configured malformed inline-code pattern that has a deterministic correction
- **THEN** the markdown processing pipeline applies the configured correction before render
- **AND** the resulting output preserves intended inline-code semantics

#### Scenario: Ambiguous malformed pattern is not silently rewritten
- **WHEN** content includes malformed inline-code delimiters that cannot be corrected unambiguously
- **THEN** the system does not apply a speculative rewrite
- **AND** the content is surfaced through diagnostics for manual correction

### Requirement: Strict lint enforcement is phased from warn to block
The system SHALL define phased lint enforcement for malformed inline-code delimiters, beginning with non-blocking diagnostics and transitioning to blocking checks after the cleanup window.

#### Scenario: Cleanup window emits warnings only
- **WHEN** malformed inline-code delimiters are detected during the defined transition period
- **THEN** lint diagnostics are emitted in local and CI workflows
- **AND** the checks do not fail publication or merge gates

#### Scenario: Post-transition malformed inline code is blocked
- **WHEN** the transition window has ended and malformed inline-code delimiters are detected
- **THEN** CI or configured build checks fail
- **AND** new malformed patterns cannot be merged until corrected

### Requirement: Contributor guidance documents canonical inline-code authoring
The system SHALL provide contributor-facing documentation for canonical inline-code delimiter usage, supported exceptions, and remediation workflow for lint findings.

#### Scenario: Contributor can remediate a lint finding
- **WHEN** a contributor receives an inline-code delimiter lint warning or failure
- **THEN** project documentation identifies the valid authoring format
- **AND** the documentation includes steps to correct the source markdown and rerun checks
