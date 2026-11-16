# Phase 6 Notes: Advanced Playwright (in the playwright-qa-framework capstone)

## Exercise 1: Network mocking (tests/ui/mocking.spec.ts)

### Why mock
- Playwright sits between the page and the server: read, change, replace or block requests
- Test edge cases (empty list, very long names), errors (500), missing backends, flaky services
- Practice page: https://demo.playwright.dev/api-mocking (fruits from /api/v1/fruits)

### Tools
| Code | Does |
| --- | --- |
| `page.route(pattern, handler)` | intercept matching requests |
| `route.fulfill({ json })` | answer with fake data, server never called |
| `route.fetch()` + `route.fulfill({ response, json })` | real answer, modified |
| `route.abort()` | block the request |

- Set `page.route(...)` BEFORE `page.goto(...)`, or the request slips through
- URL patterns: `*/**/api/v1/fruits` (any site/path) · `**/*.{png,jpg}` (`{a,b}` = a or b)

### Tests
- Replace: only "Strawberry" shown
- Modify: real fruits + "Loquat"
- Edge case: 100-character fruit name still visible (`'Super'.repeat(20)`)
- Block images on SauceDemo: still 6 products; Console shows `net::ERR_FAILED` per blocked image

### Observations
- Blocked images show their ALT TEXT ("Sauce Labs Backpack"): good accessibility
- Full URLs in `goto` when testing another site than the baseURL


## Exercise 2: Visual regression (tests/ui/visual.spec.ts)
- `expect(page).toHaveScreenshot('name.png')` compares with a BASELINE image
- `--update-snapshots` creates/updates baselines (folder `visual.spec.ts-snapshots/`)
- File names include browser + OS: `login-page-chromium-darwin.png` (darwin = Mac); CI on Linux needs its own
- `{ fullPage: true }` = whole page · `expect(locator).toHaveScreenshot()` = one element
- `locator.filter({ hasText: '...' })` narrows a list to the item containing that text
- Element screenshots are more focused: the red title broke the PAGE test, not the CARD test
- Failure → report shows Expected / Actual / Diff + slider
- ORDER MATTERS: `addStyleTag` after the screenshot changed nothing; before it → diff
- Wait for the page (title) BEFORE taking a screenshot

## Exercise 3: Accessibility (tests/ui/accessibility.spec.ts, utils/a11y.ts)
- a11y = usable by people with disabilities (screen readers, keyboard-only, low vision)
- `@axe-core/playwright`: `new AxeBuilder({ page }).withTags(['wcag2a','wcag2aa']).analyze()`
- WCAG A/AA = legal minimum; impacts: minor / moderate / serious / critical
- Fail only on NEW serious/critical issues; known ones listed with date + reason
- Full report attached: `test.info().attach(...)` → UI Mode / report → Attachments
- Keyboard-only login: focus → type → Tab → `toBeFocused()` → Enter
- `tsconfig`: `"esModuleInterop": true` for default imports (`import AxeBuilder from ...`)
- `toHaveURL(/inventory\.html/)` = REGEX (contains) · `toHaveURL('/inventory.html')` = STRING (exact)

### Findings
- WCAG A/AA scan: 0 violations on login and products pages ✅
- `select-name` in the known list was NEVER observed (copied example) → removed.
  Lesson: verify before documenting; a fake known issue can hide a real one later.
  Settled with one controlled experiment: empty list → still passes
- Full scan (all rules): `page-has-heading-one` (moderate, best practice):
  products page has no <h1> ("Products" is a span) → affects screen reader users
  navigating by headings; `getByRole('heading', { level: 1 })` finds nothing

## Exercise 4: Browser features (tests/ui/browser-features.spec.ts)
- Playwright never switches tabs: `page` = original, the new tab gets its own variable
- New tab: `const popupPromise = page.waitForEvent('popup')` → click → `await popupPromise`
- "Promise first": start waiting BEFORE the action (same for downloads, responses, dialogs)
- Check BOTH tabs: the new one opened correctly AND the original one is still intact
- Frames: `page.frameLocator('frame[name="..."]')`, chainable for nested frames
- `<frameset>` pages have NO <body> → `page.locator('body')` = element not found
- Upload: `locator.setInputFiles(path)` skips the OS file dialog
- `path.resolve(__dirname, '../../...')` = reliable full path from the test file's folder
- `ENOENT` = no such file (a test problem, not an app problem: check paths first)

## Exercise 5: Mobile emulation (tests/ui/mobile.spec.ts)
- Project `mobile-chrome`: `...devices['Pixel 7']` (small viewport, touch, mobile user agent)
- `grep: /@mobile|@smoke/` = this project only runs matching tests (checkout works on a phone ✅)
- Group-level skip: `test.skip(({ isMobile }) => !isMobile, 'reason')` skips BEFORE fixtures run
  (a skip inside the test body runs all fixture setup first = wasted time)
- `.tap()` = touch · `page.viewportSize()` = screen size
- Mobile layout: products in ONE column (responsive design)
- UI Mode: choose projects via the filter (setup + mobile-chrome)

## Practice mode
- Practice branch: `git rm` the files → rebuild → `git diff main -- file` → `git branch -D`
- New files must be `git add`ed before `git diff` can compare them
- `git --no-pager diff` = print directly, no viewer · in the viewer: `q` to quit
- Close tabs of deleted files (stale tabs cause fake errors)
- Fix PR on main: removed the unverified a11y known issue + moved the mobile skip to group level