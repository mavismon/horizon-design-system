# Button · release review

- **Reviewed SHA:** `bd68c16403f2cc8c9c806a201f69d2f8bb9c4c51` (main, level with origin/main)
- **Date:** 2026-09-28
- **Verdict:** **Cleared**
- **Reviewer:** release agent, running `release-review`
- **Board row:** Button (`recxAh3Dd401nLLVr`), `Development` = `Completed`
- **Supersedes:** the review at `a579d89` (PR #3) and the unmerged review at `3ae7b5b` (PR #6). That review blocked only on C4/G6 (`--border-width-md` and `--border-width-sm` missing from `required_tokens`). PR #7 added both.

`decisions.md` was read before this review. One ruling is applied (G2, quoted below). The other two rulings (npm token type, keeping 2FA on publish) are about publishing and don't bear on any gate or check.

## Gates and checks

| # | Gate / check | Result | Evidence |
|---|---|---|---|
| G1 | Done | Pass | `Development` = `Completed`. `Production Storybook` = https://horizon-design-system-cdfi.vercel.app returns 200. Its `index.json` lists `components-button--default`, `--hover`, `--error`, `--outline`, `--outline-error` and `--all-states`, and `iframe.html?id=components-button--all-states` returns 200. The deployed stylesheet (`assets/iframe-CdHgK3vj.css`) has the same `.hz-button*` declarations as `Button.css` at the reviewed SHA, including `var(--border-width-md)` and `var(--border-width-sm)`. |
| G2 | Tokens | Pass (ruling) | The only hex or px literals in `src/components/Button/Button.css` are `gap: 10px` (line 5), `padding: 10px` (6), `outline-offset: 2px` (19), `width: 12px` (25) and `height: 12px` (26). There are no `var()` fallbacks and no hex values. All five are covered exactly by the ruling quoted below. |
| G3 | Surface | Pass | `src/index.ts:1` exports `Button`, and `src/index.ts:2` exports `ButtonProps` and `ButtonState`. `VERSIONING.md` ("What 0.1.0 commits you to") names Button as the one public component. |
| G4 | Names | Pass | Folder `src/components/Button/`, symbol `Button` (`Button.tsx:23`), CSS prefix `hz-button` (`Button.css:1`), intent `Button.intent.json`, board row `Button`. |
| G5 | States | Pass | Figma node `19:31` publishes `state=default` (19:30), `state=hover` (19:32), `state=error` (19:38), `state=outline` (19:43) and `state=outline error` (20:2). `ButtonState` (`Button.tsx:5`) has the same five values. Each has a story (`Button.stories.tsx:24-42`), and `AllStates` (`:44`) renders all five. |
| G6 | Intent | Pass | `src/components/Button/Button.intent.json` exists at the reviewed SHA and passes checks 1 and 3 to 6. Check 2 has one warning, which doesn't block. |
| G7 | Version | Pass | `VERSIONING.md` exists at the reviewed SHA. It sets out the 0.x bump rules (breaking → minor, additions and fixes → patch), what counts as public (exports, props and their values, `hz-` classes, token names, entry points), and a section, "What 0.1.0 commits you to". |
| C1 | Fields present | Pass | All seven fields are present with the right types. `use_when` has 7 items and `dont_use_when` has 4. `placement` and `pairs_with` are `[]`. |
| C2 | Alternatives named | **Warning** | `dont_use_when[1]` ("When more than one primary action competes for attention on the same screen …") has `"instead": ""`. |
| C3 | a11y specific | Pass | `Button.tsx:36`: a native `<button type="button">`, with `{...rest}` spread onto it. `Button.tsx:33`: `<img … alt="">`. `Button.tsx:38`: `<span>{text}</span>`. `Button.css:17`: the `:focus-visible` rule. Its outline is `var(--border-width-md)` (line 18), which resolves to `2px` (`build/css/tokens.css:65`), and its `outline-offset` is `2px` (line 19), so the stated "2px solid outline with a 2px offset" holds. Every cited line exists and implements its fact. |
| C4 | Tokens resolve | Pass | `npm run build:tokens` at the reviewed SHA wrote `build/css/tokens.css`. All 15 `required_tokens` are defined there (for example `--border-width-sm` at line 64 and `--border-width-md` at line 65). The set of `var(--…)` names in `Button.css` (15) is identical to `required_tokens` (15), with an empty diff. |
| C5 | Variants covered | Pass | The `variant_intent` keys are `default`, `hover`, `error`, `outline` and `outline error`, exactly the `ButtonState` union (`Button.tsx:5`). |
| C6 | No duplicate job | Pass | `Button.intent.json` is the only intent file under `src/components/`, so there's nothing to compare against. |

## Ruling applied

G2 passes under `decisions.md`, "2026-09-28 · Button values with no token":

> These literals in `src/components/Button/Button.css` are accepted, because they're what the Figma node specifies (node 19:31), until the designer adds matching tokens:
>
> | Value | Property | Lines |
> |---|---|---|
> | `10px` | `gap`, `padding` on `.hz-button` | 5, 6 |
> | `12px` | `width`, `height` on `.hz-button__icon` | 25, 26 |
> | `2px` | `outline-offset` on `.hz-button:focus-visible` | 19 |
>
> **For an agent that hits it.** Gate 2 passes for exactly these values on exactly these properties in `Button.css`. Quote this ruling in the report. When a token with the same value appears (for example a 10px spacing token), the ruling no longer covers that value: use the token.

**Staying inside the boundary.** Tokens with these values do exist: `--fontsize-xs: 10px` (tokens.css:152), `--spacing-md: 12px` (34), `--radius-md: 12px` (40), `--fontsize-md: 12px` (154), `--border-width-md: 2px` (65) and `--radius-xs: 2px` (67). None of them has *appeared* since the ruling. `git diff f43b8e5 bd68c16` (from the commit that added the ruling to the reviewed SHA) touches only `Button.intent.json`, so the token set is the one the human ruled against. None of them is a spacing token for 10px or 2px, or a size token. If a matching token is added later, this ruling stops covering that value and G2 must be re-run.

## Failures

None.

## Warnings (not blocking)

- **C2:** `dont_use_when[1]` names no alternative (`"instead": ""`). This is a recorded Figma gap for the designer, not a block.

## Other findings (outside the gates)

- **No production docs page to read first.** `Astro Link` is empty on the row, and `https://horizon-docs-zeta.vercel.app/components/button/` returns 404. So step 2 of the review (read the docs page before the source) couldn't be done, and there's no docs page to compare with the source. This is the circular docs gate listed as an open item in `.claude/agents/release.md`: `doc-generator` writes `Astro Link` only for `Cleared` components. With this verdict, `doc-generator` can now stage Button's page. The comparison between the docs page and the source is still owed, and a human should decide whether it happens at the next review.
- **`dont_use_when` alternatives aren't all component names.** `"Badge/Lozenge"` and `"Toggle or Checkbox"` name two candidates each, and none of Link, Badge, Lozenge, Toggle or Checkbox exists in `src/components/` at the reviewed SHA. This is for the intent file's owner (`component-intent`) and doesn't change any check result.
- **The staleness rule can't hold for this row.** Writing `Release Review` and `Release Verdict` updates the row's `Last Modified`, which is then always later than the reviewed commit. Read literally, every review goes stale the moment it's recorded. A human should settle what `Last Modified` is compared against.

## Re-review

Fix, redeploy, then re-review. Don't patch this report. A change made after this SHA is a change this review didn't see.
