# SideBar · release review

- **Reviewed SHA:** `680282ead001fb5128702575d313303134d3261e` (`origin/main`, "Merge pull request #96 from mavismon/staging", 2026-10-07 12:00:57 +01:00). `src/components/SideBar/` at this SHA is identical to the tested build `2ed2679` (`git diff 2ed2679 680282e -- src/components/SideBar` is empty). This report is committed on top of the reviewed SHA, on branch `release-review/sidebar`.
- **Date:** 2026-10-07
- **Verdict:** **Cleared**, with warnings (listed separately below). There are no failures.
- **Reviewer:** release agent, running `release-review` as a single-component review, not a release. No version bump, no tag, no publish, no npm. Every gate and check was run fresh at the reviewed SHA. No other component was reviewed.
- **Board row:** SideBar (`recQmHeYYGLsBHaJU`), read fresh: `Development` = `Completed`, `Design` = `Done`, `Production Storybook` = `https://horizon-design-system-cdfi.vercel.app/?path=/story/components-sidebar--default`, `Commit` = `2ed2679`, `Composes` = Logo, Link, `Astro Link` empty, `Release Review` and `Release Verdict` empty. `Last Modified` = 2026-10-07T10:56:46Z (11:56:46 +01:00), earlier than the reviewed SHA, so the review is not stale.

## Rulings

`decisions.md` was read in full at the reviewed SHA (no conflict markers). One ruling covers SideBar: **"2026-10-07 · SideBar sizes with no token, and the accepted divider and hover label"**. Quoted:

