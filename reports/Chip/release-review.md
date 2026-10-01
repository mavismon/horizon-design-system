# Chip · release review

- **Reviewed SHA:** `fed2f802e80b98ce7beb483a38bb9448be4cb6b7` (branch `release-review/chip-fed2f80`). It is two commits on top of `origin/main` `b76ece1`: `Chip: intent usage from Figma 122:336` (cherry-pick of `571febb`, changes only `src/components/Chip/Chip.intent.json`) and `Chip: ruling on 32px height, QA report` (adds the Chip ruling to `decisions.md`, and `reports/Chip/qa-report.md`). `git diff origin/main -- decisions.md` showed the added Chip ruling section and nothing else. Source other than the intent file is identical to the build commit `25239c9` (`git diff 25239c9 fed2f80 -- src` lists only `Chip.intent.json`). This report is committed on top of the reviewed SHA.
- **Date:** 2026-10-01
- **Verdict:** **Cleared**
- **Reviewer:** release agent, running `release-review`
- **Board row:** Chip (`recU6uVfNLfAyQukR`), read fresh before this review: `Development` = `Completed`, `Production Storybook` = `https://horizon-design-system-cdfi.vercel.app/?path=/story/components-chip--all-states`, `Staging Storybook` set, `Commit` = `25239c9`, `Astro Link` empty, `Release Review` and `Release Verdict` empty, `Last Modified` = 2026-10-01T15:21:03Z.

`decisions.md` was read in full at the reviewed SHA. One ruling is applied (G2, quoted below).

## Gates and checks

