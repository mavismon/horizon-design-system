# Checkbox · release review

- **Reviewed SHA:** `7db943b3333b194d4fce3c86390c7b82977dd70c` (branch `release-review/checkbox-7db943b`, two commits on top of `origin/main` `b398b11`). Those two commits are: `a9129c0`, the intent commit cherry-picked from the local `intent/checkbox-usage` (`bffb1d6`, only `src/components/Checkbox/Checkbox.intent.json` changes); and `7db943b` itself, which adds `decisions.md` (the 2026-10-01 Checkbox ruling, as it stood in the working tree, unchanged) and `reports/Checkbox/qa-report.md` (unchanged). The build commit `5f824e8` is already in `main`'s history, so no source other than the intent file differs from `main`. This report is committed on top of the reviewed SHA.
- **Date:** 2026-10-01
- **Verdict:** **Cleared**
- **Reviewer:** release agent, running `release-review`
- **Board row:** Checkbox (`recAjRBvsD0uNQTpm`), read fresh: `Development` = `Completed`, `Design` = `Done`, `Production Storybook` and `Staging Storybook` set, `Astro Link` empty, `Release Review` and `Release Verdict` empty, `Last Modified` = 2026-10-01T14:26:36Z.

`decisions.md` was read in full at the reviewed SHA. One ruling is applied (G2, quoted below). The three 2026-09-28 rulings and the Avatar ruling don't bear on Checkbox.

## Gates and checks

| # | Gate / check | Result | Evidence |
|---|---|---|---|
| G1 | Done | Pass | `Development` reads `Completed`. `Production Storybook` (`https://horizon-design-system-cdfi.vercel.app/?path=/story/components-checkbox--all-states`) returns 200, and `index.json` on that host lists `components-checkbox--unchecked`, `--checked`, `--unchecked-without-label`, `--checked-without-label`, `--all-states`. |
| G2 | Tokens | Pass (ruling) | The only px literals in `src/components/Checkbox/Checkbox.css` are `gap: 10px` (line 4, `.hz-checkbox`) and `width: 16px` / `height: 16px` (lines 11, 12, `.hz-checkbox__box`). No hex values. No `var()` fallbacks (every `var(--…)` is bare). `font-weight: 400` (line 56) is a unitless keyword weight, not a px or hex literal. All three literals are covered exactly by the ruling below. |
| G3 | Surface | Pass | `src/index.ts:5` exports `Checkbox`, `src/index.ts:6` exports `CheckboxProps`. Added in the build commit `5f824e8`; nothing says it should stay internal. |
| G4 | Names | Pass | Folder `src/components/Checkbox/`, symbol `Checkbox` (`Checkbox.tsx:10`), CSS prefix `hz-checkbox`, intent `Checkbox.intent.json`, board row `Checkbox`. |
| G5 | States | Pass, with an open finding (see below) | Figma component set `117:23` publishes `state=unchecked` (117:12) and `state=checked` (117:15) and nothing else. Both are built (`:checked` styling, `Checkbox.css:28`) and rendered by stories `Unchecked`, `Checked` and `AllStates`, plus the two without-label stories, all in the deployed `index.json`. The `error` state is described in the Figma Usage frame but not drawn: see "G5 and the undrawn error state". |
| G6 | Intent | Pass | `Checkbox.intent.json` exists at the reviewed SHA and passes C1 to C6. |
| G7 | Version | Pass, with a standing note | `VERSIONING.md` exists and states the 0.x bump rules, what counts as public and what 0.1.0 commits you to. Standing note, not a finding on this review: line 35 says 0.1.0 "contains one component, `Button`". It goes stale once a version containing Checkbox ships, and a human must update it then. This review did not edit it. |
| C1 | Fields present | Pass | All seven fields present with the right types. `use_when` is 4 strings, `dont_use_when` is 3 `{when, instead}` objects, `variant_intent` 2 keys, `required_tokens` 11, `a11y` 3 entries, `placement` and `pairs_with` are `[]` (stories render Checkbox alone). |
| C2 | Alternatives named | Pass, no warnings | All three `dont_use_when` entries have a non-empty `instead`: `Toggle`, `Radiocard`, `Button`. See "How check 2 treats unbuilt alternatives". |
| C3 | a11y specific | Pass | Three entries, all with lines that exist and implement the fact at the reviewed SHA. `Checkbox.tsx:19` is `<input type="checkbox" className="hz-checkbox__input" {...rest} />` (native checkbox). `Checkbox.tsx:17` is `<label className={cn("hz-checkbox", className)}>` (wraps input and label text). `Checkbox.tsx:24` is `aria-hidden="true"` on the tick `<svg>`. See the finding below on the accessible-name claim. |
| C4 | Tokens resolve | Pass | `npm run build:tokens` at the reviewed SHA wrote `build/css/tokens.css`. All 11 `required_tokens` are defined there (`--border-width-sm` 64, `--border-width-md` 65, `--radius-xs` 67, `--color-bg-elevated` 102, `--color-text-secondary` 105, `--color-text-inverse` 107, `--color-border-strong` 110, `--color-interactive-primary` 112 = `#3b71f2`, `--fontfamily-body` 150, `--fontsize-lg` 155, `--lineheight-lg` 163). The set of `var(--…)` names in `Checkbox.css` is exactly those 11. |
| C5 | Variants covered | Pass | Checkbox exports no variant union type. The Figma-published values of the `state` property are `unchecked` and `checked`, and `variant_intent` has exactly those two keys. In code the two states are the native `checked` attribute, not a union. Passes on the Figma values; there is no code union to compare against. |
| C6 | No duplicate job | Pass | Compared with `Button.intent.json` and `Avatar.intent.json`. Checkbox's four items are opting in, confirming agreement to terms, acknowledging a destructive action, and choosing any number from a list. Button's are triggering actions, primary and secondary calls-to-action, opening views, and destructive actions. Avatar's are showing a person. Closest overlap is "destructive": Button runs the action, Checkbox records an acknowledgement before it, so they are different jobs. Button's own `dont_use_when` already points toggleable on/off at "Toggle or Checkbox", which supports the split rather than competing with it. |

