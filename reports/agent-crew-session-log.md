# Agent Crew Setup — Session Log

A record of what was built, what was discovered, what went wrong, and what's still open — from setting up the Horizon Design System's agent crew through the first real component run (Button).

---

## 1. What was asked

Build an agent crew for the Horizon Design System, grounded in three sources:
- Two Notion docs: *"The Shape of a Worker"* (the seven-section agent file format, and the registry-driven handoff philosophy) and *"Build an Agent Crew, 0 to 1"* (the four-phase build process: draw the board, write the registry contract, mint the crew, run one component through).
- A FigJam board ("Agent Crew and Registry") laying out the same Engineer → QA → DevOps → PM pipeline visually.
- A real Airtable base ("Horizon Design System") acting as the registry — the single source of truth every agent reads and writes through, never through direct messages to each other.

---

## 2. Research findings

### 2.1 The Notion docs

Both docs describe a **four-agent crew** (engineer, qa, devops, pm) handing work to each other exclusively through Airtable evidence — a link, a test row — never through conversation or a typed status. Each agent file follows the same seven sections: Mission, When it's called, Role, Access, Outputs, Self-check, Never. The "Never" section is deliberately the longest, since it's what makes an agent trustworthy rather than just capable.

### 2.2 The FigJam board

Confirmed the same four-role structure end to end (Human design → Engineer → QA → DevOps, with PM auditing from outside), plus tool dependencies (Figma, Claude Code, GitHub, hosting, Asana, Airtable) and an explicit repair loop (QA "Need to Fixed" → Engineer "Fixed"/"Fixing" → back to QA).

### 2.3 The real Airtable schema — pulled live, not inferred

Initial browser-based inspection (before the Airtable MCP connector was authorized) got the table/field *names*. Once the connector was authorized, pulling the literal field configs via `list_tables_for_base` / `get_table_schema` revealed several things that changed the design:

- **A fifth role**: the `Astro Link` field's description names a **Reviewer** role, gating a `Released` status beyond `Completed`, governed by "seven gates" documented in `.claude/skills/release-review/SKILL.md` — a file that didn't exist. Neither Notion doc nor the FigJam board mentions this role at all.
- **A shared field that does exist**: `Testing Results` on `Staging Testing` has three choices — `Passed`, `Failed`, `Fixed (To re-test)`. QA writes the first two; the engineer writes the third, on rows it actually repaired. (An earlier draft of the registry contract wrongly assumed no such field existed — corrected once the real schema was pulled.)
- **Two real, verified bugs in the base**:
  1. `Staging Passed Count` and `Total Staging Tests` are both plain Airtable Count fields pointed at the *same* link (`[Staging] Test Records`) with no filter — Count fields can't filter. So `Staging Passed Count` always equals `Total Staging Tests`, and `Synchronization %` reads 100% the instant any test rows exist, pass or fail. It cannot be trusted as a pass-rate signal.
  2. `Staging Passed Tests` is a disconnected rollup whose own description claims it feeds `Synchronization %` — its actual config (`referencedFieldIds: []`) proves it doesn't. This is the literal "field that lies about itself" example the Notion doc warns about, found for real in this base.
- The literal `Development` formula was pulled and documented verbatim (see `.claude/skills/registry/SKILL.md`) rather than approximated from the Notion doc's simplified ladder.

### 2.4 Naming collision

The repo already had token-pipeline-scoped `engineer.md`/`qa.md` agents. Per your choice, these were **merged** — each file now covers both token-pipeline work and component-build/test work, rather than being replaced or duplicated under new names.

---

## 3. What was built

**Skills** (`.claude/skills/`):
- `registry` — the contract: every table, column, owner, the literal formula, the two verified bugs.
- `finding-format` — how QA writes an actionable failure.
- `sweep` — PM's audit procedure.
- `security-check` (+ `scripts/security-check.mjs`) — the shared pre-deploy gate. Tested live by planting fake AWS/GitHub credentials and confirming it caught them.
- `release-review` — deliberately incomplete; documents what's verifiable from the schema and flags the seven gates as an open question rather than inventing them.
- `build` / `test` — extended with new sections (B) for component work, alongside the existing token-pipeline sections (A).

**Agents** (`.claude/agents/`):
- `engineer.md`, `qa.md` — merged (token pipeline + component work).
- `devops.md`, `reviewer.md` — new.
- `pm.md` — new, read-only by design.

**Config**:
- `.claude/registry.local.json` (gitignored) + `.example` — base/table/field IDs.
- `.gitignore` fix: a bare `build/` pattern was silently swallowing `.claude/skills/build/` from git (matches *any* directory named `build`, not just the repo-root output). Anchored to `/build/`.

---

## 4. The Vercel detour

Running the Button component through the loop needed a real staging deploy target, which didn't exist. What followed:

