# Copilot instructions for Codeholics

Quick reference for future Copilot sessions working in this repository.

## Build, test, and lint commands
- Preferred local dependency workflow:
  - `uv venv`
  - `uv sync`
- Build the site locally:
  - `pelican -s pelicanconf.py`
- Rebuild with output cleanup:
  - `pelican -d -s pelicanconf.py`
- Watch and regenerate on changes:
  - `pelican -r -s pelicanconf.py`
- Serve the generated site locally:
  - `pelican --listen -s pelicanconf.py`
- Build with production settings:
  - `pelican -s publishconf.py`
- Run commands inside the uv-managed environment:
  - `uv run pelican -s pelicanconf.py`
  - `uv run pelican --listen -s pelicanconf.py`
- Theme frontend tooling:
  - `cd themes/pelican-bootstrap-5/frontend-tools`
  - `npm install`
  - `npx gulp`
  - Individual tasks: `npx gulp scssTask`, `npx gulp deliverCssTask`, `npx gulp jsMinifyTask`, `npx gulp deliverJsTask`, `npx gulp cleanTask`
- Docker workflow:
  - `docker-compose -f docker/docker-compose.yml build`
  - `docker-compose -f docker/docker-compose.yml up`
- Tests and linting:
  - No test suite or linter is configured in this repository right now.
  - If tests are added later, prefer documenting single-test commands such as `pytest path/to/test_file.py::test_name`.

## High-level architecture
- This is a Pelican-generated static site. Source content lives under `content/`, with images under `content/images/`.
- `pelicanconf.py` is the main development configuration. `publishconf.py` imports it and applies production overrides like `RELATIVE_URLS = False` and `DELETE_OUTPUT_DIRECTORY = True`.
- The active theme is `themes/pelican-bootstrap-5`. Theme source assets and Node/Gulp tooling live under `themes/pelican-bootstrap-5/frontend-tools`, while generated theme assets are copied into the theme's `static/assets` directories.
- Pelican plugins are not vendored in this repo. The site expects a sibling checkout at `../pelican-plugins` via `PLUGIN_PATHS = ['../pelican-plugins']`.
- Generated site output goes to `output/`. Deployment copies that generated output rather than source files.
- CI and deploy workflows in `.github/workflows/` check out both this repo and `Codeholics/pelican-plugins`, then run a Pelican build before deployment.

## Key conventions
- Prefer direct `pelican ...` and `uv run pelican ...` commands in docs and automation; `tasks.py` exists as an optional wrapper, not the primary workflow.
- Python dependency management has moved to `pyproject.toml` and `uv.lock`. The declared Python requirement is `>=3.13`.
- The GitHub Actions workflows use `actions/setup-python`, `astral-sh/setup-uv`, `uv sync`, and `uv run pelican ...` for builds.
- Theme asset changes may require both frontend rebuilds in `themes/pelican-bootstrap-5/frontend-tools` and a subsequent Pelican site rebuild.
- `pelicanconf.py` enables specific plugins and theme integrations: `webassets`, `liquid_tags`, `tag_cloud`, `gzip_cache`, `tipue_search`, and `i18n_subsites`. Preserve those integrations when editing config.
- Search is wired through Pelican direct templates and the theme: `DIRECT_TEMPLATES` includes `search`, and `tipue_search` is enabled.
- Do not edit or commit files under `output/`; regenerate them instead.
- Workflow automation currently targets the `dev` branch in `.github/workflows/build.yml` and `.github/workflows/deploy.yml`.
- The deploy workflow uses `appleboy/scp-action` to copy `codeholics/output/*` into `${{ secrets.DEV_PATH }}` with `strip_components: 2` and `rm: true`.

## Project docs and assistant config
- Primary repo docs are `README.md`, `pelicanconf.py`, `publishconf.py`, and the workflow files under `.github/workflows/`.
- No additional assistant-specific config files were found in the repository root: `CONTRIBUTING.md`, `CLAUDE.md`, `AGENTS.md`, `.cursorrules`, `.windsurfrules`, `CONVENTIONS.md`, `AIDER_CONVENTIONS.md`, and `.clinerules` are absent.
