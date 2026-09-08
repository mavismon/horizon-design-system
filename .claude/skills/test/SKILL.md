---
name: test
description: Validate Horizon Design System token files before and after a Figma export update — check every tokens/*.json referenced by build-tokens.js exists, aliases resolve, and the build produces no new warnings or regressions. Use before committing token or pipeline changes.
---

# Test

There's no automated test suite in this repo (`npm test` is a stub). Validation here means checking the token data and pipeline are internally consistent.

## Steps

1. **File presence**: list `tokens/*.json` and diff against every path string referenced in `build-tokens.js` (`CORE`, `STYLES`, and each `source: [...]` array). Every referenced file must exist; flag any file in `tokens/` that nothing references (likely dead or a rename that wasn't cleaned up).

2. **Alias resolution**: grep token files for `"{...}"` reference syntax (e.g. `{color-gray-900}`, `{fontsize-4xl}`) and confirm the referenced token key exists somewhere in `tokens/`. An alias pointing at a renamed or deleted token is the most common break after a Figma re-export.

3. **Shape checks on typography tokens**:
   - `fontWeight` values are either a number or a name present in the `WEIGHTS` map in `build-tokens.js` (after whitespace is stripped).
   - `lineHeight` is either a plain number or a `{ value, unit }` dimension object — the preprocessor expects one of these two shapes.

4. **Run the build** (see the `build` skill) and treat any new warning or error as a failure. Compare warning output against the last known-good run if unsure whether something is new.

5. **Diff generated output** against the previous commit's build (if previously committed or cached) to eyeball for unintended value changes — e.g. a color swapping unexpectedly, a font size drifting — that would indicate a mapping bug rather than an intentional design change.

## Report

Summarize as: files checked, unresolved aliases (if any), unmapped font weights (if any), and whether the build completed clean. Don't fix issues found — hand them to the `engineer` agent or ask the user how they want them resolved unless the fix is an obvious one-line reference update.
