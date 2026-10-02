# Spec Delta

## Purpose

Establish a warning-only metadata quality check for AI-assisted Astro post generation so repository-required front matter is consistently surfaced before publication.

## ADDED Requirements

### Requirement: AI-assisted drafts are checked for required post metadata
The system SHALL evaluate AI-assisted Astro post drafts under `astro/src/content/posts` for the required front matter fields `title`, `date`, `category`, `tags`, `slug`, and `summary`.

#### Scenario: All required metadata exists
- **WHEN** an AI-assisted draft includes non-empty values for all required metadata fields
- **THEN** the metadata check reports no missing-field warnings for that draft

#### Scenario: Required metadata is missing or empty
- **WHEN** an AI-assisted draft omits one or more required metadata fields or provides empty values
- **THEN** the metadata check reports a warning for each missing or empty required field

### Requirement: Metadata enforcement remains warning-only
The system SHALL report metadata violations as warnings and SHALL NOT block publishing, build, or generation workflows based on missing required metadata.

#### Scenario: Draft has metadata warnings
- **WHEN** metadata warnings are detected for an AI-assisted draft
- **THEN** the workflow completes without failing due to those warnings

### Requirement: Enforcement is scoped to AI-assisted authoring flow
The system SHALL run this metadata warning check only in AI-assisted Astro post generation workflows unless a user explicitly invokes the same check outside that flow.

#### Scenario: Manual-only authoring path
- **WHEN** a post is authored manually without AI-assist workflow invocation
- **THEN** metadata warnings are not automatically emitted by this enforcement flow

#### Scenario: User explicitly invokes metadata check
- **WHEN** a user manually invokes the metadata warning check for an existing post
- **THEN** the same required-field warning rules are applied and reported
