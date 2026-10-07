# Table · release review (round 2)

- **Reviewed SHA:** `3ad37ea2d7412759b70c4f15567d19bfa9a5ec2f` (`origin/main`, "Merge pull request #101 from mavismon/staging", 2026-10-07 12:27:11 +01:00). `main` == `origin/main`, tree clean. Round 1 reviewed `e604ef3` and is in git history (`c6023ca`), where it recorded **Blocked** on gate 2.
- **Date:** 2026-10-07
- **Verdict:** **Cleared**, with warnings (listed separately below). There are no failures. Gate 2 passes by ruling, exactly as ruled.
- **Reviewer:** release agent, running `release-review` as a single-component review, not a release. No version bump, no tag, no publish. Every gate and check was run fresh at the reviewed SHA. No other component was reviewed. This report is **not committed** and `Release Review` / `Release Verdict` are **not written** (see the last section).
- **Changes on `main` since `e604ef3`:** `git log e604ef3..3ad37ea` is four commits: `c6023ca` (round-1 report), `1615a2c` (the Table ruling in `decisions.md`), and two merge commits. `git diff e604ef3 3ad37ea -- src` is empty, so `src/components/Table/` is unchanged since `e13f7ae` and nothing else in `src/` moved. Only `decisions.md` and `reports/Table/release-review.md` changed.
- **Board row:** Table (`recpBEqFNwRnfR8vi`), read fresh: `Development` = `Completed`, `Production Storybook` = `https://horizon-design-system-cdfi.vercel.app/?path=/story/components-table--default`, `Commit` = `e13f7ae`, `Astro Link` empty, `Release Review` and `Release Verdict` empty. `Last Modified` = 2026-10-07T11:18:47Z, earlier than the reviewed commit (11:27:11Z), so the review is **not stale**. (Round 1's staleness question is closed: the commit it cited was earlier than that edit, this one is later.)

## Rulings

`decisions.md` was read at the reviewed SHA. One ruling covers Table: **"2026-10-07 · Table sizes with no token"** (`decisions.md:313`). Quoted:

> **Ruling.** These literals are accepted, because they are what the Figma nodes specify (or, for the focus ring, the established offset), until the designer adds matching size tokens:
>
> | Value | Property | Where | Line |
> |---|---|---|---|
> | `48px` | body row `height` | `Table.css` | 47 |
> | `44px` | header row `height` | `Table.css` | 59 |
> | `10px` | sort icon `width` | `Table.css` | 98 |
> | `10px` | sort icon `height` | `Table.css` | 99 |
> | `3px` | tag block `padding` | `Table.css` | 115 |
> | `80px` | Previous / Next button `width` | `Table.css` | 178 |
> | `2px` | focus ring `outline-offset` | `Table.css` | 193 |
> | `48` | checkbox column width | `Table.tsx` | 90 |
> | `268` | primary column width | `Table.tsx` | 85 |
> | `180` | text column width | `Table.tsx` | 86 |
> | `140` | tag column width | `Table.tsx` | 87 |
> | `176` | action column width | `Table.tsx` | 88 |
>
> **For an agent that hits it.** Gate 2 passes for exactly these twelve values on exactly these properties in `Table.css` and `Table.tsx`. Quote this ruling when you report it. When a size token for any of these values appears, the ruling no longer covers that value: use the token. The tag's 3px padding keeps the 22px Figma height; moving it to `--spacing-xs` would give a 24px tag and is a design decision, not covered here.
>
> **Not ruled.** Any other literal value, including a `var()` fallback. These values in any other component. A change to these values: a different number needs a new ruling or a token. The warning tag's roughly 2:1 contrast, and the descending sort arrow, focus ring and disabled Previous / Next that Figma does not draw, which the designer still has to confirm.

Verified against the files at the reviewed SHA, line by line:

| Ruled | Found | Match |
|---|---|---|
| `Table.css:47` `48px` body row `height` | `height: 48px;` in `.hz-table__cell` | yes |
| `Table.css:59` `44px` header row `height` | `height: 44px;` in `.hz-table__cell--header` | yes |
| `Table.css:98` `10px` sort icon `width` | `width: 10px;` in `.hz-table__sort-icon` | yes |
| `Table.css:99` `10px` sort icon `height` | `height: 10px;` in `.hz-table__sort-icon` | yes |
| `Table.css:115` `3px` tag block `padding` | `padding: 3px var(--spacing-sm);` in `.hz-table__tag` | yes |
| `Table.css:178` `80px` page button `width` | `width: 80px;` in `.hz-table .hz-table__page-button` | yes |
| `Table.css:193` `2px` focus ring `outline-offset` | `outline-offset: 2px;` on the three `:focus-visible` selectors | yes |
| `Table.tsx:90` `48` checkbox column | `const CHECKBOX_WIDTH = 48;` (used at `:255`) | yes |
| `Table.tsx:85` `268` primary column | `primary: 268,` | yes |
| `Table.tsx:86` `180` text column | `text: 180,` | yes |
| `Table.tsx:87` `140` tag column | `tag: 140,` | yes |
| `Table.tsx:88` `176` action column | `action: 176,` | yes |

The "Not ruled" line was honoured: the warning-tag contrast, the engineer-added items and the unconfirmed designer decisions are reported as warnings below, none waived and none blocked.

## Preflight

| Check | Result |
|---|---|
| Airtable connected, base matches config | Pass on the ID `appMX8Y0q2sqx4v0a`. **Open item:** `registry.local.json` has no `baseName`, so the base's name could not be compared. |
| Tree clean, on `main`, level with `origin/main` | Pass: `3ad37ea` == `origin/main` after `git fetch`, `git status` clean. |
| `README.md` names the package and install command | Pass: `README.md:5-8`. |
| npm auth | `npm whoami` = `hsuyeemon`. `npm token list` shows exactly one token, id `8dd8a5`, labelled "Publish token". Passes only by the `decisions.md` ruling of 2026-09-28 ("npm token type in release preflight"), which expires 2026-12-26. The token value was not read or handled. |

## Gates

| # | Gate | Result | Evidence |
|---|---|---|---|
| G1 | Done | Pass | `Development` reads `Completed`. `Production Storybook` returns HTTP 200. No browser was available to this review, so "opens" rests on the 200 and the orchestrator's stated render check, not on my own render. |
| G2 | Tokens | **Pass, by ruling** | See G2 detail. Exactly the twelve ruled values, on exactly the ruled properties and lines. Nothing else. Without the ruling this gate fails on the twelve. |
| G3 | Surface | Pass | `src/index.ts:58-71` exports `Table` and `TableProps`, `TableColumn`, `TableRowData`, `TableCellType`, `TableCellValue`, `TableTag`, `TableAction`, `TableTone`, `TableRowState`, `TableSort`, `TableSortDirection`. All are used in `TableProps` or the rows and columns it takes. `DEFAULT_COLUMNS` and `DEFAULT_ROWS` are exported from `Table.tsx` for the stories only. |
| G4 | Names | Pass | Folder `Table`, symbol `Table`, class prefix `hz-table`, intent `Table.intent.json`, board row `Table`. |
| G5 | States | Pass | Figma `251:168` (read in round 1, the file's `src/` is unchanged since): `_table-row` `state=header/default/hover/selected`, `_table-cell` `type=header/primary/text/tag/action/checkbox`, `tag` `tone=success/neutral/error/warning/info`. Code: `TableRowState` plus `selected` (`Table.tsx:13`, `:46`), `TableCellType` (`:11`), `TableTone` (`:9`), `showFooter`, `selectable`. Stories: `Default`, `WithoutFooter`, `WithoutCheckboxColumn`, `HoverAndSelected`, `TagTones`, `SortedAscending`, `LongText`, `PreviousDisabled`, `NextDisabled`, `Interactive`, `BackOfficePage`. Every published state has a story. |
| G6 | Intent | Pass, with warnings | `Table.intent.json` exists at the reviewed SHA and passes the six checks. |
| G7 | Version | Pass, with a standing note | `VERSIONING.md` exists and states what `0.x` and later bumps commit consumers to. **Still only a warning.** `VERSIONING.md` "Unreleased on `main`" and `CHANGELOG.md` still do not name Table (grep for "Table": 0 matches in each), and do not name SideBar either. Same treatment as the SideBar review. A human updates both before a version carrying Table ships. Not edited. |

### G2 detail

Re-grepped `Table.css` (hex, `rgb`, `hsl`, `px`, `rem`, `em`, `%`, any `var()` with a fallback) and `Table.tsx` (px, hex, `style=`, `width:`, `height:`, and the bare numbers 48, 268, 180, 140, 176).

- `Table.css`: no hex, no `rgb`/`hsl`, no rem or em, **no `var()` fallbacks**. px literals at lines 47, 59, 98, 99, 115, 178, 193, all ruled. `width: 100%` at lines 8 and 21 are responsive limits, named in the sibling rulings as needing none (the Table ruling's "Not ruled" does not list them, they are not a size). Line 2 is inside the header comment.
- `Table.tsx`: the only inline styles are the two `<col style={{ width }}>` at lines 255 and 257, which read the ruled constants (`CHECKBOX_WIDTH` line 90, `DEFAULT_WIDTH` lines 85-88). The only other occurrence of a ruled number is `"+140%"` at line 141, sample story data text, not a style value. No other px, hex or inline size. The `SortIcon` SVG `viewBox` and path coordinates are drawing geometry, not a style value.
- No size token for 44 / 48 / 80 / 10 / 3 exists in `build/css/tokens.css` (built at this SHA), so the ruling's "use the token" condition is not triggered.

## Checks

| # | Check | Result | Evidence |
|---|---|---|---|
| C1 | Fields present | Pass | All seven present with the right types: `use_when` 3, `dont_use_when` 3, `variant_intent` 5 keys, `placement` 1, `pairs_with` 2, `required_tokens` 28, `a11y` 7. Nothing empty. |
| C2 | `dont_use_when` names an alternative | **Warning** | Entry 1 names `Card`. Entry 2 ("For two or three facts about one thing, such as in a dialog: use detail rows.") and entry 3 ("Put long text or paragraphs in a cell: link to a detail page instead.") have `instead: ""`. Two warnings, never a block. |
| C3 | `a11y` specific | Pass, with a note | All seven sources exist at the reviewed SHA and each fact is a concrete element or attribute: `Table.tsx:253` `<table aria-label>`, `:277` `<th scope="col"`, `:279` `aria-sort`, `:266` "Select all rows", `:353` `<nav aria-label="Pagination">`, `:350` `aria-live="polite"`, `Table.css:189-193` focus outline. Three facts bundle a second claim at another line (`<th scope="row">` at `:329-331`, the `Link` actions at `:181`, the sort `<button>` at `:282` and arrow `aria-hidden` at `:203`); each is true and implemented. Not a block. Owner: `component-intent`. |
| C4 | `required_tokens` resolve | Pass | `npm run build:tokens` at the reviewed SHA, exit 0, tree clean afterwards. All 28 listed tokens are in `build/css/tokens.css`. Scripted comparison of every `var(--…)` in `Table.css`: nothing read and unlisted, nothing listed and unused. |
| C5 | Variants covered | Pass | `variant_intent` keys `success`, `neutral`, `error`, `warning`, `info` equal the values of `TableTone` (`Table.tsx:9`) exactly. |
| C6 | No two components claim the same job | Pass | No `use_when` line is identical to any in the other 22 intent files (scripted, 0 duplicates). Card, Calendar and ProgressBar name `Table` in their own `dont_use_when`, which points to Table. |

## Failures

None. Gate 2 would fail on the twelve ruled values without the ruling.

## Warnings

Listed separately from failures. None blocks.

1. **Warning tag contrast about 2:1.** `--color-status-warning` text on `--color-status-warning-bg` (`Table.css:138-141`) is about 2:1 for 11px text, below WCAG AA. Named in the ruling's "Not ruled", so not waived. Figma's Table frame draws no warning or info tag. Owner: the designer or token owner. Changing the colour would touch other components.
2. **Added by the engineer, not in Figma:** descending sort arrow, keyboard focus ring, disabled Previous / Next (transparent background although `--color-state-disabled-bg` exists). Named in "Not ruled". The designer still has to confirm them.
3. **Neutral, error, warning and info tag colours have no pixel spec** in the Figma Table frame; QA passed them on geometry and token consistency.
4. **Dark theme unverified.** Tokens do not switch under `prefers-color-scheme: dark` (QA note 5). Library-wide, not a Table finding.
5. **Intent file.** Two `dont_use_when` entries with no alternative (C2); C3 line citations as noted. Owner: `component-intent`. Not edited.
6. **No story for descending sort**; reachable through `Interactive`. Owner: engineer, if wanted.
7. **G7 standing note** (above). If Table ships it is a pure addition, a patch on 0.x per `VERSIONING.md`.
8. **Process items, not Table findings.** `registry.local.json` has no `baseName`. `Astro Link` is empty, so the docs page could not be read first (step 2); the docs gate is circular today. Source and Storybook were used.

## Not checked

- No browser or real input: G1 is evidenced by HTTP 200, not my own render. Tab order, the focus ring on screen, real hover, screen-reader output and dark theme were not exercised here. QA's "Still not tested" stands: BackOfficePage layout beside SideBar / Header, narrow viewport, focus ring on Previous / Next, the pagination group's alignment and 8px gap.

## What is needed to land this report

Nothing was branched, committed, pushed or opened. Authorization needed from the user:
1. Branch `release-review/table-round-2` from `origin/main` (`3ad37ea`).
2. Commit `reports/Table/release-review.md` (this file replaces the round-1 version at the same path).
3. Open a PR into `staging` and merge it.
4. Then write `Release Review` = `https://github.com/mavismon/horizon-design-system/blob/<SHA of the commit containing the report>/reports/Table/release-review.md` and `Release Verdict` = `Cleared`, together. The report cites reviewed SHA `3ad37ea`, which stays correct for a commit on top of it.

`Cleared` is not permission to publish. A human still updates `VERSIONING.md` and `CHANGELOG.md`, bumps `package.json` and tags the release.
