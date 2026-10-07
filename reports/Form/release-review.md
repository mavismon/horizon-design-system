# Form · release review (round 2)

- **Reviewed SHA:** `995c82c253c6b0c82e3f5175110e30b208c9063d` (`origin/main`, "Merge pull request #85 from mavismon/staging", 2026-10-07 10:49:14 +01:00). `src/components/Form/` at this SHA is unchanged since `f10ec350721cc8e5ecd66e2e805c328e47ee80fb` (`git diff 6ac7359 995c82c -- src/components/Form` is empty). This report is committed on top of the reviewed SHA, on branch `release-review/form-2`.
- **Date:** 2026-10-07
- **Verdict:** **Cleared**
- **Reviewer:** release agent, running `release-review` as a single-component prepare run. No version bump, no tag, no publish. Every gate and check was run fresh at the reviewed SHA. Round 1 (`reviewed 6ac7359`, committed at `67815db`) was Blocked on gate 2 only and is replaced by this file; it stays in git history.
- **Board row:** Form (`recYg56vp0CTvRth9`), read fresh: `Development` = `Completed`, `Design` = `Done`, `Production Storybook` set, `Commit` = `f10ec35`, `Astro Link` empty, `Release Review` and `Release Verdict` empty. `Last Modified` = 2026-10-07T09:39:36Z (10:39:36 +01:00), unchanged since round 1, so the review is not stale.

## Rulings

`decisions.md` was read in full at the reviewed SHA. One ruling covers Form: **"2026-10-07 · Form widths with no token"**. Quoted:

> **Ruling.** These literals in `src/components/Form/Form.css` are accepted, because they are what the Figma nodes specify, until the designer adds matching size tokens:
>
> | Value | Property | Selector | Lines |
> |---|---|---|---|
> | `720px` | `width` | `.hz-form--section` | 27 |
> | `440px` | `width` | `.hz-form--card` | 32 |
> | `400px` | `width` | field inside a section form | 71 |
> | `320px` | `width` | `.hz-textfield` | 95 |
>
> **For an agent that hits it.** Gate 2 passes for exactly these four values on exactly these properties in `Form.css`. [...] When a size token for 720px, 440px, 400px or 320px appears, the ruling no longer covers that value: use the token.
>
> **Not ruled.** Any other literal value, including a `var()` fallback. These values in any other component. A change to these values: a different number needs a new ruling or a token. The public export of `Textfield`, `TextfieldProps` and `TextfieldState` from `src/index.ts`, which the review raised as a warning.

How it was applied, and its limits:

- Applied to exactly the four values in the table. Value, property, selector and line were checked against `Form.css` at the reviewed SHA: `720px` at line 27 (`.hz-form--section`), `440px` at line 32 (`.hz-form--card`), `400px` at line 71 (`.hz-form--section .hz-form__field`), `320px` at line 95 (`.hz-textfield`), all `width`. They match.
- No size token for any of the four exists in `build/css/tokens.css` (built at the reviewed SHA), so the "use the token" condition is not triggered.
- The "Not ruled" line was honoured: the `Textfield` export is reported as a warning below, not waived and not blocked.
- **File defect, not a block:** `decisions.md` at the reviewed SHA contains unresolved merge conflict markers (`<<<<<<< HEAD` line 251, `=======` line 275, `>>>>>>> origin/staging` line 292) around the Modal and Form rulings. Both rulings are complete and readable on their own side of the markers, and the Form ruling (lines 276-291) is intact, so it was applied. A human should clean the file; an agent never edits it.

## Gates

