# Form · release review (round 1)

- **Reviewed SHA:** `6ac7359dfba1b027aa36dff99439aa0e46ee59fb` (`origin/main`, "Merge pull request #80 from mavismon/staging", 2026-10-07 10:38:24 +01:00). `src/components/Form/` last changed at `f10ec350721cc8e5ecd66e2e805c328e47ee80fb`. This report is committed on top of the reviewed SHA.
- **Date:** 2026-10-07
- **Verdict:** **Blocked** (gate 2 only)
- **Reviewer:** release agent, running `release-review` as a single-component prepare run. No version bump, no tag, no publish.
- **Board row:** Form (`recYg56vp0CTvRth9`), read fresh: `Development` = `Completed`, `Design` = `Done`, `Production Storybook` set, `Commit` = `f10ec35`, `Astro Link` empty, `Release Review` and `Release Verdict` empty. `Last Modified` = 2026-10-07T09:39:36Z (10:39:36 +01:00), about a minute after the reviewed commit and after the last change to `src/components/Form/`. It reads as the `Completed` / Production Storybook edit, not a code change, so the review is treated as not stale. Re-check if the row moves again.

## Rulings

`decisions.md` was read in full at the reviewed SHA. No ruling covers Form: the Card widths ruling (2026-10-07) and the others name other components and files, and each says "these values in any other component" is not ruled.

## Gates

| # | Gate | Result | Evidence |
|---|---|---|---|
| G1 | Done | Pass | `Development` reads `Completed`. `Production Storybook` (`.../?path=/story/components-form--all-variants`) returns HTTP 200 and the deployed `index.json` lists 14 Form stories (`section`, `section-without-description`, `section-without-field-3`, `section-without-field-3-and-4`, `section-without-footnote`, `card`, `card-without-description`, `card-without-link`, `invite-with-error`, `with-choice-fields`, `interaction`, `card-keyboard`, `textfield-states`, `all-variants`). No browser was available, so "opens" is evidenced by the 200 and the story index. |
| G2 | Tokens | **Fail** | `src/components/Form/Form.css`. No hex, `rgb`, `hsl`, rem, em or `var()` fallback. Four px literals, none covered by a ruling: `720px` (line 27, `width`, `.hz-form--section`), `440px` (line 32, `width`, `.hz-form--card`), `400px` (line 71, `width`, `.hz-form--section .hz-form__field`), `320px` (line 95, `width`, `.hz-textfield`). Each is the Figma size (QA report; Figma `241:2` is 720 wide, `241:64` is 440 wide) and each has `max-width: 100%`, but no size token exists and no ruling accepts them. The 10px input padding is built from tokens (`calc((var(--spacing-sm) + var(--spacing-md)) / 2 - var(--border-width-sm))`, line 113); the `10px` on lines 111-112 is inside a comment, not a declaration. Not counted: `font-weight` 400, 500, 600 (unitless), `width: 100%`, `inset 0 0 0 var(--border-width-sm)`. |
| G3 | Surface | Pass, with a note | `src/index.ts:50-53` exports `Form`, `FormProps`, `FormType`, and also `Textfield`, `TextfieldProps`, `TextfieldState`. `Textfield` is exported from Form's folder and is a public input in its own right. The intent file tells people to "build every input from textfield" but nothing records the decision to export it. Raised as a warning. |
| G4 | Names | Pass | Folder `src/components/Form/`, symbol `Form`, class prefix `hz-form` (and `hz-textfield` for the second exported component), intent `Form.intent.json`, board row `Form`. |
| G5 | States | Pass | Figma `241:91` read fresh: component set with `type=section` (720x510) and `type=card` (440x354). `FormType = "section" \| "card"` (`Form.tsx:9`). Textfield states `default, focused, filled, error, disabled` (`Textfield.tsx:5`) each in the `TextfieldStates` story. The 64-instance matrix is rendered by `AllVariants`; every Figma flag has a story. Figma draws no hover or pressed state (story header, QA report). |
| G6 | Intent | Pass | `src/components/Form/Form.intent.json` exists at the reviewed SHA and passes the six checks below. |
| G7 | Version | Pass, with a standing note | `VERSIONING.md` exists. Its "What 0.2.1 commits you to" section does not name `Form` or `Textfield`. Not edited. A human updates it before a version containing Form ships. |

## Checks

| # | Check | Result | Evidence |
|---|---|---|---|
| C1 | Fields present | Pass | All seven fields present with the right types: `use_when` 6, `dont_use_when` 3 objects, `variant_intent` 2 keys, `placement` `[]`, `pairs_with` 3, `required_tokens` 24, `a11y` 4 objects. `placement` is an empty array, a recorded Figma gap. |
| C2 | `dont_use_when` names an alternative | Pass | Toggle, SearchBar, Stepper, all named. No warnings. |
| C3 | `a11y` specific | Pass | `Form.tsx:85` is `<form`, line 87 `noValidate`; `Form.tsx:92` is the `<h2>`; `Textfield.tsx:49` is the `<label htmlFor>`; `Textfield.tsx:56-58` is `disabled`, `aria-invalid` and `aria-describedby`. Every source line exists and implements its fact. |
| C4 | `required_tokens` resolve | Pass | `npm run build:tokens` at the reviewed SHA. All 24 listed tokens are defined in `build/css/tokens.css`. Scripted comparison: every `var(--...)` in `Form.css` is listed and every listed token is read. |
| C5 | Variants covered | Pass | `variant_intent` keys `section`, `card` equal `FormType`. |
| C6 | No two components claim the same job | Pass | No `use_when` line is identical to any in the other 18 intent files. Nearest by topic: `Button` ("submitting a form"), `ButtonGroup` ("end of a dialog or form"), `Dropdown` ("in forms"), `Link` ("next to a form"). Each is a part of a form, not a rival. |

## Failures

1. **G2 Tokens** (`Form.css` lines 27, 32, 71, 95: `720px`, `440px`, `400px`, `320px`). Owner: a human, who either rules on these in `decisions.md` (as for Card's 284px / 234px) or the designer adds size tokens and the engineer uses them. Not fixed in this run.

## Warnings

- **G3:** `Textfield` is exported publicly with no recorded decision. A human confirms it is meant to be public (and a later `VERSIONING.md` update names it) or removes the export (engineer).
- **G7 standing note:** `VERSIONING.md` does not list Form or Textfield.
- **Registry (not a gate):** `reports/Form/qa-report.md` says the 71 round-1 `Staging Testing` rows still read `Fixed (To re-test)`. `Development` reads `Completed` now, so this appears resolved, but the QA caveat was written before that.

## Not checked

- No browser: gate 1 is evidenced by HTTP 200 and the story index, not a render.
- `Astro Link` is empty, so the docs page could not be read first (step 2). Source and Storybook were used instead.
