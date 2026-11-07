# Phase 2 Notes: Web & HTTP Fundamentals

Practice site: https://www.saucedemo.com (user: `standard_user`, password: `secret_sauce`)

---

# Part A: Exercise logs

## Exercise 1: DOM and DevTools (login page)

| Element | Tag | id | data-test | Other attributes |
| --- | --- | --- | --- | --- |
| Username field | `input` | `user-name` | `username` | type="text", name="user-name", placeholder="Username", aria-label="Username" |
| Password field | `input` | `password` | `password` | type="password", name="password", placeholder="Password", aria-label="Password" |
| Login button | `input` (not `button`!) | `login-button` | `login-button` | type="submit", value="Login", name="login-button", class="submit-button btn_action" |

- 3 `<input>` elements on the page (username, password, login button)
- Test usernames: standard_user, locked_out_user, problem_user, ... (listed at the bottom of the login page)
- The login button is `<input type="submit">`, but browsers and Playwright treat it as a **button** named by its `value` ("Login")

## Exercise 2: Selectors (products page)

- Products (`.inventory_item`): 6
- Names: Sauce Labs Backpack, Sauce Labs Bike Light, Sauce Labs Bolt T-Shirt, Sauce Labs Fleece Jacket, Sauce Labs Onesie, Test.allTheThings() T-Shirt (Red)
- Prices: $29.99, $9.99, $15.99, $49.99, $7.99, $15.99
- Add to cart buttons (`[data-test^="add-to-cart"]`): 6 before clicking, 5 after adding Backpack
- After clicking Backpack: button text → "Remove", its data-test → `remove-sauce-labs-backpack`, cart badge → "1"
- 2nd product price: before sorting $9.99 / after "Price (low to high)" also $9.99 (coincidence!) / after "Price (high to low)" $29.99
- `$x('//button[text()="Add to cart"]')` after adding Backpack: 5

**Lessons**
- One `^=` selector can match a whole group of elements that share a naming pattern
- The same element can change attributes and text after an action (Add to cart → Remove)
- Position-based selectors (`nth-child`) break when order changes, and coincidences can hide this, so test more than one case
- Text-based selectors break when text changes

---

# Part B: Reference (reuse everywhere)

## 1. DevTools shortcuts
| Shortcut | Opens |
| --- | --- |
| `Cmd + Option + I` | DevTools |
| `Cmd + Option + J` | DevTools directly on the Console |
| Right-click → Inspect | Jumps to that element in Elements tab |
| `Cmd + Shift + C` | Element picker: click anything on the page to inspect it |

## 2. Console commands
| Command | What it does |
| --- | --- |
| `document.querySelector('sel')` | First element matching a CSS selector (or `null`) |
| `document.querySelectorAll('sel')` | All matching elements |
| `document.querySelectorAll('sel').length` | How many match |
| `[...document.querySelectorAll('sel')].map(el => el.textContent)` | Array of all their texts |
| `$('sel')` / `$$('sel')` | Chrome shortcuts for querySelector / querySelectorAll |
| `$x('xpath')` | Find elements with XPath |
| `$0` | The element currently selected in the Elements tab |
| `el.textContent` | The element's text |
| `el.value` | Current value of an input field (read or set) |
| `el.getAttribute('data-test')` | Read any attribute |
| `el.click()` | Click it with code |
| `copy(something)` | Copy a result to the clipboard |

## 3. CSS selectors
| Selector | Finds... | Example |
| --- | --- | --- |
| `tag` | All elements with that tag | `button` |
| `#id` | The element with that id | `#login-button` |
| `.class` | Elements with that class | `.inventory_item` |
| `[attr="value"]` | Exact attribute match | `[data-test="username"]` |
| `[attr^="value"]` | Attribute **starts with** | `[data-test^="add-to-cart"]` |
| `[attr*="value"]` | Attribute **contains** | `[data-test*="backpack"]` |
| `A B` (space) | B **anywhere inside** A | `.inventory_item .inventory_item_price` |
| `A > B` | B **directly inside** A | `.inventory_list > div` |
| `:nth-child(n)` | n-th child (fragile: depends on order!) | `.inventory_item:nth-child(2)` |

## 4. XPath basics
| XPath | Finds... |
| --- | --- |
| `//button` | All buttons anywhere |
| `//button[text()="Add to cart"]` | Buttons with exactly this text |
| `//div[contains(text(), "Backpack")]` | Divs whose text **contains** "Backpack" |
| `//*[@data-test="username"]` | Any element with that attribute (`@` = attribute) |

