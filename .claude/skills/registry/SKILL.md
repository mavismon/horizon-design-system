---
name: registry
description: The contract every crew agent (engineer, qa, devops, doc-generator, release, pm) reads before it touches the Airtable registry. Defines every table, every column, its owner, the real Development formula (pulled from the live base, not inferred), and what nobody may write. Read this before any registry read or write.
---

# Registry contract

The registry is the Airtable base described in `.claude/registry.local.json` (gitignored — see `.claude/registry.local.json.example` for the shape; it carries base ID, table IDs, and field IDs). Never hardcode any of these IDs in an agent file or a commit; read them from that local config. IDs below are included for reference/audit only.

Agents hand work to each other **through this registry, never through conversation.** One agent writes evidence (a link, a test row). A formula derives a status from that evidence. The next agent picks up rows carrying its status. No agent types a status by hand.

**Everything in this document was pulled live from the base itself** — `list_tables_for_base` and `get_table_schema` via the Airtable MCP tools — including the literal `Development` formula, every select field's real choices, and the two count fields' real (mis)configuration. Nothing here is inferred from the Notion build docs or the FigJam board; where those disagree with the live base, the live base wins and the disagreement is noted below.

## The crew has five roles, not four

The Notion "Build an Agent Crew" doc and the FigJam board describe four agents: engineer, qa, devops, pm. The live base's field descriptions name a fifth role, a reviewer who owns `Release Review` and `Release Verdict` and gates a `Released` status beyond `Completed`. That role belongs to the **release** agent (`.claude/agents/release.md`), which runs the `release-review` skill; there is no separate reviewer agent. See "Table: Components" below for what it owns.

## Table: Components (`tblej9RmBwH3kCR5N`)

One row per design-system component. The `Development` column is what tells each agent whether a row is theirs.