> **Ruling.** These literals in `src/components/SideBar/SideBar.css` are accepted, because they are what the Figma nodes specify, until the designer adds matching size and alpha tokens:
>
> | Value | Property | Selector | Lines |
> |---|---|---|---|
> | `220px` | `width` | `.hz-sidebar` | 11 |
> | `32px` | `--hz-sidebar-item-height`, used for the item `height` and, through `calc`, its vertical padding | `.hz-sidebar` | 5 |
> | `2px` | `gap` | `.hz-sidebar__footer` | 102 |
> | `12%` | alpha in `color-mix(in srgb, var(--color-text-inverse) 12%, transparent)` | `.hz-sidebar__divider` | 95 |
>
> The 12% is the engineer's estimate, taken by sampling a rendered pixel (6% to 12%); Figma's real opacity was never read, so it is **unconfirmed** whether 12% matches it. The user accepted the built divider as a design decision (2026-10-07).
>
> The hover label colour stays `--color-bg-inverse` (#161925) on the `--color-text-inverse` (#f9fafb) fill, set at `SideBar.css:74`, against Figma's #f9fafb label. The user accepted this as a design decision (2026-10-07); Figma was not changed, so nodes 246:6 and 246:7 still draw the invisible label. [...]
>
> **For an agent that hits it.** Gate 2 passes for exactly these four values on exactly these properties in `SideBar.css`. The hover label colour uses a token, so it is not a gate item: do not count it against a verdict, and quote this ruling when you report it. When a size token for 220px, 32px or 2px, or an alpha token for the divider appears, the ruling no longer covers that value: use the token. If the designer fixes the hover label in Figma, or documents the divider's opacity, the matching part of this ruling no longer applies and that state must be re-tested against the node.
>
> **Not ruled.** Any other literal value, including a `var()` fallback. These values in any other component. A change to these values: a different number needs a new ruling or a token. The item `padding` derived from `--hz-sidebar-item-height` and `--lineheight-lg`, the unitless font weights 400, 500 and 700, and the responsive limits `100%` and `height: 100%`, which need no ruling. The focus ring and the nav's `overflow-y: auto`, which Figma does not draw and the engineer added; the ring's contrast on the dark panel was never checked. Anything Figma does not draw and the component does not build: a collapse state, small-screen layout, arrow-key navigation, groups, disabled items, a skip link. The Usage line "the app currently always marks Dashboard active, which needs fixing", which reads as a bug note and not a design rule.

The ruling's table was verified against `SideBar.css` at the reviewed SHA, line by line:

| Ruled | Found in the file | Match |
|---|---|---|
| `220px` `width`, `.hz-sidebar`, line 11 | line 11 `width: 220px;` inside `.hz-sidebar` (opens line 4) | yes |
| `32px` `--hz-sidebar-item-height`, `.hz-sidebar`, line 5 | line 5 `--hz-sidebar-item-height: 32px;`; used at line 57 (`height`) and line 58 (padding `calc`) | yes |
| `2px` `gap`, `.hz-sidebar__footer`, line 102 | line 102 `gap: 2px;` inside `.hz-sidebar__footer` (opens line 98) | yes |
| `12%` alpha, `.hz-sidebar__divider`, line 95 | line 95 `background: color-mix(in srgb, var(--color-text-inverse) 12%, transparent);` | yes |
| hover label `--color-bg-inverse`, line 74 | line 74 `color: var(--color-bg-inverse);` inside `.hz-sidebar .hz-sidebar__link:hover, ... --hover` | yes |

How it was applied, and its limits:

- Gate 2 passes for exactly those four values and no others. A full grep of the file for hex, px, rem, em and % finds nothing else outside comments and the ruled lines (details under G2). No size token for 220px, 32px or 2px, and no alpha token, exists in `build/css/tokens.css` (built at the reviewed SHA), so the "use the token" condition is not triggered.
- **The 12% is reported as a warning, not as matching Figma.** The ruling says it is unconfirmed, and this review could not confirm it either: Figma `get_design_context` for the divider (`246:45`) returns only `bg-[var(--color-text-inverse,#f9fafb)]` and no opacity. The value stays an engineer's estimate that the user accepted as a design decision.
- **The hover label colour deviates from Figma and is reported as a warning.** Per the ruling it is not counted against the verdict. Figma still draws #f9fafb text on a #f9fafb fill (invisible). Built: #161925 on #f9fafb, 16.75:1 (computed from the built token values). The two `Staging Testing` rows flipped Failed to Passed rest on this user decision, not on a match with the Figma node.
- The "Not ruled" line was honoured. Items it names (focus ring, `overflow-y: auto`, the Usage bug-note line) are reported as warnings below, none waived and none blocked.

## Gates

| # | Gate | Result | Evidence |
|---|---|---|---|
| G1 | Done | Pass | `Development` reads `Completed`. `Production Storybook` returns HTTP 200, and the deployed `index.json` lists 8 SideBar stories: `default`, `without-footer`, `current-page`, `item-hover`, `long-label-and-footer`, `few-items`, `interactive`, `back-office-page`. No browser was available, so "opens" is evidenced by the 200 and the story index, not a render. |
| G2 | Tokens | Pass, by ruling | `SideBar.css`, every declaration read, and grepped for hex, px, rem, em, `%`, `rgb`, `hsl` and any `var()` fallback. No hex, no `rgb`/`hsl`, no rem or em, `var()` fallbacks 0. px/% literals: `32px` line 5, `220px` line 11, `12%` line 95, `2px` line 102 (all four covered exactly by the ruling); `100%` line 12 (`height`) and line 56 (`width`), named in "Not ruled" as needing no ruling; lines 2 and 3 and 52 are inside comments. `font-weight` 400, 500, 700 are unitless. Item padding is `calc((var(--hz-sidebar-item-height) - var(--lineheight-lg)) / 2) var(--spacing-md)` (line 58), built from the ruled variable and tokens. `--hz-sidebar-item-height` is a component-local custom property, not a token, and is not in `required_tokens` (see C4). Without the ruling this gate fails on the four values. |
| G3 | Surface | Pass | `src/index.ts:56-57` exports `SideBar`, and the types `SideBarProps`, `SideBarItem`, `SideBarItemState`. The two extra types are used by `SideBarProps` (`items`, and `state` on an item), so they are part of the props type, not a stray export. `DEFAULT_ITEMS` is exported from `SideBar.tsx` for the stories but is not exported from `src/index.ts`. |
| G4 | Names | Pass | Folder `src/components/SideBar/`, symbol `SideBar`, class prefix `hz-sidebar` (case and `hz-` only), intent `SideBar.intent.json`, board row `SideBar`. |
| G5 | States | Pass | Figma `246:10` (`_sidebar-item`, read fresh): `state=default` (246:4), `state=hover` (246:6), `state=active` (246:8); component `246:11` has 12 nav items, a divider and a footer; `ShowFooter` true or false (specimen board 233:14320, per the stories header; the footer is in the node tree). Code: `SideBarItemState = "default" \| "hover"` (`SideBar.tsx:6`) and `current` for active (`:14`, class at `:72`); `showFooter` (`:27`). Stories: `Default` (default and active), `ItemHover` (hover), `CurrentPage` (active moved), `WithoutFooter` (ShowFooter false), plus `LongLabelAndFooter`, `FewItems`, `Interactive`, `BackOfficePage`. Every published state has a story. Figma draws no focus, pressed, disabled, collapsed or small-screen state. |
| G6 | Intent | Pass, with warnings | `SideBar.intent.json` exists at the reviewed SHA and passes the six checks below. Warnings under C2 and "Intent file" below. |
| G7 | Version | Pass, with a standing note | `VERSIONING.md` exists and states what `0.x` and later bumps commit consumers to. It does not name SideBar, and neither does `CHANGELOG.md`. SideBar is not yet in any published version. Not edited. |

## Checks

| # | Check | Result | Evidence |
|---|---|---|---|
| C1 | Fields present | Pass | All seven fields present with the right types: `use_when` 6 strings, `dont_use_when` 3 objects, `variant_intent` 3 keys, `placement` 1 string, `pairs_with` 1, `required_tokens` 21, `a11y` 7 objects. Nothing is empty except `variant_intent.default` (see warnings). |
| C2 | `dont_use_when` names an alternative | **Warning** | Entry 1 names `Header`. Entry 2 ("For actions such as \"Export\" or \"Add rate\": put them in the page, under the title.") has `instead: ""`. Entry 3 ("For more than 12 items: group them, or move rare ones into Settings.") has `instead: ""`. Two warnings, never a block. |
| C3 | `a11y` specific | Pass | All seven sources checked at the reviewed SHA: `SideBar.tsx:65` `<nav ... aria-label={navLabel}>`; `:66` `<ul>`; `:69` `<Link` (and `Link.tsx:22` renders `<a`); `:77` `aria-current={item.current ? "page" : undefined}`; `:62` `<Logo type="mark" alt="" />` (`Logo.tsx:14` honours the `alt` prop); `:85` `aria-hidden="true"` on the divider; `SideBar.css:87` the `:focus-visible` outline, `--border-width-md` = 2px (`tokens.css:65`). Each fact is a concrete element, attribute or behaviour and the line implements it. See the focus-ring warning: the fact is true, its contrast is not adequate. |
| C4 | `required_tokens` resolve | Pass | `npm run build:tokens` at the reviewed SHA, exit 0. All 21 listed tokens are defined in `build/css/tokens.css`. Scripted comparison of every `var(--...)` in `SideBar.css` against the list: the only name read and not listed is `--hz-sidebar-item-height`, which is the component's own custom property defined at line 5, not a token. Nothing listed is unused. |
| C5 | Variants covered | Pass (judgement) | `variant_intent` keys are `default`, `hover`, `active`. The only variant union in `SideBar.tsx` is `SideBarItemState = "default" \| "hover"` (line 6); `active` is the Figma `state=active` value, carried in code by the boolean `current` rather than the union. This is the same reading as the Checkbox review (Figma-published state values, with one carried by a native attribute or boolean instead of a union), so the keys equal the three Figma values `246:4`, `246:6`, `246:8`. **On the strictest wording ("exactly the values of the union") `active` is one extra key.** Reported so a human can overrule; no other reading finds a missing key. |
| C6 | No two components claim the same job | Pass | No `use_when` line is identical to any in the other 21 intent files (scripted exact match, 0 duplicates). Nearest by topic: `Header` ("Use type backoffice above the content of each back office page, next to the Sidebar"), which is the SideBar's partner, not a rival; `Breadcrumbs` says to use "the Sidebar or Header component instead" for main navigation, which points to SideBar; `Logo` mentions a collapsed sidebar; `Button` and `Link` cover actions and in-page navigation. |

## Failures

None. Gate 2 would fail on the four ruled values without the ruling; with it, none.

## Warnings

Listed separately from failures. None blocks.

1. **Divider alpha 12% is unconfirmed (`SideBar.css:95`).** An engineer's estimate from a sampled pixel (6% to 12%); Figma's real opacity was never read and is still not exposed by the design tools (checked on `246:45` in this review). The user accepted it as a design decision. It is not described here as matching Figma. Owner: the designer, to document or bind the opacity (then add an alpha token and re-test); until then the user's decision stands.
2. **Hover label colour deviates from Figma (`SideBar.css:74`).** Built #161925 (`--color-bg-inverse`) on #f9fafb; Figma `246:6`/`246:7` draw #f9fafb on #f9fafb. Accepted by the user; Figma was not changed. The two `Staging Testing` rows moved Failed to Passed on that basis. Per the ruling it is not counted against the verdict. Owner: the designer, to fix the hover label in Figma, after which the state must be re-tested against the node.
3. **Focus ring contrast is low (computed, not browser-tested).** `SideBar.css:87-88` draws `--color-border-focus` (#1d44ba) at 2px. From the built token values: 2.16:1 against the panel (#161925) and 1.60:1 against the active fill (#162d69), both under the 3:1 WCAG 2.1 SC 1.4.11 minimum for a focus indicator; it reaches 7.76:1 only on the hover fill. The ring is not in Figma (the engineer added it) and the ruling's "Not ruled" line records that its contrast was never checked, so no ruling covers it. It is not a gate in this skill, so it is a warning. Owner: the designer, for a ring colour that works on the inverse panel, then the engineer.
4. **QA gaps, not credited.** QA did not test real Tab order, the focus ring's contrast, real mouse hover, screen-reader output or the dark theme (no real input available). None is claimed as passed. This review could not run them either (no browser, no input device). Marked **Not checked**.
5. **Inter is not loaded in Storybook, and the repo ships no font loading** (the QA report's check "Font loaded" is "Not confirmed"). The component sets `font-family: var(--fontfamily-body), sans-serif` (line 15). This affects every component; it is not specific to SideBar. Owner: a human decision on font delivery.
6. **Intent file, written by the engineer from the Figma Usage frame `247:520`** (read fresh this review):
   - All six `use_when` strings and the three `dont_use_when` `when` strings match the frame text word for word (3 "Use the sidebar", 3 "Best Practice", 3 "Do not use the sidebar"). The frame has no alternatives, so the engineer supplied `instead`.
   - `use_when[1]` ("Mark the page you are on as active, and only that one: the app currently always marks Dashboard active, which needs fixing.") carries a **bug note** about the app inside a design rule. The ruling lists it as a bug note, not a design rule. Owner: the designer or `component-intent`, to reword; not edited here.
   - `dont_use_when[1]` and `[2]` have empty `instead` (C2). Figma gives no named component for either; the real alternatives are "put them in the page, under the title" and "group them, or move rare ones into Settings", neither a component. Owner: `component-intent`.
   - `variant_intent.default` is `""` (a recorded Figma gap: Figma publishes no description of the default item). `hover` is `"lighter"` and `active` is `"the current page"`; neither says when to choose it, only what it looks like. Owner: `component-intent`.
   - `pairs_with: ["Header"]` is supported by the `BackOfficePage` story (`SideBar.stories.tsx:95-105`, `Header type="backoffice"`) and by `Header.intent.json` naming the Sidebar. `Logo` and `Link`, which SideBar composes, are not in `pairs_with`; composed parts are not pairings, so this is not a finding.
   - `placement` has one entry, which repeats the first `use_when`.
7. **`Composes` verified in code.** The board lists Logo and Link. `SideBar.tsx:3-4` imports `Link` and `Logo`; `:62` renders `Logo type="mark"`, `:69` renders `Link` per item. Both match the board; nothing else is imported from `src/components`.
8. **G7 standing note.** `VERSIONING.md` and `CHANGELOG.md` do not mention SideBar. A human updates them before a version containing SideBar ships.
9. **C5 strict reading** (see C5): `active` is one key beyond the union `SideBarItemState`.

## Not checked

- No browser and no real input: gate 1 is evidenced by HTTP 200 and the story index, not a render. Tab order, the focus ring on screen, real hover, screen-reader output and the dark theme were not exercised by anyone and are not claimed.
- `Astro Link` is empty, so the docs page could not be read first (step 2). Source and Storybook were used instead.
- Figma's divider opacity could not be read (see warning 1).
