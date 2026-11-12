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