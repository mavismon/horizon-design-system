# Header · release review

- **Reviewed SHA:** `39ca392bf79b74eedb46c8b3f1fdd34fc06bb7d0` (branch `release-review/header`). Four commits on top of `origin/main` `76c7256`: `b11e0c0` (`Header: intent file (from Figma usage frame 208:670 and current code)`, cherry-pick of `f2952ce` from `origin/intent/header-v2`), `a08a17b` (`Header intent: carry Figma Best Practice lines into use_when`, cherry-pick of `937aebf`), the `decisions.md` commit (appends the human ruling "2026-10-04 · Header sizes with no token", verbatim, 23 lines) and the QA report commit (adds `reports/Header/qa-report.md`, copied unchanged). `src/` differs from `origin/main` only by `Header.intent.json`; the Header build is `8be1087`, in `origin/main`'s history via PR #58 (`4092685`). `src/components/Header/` is byte-identical between `8be1087` and `origin/main`. The older abandoned attempt `9dcc0dc` on `origin/build/header`, and its intent file, were ignored. This report is committed on top of the reviewed SHA.
- **Date:** 2026-10-04
- **Verdict:** **Cleared**
- **Reviewer:** release agent, running `release-review`
- **Board row:** `Header` (`recz2dpVywODU5mGd`), read fresh: `Development` = `Completed`, `Design` = `Done`, `Staging Storybook` and `Production Storybook` set, `Commit` = `8be1087`, `Composes` = Logo, Link, Button, Avatar, SearchBar, `Astro Link` empty. `Release Review` and `Release Verdict` empty before this review. 10 `Staging Testing` rows, all `Passed`, and `Staging Testing Results Summary` = `Passed`.
- **Registry fact, not shipped code:** the 10th row (`recvKrWDZhcKWog86`, created 2026-10-04T17:19:55Z, "type=app (focus ring, commit 7f1a9f2)") is a `Passed` re-test of commit `7f1a9f2` on `origin/build/header-focus-token`, which swaps `outline-offset: 2px` for `var(--border-width-md)` at `Header.css` line 137. That commit is not in `origin/main` and is not in the reviewed SHA; the reviewed code still has the literal `2px`. The QA report carried in (`reports/Header/qa-report.md`) predates that row and records the nine rows for the shipped build `8be1087`. That row is also why `Last Modified` reads 2026-10-04T17:19:55Z (18:19 BST), later than the merge of the build (`4092685`, 18:02 BST): the later change is a test row, and `src/components/Header/` has not changed since `8be1087`, so the review is not stale in substance.

## Rulings applied

`decisions.md` was read in full at the reviewed SHA. One ruling is applied, to gate 2 only: **"2026-10-04 · Header sizes with no token"**, appended in this branch as a separate commit before this review. Each cited line and selector was checked against `src/components/Header/Header.css` at the reviewed SHA, and all match the ruling table exactly:

| Line | Declaration | Selector (opens at) | Ruling row |
|---|---|---|---|
| 16 | `height: 64px;` | `.hz-header--web` (15) | 64px web bar |
| 21 | `height: 56px;` | `.hz-header--backoffice` (20) | 56px backoffice bar |
| 26 | `height: 52px;` | `.hz-header--app` (25) | 52px app bar |
| 62 | `width: 80px;` | `.hz-header .hz-header__button` (61) | 80px nested web Button |
| 66 | `width: 260px;` | `.hz-header .hz-header__search` (65) | 260px nested backoffice Search |
| 74 | `width: 72px;` | `.hz-header__side` (70) | 72px app side column |
| 94, 95 | `width: 20px;` `height: 20px;` | `.hz-header__back-icon` (92) | 20px back icon |
| 137 | `outline-offset: 2px;` | `.hz-header__back:focus-visible, .hz-header__action:focus-visible` (134-135) | 2px focus offset |

Quoted:

> **Ruling.** These literals in `src/components/Header/Header.css` are accepted, because they are what the Figma nodes specify, until the designer adds matching size tokens: [the table above: 64, 56, 52, 80, 260, 72, 20 and the 2px `outline-offset`].
>
> The `2px` focus offset is not drawn in Figma: the engineer added the keyboard focus ring, which Figma does not specify. It is accepted at the value `--border-width-md` resolves to, until the value is bound to that token. A fix that swaps it for the token (commit `7f1a9f2` on `build/header-focus-token`) was made but not shipped, so the literal remains on `main`.
>
> **For an agent that hits it.** Gate 2 passes for exactly these values on exactly these properties in `Header.css`. Quote this ruling in the report. When a size token for any of these values appears, the ruling no longer covers that value: use the token.
>
> **Not ruled.** Any other literal value, including a `var()` fallback. These values in any other component. A change to these values: a different number needs a new ruling or a token. The font weights 400, 500 and 600, which are unitless numbers and need no ruling. The widths 1280, 390 and 1220 that Figma draws for the bars: the code sets the bar width to 100% and only the story decorators apply them. The primary colour, which uses `--color-primary-default` (`#2b5ad6`) and differs from the `#3b71f2` Figma shows: that is accepted pipeline drift, not a gate finding. Any state Figma does not draw.

