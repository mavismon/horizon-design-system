# RadioCard · release review

- **Reviewed SHA:** `d1cdfd1031de736355af26a48bd719a7ae9e3151` (`origin/staging`, "Merge pull request #59 from mavismon/decisions/radiocard", 2026-10-04). **This review is pinned at the tip of `origin/staging`, not `origin/main`**, because the human ruling for RadioCard lives in `decisions.md` on staging only. `src/components/RadioCard/` on staging is identical to `origin/main` (`git diff origin/main origin/staging -- src` is empty at review time; main has since moved to `76c7256`). It differs from the first review's commit `08082a3` by one change: `c02f816`, `min-width: 1px` replaced with `min-width: 0` in `RadioCard.css`. Staging also gained a `Header` component since `08082a3`; it is outside this review. This replaces the earlier report (Blocked at `08082a3`, PR #55).
- **Date:** 2026-10-04
- **Verdict:** **Cleared**
- **Reviewer:** release agent, running `release-review`
- **Board row:** RadioCard (`recz4e46V5mhdfbjH`), read fresh: `Development` = `Completed`, `Design` = `Done`, `Staging Storybook` and `Production Storybook` set, `Commit` = `122dada`, 6 `Staging Testing` rows all `Passed`, `Composes` empty, `Astro Link` empty, `Last Modified` = 2026-10-04T16:32:41Z, earlier than the reviewed commit, so the review is not stale. The previous verdict (`Blocked`, linking the first report) is overwritten by this one.

## Ruling applied

`decisions.md` was read in full at the reviewed SHA. One ruling covers RadioCard, **"2026-10-04 · RadioCard radio and dot sizes with no token"**:

> These literals in `src/components/RadioCard/RadioCard.css` are accepted, because they are what the Figma node specifies, until the designer adds matching size tokens: `18px` `width` (line 47) and `18px` `height` (line 48) on `.hz-radiocard__radio`; `8px` `width` (line 60) and `8px` `height` (line 61) on `.hz-radiocard--selected .hz-radiocard__radio::after`.
>
> For an agent that hits it: Gate 2 passes for exactly these values on exactly these properties in `RadioCard.css`.
>
> Not ruled: any other literal value, including a `var()` fallback; these values in any other component; a change to these values; the selected colour drift (`#2b5ad6` against `#3b71f2`); the 76px card height against Figma's 74px; any state Figma does not draw.

The ruling is applied to Gate 2 only, to exactly those four declarations. No other ruling is applied.

## Gates and checks

