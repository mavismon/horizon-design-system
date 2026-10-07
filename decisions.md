# Decisions

Rulings on findings that aren't defects. Only a human writes here. Each ruling says what it means for an agent that hits it, and what it doesn't cover. An agent never stretches a ruling past its "Not ruled" line, and never writes one itself.

## 2026-09-28 · npm token type in release preflight

**Finding.** The release agent's preflight halts when `npm token list` shows a "Publish token". npm 10.9.2 labels every token that isn't read-only as "Publish token", granular ones included (`lib/commands/token.js`, line 74), so that output can't show a token's type.

**Ruling.** The user checked on npmjs.com that the token named **Horizon** (`npm_yppt…QEPB`, id `8dd8a5`, created 2026-09-27, expires 2026-12-26) is a granular access token. It has read and write access to all packages and to the `layerbasesystemic` organization.

**For an agent that hits it.** If `npm token list` shows exactly one token, id `8dd8a5`, labelled "Publish token", treat the granular-token check as passed and quote this ruling in the report.

**Not ruled.** Any other token id. More than one token in the list. This token after 2026-12-26. Whether the token's permissions are enough for a given publish. Each of those needs the user to check again.

## 2026-09-28 · Button values with no token

**Finding.** Release review gate 2 (Tokens) failed Button for literal px values. After removing every `var()` fallback and moving borders and the focus outline width to `--border-width-*`, four Figma values remain that no token matches: the spacing scale has 8px and 12px but no 10px, there are no size tokens, and no spacing token is 2px.

**Ruling.** These literals in `src/components/Button/Button.css` are accepted, because they're what the Figma node specifies (node 19:31), until the designer adds matching tokens:

| Value | Property | Lines |
|---|---|---|
| `10px` | `gap`, `padding` on `.hz-button` | 5, 6 |
| `12px` | `width`, `height` on `.hz-button__icon` | 25, 26 |
| `2px` | `outline-offset` on `.hz-button:focus-visible` | 19 |

**For an agent that hits it.** Gate 2 passes for exactly these values on exactly these properties in `Button.css`. Quote this ruling in the report. When a token with the same value appears (for example a 10px spacing token), the ruling no longer covers that value: use the token.

**Not ruled.** Any other literal value, including a `var()` fallback. These values in any other component. A change to these values: a different number needs a new ruling or a token.

## 2026-09-28 · Publishing keeps 2FA

**Finding.** The Horizon token has "Bypass two-factor authentication" turned off, and the account has 2FA enabled, so `npm publish` asks for a one-time code. An agent can't type one.

**Ruling.** Keep 2FA on. The user runs the real publish.

**For an agent that hits it.** At step 9, the release agent runs `npm run release:publish -- <version> --dry-run`, reads the file list, then **stops**. It hands the user the exact command, `npm run release:publish -- <version>`, to run in their own terminal. After the user says it's published, the agent carries on from step 9's registry check (wait for npm, smoke-test the registry copy) and step 10.

**Not ruled.** Turning on Bypass 2FA, or creating a token that does. Running the real publish from an agent in any other way. Whether the version is approved: that's still step 8.

## 2026-10-01 · Avatar diameters with no token

**Finding.** Release review gate 2 (Tokens) failed Avatar for literal px values. The three diameters in Figma node 113:2 (sm 24px, md 30px, lg 40px) are not bound to any variable, and no avatar size token exists. The nearest values are `--spacing-2xl` (24px), a spacing token, and `--lineheight-4xl` (40px), a line-height token. Neither is a size, and nothing matches 30px.

**Ruling.** These literals in `src/components/Avatar/Avatar.css` are accepted, because they're what the Figma node specifies (node 113:2, component 112:9), until the designer adds avatar size tokens:

| Value | Property | Lines |
|---|---|---|
| `24px` | `width`, `height` on `.hz-avatar--sm` | 13, 14 |
| `30px` | `width`, `height` on `.hz-avatar--md` | 18, 19 |
| `40px` | `width`, `height` on `.hz-avatar--lg` | 23, 24 |

**For an agent that hits it.** Gate 2 passes for exactly these values on exactly these properties in `Avatar.css`. Quote this ruling in the report. When an avatar size token appears, the ruling no longer covers that value: use the token.

**Not ruled.** Any other literal value, including a `var()` fallback. These values in any other component. A change to these values: a different number needs a new ruling or a token. The missing photo fallback and the empty `use_when` / `dont_use_when` in `Avatar.intent.json`: those are Figma gaps for the designer.

