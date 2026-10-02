# Tasks

## 1. Canonical site URL configuration

- [x] 1.1 Replace the hard-coded canonical site URL constant with a shared build-time resolver and verify `cd astro && npm run build` succeeds with no site URL env var set
- [x] 1.2 Apply the shared resolver to Astro config and RSS generation and verify a build with `SITE_URL=https://dev.codeholics.com npm run build` emits RSS links under `https://dev.codeholics.com`
- [x] 1.3 Reject malformed canonical site URL overrides in the shared resolver and verify `SITE_URL=not-a-url npm run build` fails with a clear validation error

## 2. Coverage and documentation

- [x] 2.1 Update RSS or build-facing tests for default and overridden canonical URLs and verify the targeted test command passes
- [x] 2.2 Document the new build-time canonical URL environment variable in repo docs and verify the documented command examples match the implemented variable name and behavior
