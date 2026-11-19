# Phase 8 Notes: AI in QA (in the playwright-qa-framework capstone)

## Exercise 1: Playwright Test Agents (planner, generator, healer)

### Setup
- `npx playwright init-agents --loop=vscode` → .github/agents/ (3 agents), .vscode/mcp.json, specs/, seed test
- Review EVERY generated file before committing:
  - deleted copilot-setup-steps.yml (for Copilot's cloud agent; `npx run build` would fail CI)
  - replaced the empty default seed (imported @playwright/test, did nothing, would "pass" 4x in CI)
- Seed = starting point the agents run first; ours uses OUR fixtures (logged-in products page)
- `.playwright-mcp/` (snapshots + logs) added to .gitignore
- `git commit --amend --no-edit` = fix the last unpushed commit

### How the agents work
- The AI "sees" pages as the ACCESSIBILITY TREE (roles, names, `ref` ids), not screenshots
- MCP server = the AI's "hands" (click, snapshot, evaluate JavaScript)
- Two approvals: "Run X" (may the AI DO this?) vs "Approve Tool Result" (may it READ this? → prompt injection)
- Auto-approve only on trusted practice sites; keep approvals on for real systems
- Costs: credits per run (planner 1.2, generator 2.3+); "Continue to iterate?" = max-requests guardrail

### Planner
- Good prompt: starting point + scope + what to cover + output location
- Review checklist: requested coverage? edge/negative cases? duplicates? concrete expectations? invented behavior?
- Iterate with feedback instead of starting over (added reload, empty checkout, 6 items, badge never 0; removed duplicate)
- Finding: checkout can START with an empty cart → AI only recorded it; deciding if it's a bug = human job

### Generator
- First try: all 8 scenarios at once → 40+ min, stuck, NOTHING written → split big tasks
- AI can look busy and produce nothing: check the actual files
- Second try (scenarios 1.1–1.4): wrote tests/ui/cart.spec.ts, 5 passed
- Always check `git status` + `git diff` for files the AI touched (here: only the new file ✅)

### Code review of AI tests
- Good: our fixtures + page objects, exact array assertions, badge absence via toHaveCount(0), toHaveAccessibleName
- Issues: raw locators via `cartPage.page...` (broke POM), hard-coded names/prices, redundant checks
- Refactor: CartPage got itemQuantities, itemPrices, continueShoppingButton, removeButton(slug), remove(), continueShopping();
  products.ts got bikeLight, boltTShirt, onesie; tests build expectations with items.map(...)
- Commit AI draft first, then the review fixes → history shows exactly what the human changed
- Requirements left out of a prompt are not guessed by the AI
- CI: green on all 4 browsers → merged
## Exercise 2: Healer
- Simulated a renamed button: CartPage continueShoppingButton 'Continue Shopping' -> 'Back to Shopping'
- Result: 2 failed, 3 passed, 34.5s = slow failure (waiting for a button that never appears)
- After a VS Code update the agents were hidden: Customizations -> Migrations -> Migrate
  moved the MCP server from .vscode/mcp.json to .mcp.json
- Healer fixed it in pages/CartPage.ts (page object, +1 -1), verified 13 tests on 3 browsers
