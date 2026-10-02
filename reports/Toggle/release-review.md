# Toggle · release review

- **Reviewed SHA:** `75d7fa0f1c8d0e4562dddbe5469d2090df365f3b` (branch `release-review/toggle-c70925e`, two commits on top of `origin/main` `771407e`). Those two commits are: `dc0cb14`, the intent commit cherry-picked from the local `intent/toggle-usage` (`29215df`, only `src/components/Toggle/Toggle.intent.json` changes); and `75d7fa0` itself, which adds `decisions.md` (origin/main's file with the 2026-10-02 Toggle ruling appended verbatim; the diff against origin/main is 16 added lines and no removals) and `reports/Toggle/qa-report.md` (copied unchanged). The build commit `c70925e` is already in `main`'s history, so no source other than the intent file differs from `main`. This report is committed on top of the reviewed SHA.
- **Date:** 2026-10-02
- **Verdict:** **Blocked** (check 5, variants covered)
- **Reviewer:** release agent, running `release-review`
- **Board row:** Toggle (`rec0Rv1EYrh3uwYwr`), read fresh: `Development` = `Completed`, `Design` = `Done`, `Production Storybook` and `Staging Storybook` set, `Commit` = `c70925e`, `Astro Link` empty, `Release Review` and `Release Verdict` empty, `Last Modified` = 2026-10-02T07:45:32Z.

`decisions.md` was read in full at the reviewed SHA. One ruling is applied (G2, quoted below). The earlier rulings (Button, Avatar, Checkbox, Chip, Logo, ProgressBar, npm token, 2FA) don't bear on Toggle.

## Gates and checks

| # | Gate / check | Result | Evidence |
|---|---|---|---|
| G1 | Done | Pass | `Development` reads `Completed`. `Production Storybook` (`https://horizon-design-system-cdfi.vercel.app/?path=/story/components-toggle--all-variants`) returns 200, and `index.json` on that host lists nine stories: `components-toggle--md-off`, `--sm-off`, `--md-on`, `--sm-on`, `--md-disabled-off`, `--sm-disabled-off`, `--md-disabled-on`, `--sm-disabled-on`, `--all-variants`. |
| G2 | Tokens | Pass (ruling) | Every digit in `src/components/Toggle/Toggle.css` was listed. Literal px: `height: 24px` (line 16, `.hz-toggle--md`) and `height: 22px` (line 21, `.hz-toggle--sm`). Literal alpha: `40%` inside `color-mix(in srgb, var(--color-primary-default) 40%, transparent)` (line 45, `.hz-toggle:disabled:checked`). No hex, no `rgb()`/`hsl()`, no `var()` fallback (every `var(--…)` is bare). Everything else numeric is not a px, hex or alpha literal: `flex-shrink: 0` and `margin: 0` (zero, unitless, lines 7, 8); `aspect-ratio: 11 / 6` (line 17), `20 / 11` (line 22) and `1` (line 29), which are unitless ratios of two numbers and carry no length unit, colour or alpha; `height: 100%` (line 28), a percentage of the parent, not a px value. The two aspect-ratios set the track widths (44px, 40px) and the knob is the track height, so none of those sizes is written down as a px literal. The 2px inset is `border: var(--border-width-md) solid transparent` (line 9). The three literals match the ruling below value for value, property for property, selector for selector and line for line. |
| G3 | Surface | Pass | `src/index.ts:17` exports `Toggle`; `src/index.ts:18` exports types `ToggleProps` and `ToggleSize`. Added in the build commit; nothing says it should stay internal. |
| G4 | Names | Pass | Folder `src/components/Toggle/`, symbol `Toggle` (`Toggle.tsx:12`), CSS prefix `hz-toggle`, intent `Toggle.intent.json`, board row `Toggle`. |
| G5 | States | Pass (see the section below) | Figma component set `144:20` publishes 8 cells: size `md`/`sm` x state `off`/`on`/`disabled-off`/`disabled-on` (144:4, 6, 8, 10, 12, 14, 16, 18). All eight exist in code and each has its own story. |
| G6 | Intent | Fail | `Toggle.intent.json` exists at the reviewed SHA but fails check 5, so the gate that requires it to pass the six checks fails with it. C1 to C4 and C6 pass. |
| G7 | Version | Pass, with a standing note | `VERSIONING.md` exists and states the 0.x bump rules, what counts as public and what 0.1.0 commits you to. Standing note, not a finding on this review: line 35 says 0.1.0 "contains one component, `Button`". It is stale for any version that ships Toggle, and a human must update it. This review did not edit it. |
| C1 | Fields present | Pass | All seven fields present with the right types. `use_when` 4 strings, `dont_use_when` 3 `{when, instead}` objects, `variant_intent` 6 keys, `required_tokens` 6, `a11y` 2 entries, `placement` and `pairs_with` `[]` (stories render Toggle alone or in a matrix of Toggles). |
| C2 | Alternatives named | Pass, no warnings | All three `instead` values are non-empty: `Checkbox`, `Radiocard`, `Button`. See "How check 2 treats unbuilt alternatives". |
| C3 | a11y specific | Pass | Two entries, both with a source line that exists at the reviewed SHA. `Toggle.tsx:16` is `role="switch"` on the `<input type="checkbox">` (line 15), which is the native switch the entry describes. `Toggle.stories.tsx:12` is `args: { size: "md", "aria-label": "Setting" }`. Note: the second entry's fact is an absence ("no built-in label; callers supply aria-label or wrap in a label"). The cited line shows a caller supplying `aria-label`, and `Toggle.tsx:18` (`{...rest}`) is what forwards it. The line is concrete and exists, so it passes. |
| C4 | Tokens resolve | Pass | `npm run build:tokens` at the reviewed SHA wrote `build/css/tokens.css`. All 6 `required_tokens` are defined there: `--border-width-md` 65 (2px), `--color-bg-elevated` 102 (`#f9fafb`), `--color-border-strong` 110 (`#c8d2dd`), `--color-primary-default` 122 (`#2b5ad6`), `--color-state-disabled-bg` 139 (`#e5e7ed`), `--radius-full` 42 (999px). The set of `var(--…)` names in `Toggle.css` is exactly those six (diffed, no difference). |
| C5 | Variants covered | **Fail** | See "C5 in detail". |
| C6 | No duplicate job | Pass, with a note | See "C6 in detail". |

## C5 in detail

The check: "The keys of `variant_intent` are exactly the values of the component's variant union type: none missing, none extra." `component-intent` says the same: "One key per value of the component's variant union type in code."

The component's variant union type in code is `ToggleSize = "md" | "sm"` (`Toggle.tsx:4`). `variant_intent` has six keys: `md`, `sm`, and `off`, `on`, `disabled-off`, `disabled-on`. The first two match the union. The other four are extra: they are the values of Figma's combined `state` property, which the build maps to the native `checked` and `disabled` attributes, so no union in code carries them. Read as written, "none extra" fails.

The Checkbox precedent (`reports/Checkbox/release-review.md`) passed C5 with `variant_intent` keys `unchecked`/`checked` taken from Figma's `state` and no state union in code. The shape is the same, but the situations are not identical: Checkbox exports no variant union at all, so there was nothing in code for its keys to be extra against, and that review compared the keys against the Figma-published values instead. Toggle does export a variant union, and four keys sit outside it. The precedent therefore can't be applied without stretching the check's words, and I'm not stretching them. Stated plainly, the precedent's reading ("pass on the Figma values when code has no union") is itself a loosening of the wording; this review does not extend it to a component that has a union.

The mapping is documented (comment in `Toggle.stories.tsx:3-4`), the Figma side is fully covered and nothing is missing, so this is a mismatch of file against check wording rather than a defect in the component. It still blocks: every check blocks except check 2, and no ruling in `decisions.md` covers it. `doc-generator` flagged the same shape in advance.

**Owner and options.** The intent file belongs to `doc-generator` (`component-intent`); this review does not edit it. Either (a) the four state keys are removed so `variant_intent` is `md` and `sm` only, then a re-review; or (b) a human settles that `variant_intent` may also carry Figma-published properties that map to native props, by a ruling in `decisions.md` or by changing the wording of check 5 and of `component-intent`. If (b), the Checkbox and Toggle shapes become the written rule rather than a precedent.

Related, not part of the verdict: the `variant_intent` values for `off` (`"default"`) and for `md` (`"default; settings lists"`) include the word "default", which is not in Figma Usage frame 145:712. It describes the code default (`size = "md"`, `checked` absent) rather than anything Figma says. `component-intent` says never to write a sentence no source states; "default" is a code fact for `md`, but the `off` value has no Figma or code source beyond the same reading. The Checkbox review raised the same point. The owner is `doc-generator`.

## C6 in detail

Compared Toggle's `use_when` with every other intent file in `src/components/` (Avatar, Button, Checkbox, Chip, Image, Link, Logo, ProgressBar). No other component lists the same use, and none is a duplicate.

The only pair that touches is Toggle and Checkbox:

- Toggle: "To turn a single setting on or off, such as a notification" and "For a setting that takes effect immediately, without a Save button".
- Checkbox: "To let the user opt in to something, such as marketing emails or staying signed in", "To confirm the user has read and agreed to terms", acknowledging a destructive action, and "For a list of options where the user can choose any number".

The overlap is real at the edge: "opt in to marketing emails" (Checkbox) and "turn a notification on or off" (Toggle) can describe the same screen. What separates them is when the choice takes effect. Toggle's `dont_use_when` sends "a choice submitted together with a form, such as agreeing to terms" to Checkbox, and Checkbox's `dont_use_when` sends "a setting that takes effect immediately" to Toggle. Each points at the other with the same dividing line (immediate against submitted), which is a split of the job, not two components claiming it. They don't list the same use, so C6 passes. A consumer still has to decide, for a notification preference on a form with a Save button, which one applies; the Figma Usage text gives the rule but not that example. Button's `dont_use_when` also already sends "a toggleable on/off state" to "Toggle or Checkbox", which is consistent with this.

## Intent content against Figma Usage frame 145:712

Read with `get_design_context` (file `dIHHqSq8c75n4olME0s9JS`). The four `use_when` items match "Use a Toggle" word for word and in order (nodes 145:811, 145:818, 145:824, 145:830). The three `dont_use_when` items match "Do not use a toggle" word for word and in order (145:836, 145:842, 145:848), each `instead` being the component the sentence names (`Checkbox`, `Radiocard`, `Button`). The only difference is that Figma's typographic quotes appear as plain ASCII quotes in the file. Nothing is invented.

The six "Best Practice" items (145:854 to 145:884) are not in the file because the file has no field for them; `component-intent` says to leave them in Figma and report that they weren't carried over. Reported here. Two of them describe things the built component does not provide: see "Other findings".

## Ruling applied

G2 passes under `decisions.md`, "2026-10-02 · Toggle track heights and disabled alpha with no token":

> **Ruling.** These literals in `src/components/Toggle/Toggle.css` are accepted, because they are what the Figma node specifies, until the designer adds matching size and opacity tokens:
>
> | Value | Property | Selector | Lines |
> |---|---|---|---|
> | `24px` | `height` (md track) | the md switch track | 16 |
> | `22px` | `height` (sm track) | the sm switch track | 21 |
> | `40%` | alpha in `color-mix(in srgb, var(--color-primary-default) 40%, transparent)` (disabled-on track only) | the disabled and checked switch track | 45 |
>
> **For an agent that hits it.** Gate 2 passes for exactly these three values on exactly these properties in `Toggle.css`. Quote this ruling in the report. When a size token for 24px or 22px, or an opacity token for 40%, appears, the ruling no longer covers that value: use the token.
>
> **Not ruled.** Any other literal value, including a `var()` fallback. These values in any other component. A change to these values: a different number needs a new ruling or a token. The on track, which uses `--color-primary-default` (`#2b5ad6`) and differs from the `#3b71f2` Figma shows: that is the user's choice to use the bound token, not a gate finding. The low contrast of the off track and of the knob on the disabled-off track as Figma draws them, which the user chose to build as drawn: that needs the designer. Any state Figma does not draw (hover, pressed, error, loading).

**Staying inside the boundary.** The line numbers in the ruling (16, 21, 45) are the line numbers at the reviewed SHA. There is no other px, hex or alpha literal and no `var()` fallback. The ruling's "Not ruled" items are reported here and not used to cover anything. No 24px or 22px size token and no opacity token exists in `build/css/tokens.css` (there are no size or opacity tokens; `--spacing-2xl` is a spacing token), so the ruling still applies. The on-fill colour (`--color-primary-default`, `#2b5ad6`, against Figma's `#3b71f2`) is not a literal and not a gate failure; it is reported under "Other findings" as the ruling asks.

