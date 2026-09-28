# Spec Delta

## ADDED Requirements

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
