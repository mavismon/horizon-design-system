# Card · release review (round 2)

- **Reviewed SHA:** `c1052106ef1cc81c8a4da5f07f6c686858758716` (`origin/main`, "Merge pull request #76 from mavismon/staging", 2026-10-07 09:07:51 +01:00). `src/components/Card/` at this SHA is byte-identical to `156db81` (`git diff 156db81 c105210 -- src/components/Card` is empty). This report is committed on top of the reviewed SHA, on branch `release-review/card-2`.
- **Date:** 2026-10-07
- **Verdict:** **Cleared**
- **Reviewer:** release agent, running `release-review` as a single-component review (not a release: no version bump, no tag, no publish, no other component reviewed). Every gate and check was run fresh at the reviewed SHA; nothing was copied from the round 1 report (`reviewed 9f3947b`, Blocked on gate 2 only).
- **Board row:** Card (`rec1y6kyai6F3FVWv`), read fresh: `Development` = `Completed`, `Design` = `Done`, `Staging Storybook` and `Production Storybook` set, `Commit` = `156db81`, 25 `Staging Testing` rows (rollup reads `Passed` only), `Composes` = Image, `Astro Link` empty. `Release Review` and `Release Verdict` still hold the round 1 values (the aeb1c93 report URL, `Blocked`); they are replaced only after this report's commit URL resolves. `Last Modified` = 2026-10-07T07:55:25Z (08:55:25 +01:00), earlier than the reviewed commit, so the review is not stale.

## Rulings

`decisions.md` was read in full at the reviewed SHA. One ruling covers Card: **"2026-10-07 · Card widths with no token, and the accepted tag offset"**. Quoted:

> **Ruling.** These literals in `src/components/Card/Card.css` are accepted, because they are what the Figma nodes specify, until the designer adds matching size tokens:
>
> | Value | Property | Selector | Lines |
> |---|---|---|---|
> | `284px` | `width` | `.hz-card--listing` | 27 |
> | `234px` | `width` | `.hz-card--stat` | 34 |
>
> The tag in `Card.css` stays on the nearest tokens: offset `--spacing-md` (12px), padding `--spacing-xs` block and `--spacing-sm` inline (4px / 8px), 24px tall. Figma 238:10 reads 11px offset, 3px / 9px padding and 22px tall. This deviation is accepted as a design decision (2026-10-07), the Figma node was not changed, and the QA report (`reports/Card/qa-report.md`, round 2) records it.
>
> **For an agent that hits it.** Gate 2 passes for exactly these two values on exactly these properties in `Card.css`. The tag is not a gate item, since it uses tokens throughout: do not count it against a verdict, and quote this ruling when you report it. When a size token for 284px or 234px appears, the ruling no longer covers that value: use the token. If the designer later binds the tag to tokens in Figma, the tag part of this ruling no longer applies and the tag must be re-tested against the node.
>
> **Not ruled.** Any other literal value, including a `var()` fallback. These values in any other component. A change to these values: a different number needs a new ruling or a token. The tag's size, colours or font, which match Figma. The intent file's `pairs_with: ["Image"]` and its "make the whole listing card clickable" line, which the review raised as warnings.

How it was applied, and its limits:

- The ruling was applied to exactly `284px` at `Card.css:27` (`width`, `.hz-card--listing`) and `234px` at `Card.css:34` (`width`, `.hz-card--stat`), and to nothing else. Both values, properties, selectors and line numbers were checked against the file at the reviewed SHA and match the table.
- No size token for 284px or 234px exists in `build/css/tokens.css` (built at the reviewed SHA; the only spacing tokens are the scale, and none is 284 or 234), so the "use the token" condition is not triggered.
- The tag was not counted against the verdict, as the ruling instructs. Checked, not assumed: `Card.css:51-55` sets `top` and `left` to `var(--spacing-md)` (12px), `padding-block` `var(--spacing-xs)` (4px) and `padding-inline` `var(--spacing-sm)` (8px), with `line-height: var(--lineheight-xs)` (16px), giving 24px tall. All tokens, as the ruling states. Figma 238:10, read fresh, still binds none of its offset or padding (`left-[11px] top-[11px] px-[9px] py-[3px]`), so the tag part of the ruling still applies.
- The "Not ruled" line was honoured: the intent file's `pairs_with: ["Image"]` and its "make the whole listing card clickable" line are reported as warnings below, not blocks and not waived.
- Both rules still carry `max-width: 100%` (`Card.css:28`, `35`), as the ruling's finding describes.

