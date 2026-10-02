# ProgressBar · release review (re-review)

**This is a re-review. The earlier report, commit `4b750ca` on branch `release-review/progressbar-8539e62` (PR #31), is superseded. It was Blocked on gate 5 only. Nothing in it is carried over: every gate and check below was run again at the reviewed SHA.**

- **Reviewed SHA:** `396952ed83a3809e3fb58d559ce79eb29e58e3f4` (branch `release-review/progressbar-r2-396952e`). Two commits on top of `origin/main` `b0f41af`: `cd88d1c` (`ProgressBar: intent usage from Figma 140:82`, a cherry-pick of `8539e62`, changes only `src/components/ProgressBar/ProgressBar.intent.json`), then `396952e` (`ProgressBar: QA report and rulings for release re-review`, adds `reports/ProgressBar/qa-report.md` unchanged and appends the two ProgressBar rulings to `decisions.md`). Source under `src/` differs from the ProgressBar build commit `e01625a` (already in `origin/main`'s history) only in `ProgressBar.intent.json`. `git diff origin/main -- decisions.md` shows 25 added lines, 0 removed lines, and the added lines are exactly the two ruling files in order. This report is committed on top of the reviewed SHA.
- **Date:** 2026-10-02
- **Verdict:** **Cleared**
- **Reviewer:** release agent, running `release-review`
- **Board row:** ProgressBar (`recmo1UnYlgggjFTp`), read fresh: `Development` = `Completed`, `Design` = `Done`, `Production Storybook` and `Staging Storybook` set, `Commit` = `e01625a`, `Astro Link` empty, `Last Modified` = 2026-10-02T05:50:56Z. `Release Review` and `Release Verdict` currently hold the superseded Blocked values (`4b750ca`, Blocked) and are overwritten by this review.

`decisions.md` was read in full at the reviewed SHA. Two ProgressBar rulings are applied, each quoted below. Neither is stretched past its boundary.

## Gates and checks

| # | Gate / check | Result | Evidence |
|---|---|---|---|
| G1 | Done | Pass | `Development` reads `Completed`. `Production Storybook` (`https://horizon-design-system-cdfi.vercel.app/?path=/story/components-progressbar--all-variants`) returns HTTP 200 and the deployed `index.json` lists seven progressbar stories: `components-progressbar--md-primary`, `--sm-primary`, `--md-success`, `--sm-success`, `--md-neutral`, `--sm-neutral`, `--all-variants`. No browser was available to this agent, so "opens" is evidenced by the 200 and the story index, not by a rendered page; the QA report records the live render on the preview deployment. |
| G2 | Tokens | Pass (ruling) | Two literals in `src/components/ProgressBar/ProgressBar.css`: `height: 8px;` line 50 on `.hz-progressbar__track`, and `height: 6px;` line 60 on `.hz-progressbar--sm .hz-progressbar__track`. A grep for hex, `px`, `rem` and `em` finds only those two lines. No `var()` has a fallback value (`var(--fontfamily-body), sans-serif` on line 8 has `sans-serif` outside the `var()`, a keyword). `font-weight: 400` (lines 30, 40) and `600` (line 34) are unitless numbers. Both literals are covered exactly by the first ruling below; the line numbers are still 50 and 60. |
| G3 | Surface | Pass | `src/index.ts:15` exports `ProgressBar`; `src/index.ts:16` exports `ProgressBarProps`, `ProgressBarSize`, `ProgressBarTone`. `src/styles.css:8` imports `ProgressBar.css`. Nothing says it should stay internal. |
| G4 | Names | Pass | Folder `src/components/ProgressBar/`, symbol `ProgressBar` (`ProgressBar.tsx:25`), CSS prefix `hz-progressbar`, intent `ProgressBar.intent.json`, board row `ProgressBar`. Allowing only for case and the `hz-` namespace. Figma calls the set `progressbar` (140:66); same word. |
| G5 | States | Pass (ruling) | Figma set `140:66` read fresh with `get_metadata`: eight cells, `140:5`, `140:17`, `140:24`, `140:31`, `140:38`, `140:45` (size md/sm x tone primary/success/neutral) and `140:52`, `140:59` (size md/sm x tone inverse). The code has six: `ProgressBarSize = "md" \| "sm"`, `ProgressBarTone = "primary" \| "success" \| "neutral"` (`ProgressBar.tsx:5-6`). Each of the six built cells has a story (`MdPrimary` 140:5, `SmPrimary` 140:17, `MdSuccess` 140:24, `SmSuccess` 140:31, `MdNeutral` 140:38, `SmNeutral` 140:45), plus `AllVariants`. The only published cells with no code and no story are `140:52` and `140:59`, which is exactly what the second ruling covers. Figma still draws the inverse track and fill the same colour (design context for 140:66 shows both as `--color-text-inverse`, `#f9fafb`), so the ruling's premise holds. Figma draws no interactive states and none are built. See "Rulings applied". |
| G6 | Intent | Pass | `ProgressBar.intent.json` exists at the reviewed SHA and passes checks 1 to 6. |
| G7 | Version | Pass, with a standing note | `VERSIONING.md` exists at the reviewed SHA and states the 0.x bump rules and what 0.1.0 commits you to. Line 35 is stale: it says 0.1.0 "contains one component, `Button`", while the source also exports Avatar, Checkbox, Chip, Image, Link, Logo and ProgressBar. Reported, not edited. A human updates it before a version containing ProgressBar ships. |
| C1 | Fields present | Pass | All seven fields present with the right types. `use_when` 4 strings, `dont_use_when` 2 objects (`when`, `instead`), `variant_intent` 5 keys, `required_tokens` 12, `a11y` 5 entries. `placement` and `pairs_with` are `[]`: the stories import only `ProgressBar` and render it alone, including the `AllVariants` matrix. |
| C2 | Alternatives named | Pass, no warnings | Both `dont_use_when` entries have a non-empty `instead`: `Stepper`, `Table`. Neither is built (`src/components/` holds Avatar, Button, Checkbox, Chip, Image, Link, Logo, ProgressBar). Check 2 asks only that `instead` is non-empty, so no warning, as the pointers are Figma's own. |
| C3 | a11y specific | Pass | Five entries, each cited line checked at the reviewed SHA: `ProgressBar.tsx:59` is `<progress` (native element, `max={100}` on line 61); `:63` `aria-labelledby={showLabel ? labelId : undefined}`; `:64` `aria-label={showLabel ? undefined : label}`; `:65` `aria-describedby={showHelper ? helperId : undefined}`; `:20` `function clamp(value: number)` (non-finite and 0..100 handling on its following lines, applied to `current`). Each names a concrete element, attribute or behaviour and its line implements it. |
| C4 | Tokens resolve | Pass | `npm run build:tokens` run at the reviewed SHA wrote `build/css/tokens.css`. All 12 listed tokens are defined there: `--color-bg-surface`, `--color-primary-default`, `--color-status-success`, `--color-text-primary`, `--color-text-secondary`, `--fontfamily-body`, `--fontsize-lg`, `--fontsize-sm`, `--lineheight-lg`, `--lineheight-sm`, `--radius-full`, `--spacing-xs`. The stylesheet reads those 12 plus `--hz-progressbar-fill`, which the stylesheet itself defines (lines 2, 12, 16): a component-local property, not a token, so correctly absent from `required_tokens`. |
| C5 | Variants covered | Pass | `variant_intent` keys are `md`, `sm`, `primary`, `success`, `neutral`: exactly the values of `ProgressBarSize` and `ProgressBarTone` (`ProgressBar.tsx:5-6`). None missing, none extra. No `inverse` key, because there is no `inverse` in the union. |
| C6 | No duplicate job | Pass | Compared `use_when` with the seven other intent files (Avatar, Button, Checkbox, Chip, Image, Link, Logo): no identical entry, and none claims the same job (fullness against a total, parts of a whole, a score out of a maximum). Stepper and Table, named as alternatives, are not built, so there is no second claimant. |

## Rulings applied

### G2: "2026-10-02 · ProgressBar track heights with no token"

> **Ruling.** These literals in `src/components/ProgressBar/ProgressBar.css` are accepted, because they are what the Figma node specifies, until the designer adds matching size tokens:
>
> | Value | Property | Selector | Lines |
> |---|---|---|---|
> | `8px` | `height` (md track) | `.hz-progressbar__track` | 50 |
> | `6px` | `height` (sm track) | `.hz-progressbar--sm .hz-progressbar__track` | 60 |
>
> **For an agent that hits it.** Gate 2 passes for exactly these values on exactly these properties in `ProgressBar.css`. Quote this ruling in the report. When a size token for 8px or 6px appears, the ruling no longer covers that value: use the token.

Judgement: value, property, selector and line each match at the reviewed SHA (line 50 is `  height: 8px;` inside `.hz-progressbar__track`, lines 45-57; line 60 is `  height: 6px;` inside `.hz-progressbar--sm .hz-progressbar__track`, lines 59-61). No other literal exists. No 8px or 6px size token exists in `build/css/tokens.css` (`--spacing-sm` is 8px and `--radius-sm` is 6px, a spacing and a radius token, as the ruling says), so the ruling still applies.

### G5: "2026-10-02 · ProgressBar inverse tone not built"

> **Ruling.** Gate 5 passes for the missing `inverse` tone, and for that tone only, until the designer gives the inverse track a colour distinct from its fill and the tone is built. The user decided to build only the three working tones (primary, success, neutral). No story is drawn for the inverse tone, and the tone union does not include it.
>
> **For an agent that hits it.** Gate 5 passes for exactly the cells 140:52 and 140:59 being unbuilt. Quote this ruling in the report. When the designer fixes the inverse colours, this ruling no longer applies: the tone must be built, and the review run again. The Usage line 140:204 ("Use tone inverse on navy backgrounds, such as a sold-out night in the calendar") is copied verbatim from Figma into the intent file and recommends this unbuilt tone: report it as a docs and designer gap, not a gate finding.
>
> **Not ruled.** Any other published Figma variant or state that is not built. Any change to the six built cells. The two literals ruled in "ProgressBar track heights with no token". Whether Figma's Usage line about the inverse tone should be removed or reworded: that is for the designer.

Judgement: the finding is exactly the ruling's. The published cells that are not built are `140:52` and `140:59` and no others; the six other cells are built and each has a story; the union has no `inverse`, no story exists for it, and no other Figma variant or state is missing. Nothing outside the cells `140:52` and `140:59` is passed by this ruling. The ruling is read as covering G5 only: it is not used for G2, C5, or anything else.

## Failures

None.

## Warnings (not blocking)

None from check 2.

## Intent content against Figma 140:82

Read fresh with `get_design_context` at review time (file `dIHHqSq8c75n4olME0s9JS`).

- `use_when` (4 items) matches "Use a Progressbar" lines `140:185`, `140:192`, `140:198`, `140:204` word for word, in order.
- `dont_use_when` (2 items) matches "Do not use a progressbar" lines `140:210` and `140:216` word for word, in order. `instead` is the component each sentence names (`Stepper`, `Table`).
- Six "Best Practice" lines (`140:226` to `140:256`) are not in the file: `component-intent` has no field for them. Reported as the skill asks; they remain in Figma.
- `variant_intent` text (`"md": "8px (default)"`, `"sm": "6px (dense layouts such as calendar cells)"`, `"primary": "default"`) is not in the Usage frame. It comes from the description on component set 140:66 ("size: md 8px (default), sm 6px (dense layouts such as calendar cells). tone: primary (default), success, neutral, inverse (on navy)"). Check 5 tests keys only; not a finding.

## Other findings (outside the gates)

- **A published Usage line recommends an unbuilt tone.** `use_when[3]` ("Use tone inverse on navy backgrounds...") will appear in the docs site Usage tab, and the Figma component description also says "inverse (on navy)". A consumer following it would write `tone="inverse"`, which TypeScript rejects. Per the G5 ruling this is a docs and designer gap, not a gate finding. Owner: the designer.
- **No visible number when the label row is hidden.** With `showLabel={false}` the component renders no value text (`ProgressBar.tsx` wraps the label and `${current}%` in the same conditional), while a Figma Best Practice says "Always show the number too". The Usage frame also says to hide the label row when the layout already names it. Owner: the designer, if the number should survive hiding the label.
- **Story inline px.** `ProgressBar.stories.tsx` uses inline `width: 300` and `gap: 24` on its decorators. These are story layout, not the component stylesheet; gate 2 reads the stylesheet. Noted only.
- **No docs page yet.** `Astro Link` is empty, so there was no production docs page to read (step 2). With `Cleared`, `Development` reads `Released` only after `doc-generator` stages the page, `devops` pushes it, and the orchestrating session writes `Astro Link`.
- **`VERSIONING.md` line 35** is stale (G7 note).
- **Staleness.** Row `Last Modified` (2026-10-02T05:50:56Z) is earlier than the reviewed commit (`396952e`, 2026-10-02T08:14:52+01:00), so the review is not stale on entry. Writing the two registry cells moves `Last Modified` later than the commit again, the standing problem noted in earlier reviews.
- **Not run.** Package preflight, the package and docs tracks, any version bump, publish, merge, or the docs site. Out of scope for this instruction.
