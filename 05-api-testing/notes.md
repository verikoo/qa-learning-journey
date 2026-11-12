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

## Exercise 3: Schema validation with Zod

### Why schemas
- Phase 1 checkpoint: validated each field by hand with if + problems.push (long!)
- Zod: describe the expected shape ONCE, check any data against it
- A schema = a CONTRACT ("this endpoint always returns this shape") → basis of contract testing
- toEqual checks VALUES of my data; schemas check SHAPE and TYPES (missing/extra fields, wrong types, bad dates)

### Zod basics (zod v4, `import { z } from 'zod'`)
| Zod | Means |
| --- | --- |
| `z.string()`, `z.number()`, `z.boolean()` | type checks |
| `.min(1)` / `.int().positive()` / `.nonnegative()` | not empty / whole > 0 / >= 0 |
| `z.iso.date()` | YYYY-MM-DD date string |
| `.optional()` | field may be missing |
| `z.object()` vs `z.strictObject()` | extra keys allowed (stripped) vs extra keys = error |
| `z.array(schema)` | every item matches |
| `schema.safeParse(data)` | `{ success, data }` or `{ success: false, error }`, never throws |
| `result.error.issues` | list of problems: `path` + `message` |
| `z.infer<typeof Schema>` | TypeScript type from a schema |

- Schemas snap together: `CreateBookingResponseSchema` contains `BookingSchema`

### Helper: utils/schema.ts
- `expectToMatchSchema(data: unknown, schema: z.ZodType)`
- Turns issues into `path: message` lines; `expect(problems).toEqual([])` lists ALL problems on failure
- `data: unknown` = untrusted API data

### Tests
- Booking id list, create response, get response match their schemas
- Self-test: broken data (string price, 'tomorrow' date, extra field) must be rejected
- `expect.arrayContaining([...])` = includes at least these items

### Break-the-contract experiment
- Changed `totalprice` to `z.string()` → create + get tests failed with path
  `booking.totalprice` (nested) vs `totalprice` (top level)
- The self-test failed too: the schema now ACCEPTED bad data → the self-test guards the schema itself

### Lessons
- `Received: Promise {}` = something async used without await, or the wrong method (`json()` instead of `status()`)
- Cleanup must survive failures: `try { ...asserts... } finally { delete }`
- Fixture teardown runs even when the test fails → safest place for cleanup
- Import styles: `{ value }` · `{ type T }` (types only) · `{ test as base }` (rename) · `* as x` (everything)


## Phase 5 Checkpoint: Hybrid test

### Idea
- Hybrid test = UI test with a FAST setup channel; verify only what the test is about
- Real projects: set up via API (POST /api/cart), verify in the browser
- SauceDemo has no API, so the fast channel is browser storage (like storageState for cookies)

### Investigation first (DevTools → Application → Local storage)
- Key `cart-contents`, value `[4]` after Backpack, `[4,0]` after Bike Light
- Ids match the `item-4` / `item-0` test ids; order = order added; badge = list length

### Code (tests/ui/cart-hybrid.spec.ts)
- `page.addInitScript((ids) => localStorage.setItem('cart-contents', JSON.stringify(ids)), [4, 0])`
  runs in the page BEFORE the site's scripts; args are passed in because the code runs in the browser
- Then `page.goto('/cart.html')` → cart already full, ZERO clicks
- `toHaveText([...])` with an array checks all elements, in order
- Named constants (`BACKPACK_ID = 4`) instead of magic numbers
- Two hybrid setups combined: saved session cookie + local storage

### UI Mode tips
- Tests hidden? Check the Projects filter (tick chromium)
- Select the TEST (expand the file), not the file, to see actions

### Finding
- Direct navigation to /cart.html returns HTTP 404 (single-page app fallback) while the page renders:
  invisible to users, but monitoring tools and link checkers see "broken" pages → worth reporting
- "Permissions policy violation: unload" = SauceDemo's own code, noise

### Also done
- Capstone README: API tests ✅ in the roadmap, new folders, `npm run test:api`
- Copy code blocks with the Copy button 📋 (mouse-selecting loses Markdown symbols)