## Gates

| # | Gate | Result | Evidence |
|---|---|---|---|
| G1 | Done | Pass | `Development` reads `Completed` (read fresh from the board). `Production Storybook` (`https://horizon-design-system-cdfi.vercel.app/?path=/story/components-card--all-variants`) returns HTTP 200, and the deployed `index.json` lists ten Card stories: `listing`, `listing-with-tag`, `listing-with-action`, `listing-without-rating`, `listing-tag-and-action`, `listing-truncation`, `stat`, `stat-without-helper`, `stat-with-action`, `all-variants`. No browser was available, so "opens" is evidenced by the 200 and the story index, not by a render (see "Not checked"). |
| G2 | Tokens | Pass, by ruling | `src/components/Card/Card.css`, every declaration read, and grepped for px, rem, em, vh, vw, hex, `rgb`, `hsl` and any `var()` with a fallback. No hex, no `rgb`/`hsl`, no `var()` fallback, no rem or em. The only px literals are **`284px`** (`Card.css:27`) and **`234px`** (`Card.css:34`), both covered exactly by the 2026-10-07 ruling above. Other non-token values: `width: 100%` and `max-width: 100%` (percentages of the container, not px); `font-weight` 400, 500, 600 (lines 61, 84, 94, 109, 122, 129, 137, 145, 153), unitless; `inset 0 0 0 var(--border-width-sm)` (line 18), zero lengths. Every spacing, radius, colour, font-size and line-height value uses a token. Without the ruling this gate fails on those two values. |
| G3 | Surface | Pass | `src/index.ts:41-42` exports `Card` and the types `CardProps`, `CardType`. `Image`, which Card composes, is exported on its own. Nothing else is exported from Card's folder. |
| G4 | Names | Pass | Folder `src/components/Card/`, symbol `Card`, class prefix `hz-card` (parts `hz-card__photo`, `__tag`, `__body`, ...), intent `Card.intent.json`, board row `Card`. All the same word, allowing for case and the `hz-` namespace. |
| G5 | States | Pass | Figma component set `238:24` read fresh. Design context shows `type` = `listing` or `stat`, and the properties `showTag`, `showRating`, `showAction` (listing) and `showHelper` (stat) plus the text overrides, with no hover, focus, pressed or disabled state. Code: `CardType = "listing" \| "stat"` (`Card.tsx:5`) with every property on `CardProps`. Stories (`Card.stories.tsx`): `Listing`, `ListingWithTag`, `ListingWithAction`, `ListingWithoutRating`, `ListingTagAndAction`, `ListingTruncation`, `Stat`, `StatWithoutHelper`, `StatWithAction`, `AllVariants`. Every variant and property has a story. |
| G6 | Intent | Pass | `src/components/Card/Card.intent.json` exists at the reviewed SHA and passes the six checks below. The six `use_when` and three `dont_use_when` texts were compared with the Figma Usage frame (`239:51`), read fresh, and match verbatim. |
| G7 | Version | Pass, with a standing note | `VERSIONING.md` exists at the reviewed SHA and states what 0.1.0 and each later bump commit consumers to. Its "What 0.2.1 commits you to" section (line 35) lists seventeen components and names neither `Card` nor `Calendar`. Not edited. A human updates it before a version containing Card ships. |

## Checks

