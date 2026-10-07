# Table · release review

- **Reviewed SHA:** `e604ef37a6753691e569bdc98cd1a7a2ba5c0b6b` (`origin/main`, "Merge pull request #99 from mavismon/staging", 2026-10-07 12:17:28 +01:00). `main` == `origin/main`, working tree clean at the start. `src/components/Table/` at this SHA comes from the tested build `e13f7ae` (the board's `Commit`; QA tested `build/table @ e13f7ae`). The only commit touching the folder is `e13f7ae` itself.
- **Date:** 2026-10-07
- **Verdict:** **Blocked.** One gate fails: **G2 Tokens**. Every other gate and check passes (with warnings, listed separately).
- **Reviewer:** release agent, running `release-review` as a single-component review, not a release. No version bump, no tag, no publish, no npm publish. Every gate and check was run fresh at the reviewed SHA. No other component was reviewed. This report is **not committed** and `Release Review` / `Release Verdict` are **not written** (see "What is needed to land this").
- **Board row:** Table (`recpBEqFNwRnfR8vi`), read fresh: `Development` = `Completed`, `Design` = `Done`, `Production Storybook` = `https://horizon-design-system-cdfi.vercel.app/?path=/story/components-table--default`, `Commit` = `e13f7ae`, `Composes` = Checkbox, Link, Button, `Astro Link` empty, `Release Review` and `Release Verdict` empty, 24 staging test rows all `Passed`. `Last Modified` = 2026-10-07T11:18:47Z, which is **79 seconds after** the reviewed SHA's commit time (11:17:28Z). By the staleness rule that reads as stale. `src/components/Table/` did not change after `e13f7ae` (11:59 +01:00 is earlier), so the likeliest cause is the `Production Storybook` cell being set after the merge, not a code change. Not confirmable from the base (no field history). Reported so a human can confirm.

## Rulings

`decisions.md` was read in full at the reviewed SHA. **No ruling covers Table.** The rulings that touch the same kinds of literal are scoped to other components and their own "Not ruled" lines exclude other components, so none is stretched here:

| Ruling | Scope | Why it does not cover Table |
|---|---|---|
| 2026-09-28 Button values with no token | `Button.css` lines 5, 6, 25, 26, 19 | `10px`, `12px`, `2px` outline-offset in `Button.css` only. |
| 2026-10-04 Header sizes with no token | `Header.css`; includes `80px` `width` on `.hz-header .hz-header__button` (line 62) and `2px` `outline-offset` (line 137) | Same numbers as Table's `80px` and `2px`, but named for `.hz-header` selectors in `Header.css`. Not Table's. |
| 2026-10-07 Modal sizes with no token | `Modal.css`; includes `48px` `width` on `.hz-modal__handle` (line 80) and `10px` | Same number as Table's `48px` row height, different property, selector and file. |
| 2026-10-07 Card widths with no token, and the accepted tag offset | `Card.css` | Card's tag took the nearest tokens (4px / 8px) rather than Figma's 3px / 9px. That is a precedent for how Table's `3px` tag padding might be settled, not a ruling for it. |
| 2026-10-07 Form widths; Calendar column widths; SideBar sizes; Stepper, Checkbox, Chip, Toggle, ProgressBar, File, RadioCard, Avatar | their own components | Each says "these values in any other component" are not ruled. |
| 2026-09-28 npm token type (preflight) | `npm token list` shows exactly one token, id `8dd8a5`, labelled "Publish token" | Applies to preflight only. Quoted under Preflight. |

I did not write a ruling and did not treat any of the above as covering Table.

## Preflight

| Check | Result |
|---|---|
| Airtable connected, base matches config | Pass on the ID: `appMX8Y0q2sqx4v0a` read the `Components` table. **Open item:** `.claude/registry.local.json` has no `baseName`, so the base's name could not be compared, only its ID. |
| Working tree clean, on `main`, level with `origin/main` | Pass: `main`, `e604ef37…` == `origin/main` after `git fetch`, `git status` clean. |
| `README.md` names the package and install command | Pass: `README.md:5-8` "Install", `npm install @layerbasesystemic/horizon-design-system react react-dom`. |
| npm auth | `npm whoami` = `hsuyeemon`. `npm token list` shows exactly one token, id `8dd8a5`, labelled "Publish token". **Passes only by ruling:** `decisions.md` "2026-09-28 · npm token type in release preflight": "If `npm token list` shows exactly one token, id `8dd8a5`, labelled 'Publish token', treat the granular-token check as passed." That ruling expires 2026-12-26; today is 2026-10-07. The token value was not read or handled. |

## Gates

| # | Gate | Result | Evidence |
|---|---|---|---|
| G1 | Done | Pass | `Development` reads `Completed`. `Production Storybook` returns HTTP 200 (`curl`). No browser was available to this review, so "opens the component's stories" rests on the 200 and on the orchestrator's stated render check, not on my own render. |
| G2 | Tokens | **FAIL** | Raw px literals in `Table.css` and `Table.tsx`, none covered by a ruling. Full list below. |
| G3 | Surface | Pass | `src/index.ts:58-71` exports `Table` and the types `TableProps`, `TableColumn`, `TableRowData`, `TableCellType`, `TableCellValue`, `TableTag`, `TableAction`, `TableTone`, `TableRowState`, `TableSort`, `TableSortDirection`. All eleven are used in `TableProps` or the rows and columns it takes, so none is a stray export. `DEFAULT_COLUMNS` and `DEFAULT_ROWS` are exported from `Table.tsx` for the stories but not from `src/index.ts`. Nothing says Table was meant to stay internal. |
| G4 | Names | Pass | Folder `src/components/Table/`, symbol `Table`, class prefix `hz-table` (case and `hz-` only), intent `Table.intent.json`, board row `Table`. |
| G5 | States | Pass | Figma `251:168` (read fresh, metadata): table `250:92`; `_table-row` `250:91` has `state=header`, `default`, `hover`, `selected`; `_table-cell` `248:36` has `type=header`, `primary`, `text`, `tag`, `action`, `checkbox`; `tag` `248:18` has `tone=success`, `neutral`, `error`, `warning`, `info`. Code: `TableRowState = "default" \| "hover"` plus `selected` (`Table.tsx:13`, `:46`); `TableCellType` (`:11`); `TableTone` (`:9`); `showFooter` and `selectable`. Stories: `Default`, `WithoutFooter`, `WithoutCheckboxColumn`, `HoverAndSelected`, `TagTones` (all five tones), `SortedAscending`, `LongText`, `PreviousDisabled`, `NextDisabled`, `Interactive`, `BackOfficePage`. Every published state has a story. The descending sort arrow and disabled Previous / Next are not in Figma; disabled has stories, **descending has none** (warning 6). |
| G6 | Intent | Pass, with warnings | `Table.intent.json` exists at the reviewed SHA and passes the six checks below. Warnings under C2, C3 and "Intent file". |
| G7 | Version | Pass, with a standing note | `VERSIONING.md` exists and says what `0.x` and each later bump commit consumers to. Its "Unreleased on `main`" section (and `CHANGELOG.md`) name Card, Calendar, Modal, Form and Textfield but **not Table or SideBar**. Same treatment as the SideBar review: a standing note, not a block. A human updates `VERSIONING.md` (and the changelog) before a version carrying Table ships. Not edited here. |

### G2 detail

`Table.css` read in full (194 lines), then grepped for hex, `rgb`, `hsl`, `px`, `rem`, `em`, `%`, and any `var()` fallback. No hex, no `rgb`/`hsl`, no rem or em, no `var()` fallbacks. Every colour, font, radius, border width and spacing declaration reads a token. The literals:

| # | Value | File:line | Property and selector | Source / note | Covered by a ruling |
|---|---|---|---|---|---|
| 1 | `48px` | `Table.css:47` | `height`, `.hz-table__cell` (body row) | Figma `_table-row`, 250:91 | No |
| 2 | `44px` | `Table.css:59` | `height`, `.hz-table__cell--header` | Figma header row, 250:5 | No |
| 3 | `10px` | `Table.css:98` | `width`, `.hz-table__sort-icon` | Figma sort arrow | No |
| 4 | `10px` | `Table.css:99` | `height`, `.hz-table__sort-icon` | Figma sort arrow | No |
| 5 | `3px` | `Table.css:115` | `padding` (block), `.hz-table__tag` | Figma tag 248:18 (22px high). `--spacing-xs` is 4px; `3px` has no token. Card took 4px here instead. | No |
| 6 | `80px` | `Table.css:178` | `width`, `.hz-table .hz-table__page-button` | Figma footer Previous / Next | No (Header's 80px ruling is for `Header.css:62` only) |
| 7 | `2px` | `Table.css:193` | `outline-offset`, `.hz-table .hz-checkbox__input:focus-visible, .hz-table .hz-table__sort:focus-visible, .hz-table .hz-table__action:focus-visible` | Engineer-added focus ring, not in Figma. **Not on the engineer's or QA's lists.** Button, Header and Stepper each needed a ruling for the same `2px` `outline-offset`. | No |
| 8 | `48` | `Table.tsx:90` | `CHECKBOX_WIDTH`, applied as `<col style={{ width }}>` at `:255` (inline px) | Figma checkbox cell 248:32 | No |
| 9 | `268` | `Table.tsx:85` | `DEFAULT_WIDTH.primary`, applied at `:257` | Figma primary column | No |
| 10 | `180` | `Table.tsx:86` | `DEFAULT_WIDTH.text` (three text columns), applied at `:257` | Figma text column | No |
| 11 | `140` | `Table.tsx:87` | `DEFAULT_WIDTH.tag`, applied at `:257` | Figma tag column | No |
| 12 | `176` | `Table.tsx:88` | `DEFAULT_WIDTH.action`, applied at `:257` | Figma action column | No |

Not counted as findings: `width: 100%` (`Table.css:8`, `:21`, responsive limits), unitless `font-weight` 400 / 500, the SVG `viewBox="0 0 10 10"` and path coordinates in `SortIcon` (`Table.tsx:202-206`, drawing geometry, not a style value), and the comments at lines 1-5. Items 8 to 12 are in `Table.tsx`, not the stylesheet, but they are fixed px widths set through inline `style`, so the gate's question ("any raw px?") catches them. The engineer's and QA's lists include them (column widths 48 / 268 / 180 / 180 / 180 / 140 / 176) and omit item 7.

Do tokens exist for any of these? `build/css/tokens.css` (built at the reviewed SHA) has no size tokens and no 44 / 48 / 80 / 3 / 10 spacing: `--spacing-xs` is 4px and `--border-width-md` is 2px. `outline-offset` (item 7) could not use `--border-width-md` by value without being a hack. So no literal here can be removed with an existing token **except** that the `3px` could follow Card's precedent (nearest tokens, 4px, at the cost of a 24px tag instead of Figma's 22px), which is a design call, not mine.

**Who owns the fix.** Not one owner:
1. **A human** writes a `decisions.md` ruling if the literals are to be accepted until size tokens exist (as for Card, Modal, Form, SideBar). It must cover exactly the 12 rows above, including item 7, which nobody listed. I did not write one and will not.
2. **The designer** adds size tokens (row heights 44 / 48, icon 10, button width 80, column widths, tag padding 3), after which the ruling no longer applies and the **engineer** swaps to tokens.
3. Alternatively the **engineer** changes the component (for example the tag to `--spacing-xs`), then redeploy, then re-review. Never edited in this run.

## Checks

| # | Check | Result | Evidence |
|---|---|---|---|
| C1 | Fields present | Pass | All seven fields present with the right types: `use_when` 3 strings, `dont_use_when` 3 objects, `variant_intent` 5 keys, `placement` 1 string, `pairs_with` 2, `required_tokens` 28, `a11y` 7 objects. Nothing empty. |
| C2 | `dont_use_when` names an alternative | **Warning** | Entry 1 names `Card`. Entry 2 ("For two or three facts about one thing, such as in a dialog: use detail rows.") has `instead: ""`. Entry 3 ("Put long text or paragraphs in a cell: link to a detail page instead.") has `instead: ""`. Two warnings, never a block. |
| C3 | `a11y` specific | Pass, with a note | All seven sources exist at the reviewed SHA and each fact is a concrete element or attribute. `Table.tsx:253` `<table aria-label={tableLabel}>`; `:277` `<th scope="col"`; `:279` `aria-sort`; `:266` `aria-label="Select all rows"` (row labels at `:319`); `:353` `<nav ... aria-label="Pagination">`; `:350` `aria-live="polite"`; `Table.css:189-193` the `:focus-visible` outline. Note: three facts bundle a second claim whose line is not the cited one: `<th scope="row">` is at `:329-331`, not `:277`; the `Link` action cells are at `:181`, not `:353`; the `<button>` sort control is at `:282`, `aria-hidden` on the arrow at `:203`. Each claim is true and implemented, but the cited line carries only the first half. Not a block; owner `component-intent`. |
| C4 | `required_tokens` resolve | Pass | `npm run build:tokens` at the reviewed SHA, exit 0, `git status` clean afterwards. All 28 listed tokens are defined in `build/css/tokens.css`. Scripted comparison of every `var(--…)` in `Table.css` against the list: nothing read and unlisted, nothing listed and unused. |
| C5 | Variants covered | Pass | `variant_intent` keys are `success`, `neutral`, `error`, `warning`, `info`, exactly the values of `TableTone` (`Table.tsx:9`): none missing, none extra. |
| C6 | No two components claim the same job | Pass | No `use_when` line is identical to any in the other 22 intent files (scripted exact match, 0 duplicates). Nearest by topic: `Card` type stat ("Use type stat in the back office for one key number … a row of 3 to 5 tiles"), a different job. `Card`, `Calendar` and `ProgressBar` each name `Table` in their own `dont_use_when` (`instead: "Table"`), which points to Table, not at a rival. |

## Failures

1. **G2 Tokens.** 12 raw px literals (list above): `Table.css` lines 47, 59, 98, 99, 115, 178, 193 and `Table.tsx` lines 85-88, 90. No ruling in `decisions.md` covers Table. Owner: a human (ruling) or the designer (tokens) then the engineer; see above.

## Warnings

Listed separately from failures. None blocks.

1. **Warning tag contrast about 2:1.** QA note 1: text `rgb(242,169,39)` on `rgb(255,249,232)` (`--color-status-warning` on `--color-status-warning-bg`, `Table.css:138-141`) is about 2:1 for 11px text, below WCAG AA (4.5:1). The Figma Table frame defines no warning or info tag, so there is no node to cite. Not a gate in this skill, and no ruling covers it. Owner: the designer or token owner, on the `--color-status-warning` text colour; the colour is a library token, so a change would touch other components.
2. **Added by the engineer, not in Figma** (QA note 2): descending sort arrow, keyboard focus ring, disabled Previous / Next. The disabled buttons use a transparent background although `--color-state-disabled-bg` exists. The designer should confirm all three. The focus ring's `2px` `outline-offset` is a G2 failure (item 7).
3. **Neutral, error, warning and info tag colours have no pixel spec** in the Figma Table frame; QA passed them on geometry and token consistency only.
4. **Dark theme not verified** (QA note 5): tokens do not switch under `prefers-color-scheme: dark`, so Table renders identically. A library-wide fact, not a Table finding. No dark pass is claimed.
5. **Intent file coverage (C2, C3).** `pairs_with` lists SideBar and Header, supported by the `BackOfficePage` story. `dont_use_when` entries 2 and 3 have no named alternative; Figma's Usage frame (251:353) gives none. Owner: `component-intent`. Not edited here.
6. **No story for descending sort.** `SortedAscending` exists; the descending state (engineer-added) is reachable only through `Interactive`. Owner: engineer, if wanted.
7. **Staleness question.** `Last Modified` is 79 seconds after the reviewed commit (see Board row). No code change since `e13f7ae`. A human can confirm it was the `Production Storybook` cell.
8. **G7 standing note.** `VERSIONING.md` "Unreleased on main" and `CHANGELOG.md` do not name Table (or SideBar). If Table ships, it is a pure addition, so a patch on 0.x per the table in `VERSIONING.md`. A human updates both files.
9. **Open items in the release process, not Table findings.** `registry.local.json` has no `baseName`. `Astro Link` is empty for Table, so the docs page could not be read first (step 2); the docs gate is circular today because `doc-generator` writes `Astro Link` only for `Cleared` components. Source and Storybook were used instead.

## Not checked

- No browser and no real input: G1 is evidenced by HTTP 200, not a render by me. Tab order, focus ring on screen, real hover, screen-reader output and dark theme were not exercised here. QA's own "Still not tested" also stands: BackOfficePage layout beside SideBar / Header, narrow viewport, keyboard focus ring on Previous / Next, right-alignment and 8px gap of the pagination group.
- Whether any Table token value changed since QA (QA compared by token name, "Figma fallback hexes differ from live tokens").

## What is needed to land this report

Nothing was branched, committed, pushed or opened. Following the SideBar precedent: branch `release-review/table` from `origin/main`, commit `reports/Table/release-review.md`, open a PR into `staging`, merge it, then write `Release Review` (the report's URL at the commit that contains it) and `Release Verdict` = `Blocked` together. The report cites reviewed SHA `e604ef3`, which stays correct for a report committed on top of it.
