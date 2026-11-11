# Phase 5 Notes: API Testing (in the playwright-qa-framework capstone)

## Exercise 1: First API tests (Restful-Booker)

### Why API tests
- No browser: milliseconds instead of seconds, very stable
- Test the data and rules behind the UI; find backend bugs early
- Teams have many API tests and fewer UI tests (test pyramid)

### Restful-Booker
- Practice CRUD API with auth, deliberately buggy; resets every 10 minutes
- Shared public environment: ids like 778 mean many people use it
  → never rely on fixed ids; create your own data and use the returned id
- Quirk: creating returns 200, not the standard 201 Created

### Setup in the framework
- `.env`: API_BASE_URL, API_USERNAME, API_PASSWORD (template in .env.example)
- `utils/env.ts`: shared `requireEnv()` (moved out of users.ts, DRY)
- `test-data/bookings.ts`: `Booking` interface + `newBooking`
- Config: browser projects `testDir: './tests/ui'`; new `api` project with
  `testDir: './tests/api'`, its own `baseURL`, `extraHTTPHeaders: { Accept: 'application/json' }`,
  no storageState, no dependencies

### Playwright API testing
| Code | Meaning |
| --- | --- |
| `async ({ request })` | API client fixture, no browser |
| `await request.get('/booking')` | send GET |
| `await request.post('/booking', { data })` | POST JSON (Content-Type set automatically) |
| `response.status()` | status code |
| `await response.json()` | parse the body |
| `Array.isArray(body)` | check it's a list (typeof says 'object') |
| `toBeGreaterThan(0)` / `toEqual(obj)` | number check / exact object match |

### Tests
- GET /booking → 200, non-empty array, bookingid is a number
- POST /booking → 200, then GET /booking/:id returns exactly what was sent (create → read back)
- GET /booking/999999999 → 404

### Reading a trace (Network tab)
- Report shows only the LAST run; run API tests last to see them
- `--trace on` records traces even for passing tests
- Request headers: user-agent, accept (from config), content-type (auto), content-length
- Response: Content-Length bigger (adds bookingid), Etag (cache), Nel/Report-To (noise)
- `X-Powered-By: Express` = security finding: reveals server technology, should be removed
- Duration ~951ms per request (network trip to Heroku)