## 2026-10-01 · Checkbox values with no token

**Finding.** Release review gate 2 (Tokens) will fail Checkbox for literal px values. Two Figma values (node 117:12 `state=unchecked`, node 117:15 `state=checked`, component set 117:23) have no matching token: the spacing scale has 4, 8, 12, 16, 20 and 24px but no 10px, and there are no size tokens. `--spacing-lg` is 16px, but it is a spacing token and Figma binds nothing to it, so it is not used for the box size.

**Ruling.** These literals in `src/components/Checkbox/Checkbox.css` are accepted, because they're what the Figma node specifies, until the designer adds matching tokens:

| Value | Property | Selector | Lines |
|---|---|---|---|
| `10px` | `gap` between the box and the label | `.hz-checkbox` | 4 |
| `16px` | `width`, `height` on the box | `.hz-checkbox__box` | 11, 12 |

**For an agent that hits it.** Gate 2 passes for exactly these values on exactly these properties in `Checkbox.css`. Quote this ruling in the report. When a 10px spacing token or a checkbox size token appears, the ruling no longer covers that value: use the token.

**Not ruled.** Any other literal value, including a `var()` fallback. These values in any other component. A change to these values: a different number needs a new ruling or a token. The Button ruling of 2026-09-28 is separate and still covers only `Button.css`. The `error` state and any states Figma does not draw (disabled, hover, focus, indeterminate): those need the designer.

## 2026-10-01 · Chip height with no token

**Finding.** Release review gate 2 (Tokens) will fail Chip for a literal px value. Figma (node 121:8, 121:11, 121:13; component set 121:15) draws every Chip 32px high, and the spacing scale (4, 8, 12, 16, 20, 24px) and the token set have nothing that matches 32px: there are no size tokens. Figma gets to 32px with 7px of vertical padding around an 18px line and places the 1px stroke inside the frame. In CSS that would give 34px, so the height is set directly instead of with a 7px padding.

**Ruling.** This literal in `src/components/Chip/Chip.css` is accepted, because it is what the Figma node specifies, until the designer adds a matching size token:

| Value | Property | Selector | Lines |
|---|---|---|---|
| `32px` | `height` (with `box-sizing: border-box`) | `.hz-chip` | 6 |

**For an agent that hits it.** Gate 2 passes for exactly this value on exactly this property in `Chip.css`. Quote this ruling in the report. When a size token for 32px appears, the ruling no longer covers it: use the token.

**Not ruled.** Any other literal value, including a `var()` fallback and any 7px padding. This value in any other component. A change to this value: a different number needs a new ruling or a token. The selected fill, which uses `--color-primary-default` (`#2b5ad6`) and differs from the `#3b71f2` Figma shows: that is the user's choice to use the bound token, not a gate finding. Any state Figma does not draw (hover, focus, disabled, pressed).

## 2026-10-02 · Logo wordmark colour with no token

**Finding.** Release review gate 2 (Tokens) will fail Logo for a literal hex value. The wordmark "Horizon Stays" in the lockup (node 137:11, variant 137:6, component set 137:17) is coloured `#2e7cc4`. Figma binds no variable to it, and no token matches: the blues in the token set are `#3b71f2`, `#2b5ad6`, `#1d44ba` and lighter steps, and none is `#2e7cc4`. The Figma description of the component says the brand colours are fixed on purpose and do not follow the UI tokens (mark `#3B82F6` with white, wordmark `#2e7cc4`). The mark's own colours live inside the SVG asset, not in the stylesheet.

**Ruling.** This literal in `src/components/Logo/Logo.css` is accepted, because it is the fixed brand colour the Figma node specifies, and it does not follow the UI tokens by design:

| Value | Property | Selector | Lines |
|---|---|---|---|
| `#2e7cc4` | `color` on the wordmark | `.hz-logo__wordmark` | 20 |

**For an agent that hits it.** Gate 2 passes for exactly this value on exactly this property in `Logo.css`. Quote this ruling in the report. If the designer later binds a token to the wordmark colour, or the brand colour is added to the token set, the ruling no longer covers it: use the token.

**Not ruled.** Any other literal value, including a `var()` fallback. This value in any other component. A change to this value: a different colour needs a new ruling or a token. The `font-weight: 600` hard-coded on line 18 is not a px or hex value and needs no ruling. The Logo has no dark-background version, and any recolouring of the mark or wordmark is outside this ruling.