## Intent content against Figma Usage frame 118:10

Read with `get_design_context` (file `dIHHqSq8c75n4olME0s9JS`). The four `use_when` items match "Use a Checkbox" word for word and in order (nodes 118:113, 118:120, 118:126, 118:132). The three `dont_use_when` items match "Do not use a checkbox" word for word and in order (118:138, 118:144, 118:150), each `instead` being the component the sentence names. Nothing is invented. The six "Best Practice" items (118:160 to 118:190) are not in the file because the file has no field for them; `component-intent` says to leave them in Figma and report that they weren't carried over. Reported here.

## Ruling applied

G2 passes under `decisions.md`, "2026-10-01 · Checkbox values with no token":

> These literals in `src/components/Checkbox/Checkbox.css` are accepted, because they're what the Figma node specifies, until the designer adds matching tokens:
>
> | Value | Property | Selector | Lines |
> |---|---|---|---|
> | `10px` | `gap` between the box and the label | `.hz-checkbox` | 4 |
> | `16px` | `width`, `height` on the box | `.hz-checkbox__box` | 11, 12 |
>
> **For an agent that hits it.** Gate 2 passes for exactly these values on exactly these properties in `Checkbox.css`. Quote this ruling in the report. When a 10px spacing token or a checkbox size token appears, the ruling no longer covers that value: use the token.
>
> **Not ruled.** Any other literal value, including a `var()` fallback. These values in any other component. A change to these values: a different number needs a new ruling or a token. The Button ruling of 2026-09-28 is separate and still covers only `Button.css`. The `error` state and any states Figma does not draw (disabled, hover, focus, indeterminate): those need the designer.

**Staying inside the boundary.** The file's three literals match the table value for value, property for property, selector for selector and line for line, and there are no others. No `var()` fallback, no value in another component, no changed number. No 10px spacing token or checkbox size token exists in `build/css/tokens.css` (spacing is 4/8/12/16/20/24 and there are no size tokens), so the ruling still applies. Note the ruling is applied only to G2. It does not cover the `error` state, and I have not used it for that.

## G5 and the undrawn error state

The gate's wording is "every variant and state the Figma node publishes exists in the code and is rendered by at least one story". The node publishes two states, both built and storied, so the gate passes on its own terms. It has no clause for a state that Figma's documentation describes but the node doesn't draw, and I am not stretching it to produce a block, nor the ruling to produce a pass: the ruling's "Not ruled" line leaves the `error` state to the designer.

