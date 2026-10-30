# Playwright & Full-Stack QA: Zero to Hero

Oct 30, 2026 · @veriko

## How this course works

Nine phases take you from rebuilding JavaScript to a portfolio-ready framework with API, CI and AI tooling, at about 8–10 hours per week over roughly 16 weeks.

- **You type everything.** The tutor gives tasks, questions and hints, never finished code.
- **Three-level hints:** green (direction), yellow (narrower), red (ask the tutor). Try at least 20 minutes before red.
- **Broken attempts count.** Commit them; the history of your fixes is part of the portfolio.
- **Every exercise gets a short note:** what you tried, what failed, what you learned.
- **Each phase ends with a checkpoint task** done without hints. Pass it before moving on.

## GitHub repo strategy

Use two repos, organized by folders, not by long-lived branches. Branches are for short-lived work that you merge back through pull requests.

| Repo | Purpose | Who it's for |
| --- | --- | --- |
| `qa-learning-journey` | Every exercise, note and checkpoint, phase by phase | You, and anyone checking your consistency |
| `playwright-qa-framework` | The capstone: one clean, production-style framework (UI + API + CI + AI) | Recruiters and hiring managers |

Why not one branch per phase: GitHub shows `main` by default, so work hidden in branches is effectively invisible. Branches also drift apart, and you lose the ability to see your full progress in one place.

**`qa-learning-journey` structure:**

```
qa-learning-journey/
├── README.md              # progress table + links to each phase
├── 00-setup/
├── 01-javascript-typescript/
│   ├── exercises/
│   ├── notes.md
│   └── checkpoint/
├── 02-web-http-fundamentals/
├── 03-playwright-core/
├── 04-test-architecture/
├── 05-api-testing/
├── 06-advanced-playwright/
├── 07-ci-cd-reporting/
└── 08-ai-in-qa/
```

**Branch naming for both repos:** `phase-01/async-warmup`, `feature/login-tests`, `fix/flaky-cart-test`. Open a pull request, review your own diff, then merge to `main`. This rehearses the real team workflow.

## Syllabus: 0 to hero

Phases 1–2 rebuild the base, 3–5 make you job-ready, 6–8 make you stand out.

| Phase | Weeks | Topics | Checkpoint (no hints) |
| --- | --- | --- | --- |
| 0. Setup | 0.5 | Node, npm, VS Code, Git, GitHub, SSH keys, repo creation | Both repos live with a README |
| 1. JavaScript & TypeScript | 2.5 | Variables, functions, arrays/objects, destructuring, classes, modules, promises, async/await, error handling, TS types and interfaces | A small TS module that fetches and validates data, with types |
| 2. Web & HTTP fundamentals | 1 | DOM, CSS/XPath selectors, DevTools, HTTP methods and status codes, headers, cookies, JWT, REST vs GraphQL | Explain a real site's login request from the Network tab |
| 3. Playwright core | 2 | Install, config, locators (role, text, test id), auto-waiting, web-first assertions, codegen, UI mode, trace viewer | Your login checklist automated as passing tests |
| 4. Test architecture | 2 | Page Object Model, custom fixtures, test data and factories, `.env` config, auth state reuse, tagging, flaky-test diagnosis | Refactor Phase 3 tests into POM + fixtures |
| 5. API testing | 2 | `request` context, CRUD tests, schema validation (Zod), auth tokens, chaining calls, API setup for UI tests, contract testing basics | API suite for a public demo API + one hybrid UI/API test |
| 6. Advanced Playwright | 2 | Network mocking and interception, visual comparison, accessibility (axe), multi-tab and iframes, file upload/download, mobile emulation, performance basics | Mocked-backend test + visual + a11y check |
| 7. CI/CD & reporting | 1.5 | GitHub Actions, parallel workers, sharding, retries, HTML/Allure reports, Docker basics, test pyramid strategy | Green pipeline on every pull request with a published report |
| 8. AI in QA | 2.5 | Playwright MCP, AI agents that plan, generate and heal tests, prompting for test design, reviewing AI-written tests, testing LLM features (evals, non-deterministic output) | AI-assisted test generation, critically reviewed and fixed by you |

**Practice targets:** saucedemo.com and the-internet.herokuapp.com for UI; reqres.in, restful-booker and JSONPlaceholder for API. We'll check each one is still online when we reach it.

## Capstone: playwright-qa-framework

The capstone is built gradually from Phase 4 onward, so it grows with your skills instead of being rushed at the end.

- **Phase 4:** scaffold in TypeScript, POM, fixtures, environment config
- **Phase 5:** API layer, schema validation, API-based login for UI tests
- **Phase 6:** mocking, visual and accessibility suites
- **Phase 7:** GitHub Actions pipeline, sharding, published report, status badge in the README
- **Phase 8:** an AI-assisted workflow (MCP or agents), documented with what the AI got wrong and how you fixed it

The README should explain the architecture, how to run it, and the design decisions you made. Interviewers read that more closely than the code.

## Weekly rhythm and tracking

Aim for small daily commits rather than one big weekend push; a steady green contribution graph also signals consistency to recruiters.

1. **Learn** (30%): concept from the tutor, plus official Playwright docs
2. **Build** (50%): exercises, typed by you, committed even when broken
3. **Reflect** (20%): update `notes.md` with what clicked and what didn't

**Progress checklist:**

- [ ] Phase 0: Setup
- [ ] Phase 1: JavaScript & TypeScript
- [ ] Phase 2: Web & HTTP fundamentals
- [ ] Phase 3: Playwright core
- [ ] Phase 4: Test architecture
- [ ] Phase 5: API testing
- [ ] Phase 6: Advanced Playwright
- [ ] Phase 7: CI/CD & reporting
- [ ] Phase 8: AI in QA
- [ ] Capstone published with README and green pipeline