| # | Gate | Result | Evidence |
|---|---|---|---|
| G1 | Done | Pass | `Development` reads `Completed`. `Production Storybook` (`.../?path=/story/components-form--all-variants`) returns HTTP 200, and the deployed `index.json` lists 14 Form stories (`section`, `section-without-description`, `section-without-field-3`, `section-without-field-3-and-4`, `section-without-footnote`, `card`, `card-without-description`, `card-without-link`, `invite-with-error`, `with-choice-fields`, `interaction`, `card-keyboard`, `textfield-states`, `all-variants`). No browser was available, so "opens" is evidenced by the 200 and the story index, not a render. |
| G2 | Tokens | Pass, by ruling | `src/components/Form/Form.css`, every declaration read, and grepped for px, rem, em, hex, `rgb`, `hsl` and any `var()` with a fallback. No hex, no `rgb`/`hsl`, no rem or em, no `var()` fallback (count 0). The only px declarations are `720px` (line 27), `440px` (line 32), `400px` (line 71) and `320px` (line 95), all covered exactly by the 2026-10-07 ruling above. The `10px` and `40px` on line 112 are inside a comment; the 10px input padding is built from tokens (`calc((var(--spacing-sm) + var(--spacing-md)) / 2 - var(--border-width-sm))`). Other non-token values: `font-weight` 400, 500, 600 (unitless), `width: 100%`, `max-width: 100%`, `inset 0 0 0 var(--border-width-sm)` (zero lengths). Without the ruling this gate fails on those four values. |
| G3 | Surface | Pass, with a warning | `src/index.ts` exports `Form`, `FormProps`, `FormType` and also `Textfield`, `TextfieldProps`, `TextfieldState`. The `Textfield` export is the warning below. Modal was added to `src/index.ts` after Form (PRs 81 and 82) and does not touch Form. |
| G4 | Names | Pass | Folder `src/components/Form/`, symbol `Form`, class prefix `hz-form` (and `hz-textfield` for the second exported component), intent `Form.intent.json`, board row `Form`. |
| G5 | States | Pass | Figma `241:91` (read in round 1, unchanged node ids): `type=section` and `type=card`. `FormType = "section" \| "card"` (`Form.tsx:9`). Textfield states `default, focused, filled, error, disabled` (`Textfield.tsx:5`) each in `TextfieldStates`. The 64-instance matrix is rendered by `AllVariants`; every Figma flag has a story. Figma draws no hover or pressed state. |
| G6 | Intent | Pass | `src/components/Form/Form.intent.json` exists at the reviewed SHA and passes the six checks below. |
| G7 | Version | Pass, with a standing note | `VERSIONING.md` exists. It names neither `Form` nor `Textfield`, nor Modal. Not edited. A human updates it before a version containing Form ships. |

## Checks

| # | Check | Result | Evidence |
|---|---|---|---|
| C1 | Fields present | Pass | All seven fields present with the right types: `use_when` 6, `dont_use_when` 3 objects, `variant_intent` 2 keys, `placement` `[]`, `pairs_with` 3, `required_tokens` 24, `a11y` 4 objects. `placement` is an empty array, a recorded Figma gap. |
| C2 | `dont_use_when` names an alternative | Pass | Toggle, SearchBar, Stepper, all named. No warnings. |
| C3 | `a11y` specific | Pass | `Form.tsx:85` `<form`, line 87 `noValidate`; `Form.tsx:92` the `<h2>`; `Textfield.tsx:49` `<label htmlFor>`; `Textfield.tsx:56-58` `disabled`, `aria-invalid`, `aria-describedby`. Every source line exists and implements its fact. |
| C4 | `required_tokens` resolve | Pass | `npm run build:tokens` at the reviewed SHA. All 24 listed tokens are defined in `build/css/tokens.css`. Scripted comparison: every `var(--...)` in `Form.css` is listed and every listed token is read. |
| C5 | Variants covered | Pass | `variant_intent` keys `section`, `card` equal `FormType`. |
| C6 | No two components claim the same job | Pass | No `use_when` line is identical to any in the 19 other intent files, now including `Modal`. Nearest by topic: `Button` ("submitting a form"), `ButtonGroup` ("end of a dialog or form"), `Dropdown` ("in forms"), `Link` ("next to a form"); Modal's lines are about confirming an action, not collecting input. Each is a part of a form or a different job, not a rival. |

## Failures

None. Gate 2 would fail on the four widths without the ruling; with it, none.

## Warnings

- **G3:** `Textfield`, `TextfieldProps` and `TextfieldState` are exported publicly with no recorded decision, and the ruling explicitly does not cover them. A human confirms they are meant to be public, or the engineer removes the export.
- **G7 standing note:** `VERSIONING.md` does not list Form, Textfield or Modal.
- **`decisions.md`** contains unresolved merge conflict markers (see Rulings).

## Not checked

- No browser: gate 1 is evidenced by HTTP 200 and the story index, not a render.
- `Astro Link` is empty, so the docs page could not be read first (step 2). Source and Storybook were used instead.