## 2026-10-02 · ProgressBar track heights with no token

**Finding.** Release review gate 2 (Tokens) will fail ProgressBar for two literal px values. Figma draws the track 8px high for size md and 6px high for size sm (component set 140:66; md cells 140:5, 140:24, 140:38; sm cells 140:17, 140:31, 140:45). Figma binds no variable to either height, and no token matches: `--spacing-sm` is 8px but is a spacing token, `--radius-sm` is 6px but is a radius token, and there are no size tokens. The track has no content or image to take its size from, so no equivalent technique avoids the literals.

**Ruling.** These literals in `src/components/ProgressBar/ProgressBar.css` are accepted, because they are what the Figma node specifies, until the designer adds matching size tokens:

| Value | Property | Selector | Lines |
|---|---|---|---|
| `8px` | `height` (md track) | `.hz-progressbar__track` | 50 |
| `6px` | `height` (sm track) | `.hz-progressbar--sm .hz-progressbar__track` | 60 |

**For an agent that hits it.** Gate 2 passes for exactly these values on exactly these properties in `ProgressBar.css`. Quote this ruling in the report. When a size token for 8px or 6px appears, the ruling no longer covers that value: use the token.

**Not ruled.** Any other literal value, including a `var()` fallback. These values in any other component. A change to these values: a different number needs a new ruling or a token. The primary fill, which uses `--color-primary-default` (`#2b5ad6`) and differs from the `#3b71f2` Figma shows: that is the user's choice to use the bound token, not a gate finding. The `font-weight` values 400 and 600, which are unitless numbers and need no ruling. The `inverse` tone, which is not built because Figma draws its track and fill the same colour: that needs the designer. Any state Figma does not draw.

## 2026-10-02 · ProgressBar inverse tone not built

**Finding.** Release review gate 5 (States) failed ProgressBar because the Figma component set `progressbar` (140:66) publishes eight cells, size md/sm × tone primary/success/neutral/inverse, and the code builds six. The two `tone=inverse` cells (140:52 for md, 140:59 for sm) have no story and the `ProgressBarTone` union has no `inverse` member. Figma draws the inverse cells with the track and the fill in the same colour, `--color-text-inverse` (`#f9fafb`), so a built inverse bar would show a solid pill with no visible fill and its value could not be read. Figma gives no darker track colour or opacity, and no agent may invent one.

**Ruling.** Gate 5 passes for the missing `inverse` tone, and for that tone only, until the designer gives the inverse track a colour distinct from its fill and the tone is built. The user decided to build only the three working tones (primary, success, neutral). No story is drawn for the inverse tone, and the tone union does not include it.

**For an agent that hits it.** Gate 5 passes for exactly the cells 140:52 and 140:59 being unbuilt. Quote this ruling in the report. When the designer fixes the inverse colours, this ruling no longer applies: the tone must be built, and the review run again. The Usage line 140:204 ("Use tone inverse on navy backgrounds, such as a sold-out night in the calendar") is copied verbatim from Figma into the intent file and recommends this unbuilt tone: report it as a docs and designer gap, not a gate finding.

**Not ruled.** Any other published Figma variant or state that is not built. Any change to the six built cells. The two literals ruled in "ProgressBar track heights with no token". Whether Figma's Usage line about the inverse tone should be removed or reworded: that is for the designer.

## 2026-10-02 · Toggle track heights and disabled alpha with no token

**Finding.** Release review gate 2 (Tokens) will fail Toggle for three literal values. Figma draws the switch track 24px high for size md and 22px high for size sm (component set 144:20; md cells 144:4, 144:8, 144:12, 144:16; sm cells 144:6, 144:10, 144:14, 144:18), and the disabled-on track as the primary colour at 40% alpha (cells 144:16 and 144:18). Figma binds no variable to any of them. No token matches: `--spacing-2xl` is 24px but is a spacing token, and nothing is 22px; there are no size tokens and no opacity or alpha tokens. The track widths (44px and 40px), the knob diameters (20px and 18px) and the 2px knob inset are not literals in the stylesheet: the width comes from a unitless `aspect-ratio`, the knob fills the track height, and the inset is a `var(--border-width-md)` border.

**Ruling.** These literals in `src/components/Toggle/Toggle.css` are accepted, because they are what the Figma node specifies, until the designer adds matching size and opacity tokens:

| Value | Property | Selector | Lines |
|---|---|---|---|
| `24px` | `height` (md track) | the md switch track | 16 |
| `22px` | `height` (sm track) | the sm switch track | 21 |
| `40%` | alpha in `color-mix(in srgb, var(--color-primary-default) 40%, transparent)` (disabled-on track only) | the disabled and checked switch track | 45 |

**For an agent that hits it.** Gate 2 passes for exactly these three values on exactly these properties in `Toggle.css`. Quote this ruling in the report. When a size token for 24px or 22px, or an opacity token for 40%, appears, the ruling no longer covers that value: use the token.

**Not ruled.** Any other literal value, including a `var()` fallback. These values in any other component. A change to these values: a different number needs a new ruling or a token. The on track, which uses `--color-primary-default` (`#2b5ad6`) and differs from the `#3b71f2` Figma shows: that is the user's choice to use the bound token, not a gate finding. The low contrast of the off track and of the knob on the disabled-off track as Figma draws them, which the user chose to build as drawn: that needs the designer. Any state Figma does not draw (hover, pressed, error, loading).

## 2026-10-04 · File thumbnail size with no token

**Finding.** Release review gate 2 (Tokens) will fail File for two literal px values. Figma (component set 204:41, item cells 204:12, 204:19, 204:34) draws the file-type thumbnail 32px wide and 32px high, and the spacing scale (4, 8, 12, 16, 20, 24px) and the token set have nothing that matches 32px: there are no size tokens. The thumbnail holds a short type label, not an image, so no intrinsic size can supply the number.

**Ruling.** These literals in `src/components/File/File.css` are accepted, because they are what the Figma node specifies, until the designer adds a matching size token:

| Value | Property | Selector | Lines |
|---|---|---|---|
| `32px` | `width` (thumbnail) | `.hz-file__thumbnail` | 95 |
| `32px` | `height` (thumbnail) | `.hz-file__thumbnail` | 96 |

**For an agent that hits it.** Gate 2 passes for exactly these values on exactly these properties in `File.css`. Quote this ruling in the report. When a size token for 32px appears, the ruling no longer covers it: use the token.

**Not ruled.** Any other literal value, including a `var()` fallback. These values in any other component. A change to these values: a different number needs a new ruling or a token. The `disabled` prop's `0.6` opacity, which Figma does not draw: it is unitless, and whether it should exist is for the designer. The primary and error colours, which use bound tokens (`#2b5ad6`, `#d02727`) and differ from the `#3b71f2` and `#ea3d3d` Figma shows: that is accepted pipeline drift, not a gate finding. Any state Figma does not draw.


## 2026-10-04 · RadioCard radio and dot sizes with no token

**Finding.** Release review gate 2 (Tokens) failed RadioCard for four literal px values. Figma (component set 212:21; radio 212:3, 212:9, 212:16; dot 212:10) draws the radio circle 18px wide and 18px high and the selected dot 8px wide and 8px high, and binds no variable to either. There are no size tokens. 18px exists only as `--fontsize-2xl` and `--lineheight-md`, which are typography. 8px is `--spacing-sm`, but it is a spacing token and a dot diameter is a size, so it is not used.

**Ruling.** These literals in `src/components/RadioCard/RadioCard.css` are accepted, because they are what the Figma node specifies, until the designer adds matching size tokens:

| Value | Property | Selector | Lines |
|---|---|---|---|
| `18px` | `width` | `.hz-radiocard__radio` | 47 |
| `18px` | `height` | `.hz-radiocard__radio` | 48 |
| `8px` | `width` | `.hz-radiocard--selected .hz-radiocard__radio::after` | 60 |
| `8px` | `height` | `.hz-radiocard--selected .hz-radiocard__radio::after` | 61 |

**For an agent that hits it.** Gate 2 passes for exactly these values on exactly these properties in `RadioCard.css`. Quote this ruling in the report. When a size token for 18px or 8px appears, the ruling no longer covers it: use the token.

**Not ruled.** Any other literal value, including a `var()` fallback. These values in any other component. A change to these values: a different number needs a new ruling or a token. The selected colour, which uses `--color-primary-default` (`#2b5ad6`) and differs from the `#3b71f2` Figma shows: that is accepted pipeline drift, not a gate finding. The 76px card height against Figma's 74px (stroke counted outside the frame). Any state Figma does not draw (hover, pressed).