| # | Gate / check | Result | Evidence |
|---|---|---|---|
| G1 | Done | Pass (browser step not done) | `Development` reads `Completed`. `Production Storybook` (`https://horizon-design-system-cdfi.vercel.app/?path=/story/components-radiocard--all-states`) returns HTTP 200 (re-checked), and the deployed `index.json` lists twelve RadioCard stories: `unselected`, `selected`, `disabled`, `unselected-without-description`, `selected-without-description`, `disabled-without-description`, `unselected-without-trailing`, `selected-without-trailing`, `disabled-without-trailing`, `selected-title-only`, `all-states`, `group`. No browser was available to this agent, so "opens" is evidenced by the 200 and the story index only. The orchestrating session has since confirmed production RadioCard renders, with `min-width: 0` and 480x76 cards, on the `832c706` deploy (reported to this agent, not observed by it). |
| G2 | Tokens | Pass (by ruling) | Grep of `src/components/RadioCard/RadioCard.css` at the reviewed SHA for `px`, hex, `rgb(a)` and any `var(` containing a comma finds **exactly four** literals and no others: `width: 18px;` (line 47) and `height: 18px;` (line 48) on `.hz-radiocard__radio`; `width: 8px;` (line 60) and `height: 8px;` (line 61) on `.hz-radiocard--selected .hz-radiocard__radio::after`. The line numbers, values, properties and selectors match the ruling above exactly. Line 76 is now `min-width: 0;` (`c02f816`), unitless, no literal. No hex, no `rgb(a)`, no `var()` fallback. `var(--fontfamily-body), sans-serif` has `sans-serif` outside the `var()`, a keyword. `font-weight` values are unitless. All four literals are covered by the ruling, quoted above. |
| G3 | Surface | Pass | `src/index.ts:35` exports `RadioCard`; line 36 exports the types `RadioCardProps` and `RadioCardState`. `src/styles.css:15` imports `RadioCard.css`. Nothing says it should stay internal. |
| G4 | Names | Pass | Folder `src/components/RadioCard/`, symbol `RadioCard` (`RadioCard.tsx:20`), CSS prefix `hz-radiocard`, intent `RadioCard.intent.json`, board row `RadioCard`, allowing only for case and the `hz-` namespace. Figma calls the set `radiocard` (212:21); same word. The intent file refers to the component as "Radiocard" in other components' `dont_use_when` text (Checkbox, Dropdown, Toggle), which is only case. |
| G5 | States | Pass | Figma set `212:21` read fresh with `get_metadata`: three cells, `212:2` `state=unselected`, `212:8` `state=selected`, `212:15` `state=disabled`. Code: `RadioCardState` (`RadioCard.tsx:4`) is exactly `unselected`, `selected`, `disabled`. Each has a story: `Unselected`, `Selected`, `Disabled`, plus `AllStates` rendering all three. The Figma boolean properties `showDescription` and `showTrailing` are implemented (`RadioCard.tsx:15, 16`) and each has stories for every state without description (3), without trailing (3), and `SelectedTitleOnly`. A `Group` story shows real interaction. Figma draws no hover or pressed state, and none are built. |
| G6 | Intent | Pass | `RadioCard.intent.json` exists at the reviewed SHA and passes checks 1 to 6. |
| G7 | Version | Pass, with a standing note | `VERSIONING.md` exists at the reviewed SHA and states the 0.x bump rules and what 0.1.0 commits you to. Line 35 is stale: it says 0.1.0 "contains one component, `Button`", while the source exports sixteen. Reported, not edited. A human updates it before a version containing RadioCard ships. |
| C1 | Fields present | Pass | All seven fields present with the right types. `use_when` 3 strings, `dont_use_when` 3 objects (`when`, `instead`), `variant_intent` 3 keys, `placement` 1, `pairs_with` `[]` (the stories import only `RadioCard`), `required_tokens` 22, `a11y` 3 entries. |
| C2 | Alternatives named | Pass, no warnings | All three `dont_use_when` entries have a non-empty `instead`: `Dropdown`, `Checkbox`, `ButtonGroup`. All three are built and exported. |
| C3 | a11y specific | Pass | Three entries. Every cited line checked at the reviewed SHA: `RadioCard.tsx:34` is `type="radio"` (line 37 sets `disabled`, so the real attribute is set); `RadioCard.tsx:32` is the `<label` that wraps the input and the text; `RadioCard.tsx:41` is the `<span className="hz-radiocard__radio" aria-hidden="true" />`. Each names a concrete element, attribute or behaviour and its line implements it. |
| C4 | Tokens resolve | Pass | `npm run build:tokens` run at the reviewed SHA wrote `build/css/tokens.css`. All 22 listed tokens are defined there. The set of `var(--...)` names in `RadioCard.css` equals the listed set exactly (22 and 22, no difference either way). |
| C5 | Variants covered | Pass | `variant_intent` keys are `unselected`, `selected`, `disabled`: exactly the values of `RadioCardState` (`RadioCard.tsx:4`). None missing, none extra. |
| C6 | No duplicate job | Pass, with finding 4 | Compared `use_when` with the fourteen other intent files (`Header`, added since the first review, has no intent file and is not part of this comparison): no identical entry, and no two components claim the same job. Nearest neighbours: Dropdown ("To pick one value from a list of five or more") and ButtonGroup segmented ("switch a view between 2 to 4 options"). The boundary is declared in both directions: RadioCard's `dont_use_when` sends more than five options to Dropdown, and Dropdown's sends two to four visible options to "Buttongroup type segmented, or Radiocard". Checkbox's and Toggle's `dont_use_when` point exactly-one choices to Radiocard. Adjacent, not the same job. Reported as finding 4. |

