# SearchBar · release review (re-run)

- **Reviewed SHA:** `5ad7d20de212f20a3b33e79d832a19fb9aa31483` (branch `release-review/searchbar-2`). Three commits on top of `origin/main` `f93eead`: `d12d57a` (cherry-pick of `5c7eb0f`, `SearchBar: intent file from Figma 214:29, code and stories`, adds only `src/components/SearchBar/SearchBar.intent.json`), `14dbdc8` (cherry-pick of `3af0297`, adds `empty`, `focused`, `filled` to `variant_intent` as empty strings, nothing else) and `5ad7d20` (the QA report, copied unchanged to `reports/SearchBar/qa-report.md`). `src/` differs from the SearchBar build commit `96ecae0` only in the intent file. `decisions.md` is untouched. This report is committed on top of the reviewed SHA.
- **Date:** 2026-10-04
- **Verdict:** **Cleared**
- **Reviewer:** release agent, running `release-review`
- **Replaces:** the review at `24d695b` (PR #52, Blocked on check 5 and so gate 6). The only change since is the three state keys in `variant_intent`.
- **Board row:** `SearchBar` (`recy4gVQ8SrbIyyoS`), read fresh: `Development` = `Completed`, `Design` = `Done`, `Production Storybook` set, `Commit` = `96ecae0`, `Astro Link` empty. `Last Modified` = 2026-10-04T16:19:47Z, which is the write of the previous review's cells; no source change followed `96ecae0`. `Release Review` and `Release Verdict` held the previous review (`8168fa5`, Blocked) and are overwritten together by this one.

`decisions.md` was read in full. **It has no SearchBar ruling, and none is applied anywhere in this review.** No ruling was written. Every gate and check below was run strictly and again from scratch.

## Gates and checks

| # | Gate / check | Result | Evidence |
|---|---|---|---|
| G1 | Done | Pass | `Development` reads `Completed`. `Production Storybook` (`https://horizon-design-system-cdfi.vercel.app/?path=/story/components-searchbar--all-variants`) returns HTTP 200, and the deployed `index.json` lists thirteen SearchBar stories: `field-md-empty`, `field-md-focused`, `field-md-filled`, `field-lg-empty`, `field-lg-focused`, `field-lg-filled`, `stay-lg-filled`, `back-office`, `trips-web`, `app-large`, `all-variants`, `interactive`, `stay-interactive`. No browser was available to this agent; "opens" is evidenced by the 200 and the story index, and the QA report records the live render on the preview deployment. |
| G2 | Tokens | Pass on the gate's own procedure, with one open question (see "SVG icon attributes") | The procedure is "read every declaration in the component's stylesheet". In `SearchBar.css` a grep for `px`, hex, `rgb(a)`, `hsl(a)` and any `var()` with a fallback finds `px` only inside five comments (lines 29, 31, 93, 102, 133) and nothing in any declaration. Other numbers are unitless (`stroke-width`, `font-weight`, `flex`, `width: 100%`). Seven `calc()` expressions (lines 28, 30, 37, 95, 103, 111, 137) are arithmetic over tokens only, with no literal operand. Recorded as finding 6. |
| G3 | Surface | Pass | `src/index.ts:33` exports `SearchBar`; line 34 exports `SearchBarProps`, `SearchBarType`, `SearchBarSize`, `SearchBarState`. `src/styles.css:14` imports `SearchBar.css`. Nothing says SearchBar should stay internal. |
| G4 | Names | Pass | Folder `src/components/SearchBar/`, symbol `SearchBar`, CSS prefix `hz-searchbar`, intent `SearchBar.intent.json`, board row `SearchBar`, Figma set `searchbar` (213:54). Same word. |
| G5 | States | Pass | Figma set `213:54` read fresh with `get_metadata`: seven cells `213:2` field/md/empty, `213:6` field/md/focused, `213:10` field/md/filled, `213:16` field/lg/empty, `213:20` field/lg/focused, `213:24` field/lg/filled, `213:30` stay/lg/filled. Code: `SearchBarType` (`field`, `stay`), `SearchBarSize` (`md`, `lg`), `SearchBarState` (`empty`, `focused`, `filled`). Stories `FieldMdEmpty`, `FieldMdFocused`, `FieldMdFilled`, `FieldLgEmpty`, `FieldLgFocused`, `FieldLgFilled`, `StayLgFilled` (`SearchBar.stories.tsx:32-40`) plus `AllVariants`. Figma draws no hover, pressed, disabled or error state. |
| G6 | Intent | Pass | `SearchBar.intent.json` exists at the reviewed SHA and passes all six checks below. |
| G7 | Version | Pass, with a standing note | `VERSIONING.md` exists at the reviewed SHA and states the 0.x bump rules and what 0.1.0 commits consumers to. Line 35 is stale: it says 0.1.0 "contains one component, `Button`". Reported, not edited. A human updates it before a version containing SearchBar ships. |
| C1 | Fields present | Pass | All seven fields present with the right types: `use_when` 6 strings, `dont_use_when` 3 objects (`when`, `instead`), `variant_intent` object with 7 keys, `placement` `[]`, `pairs_with` `[]`, `required_tokens` 22 strings, `a11y` 8 objects (`fact`, `source`). `placement` and `pairs_with` are empty (a recorded Figma gap). The three new `variant_intent` values are empty strings (a recorded Figma gap: Figma gives no usage text for the states). |
| C2 | Alternatives named | **Warning** | `dont_use_when` entry 3 ("More than one type stay on the same page.") has an empty `instead`. Warning, not a block. |
| C3 | a11y specific | Pass | Eight entries; every cited line checked at the reviewed SHA. `SearchBar.tsx:137` `role="search"`; `:155` `aria-label={label ?? placeholder}`; `:160` native `<button type="button">` with `aria-label="Clear search"`; `:132` `inputRef.current?.focus()`; `SearchBar.css:84` `.hz-searchbar__clear:focus-visible` (and `:43` `:focus-within`); `SearchBar.tsx:93` `role="search"` with `aria-label="Search stays"` on line 94; `:48` `aria-hidden="true"` (also lines 56 and 100); `Button.tsx:36` native `<button type="button">`. Each names a concrete element, attribute or behaviour and its line implements it. |
| C4 | Tokens resolve | Pass | `npm run build:tokens` run at the reviewed SHA wrote `build/css/tokens.css`. All 22 listed tokens are defined there. The set of `var(--...)` names in `SearchBar.css` equals the listed set exactly (22 and 22, symmetric difference empty). |
| C5 | Variants covered | Pass | Unions in `SearchBar.tsx:6-8`: `field`, `stay`, `md`, `lg`, `empty`, `focused`, `filled`. Keys of `variant_intent`: `field`, `stay`, `md`, `lg`, `empty`, `focused`, `filled`. None missing, none extra. This is the same reading as the first review (every exported union must be covered), which the Button and Link reviews set. |
| C6 | No duplicate job | Pass | `use_when` compared with the other thirteen intent files in `src/components/`: no identical entry and no two components claim the same job. Nearest neighbours, Chip and Checkbox ("such as search filters"), are about choosing fixed values, and SearchBar's own `dont_use_when` routes that to Chip and Dropdown. Adjacent, not the same job. |

## SVG icon attributes (width="14" height="14")

`SearchBar.tsx` line 48 (search icon) and line 56 (clear icon) both carry `width="14" height="14" viewBox="0 0 14 14"` as attributes on the `<svg>`, not in the stylesheet.

**Does gate 2 cover them?** My reading, unchanged from the first review: no. The gate's "how to answer" says "read every declaration in the component's stylesheet". Gate 2 as written covers stylesheets only. These are markup attributes with unitless numbers (SVG user units), and `SearchBar.css` has no `width` or `height` on `.hz-searchbar__icon`. The gate's one-line question could be read more widely. If a human intends it to reach markup attributes, these are a finding with no covering ruling (`decisions.md` has no SearchBar ruling; the Button ruling covers `Button.css` only). A ruling would have to name `width="14"` and `height="14"` on `SearchBar.tsx:48` and `:56`, accepted because they are the Figma icon size and no icon size token exists (the spacing scale has 12 and 16px, not 14px). I did not write it. **The Cleared verdict rests on the stylesheet-only reading;** if the human reads gate 2 more widely, this verdict must be revisited.

## Failures

None.

## Warnings (not blocking)

1. **Check 2:** `dont_use_when` entry 3 ("More than one type stay on the same page.") has an empty `instead`.

## Findings outside the gates

1. **Props that are not Figma properties.** `defaultValue`, `onValueChange`, `onSearch`, `onClear`, `label`, `name` (`SearchBar.tsx:26 to 35`), plus passthrough div attributes. They become public API once published. Owner: a human, to accept or ask the designer to draw them.
2. **Stay parts are not keyboard reachable.** Where, Check in, Check out and Guests render as static spans (`SearchBar.tsx:98 to 105`), as Figma draws them; only the Search button is focusable. QA recorded this as not failed by decision. Owner: the designer.
3. **Unspecified states.** Figma draws no hover, pressed, disabled or error state. The engineer added a focus-visible outline on the clear button. Owner: the designer.
4. **Dead-end pointer in `dont_use_when`.** `text field` is not a built component. Owner: designer / planning.
5. **Stories carry px literals.** `SearchBar.stories.tsx` has inline `width: 320`, `width: 960`, `gap: 24`, `gap: 12` and `repeat(2, 320px)`. Story scaffolding, not the stylesheet, so gate 2 does not reach them; reported for completeness.
6. **Computed spacing and sizes.** Padding, the 32px divider, the 2px part gap and the 80px Search button come from `calc()` over spacing tokens because Figma's values are not tokens. If the designer adds exact tokens, these should bind to them.
7. **Astro Link empty.** `release-review` expects `Astro Link` before a review, but devops writes it after a Cleared verdict (the circular docs gate noted in `release.md`). The review had no production docs page to read first and compared the source with Figma and the QA report instead. Owner: devops, now that the verdict is Cleared.
8. **a11y line precision.** The stay landmark role is at `SearchBar.tsx:93` and its `aria-label` at line 94; the clear icon (56) and divider (100) `aria-hidden` are cited together under line 48. Owner: `component-intent`, if the team wants exact lines.
9. **Registry link.** The `Figma` cell holds the canvas page (`node-id=57-1645`), not the component set `213:54`. Owner: the cell's owner.
10. **QA limitations carried over.** Inter was not installed in the test browser, so text widths are unverified; dark mode was not tested.
11. **Empty state descriptions.** `variant_intent` values for `empty`, `focused`, `filled` are empty strings: a recorded Figma gap, not sourced from anywhere. Owner: the designer.
12. **`VERSIONING.md` line 35** is stale (see G7). Owner: a human.