## 2026-10-04 · Header sizes with no token

**Finding.** Release review gate 2 (Tokens) will fail Header for literal px values. Figma draws the three header bars at fixed heights (component set 208:43: web 208:7 is 64px high, app 208:29 is 52px, backoffice 208:36 is 56px), a 72px column on each side of the app title, a nested web Button 80px wide, a nested backoffice Search field 260px wide, and a 20px back icon. The spacing scale (4, 8, 12, 16, 20, 24px) and the token set have nothing that matches 64, 56, 52, 72, 80 or 260, and there are no size tokens. The bars use `box-sizing: border-box`, so the 1px bottom border sits inside the drawn height as in Figma. The 20px back icon equals `--spacing-xl`, but that is a spacing token, not an icon size.

**Ruling.** These literals in `src/components/Header/Header.css` are accepted, because they are what the Figma nodes specify, until the designer adds matching size tokens:

| Value | Property | Selector | Lines |
|---|---|---|---|
| `64px` | `height` (web bar) | `.hz-header--web` | 16 |
| `56px` | `height` (backoffice bar) | `.hz-header--backoffice` | 21 |
| `52px` | `height` (app bar) | `.hz-header--app` | 26 |
| `80px` | `width` (nested web Button) | `.hz-header .hz-header__button` | 62 |
| `260px` | `width` (nested backoffice Search field) | `.hz-header .hz-header__search` | 66 |
| `72px` | `width` (app side column) | `.hz-header__side` | 74 |
| `20px` | `width`, `height` (back icon) | `.hz-header__back-icon` | 94, 95 |
| `2px` | `outline-offset` (keyboard focus ring on the back and action buttons) | `.hz-header__back:focus-visible, .hz-header__action:focus-visible` | 137 |

The `2px` focus offset is not drawn in Figma: the engineer added the keyboard focus ring, which Figma does not specify. It is accepted at the value `--border-width-md` resolves to, until the value is bound to that token. A fix that swaps it for the token (commit `7f1a9f2` on `build/header-focus-token`) was made but not shipped, so the literal remains on `main`.

**For an agent that hits it.** Gate 2 passes for exactly these values on exactly these properties in `Header.css`. Quote this ruling in the report. When a size token for any of these values appears, the ruling no longer covers that value: use the token.

**Not ruled.** Any other literal value, including a `var()` fallback. These values in any other component. A change to these values: a different number needs a new ruling or a token. The font weights 400, 500 and 600, which are unitless numbers and need no ruling. The widths 1280, 390 and 1220 that Figma draws for the bars: the code sets the bar width to 100% and only the story decorators apply them. The primary colour, which uses `--color-primary-default` (`#2b5ad6`) and differs from the `#3b71f2` Figma shows: that is accepted pipeline drift, not a gate finding. Any state Figma does not draw.


## 2026-10-05 · Stepper sizes with no token

**Finding.** Release review gate 2 (Tokens) will fail Stepper for literal px values. Figma (component set 215:73, step part 215:15) draws the step circle 20px, the tick 12px, the connector line 32px wide, the counter buttons 28px square, the counter icons 14px, the value column 20px wide and the quantity row 280px wide, and binds no variable to any of them. There are no size tokens, and the nearest spacing-scale values are spacing tokens, not sizes.

**Ruling.** These literals in `src/components/Stepper/Stepper.css` are accepted, because they are what the Figma node specifies, until the designer adds matching size tokens:

| Value | Property | Selector | Lines |
|---|---|---|---|
| `20px` | `width`, `height` | `.hz-stepper__circle` | 53, 54 |
| `12px` | `width`, `height` | `.hz-stepper__tick` | 66, 67 |
| `32px` | `width` | `.hz-stepper__connector` | 83 |
| `280px` | `width` | `.hz-stepper--quantity` | 97 |
| `28px` | `width`, `height` | `.hz-stepper__button` | 118, 119 |
| `14px` | `width`, `height` | `.hz-stepper__icon` | 138, 139 |
| `20px` | `width` | `.hz-stepper__value` | 143 |
| `2px` | `outline-offset` | `.hz-stepper__button:focus-visible` | 44 |

**For an agent that hits it.** Gate 2 passes for exactly these values on exactly these properties in `Stepper.css`. Quote this ruling in the report. When a size token with the same value appears, the ruling no longer covers it: use the token.

