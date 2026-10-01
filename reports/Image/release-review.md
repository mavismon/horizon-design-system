# Image · release review

- **Reviewed SHA:** `ee77422fc0c65aeae9b40892be03eee262f1b723` (branch `release-review/image-ee77422`, two commits on top of `origin/main` `fc7448a`: `a1b6944`, the intent file from Figma 125:2, and `ee77422`, `reports/Image/qa-report.md` unchanged). Everything below was read at that SHA with `git show` / a checkout of it. This report is committed on top of it.
- **Date:** 2026-10-01
- **Verdict:** **Cleared**
- **Reviewer:** release agent, running `release-review`
- **Board row:** Image (`recCJJ1CV1Gc1voEx`), read fresh: `Development` = `Completed`, `Design` = Done, `Commit` = `ed350d2`, `Staging Storybook` and `Production Storybook` set, 15 `Staging Testing` rows all `Passed`, `Astro Link` empty, `Release Review` / `Release Verdict` empty, `Last Modified` = 2026-10-01T16:36:15Z.

`decisions.md` was read at the reviewed SHA. No ruling covers Image, and none was needed (see G2). The Button, Avatar, Checkbox, Chip, npm-token and 2FA rulings don't bear on this component.

## Gates and checks

| # | Gate / check | Result | Evidence |
|---|---|---|---|
| G1 | Done | Pass | Row reads `Completed`. `Production Storybook` (`https://horizon-design-system-cdfi.vercel.app/?path=/story/components-image--all-variants`) returns 200, and its `index.json` lists 16 `components-image--*` entries: `r-43-none/sm/md`, `r-11-none/sm/md`, `r-32-none/sm/md`, `r-169-none/sm/md`, `r-21-none/sm/md` (15) plus `all-variants`. |
| G2 | Tokens | Pass | `Image.css` has no `px` and no hex anywhere: `grep -nE 'px\|#[0-9a-fA-F]{3,8}'` returns nothing, and no `var()` has a fallback. The only token reads are `var(--radius-none)` (l.29), `var(--radius-sm)` (l.33), `var(--radius-md)` (l.37). `width: 100%` (l.3) and `max-width: 100%` (l.4) are percentages of the container, not px. The `aspect-ratio` values `4 / 3`, `1 / 1`, `3 / 2`, `16 / 9`, `2 / 1` (l.9, 13, 17, 21, 25) are unitless ratios: they carry no length unit, are not a hex colour, and cannot be bound to a spacing or size token (a token holds a length; a ratio is a proportion, and the ratio is the variant itself). I judged them not to be literals in the sense of the gate. No ruling was needed or used. |
| G3 | Surface | Pass | `src/index.ts` lines 9 and 10 export `Image` and the types `ImageProps`, `ImageRatio`, `ImageRadius`. Added deliberately in the build. |
| G4 | Names | Pass | Folder `src/components/Image/`, symbol `Image` (`Image.tsx:26`), CSS prefix `hz-image`, intent `Image.intent.json`, board row `Image`. |
| G5 | States | Pass | Figma component set 123:22 publishes 15 variants (ratio 4:3, 1:1, 3:2, 16:9, 2:1 x radius none, sm, md) and no states. `ImageRatio` (`Image.tsx:4`) and `ImageRadius` (`:5`) are those exact values. All 15 have a story, each annotated with its node ID, and I matched every one to the variant name from `get_metadata` (123:8 4:3 none, 123:7 4:3 sm, 123:9 4:3 md, 123:11/10/12 1:1, 123:14/13/15 3:2, 123:17/16/18 16:9, 123:20/19/21 2:1). All 15 plus `AllVariants` are in the deployed `index.json`. On 123:9: `get_metadata` shows one `photo` node (`128:67`, 240x180) inside it, not two, so I could not reproduce the two stacked layers at node level (the QA report saw two stacked identical layers, which may be fills). Either way they are identical, so a single `<img>` loses nothing visible. Judged a design artefact, not a gap. |
| G6 | Intent | Pass | `Image.intent.json` exists at the reviewed SHA and passes checks 1 to 6. |
| G7 | Version | Pass | `VERSIONING.md` exists and states the 0.x bump rules, what counts as public and what 0.1.0 commits you to. Standing note, not a finding on this review: line 35 says 0.1.0 "contains one component, `Button`". It goes stale once a version containing Image ships; a human must update it. Not edited here. |
| C1 | Fields present | Pass | All seven fields present with the right types: `use_when` (4 strings), `dont_use_when` (3 objects of `when` + `instead`), `variant_intent` (object, 8 keys), `placement` `[]`, `pairs_with` `[]`, `required_tokens` (3), `a11y` (3 objects of `fact` + `source`). |
| C2 | Alternatives named | Pass, no warnings | All three `instead` values are non-empty: `Avatar`, `Logo`, `Icon Library`. See "How check 2 treats unbuilt alternatives". |
| C3 | a11y specific | Pass | All three sources are right at the reviewed SHA. `Image.tsx:34` is `<img`, the native element, with `{...rest}` on line 37 passing `loading`, `srcSet`, `sizes` through. `Image.tsx:29` is `alt = "",` in the destructured props, so alt defaults to empty and the prop overrides it (line 35 `alt={alt}`). `Image.css:5` is `object-fit: cover;`. Each names a concrete element, attribute or behaviour and its line implements it. |
| C4 | Tokens resolve | Pass | `npm run build:tokens` at the reviewed SHA wrote `build/css/tokens.css`: `--radius-none: 0px` (l.38), `--radius-sm: 6px` (l.39), `--radius-md: 12px` (l.40). The `var(--…)` names read in `Image.css` are `{--radius-md, --radius-none, --radius-sm}`, identical to `required_tokens`. |
| C5 | Variants covered | Pass | `variant_intent` keys are `4:3, 1:1, 3:2, 16:9, 2:1, none, sm, md`: exactly the `ImageRatio` values (`Image.tsx:4`) plus the `ImageRadius` values (`:5`), none missing, none extra. Four ratios (`1:1`, `3:2`, `16:9`, `2:1`) have empty-string values because the Figma description is silent on what each ratio means individually. The check as written is about keys, not values, so it passes. An empty value is a recorded gap, not a failure. |
| C6 | No duplicate job | Pass | Compared `use_when` with Avatar, Button, Checkbox and Chip. Image's job is showing a photo of a listing, room or place, and choosing ratio and radius for it. Avatar's is a person's profile photo, and Avatar's own `dont_use_when` already sends "listing or content photos" to Image, so the two are mirror images with a clean boundary, and Image's first `dont_use_when` returns the favour. Chip's second `use_when` mentions a photo gallery only as the place where category chips appear, not as a claim on showing photos. Checkbox and Button share no item. No two components list the same use. |

