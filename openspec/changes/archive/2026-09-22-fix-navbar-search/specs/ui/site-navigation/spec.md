# Spec Delta

## Purpose

Define the expected observable behavior for the site's navigation search control so desktop users have an operable, accessible, and consistent search experience (parity with the existing mobile search form).

## ADDED Requirements

### Requirement: Desktop search control is operable
The system SHALL expose a desktop search control (icon button and either visible or revealed input) that performs site searches by submitting to the existing `/search.html` endpoint using query parameter `q`. The control SHALL be keyboard accessible and announce its purpose to assistive technologies.

#### Scenario: Desktop search button opens inline input
- **WHEN** the viewport width is >= 768px and a keyboard or pointer user activates the desktop search control
- **THEN** either an inline search input becomes visible and receives focus or the existing visible input receives focus, and the control is labelled for screen readers (e.g., `aria-label="Search"`).

#### Scenario: Desktop search submits query
- **WHEN** a user types a query into the desktop search input and submits (Enter or activates submit control)
- **THEN** the browser navigates to `/search.html?q=<user-query>` and the query is encoded per URL standards

#### Scenario: Search results page exists
- **WHEN** a user submits a query from the desktop or mobile search form
- **THEN** `/search.html` renders a search results experience for that query within the Astro site

#### Scenario: Keyboard accessibility
- **WHEN** a keyboard-only user tabs into the header
- **THEN** the search control is reachable in logical order, shows a visible focus indicator, and activating it follows the open/focus behavior described above

## MODIFIED Requirements

### Requirement: Mobile and desktop search parity
The system SHALL ensure the desktop search control and the existing mobile search form present equivalent behavior for submitting searches and for accessibility semantics (labels, focus management, and form semantics).

#### Scenario: Behavior parity
- **WHEN** performing the same query on desktop (inline input) and mobile (mobile panel form)
- **THEN** both navigate to `/search.html?q=` with the same encoded query and expose equivalent accessible labels and keyboard interactions