**Not ruled.** Any other literal value, including a `var()` fallback. These values in any other component. A change to these values: a different number needs a new ruling or a token. The selected colour, which uses `--color-primary-default` (`#2b5ad6`) and differs from the `#3b71f2` Figma shows: that is accepted pipeline drift, not a gate finding. The inline SVG tick and plus/minus icons, which approximate Figma's image assets. Any state Figma does not draw (hover, pressed).

## 2026-10-05 · Calendar column widths with no token

**Finding.** Release review gate 2 (Tokens) will fail Calendar for two literal px values. Figma (component set 235:392; picker cell 235:2, occupancy cell 235:137) draws the picker day columns 64px wide (a 536px picker is 20px padding, seven 64px columns and six 8px gaps) and the occupancy day columns 158px wide (a 1170px grid is 16px padding, seven 158px columns and six 8px gaps). The spacing scale (4, 8, 12, 16, 20, 24px) and the token set have nothing that matches 64 or 158, and there are no size tokens. The grid columns have no content or intrinsic size that could supply the number, so no equivalent technique avoids the literals. The day and occupancy-day heights do not need literals: they are derived from the column width with `aspect-ratio` (8/5 and 158/90), and the 28px navigation button is `2em` of the 14px font.

**Ruling.** These literals in `src/components/Calendar/Calendar.css` are accepted, because they are what the Figma nodes specify, until the designer adds matching size tokens:

| Value | Property | Selector | Lines |
|---|---|---|---|
| `64px` | `grid-template-columns` (picker weekday and week rows, seven columns) | `.hz-calendar--picker .hz-calendar__weekdays, .hz-calendar--picker .hz-calendar__week` | 68 |
| `158px` | `grid-template-columns` (occupancy weekday and week rows, seven columns) | `.hz-calendar--occupancy .hz-calendar__weekdays, .hz-calendar--occupancy .hz-calendar__week` | 187 |

**For an agent that hits it.** Gate 2 passes for exactly these values on exactly these properties in `Calendar.css`. Quote this ruling in the report. When a size token for 64px or 158px appears, the ruling no longer covers that value: use the token.

**Not ruled.** Any other literal value, including a `var()` fallback. These values in any other component. A change to these values: a different number needs a new ruling or a token. The `aspect-ratio` values 8/5 and 158/90, the `2em` navigation button, the `1em` icon, and the calc over spacing tokens for the "over" tag padding: none is a px literal, so they need no ruling, and whether they should be tokens is for the designer. The font weights 400, 500 and 600, which are unitless numbers. The primary colour, which uses `--color-primary-default` (`#2b5ad6`) and differs from the `#3b71f2` Figma shows: that is accepted pipeline drift, not a gate finding. The inconsistent occupancy sample data in Figma (the 30th shown as 48 of 48, 99%, in the high style; 47 of 48 shown as 97% and as 98%; 35 of 48 shown as 72%): the stories reproduce the drawn values and that is for the designer. Any state Figma does not draw.

## 2026-10-07 · Card widths with no token, and the accepted tag offset

**Finding.** Release review gate 2 (Tokens) failed Card for two literal px values. Figma (component 238:24; listing 238:7, stat 238:20) draws the listing card 284px wide and the stat tile 234px wide, and binds no variable to either. There are no size tokens, and the spacing scale has nothing that matches 284 or 234. The widths set the card's footprint and have no content or intrinsic size that could supply the number, so no equivalent technique avoids the literals. Both rules also carry `max-width: 100%`, so a card still shrinks to fit a narrow container. Separately, QA found the listing tag (Figma 238:10) draws an 11px offset and 9px / 3px padding, all unbound. There are no tokens for those values either, and the built tag uses the nearest tokens.

**Ruling.** These literals in `src/components/Card/Card.css` are accepted, because they are what the Figma nodes specify, until the designer adds matching size tokens:

| Value | Property | Selector | Lines |
|---|---|---|---|
| `284px` | `width` | `.hz-card--listing` | 27 |
| `234px` | `width` | `.hz-card--stat` | 34 |

The tag in `Card.css` stays on the nearest tokens: offset `--spacing-md` (12px), padding `--spacing-xs` block and `--spacing-sm` inline (4px / 8px), 24px tall. Figma 238:10 reads 11px offset, 3px / 9px padding and 22px tall. This deviation is accepted as a design decision (2026-10-07), the Figma node was not changed, and the QA report (`reports/Card/qa-report.md`, round 2) records it.