| Column | Field ID | Owner | Notes |
|---|---|---|---|
| Components (primary) | `fldvz3mEQ4sEo6OJk` | Human/Designer | Row is created when a component enters the system. No agent creates or renames rows. |
| Category | `fld6u61ItAMfQSnGo` | Human/Designer | Single select: `ATOMS`, `MOLECULES`, `ORGANISMS`, `TEMPLATES`, `UI`. |
| Figma | `fldYcRaMUfGjKIL71` | Human/Designer | Link to the design node. Engineer reads it, never writes it. |
| Design | `fldK2Dp1iUf2mG0M1` | Human/Designer | Single select: `To-do`, `In progress`, `In testing`, `Done`, `To be fixed`. Only `Done` unlocks the `Development` ladder (see formula) — the other four values are the designer's own workflow and no agent branches on them. |
| Staging Storybook | `fldOuJpSivewZrGyt` | **engineer** | Written only after it has been opened and the stories confirmed rendering. |
| Commit | `fldTfzIqK9dn3tCka` | **engineer** | Link to the GitHub commit for the current build/fix. |
| GitHub Commits (link) | `fld4qoFZjkKqKEFK9` | **engineer** | Links this row to its commit rows in the `GitHub Commits` table. |
| Composes | `fldXwL4DRtQJHeYmI` | **engineer** | Self-link to other `Components` rows. Written when this component imports another, per the rule "build up, never sideways." Answers, in reverse (`Composed Into`), "if this changes, who has to be re-tested." |
| Composed Into | `fldlJGsxUBY4gWKN8` | *(auto)* | Reverse of `Composes`. Nobody writes this directly. |
| [Staging] Test Records (link) | `fldjU0dkzPmQJ0Z3W` | **qa** (creates rows) | QA creates rows in `Staging Testing`; they attach here via that table's `Composed In` link. |
| Production Storybook | `fldJPlSgnkaiS4ElR` | **devops** | Written only after it has been opened and the stories confirmed rendering. |
| Astro Link | `fldmIejCh2VfmBkmP` | **devops** | The component's page on the deployed Astro Starlight reference site, deep-linked. Written only after DevOps has opened that page and seen it render — same evidence rule as every other link. This is the *last* cell in a component's life: with it present, and `Release Review`/`Release Verdict` both cleared, `Development` reads `Released`. |
| Development | `fldOLGT24LDXAzsZ7` | *(formula — nobody writes)* | Derived status. See below for the literal formula. |
| Synchronization % | `fldmDi7UodNK4c2xZ` | *(formula — nobody writes)* | See "Two real bugs," below — this field does not mean what its name implies. |
| Staging Testing Results Summary | `fldwq0iaM1TdGJtEL` | *(rollup — nobody writes)* | Text rollup of `Testing Results` across every linked `Staging Testing` row. The `Development` formula does a substring search (`FIND`) against this text for `"Failed"` and `"re-test"`. |
| Total Staging Tests | `fldyYyEn5KfFGEuUu` | *(count — nobody writes)* | Airtable Count field on `[Staging] Test Records`. Counts every linked row, unconditionally. |
| Staging Passed Count | `fld88iBKmSezw6rzk` | *(count — nobody writes)* | **Also** an Airtable Count field on the same link, `[Staging] Test Records`, with no filter. Despite the name, it counts every linked row too — see "Two real bugs." |
| [Production] Test Records | `fldH8S2iqZ9ip8XDi` | *(unowned — see Flagged)* | Plain single-line text field, not a link. Empty on every sampled row. |
| Staging Passed Tests | `fldlUuOcmKdDULk5q` | *(unowned — see Flagged)* | Rollup on `[Staging] Test Records`, `referencedFieldIds` empty — it is not wired into `Synchronization %` despite its own description claiming it is. |
| Semantic Tokens | `fldfd3WTLL293Q8aY` | *(unowned — see Flagged)* | Plain single-line text field. Empty on every sampled row. |
| Release Review | `fldH6pgPqvGWVE4pU` | **release** | URL of the committed release-review report, at the commit it reviewed — never a branch URL. Written together with `Release Verdict`, or not at all. Gates `Released`, not part of the staging→production ladder. |
| Release Verdict | `fld2T74aO1z1bZJIJ` | **release** | Single select: `Cleared`, `Blocked`. Empty means not reviewed. `Cleared` is not permission to publish — a human still bumps the version and tags the release. |
| Last Modified | `fldS8MyhhJZW8RnKk` | *(Airtable system field)* | Not written by any agent. |

### Flagged — do not write to these until resolved

- **[Production] Test Records** — a plain text field, not a link, and there is no `Production Testing` table in this base. Neither Notion doc nor the FigJam board describes a separate production QA loop — DevOps goes straight from an all-passed staging gate to deploy. Treat as a placeholder, not a live column.
- **Staging Passed Tests** — its own field description says "Counts only test rows marked Passed. Feeds Synchronization %." Its actual config (`referencedFieldIds: []`) proves it feeds nothing — `Synchronization %`'s real formula references `Staging Passed Count` and `Total Staging Tests` only. This is a field that lies about itself; don't trust the description, don't write to it.
- **Semantic Tokens** — empty on every sampled row, no agent in the board or either doc is named as its owner. Likely a future link to a token registry that doesn't exist as a table yet.

## Two real bugs in this base (verified against the live field configs, not inferred)

1. **`Staging Passed Count` cannot distinguish Passed from Failed.** Both it and `Total Staging Tests` are Airtable Count fields pointed at the same link field (`[Staging] Test Records`) with no filter condition — Count fields in Airtable have no filter config at all. So `Staging Passed Count` always equals `Total Staging Tests`, and **`Synchronization %` reads 100% the instant any test rows exist, regardless of how many failed.** Never use `Synchronization %` as a pass-rate signal — it currently cannot be one. The only reliable way to know a component's real staging pass rate is to read the individual `Staging Testing` rows' `Testing Results` values directly, or read `Development` itself (whose formula, unlike this one, does inspect the actual text of every row via `Staging Testing Results Summary`).
2. **`Staging Passed Tests` is a disconnected rollup** (see Flagged, above) whose description overstates what it does.