## G5 and the state mapping

The gate's wording is "every variant and state the Figma node publishes exists in the code and is rendered by at least one story". The node publishes eight cells. In code, `size` (`ToggleSize`, `Toggle.tsx:4`) carries md and sm; `off` and `on` are the native `checked` state (`.hz-toggle:checked`, `Toggle.css:34`); `disabled-off` is `:disabled` (`Toggle.css:39`); `disabled-on` is `:disabled:checked` (`Toggle.css:44`). Each of the eight has its own story (`MdOff`, `SmOff`, `MdOn`, `SmOn`, `MdDisabledOff`, `SmDisabledOff`, `MdDisabledOn`, `SmDisabledOn`, `Toggle.stories.tsx:19-29`), plus `AllVariants`, all in the deployed `index.json`. The mapping from Figma's combined `state` to the native props is commented at `Toggle.stories.tsx:3-4`. The gate has no clause requiring a state to be a prop. Checkbox is the precedent: Figma `state` unchecked/checked mapped to native `checked`, no `state` prop, G5 passed. G5 passes on its own terms.

Note the contrast with C5: G5 asks whether the states exist and are storied, and they do. C5 asks about the intent file's keys against a union type, and that is where the same decision (no `state` prop) shows up as a mismatch.

## How check 2 treats unbuilt alternatives

