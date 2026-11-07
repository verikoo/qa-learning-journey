# Phase 2 Notes

## Exercise 1: DOM and DevTools (saucedemo.com)

### Login page elements

| Element | Tag | id | data-test | Other attributes |
| --- | --- | --- | --- | --- |
| Username field | `input` | `user-name` | `username` | type="text", name="user-name", placeholder="Username", aria-label="Username" |
| Password field | `input` | `password` | `password` | type="password", name="password", placeholder="Password", aria-label="Password" |
| Login button | `input` (not `button`!) | `login-button` | `login-button` | type="submit", value="Login", name="login-button", class="submit-button btn_action" |

- Number of `<input>` elements on the page: 3 (username, password, login button)
- Test usernames: standard_user, locked_out_user, problem_user, ... (see bottom of login page)
- Test password: secret_sauce

### Key concepts
- **HTML** = the text the server sends that describes the page (tags + attributes)
- **DOM** = the tree of elements the browser builds from HTML; Playwright searches this tree
- **`#id`** selector finds an element by its `id`
- **`[data-test="..."]`** selector finds an element by any attribute
- **`querySelector`** returns the first match; **`querySelectorAll`** returns all matches
- **`aria-label`** = accessibility label for screen readers; Playwright can use it (`getByLabel`)
- A misspelled property returns `undefined` instead of an error, so typos can hide


### Which attribute to use in tests?
- `data-test` exists only for testing: developers promise not to change it
- `class` is for styling and changes often: avoid it
- Playwright priority: role/label (what users see) → test id → CSS as last resort
- User-facing locators also catch visible bugs (missing text, wrong labels)

### Attribute stability ranking (most → least stable)

| Attribute | Stability | Why |
| --- | --- | --- |
| `data-test` / `data-testid` | ⭐⭐⭐ Most stable | Made **only** for tests |
| `aria-label`, button text, label | ⭐⭐⭐ Stable | Changes only if what **users see** changes, and then the test *should* notice! |
| `id` | ⭐⭐ Usually stable | Developers may rename it |
| `name` | ⭐⭐ Usually stable | Used for form data, rarely renamed |
| `placeholder` | ⭐ Fragile | Text tweaks, translations |
| `class` | ❌ Least stable | Pure styling: redesigns change it constantly (and `input_error` showed classes can even be misleading!) |