The gap is nonetheless real and should not be read as clean. The Figma Usage frame (and so `use_when` item 3 in the intent file, word for word) tells consumers to acknowledge a destructive action "using the error state", and Best Practice says "Use the error state only for acknowledging destructive or irreversible actions". Checkbox has no error state: no prop, no class, no story. A consumer following the published guidance can't do what it says. Owner: the designer, who must either draw the state or remove those two lines; the engineer then builds it if drawn. The same applies to disabled, hover, focus and indeterminate, which Figma doesn't draw (the QA report notes a disabled checkbox is visually identical to an enabled one).

## How check 2 treats unbuilt alternatives

Check 2 asks one thing: is `instead` non-empty. It does not check that the named component exists. `Toggle` and `Radiocard` are not built (only `Button`, `Avatar` and `Checkbox` exist under `src/components/`), so two of the three pointers lead to components consumers can't import. `Button` is built. Check 2 passes all three with no warning. This is recorded so the reader isn't left thinking the pointers resolve. It is the same treatment as the Avatar and Button reviews.

## Failures

None.

## Warnings (not blocking)

None from check 2. The unbuilt-alternatives note above is informational.

## Other findings (outside the gates)

- **Accessible name when `showLabel={false}`.** The `a11y` entry for `Checkbox.tsx:17` says the label text "gives it its accessible name". That is true only while the label renders. With `showLabel={false}` (`Checkbox.tsx:29`) the `<span>` is not rendered and the input has no accessible name unless the consumer passes `aria-label`. The stories do pass `aria-label="Label"` for the two without-label cases, but the component doesn't require it and the intent file doesn't say so. The cited line is correct and the claim is true for the default, so C3 passes; the owner of the intent is `doc-generator` and of any enforcement the engineer. Related: Figma's own Best Practice says "Always give the checkbox a visible label", while the component offers a no-label option because Figma publishes the `ShowLabel` property.
- **The live docs page doesn't exist yet.** `Astro Link` is empty. `release-review` step 2 (read the production docs page first) could not be done, so the production Storybook stories were read instead. Under the registry's `Development` formula this doesn't change `Completed`; `Released` also needs `Astro Link`. `doc-generator` writes the Astro page and devops pushes it only for `Cleared` components, so this verdict is what unblocks that.
- **`variant_intent` values.** `unchecked` is `"default"` and `checked` is "The tick shows the checked state, so it doesn't rely on colour alone." Neither is in the Figma Usage frame as far as I could find; this contradicts `component-intent`'s "never write a sentence no source states". The check only needs the keys, so it isn't a gate failure, but the owner (`doc-generator`) should confirm where they came from or empty them.
- **QA report note.** `reports/Checkbox/qa-report.md` says the Figma primary (`#3b71f2`) is darker in the token pipeline (`#2b5ad6`). At the reviewed SHA `--color-interactive-primary` is `#3b71f2` in `build/css/tokens.css:112`, matching Figma, so the checked fill is right. The `#2b5ad6` value was not found by this review and I did not look for it elsewhere.
- **The SVG tick geometry** (`viewBox="0 0 16 16"` and the path coordinates, `Checkbox.tsx:22, 26`) are numbers in markup, not in the stylesheet. Gate 2 reads the stylesheet, so they aren't listed against it; recorded for completeness.
- **`VERSIONING.md` line 35** is a standing human task (see G7).
- **Staleness.** The row's `Last Modified` (2026-10-01T14:26:36Z) is earlier than the reviewed commit (2026-10-01T15:29:38+01:00 = 14:29:38Z), so the review isn't stale on entry. Writing the two registry cells will move `Last Modified` later than the commit again, which is the standing problem noted in earlier reviews.
- **How the reviewed commit was built.** The intent file was reviewed from a commit on a branch that is not `main`; `main` (`b398b11`) still carries the earlier intent with empty usage. The reviewed SHA is not an ancestor of `main` until this PR merges, so until it does the `Release Review` link points at a commit `main` doesn't contain.
- **Not run here.** Package preflight, the package and docs tracks, any version bump, publish or merge. Out of scope for this instruction.