Check 2 asks one thing: is `instead` non-empty. It does not check that the named component exists. `Radiocard` is not built (the components under `src/components/` are Avatar, Button, Checkbox, Chip, Image, Link, Logo, ProgressBar, Toggle), so one of the three pointers leads to a component consumers can't import. `Checkbox` and `Button` are built. Check 2 passes all three with no warning. Recorded so the reader isn't left thinking the pointers all resolve. Same treatment as the Avatar, Button and Checkbox reviews.

## Failures

- **C5 (and so G6).** `variant_intent` has four keys (`off`, `on`, `disabled-off`, `disabled-on`) that are not values of the variant union `ToggleSize`. Owner: the intent file, `doc-generator`; or a human, if they rule that Figma-mapped properties may appear as keys. See "C5 in detail".

## Warnings (not blocking)

None from check 2. The unbuilt-alternative note above is informational.

## Other findings (outside the gates)

- **Usage lines the built component doesn't provide.** Use-when item 3 (carried into the intent file word for word) says to put "the label and helper text on the left and the toggle on the right", and a Best Practice item says to "explain why a disabled toggle can't be changed in the helper text". A Best Practice item says "Make the whole row clickable, not only the switch". Toggle has no helper text, no label and no row: it is the bare switch (Figma draws only the switch), and the stories render it alone. A consumer can build all three around it, but nothing in Horizon does, and the published guidance reads as if it does. Owner: the designer (draw the row, or trim the lines); the engineer builds it if drawn.
- **On-fill colour.** The on track renders `#2b5ad6` (`--color-primary-default`, darkened for WCAG AA) where Figma shows `#3b71f2`. This is the user's choice, as for Button, Chip and ProgressBar, covered by the ruling's "Not ruled" paragraph as not a gate finding. Reported as asked.
- **Low contrast, built as drawn.** Per the QA report, the off track (`#C8D2DD`) on a light page is about 1.5:1, below the 3:1 non-text contrast guideline, and the knob on the disabled-off track (`#E5E7ED` against the knob `#F9FAFB`) is about 1.2:1, nearly invisible. The user chose to build it as drawn. Owner: the designer.
- **Best Practice says `aria-checked`; the code doesn't set it.** The Best Practice item reads `role="switch" with aria-checked`. The component uses a native `<input type="checkbox" role="switch">`, whose `checked` state maps to the switch state without `aria-checked`, and the intent's first `a11y` entry says so. The built behaviour is sound; the Figma wording and the code differ on mechanism only.
- **Accessible name.** There is no built-in label, so an unlabelled Toggle has no accessible name. The stories pass `aria-label`; the component doesn't require it. Figma's own Best Practice says "Always pair the toggle with a visible label". Nothing in the types enforces either. Owner: the engineer, if enforcement is wanted.
- **The live docs page doesn't exist yet.** `Astro Link` is empty. `release-review` step 2 (read the production docs page first) could not be done, so the production Storybook stories were read instead. `doc-generator` writes the Astro page only for `Cleared` components; with this verdict `Blocked`, the docs gate for Toggle stays closed until a re-review clears it.
- **`VERSIONING.md` line 35** is a standing human task (see G7).
- **Firefox not tested.** The QA report notes only Chromium was tested for the `::before` knob on an `appearance: none` input.
- **Staleness.** The row's `Last Modified` (2026-10-02T07:45:32Z) is earlier than the reviewed commit, so the review isn't stale on entry. Writing the two registry cells will move `Last Modified` later than the commit again, the standing problem noted in earlier reviews.
- **How the reviewed commit was built.** The reviewed commit is on a branch that is not `main`; `main` (`771407e`) still carries the earlier Toggle intent with empty usage. The reviewed SHA isn't an ancestor of `main` until the PR merges, so until then the `Release Review` link points at a commit `main` doesn't contain.
- **Not run here.** Package preflight, the package and docs tracks, any version bump, publish or merge. Out of scope for this instruction.