| # | Check | Result | Evidence |
|---|---|---|---|
| C1 | Fields present | Pass | All seven fields present with the right types: `use_when` 6 strings, `dont_use_when` 3 objects (`when`, `instead`), `variant_intent` object with 2 keys, `placement` `[]`, `pairs_with` `["Image"]`, `required_tokens` 26 strings (sorted, no duplicates), `a11y` 2 objects (`fact`, `source`). `placement` is an empty array, a recorded Figma gap. |
| C2 | `dont_use_when` names an alternative | **Warning** (not a block) | Entry 3 ("For a stat that needs a chart or several numbers: use a content panel, not a stat tile.") has an empty `instead`. Figma names "a content panel", which is not a Horizon component. Entries 1 and 2 name `Table` and `RadioCard`. |
| C3 | `a11y` specific | Pass | Two entries, each naming a concrete element and behaviour. Sources checked at the reviewed SHA: `Card.tsx:62` is `<Image src={image} alt={imageAlt} ratio="2:1" radius="none" />` (`imageAlt` defaults to `""`, line 32, and goes to the native `<img>` `alt`); `Card.tsx:60` is the listing container `<div className=... {...rest}>` (no role, text in `<p>`, caller attributes spread). Both lines exist and implement the fact. |
| C4 | `required_tokens` resolve | Pass | `npm run build:tokens` run at the reviewed SHA. All 26 listed tokens are defined in `build/css/tokens.css` (none missing). Every `var(--...)` read by `Card.css` is listed and every listed token is read: none missing from the list, none extra (scripted comparison). |
| C5 | Variants covered | Pass | `variant_intent` keys are `listing` and `stat`, exactly the values of `CardType`. Card exports no other union. |
| C6 | No two components claim the same job | Pass | Card's six `use_when` lines compared with every other intent file in `src/components/` (18 others, plus a word-overlap pass and a read of the nearest). No identical or paraphrased use. Nearest, for awareness: `Image` ("a photo of a listing ... at the top of a property card": the photo layer inside Card is an Image, a part not a rival), `ButtonGroup` (a consumer of a card), `RadioCard` (choose one option in a form; Card's `dont_use_when` already points there), `SearchBar` (highest word overlap, 0.35, from generic phrasing only; different job). |

## Failures

None. Gate 2 would fail on `284px` and `234px` without the ruling; with it, none.

## Warnings (not blocking)

1. **C2:** `dont_use_when` entry 3 has an empty `instead` ("a content panel", not a Horizon component). Owner: `doc-generator` or the designer, if a component is ever named.
2. **`pairs_with: ["Image"]` in `Card.intent.json`.** Stories render Card alone and show no pairing; Image appears because Card uses it internally (the board records that in `Composes`). Named in the ruling's "Not ruled" line, so raised as a warning and not waived. Owner: `doc-generator`, to confirm or empty it.
3. **The intent's best practice "Make the whole listing card clickable"** has no support in the component: the container is a plain `<div>` with no role, keyboard handling or focus style (Figma draws no focus state). A consumer who adds `onClick` through the spread gets a mouse-only target, and the `a11y` entries do not say so. Named in the ruling's "Not ruled" line. Owner: `doc-generator` and a human.

## Findings outside the gates (reported, not counted)

1. **`Astro Link` is empty.** Step 2 of the skill (read the production docs page first) could not be done. It is devops' cell and nothing is written to it. `Development` cannot read `Released` for Card until it is set. `Cleared` does not change `Development` on its own.
2. **`VERSIONING.md` does not list Card** (see G7). Owner: a human.
3. **`StatWithAction` renders the same as `Stat`.** `showAction` is a no-op for `type="stat"` (`Card.tsx:49-57` never reads it), as in Figma, so the story duplicates `Stat`. Owner: the engineer, if wanted.
4. **Stories carry inline px literals** (`gap`, `margin` in `Card.stories.tsx`). Story scaffolding, not the stylesheet; gate 2 does not reach them.
5. **Raw font weights 400, 500, 600** in `Card.css`, because the repo has no `--fontweight-*` tokens (Figma binds `--fontWeight-*` variables that the build does not emit). Unitless, so not px; a pipeline gap for the humans.
6. **Inter is not loaded in Storybook and the repo ships no font loading** (`.storybook/preview.ts` imports tokens and styles only; fallback `sans-serif` in `Card.css:9`). Affects every component; outside the gates.
7. **Ten first-round Staging Testing rows were flipped to Passed at the user's instruction and carry "SUPERSEDED" text in `Context`** (carried from round 1; the rollup now reads `Passed` only, 25 rows). The audit trail is in text, not row status. Not a gate finding.

## Staleness

Row `Last Modified` (08:55:25 +01:00) is earlier than the reviewed commit (09:07:51 +01:00). Not stale at the time of review. If the row changes after the reviewed commit, or a Card source change merges, re-run against a new pin.

## Not checked by this agent (needs a browser or a human)

1. Production Storybook rendering of `?path=/story/components-card--all-variants`: the edge drawn above the photo, the 2:1 photo filling the width, tag position on the photo, one-line truncation with ellipsis. No browser was available, so none of these is marked passed. G1 is passed on the HTTP 200 and the story index, as in round 1, not on a render.
2. Whether Inter loads on the deployed site.
3. Dark mode (QA tested light only).
4. The `Astro Link` docs page (empty).
