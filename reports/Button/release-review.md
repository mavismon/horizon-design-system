# Button · release review

- **Reviewed SHA:** `3ae7b5b20c654a8deeffa7bc2e0de4d019bb9862` (main, level with origin/main)
- **Date:** 2026-09-28
- **Verdict:** **Blocked**
- **Reviewer:** release agent, running `release-review`
- **Board row:** Button (`recxAh3Dd401nLLVr`), `Development` = `Completed`
- **Previous review:** Blocked at `a579d89` on G2 (Tokens) and G7 (Version). Both now pass. This review replaces that one.

`decisions.md` was read before this review. One ruling applies, to G2, and is quoted there. The other two rulings (npm token type, keeping 2FA on publish) are about publishing and don't bear on any gate.

## Gates and checks

| # | Gate / check | Result | Evidence |
|---|---|---|---|
| G1 | Done | Pass | `Development` = `Completed`. `Production Storybook` = https://horizon-design-system-cdfi.vercel.app returns 200. Its `index.json` lists `components-button--default`, `--hover`, `--error`, `--outline`, `--outline-error` and `--all-states`, and `iframe.html?id=components-button--all-states` returns 200. The deployed CSS carries the PR #5 stylesheet: `.hz-button:focus-visible{outline:var(--border-width-md) solid var(--color-border-focus);outline-offset:2px}`, with no fallbacks. |
| G2 | Tokens | Pass (by ruling) | The only hex or px literals in `src/components/Button/Button.css` are `gap: 10px` (line 5), `padding: 10px` (6), `outline-offset: 2px` (19), `width: 12px` (25) and `height: 12px` (26). There are no `var()` fallbacks left, and no hex anywhere. All five are covered by the ruling quoted below. |
| G3 | Surface | Pass | `src/index.ts:1` exports `Button`, and `src/index.ts:2` exports `ButtonProps` and `ButtonState`. `VERSIONING.md` ("What 0.1.0 commits you to") names Button as public. |
| G4 | Names | Pass | Folder `src/components/Button/`, symbol `Button` (`Button.tsx:23`), CSS prefix `hz-button` (`Button.css:1`), intent `Button.intent.json`, board row `Button`. |
| G5 | States | Pass | Figma node `19:31` publishes `state=default` (19:30), `state=hover` (19:32), `state=error` (19:38), `state=outline` (19:43) and `state=outline error` (20:2). `ButtonState` (`Button.tsx:5`) has the same five values, and each has a story (`Button.stories.tsx:24-42`, plus `AllStates` at `:44`). |
| G6 | Intent | **Fail** | The file exists at the reviewed SHA, but it fails check 4. |
| G7 | Version | Pass | `VERSIONING.md` exists at the reviewed SHA. It says what each bump commits consumers to while on 0.x and from 1.0.0 (table), what counts as public, and, under "What 0.1.0 commits you to", that 0.1.0 is Button with its props, `state` values, `hz-button` classes and the tokens in `tokens.css`. |
| C1 | Fields present | Pass | All seven fields are present with the right types. `use_when` has 7 items and `dont_use_when` has 4, so neither is empty. `placement` and `pairs_with` are `[]`. |
| C2 | Alternatives named | **Warning** | `dont_use_when[1]` ("When more than one primary action competes for attention on the same screen …") has `"instead": ""`. |
| C3 | a11y specific | Pass | `Button.tsx:36`: native `<button type="button">`, with `{...rest}` spread onto it. `Button.tsx:33`: `<img … alt="">`. `Button.tsx:38`: `<span>{text}</span>`. `Button.css:17`: the `:focus-visible` rule. Line 18 is now `outline: var(--border-width-md) solid …`, and `--border-width-md` is `2px` (`build/css/tokens.css:65`), so "a 2px solid outline with a 2px offset" is still true. |
| C4 | Tokens resolve | **Fail** | `npm run build:tokens` at the reviewed SHA wrote `build/css/tokens.css`. All 13 `required_tokens` are defined there. But the stylesheet reads 15 tokens, and `--border-width-md` (`Button.css:18`) and `--border-width-sm` (`Button.css:47`, `:53`) aren't in `required_tokens`. |
| C5 | Variants covered | Pass | `variant_intent` keys are `default`, `hover`, `error`, `outline` and `outline error`, exactly the `ButtonState` union (`Button.tsx:5`). |
| C6 | No duplicate job | Pass | `Button.intent.json` is the only intent file under `src/components/`, so there's nothing to compare against. |

