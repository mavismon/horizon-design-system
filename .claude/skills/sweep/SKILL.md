---
name: sweep
description: The audit procedure the pm agent runs over the Airtable registry — read every row, reconcile status against evidence, open every link, hunt contradictions. Produces the PM's report file.
---

# Sweep

The audit procedure for `pm`. Read `registry` first — this skill assumes that contract.

## Steps

1. **Read every row of `Components`, not a filtered or grouped view.** A saved Airtable view can hide rows; read the underlying table.
2. **Reconcile each row's `Development` against the evidence underneath it** by re-deriving it from the literal formula in `registry` (`Figma`+`Design`, `Staging Storybook`, `Staging Testing Results Summary`, `Production Storybook`, `Astro Link`+`Release Review`+`Release Verdict`) — not by trusting the formula's own output, since the point of a sweep is catching a case where the underlying data is wrong even though the formula computed correctly from it.
3. **Open every link rather than counting it.** A `Staging Storybook`, `Production Storybook`, or `Astro Link` URL that 404s or shows a blank page is a dead link even though the cell isn't empty. For `Release Review`, also confirm the linked commit still exists and matches what the report claims to have reviewed.
4. **Hunt contradictions**, specifically:
   - A row whose `Development` disagrees with its own evidence (e.g. reads `Completed` but `Production Storybook` is blank).
   - A row reading `Released` whose `Release Review` link predates the row's current `Last Modified` — a stale review, per `release-review`.
   - A `Staging Testing` row linked to no `Components` row, or a `Composed In` link pointing at a component that doesn't exist.
   - A component that exists in the repo (`src/components/*`) with no `Components` row, or a `Components` row with no matching folder under `src/components/`.
   - Any row using a `Development` value the formula in `registry` can't produce.
   - Any of the flagged columns in `registry` (`Semantic Tokens`, `[Production] Test Records`, `Staging Passed Tests`) that has been written to since the last sweep — that's a column-ownership violation to report, not something to quietly fix.
5. **Flag the two schema bugs in `registry`'s "Two real bugs"** every sweep, until a human fixes them at the field-configuration level: `Staging Passed Count`/`Total Staging Tests` are the same unfiltered count on the same link (so `Synchronization %` is meaningless), and `Staging Passed Tests` is a disconnected rollup. These aren't row-level contradictions — they're the same base-level defect on every row — so report them once, prominently, rather than as N separate row findings.

## Report

Overwrite `reports/pm-sweep.md` each sweep — don't append or version it. Structure, in this order:

1. **What changed since last sweep** — diff against the previous report if one exists.
2. **Schema-level bugs** — the two from step 5 above, if still unfixed. Lead with these; they undermine every count below them.
3. **Status counts**, each with the rows behind it listed by name (never just a number), across all eight `Development` values including `Released`.
4. **What each owner is waiting on** — grouped by agent (engineer / qa / devops / reviewer / human).
5. **Contradictions** found in step 4 above.
6. **Dead links** found in step 3.

## Never

- Never write to the registry. Not a status, not a link, not a fix — PM is read-only, full stop. The moment an auditor can edit what it audits, the fastest way to make a sweep look clean is to correct the rows instead of reporting them.
- Never report a link as good without opening it.
- Never report a count with no rows listed behind it.
- Never assign a finding to an agent when it belongs to a human (or the reverse) — `Figma`/`Design` gaps are the designer's; the flagged/unowned columns in `registry` (`Semantic Tokens`, `[Production] Test Records`, `Staging Passed Tests`) are nobody's until a human says otherwise; `Astro Link` is `devops`'s and `Release Review`/`Release Verdict` are `reviewer`'s.
- Never let a `Completed` or `Released` row go unchecked because it looks finished — a stale `Completed` row hiding a dead production link, or a `Released` row with a stale review, is exactly the kind of thing a sweep exists to catch.