## Intent content against Figma 125:2

Read with `get_design_context` at review time (file `dIHHqSq8c75n4olME0s9JS`). The four `use_when` items match "Use an Image" (nodes 125:105, 125:112, 125:118, 125:124) word for word and in order. The three `dont_use_when` `when` strings match "Do not use an image" (125:130, 125:136, 125:142) word for word and in order; each `instead` is the component the sentence names. Nothing is invented. The five "Best Practice" items (125:152 to 125:176) are not in the file because the file has no field for them; they remain in Figma.

## How check 2 treats unbuilt alternatives

Check 2 asks only whether `instead` is non-empty. It does not check that the named component exists. `Avatar` is built and exported. `Logo` and `Icon Library` are not built (`src/components/` holds Avatar, Button, Checkbox, Chip, Image), so two of the three pointers lead to components consumers can't import. Check 2 therefore passes with no warning. Recorded so the pointers aren't read as resolving. Button, Avatar and Checkbox already do the same, so this isn't new.

## Failures

None.

## Warnings (not blocking)

None from check 2.

## Other findings (outside the gates)

- **`Astro Link` is empty.** `release-review` expects it before a review and step 2 (read the production docs page first) could not be done. The docs page for Image doesn't exist yet; the Components row reads `Completed`, not `Released`. This is the known circularity (docs are staged for `Cleared` components). Not a gate failure.
- **`variant_intent` values are not Figma wording.** `"4:3": "default"` and `"none": "default; edge to edge inside a card"` mix the code default (`ratio = "4:3"`, `radius = "none"`, `Image.tsx:27-28`) with a shortened `use_when` fragment; `"sm": "thumbnails"`, `"md": "standalone photos"` are shortened from the third `use_when` item. The check needs only keys, so this isn't a failure. The owner (`doc-generator`) may want to decide whether they stay.
- **Figma gaps for the designer:** no per-ratio meaning beyond the 16:9 / 3:2 / 4:3 / 1:1 / 2:1 sentence in `use_when`; no loading or error state (the Usage text says to show a placeholder while a photo loads; Figma draws none, so none is built). The `aspect-ratio` box does reserve the space.
- **No intrinsic width.** The component is `width: 100%`; stories wrap it in 240px. The QA report records this as raised for a decision.
- **`VERSIONING.md` line 35** is a standing human task (see G7).
- **Staleness.** The row's `Last Modified` (2026-10-01T16:36:15Z) is before the reviewed commit, so the review isn't stale on entry. Writing the two registry cells will move it later, as with earlier reviews.
- **Not run here.** Package preflight, package and docs tracks, version bump, publish, merge.
