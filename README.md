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