## Intent against Figma Usage 212:49

Read fresh with `get_design_context` (file `dIHHqSq8c75n4olME0s9JS`).

- `use_when` (3 items) matches "Use a radio card" lines `212:54`, `212:55`, `212:56` word for word, in order.
- `dont_use_when` (3 items) matches "Do not use a radio card" lines `212:59`, `212:60`, `212:61` word for word, in order. `instead` is the component each sentence names (`Dropdown`, `Checkbox`, `ButtonGroup`).
- Three "Best Practice" lines (`212:64`, `212:65`, `212:66`: always preselect one card; stack cards 8px apart, same width; keep the title short) are not in the file: `component-intent` has no field for them. Reported as the skill asks; they remain in Figma.

## Failures

None. The only failure in the first review, Gate 2 (five px literals), is resolved: `1px` removed by `c02f816`, and the four remaining literals are covered by the ruling.

## Warnings (not blocking)

None from check 2.

## Findings outside the gates

1. **Card height is 76px, Figma's frame is 74px.** Figma node 212:2 lays the card out as 16px padding, a 20px title, a 4px gap and an 18px description, which is 74px with the 1px stroke inside the frame. The CSS uses `box-sizing: border-box` with a 1px border and 16px padding, so the card is 76px (the QA report measured and accepted 76x76, and 54px without description). This is the same stroke-inside against stroke-outside difference as Chip. Not a gate finding. Owner: a human, to accept it or ask the engineer to adjust.
2. **Pipeline colour drift.** QA recorded the selected state rendering with `--color-primary-default` `#2b5ad6` where Figma's variable export gives `#3b71f2`, the same accepted drift as Button, Chip and Toggle. QA also notes Checkbox uses `--color-interactive-primary` (`#3b71f2`), so Checkbox and RadioCard render different blues. Owner: the designer, to confirm which is intended.
3. **Props that are not Figma properties.** `name`, `value`, `onChange` and the other input attributes pass through to the input (the story header says so). They are part of the public API once published (a 0.x breaking-change surface for `VERSIONING.md`). `state` is controlled: the parent owns which card is selected, and when `onChange` is omitted a no-op handler is supplied (`RadioCard.tsx:38`). Owner: a human, to accept them as intended API.
4. **Dropdown and RadioCard both claim five options.** Dropdown says "five or more", RadioCard says "two to five". The boundary at exactly five is claimed by both. Check 6 passes on the literal test, and each intent points to the other. Owner: the designer.
5. **Radio group role is not part of the component.** Arrow-key navigation works only when the cards share a `name` (stories pass one), and the `role="radiogroup"` and its label live in the `Group` story, not in the component. A consumer who stacks cards without both loses the group semantics. The intent's `placement` says "Stacked vertically in a radiogroup", but nothing enforces it. Owner: a human.
6. **No focus or pressed state in Figma.** Keyboard focus draws a `--color-border-focus` outline (`RadioCard.css:36-39`), an engineer's choice recorded in the QA report. Not drawn in Figma.
7. **Dark mode not tested.** The QA report records no theme toggle in that Storybook.
8. **Browser-only checks not done in this review.** See the list below.

## Not checked by this agent (needs a browser or a human)

1. The production Storybook `?path=/story/components-radiocard--group`: Tab lands on the checked card, ArrowDown moves selection and focus past the disabled card, click moves selection (QA verified on the branch preview only).
2. The selected card shows a blue border, ring and filled 8px dot, and the disabled card is grey (QA verified on the branch preview). The orchestrating session has confirmed the production render and the 480x76 card size on the `832c706` deploy.
3. Whether 76px against Figma's 74px (finding 1) is acceptable. The ruling does not cover it.
4. `Astro Link` is empty, so the docs page was not read (step 2 of the skill). It is devops' cell and not part of the gates.
5. The `RadioCard.css` `min-width: 0` change was not re-tested by QA; it is a one-line change that the orchestrating session reports as layout-unchanged.
