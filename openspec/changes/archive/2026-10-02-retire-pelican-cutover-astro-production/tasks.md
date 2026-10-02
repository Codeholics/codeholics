# Tasks

## 1. Add migration parity gate and pre-removal checks

- [x] 1.1 Implement a parity-check script that compares legacy `content/*.md` entries against `astro/src/content/posts/*.{md,mdx}` and verify it reports pass/fail with explicit missing-item output.
- [x] 1.2 Add a normalization rule for `.md` to `.mdx` equivalents in parity matching and verify known migrated pairs (for example legacy `.md` files now represented as `.mdx`) pass the gate.
- [x] 1.3 Add a CI-invokable pre-removal check command that runs parity verification and verify non-zero exit on intentionally simulated missing Astro counterparts.

## 2. Cut over CI and deployment automation to Astro-only

- [x] 2.1 Replace Pelican build steps in `.github/workflows/build.yml` with Astro install/build steps and verify workflow commands no longer reference `pelican`, `uv`, or `pelicanconf.py`.
- [x] 2.2 Replace Pelican deploy build/artifact paths in `.github/workflows/deploy.yml` with Astro build/deploy artifact paths and verify deployment source points to Astro build output instead of `output/*`.
- [x] 2.3 Remove legacy plugin checkout/dependency steps tied only to Pelican in workflows and verify workflow YAML contains no `pelican-plugins` checkout path.

## 3. Retire Pelican repository surfaces after parity passes

- [x] 3.1 Remove Pelican runtime/configuration files (`pelicanconf.py`, `publishconf.py`, and Pelican-only task wrappers) and verify repository no longer contains active Pelican build entrypoints.
- [x] 3.2 Remove Pelican theme/tooling paths no longer used in production (`themes/pelican-bootstrap-5` and related references) and verify no active docs/workflows reference those paths.
- [x] 3.3 Resolve legacy content path strategy per cutover policy (remove or relocate Pelican-only content paths after parity is confirmed) and verify Astro content remains the sole production content source.

## 4. Update docs and validate break-and-reindex cutover state

- [x] 4.1 Rewrite root documentation to Astro-first/only operational guidance and verify `README.md` no longer describes Pelican as current production workflow.
- [x] 4.2 Update assistant/automation guidance files to remove Pelican production instructions and verify documentation declares break-and-reindex URL policy.
- [x] 4.3 Run final cutover validation (`openspec validate --specs` plus repository grep checks for legacy Pelican production references) and verify only intentional historical mentions remain.