Both are exactly the kind of "field that lies about itself" the registry-contract methodology warns about — report them to a human rather than silently working around them, and don't let an agent "fix" them without being asked; that's a schema change, not a registry write.

## The literal Development formula

```
IF(
  AND(FIND("Failed", {Staging Testing Results Summary}&"") > 0,
      FIND("re-test", {Staging Testing Results Summary}&"") > 0),
  "Fixing",
IF(FIND("Failed", {Staging Testing Results Summary}&"") > 0,
  "To be fixed",
IF(FIND("re-test", {Staging Testing Results Summary}&"") > 0,
  "Fixed",
IF(AND({Astro Link}, {Release Review}, {Release Verdict} = "Cleared"),
  "Released",
IF({Production Storybook},
  "Completed",
IF({Staging Testing Results Summary} != "",
  "To be deployed",
IF({Staging Storybook},
  "Ready for Testing",
IF(AND({Figma}, {Design} = "Done"),
  "To-do",
  "")))))))
)
```

First match wins, top to bottom. In plain English:

```
blank              → Figma not set, or Design != Done
To-do              → Figma set AND Design = Done
Ready for Testing  → Staging Storybook set
To be deployed     → at least one Staging Testing row exists, none read Failed or "Fixed (To re-test)"
Completed          → Production Storybook set
Released           → Astro Link set AND Release Review set AND Release Verdict = Cleared
Fixed              → some row reads "Fixed (To re-test)", none read Failed
To be fixed        → some row reads Failed, none also read "Fixed (To re-test)"
Fixing             → some row reads Failed AND some row reads "Fixed (To re-test)", simultaneously
```

**No agent may write `Development` directly — ever.** If a row's status looks wrong, the evidence underneath it is wrong, not the formula.

### Consequences worth knowing before they surprise you

1. **A failure outranks everything below it, including `Released`.** A released component whose re-test fails reads `To be fixed`, not `Released`. That's correct — it's broken, and the fact that it's also published is what makes it urgent.
2. **`Released` needs all three cells, not just the Astro link.** `Astro Link` says it's documented; `Release Review` + `Release Verdict = Cleared` say the release review actually checked it. Any one alone is not a release.
3. **`Design` is entirely a human's column.** A blank `Development` means the design isn't signed off yet, and no agent nudges it along — there is no "Design in progress" status any agent reacts to.
4. **`To be deployed` does not mean 100% synchronized** — see the bugs above. It means "no row currently reads Failed or pending re-test," which is what actually matters, but don't cross-check it against `Synchronization %` expecting agreement.

## The shared field

`Testing Results` on `Staging Testing` (choices: `Passed`, `Failed`, `Fixed (To re-test)`) is the one place two agents' work meets, exactly as the Notion doc describes:

- **qa** writes `Passed` and `Failed`.
- **engineer** writes `Fixed (To re-test)` — and only on rows it actually repaired, after pushing the fix. This is the real, live mechanism for a repair claim (an earlier draft of this document assumed no such field existed; it does — this is the correction).

Neither agent edits a row the other one owns writing to.

## Table: Staging Testing (`tblzVgnActM210oLc`)

One row per test **case** — per variant, size, and state, never one row per component.

