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


## Exercise 2: Auth tokens, update & delete

### Restful-Booker auth
- POST /auth { username, password } → { token }
- PUT/PATCH/DELETE need the token as a header: `Cookie: token=...`
- No token → 403 Forbidden

### API client class (api/BookingApi.ts) = POM for APIs
- Holds `request`; endpoints live in ONE place; methods return APIResponse
- Assertions stay in tests (same rule as Page Objects)
- `token?: string` = optional parameter (call without it to test 403)
- `Promise<string | undefined>`: `|` = OR
- `Partial<Booking>` = all fields optional (perfect for PATCH)
- `private` method = only usable inside the class
- `async` ALLOWS await but doesn't require it; returning a promise is fine

### API fixtures (fixtures/api.ts)
- `bookingApi`, `authToken`, `createdBookingId`
- Teardown after `use()`: delete the created booking, leaving no test data behind (shared environment!)
- `expect(value, 'custom message')` → clearer failures
- `const { bookingid } = await response.json()` = destructuring
- Each name needs its own export: `export const test` + `export { expect }`

### Tests
- Valid credentials → token
- Update without token → 403
- Full update (PUT) with token → 200, read back shows the change
- Partial update (PATCH) → only lastname changed
- Delete → 201 (quirk! standard is 200/204), then GET → 404
- `{ ...newBooking, firstname: 'Updated' }` = copy an object and override some fields

### Known bugs with test.fail()
- `test.fail(true, 'Known bug: ...')` = expected to fail; suite stays green, bug documented
- If the bug gets fixed → "Expected to fail, but passed" 🔔 → remove test.fail and update the test
- Bug found: wrong credentials return 200 { reason: "Bad credentials" } instead of 401

### Syntax cheat sheet
- `:` = "is of type" · `=` = "gets the value" · in objects `key: value`
- Order: `const name: Type = value`
- Class methods: `name(params): Type { }` (no =>) · callbacks: `(params) => { }`
- `;` after imports, const, return, await lines; not after closing } of methods/classes/if
- Ctrl + Space = force autocomplete suggestions