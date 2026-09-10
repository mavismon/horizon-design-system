---
name: test
description: Two test procedures for the Horizon Design System — (1) token file validation (aliases, weights, build warnings), used before committing token or pipeline changes, and (2) testing a built component against its design node, used by the qa agent on a Ready for Testing registry row.
---

# Test

Two distinct procedures share this file because they share an owner (`qa`) for component work, plus a general validation role for the token pipeline. Use the section that matches the work.

## A. Token file validation

There's no automated test suite in this repo (`npm test` is a stub). Validation here means checking the token data and pipeline are internally consistent.

### Steps

1. **File presence**: list `tokens/*.json` and diff against every path string referenced in `build-tokens.js` (`CORE`, `STYLES`, and each `source: [...]` array). Every referenced file must exist; flag any file in `tokens/` that nothing references (likely dead or a rename that wasn't cleaned up).

2. **Alias resolution**: grep token files for `"{...}"` reference syntax (e.g. `{color-gray-900}`, `{fontsize-4xl}`) and confirm the referenced token key exists somewhere in `tokens/`. An alias pointing at a renamed or deleted token is the most common break after a Figma re-export.

3. **Shape checks on typography tokens**:
   - `fontWeight` values are either a number or a name present in the `WEIGHTS` map in `build-tokens.js` (after whitespace is stripped).
   - `lineHeight` is either a plain number or a `{ value, unit }` dimension object — the preprocessor expects one of these two shapes.

4. **Run the build** (see the `build` skill) and treat any new warning or error as a failure. Compare warning output against the last known-good run if unsure whether something is new.

5. **Diff generated output** against the previous commit's build (if previously committed or cached) to eyeball for unintended value changes — e.g. a color swapping unexpectedly, a font size drifting — that would indicate a mapping bug rather than an intentional design change.

### Report

Summarize as: files checked, unresolved aliases (if any), unmapped font weights (if any), and whether the build completed clean. Don't fix issues found — hand them to the `engineer` agent or ask the user how they want them resolved unless the fix is an obvious one-line reference update.

## B. Component test

Tests one built component against its design node. Read `registry` first for the `Staging Testing` table shape and `finding-format` for how to write a failure.

### Hard gate

Test only what has a `Staging Storybook` link written on the `Components` row. No link, no test — not local, not the story file. If the row is `Ready for Testing` but the link is blank or dead, wait and say so; waiting is a correct outcome, not a failure to report.

### Steps

1. **Build the expected matrix from the Figma node, never from the story file.** A component compared against its own code agrees with itself by construction and proves nothing.
2. **Confirm fonts actually loaded** before reporting any width or line-height: measure a string in the declared family, then measure the same string again in a deliberately bogus font family, and confirm the two differ. Don't trust a fonts-loaded API — a missing font makes every label the wrong size and sends the engineer hunting a bug that isn't theirs.
3. **Read computed values from the rendered page** (`getComputedStyle` in the browser), never by inspecting the source.
4. **Drive states with real input** — click, focus, tab — never by inspecting which CSS class is present.
5. **Confirm which theme mode each side is answering in** before calling a color wrong — light vs. dark tokens differ on purpose.
6. **Write one `Staging Testing` row per case** — per variant, size, and state, never one row per component. `Testing Results = Passed` or `Failed`; on `Failed`, `Suggestion for Improvement` follows `finding-format` exactly.
7. Record both passes and failures — a sweep that only sees failure rows can't tell "nothing was tested" from "everything passed."

### Report

Alongside the registry rows, write `reports/[Component]/qa-report.md` with the full matrix (pass and fail), following the shape already used in `reports/Button/qa-report.md` in this repo: a summary line, a checks-performed table, then one numbered finding per failure with before/after evidence once fixed.

### Never

- Never fix what you find.
- Never report only failures — record passes too.
- Never mark your own finding resolved — the engineer's new commit does that, evidenced by a fresh `Staging Testing` round.
- Never report a raw value instead of naming a token.
- Never judge a state from code instead of the rendered component.
- Never build the expected matrix from the story file.
- Never trust a font-loaded check without measuring.
- Never test local when a `Staging Storybook` link exists.
- Never delete a failing row — a corrected re-test is a new row, not an edit to the old one.
- Never test a component you built yourself.
