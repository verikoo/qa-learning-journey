# Phase 7 Notes: CI/CD (in the playwright-qa-framework capstone)

## Exercise 1: First CI pipeline (.github/workflows/playwright.yml)

### What is CI
- CI = Continuous Integration: tests run automatically on every PR and push
- A red ❌ PR shouldn't be merged: CI is the team's safety net
- GitHub Actions: workflow (YAML file) → job (one cloud machine) → steps (commands)

### YAML
- Indentation IS the structure: 2 spaces per level, never tabs
- `env:` and `steps:` must be INSIDE the job (same level as `runs-on`),
  otherwise GitHub reads them as separate jobs → invalid workflow
- Same indentation = siblings · more indentation = inside (like a folder tree)

### Secrets
- .env is never committed, so CI needs GitHub Secrets:
  repo Settings → Secrets and variables → Actions → New repository secret
- A saved secret is never shown again (only replaced); the edit page always looks empty
- Fast way: `gh secret set -f .env` (all lines at once) · `gh secret list` (names only)
- `env: NAME: ${{ secrets.NAME }}` turns secrets into env variables, so `requireEnv` works the same

### Steps in the workflow
1. `actions/checkout@v4` → download the repo
2. `actions/setup-node@v4` with Node 24
3. `npm ci` → install exact versions from package-lock.json
4. `npx playwright install --with-deps chromium` → browser + Linux libraries (slowest step)
5. `npx playwright test --project=chromium --project=api --grep-invert @visual`
6. `actions/upload-artifact@v4` with `if: ${{ !cancelled() }}` → save the report even if tests fail

### Notes
- `--grep-invert @visual`: Mac (darwin) baselines don't match Linux rendering
- GitHub sets CI=true → config uses 2 retries and 1 worker on CI
- Result: green on the first try, ~50s per run
- A push to a feature branch does NOT trigger CI (only PRs into main and pushes to main)

## Exercise 2: Badge, manual and nightly runs

### Triggers (`on:`)
| Trigger | When |
| --- | --- |
| `push: branches: [main]` | something is pushed or merged into main |
| `pull_request: branches: [main]` | a PR into main is opened or updated |
| `workflow_dispatch:` | "Run workflow" button in the Actions tab |
| `schedule: - cron: '0 3 * * *'` | every day at 03:00 UTC (07:00 Tbilisi) |

### Cron
- 5 fields: minute hour day month weekday · `*` = every
- GitHub uses UTC; scheduled runs can start a few minutes late
- Nightly runs catch problems even with no code changes (the tested websites can change)

### Badge
- `[![Playwright Tests](https://github.com/verikoo/playwright-qa-framework/actions/workflows/playwright.yml/badge.svg)](https://github.com/verikoo/playwright-qa-framework/actions/workflows/playwright.yml)`
- Live passing/failing label at the top of the README; clicking opens the run history

### Results
- 5 green runs: 2 pull requests, 2 pushes to main, 1 manual run
- Every change is tested twice: on the PR, then on main after merging
- "Use workflow from" = which branch's code + YAML to run (can test unmerged branches)
- Artifacts: run page → Artifacts → playwright-report zip → unzip → open index.html



## Exercise 3: Browser matrix (parallel jobs)
- `strategy: matrix: include:` = one job per combination, all running in PARALLEL
- Jobs: UI tests on chromium, firefox, webkit, mobile-chrome + a separate API job
- Parallel = roughly the time of ONE job instead of four
- `${{ matrix.project }}` = the value for this job · used in names, commands, artifact names
- `fail-fast: false` = one failing browser doesn't cancel the others (full picture: "fails only on WebKit")
- The setup project uses the default browser (Chromium), so EVERY job installs Chromium + its own browser:
  `npx playwright install --with-deps chromium ${{ matrix.browser }}`
- Unique artifact names per job (`playwright-report-${{ matrix.project }}`), or reports overwrite each other
- Top-level `env:` = secrets shared by all jobs (DRY)
- API tests in their own job: no browser install, fast
- Result: 5 green checks on the first try; the run Summary shows the jobs side by side