1. **Vercel MCP connector wasn't authorized** → authorized via `/mcp` in an interactive terminal.
2. **No Vercel Team existed** → `create_git_project` (the tool that links a GitHub repo for auto-deploy-on-push) refuses to target a personal account on purpose. You opted to stay on the personal account rather than create a Team.
3. **`deploy_to_vercel` (manual file upload) does work without a Team** — confirmed by actually using it to deploy Button. Read tools (`get_deployment`, `web_fetch_vercel_url`, `get_access_to_vercel_url`) all still 403 against a personal account, even for a deployment the same call just created — write access works, read access doesn't, under this connector.
4. **The deployment was blocked by Vercel Deployment Protection** (redirected to a Vercel login) — found by the `engineer` subagent independently `curl`-ing the URL rather than trusting a relayed claim that it rendered.
5. **Two different Vercel projects existed under similar names** (`horizon-design-system` vs `horizon-design-system-cdfi`) — several rounds of confusion came from checking/disabling protection on the wrong one. Once correctly on `horizon-design-system-cdfi`'s Deployment Protection settings and turning off "Vercel Authentication," a fresh deployment rendered correctly.
6. **A real, separate bug found along the way**: the original git-linked `horizon-design-system-cdfi` project was 404ing on every route. Root cause: `package.json` has no `build` script, so Vercel's zero-config detection deployed with no static output directory. Fixed with a `vercel.json` pointing explicitly at `npm run build-storybook` → `storybook-static`. Committed and pushed (`80e6f5d`).

---

## 5. The Button run — what actually happened

- `engineer` re-derived Button's variant matrix from Figma node `19:31` directly (not from the existing local draft), and found two real mismatches: Figma's state value is `"outline error"` (space) not `"outline-error"` (hyphen), and a prop misnamed `icon` should be `swapIcon`. Fixed both, committed (`94900ff`).
- I deployed the fix via `deploy_to_vercel`, opened the result myself once Deployment Protection was off, and confirmed it: Button renders correctly, all 5 states + "All States" story, clean console.
- **`engineer` refused to write `Staging Storybook` on my relayed description of that**, even when I described it as "first-party" — correctly, since from its own vantage point it was still a secondhand claim. I wrote the field myself directly instead, since I was the one who actually opened the page.
- `Development` on the Button row recomputed automatically to **`Ready for Testing`** the instant the link was written — no status was typed by hand.

---

## 6. The architecture finding: Browser tools and subagents

Prompted by wanting engineer to self-serve this next time, I added Browser pane tool names to its `tools:` frontmatter and **tested it directly** rather than assuming it would work. It didn't: a spawned subagent has no access to Browser pane tools under any circumstances, regardless of what's declared in its `tools:` list.

This isn't a small fix — it affects all four component-facing agents, since "open a URL and watch it render" is the central trust mechanism the whole crew design is built around:

| Agent | What it can still do itself | What only the orchestrating session (this conversation) can do |
|---|---|---|
| `engineer` | Build, commit, push, write `Commit`/`GitHub Commits` (git-verifiable) | Deploy-and-verify, write `Staging Storybook` |
| `qa` | Token-pipeline validation (§A) only | All of component testing (§B) — rendering, clicking, measuring computed styles |
| `devops` | Merge, push, run `security-check` live mode (plain `fetch()`, not a render) | Open-and-verify, write `Production Storybook`/`Astro Link` |
| `reviewer` | Read Figma/commit history | Read the production docs pages, form the verdict |

All four agent files and the `build`/`security-check` skills were corrected to reflect this — each subagent now builds/commits/pushes and explicitly hands off what needs opening, rather than claiming a capability it doesn't have.

---

## 7. Current state

- Button: `Development = Ready for Testing`. `Commit`, `GitHub Commits` link, and `Staging Storybook` all written with real evidence behind them. Not yet handed to `qa` for a real test pass — that's the next step, and per §6, it happens in this conversation, not as a spawned `qa` subagent.
- 15 files from this session (`.claude/agents/*`, `.claude/skills/*`, `scripts/`, etc.) are still uncommitted in the working tree, separate from the Button commits.

## 8. Open items

1. **The release-review "seven gates" are undefined.** Neither Notion doc, the FigJam board, nor the Airtable field descriptions specify what they are — `reviewer` cannot run a real review until you provide them.
2. **Still on a personal Vercel account, not a Team.** `create_git_project` (proper git-linked auto-deploy) remains unavailable; `deploy_to_vercel` (manual, one-off) is the working path. If you create a Team later, the deploy step gets simpler but nothing else in the crew design needs to change.
3. **Two Vercel projects exist** (`horizon-design-system` and `horizon-design-system-cdfi`) — worth confirming whether both are intentional or one should be deleted, to avoid repeating the mixup from §4.5.
4. **Uncommitted scaffolding files** (§7) — worth a separate commit so `security-check`'s dirty-tree check stops flagging unrelated noise on future runs.