**For an agent that hits it.** Gate 2 passes for exactly these two values on exactly these properties in `Card.css`. The tag is not a gate item, since it uses tokens throughout: do not count it against a verdict, and quote this ruling when you report it. When a size token for 284px or 234px appears, the ruling no longer covers that value: use the token. If the designer later binds the tag to tokens in Figma, the tag part of this ruling no longer applies and the tag must be re-tested against the node.

**Not ruled.** Any other literal value, including a `var()` fallback. These values in any other component. A change to these values: a different number needs a new ruling or a token. The tag's size, colours or font, which match Figma. The intent file's `pairs_with: ["Image"]` and its "make the whole listing card clickable" line, which the review raised as warnings.

## 2026-10-07 · Modal sizes with no token, and the accepted shadow

**Finding.** Release review gate 2 (Tokens) will fail Modal for literal px values and one percentage. Figma (component set 243:181; dialog 243:3, sheet 243:93) draws the dialog panel 520px wide and the sheet panel 390px wide, the sheet's grab handle 48px wide and 4px high (243:95, 243:139), the close × 20px wide and 20px high (243:8, 243:100), the sheet's top padding 10px (243:93), and the detail rows' block padding 10px (243:11). None of these is bound to a variable. There are no size tokens, and the spacing scale (4, 8, 12, 16, 20, 24px) has no 10px, so none of these values has a matching token. The backdrop (`color/bg/overlay`) is documented in Figma as "apply at 40%", and there is no alpha token. Separately, QA found the panel shadow Figma draws (`0 8 12` at `rgba(0,0,0,0.2)`, unbound) matches no elevation token, and the built component uses `--elevation-lg`.

**Ruling.** These literals in `src/components/Modal/Modal.css` are accepted, because they are what the Figma nodes specify or document, until the designer adds matching size and alpha tokens:

| Value | Property | Selector | Lines |
|---|---|---|---|
| `520px` | `width` | `.hz-modal--dialog .hz-modal__panel` | 50 |
| `390px` | `width` | `.hz-modal--sheet .hz-modal__panel` | 57 |
| `10px` | `padding-top` (first value of the `padding` shorthand) | `.hz-modal--sheet .hz-modal__panel` | 59 |
| `48px` | `width` | `.hz-modal__handle` | 80 |
| `4px` | `height` | `.hz-modal__handle` | 81 |
| `20px` | `width` | `.hz-modal__close` | 124 |
| `20px` | `height` | `.hz-modal__close` | 125 |
| `10px` | `padding-block` (first value of the `padding` shorthand) | `.hz-modal__row` | 159 |
| `40%` | alpha in `color-mix(in srgb, var(--color-bg-overlay) 40%, transparent)` | `.hz-modal::backdrop` | 36 |

The panel shadow in `Modal.css` stays on the nearest token, `--elevation-lg` (`0 8 16` at 16% navy), against Figma's `0 8 12` at 20% black on nodes 243:3, 243:49, 243:93 and 243:137. This deviation is accepted as a design decision (2026-10-07), the Figma nodes were not changed, and the QA report (`reports/Modal/qa-report.md`, round 2) records it.

**For an agent that hits it.** Gate 2 passes for exactly these values on exactly these properties in `Modal.css`. The shadow is not a gate item, since it uses a token: do not count it against a verdict, and quote this ruling when you report it. The 10px values match the Button ruling in value only; that ruling covers `Button.css`, not this file. When a size token for 520px, 390px, 48px, 4px or 20px, a 10px spacing token, or an alpha token for the overlay appears, the ruling no longer covers that value: use the token. If the designer binds the shadow to a token in Figma, the shadow part of this ruling no longer applies and the shadow must be re-tested against the node.

**Not ruled.** Any other literal value, including a `var()` fallback. These values in any other component. A change to these values: a different number needs a new ruling or a token. The unitless font weights 400, 500 and 600, and the responsive limits `100%`, `100dvh` and `max-width: 100%`, which need no ruling. The inline px and `color-mix` in `Modal.stories.tsx`, which is not part of the stylesheet gate. The open-sheet width on a desktop viewport, which Figma does not draw. The 20px close target against the 24px WCAG 2.2 AA minimum, the initial focus on the close button, and the destructive tone's missing `alertdialog` role, which are design and accessibility gaps for a human to settle.
