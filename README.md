# Codeholics — Static Pelican Site

A Pelican-based static site for codeholics.com. This README provides quick-start instructions, recommended developer workflows, and where to find project conventions.

Quick links
- Build & developer tasks: use Invoke tasks in tasks.py (recommended)
- Environment manager: Astral uv (optional, preferred when present)
- Theme: themes/pelican-bootstrap-5
- Plugins: expected at ../pelican-plugins (adjacent repo)

## Clone required repositories

# clone main project
git clone git@github.com:Codeholics/codeholics.git

# clone pelican plugins (expected adjacent to this repo)
git clone git@github.com:Codeholics/pelican-plugins.git

## Prerequisites
- Python 3.10+ recommended
- Optional: Docker (for containerized dev) and Node (for theme frontend tooling)
- Optional: Astral uv for environment and lockfile management (https://docs.astral.sh/uv/)

## Recommended developer workflows
Use Pelican and Astral uv directly (Invoke tasks are present but optional). Run commands from the repository root.

Common Pelican commands
- pelican -s pelicanconf.py             # build site (development)
- pelican -d -s pelicanconf.py          # clean build (delete output then build)
- pelican -r -s pelicanconf.py          # regenerate/watch mode
- pelican --listen -s pelicanconf.py    # serve output/ locally (dev server)
- pelican -s publishconf.py             # build production

Publish (rsync example)
- rsync --delete --exclude ".DS_Store" -pthrvz -c output/ user@production-host:/var/www/codeholics/

Astral uv examples (optional)
- uv venv
- uv sync
- uv run pelican --listen
- uv add <pkg> && uv lock

Docker (optional)
- docker-compose -f docker/docker-compose.yml build
- docker-compose -f docker/docker-compose.yml up

Tests / linters
- None configured in the repository at the time of this writing. If tests are added, prefer pytest:
  - pytest path/to/test_file.py::test_name

## Project layout (high level)
- content/ — source markdown and content
- themes/ — theme code, current theme is pelican-bootstrap-5
  - themes/pelican-bootstrap-5/frontend-tools — frontend build tooling (Node/npm)
- output/ — generated site (do not commit)
- tasks.py — Invoke tasks for build/serve/publish
- pelicanconf.py / publishconf.py — dev and production configs

## Important notes and conventions
- Keep a local checkout of pelican-plugins adjacent to this repository at ../pelican-plugins; tasks.py and CI expect plugins to be available there.
- Use Invoke tasks as the canonical interface; they set config paths and the serve behavior.
- Do not commit generated files from output/.
- When changing theme frontend assets, run the frontend tooling inside themes/pelican-bootstrap-5/frontend-tools as required by that theme (Node/npm commands).
- CI workflows check out both this repo and pelican-plugins before installing dependencies and running Pelican.

## Continuous integration / deployment
- GitHub Actions workflows live under .github/workflows/. The CI builds the site by installing dependencies and running Pelican. The deploy workflow rsyncs output/ to the production host using repository secrets.

## Resources
- Pelican: https://getpelican.com/
- Astral uv: https://docs.astral.sh/uv/


## Theme frontend build (themes/pelican-bootstrap-5/frontend-tools)

The theme includes Gulp-based frontend tooling. Typical workflow (from the repo root):

```
cd themes/pelican-bootstrap-5/frontend-tools
npm install        # or npm ci
npx gulp           # runs the default task: build assets, copy to ../static/assets, trigger Pelican build, start watch + BrowserSync
```

Useful individual tasks (via npx gulp <task>):
- npx gulp scssTask       # compile SASS -> build/theme.css
- npx gulp deliverCssTask # copy CSS to ../static/assets/css
- npx gulp jsMinifyTask   # minify theme JS into build/
- npx gulp deliverJsTask  # copy JS to ../static/assets/js
- npx gulp cleanTask      # clean build and static asset dirs
- npx gulp watchTask      # watch for changes (used by default task)

Note: the default Gulp task spawns a build script (build.sh) to run Pelican. If build.sh is not present, run `invoke build` (or `uv run pelican -s pelicanconf.py`) in the repository root after building frontend assets.

## Example deploy rsync and short deploy checklist

A typical rsync-based deploy (used by CI / tasks.py) looks like this:

```
rsync --delete --exclude ".DS_Store" -pthrvz -c output/ user@production-host:/var/www/codeholics/
```

Short deploy checklist:
1. Update content or theme.
2. Build production site: `invoke preview` (uses publishconf.py).
3. Verify output/ locally (open output/index.html or run a local server).
4. Ensure pelican-plugins is available to the build (../pelican-plugins or CI checkout).
5. Run rsync example above or `invoke publish` after configuring deploy host/destination in tasks.py.