| Column | Field ID | Owner | Notes |
|---|---|---|---|
| Component/Sub Component (primary) | `fldybojH4M9o2RdqY` | **qa** | The component or sub-component name under test. |
| Testing Results | `fldLpiJh4iuVf2Vkc` | **qa** writes Passed/Failed; **engineer** writes `Fixed (To re-test)` | See "The shared field," above. |
| Composed In (link) | `fldCJwyZJ6Zw7l91r` | **qa** | Links back to the `Components` row. |
| Variants | `fldVT5GVI3xQSxL6o` | **qa** | Free text, e.g. `filled`, `outlined`. |
| Size | `fldUrSIrLYca8gX3n` | **qa** | Multi-select: `xs`, `sm`, `md`, `lg`, `xl`, `comfort`, `compact`, and a literal choice named `null` — `null` is valid, observed evidence that the design publishes no size property, not a missing entry. |
| State | `fldvMKEdvieWk303p` | **qa** | Multi-select, shared across very different component shapes: interactive states (`idle`, `hovered`, `focus`, `selected`, `disabled`, `loading`, `error`, `filled`) and workflow/status states (`draft`, `pending`, `upcoming`, `completed`, `rejected`, `cancelled`, `isCurrent`). Only the subset relevant to the component under test applies — don't invent a new choice if the exact Figma state name isn't in this list; map it to the nearest one and record the mapping in `Context`. |
| Context | `fldegdzVzHKojIDGC` | **qa** | Free text — theme mode, and any Figma-state → Storybook-state mapping decision (e.g. "Figma state 'enable' logged as State='idle' — no 'enable' option exists"). |
| Attachment | `fldFsT2LLYntslenS` | **qa** | Screenshot evidence. |
| Expected Results | `fldJj85SsSRNr0YiO` | **qa** | From the design node, never the story file. |
| Suggestion for Improvement | `flda3SAcwhp0yQjys` | **qa** | The finding, when `Testing Results = Failed`. Format per the `finding-format` skill. |

## Table: GitHub Commits (`tbl05arAqR4X3TMLj`)

Owned by **engineer**.

| Column | Field ID |
|---|---|
| Commit Hash (primary) | `fldMD5ipggvopKdDm` |
| Message | `fldWXdMJjRNjGQJ9y` |
| Author | `fldjYs6T1cJY04abH` |
| Date Committed | `fldD53r1nGMKsMJU8` |
| Link to Components | `fldUEm3Sgw1PAu6dW` |
| Files Changed | `fldswp5xeDmCbJOK3` |
| Commit URL | `fldEAMB6e4Xj8I9Sx` |
| Commit Type | `fldSU6XU5UIsI4atM` — single select: `Feature`, `Bugfix`, `Documentation`, `Chore`, `Refactor`, `Other`. |

## Out of scope for this crew

- **DS Feedback** (`tbltT81rkDcvY8Xfc`) — `Feedback`, `Components`, `Submitted By`, `Step to Reproduce`, `Suggestion`, `Urgency`, `Attachment`, `Status` (single select: `Completed`, `In Progress`, `Not Started`). Reads as a human/customer-facing bug-report intake. No agent here owns it.
- **One-Off Components** (`tblZV2ROXn4RciwM4`) — `Components`, `Project`, `Usage quantity`, `Git Repo`, `Figma`. Tracks bespoke, per-project component usage outside the core develop → test → deploy → release ladder.

## Never

- Never write to `Development`, `Synchronization %`, `Staging Testing Results Summary`, `Total Staging Tests`, `Staging Passed Count`, or `Composed Into` — all six are derived.
- Never write to `[Production] Test Records`, `Staging Passed Tests`, or `Semantic Tokens` until a human names an owner (see Flagged, above).
- Never write to the `DS Feedback` or `One-Off Components` tables.
- Never write a link (`Staging Storybook`, `Production Storybook`, `Astro Link`, `Commit`, `Release Review`) before opening it and confirming it renders/resolves.
- Never write `Fixed (To re-test)` on a `Staging Testing` row you did not just repair — that value is a specific claim, not a default.
- Never invent a column, a status, or a mechanism that isn't in this document — if the work seems to need one, stop and say so instead of adding it to Airtable.
- Never write into a column this document assigns to a different agent — including `Release Review`/`Release Verdict` (release-only) and `Astro Link` (devops-only).
- Never treat `Synchronization %` as evidence of anything beyond "at least one test row exists" — see "Two real bugs."
