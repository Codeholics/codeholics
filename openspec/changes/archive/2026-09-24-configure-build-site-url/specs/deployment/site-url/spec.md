# Spec Delta

## Purpose

Allow Astro builds to target different deployment hosts without editing source files so generated absolute URLs match the environment being deployed.

## ADDED Requirements

### Requirement: Build accepts canonical site URL override
The system SHALL allow the Astro build to override the canonical site URL with a build-time environment variable that is applied consistently wherever the site configuration needs an absolute deployment URL.

#### Scenario: Dev build uses override URL
- **WHEN** a build runs with a canonical site URL environment variable set to `https://dev.codeholics.com`
- **THEN** the build uses `https://dev.codeholics.com` as the canonical site URL for generated absolute URLs

### Requirement: Build keeps production canonical URL as fallback
The system SHALL use the current production canonical URL when the build-time canonical site URL environment variable is not set.

#### Scenario: Default build keeps production URL
- **WHEN** a build runs without the canonical site URL environment variable
- **THEN** generated absolute URLs use `https://www.codeholics.com`

### Requirement: Invalid canonical site URL is rejected
The system SHALL fail the build with a clear error when the canonical site URL environment variable is set to a value that is not a valid absolute URL.

#### Scenario: Invalid override fails build
- **WHEN** a build runs with the canonical site URL environment variable set to a non-URL value
- **THEN** the build fails before generating output
- **AND** the error indicates that the site URL must be a valid absolute URL
