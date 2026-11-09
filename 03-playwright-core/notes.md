# Phase 3 Notes: Playwright Core

## Exercise 1: Install Playwright and run the example tests

### Setup
- Created a separate project folder `03-playwright-core` (own package.json)
- `npm init playwright@latest` → TypeScript, tests folder `tests`, no GitHub Actions (yet), install browsers
- Requires Node.js 20, 22 or 24 (I have 24)

### Created files
| File | Purpose |
| --- | --- |
| `playwright.config.ts` | Settings: browsers, timeouts, reports, base URL |
| `tests/example.spec.ts` | Example tests (`.spec.ts` = Playwright test file naming) |
| `package.json` | Records `@playwright/test` |
| `.gitignore` | Ignores node_modules, test-results, playwright-report |

### First run
- `npx playwright test` → 6 passed (2 tests × 3 browsers), 5 workers in parallel, 9.3s
- Default: headless (no window), parallel, on Chromium + Firefox + WebKit (Safari's engine)
- Workers = separate processes running tests at the same time

### Commands
| Command | What it does |
| --- | --- |
| `npx playwright test` | Run all tests (headless, all browsers) |
| `npx playwright test --headed` | Show the browser window (fast, hard to follow) |
| `npx playwright test --project=chromium` | Only one browser |
| `npx playwright test tests/file.spec.ts` | Only one file |
| `npx playwright test --ui` | UI Mode: run tests one by one, see every step, time-travel |
| `npx playwright test --debug` | Inspector: pause and step through line by line |
| `npx playwright show-report` | Open the HTML report (stop with Ctrl + C) |
- `--debug` pauses BEFORE the first action (blank page is normal). Controls are in the
  Playwright Inspector window: Step over = one action, Resume = run on, Pick locator = find locators
- Playwright uses its own browser ("Google Chrome for Testing"): no extensions or logins, always cleangit add .


## Exercise 2: First own tests (SauceDemo login)

### Config changes (playwright.config.ts → use)
- `baseURL: 'https://www.saucedemo.com'` → tests use `page.goto('/')`
- `testIdAttribute: 'data-test'` → `getByTestId` reads SauceDemo's `data-test` (default is `data-testid`)

### Tests (tests/login.spec.ts), grouped with `test.describe('Login', ...)`
| Test | Checks |
| --- | --- |
| valid user can log in | URL contains inventory.html + title text "Products" |
| locked out user cannot log in | error contains "locked out" |
| wrong password shows error | error contains "do not match" + still on "/" |

Result: 3 passed (chromium)

### Key ideas
- `{ page }` = a fresh, isolated browser tab for every test
- **Auto-waiting**: Playwright waits for elements to be ready before clicking/typing (no sleeps)
- **Web-first assertions**: `expect` retries until it passes (default 5s), then fails
- Check more than one signal (URL + visible text), since one signal can lie
- When a test fails, first ask: is the APP wrong or the TEST wrong?

### Locators used
| Locator | Finds |
| --- | --- |
| `page.getByLabel('Username')` | input by its label / aria-label (case-insensitive, partial match by default) |
| `page.getByRole('button', { name: 'Login' })` | element by role + accessible name |
| `page.getByTestId('error')` | element by `data-test` (after config change) |

- `getByRole` needs a real ARIA role: `textbox`, `button`, `link`, `checkbox`, `heading`...
  (`getByRole('username')` is wrong: "username" is not a role)
- `{ exact: true }` makes label/text matching strict

### Assertions used
| Assertion | Meaning |
| --- | --- |
| `toHaveURL(/inventory\.html/)` | URL matches a regex (contains inventory.html) |
| `toHaveURL('/')` | URL is exactly the baseURL home |
| `toHaveText('Products')` | element text is exactly this |
| `toContainText('locked out')` | element text includes this |

### Debugging lessons
- `X is not a function` + `undefined` = usually a typo in a name (`desscribe`)
- "Cannot find name 'process'" → install Node types: `npm i --save-dev @types/node`
- Problems panel entries labeled `playwright` come from the last extension run: re-run or reload the window
- VS Code: `TypeScript: Restart TS Server` and `Developer: Reload Window` refresh stale errors
- UI Mode on failure: red step + Errors tab (Expected vs Received) + snapshot of the page



## Exercise 3: Products page tests (tests/products.spec.ts)

### Tests (grouped in `test.describe('Products Page', ...)`)
| Test | Checks |
| --- | --- |
| shows 6 products | `toHaveCount(6)` on product names |
| adding and removing a product | badge shows "1", Remove button visible, badge hidden after removing |
| sorting by price low to high | prices read from page equal a sorted copy |

### New ideas
- `test.beforeEach` runs before EACH test in the group (login once in code, DRY);
  every test still gets its own fresh page and its own login
- A locator saved in a variable is a description: it searches again every time it's used
- `<select>` dropdown = role `combobox`; `selectOption({ label: '...' })` picks by visible text
  (or `selectOption('value')` by the hidden option value, e.g. 'lohi')
- `allTextContents()` = texts of all matching elements as an array
- `parseFloat(text.replace('$', ''))` turns '$7.99' into 7.99
- `[...arr].sort((a, b) => a - b)` = sorted copy (numbers, small to large)
- Plain-value assertions (`expect(array).toEqual(...)`) need no `await`;
  page assertions (`expect(locator).toHaveText(...)`) do

### New assertions
| Assertion | Meaning |
| --- | --- |
| `toHaveCount(n)` | locator finds exactly n elements |
| `toBeVisible()` / `toBeHidden()` | element shown / not shown (or doesn't exist) |
| `toEqual(value)` | same content (arrays/objects), item by item |

### Debugging lessons
- 'Price(low to high)' (missing space) → test hung ~30s on "Select option":
  Playwright waited for an option that never appeared
- **Slow failure** = waiting for something that never appears (wrong locator/label/option)
- **Fast failure** = wrong assertion (e.g. high-to-low gives Received in reverse order)
- The login looked missing in UI Mode, but Before Hooks passed and the filmstrip showed products:
  click the exact action to see the snapshot at that moment



  ## Exercise 4: Full checkout flow (tests/checkout.spec.ts)

### Tests
| Test | Journey |
| --- | --- |
| user can buy a product | add backpack → cart → shipping info → verify total → finish → "Thank you for your order!" |
| checkout requires a first name | empty first name → error "First Name is required", stays on step one |

### New ideas
- **E2E test** = a complete user journey; protects the main business flow
- `test.step('name', async () => { ... })` groups actions into named stages in reports/UI Mode
- Check the URL at each stage, like checkpoints
- Money checks: Backpack $29.99 + 8% tax $2.40 = total $32.39
- `getByPlaceholder('First Name')` finds inputs by their hint text

### Strict mode & timing lesson
- Error: `strict mode violation: ... resolved to 6 elements`
  → a locator used for one element matched several; Playwright refuses to guess
- Cause: SauceDemo changes the URL to cart.html BEFORE redrawing the page,
  so the check ran while the products page was still visible
- Fix: wait for something unique to the new page (`title` = "Your Cart"),
  then `toHaveCount(1)` before `toHaveText(...)`
- Rule: a changed URL is not proof the new page is ready
- `aka getByTestId(...)` in errors = Playwright suggests unique alternative locators



## Exercise 5: Evidence for failed tests (screenshots, videos, traces)

### Config (playwright.config.ts → use)
- `screenshot: 'only-on-failure'` → picture of the page when a test fails
- `video: 'retain-on-failure'` → records every test, keeps the video only on failure
- `trace: 'retain-on-failure'` → keeps a full trace on failure
- Replaced `trace: 'on-first-retry'`: locally retries = 0, so it never recorded anything

### Why
- On CI, tests run with nobody watching: evidence shows WHAT happened without re-running
- "Only on failure" saves time and disk space: passing tests need no evidence

### Where to find it
- HTML report (`npx playwright show-report`) → failed test → scroll down: Screenshots, Videos, Traces
- Files in `test-results/<test-folder>/`: `.png` screenshot, `.webm` video, `trace.zip`
- Open a trace directly: `npx playwright show-trace test-results/<folder>/trace.zip`
- `test-results/` is in `.gitignore`: generated files are never committed

### Reading the failure
- `Expected substring: "$32.40"` vs `Received string: "Total: $32.39"` (`toContainText` = substring check)
- `Timeout: 5000ms` = expect retried for 5s before failing
- Test Steps show which `test.step` failed; later steps never run
- Trace Viewer = UI Mode saved to a file: actions, before/after snapshots, network, console, errors
- `error-context.md` = text summary of the error + page structure: useful for AI tools (Phase 8)



## Phase 3 Checkpoint: Login checklist (tests/login-checklist.spec.ts)

Result: 9 passed (chromium)

| # | Check | How |
| --- | --- | --- |
| 1–5 | Empty username / empty password / both empty / wrong password / locked user | Data-driven: array of scenarios + `for...of` creating one test each |
| 6 | Password field hides text | `toHaveAttribute('type', 'password')` |
| 7 | Error can be closed | click `error-button` → error `toBeHidden()` |
| 8 | Logout returns to login | Open Menu → Logout → URL '/' + Login button visible |
| 9 | Products blocked when logged out | `goto('/inventory.html')` → back to '/' + error "when you are logged in" |

### Key ideas
- Data-driven in Playwright = Phase 1 pattern: `for (const s of data) { test(\`name ${s.name}\`, ...) }`
- Test names must be UNIQUE: use a template literal with the scenario name
- `interface` describes the shape of each scenario (TypeScript catches typos in test data)
- Security checks: masked password field, protected pages without a session
- One file combines Phases 1–3: TS interfaces, arrays/loops, locators, assertions, beforeEach

- Logout on SauceDemo is `getByRole('button', { name: 'Logout' })`, not 'link'
- Never assume a role from how an element LOOKS (or from memory): verify with Pick locator or Inspect
- When a test fails, trust the evidence (error + Pick locator) over your expectations