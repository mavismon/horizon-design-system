# QA Report - Table

Source: [Figma node 251:168](https://www.figma.com/design/dIHHqSq8c75n4olME0s9JS/Core-Component?node-id=251-168) (table 250:92, usage 251:353)
Tested: staging Storybook `https://horizon-design-system-cdfi-git-build-table-mavis17.vercel.app`, build/table @ `e13f7ae`, light theme, 1400x900.
Method: expectations from Figma via get_design_context (not the story file). Browser measurements were taken by the orchestrating session (qa has no browser); real mouse for hover, real clicks for sort/select/pagination, real Tab for focus.

## Summary: PASS (0 failures), with caveats

24 `Staging Testing` rows written, 24 Passed, 0 Failed (20 in the first pass, 4 in a follow-up with additional measurements; the earlier partial checkbox row was kept, superseded by a new row). Passed rows with notes are listed below. Dark theme could NOT be verified (see note 5), so there is no dark pass.

Font check: same string at 40px, Inter 502.6px vs bogus family 448.9px; Inter is loaded.

## Matrix

| Case | Expected (Figma) | Measured | Result |
|---|---|---|---|
| ShowFooter=true | container elevated bg, 1px border-subtle, radius xs | 1172x340, matches | Pass |
| ShowFooter=false | no footer | 0 footer, 0 nav, 286h | Pass (expectation from showFooter prop) |
| Header row | 44h, bg-surface, 11/16 Medium text-secondary, 10px sort icon | all match | Pass |
| Row default / hover / selected | 48h; elevated / bg-surface / primary-light | match (hover via real mouse, selected via real click) | Pass |
| Primary / text / action cell | 12/18, Medium+text-primary / Regular+text-secondary / Medium+text-link | match | Pass |
| Checkbox cell | 16x16, 48w cell | size and checked state match | Pass |
| Checkbox box | 16px, bg-elevated, 1px border-strong, radius xs | 16px, rgb(249,250,251), 1px rgb(200,210,221), 2px | Pass |
| LongText truncation | ellipsis, nowrap, overflow hidden | clipped on 236/148/148px cells, short cell not clipped | Pass |
| Tab order | not drawn | 4 stops (select all, Season sort, row checkbox, Edit), 2px text-link outline each | Pass with note 2 |
| Dark theme | n/a | tokens identical under prefers-color-scheme: dark | Not verifiable (note 5) |
| Tag success | 3px 8px, 2px radius, 11/16, success-bg / success | match | Pass |
| Tag neutral / error | Figma gives semantics only (251:369) | geometry match; colours consistent with status tokens | Pass (no pixel spec in Figma) |
| Tag warning / info | not drawn in Figma Table frame | geometry match | Pass (see note 1) |
| Footer summary | 8/16 padding, 54h, 12/18 text-secondary, no border | match | Pass |
| Previous / Next | 80w, padding 10, 1px neutral-default border, radius sm, 10/16 text-primary | 80x38, match | Pass |
| Column widths | 48/268/180/180/180/140/176 | match | Pass |
| Sort asc/desc | one sort icon | cycles asc/desc | Pass with note 2 |
| Keyboard focus | not drawn | 2px text-link outline on first Tab stop | Pass with note 2 |
| Disabled Previous/Next | not drawn | works, text-disabled | Pass with note 2 |

## Notes (not failures)

1. Warning tag: text rgb(242,169,39) on bg rgb(255,249,232) is about 2:1 contrast, below WCAG AA for 11px text. Figma Table frame doesn't define warning or info tones, so no node to cite; needs a designer/token-owner call on the `color-status-warning` text colour. Engineer flagged it as design choice.
2. Added by engineer, not in Figma: descending sort arrow, focus ring, disabled Previous/Next. Designer should confirm. Disabled buttons use transparent bg although `color-state-disabled-bg` exists; confirm intent.
3. Size token gap (low severity, design-system): 44/48px rows, column widths, 80px footer buttons and 3px tag padding are hardcoded px. All match Figma. Request size tokens; not a component defect.
4. Figma fallback hexes differ from live tokens; tokens used, values compared by token name.

5. Dark mode cannot be verified: with prefers-color-scheme: dark emulated, resolved tokens are identical to light and no data-theme attribute is set. Tokens don't switch under the OS dark scheme, so Table renders identically. A library-wide token fact, not a Table finding. No dark pass is claimed.

## Still not tested

BackOfficePage layout beside SideBar/Header; narrow viewport; keyboard focus ring on Previous/Next (tabbing stopped after 4 stops; their disabled/enabled behaviour was verified via real clicks); neutral/error/warning/info tag colours have no pixel spec in the Figma Table frame, so those rows pass on geometry and token consistency only; ShowFooter=false expectation comes from the showFooter prop; right-alignment and 8px gap of the pagination group not measured.
