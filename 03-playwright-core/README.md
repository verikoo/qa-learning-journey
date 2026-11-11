# SauceDemo Playwright Tests

Automated UI tests for [SauceDemo](https://www.saucedemo.com) with Playwright and TypeScript.

## Setup
1. `npm install`
2. `npx playwright install`
3. Copy the env template and fill in the values: `cp .env.example .env`

## Run
| Command | What it does |
| --- | --- |
| `npm test` | All tests, all browsers |
| `npm run test:chromium` | All tests, Chromium only |
| `npm run test:smoke` | Only `@smoke` tests (quick check) |
| `npm run test:ui` | UI Mode |
| `npm run report` | Open the last HTML report |

## Structure
| Folder | Contains |
| --- | --- |
| `pages/` | Page objects (one class per page) |
| `fixtures/` | Custom fixtures that give tests ready page objects |
| `test-data/` | Shared test data (credentials come from `.env`) |
| `tests/` | Test specs; `auth.setup.ts` logs in once and saves the session |

## Notes
- Failed tests keep screenshots, videos and traces in `test-results/`
- `.env` and `playwright/.auth/` are never committed