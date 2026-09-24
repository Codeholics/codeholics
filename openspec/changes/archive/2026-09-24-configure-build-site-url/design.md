# Design

## Context

See `proposal.md` for motivation. The current Astro configuration imports a hard-coded `SITE_URL` constant into both `astro.config.mjs` and `src/pages/rss.xml.js`. That keeps production builds stable, but it also means non-production builds still emit `https://www.codeholics.com` in RSS and any other absolute-URL surfaces that rely on the same source. The repo already distinguishes canonical URL concerns from asset-origin concerns by using `ASSET_URL` only for dev-served assets.

## Goals / Non-Goals

**Goals:**
- Resolve the canonical site URL from one shared build-time source.
- Preserve today's production URL when no override is provided.
- Ensure Astro config and RSS use the same resolved value.
- Fail early when an override is malformed.

**Non-Goals:**
- Changing how dev asset URLs are configured with `ASSET_URL`.
- Introducing per-environment config files or a deployment service.
- Rewriting unrelated root-relative `public/` asset URLs.

## Decisions

### Resolve canonical URL in one shared helper
Create a single site-URL helper/module that exposes the default production URL and a resolver for the build-time override. Both `astro.config.mjs` and `src/pages/rss.xml.js` should import from that shared source instead of each carrying their own fallback logic.

Why this approach:
- Keeps the configured Astro `site` value and RSS fallback from drifting apart.
- Preserves the current structure where one module owns the canonical URL.

Alternatives considered:
- Read `process.env` separately in each consumer: simpler short term, but risks inconsistent defaults and validation.
- Keep a hard-coded constant and only override RSS: would leave other absolute-URL surfaces on the production host.

### Use a dedicated build-time env var for canonical URL
Use a dedicated environment variable for canonical site URL rather than reusing `ASSET_URL`.

Why this approach:
- `ASSET_URL` already means asset origin in this repo and is currently dev-focused.
- Canonical URL affects build output semantics, not just where assets are fetched from.

Alternatives considered:
- Reuse `ASSET_URL`: conflates two different concerns and makes future behavior harder to reason about.
- Use only a checked-in constant: does not satisfy dev-targeted builds.

### Validate overrides as absolute URLs before build output is generated
The resolver should reject invalid overrides with a clear error before the build proceeds.

Why this approach:
- Avoids silently shipping malformed RSS or canonical URLs.
- Matches the repo's existing pattern of validating URL-like env vars early.

Alternatives considered:
- Accept any string and let downstream consumers fail: produces harder-to-diagnose build artifacts.
- Normalize relative values into absolute ones: adds policy that the user did not request.

### Update tests at the RSS surface
Extend RSS coverage so at least one test exercises the overridden canonical URL and one test preserves the production default path.

Why this approach:
- RSS is the current observable absolute-URL surface in the repo.
- It verifies the user-visible effect without over-specifying internal implementation.

Alternatives considered:
- Rely only on manual build inspection: lower confidence and easier to regress.

## Risks / Trade-offs

- [More environment-driven behavior] -> Mitigation: keep a production fallback so local/default builds still work without extra setup.
- [Name confusion with `ASSET_URL`] -> Mitigation: document the canonical URL variable separately and keep asset-origin behavior unchanged.
- [Future canonical surfaces might bypass the helper] -> Mitigation: centralize resolution in one module and reference it from all absolute-URL producers.

## Migration Plan

1. Introduce the shared canonical URL resolver with production fallback and validation.
2. Switch Astro config and RSS generation to consume that resolver.
3. Update docs and tests to cover default and overridden build behavior.
4. Deploy production without the new env var to confirm backward compatibility.
5. Deploy the dev target with the env var set to confirm absolute URLs match the dev host.
