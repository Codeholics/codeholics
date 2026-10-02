# deployment/astro-production-cutover Specification

## Purpose

Define the production cutover behavior that retires Pelican from this repository and makes Astro the only supported build and deploy source.

## Requirements

### Requirement: Production automation builds and deploys Astro only
The system SHALL build and deploy production artifacts from the Astro project only, and SHALL NOT run Pelican build steps in CI or deployment workflows.

#### Scenario: CI build path is Astro-only
- **WHEN** repository build automation runs on the default deployment branch
- **THEN** the workflow executes Astro dependency install and Astro build commands
- **AND** no Pelican dependency sync or Pelican build command is executed

#### Scenario: Deploy artifact comes from Astro output
- **WHEN** deployment automation publishes site files
- **THEN** the deployed artifact source is Astro build output
- **AND** Pelican `output/` artifacts are not used

### Requirement: Pelican runtime paths are retired after migration parity
The system SHALL require migration parity verification before removing Pelican runtime/configuration paths from the repository, and SHALL retire those paths once parity is confirmed.

#### Scenario: Migration parity gate passes
- **WHEN** the migration gate confirms each legacy Pelican post has a corresponding Astro post representation
- **THEN** Pelican-specific runtime/configuration files and workflows are eligible for removal in the same cutover change

#### Scenario: Migration parity gate fails
- **WHEN** any legacy Pelican post is missing from Astro content
- **THEN** Pelican path removal is blocked until parity is restored

### Requirement: Cutover policy permits URL changes and reindexing
The system SHALL treat the cutover as break-and-reindex, and SHALL NOT require preservation of legacy Pelican URL patterns.

#### Scenario: Legacy URL compatibility not required
- **WHEN** the cutover is applied
- **THEN** legacy Pelican URL rewrites are not required for acceptance
- **AND** operational documentation declares that reindexing is expected after deployment
