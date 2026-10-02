# Toggle · release review (re-review)

- **This is a re-review.** The earlier report (commit `e4d8c0d`, branch `release-review/toggle-c70925e`, PR #35, verdict **Blocked** on check 5 and gate 6) is **superseded** by this one. Every gate and check below was run fresh at the reviewed SHA; nothing is carried over from that report.
- **Reviewed SHA:** `c8628e262856e132407c8b40bb53a178cd767767` (branch `release-review/toggle-r2-c8628e2`, three commits on top of `origin/main` `771407e`):
  - `c84e63f`: intent usage from Figma 145:712 (cherry-pick of local `29215df`; only `Toggle.intent.json`).
  - `9ea16b9`: `variant_intent` keys from `ToggleSize` only (cherry-pick of local `2eb4e6f`; only `Toggle.intent.json`; removes the four Figma state keys).
  - `c8628e2`: adds `reports/Toggle/qa-report.md` (copied unchanged) and appends the 2026-10-02 Toggle ruling to `decisions.md` verbatim (diff against `origin/main`: 16 lines added, 0 removed).
  - Against `origin/main` the whole change is exactly those three files. The build commit `c70925e` is already in `main`. This report is committed on top of the reviewed SHA.
- **Date:** 2026-10-02
- **Verdict:** **Cleared**
- **Reviewer:** release agent, running `release-review`
- **Board row:** Toggle (`rec0Rv1EYrh3uwYwr`), read fresh: `Development` = `Completed`, `Design` = `Done`, `Production Storybook` and `Staging Storybook` set, `Commit` = `c70925e`, `Astro Link` empty, `Last Modified` = 2026-10-02T07:48:21Z (before the reviewed commit). `Release Review` and `Release Verdict` held the earlier values (`e4d8c0d` link, `Blocked`) and are overwritten together by this review.

`decisions.md` was read in full at the reviewed SHA. One ruling is applied (G2, quoted below). The earlier rulings (Button, Avatar, Checkbox, Chip, Logo, ProgressBar, npm token, 2FA) don't bear on Toggle.

## Gates and checks

| # | Gate / check | Result | Evidence |
|---|---|---|---|
| G1 | Done | Pass | `Development` reads `Completed`. `Production Storybook` (`https://horizon-design-system-cdfi.vercel.app/?path=/story/components-toggle--all-variants`) returns 200; `index.json` on that host lists nine Toggle stories: `components-toggle--md-off`, `--sm-off`, `--md-on`, `--sm-on`, `--md-disabled-off`, `--sm-disabled-off`, `--md-disabled-on`, `--sm-disabled-on`, `--all-variants`. |
| G2 | Tokens | Pass (ruling) | Every digit, `#`, `rgb` and `hsl` in `src/components/Toggle/Toggle.css` was listed (grep). Literals: `height: 24px` line 16 (`.hz-toggle--md`), `height: 22px` line 21 (`.hz-toggle--sm`), `40%` inside `color-mix(in srgb, var(--color-primary-default) 40%, transparent)` line 45 (`.hz-toggle:disabled:checked`). The line numbers are **16, 21 and 45 at the reviewed SHA, as the ruling states**. No hex, no `rgb()`/`hsl()`, no `var()` fallback. The other digits are not px, hex or alpha literals: `flex-shrink: 0`, `margin: 0` (lines 7, 8), `aspect-ratio: 11 / 6`, `20 / 11`, `1` (lines 17, 22, 29; unitless ratios), `height: 100%` (line 28). The 2px inset is `var(--border-width-md)` (line 9). |
| G3 | Surface | Pass | `src/index.ts:17` exports `Toggle`; `src/index.ts:18` exports types `ToggleProps` and `ToggleSize`. Nothing says it should stay internal. |
| G4 | Names | Pass | Folder `src/components/Toggle/`, symbol `Toggle` (`Toggle.tsx:12`), CSS prefix `hz-toggle`, intent `Toggle.intent.json`, board row `Toggle`. |
| G5 | States | Pass | Figma component set `144:20` publishes 8 cells (read fresh with `get_metadata`): size `md`/`sm` x state `off`/`on`/`disabled-off`/`disabled-on` (144:4, 6, 8, 10, 12, 14, 16, 18). Size is the `size` prop (`ToggleSize`, `Toggle.tsx:4`; md 44x24 and sm 40x22 per Figma). `off`/`on` = native `checked` (`Toggle.css:34`), `disabled-off` = `:disabled` (`Toggle.css:39`), `disabled-on` = `:disabled:checked` (`Toggle.css:44`). Each of the 8 cells has its own story (`MdOff`, `SmOff`, `MdOn`, `SmOn`, `MdDisabledOff`, `SmDisabledOff`, `MdDisabledOn`, `SmDisabledOn`, `Toggle.stories.tsx:19-29`) plus `AllVariants`, all in the deployed `index.json`. The mapping from Figma's combined `state` to native props is commented at `Toggle.stories.tsx:3-4`. Checkbox is the precedent (Figma `state` mapped to native `checked`, no `state` prop, G5 passed). |
| G6 | Intent | Pass | `Toggle.intent.json` exists at the reviewed SHA and passes C1 to C6 below. |
| G7 | Version | Pass, with a standing note | `VERSIONING.md` exists and states the 0.x bump rules and what 0.1.0 commits consumers to. Standing note, not a finding on this review: line 35 says 0.1.0 "contains one component, `Button`", which is stale for any version that ships Toggle. A human must update it; this review did not. |
| C1 | Fields present | Pass | All seven fields present with the right types (checked by script). `use_when` 4 strings, `dont_use_when` 3 `{when, instead}` objects, `variant_intent` 2 keys, `required_tokens` 6, `a11y` 2 `{fact, source}` entries, `placement` and `pairs_with` `[]` (stories render Toggle alone or in a matrix of Toggles). |
| C2 | Alternatives named | Pass, no warnings | All three `instead` values are non-empty: `Checkbox`, `Radiocard`, `Button`. See "Unbuilt alternative". |
| C3 | a11y specific | Pass | Two entries, both with a source line that exists at the reviewed SHA. `Toggle.tsx:16` is `role="switch"` on the `<input type="checkbox">` (line 15), the native switch the entry describes. `Toggle.stories.tsx:12` is `args: { size: "md", "aria-label": "Setting" }`; the entry's fact is an absence (no built-in label), the cited line shows a caller supplying `aria-label`, and `Toggle.tsx:18` (`{...rest}`) forwards it. Concrete and present, so it passes. |
| C4 | Tokens resolve | Pass | `npm run build:tokens` at the reviewed SHA (working tree clean afterwards). All 6 `required_tokens` are defined in `build/css/tokens.css`: `--border-width-md` line 65 (2px), `--color-bg-elevated` 102 (`#f9fafb`), `--color-border-strong` 110 (`#c8d2dd`), `--color-primary-default` 122 (`#2b5ad6`), `--color-state-disabled-bg` 139 (`#e5e7ed`), `--radius-full` 42 (999px). The set of `var(--...)` names in `Toggle.css` is exactly those six (sorted unique list compared; no difference). |
| C5 | Variants covered | Pass | `variant_intent` keys are `md` and `sm`. `ToggleSize = "md" \| "sm"` (`Toggle.tsx:4`), confirmed by script. The keys equal the union exactly: none missing, none extra. This is the reading the check's wording requires, with no appeal to the Checkbox precedent. |
| C6 | No duplicate job | Pass, with a note | See "C6 in detail". |

## C6 in detail

Compared Toggle's `use_when` with every other intent file in `src/components/` (Avatar, Button, Checkbox, Chip, Image, Link, Logo, ProgressBar), read fresh at the reviewed SHA. No other component lists the same use. The only pair that touches is Toggle and Checkbox: Toggle's "turn a single setting on or off, such as a notification" and "takes effect immediately, without a Save button" against Checkbox's "opt in to something, such as marketing emails", "confirm the user has read and agreed to terms" and "choose any number of options". The edge overlaps (a notification opt-in can be either), but the two split the job by when the choice takes effect: Toggle's `dont_use_when` sends "a choice submitted together with a form" to Checkbox, and Checkbox's sends "a setting that takes effect immediately" to Toggle. That is one job divided, not claimed twice. Button's `dont_use_when` also routes "a toggleable on/off state" to "Toggle or Checkbox", consistent with this.

## Intent content against Figma Usage frame 145:712

Read fresh with `get_design_context` (file `dIHHqSq8c75n4olME0s9JS`) and compared by script, string for string. The four `use_when` items equal "Use a Toggle" word for word and in order (145:811, 145:818, 145:824, 145:830). The three `dont_use_when.when` items equal "Do not use a toggle" word for word and in order (145:836, 145:842, 145:848); each `instead` is the component the sentence names. The only difference is that Figma's typographic quotes are plain ASCII quotes in the file. Both comparisons returned equal. Nothing is invented. `variant_intent` values (`"default; settings lists"`, `"dense tables"`) do not carry the earlier "off" key's "default" wording; "default" on `md` is the code default (`size = "md"`, `Toggle.tsx:12`) next to Figma's "settings lists" (145:824), and is not a failure.

The six "Best Practice" items (145:854 to 145:884) are not in the file because the file has no field for them; they stay in Figma. Reported, not a finding against the file.

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

Staying inside the boundary: the three literals sit at lines 16, 21 and 45 exactly as ruled, and there is no other px, hex or alpha literal and no `var()` fallback. No size or opacity token exists in `build/css/tokens.css`, so the ruling still applies. The "Not ruled" items are reported below and not used to cover anything.

## Unbuilt alternative

Check 2 asks only that `instead` be non-empty. `Radiocard` is not built (components under `src/components/` are Avatar, Button, Checkbox, Chip, Image, Link, Logo, ProgressBar, Toggle), so one of the three pointers leads to a component consumers can't import. Informational; same treatment as earlier reviews.

## Failures

None.

## Warnings (not blocking)

None from check 2.

## Other findings (outside the gates)

- **Usage lines the built component doesn't provide.** Use-when item 3 (carried verbatim into the intent file) says to put "the label and helper text on the left and the toggle on the right"; Best Practice items say to explain a disabled toggle "in the helper text" and to "make the whole row clickable". Toggle is the bare switch: no label, helper text or row, and Figma draws only the switch. Owner: the designer (draw the row or trim the lines); the engineer builds it if drawn.
- **On-fill colour.** The on track renders `#2b5ad6` (`--color-primary-default`) where Figma shows `#3b71f2`. The user's choice, covered by the ruling's "Not ruled" paragraph as not a gate finding.
- **Low contrast, built as drawn.** Per the QA report, the off track (`#C8D2DD`) on a light page is about 1.5:1, below the 3:1 non-text guideline, and the knob on the disabled-off track is about 1.2:1. The user chose to build it as drawn. Owner: the designer.
- **Best Practice says `aria-checked`; the code doesn't set it.** The native `<input type="checkbox" role="switch">` maps `checked` to the switch state without `aria-checked`, as the intent's first `a11y` entry says. Mechanism differs from the Figma wording only.
- **Accessible name.** There is no built-in label, so an unlabelled Toggle has no accessible name; the stories pass `aria-label` but the types don't require it. Owner: the engineer, if enforcement is wanted.
- **No docs page yet.** `Astro Link` is empty, so `release-review` step 2 (read the production docs page first) could not be done; the production Storybook stories were read instead. `doc-generator` writes the Astro page for `Cleared` components, and devops sets `Astro Link`.
- **`VERSIONING.md` line 35** is a standing human task (see G7).
- **Firefox not tested.** The QA report notes only Chromium was tested for the `::before` knob on an `appearance: none` input.
- **Staleness.** `Last Modified` (2026-10-02T07:48:21Z) is earlier than the reviewed commit, so the review isn't stale on entry. Writing the two registry cells will move `Last Modified` later than the commit again, the standing problem noted in earlier reviews.
- **Reviewed SHA is not on `main` until the PR merges.** `main` (`771407e`) still carries the earlier Toggle intent with empty usage. Until the PR merges, the `Release Review` link points at a commit `main` doesn't contain.
- **Not run here.** Package preflight, the package and docs tracks, any version bump, publish or merge.
