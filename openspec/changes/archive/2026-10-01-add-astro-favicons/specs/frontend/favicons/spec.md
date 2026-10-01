# Spec Delta

## Purpose

Provide PNG favicon assets for the Astro site so browsers and platforms that prefer or require raster icons have consistent, well-sized icons.

## ADDED Requirements

### Requirement: Provide canonical PNG favicons
The site SHALL expose two PNG favicon files at the web root: `/favicon-32x32.png` and `/favicon-16x16.png`. These files SHALL be valid PNG images with the declared pixel dimensions (32x32 and 16x16 respectively).

#### Scenario: Browser requests 32x32 favicon
- **WHEN** a browser requests `/favicon-32x32.png`
- **THEN** the server responds with a 200 status and a PNG whose intrinsic dimensions are 32x32 pixels

#### Scenario: Browser requests 16x16 favicon
- **WHEN** a browser requests `/favicon-16x16.png`
- **THEN** the server responds with a 200 status and a PNG whose intrinsic dimensions are 16x16 pixels

## Compatibility
These assets are purely static and do not change application behavior. They are intended for the Astro site only; no API changes or cross-service contracts are introduced.
