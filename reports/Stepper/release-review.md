# Stepper · release review

- **Reviewed SHA:** `6817a3bf3201bba4f055992e2c3507e24b9fa4ae` (`origin/staging`, "Merge pull request #65 from mavismon/decisions/stepper", 2026-10-05). **This review is pinned at the tip of `origin/staging`, not `origin/main`**, because the human ruling for Stepper (`2026-10-05 · Stepper sizes with no token`, PR #65) lives in `decisions.md` on staging only. `src/components/Stepper/` on staging is identical to `origin/main` (`git diff origin/main origin/staging -- src` is empty at review time; main is at `12ead63`, PR #64).
- **Date:** 2026-10-05
- **Verdict:** **Cleared**
- **Reviewer:** release agent, running `release-review`
- **Board row:** Stepper (`recJ6WHQISVxFZw7r`), read fresh: `Development` = `Completed`, `Design` = `Done`, `Staging Storybook` and `Production Storybook` set, `Commit` = `e79120e`, 8 `Staging Testing` rows all `Passed`, `Composes` empty, `Astro Link` empty, `Release Review` and `Release Verdict` empty (first review). `Last Modified` = 2026-10-05T07:03:37Z, earlier than the reviewed commit (2026-10-05T08:07:52+01:00 = 07:07:52Z), so the review is not stale.

## Ruling applied

`decisions.md` was read in full at the reviewed SHA. One ruling covers Stepper, **"2026-10-05 · Stepper sizes with no token"**:

> These literals in `src/components/Stepper/Stepper.css` are accepted, because they are what the Figma node specifies, until the designer adds matching size tokens: `20px` `width`, `height` on `.hz-stepper__circle` (53, 54); `12px` `width`, `height` on `.hz-stepper__tick` (66, 67); `32px` `width` on `.hz-stepper__connector` (83); `280px` `width` on `.hz-stepper--quantity` (97); `28px` `width`, `height` on `.hz-stepper__button` (118, 119); `14px` `width`, `height` on `.hz-stepper__icon` (138, 139); `20px` `width` on `.hz-stepper__value` (143); `2px` `outline-offset` on `.hz-stepper__button:focus-visible` (44).
>
> For an agent that hits it: Gate 2 passes for exactly these values on exactly these properties in `Stepper.css`.
>
> Not ruled: any other literal value, including a `var()` fallback; these values in any other component; a change to these values; the selected colour drift (`#2b5ad6` against `#3b71f2`); the inline SVG tick and plus/minus icons; any state Figma does not draw (hover, pressed).

The ruling is applied to Gate 2 only, to exactly those declarations. No other ruling is applied.

## Gates and checks

| # | Gate / check | Result | Evidence |
|---|---|---|---|
| G1 | Done | Pass (browser step not done) | `Development` reads `Completed`. `Production Storybook` (`https://horizon-design-system-cdfi.vercel.app/?path=/story/components-stepper--progress-five-steps`) returns HTTP 200, and the deployed `index.json` lists eight Stepper stories: `progress-five-steps`, `progress-four-steps`, `progress-three-steps`, `quantity-default`, `quantity-at-min`, `quantity-at-max`, `quantity-without-label`, `interactive`. No browser was available to this agent, so "opens" is evidenced by the 200 and the story index only. |
| G2 | Tokens | Pass (by ruling) | Grep of `src/components/Stepper/Stepper.css` at the reviewed SHA for `px`, hex, `rgb(a)` and any `var(` containing a comma finds **exactly twelve declarations, all on lines the ruling lists, and no others**: `outline-offset: 2px` (44); `width: 20px` / `height: 20px` (53, 54, `.hz-stepper__circle`); `width: 12px` / `height: 12px` (66, 67, `.hz-stepper__tick`); `width: 32px` (83, `.hz-stepper__connector`); `width: 280px` (97, `.hz-stepper--quantity`); `width: 28px` / `height: 28px` (118, 119, `.hz-stepper__button`); `width: 14px` / `height: 14px` (138, 139, `.hz-stepper__icon`); `width: 20px` (143, `.hz-stepper__value`). Lines, properties, values and selectors match the ruling, with the one selector note in finding 1. No hex, no `rgb(a)`, no `var()` fallback. `var(--fontfamily-body), sans-serif` has `sans-serif` outside the `var()`, a keyword. `font-weight` 500 and 600 are unitless; `max-width: 100%` is a percentage, not px. |
| G3 | Surface | Pass | `src/index.ts:39` exports `Stepper`; line 40 exports the types `StepperProps`, `StepperType`, `StepperState`, `StepperStep`, `StepperStepState`. `src/styles.css:17` imports `Stepper.css`. Nothing says it should stay internal. |
| G4 | Names | Pass | Folder `src/components/Stepper/`, symbol `Stepper` (`Stepper.tsx:62`), CSS prefix `hz-stepper`, intent `Stepper.intent.json`, board row `Stepper`. Figma calls the set `stepper` (215:73). Same word, differing only in case and the `hz-` namespace. |
| G5 | States | Pass | Figma set `215:73` read fresh with `get_metadata`: four cells, `215:16` `type=progress, state=default`, `215:43` `type=quantity, state=default`, `215:53` `type=quantity, state=at-min`, `215:63` `type=quantity, state=at-max`. Step part `215:15` has `state=done` (215:2), `current` (215:7), `upcoming` (215:11). Code: `StepperType` = `progress`, `quantity`; `StepperState` = `default`, `at-min`, `at-max`; `StepperStepState` = `done`, `current`, `upcoming` (`Stepper.tsx:4-6`). Stories: `ProgressFiveSteps` (default steps render done, done, current, upcoming, upcoming), `ProgressFourSteps`, `ProgressThreeSteps` (the Figma `showStep4` / `showStep5` properties), `QuantityDefault`, `QuantityAtMin`, `QuantityAtMax`, `QuantityWithoutLabel` (`showLabel`), `Interactive`. Figma draws no hover or pressed state, and none are built. |
| G6 | Intent | Pass | `Stepper.intent.json` exists at the reviewed SHA and passes checks 1 to 6. |
| G7 | Version | Pass, with a standing note | `VERSIONING.md` exists at the reviewed SHA and states the 0.x bump rules and what each version commits you to. Line 35 lists the sixteen components in 0.2.0 and does not include `Stepper` (`package.json` is at 0.2.0). Reported, not edited. A human updates it before a version containing Stepper ships. |
| C1 | Fields present | Pass | All seven fields present with the right types. `use_when` 3 strings, `dont_use_when` 3 objects (`when`, `instead`), `variant_intent` 8 keys, `placement` `[]`, `pairs_with` `[]`, `required_tokens` 23, `a11y` 7 entries. No empty `use_when` or `dont_use_when`; `placement` and `pairs_with` are empty arrays, as in other components. |
| C2 | Alternatives named | Pass, 2 warnings | Entry 3 names `ProgressBar` (built and exported). Entries 1 and 2 have an empty `instead`: "For a flow of one or two steps: a page title is enough." and "For a number that can be large or exact, such as a price: use a text field." Both copy Figma (216:94, 216:95), and neither alternative is a built component. Warnings, not blockers. |
| C3 | a11y specific | Pass | Seven entries. Every cited line checked at the reviewed SHA: `Stepper.tsx:91` is `role="group"`; `:101` is the `aria-label={`Decrease ${label}`}`; `:102` is `disabled={state === "at-min"}`; `:107` is `<output ... aria-live="polite">`; `:143` is `aria-current={step.state === "current" ? "step" : undefined}`; `:145` is the connector `aria-hidden="true"`; `:147` is the `<button type="button" ... hz-stepper__step--button>` rendered only when `onStepClick` is passed. Each names a concrete element, attribute or behaviour and its line implements it. The "ordered list" in entry 5 is the `<ol>` further up, not on line 143; the line cited is the `aria-current` it also states. |
| C4 | Tokens resolve | Pass | `npm run build:tokens` run at the reviewed SHA wrote `build/css/tokens.css`. All 23 listed tokens are defined there. The set of `var(--...)` names in `Stepper.css` equals the listed set exactly (23 and 23, no difference either way). |
| C5 | Variants covered | Pass | `variant_intent` keys are `progress`, `quantity`, `default`, `at-min`, `at-max`, `done`, `current`, `upcoming`: exactly the union of the values of `StepperType` (2), `StepperState` (3) and `StepperStepState` (3). None missing, none extra. |
| C6 | No duplicate job | Pass | Compared `use_when` with the sixteen other intent files: no identical entry, no two components claim the same job. Nearest neighbours are ProgressBar and Breadcrumbs, and the boundary is declared from both sides: ProgressBar's `dont_use_when` ("For steps in a flow, such as "1 of 3"") and Breadcrumbs' ("To show the steps of a flow, such as checkout") both name `Stepper`, and Stepper's third `dont_use_when` names `ProgressBar`. |

## Intent against Figma Usage 216:84

Read fresh with `get_design_context` (file `dIHHqSq8c75n4olME0s9JS`).

- `use_when` (3 items) matches "Use a stepper" lines `216:89`, `216:90`, `216:91` word for word, in order.
- `dont_use_when` (3 items) matches "Do not use a stepper" lines `216:94`, `216:95`, `216:96` word for word, in order. The third names ProgressBar, spelled "Progressbar" in Figma; `instead` carries the built name `ProgressBar`.
- Three "Best Practice" lines (`216:99`, `216:100`, `216:101`: keep step labels to one to three words and let people go back to a done step; mark every step before the current one as done; give each counter a clear label and state limits nearby) are not in the file: `component-intent` has no field for them. Reported as the skill asks; they remain in Figma.

## Failures

None.

## Warnings (not blocking)

1. Check 2: two `dont_use_when` entries with an empty `instead` (see C2).

## Findings outside the gates

1. **The ruling names one selector for line 44; the rule has two.** Line 44, `outline-offset: 2px`, sits in the rule `.hz-stepper__step--button:focus-visible, .hz-stepper__button:focus-visible` (lines 41-42). The ruling's table lists only `.hz-stepper__button:focus-visible`. The line, property and value are exactly the ones ruled, and it is one declaration, so Gate 2 is passed on that basis; the done-step button selector shares the same literal. Owner: a human, to confirm the ruling was meant to cover the shared declaration, or to reword it.
2. **`VERSIONING.md` line 35 does not list Stepper.** See G7. Owner: a human.
3. **Pipeline colour drift.** QA recorded the done and current fill rendering with `--color-primary-default` `#2b5ad6` where Figma shows `#3b71f2`: accepted drift, outside the ruling and not a gate finding (the ruling's "Not ruled" names it). Owner: the designer.
4. **Icons approximate Figma's image assets.** Tick, minus and plus are inline SVGs with a 1.5 stroke and `currentColor` (`Stepper.tsx:36-61`). Named in the ruling's "Not ruled". Owner: the designer.
5. **Props that are not Figma properties.** `label`, `value`, `onDecrement`, `onIncrement`, `steps`, `onStepClick` and the HTML attributes are part of the public API once published (a 0.x breaking-change surface under `VERSIONING.md`). The component is controlled: it renders `value` and calls the callbacks; it does not hold the count. Owner: a human, to accept them as intended API.
6. **Focus drops when a done step becomes current.** A done step is a button only when `onStepClick` is passed; when it becomes current it renders as plain text, so keyboard focus falls back to the page (QA note 4). Owner: a human.
7. **Focus ring is not in Figma.** `--color-border-focus` outline (`Stepper.css:41-45`), the engineer's choice, matching Button.
8. **Dark mode not tested.** The QA report records no theme toggle in that Storybook.
9. **Browser-only checks not done in this review.** See the list below.

## Not checked by this agent (needs a browser or a human)

1. Production Storybook `?path=/story/components-stepper--progress-five-steps` renders five steps: two blue ticks, a blue "3" with a bold "Extras", two outlined circles, with blue connectors up to the current step.
2. `?path=/story/components-stepper--quantity-at-min` and `--quantity-at-max`: the minus (or plus) button is grey and not focusable; `--quantity-default` shows "2" between the buttons in a 280px row.
3. `?path=/story/components-stepper--interactive`: Tab shows the focus ring on a done step and on a counter button; clicking a done step moves back; the counter stops at 0 and 8.
4. `Astro Link` is empty, so the docs page was not read (step 2 of the skill). It is devops' cell and not part of the gates.
5. Whether `VERSIONING.md` should be updated to list Stepper, and whether finding 1 is acceptable.
