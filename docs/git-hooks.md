## Git Hooks & Local Checks

This repository uses a root-level pre-commit hook to enforce basic quality checks across subprojects.

### Location

- Hooks live at repo root: `.husky/pre-commit`
- Git is configured to use this path: `git config core.hooksPath .husky`

If you freshly clone the repo and hooks don’t run, execute the command above once.

### What runs on commit

The hook only runs checks for projects that have staged changes (diff is filtered by folder prefix).

- Electron (Node) projects
  - For `electron-starter/`:
    - `npm --prefix electron-starter run typecheck`
    - `npx lint-staged --cwd electron-starter`
  - Lint-staged config is in `electron-starter/package.json` and auto-formats/auto-fixes staged files.

- Python projects (optional)
  - Auto-detected by presence of `pyproject.toml` or `requirements.txt`
  - If tools are available, the hook will run in changed Python subprojects:
    - `ruff format .`
    - `ruff check --fix .`
    - `mypy .` (best-effort; does not block if unavailable)
  - Ensure tools are available via your preferred workflow (e.g. `uvx ruff`, `uvx mypy`, or virtualenv binaries).

- Deno projects (optional)
  - Auto-detected by presence of `deno.json` or `deno.jsonc`
  - If `deno` is available, the hook runs in changed Deno subprojects:
    - `deno fmt --check`
    - `deno lint`

### Adding a new project

- Node/TypeScript project
  - Add scripts in its `package.json`:
    - `typecheck`: run your TypeScript checks (e.g. `tsc --noEmit`)
  - Add a lint-staged config so format/lint is applied to staged files.
  - Update `.husky/pre-commit` only if the project folder name does not follow existing detection logic.

- Python project
  - Include `pyproject.toml` or `requirements.txt` so it’s auto-detected.
  - Provide `ruff`/`mypy` in PATH (or adapt the hook to use your venv path).

- Deno project
  - Include `deno.json` or `deno.jsonc` so it’s auto-detected.
  - Keep `deno fmt`/`deno lint` clean.

### Manual runs

- Electron starter:
  - `npm --prefix electron-starter run typecheck`
  - `npx lint-staged --cwd electron-starter` (applies to staged files)

### Troubleshooting

- Hooks not running:
  - Run `git config core.hooksPath .husky`
  - Ensure `.husky/pre-commit` is executable: `chmod +x .husky/pre-commit`
- Tool not found:
  - Install required tools or adapt the hook to your environment.