The ruling covers nothing else in this review. No other ruling is applied.

## Gates and checks

| # | Gate / check | Result | Evidence |
|---|---|---|---|
| G1 | Done | Pass | `Development` reads `Completed`. `Production Storybook` (`https://horizon-design-system-cdfi.vercel.app/?path=/story/components-header--all-variants`) returns HTTP 200, and the deployed `index.json` lists thirteen Header stories: `web`, `app`, `backoffice`, `web-signed-out`, `web-no-button`, `web-no-button-signed-out`, `app-action`, `app-no-back`, `app-no-back-action`, `backoffice-no-search`, `backoffice-no-avatar`, `backoffice-no-search-no-avatar`, `all-variants`. No browser was available to this agent, so "opens" is evidenced by the 200 and the story index; the QA report records the live render on the preview deployment. |
| G2 | Tokens | Pass (by ruling) | A grep of `Header.css` for `px`, hex, `rgb(a)`, `hsl(a)`, `%`, decimals, `calc(` and any `var(` with a comma finds: lines 16, 21, 26, 62, 66, 74, 94, 95, 137, **all covered exactly by the ruling above**; lines 2 is the header comment that names them; line 9 `width: 100%` is a relative keyword-like value (the ruling's "Not ruled" says the code sets bar width to 100%). No hex, no `rgb`/`hsl`, no `calc()`, no `var()` fallback. `var(--fontfamily-body), sans-serif` (line 12) has `sans-serif` outside the `var()`, a keyword. Font weights 400, 500, 600 (lines 52, 57, 108, 119, 129) are unitless and named in "Not ruled" as needing no ruling. `flex: 1 0 0` (99) is unitless. `Header.tsx` has no `style=`, hex or px (the SVG `viewBox="0 0 20 20"` and `strokeWidth="1.75"` at lines 57 and 65 are SVG user-space attributes, not CSS; see finding 5). |
| G3 | Surface | Pass | `src/index.ts:37` exports `Header`; line 38 exports `HeaderProps` and `HeaderType`. `src/styles.css:16` imports `Header.css`. `BackIcon` (`Header.tsx:53`) is not exported and is internal. Nothing says Header should stay internal. |
| G4 | Names | Pass | Folder `src/components/Header/`, symbol `Header` (`Header.tsx:73`), CSS prefix `hz-header`, intent `Header.intent.json`, board row `Header`; Figma calls the set `header` (208:43). Same word. |
| G5 | States | Pass | Figma set `208:43` read fresh with `get_metadata`: three cells, `208:7` type=web (1280x64), `208:29` type=app (390x52), `208:36` type=backoffice (1220x56). Code: `HeaderType = "web" \| "app" \| "backoffice"` (`Header.tsx:9`). Each cell has a story (`Web`, `App`, `Backoffice`). The boolean variations on the specimen board 209:4849 (ShowButton, ShowAvatar, ShowBack, ShowAction, ShowSearch) each have a story: `WebSignedOut`, `WebNoButton`, `WebNoButtonSignedOut`, `AppAction`, `AppNoBack`, `AppNoBackAction`, `BackofficeNoSearch`, `BackofficeNoAvatar`, `BackofficeNoSearchNoAvatar`, plus `AllVariants`. Figma draws no size, hover, pressed or disabled state; the code adds `:focus-visible` on the back and action buttons (finding 3). |
| G6 | Intent | Pass | `Header.intent.json` exists at the reviewed SHA and passes checks 1 to 6. |
| G7 | Version | Pass, with a standing note | `VERSIONING.md` exists at the reviewed SHA and states the 0.x bump rules and what 0.1.0 commits you to. Line 35 is stale: it says 0.1.0 "contains one component, `Button`", while the source now exports sixteen `export {` lines of components. Reported, not edited. A human updates it before a version containing Header ships. |
| C1 | Fields present | Pass | All seven fields present with the right types: `use_when` 6 strings, `dont_use_when` 3 objects (`when`, `instead`), `variant_intent` object with 3 keys, `placement` `[]`, `pairs_with` `[]`, `required_tokens` 18 strings (sorted, no duplicates), `a11y` 9 objects (`fact`, `source`). `placement` and `pairs_with` are empty; see finding 4. |
| C2 | Alternatives named | Pass, three warnings | All three `dont_use_when` entries have an empty `instead`: see Warnings. |
| C3 | a11y specific | Pass | Nine entries; every cited line checked at the reviewed SHA. `Header.tsx:103` is `<header>`; `:108` is `<nav ... aria-label="Main">`; `:113` is `aria-current="page"`; `:136` is the native `<button type="button" ... aria-label="Back">`; `:59` is `aria-hidden="true"` on the chevron svg (`focusable="false"` at :60); `:141` is the `<h1>` app title; `:144` is the native action `<button type="button">`; `:153` is the backoffice `<h1>`; `Header.css:134` opens the `:focus-visible` rule whose outline is at lines 136-137. Each names a concrete element, attribute or behaviour and its line implements it. The back-button entry's second claim (chevron `aria-hidden`) is at line 59, covered by the entry that follows it; see finding 6. |
| C4 | Tokens resolve | Pass | `npm run build:tokens` run at the reviewed SHA wrote `build/css/tokens.css`. All 18 listed tokens are defined there. The set of `var(--...)` names in `Header.css` equals the listed set exactly (18 and 18, no difference either way). |
| C5 | Variants covered | Pass | `variant_intent` keys are `web`, `app`, `backoffice`: exactly the values of `HeaderType` (`Header.tsx:9`). None missing, none extra. |
| C6 | No duplicate job | Pass | Compared `use_when` with the fifteen other intent files in `src/components/`: no identical entry, and no two components claim the same job. Header composes Logo, Link, Button, Avatar and SearchBar and is the page-top bar; none of them lists that use. |

## Intent against Figma usage frame 208:670

The intent file was written by `doc-generator` from the Figma usage frame on the `intent/header-v2` branch (two commits, the second carrying the Best Practice lines into `use_when`). This review did not re-read the frame and did not edit the file; it checked shape, lines, tokens, variants and overlap only. Each `variant_intent` value is a use sentence from the frame, not a description derived from the variant's name.

## Failures

None.

## Warnings (not blocking)

- **Check 2:** all three `dont_use_when` entries have an empty `instead`: (1) "More than once on a page, or inside a card or a modal."; (2) "To hold page actions such as "Export" or "Add rate": put them in the page content, under the title."; (3) "With more than three nav links on web: move the rest into the Help page or the footer." The frame names no alternative component (entries 2 and 3 name a place, not a component).

## Findings outside the gates

1. **Props that are not Figma properties.** `buttonText`, `avatarSrc`, `avatarAlt`, `searchPlaceholder`, `link1Href`, `link2Href`, `link3Href`, `onButtonClick`, `onBackClick`, `onActionClick`, `onSearch` (`Header.tsx:34-50`). They are public API once published (a 0.x breaking-change surface under `VERSIONING.md`). Owner: a human, to accept them as intended API or ask the designer to draw them.
2. **Pipeline colour drift.** `--color-primary-default` renders `#2b5ad6` (Figma `#3b71f2`). Accepted drift under the ruling's "Not ruled" paragraph and the QA report. Same as Button, Chip, Toggle, Dropdown and File.
3. **Unspecified states.** Figma draws no hover, pressed, disabled or focus state. The engineer added a `:focus-visible` ring on the back and action buttons (`Header.css:134-138`), and the nav `Link` anchors keep Link's hover underline (QA report). The `2px` offset is the one the ruling covers; the unshipped `7f1a9f2` would bind it to `--border-width-md`. Owner: the designer for the states; the engineer to ship `7f1a9f2` if wanted (then the ruling's 137 row no longer applies).
4. **Empty `placement` and `pairs_with`.** Header renders Logo, Link, Button, Avatar and SearchBar (`Header.tsx:3-7`) and the board row's `Composes` lists all five, but `pairs_with` is `[]`, because the stories import only `Header`. Check 1 allows an empty list. Owner: `component-intent`, if the team wants the composition recorded.
5. **Unlisted raw numbers in the component source.** The back chevron is a hand-drawn SVG (`viewBox="0 0 20 20"`, `strokeWidth="1.75"`, path coordinates, `Header.tsx:55-69`) where Figma uses an exported vector. These are SVG user-space attributes, not stylesheet literals, so gate 2 (stylesheet) is not failed, but they are not token-bound and are not in the ruling. Owner: the designer, to supply the icon; the engineer to swap it.
6. **a11y second claim.** The 4th entry (`Header.tsx:136`) also claims the chevron icon is `aria-hidden`, which is at line 59; entry 5 cites that line. Check 3 is met by the first fact on the line; precision owner: `component-intent`.
7. **Astro Link empty.** `release-review` expects `Astro Link` before a review, but `Astro Link` is written by devops after a Cleared verdict (the circular docs gate noted in `release.md`). The review therefore had no production docs page to read first, and compared the source with Figma and the QA report instead. Owner: devops, after merge.
8. **Reviewed code carries a literal that a ready fix removes.** `origin/build/header-focus-token` (`7f1a9f2`, one line in `Header.css`, plus a `decisions.md` change) is tested and `Passed` on the board but not shipped. If it ships after this review, the row-137 part of the ruling stops covering it and the review is stale for that line; re-review then.
9. **QA limitations carried over.** Inter was not installed in the test browser, so text widths are unverified; the back-chevron glyph was not compared with Figma's vector; dark mode was not tested; several boolean variations were checked by code review rather than separately measured; the qa agent had no browser, so measurements were taken by the orchestrating session.
10. **Standing `VERSIONING.md` note.** See G7: line 35 says 0.1.0 contains one component, `Button`.
