# Avatar · release review

- **Reviewed SHA:** `85ecfedaf3b70280ea3fce44b67b83c86488d47b` (main, level with origin/main)
- **Date:** 2026-10-01
- **Verdict:** **Blocked** (G2 Tokens)
- **Reviewer:** release agent, running `release-review`
- **Board row:** Avatar (`rectJuhuTajVVrT4f`), `Development` = `Completed`

`decisions.md` was read before this review. It has four rulings: npm token type, Button's literals, keeping 2FA on publish, and nothing else. **None covers Avatar.** The Button literals ruling is limited to `Button.css` and its listed values.

## Gates and checks

| # | Gate / check | Result | Evidence |
|---|---|---|---|
| G1 | Done | Pass | `Development` = `Completed`. `Production Storybook` (https://horizon-design-system-cdfi.vercel.app/?path=/story/components-avatar--all-sizes) returns 200. `index.json` lists `components-avatar--sm`, `--md`, `--lg` and `--all-sizes`, and `iframe.html?id=components-avatar--all-sizes` returns 200. The deployed stylesheet has the same `.hz-avatar*` declarations as `Avatar.css` at the reviewed SHA. Note: Avatar reached production by a direct push to `main` before QA, and `Staging Storybook` is the production URL (the user's one-row decision). Both are process facts, not gate failures. |
| G2 | Tokens | **Fail** | `src/components/Avatar/Avatar.css` has raw px literals: `width: 24px` (line 13), `height: 24px` (14), `width: 30px` (18), `height: 30px` (19), `width: 40px` (23), `height: 40px` (24). There are no hex values and no `var()` fallbacks. No ruling in `decisions.md` covers them. The user approved these values in conversation and the file carries a TODO comment (lines 1-2), but only a human writing in `decisions.md` is a ruling, and this review may not write one. |
| G3 | Surface | Pass | `src/index.ts:3` exports `Avatar`, and `src/index.ts:4` exports `AvatarProps` and `AvatarSize`. Nothing marks it internal. See "Other findings" for the `VERSIONING.md` inconsistency. |
| G4 | Names | Pass | Folder `src/components/Avatar/`, symbol `Avatar` (`Avatar.tsx:18`), CSS prefix `hz-avatar` (`Avatar.css:3`), intent `Avatar.intent.json`, board row `Avatar`. |
| G5 | States | Pass | Figma node `113:2` publishes `size=sm` (112:7, 24x24), `size=md` (112:6, 30x30) and `size=lg` (112:8, 40x40), and no other variant or state. `AvatarSize` (`Avatar.tsx:4`) has the same three values. Stories `Sm`, `Md`, `Lg` and `AllSizes` (`Avatar.stories.tsx:24-36`) render each. |
| G6 | Intent | Pass | `src/components/Avatar/Avatar.intent.json` exists at the reviewed SHA and passes checks 1 and 3 to 6. Check 2 has nothing to evaluate. |
| G7 | Version | Pass | `VERSIONING.md` exists and sets out the bump rules. See "Other findings" for what it says about 0.1.0. |
| C1 | Fields present | Pass | All seven fields are present with the right types. `use_when`, `dont_use_when`, `placement` and `pairs_with` are `[]`. **Recorded Figma gap:** the Figma page has no usage region, so the empty `use_when` and `dont_use_when` are not invented. The check passes them as the skill allows. |
| C2 | Alternatives named | Pass (n/a) | `dont_use_when` is empty, so there is no entry without an `instead`. No warning. |
| C3 | a11y specific | Pass | One entry: native `<img>` whose alt comes from the `alt` prop, defaulting to `""`. Source `Avatar.tsx:21` is the `<img src={src} alt={alt} …>` line, and the default is at line 18. The cited line exists and implements the fact. |
| C4 | Tokens resolve | Pass | `npm run build:tokens` at the reviewed SHA wrote `build/css/tokens.css`. `--radius-full` is defined at line 42. The only `var(--…)` in `Avatar.css` is `--radius-full` (line 8), identical to `required_tokens`. |
| C5 | Variants covered | Pass | `variant_intent` keys are `sm`, `md`, `lg`, exactly the `AvatarSize` union. |
| C6 | No duplicate job | Pass | `use_when` is empty, so Avatar claims no job. Button's `use_when` has 7 entries and none is shared. |

## Failures

- **G2 Tokens.** The six px literals in `Avatar.css` (lines 13, 14, 18, 19, 23, 24: 24, 30 and 40px diameters) have no token and no ruling. Cause: the design binds no avatar size tokens, so none exist in `tokens/`. **Owner:** a human, who either rules on these literals in `decisions.md` (as was done for Button, naming exact values, properties and lines), or the designer, who adds avatar size tokens, after which the engineer switches to them and the component goes through branch, PR, merge, deploy, re-review.

## Warnings (not blocking)

None.

## Other findings (outside the gates)

- **`VERSIONING.md` is out of date for Avatar.** Line 35: "0.1.0 contains one component, `Button`". `src/index.ts` now exports `Avatar` too, so the stated commitment for 0.1.0 doesn't match the surface. G7 passes on the skill's terms (the file exists and says what 0.1.0 commits to), but a human should update it before any release containing Avatar. Owner: a human.
- **No production docs page to read first.** `Astro Link` is empty and `https://horizon-docs-zeta.vercel.app/components/avatar/` returns 404, so step 2 (docs page before source) couldn't be done. This is the circular docs gate noted in `.claude/agents/release.md`.
- **Staleness.** The row's `Last Modified` (2026-10-01T08:33:14Z) is later than the reviewed commit (2026-10-01T08:28:40Z), because QA rows and links were written after the push. Read literally the review is stale on arrival, the same issue recorded for Button. A human should settle what `Last Modified` is compared against. The source at 85ecfed is what was reviewed, and `main` hasn't moved.
- **Process.** Avatar reached production Storybook before QA, and `Staging Storybook` equals `Production Storybook` by the user's one-row decision. `reports/Avatar/qa-report.md` was untracked in the working tree during the review. It is not part of this commit, and the review's other checks don't depend on it.
- **Intent gap.** Empty `use_when` and `dont_use_when` come from a Figma gap. They are for the designer, and `component-intent` owns the file.

## Re-review

Fix, redeploy, then re-review. Don't patch this report. A change made after this SHA is a change this review didn't see.
