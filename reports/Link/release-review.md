# Link · release review

- **Reviewed SHA:** `72c85b8412e12d73409956433ef25afb0108ce83` (branch `release-review/link-72c85b8`). It is two commits on top of `origin/main` `3d73c91` (which already contains the Link build commit `082c6f4` via PRs #23 and #24): `Link: intent usage from Figma 134:444` (`1f70b44`, a cherry-pick of `0506b05`; changes only `src/components/Link/Link.intent.json`, 20 insertions, 2 deletions) and `Link: QA report on branch preview` (`72c85b8`, adds only `reports/Link/qa-report.md`, copied unchanged). `git diff 082c6f4 72c85b8 --stat` lists exactly those two files, so every source file other than the intent is identical to the build commit. This report is committed on top of the reviewed SHA.
- **Date:** 2026-10-01
- **Verdict:** **Cleared**
- **Reviewer:** release agent, running `release-review`
- **Board row:** Link (`recAYAuRlo9KHRrQ9`), read fresh before this review: `Development` = `Completed`, `Design` = `Done`, `Production Storybook` = `https://horizon-design-system-cdfi.vercel.app/?path=/story/components-link--all-variants`, `Staging Storybook` set, `Commit` = `082c6f4f3b44c4f049bd9c310fc4bfb0588f0a09`, 4 `Staging Testing` rows all `Passed`, `Astro Link` empty, `Release Review` and `Release Verdict` empty, `Last Modified` = 2026-10-01T18:15:48Z.

`decisions.md` was read in full at the reviewed SHA. It has rulings for Button, Avatar, Checkbox and Chip, and none for Link. No ruling is applied in this review, and none is needed (see G2).

## Gates and checks

| # | Gate / check | Result | Evidence |
|---|---|---|---|
| G1 | Done | Pass | Row reads `Completed`. `Production Storybook` returns 200 and the deployed `index.json` lists `components-link--md-default`, `--md-hover`, `--sm-default`, `--sm-hover` and `--all-variants`, all five of type `story`. |
| G2 | Tokens | Pass (no ruling used) | `src/components/Link/Link.css` is 22 lines. A search for `px`, `rem`, `em`, `#hex` and `rgb` returns no match: no literal hex or px anywhere. The only `var()` is `var(--fontfamily-body), sans-serif` (line 2); the generic family sits outside the `var()`, so it is not a fallback inside it and not a hex/px value. Every other `var()` is bare. `font-weight: 500` (line 5) is a unitless number, not a hex or px literal, and the gate lists only those two; I judged it a pass because no weight token exists to bind it to (the token set has font family, size and line-height only; QA and the Button, Checkbox and Chip builds treat it the same way). `text-decoration-thickness: from-font` and `text-underline-position: from-font` (lines 20, 21) are keywords, not lengths. The story file has `gap: 24` and a `96px` grid column (`Link.stories.tsx:48`) as inline style in the `AllVariants` layout wrapper; that is story scaffolding, not the component stylesheet, and the gate reads the stylesheet. Informational only. |
| G3 | Surface | Pass | `src/index.ts:11` exports `Link`; `src/index.ts:12` exports `LinkProps`, `LinkSize` and `LinkState`. All four named in the brief are present. Nothing marks Link internal. |
| G4 | Names | Pass | Folder `src/components/Link/`, symbol `Link` (`Link.tsx:14`, also default export line 36), CSS prefix `hz-link` (`hz-link`, `hz-link--sm`, `hz-link--hover`), intent `Link.intent.json`, board row `Link`. |
| G5 | States | Pass | Figma component set 133:12 publishes size `md`/`sm` x state `default`/`hover`, four cells: 133:4, 133:6, 133:8, 133:10. `LinkSize` (`Link.tsx:4`) is `"md" \| "sm"` and `LinkState` (`Link.tsx:5`) is `"default" \| "hover"`. Stories `MdDefault`, `MdHover`, `SmDefault`, `SmHover` (one per cell, each commented with its node id) plus `AllVariants` exist and are in the deployed `index.json`. See "Undrawn states" below. |
| G6 | Intent | Pass | `Link.intent.json` exists at the reviewed SHA and passes checks 1 to 6. |
| G7 | Version | Pass | `VERSIONING.md` exists and states the 0.x bump rules. Standing note, not a finding: line 35 says 0.1.0 "contains one component, `Button`". It goes stale once a version containing Link ships, and a human must edit it then. This review did not edit it. |
| C1 | Fields present | Pass | All seven fields present with the right types. `use_when` 4 strings; `dont_use_when` 3 objects of `when` + `instead`; `variant_intent` 4 string values; `placement` `[]`; `pairs_with` `[]`; `required_tokens` 6 strings; `a11y` 3 objects of `fact` + `source`. Empty `placement` and `pairs_with` are recorded Figma gaps (the Usage frame has no placement or pairing text); noted, not a failure. |
| C2 | Alternatives named | Pass, no warnings | All three `instead` values are non-empty: `Button`, `Chip`, `Dropdown`. See "How check 2 treats unbuilt alternatives". |
| C3 | a11y specific | Pass | Three entries, checked at the reviewed SHA. `Link.tsx:22` is `<a`, the native anchor element, and nothing in `Link.css` overrides outline or focus, so "no focus style is overridden" is true. `Link.tsx:29` is `{...rest}`, which spreads href, target, rel and the other anchor attributes. `Link.tsx:31` is `{label}`, the anchor's text content and so its accessible name. All three cited lines exist and implement their fact. |
| C4 | Tokens resolve | Pass | `npm run build:tokens` at the reviewed SHA wrote `build/css/tokens.css`. All six `required_tokens` are defined there: `--color-text-link` (line 108, `#1d44ba`), `--fontfamily-body` (150, `Inter`), `--fontsize-lg` (155, `13px`), `--fontsize-md` (154, `12px`), `--lineheight-lg` (163, `20px`), `--lineheight-md` (162, `18px`). The set of `var(--...)` names read by `Link.css` is exactly those six, so none is unlisted and none is listed but unused. |
| C5 | Variants covered | Pass, with a note | `variant_intent` keys are `md`, `sm`, `default`, `hover`: exactly the union of `LinkSize` (`md`, `sm`) and `LinkState` (`default`, `hover`), none missing, none extra. Link has two union types, not one; the file merges both into one map, which is the only way the single field can cover them, and I read the check as applying to both. The `default` value is the empty string `""`, because the Figma description gives it no text. The check tests keys, not values, and `component-intent` records a Figma gap as empty rather than invented text, so I judge C5 as passing. It is a real hole in the intent: a consumer reading it learns what `md`, `sm` and `hover` mean but nothing about `default`. It needs the designer, not a fix here. |
| C6 | No duplicate job | Pass, with overlaps noted | Compared with `Button`, `Chip`, `Checkbox`, `Image` and `Avatar`. No two lists claim the same use. Detail below. |

## Intent content against Figma Usage frame 134:444

Read with `get_design_context` at review time (file `dIHHqSq8c75n4olME0s9JS`).

- The four `use_when` items match "Use a Link" (nodes 134:543, 134:550, 134:556, 134:562) word for word and in order, including the quoted examples and the `md (13px)` / `sm (12px)` sentence.
- The three `dont_use_when` `when` strings match "Do not use a link" (134:568, 134:574, 134:580) word for word and in order. Each `instead` is the component the sentence names: Button, Chip, Dropdown.
- Nothing in the file is invented. `variant_intent` values (`13px (default)`, `12px (dense rows, beside filters)`, `underlined`) come from the same Usage text and the Figma specs; `a11y` facts are code facts with sources.
- The six "Best Practice" items (134:586 to 134:616) are not in the file, because it has no field for them; per `component-intent` they stay in Figma. Two of them matter to Link and are reported under "Undrawn states".

## C6 in detail

- **Link and Button.** Link's `dont_use_when` sends "the main action on a page" to Button; Button's `dont_use_when` sends "navigation between pages or views" to Link. Each points at the other for the case it doesn't own. They do touch: Link's second `use_when` is "a secondary action next to a form" and Button's fourth is "secondary or less prominent actions, use the outline style"; Link's first is "to take the user to another page or view" and Button's fifth is "to open a modal, drawer, or another view, when the action is not a navigation link". Button's own wording carves navigation out, so that one is consistent, but the "secondary action" wording is a real overlap with no tiebreak in either file. The check fails "two components listing the same use"; these are different sentences with different examples ("Resend code", "Use a different email address"), so it passes. A designer should say when a secondary action is a Link and when it's an outline Button.
- **Link and Chip.** Link sends "filter results or switch categories" to Chip, and Chip's fourth `dont_use_when` already sends "to go to another page" to Link. A matched, mutual pair. Link's fourth `use_when` mentions a "Clear" link beside filters, which fits Chip's Figma best practice (a way to clear all filters) and doesn't make Link a filter control.
- **Link and Checkbox, Image, Avatar.** No shared use. Avatar's third `dont_use_when` says to place an Avatar inside a Button or Link for an accessible name, which is consistent with Link's role.

## How check 2 treats unbuilt alternatives

Check 2 asks one thing: is `instead` non-empty. It does not check that the named component exists. Of Link's three alternatives, `Button` and `Chip` are built and exported. `Dropdown` is not (only `Button`, `Avatar`, `Checkbox`, `Chip`, `Image` and `Link` exist under `src/components/`), and the check passes it with no warning. One of three pointers leads to a component consumers can't import. Button's, Avatar's, Chip's and Image's intents already do the same.

## Undrawn states

Figma draws no focus, visited, disabled or inline-underlined Link, and the code builds none (`Link.stories.tsx` lines 3 to 6 say so). Gate 5 asks for every state the Figma node publishes, so it passes. The gate is silent on states the product might need but the design never drew. Link is a native `<a>`, so the browser's focus ring, `:visited` and `href` behaviour apply, and QA saw the native ring on a real Tab, but nothing is styled for them.

Two Usage "Best Practice" lines go further than that and the code does not meet them:

- "Make sure every link shows a visible keyboard focus style." Link relies on the browser's default ring (`outline: auto`). That is visible today, but it isn't a designed style and nothing in the stylesheet or a story guarantees it, and a consumer's CSS reset can remove it.
- "Underline a link that sits inside a sentence of body text, so it doesn't rely on colour alone." Link underlines only on hover (`Link.css` lines 17 to 22) and has no inline variant. A Link inside a paragraph is colour-only at rest. A consumer can add `text-decoration: underline` through `className`.

Neither is a gate failure: G5 covers states the node publishes, and the Usage text is not a build spec. Both need the designer to draw a focus state and an inline variant.

## Failures

None.

## Warnings (not blocking)

None from check 2.

## Other findings (outside the gates)

- **No `Astro Link` yet, so step 2 (read the docs page first) could not be done.** The docs site has no Link page to compare with the source. The gates don't need `Astro Link`, so this doesn't block, but `Released` won't read until `doc-generator` stages the page and `devops` pushes it.
- **`VERSIONING.md` line 35** is a standing human task (see G7).
- **The `default` entry in `variant_intent` is empty** (see C5): a Figma gap for the designer.
- **Empty `placement` and `pairs_with`** are Figma gaps (see C1).
- **`npm test` passes (15 of 15) but covers only Button.** No test covers Link. Informational.
- **Staleness.** The row's `Last Modified` (2026-10-01T18:15:48Z) is earlier than the reviewed commit (2026-10-01T19:17:22+01:00 = 18:17:22Z), so the review is not stale on entry. Writing the two registry cells moves `Last Modified` later than the commit, the standing problem noted in earlier reviews.
- **Figma link on the row** is the original `node-id=57-1635`; the build and QA work used component set 133:12. Same file; informational.
- **Not run here.** Package preflight, the package and docs tracks, any version bump, publish or merge.