## 5. Attribute stability (most → least stable)
| Attribute | Stability | Why |
| --- | --- | --- |
| `data-test` / `data-testid` | ⭐⭐⭐ Most stable | Made **only** for tests |
| `aria-label`, button text, label | ⭐⭐⭐ Stable | Changes only if what **users see** changes, and then the test *should* notice! |
| `id` | ⭐⭐ Usually stable | Developers may rename it |
| `name` | ⭐⭐ Usually stable | Used for form data, rarely renamed |
| `placeholder` | ⭐ Fragile | Text tweaks, translations |
| `class` | ❌ Least stable | Pure styling: redesigns change it constantly (and can be misleading, like `input_error`) |

## 6. Playwright locators (coming in Phase 3)
Priority: **what users see → test id → CSS/XPath as last resort**

| Console / CSS | Playwright locator |
| --- | --- |
| `input[type="submit"][value="Login"]` | `page.getByRole('button', { name: 'Login' })` |
| `[aria-label="Username"]` | `page.getByLabel('Username')` |
| `[placeholder="Username"]` | `page.getByPlaceholder('Username')` |
| `$x('//div[text()="Sauce Labs Backpack"]')` | `page.getByText('Sauce Labs Backpack')` |
| `[data-test="username"]` | `page.getByTestId('username')` * |
| `.inventory_item` | `page.locator('.inventory_item')` (last resort) |

\* Playwright's `getByTestId` looks for `data-testid` by default. SauceDemo uses `data-test`, so it needs one config setting. We'll do that in Phase 3.

## 7. Key concepts
- **HTML** = text the server sends that describes the page (tags + attributes)
- **DOM** = tree of elements the browser builds from HTML; Playwright searches this tree
- **Selector** = an address pointing to elements in the DOM
- **`aria-label`** = accessibility label for screen readers; Playwright uses it too
- A misspelled property returns `undefined` instead of an error, so typos can hide



## Exercise 3: Network tab & HTTP

### Page load (saucedemo)
- Reloading a page sends many requests: the HTML page, scripts (JS), styles (CSS), images, fonts
- Filters: Doc = the page, JS = scripts, CSS = styles, Img = images, Fetch/XHR = data requests to APIs

### Login & cookies (saucedemo)
- No request was sent with the username/password: SauceDemo checks login in the browser
  (practice app only; real apps send a POST to a server, never check passwords in the browser)
- Login is stored in a cookie: `session-username` = `standard_user`
- Deleting the cookie + reload → sent back to the login page (session lost)
- A session cookie is the "proof of login"; real apps store a random token (HttpOnly), not the username
- Playwright can save cookies after one login and reuse them in all tests (faster)

### My own requests (jsonplaceholder, from the Console)
- GET /users/1 → 200, user "Leanne Graham" with nested address and company objects
- POST /posts → 201 Created (not 200!), new id: 101
- GET /posts/101 → 404: JSONPlaceholder fakes saving (writes are not stored)
- GET /users/999 → 404 (the red Console line is the browser logging a failed request, not a crash)
- Console warnings from browser extensions (like "No ad placements found") are noise: ignore them

### Lessons
- Check the EXACT status code: 201 for create, 200 for read
- A success response is not proof: create → read back → compare
- An empty Network list can be a finding too (no login request = client-side login)

## 8. HTTP basics
- **Request** = method + URL + headers (+ body); **Response** = status + headers + body
- **GET** read · **POST** create · **PUT/PATCH** update · **DELETE** remove
- **2xx** success · **3xx** redirect · **4xx** client mistake · **5xx** server bug
- 200 OK · 201 Created · 204 No Content · 401 not logged in · 403 forbidden · 404 not found · 500 server error
- `Content-Type` = body format · `Cookie`/`Set-Cookie` = stored session data · `Authorization` = token

## 9. Network tab tips
- **Fetch/XHR** filter = data requests only
- **Clear** 🚫 before an action, so you only see that action's requests
- Click a request: **Headers** (method, status), **Payload** (what you sent), **Response** (what came back)
- Application tab → Cookies → expand ▶ and click the site to see cookies

## 10. fetch in the Console
- GET: `await fetch(url).then(r => r.json())`
- Status only: `await fetch(url).then(r => r.status)`
- POST: `fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) })`