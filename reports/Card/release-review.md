# Card · release review

- **Reviewed SHA:** `9f3947b80f8a276f247ecf284e751bcc708ea4c1` (`origin/main`, "Merge pull request #73 from mavismon/staging", 2026-10-07 08:50:33 +01:00), the commit production Storybook was deployed from. `src/components/Card/` at this SHA is identical to the QA round 2 retest commit `156db81` plus the merge `8d5afbf`. This report is committed on top of the reviewed SHA, on branch `release-review/card`.
- **Date:** 2026-10-07
- **Verdict:** **Blocked** (gate 2, Tokens)
- **Reviewer:** release agent, running `release-review` as a single-component review (not a release: no version bump, no tag, no publish, no other component reviewed).
- **Board row:** Card (`rec1y6kyai6F3FVWv`), read fresh: `Development` = `Completed`, `Design` = `Done`, `Staging Storybook` and `Production Storybook` set, `Commit` = `156db81`, 25 `Staging Testing` rows all `Passed`, `Composes` = Image, `Astro Link` empty, `Release Review` and `Release Verdict` empty (first review). `Last Modified` = 2026-10-07T07:51:54Z (08:51:54 +01:00), 81 seconds after the reviewed commit's timestamp. See "Staleness" below.

## Rulings

`decisions.md` was read in full at the reviewed SHA. **No ruling covers Card.** The rulings that exist (Button, Avatar, RadioCard, Calendar and others) are limited by their own "Not ruled" lines to the named component, so none can be applied here. The user's decision about the tag (below) is recorded in `reports/Card/qa-report.md` round 2 and in the `Context` of the Staging Testing rows. It is not a `decisions.md` ruling, and this agent cannot write one.

## Gates

| # | Gate | Result | Evidence |
|---|---|---|---|
| G1 | Done | Pass | `Development` reads `Completed`. `Production Storybook` (`https://horizon-design-system-cdfi.vercel.app/?path=/story/components-card--all-variants`) returns HTTP 200, and the deployed `index.json` lists ten Card stories: `listing`, `listing-with-tag`, `listing-with-action`, `listing-without-rating`, `listing-tag-and-action`, `listing-truncation`, `stat`, `stat-without-helper`, `stat-with-action`, `all-variants`. No browser was available to this agent, so "opens" is evidenced by the 200 and the story index, not by a render. |
| G2 | Tokens | **FAIL** | `src/components/Card/Card.css`, every declaration read. No hex, no `rgb`/`hsl`, no `var()` with a fallback. Literal px in declarations: **`284px`** (`width` on `.hz-card--listing`, line 27) and **`234px`** (`width` on `.hz-card--stat`, line 34). Neither is covered by a ruling in `decisions.md`, so the gate fails. Both are what Figma specifies (listing `238:7` 284 wide, stat `238:20` 234 wide, both literal in the node), and no width or size token exists that matches, so this is the same class of finding as the Button, Avatar, RadioCard and Calendar rulings. Not literal px and not reached by the gate: `font-weight` 400, 500, 600 (lines 61, 84, 94, 109, 122, 129, 137, 145, 153), unitless; `inset 0 0 0 var(--border-width-sm)` (line 17), zero lengths. The other spacing, radius, colour, font-size and line-height values all use tokens. |
| G3 | Surface | Pass | `src/index.ts` exports `Card` and `CardProps`, `CardType` (`src/index.ts:41-42`). `Image`, which Card composes, is exported on its own. Nothing is exported from Card's folder that nobody decided on. |
| G4 | Names | Pass | Folder `src/components/Card/`, symbol `Card`, class prefix `hz-card` (parts `hz-card__photo`, `__tag`, `__body`, ...), intent `Card.intent.json`, board row `Card`. All the same word, allowing for case and the `hz-` namespace. |
| G5 | States | Pass | Figma component set `238:24` read fresh: `238:7` type=listing (284x242) and `238:20` type=stat (234x96). Design context shows the properties `type`, `showTag`, `showRating`, `showAction` (listing), `showHelper` (stat) and the text overrides, no sizes, and no hover, focus, pressed or disabled state. Code: `CardType = "listing" \| "stat"` (`Card.tsx:5`) with every property present on `CardProps`. Stories (`Card.stories.tsx`): `Listing`, `ListingWithTag`, `ListingWithAction`, `ListingWithoutRating`, `ListingTagAndAction`, `ListingTruncation`, `Stat`, `StatWithoutHelper`, `StatWithAction`, and `AllVariants` (the 16 distinct appearances of Figma's 32 instances; the other flag combinations are visual no-ops in Figma). Every variant and state has a story. See finding 3 on `StatWithAction`. |
| G6 | Intent | Pass | `src/components/Card/Card.intent.json` exists at the reviewed SHA and passes the six checks below. |
| G7 | Version | Pass, with a standing note | `VERSIONING.md` exists at the reviewed SHA and states the 0.x rules and what each bump commits you to. Its "What 0.2.1 commits you to" section lists seventeen components and includes neither `Card` nor `Calendar` (`package.json` is at 0.2.1). Not edited. A human updates it before a version containing Card ships. Same treatment as the Calendar review. |

## Checks

| # | Check | Result | Evidence |
|---|---|---|---|
| C1 | Fields present | Pass | All seven fields present with the right types: `use_when` 6 strings, `dont_use_when` 3 objects (`when`, `instead`), `variant_intent` object with 2 keys, `placement` `[]`, `pairs_with` `["Image"]`, `required_tokens` 26 strings (sorted, no duplicates), `a11y` 2 objects (`fact`, `source`). `placement` is an empty array (a recorded Figma gap, as in other components). |
| C2 | `dont_use_when` names an alternative | **Warning** (not a block) | Entry 3 ("For a stat that needs a chart or several numbers: use a content panel, not a stat tile.") has an empty `instead`. Figma names "a content panel", which is not a Horizon component. Entries 1 and 2 name `Table` and `RadioCard`. |
| C3 | `a11y` specific | Pass | Two entries, each naming a concrete element and behaviour. Source lines checked at the reviewed SHA: `Card.tsx:62` is `<Image src={image} alt={imageAlt} ratio="2:1" radius="none" />` (the native `<img>` with `alt` defaulting to empty, `Image.tsx` passes `alt` straight to `<img>`); `Card.tsx:60` is the listing container `<div className=... {...rest}>` (no role, text in `<p>` in DOM order, caller attributes spread). Both lines exist and implement the fact. Note finding 4 on what the entries do not cover. |
| C4 | `required_tokens` resolve | Pass | `npm run build:tokens` run at the reviewed SHA. All 26 listed tokens are defined in `build/css/tokens.css` (none missing). Every `var(--...)` read by `Card.css` is listed and every listed token is read: no token missing from the list, none extra. |
| C5 | Variants covered | Pass | `variant_intent` keys are `listing` and `stat`, exactly the values of `CardType`. Card exports no other union. |
| C6 | No two components claim the same job | Pass | Card's six `use_when` lines compared with every other intent file in `src/components/` (20 others). No identical or paraphrased use. Nearest, for awareness and not a failure: `Image` ("a photo of a listing ... at the top of a property card"; the photo layer inside Card is an Image, a part not a rival), `ButtonGroup` ("View" and "Modify" on a trip card, a consumer of a card), `RadioCard` (choose one option in a form; Card's `dont_use_when` already points there). |

