# Codeholics

Static site source for [codeholics.com](https://codeholics.com/), built with [Pelican](https://getpelican.com/).

## What you need to know first
- Content lives in `content/`.
- The generated site is written to `output/`.
- The active theme is `themes/pelican-bootstrap-5/`.
- Pelican plugins are expected in a sibling checkout at `../pelican-plugins`.
- Local Python dependencies are managed with `pyproject.toml` and `uv.lock`.

## First-time setup

Clone both repositories side by side:

```bash
git clone git@github.com:Codeholics/codeholics.git
git clone git@github.com:Codeholics/pelican-plugins.git
```

The resulting layout should look like this:

```text
parent-directory/
├── codeholics/
└── pelican-plugins/
```

Install dependencies with [Astral uv](https://docs.astral.sh/uv/):

```bash
cd codeholics
uv venv
uv sync
```

If you do not want to use `uv`, install the project dependencies with your preferred Python environment manager using the packages declared in `pyproject.toml`.

## Start developing locally

Build the site:

```bash
uv run pelican -s pelicanconf.py
```

Serve the generated output locally:

```bash
uv run pelican --listen -s pelicanconf.py
```

Pelican serves the site at `http://127.0.0.1:8000/` by default.

Watch and rebuild automatically while editing:

```bash
uv run pelican -r -s pelicanconf.py
```

Clean rebuild:

```bash
uv run pelican -d -s pelicanconf.py
```

## Common workflows

### Editing content
Most day-to-day edits are in `content/`. After changing markdown or images:

```bash
uv run pelican -s pelicanconf.py
```

### Previewing a production build
Use the production config before deploy-related changes:

```bash
uv run pelican -s publishconf.py
```

`publishconf.py` imports `pelicanconf.py` and applies production overrides such as `RELATIVE_URLS = False` and `DELETE_OUTPUT_DIRECTORY = True`.

### Working on theme assets
The theme has separate frontend tooling under `themes/pelican-bootstrap-5/frontend-tools`.

Install Node dependencies:

```bash
cd themes/pelican-bootstrap-5/frontend-tools
npm install
```

Run the default asset pipeline:

```bash
npx gulp
```

Useful individual tasks:

```bash
npx gulp scssTask
npx gulp deliverCssTask
npx gulp jsMinifyTask
npx gulp deliverJsTask
npx gulp cleanTask
```

The default Gulp task copies built assets into the theme's `static/assets` directories and tries to trigger a Pelican rebuild via `../../../build.sh`. If that script is not present, go back to the repo root and rebuild manually:

```bash
cd /path/to/codeholics
uv run pelican -s pelicanconf.py
```

## Project layout

```text
codeholics/
├── content/                         # Markdown content and images
├── output/                          # Generated site output
├── themes/
│   └── pelican-bootstrap-5/        # Active theme
│       └── frontend-tools/         # Node/Gulp asset pipeline
├── pelicanconf.py                  # Main development config
├── publishconf.py                  # Production overrides
├── pyproject.toml                  # Python dependencies
└── uv.lock                         # Locked Python dependencies
```

## Build, test, and lint commands

Local development commands:

```bash
uv run pelican -s pelicanconf.py
uv run pelican -d -s pelicanconf.py
uv run pelican -r -s pelicanconf.py
uv run pelican --listen -s pelicanconf.py
uv run pelican -s publishconf.py
```

Docker workflow:

```bash
docker-compose -f docker/docker-compose.yml build
docker-compose -f docker/docker-compose.yml up
```

Tests and linting:
- No automated test suite is configured right now.
- No linter is configured right now.

## Deployment and CI

GitHub Actions workflows live in `.github/workflows/`.

- `build.yml` builds on pushes to `dev`.
- `deploy.yml` runs the shared build workflow, rebuilds the site, and copies `output/*` to the server with `appleboy/scp-action`.
- Both workflows check out this repo and `Codeholics/pelican-plugins`.

Example manual deploy command:

```bash
scp -r output/* user@production-host:/var/www/codeholics/
```

Current CI note:
- Workflow files use `actions/setup-python`, `astral-sh/setup-uv`, `uv sync`, and `uv run pelican ...`.

## Optional tools in the repo

`tasks.py` contains Invoke tasks that wrap common Pelican commands, but the primary documented workflow for this project is to run Pelican directly.

## Resources
- Pelican: https://getpelican.com/
- Astral uv: https://docs.astral.sh/uv/

## Astro version (modern JavaScript build)

This repository also contains a migrated Astro site in the `astro/` subdirectory. Use the Astro workflow when developing the modern, Tailwind-powered site.

Recommended Node: see `astro/package.json` (engines). Example (nvm):

```bash
nvm use 22
```

Quick start (inside repo root):

```bash
cd astro
npm install
npm run dev      # start local dev server (hot reload)
```

To set the canonical site URL used during builds, pass `SITE_URL`. When unset, builds keep the production default:

```bash
cd astro
SITE_URL=https://dev.codeholics.com npm run build
```

To make the Astro dev server emit generated asset URLs from a different origin, set `ASSET_URL`:

```bash
cd astro
ASSET_URL=https://cdn-dev.codeholics.test npm run dev
```

Notes:
- `SITE_URL` controls canonical build output such as RSS absolute links and defaults to `https://www.codeholics.com`.
- `ASSET_URL` changes the origin Astro uses for dev-served assets, and the current layout also applies it to favicon URLs from `public/`.
- Other hand-authored root-relative paths from `public/` or templates still need to opt into the same helper if you move them behind that origin.
- Production builds still use the default local asset paths.

### Astro code-highlighting policy

The Astro markdown pipeline normalizes fenced-code language labels before highlighting. This keeps legacy posts working without mass content edits.

- Canonical language IDs currently supported by project config:
  `bash`, `c`, `cpp`, `cs`, `css`, `diff`, `dockerfile`, `go`, `html`, `ini`, `java`, `javascript`, `json`, `lua`, `make`, `markdown`, `plaintext`, `python`, `rust`, `scss`, `sql`, `text`, `toml`, `typescript`, `xml`, `yaml`.
- Alias mappings convert common variants (for example `Python`/`py`/`python3` -> `python`, `HTML`/`html5` -> `html`, `Shell`/`sh`/`zsh` -> `bash`, `ts`/`tsx` -> `typescript`, `yml` -> `yaml`).
- Unknown language labels fall back to `text` so blocks still render safely.
- Unknown labels emit warnings during local and CI builds to make missing mappings visible.

### Astro inline-code delimiter policy (hybrid rollout)

Inline-code delimiter quality now follows a phased policy:

- **Transition (warning mode):** malformed inline-code delimiters are reported but do not fail builds.
- **Steady state (blocking mode):** malformed inline-code delimiters fail lint/build gates.
- During transition, deterministic legacy patterns (for example a dangling trailing backtick after a closed inline span) are normalized at render time and logged.
- Ambiguous malformed patterns are never auto-corrected; they are diagnosed for manual markdown fixes.

Lint commands:

```bash
cd astro
npm run lint:inline-code          # warning mode (default)
npm run lint:inline-code:strict   # blocking mode
```

Build commands:

```bash
cd astro
npm run build                     # includes warning-mode inline-code lint
npm run build:inline-code-strict  # fails on malformed inline delimiters
```

Promotion threshold from warning to blocking:

- Promote CI/default build checks to blocking mode when `npm run lint:inline-code` reports **zero findings in two consecutive default-branch CI runs** and known legacy findings have been remediated.

If you need a new language:
1. Add the canonical language ID to `astro/src/lib/markdown-code.mjs`.
2. Add any desired aliases in the same file.
3. Rebuild Astro (`cd astro && npm run build`) and verify the resulting post output.

Build and preview the static site:

```bash
cd astro
npm run build
npm run preview  # serves the built output
```

Run Playwright end-to-end tests (includes navbar/link checks):

```bash
cd astro
npm run test:e2e
```

Run the targeted canonical URL build checks:

```bash
cd astro
npm run test:site-url
```

Notes:
- `npm run build` generates a production-ready static site with Astro.
- If you want CI integration, run `npm ci && npm run build && npm run test:e2e` in the `astro/` folder.
