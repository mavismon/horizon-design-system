# Button · release review

- **Reviewed SHA:** `a579d897f70458a9a37b6aa5b4fc9e31e74208e0` (main, level with origin/main)
- **Date:** 2026-09-28
- **Verdict:** **Blocked**
- **Reviewer:** release agent, running `release-review`
- **Board row:** Button (`recxAh3Dd401nLLVr`), `Development` = `Completed`

`decisions.md` was read before this review. Neither of its rulings (npm token type, keeping 2FA on publish) covers any finding below, so none is applied here.

## Gates and checks

| # | Gate / check | Result | Evidence |
|---|---|---|---|
| G1 | Done | Pass | `Development` = `Completed`. `Production Storybook` = https://horizon-design-system-cdfi.vercel.app returns 200; its `index.json` lists `components-button--default`, `--hover`, `--error`, `--outline`, `--outline-error`, `--all-states`, and `iframe.html?id=components-button--all-states` returns 200. |
| G2 | Tokens | **Fail** | Literal px/hex values in `src/components/Button/Button.css`, listed below. No ruling covers them. |
| G3 | Surface | Pass | `src/index.ts:1` exports `Button`, `src/index.ts:2` exports `ButtonProps` and `ButtonState`. Nothing in the repo says Button was meant to stay internal. |
| G4 | Names | Pass | Folder `src/components/Button/`, symbol `Button` (`Button.tsx:23`), CSS prefix `hz-button` (`Button.css:1`), intent `Button.intent.json`, board row `Button`. |
| G5 | States | Pass | Figma node `19:31` publishes `state=default` (19:30), `state=hover` (19:32), `state=error` (19:38), `state=outline` (19:43), `state=outline error` (20:2). `ButtonState` (`Button.tsx:5`) has the same five values, and each has a story (`Button.stories.tsx:24-42`, plus `AllStates` at `:44`). |
| G6 | Intent | Pass | The file exists at the reviewed SHA and passes checks 1 and 3 to 6. Check 2 has one warning, which doesn't block. |
| G7 | Version | **Fail** | `VERSIONING.md` doesn't exist at the reviewed SHA (`ls VERSIONING.md`: No such file or directory). |
| C1 | Fields present | Pass | All seven fields are present with the right types. `use_when` has 7 items and `dont_use_when` has 4, so neither is empty. `placement` and `pairs_with` are `[]` (the stories show Button alone). |
| C2 | Alternatives named | **Warning** | `dont_use_when[1]` ("When more than one primary action competes for attention on the same screen …") has `"instead": ""`. |
| C3 | a11y specific | Pass | `Button.tsx:36`: native `<button type="button">`, with `{...rest}` spread onto it. `Button.tsx:33`: `<img … alt="">`. `Button.tsx:38`: `<span>{text}</span>`. `Button.css:17`: the `:focus-visible` rule, whose `outline: 2px solid` and `outline-offset: 2px` are on lines 18-19. Every cited line exists and implements its fact. |
| C4 | Tokens resolve | Pass | `npm run build:tokens` at the reviewed SHA wrote `build/css/tokens.css`. All 13 `required_tokens` are defined there, and the set of `var(--…)` names in `Button.css` is identical to `required_tokens` (diff empty). |
| C5 | Variants covered | Pass | `variant_intent` keys are `default`, `hover`, `error`, `outline`, `outline error`, exactly the `ButtonState` union (`Button.tsx:5`). |
| C6 | No duplicate job | Pass | `Button.intent.json` is the only intent file under `src/components/`, so there's nothing to compare against. |

## Failures

### G2 · Tokens: fix owner is **engineer**

Literal values in `src/components/Button/Button.css`:

| Line | Declaration | Literal(s) |
|---|---|---|
| 5 | `gap: 10px` | `10px` |
| 6 | `padding: 10px` | `10px` |
| 8 | `border-radius: var(--radius-sm, 6px)` | fallback `6px` |
| 10 | `font-size: var(--fontsize-xs, 10px)` | fallback `10px` |
| 11 | `line-height: var(--lineheight-xs, 16px)` | fallback `16px` |
| 18 | `outline: 2px solid var(--color-border-focus, #1d44ba)` | `2px`, fallback `#1d44ba` |
| 19 | `outline-offset: 2px` | `2px` |
| 25 | `width: 12px` | `12px` |
| 26 | `height: 12px` | `12px` |
| 30 | `background: var(--color-primary-default, #3b71f2)` | fallback `#3b71f2` |
| 31 | `color: var(--color-text-inverse, #f9fafb)` | fallback `#f9fafb` |
| 36 | `background: var(--color-primary-hover, #2b5ad6)` | fallback `#2b5ad6` |
| 37 | `color: var(--color-interactive-on-primary, #f9fafb)` | fallback `#f9fafb` |
| 41 | `background: var(--color-status-error, #ea3d3d)` | fallback `#ea3d3d` |
| 42 | `color: var(--color-text-inverse, #f9fafb)` | fallback `#f9fafb` |
| 47 | `border: 1px solid var(--color-neutral-default, #8a909c)` | `1px`, fallback `#8a909c` |
| 48 | `color: var(--color-text-primary, #161925)` | fallback `#161925` |
| 53 | `border: 1px solid var(--color-negative-default, #ea3d3d)` | `1px`, fallback `#ea3d3d` |
| 54 | `color: var(--color-negative-default, #ea3d3d)` | fallback `#ea3d3d` |

Four fallbacks are also stale: they no longer match the token they stand in for in `build/css/tokens.css`. If the tokens stylesheet fails to load, the button renders the old values.

| Line | Token | Fallback | Built value |
|---|---|---|---|
| 30 | `--color-primary-default` | `#3b71f2` | `#2b5ad6` (tokens.css:122) |
| 36 | `--color-primary-hover` | `#2b5ad6` | `#1d44ba` (tokens.css:140) |
| 41 | `--color-status-error` | `#ea3d3d` | `#d02727` (tokens.css:119) |
| 53, 54 | `--color-negative-default` | `#ea3d3d` | `#d02727` (tokens.css:125) |

`font-weight: 400` (line 12) is neither hex nor px, so it isn't listed.

### G7 · Version: fix owner is **a human**

`VERSIONING.md` doesn't exist. Until someone writes it and says what `0.1.0`, and each later bump, commits consumers to, every review blocks here.

## Warnings (not blocking)

- **C2:** `dont_use_when[1]` names no alternative (`"instead": ""`). This is a recorded Figma gap for the designer, not a block.

## Other findings (outside the gates)

- **No production docs page to read first.** `Astro Link` is empty on the row. The docs site (https://horizon-docs-zeta.vercel.app/) is the Starlight starter: its only linked page is `/guides/example/`, and `/components/button/` returns 404. So step 2 of the review (read the docs page before the source) couldn't be done, and there's no docs page to compare with the source. This is the circular docs gate listed as an open item in `.claude/agents/release.md`: `doc-generator` writes `Astro Link` only for `Cleared` components. It's for a human to settle.
- **`dont_use_when` alternatives aren't all component names.** `"Badge/Lozenge"` and `"Toggle or Checkbox"` name two candidates each, and none of Link, Badge, Lozenge, Toggle or Checkbox exists in `src/components/` at the reviewed SHA. This is reported for the intent file's owner (`component-intent`) and doesn't change any check result.

## Re-review

Fix, redeploy, then re-review. Don't patch this report. A change made after this SHA is a change this review didn't see.