## Failures

1. **G2 Tokens: `284px` (`Card.css:27`) and `234px` (`Card.css:34`).** Two literal `width` values, on `.hz-card--listing` and `.hz-card--stat`. No ruling covers them. Owner of the decision: a human, by writing a ruling in `decisions.md` (the same route as Button, Avatar, RadioCard and Calendar), or the designer, by adding width tokens that the engineer then uses. Not fixed here, per `release-review`.

## Warnings (not blocking)

1. **C2:** `dont_use_when` entry 3 has an empty `instead` ("a content panel", not a Horizon component).

## Known facts judged, not accepted

1. **Tag deviation from Figma `238:10`.** Code: tag at `top`/`left` `--spacing-md` (12px) with padding `--spacing-xs` / `--spacing-sm` (4px / 8px), `Card.css:51-55`. Figma `238:10` (read fresh): `left-[11px] top-[11px]`, `px-[9px] py-[3px]`, all unbound. The deviation is real: 1px on the offset, 1px on each side horizontally, 2px on height (24px against 22px). It is not a gate failure: every value in the tag is a token, so gate 2 does not reach it, and the tag exists with all its states, so gate 5 passes. It is a design-fidelity decision. The user accepted it on 2026-10-07 and it is documented in `reports/Card/qa-report.md` round 2 and in the four `(tag decision, 156db81)` rows' `Context`, which say "passed against a human decision, not against the Figma node". It is not in `decisions.md`, so no ruling exists that a later agent could quote. If the user wants it to stand as a ruling, a human writes it. This review treats it as accepted and does not count it against the verdict.
2. **Ten first-round Staging Testing rows flipped from Failed/Fixed to Passed.** Read all 25 rows: all `Passed`. Ten first-round rows (`rec8lJufjaugVLqA8` to `recyUq3CiyTvkOO9o`, in the order the table lists them) and four `re-test at 156db81` tag rows (`recnYPTQwKCS2Vflq`, `recjjQiiwI21pzLTI`, `recSsRk4gvUzIzeKs`, `receusrCMsEWuc9pY`) carry "SUPERSEDED, flipped to Passed on 2026-10-07 at the user's instruction" with the original state and the replacement row named. The border finding was re-tested separately at `156db81` on six rows (computed values: card 284x242, photo 284x142 at 0,0, stat 234x96 and 234x76), and the tag decision has its own four rows. So the board's evidence for `Completed` holds: each case has a retest or decision row that is Passed independently of the flip. What the flip does cost: the audit trail is in `Context` text, not in row status, and the border retest rows record "no screenshot (browser pane not displayed)", paint order from computed positioning only. The `Development` formula, which reads the rollup of results, now reads `Completed`, but the failures it once showed are visible only in text. Not a gate finding. Reported.
3. **Inter is not loaded in Storybook and the repo ships no font loading.** `.storybook/preview.ts` imports tokens and `src/styles.css` only, and no `@font-face` exists. The font-family token is `--fontfamily-body` with a `sans-serif` fallback in `Card.css:9`. This affects every component, not only Card, and glyph widths for Card were never judged by QA. It is outside the seven gates and six checks. Reported; for a human or the engineer to decide where font loading belongs.
4. **`Card.intent.json` written by the engineer, from the Figma Usage frame (`239:51`).** `git log` shows the file arrived in the build commit `907148f`, not through `doc-generator`. The six `use_when` and three `dont_use_when` texts were compared with the Usage frame read fresh and match verbatim, including the "Best Practice" lines carried into `use_when` as the skill allows, so the content is sourced, not invented. Two points where the file does not follow the skill: `pairs_with: ["Image"]` has no source in the stories (they render Card alone, and `component-intent` says a story that only renders the component shows no pairing; Image appears because Card uses it internally, which the board records in `Composes`), and the file was not written by the owner of that job. The file was not edited. Owner: `doc-generator`, to confirm or empty `pairs_with` and take over the file.