| # | Gate / check | Result | Evidence |
|---|---|---|---|
| G1 | Done | Pass | Row reads `Completed`. `Production Storybook` returns 200 and the deployed `index.json` lists `components-chip--unselected`, `--selected`, `--selected-strong` and `--all-states`. |
| G2 | Tokens | Pass (ruling) | The only hex or px literal in `src/components/Chip/Chip.css` is `height: 32px` on `.hz-chip`, line 6, exactly as ruled. No hex anywhere. No `var()` has a fallback; every `var()` is bare. `font-weight: 500` (line 17) is a unitless number, not a px/hex literal. `font-family: var(--fontfamily-body), sans-serif` (line 14) has the generic family outside the `var()`, so it is not a fallback inside it and not a literal value. |
| G3 | Surface | Pass | `src/index.ts:7` exports `Chip`; `src/index.ts:8` exports `ChipProps` and `ChipState`. Added in the build commit; nothing marks it internal. |
| G4 | Names | Pass | Folder `src/components/Chip/`, symbol `Chip` (`Chip.tsx:12`), CSS prefix `hz-chip`, intent `Chip.intent.json`, board row `Chip`. |
| G5 | States | Pass | Figma component set 121:15 publishes `unselected` (121:8), `selected` (121:11), `selected-strong` (121:13) and nothing else. `ChipState` (`Chip.tsx:4`) is those three values. Stories `Unselected`, `Selected`, `SelectedStrong`, `AllStates` exist and are in the deployed `index.json`. See "Undrawn states" below. |
| G6 | Intent | Pass | `Chip.intent.json` exists at the reviewed SHA and passes checks 1 to 6. |
| G7 | Version | Pass | `VERSIONING.md` exists and states the 0.x bump rules. Standing note, not a finding: line 35 says 0.1.0 "contains one component, `Button`". True of 0.1.0 as published; it goes stale once a version containing Chip ships, and a human must edit it then. This review did not edit it. |
| C1 | Fields present | Pass | All seven fields present with the right types. `use_when` 4 strings, `dont_use_when` 4 objects of `when` + `instead`, `variant_intent` 3 keys, `placement` `[]`, `pairs_with` `[]` (every story renders Chip alone or in a variant matrix), `required_tokens` 12, `a11y` 3. |
| C2 | Alternatives named | Pass, no warnings | All four `instead` values are non-empty: `Badge`, `Button`, `Checkbox`, `Link`. See "How check 2 treats unbuilt alternatives". |
| C3 | a11y specific | Pass | Three entries, all checked at the reviewed SHA. `Chip.tsx:19` is `<button`, the native element (the `type="button"` is on line 20, so the entry's wording "native `<button type="button">`" is carried by lines 19 and 20 together; line 19 is the element, not a mismatch). `Chip.tsx:21` is `aria-pressed={state !== "unselected"}`, true for `selected` and `selected-strong`, false for `unselected`; `{...rest}` is spread on line 23, after it, so a caller's `aria-pressed` overrides it, as the entry says. `Chip.tsx:25` is `{label}`, the button's text content. Each cited line exists and implements its fact. |
| C4 | Tokens resolve | Pass | `npm run build:tokens` at the reviewed SHA wrote `build/css/tokens.css`. All 12 `required_tokens` are defined there. The set of `var(--...)` names in `Chip.css` is the same 12, so none is unlisted. |
| C5 | Variants covered | Pass | `variant_intent` keys are `unselected`, `selected`, `selected-strong`, exactly the `ChipState` union (`Chip.tsx:4`). |
| C6 | No duplicate job | Pass, with an overlap noted | Compared with `Button`, `Avatar` and `Checkbox`. Button and Avatar share no use with Chip (Button triggers actions, Avatar represents a person). Checkbox is the one that touches: its fourth `use_when` is "For a list of options where the user can choose any number, such as search filters", and Chip's first is "To filter a list of results, such as search filters". Both name search filters. This is legitimate rather than a duplicated job. Chip's third `dont_use_when` sends "a yes or no choice inside a form" to Checkbox, and Checkbox's third sends "to trigger an action" to Button, so each points at the other for the case it does not own. They differ in shape: Chip is an inline, immediately-applied, pressed/unpressed filter control (`aria-pressed`) and category switcher; Checkbox is a form choice. But neither intent says how to choose between them for filters, since the wording is the designer's own, copied verbatim. I judged this a pass, not a block, because the check fails "two components listing the same use", and the two lists are not the same use. It should be put to the designer. |

## Intent content against Figma 122:336

Read with `get_design_context` at review time (file `dIHHqSq8c75n4olME0s9JS`). The four `use_when` items match "Use a Chip" (nodes 122:435, 122:442, 122:448, 122:454) word for word and in order. The four `dont_use_when` `when` strings match "Do not use a chip" (122:460, 122:466, 122:472, 122:478) word for word and in order; each `instead` is the component the sentence names. Nothing is invented. The six "Best Practice" items (nodes 122:484 to 122:514: short labels, a chip that is on must use a selected state, don't mix selected and selected-strong in one row, 8px spacing, a way to clear all filters, mark the selection with aria-pressed or aria-selected) are not in the file because it has no field for them; per `component-intent` they stay in Figma.

## How check 2 treats unbuilt alternatives

Check 2 asks one thing: is `instead` non-empty. It does not check that the named component exists. Of Chip's four alternatives, `Button` and `Checkbox` are built and exported. `Badge` and `Link` are not built (only `Button`, `Avatar`, `Checkbox` and `Chip` exist under `src/components/`). The check passes all four with no warning. Today two of the four pointers lead to components consumers can't import. Button's and Avatar's intents already do the same.

## Undrawn states

Figma draws no hover, focus, disabled or pressed Chip, and the code builds none (`Chip.stories.tsx` lines 3 to 5 say so). Gate 5 asks for every state the Figma node publishes, so it passes. The gate is silent on states the product might need but the design never drew. Chip is a native `<button>`, so the browser's focus ring and `disabled` behaviour apply, but nothing is styled for them, and the `Staging Testing` rows record no test of them. The ruling's "Not ruled" line leaves these states open. They need the designer.

## Ruling applied

G2 passes under `decisions.md`, "2026-10-01 · Chip height with no token":

> This literal in `src/components/Chip/Chip.css` is accepted, because it is what the Figma node specifies, until the designer adds a matching size token:
>
> | Value | Property | Selector | Lines |
> |---|---|---|---|
> | `32px` | `height` (with `box-sizing: border-box`) | `.hz-chip` | 6 |
>
> **For an agent that hits it.** Gate 2 passes for exactly this value on exactly this property in `Chip.css`. Quote this ruling in the report. When a size token for 32px appears, the ruling no longer covers it: use the token.

**Staying inside the boundary.** The file's one literal matches the table value, property, selector and line (`height: 32px` on `.hz-chip`, line 6, with `box-sizing: border-box` on line 5). There is no 7px padding (`padding-block: 0`, line 8), no `var()` fallback, and no other literal. No 32px size token exists in `build/css/tokens.css`, so the ruling still applies. The ruling's "Not ruled" line also names the selected fill and the undrawn states; both are reported below, neither is treated as covered.

## Failures

None.

## Warnings (not blocking)

None from check 2. See the unbuilt-alternatives note and the C6 overlap note above, which are informational.

## Other findings (outside the gates)

- **Selected fill is not Figma's blue.** `.hz-chip--selected` uses `--color-primary-default` (lines 23, 24), which renders `#2b5ad6`; Figma shows `#3b71f2`. It is a token, not a literal, so it is not a G2 failure, and the ruling's "Not ruled" line records it as the user's choice (the token is darkened for WCAG AA, white on `#3b71f2` is 4.16:1). Reported so it is not lost.
- **No `Astro Link` yet, so step 2 (read the docs page first) could not be done.** The docs site has no Chip page to compare with the source. The gate list does not need `Astro Link`, so this does not block, but the `Released` status will not read until `doc-generator` stages the page and `devops` pushes it.
- **`VERSIONING.md` line 35** is a standing human task (see G7).
- **`npm test` passes (15 of 15) but covers only Button.** No test covers Chip. Informational.
- **Staleness.** The row's `Last Modified` (2026-10-01T15:21:03Z) is earlier than the reviewed commit (2026-10-01T16:32:05+01:00 = 15:32:05Z), so the review is not stale on entry. Writing the two registry cells will move `Last Modified` later than the commit, the standing problem noted in earlier reviews.
- **Not run here.** Package preflight, the package and docs tracks, any version bump, publish or merge.