## The ruling applied to G2

From `decisions.md`, "2026-09-28 · Button values with no token":

> **Ruling.** These literals in `src/components/Button/Button.css` are accepted, because they're what the Figma node specifies (node 19:31), until the designer adds matching tokens:
>
> | Value | Property | Lines |
> |---|---|---|
> | `10px` | `gap`, `padding` on `.hz-button` | 5, 6 |
> | `12px` | `width`, `height` on `.hz-button__icon` | 25, 26 |
> | `2px` | `outline-offset` on `.hz-button:focus-visible` | 19 |
>
> **For an agent that hits it.** Gate 2 passes for exactly these values on exactly these properties in `Button.css`. Quote this ruling in the report. When a token with the same value appears (for example a 10px spacing token), the ruling no longer covers that value: use the token.
>
> **Not ruled.** Any other literal value, including a `var()` fallback. These values in any other component. A change to these values: a different number needs a new ruling or a token.

All five literals match the table's value, property, selector and line exactly. On the "when a token with the same value appears" line: `build/css/tokens.css` does define `--spacing-md: 12px`, `--border-width-md: 2px` and `--radius-xs: 2px`. None of them appeared after the ruling. The last commit to touch `tokens/` or `build-tokens.js` is `2ec2ece` (2026-09-08), and the ruling was written in `f43b8e5` (2026-09-28). The ruling's own finding already accounts for them ("the spacing scale has 8px and 12px but no 10px, there are no size tokens, and no spacing token is 2px"). So the ruling covers these values, and this review doesn't stretch it.

## Failures

### G6 / C4 · `required_tokens` is missing two tokens: fix owner is the **intent file** (`component-intent`, written by `doc-generator`)

PR #5 moved the outline width and the outline borders onto `--border-width-md` and `--border-width-sm`, but `Button.intent.json` wasn't updated.

```
diff <(required_tokens, sorted) <(var(--…) names in Button.css, sorted)
0a1,2
> --border-width-md
> --border-width-sm
```

Both tokens are defined in `build/css/tokens.css` (lines 65 and 64), so the fix is only to list them in `required_tokens`. Per this skill, the review doesn't edit the intent file.

## Warnings (not blocking)

- **C2:** `dont_use_when[1]` names no alternative (`"instead": ""`). This is a recorded Figma gap for the designer, not a block.

## Other findings (outside the gates)

- **No production docs page to read first.** `Astro Link` is still empty. https://horizon-docs-zeta.vercel.app/ returns 200, but `/components/button/` returns 404, and the only other page is the starter's `/guides/example/`. So step 2 (read the docs page before the source) couldn't be done. This is the circular docs gate listed as an open item in `.claude/agents/release.md`, and it's for a human to settle.
- **0.1.0 is already on npm, and it isn't what this review looked at.** It was published at 2026-09-28T10:19:26Z (npm `time`), outside the release agent, while this row read `Blocked`. Tag `v0.1.0` points at `61cef44`, before PR #5. The registry tarball's `dist/styles.css` still has the fallbacks and literals G2 failed at `a579d89`, for example `outline: 2px solid var(--color-border-focus, #1d44ba)` (line 18) and `background: var(--color-primary-default, #3b71f2)` (line 30), a fallback that doesn't match the built token (`#2b5ad6`).
- **`dont_use_when` alternatives aren't all component names.** `"Badge/Lozenge"` and `"Toggle or Checkbox"` name two candidates each, and none of Link, Badge, Lozenge, Toggle or Checkbox exists in `src/components/`. This is carried over for `component-intent` and doesn't change any check result.
- **Link SHA.** The report can't exist at the SHA it reviews, so `Release Review` links to the commit that adds this report. That commit's only parent is `3ae7b5b` and it changes only this file, so it's the same source.

## Re-review

Fix, redeploy, then re-review. Don't patch this report. A change made after this SHA is a change this review didn't see.