## Findings outside the gates

1. **`Astro Link` is empty.** Step 2 of the skill (read the production docs page first) could not be done. It is devops' cell. Nothing is written to it here, and `Development` cannot read `Released` for Card until it is set.
2. **`VERSIONING.md` does not list Card** (see G7). Owner: a human.
3. **`StatWithAction` renders the same as `Stat`.** `showAction` is a no-op for `type="stat"` (`Card.tsx:49-57` never reads it), as in Figma, so the story duplicates `Stat` and its name implies a behaviour that does not exist. Owner: the engineer, if wanted.
4. **The intent's best practice "Make the whole listing card clickable"** has no support in the component: the container is a plain `<div>` with no role, keyboard handling or focus style (Figma draws no focus state). A consumer who adds `onClick` through the spread gets a mouse-only target, and the `a11y` entries do not say so. Owner: `doc-generator` and a human, to decide whether the docs should say to wrap the card in a link or button.
5. **Stories carry inline px literals** (`gap: 32`, `margin: "0 0 8px"`, `gap: 16` in `Card.stories.tsx`). Story scaffolding, not the stylesheet; gate 2 does not reach them.
6. **Raw font weights 400, 500, 600** in `Card.css`, because the repo has no `--fontweight-*` tokens (Chip and File do the same). Unitless, so not px; a pipeline gap for the humans, as QA recorded.

## Staleness

`Last Modified` (08:51:54 +01:00) is 81 seconds later than the reviewed commit (08:50:33 +01:00). The later edit is consistent with the board write after the production deploy of this commit. The row's `Commit` (`156db81`) is the QA retest commit, and `src/components/Card/` is byte-identical between `156db81` and the reviewed SHA. Not treated as stale, but if the row changes again, or if a ruling is added and the review re-run, the new run must pin its own commit.

## Not checked by this agent (needs a browser or a human)

1. Production Storybook `?path=/story/components-card--all-variants` rendering: the edge drawn above the photo (paint order), the 2:1 photo filling 284x142 edge to edge, tag position on the photo, one-line truncation with ellipsis. This agent has no browser; none of these is marked passed here. QA's round 2 evidence is computed style only, with no screenshot.
2. Whether Inter loads on the deployed site (see known fact 3).
3. Dark mode (QA tested light only).
4. `Astro Link` docs page (empty).
5. Whether the user wants the tag decision written up as a `decisions.md` ruling.
