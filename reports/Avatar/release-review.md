# Avatar · release review

- **Reviewed SHA:** `8945957f5a4f5cb0e85ded737523cc5eef9fb10b`. It is `85ecfed` (the Avatar build, level with `origin/main`) plus one commit that adds the `decisions.md` ruling and `reports/Avatar/qa-report.md`. No source file differs from `85ecfed`: `git diff 85ecfed 8945957 --stat` lists only those two files.
- **Date:** 2026-10-01
- **Verdict:** **Cleared**
- **Reviewer:** release agent, running `release-review`
- **Board row:** Avatar (`rectJuhuTajVVrT4f`), `Development` = `Completed`
- **Supersedes:** the `Blocked` review at `85ecfed` (PR #10, report commit `9513068`). It blocked on gate 2 only. Every gate and check below was run fresh, not carried over.

`decisions.md` was read in full before this review. One ruling is applied (G2, quoted below). The three 2026-09-28 rulings (Button values, npm token type, keeping 2FA on publish) don't bear on Avatar.

## Gates and checks

| # | Gate / check | Result | Evidence |
|---|---|---|---|
| G1 | Done | Pass | `Development` = `Completed`. `Production Storybook` (`https://horizon-design-system-cdfi.vercel.app`) returns 200 for `iframe.html?id=components-avatar--all-sizes`, and its `index.json` lists `components-avatar--sm`, `--md`, `--lg` and `--all-sizes`. The deployed stylesheet `assets/iframe-CqUcUHNn.css` has the same `.hz-avatar*` declarations as `Avatar.css` (24, 30 and 40px, `var(--radius-full)`). `Avatar.css` is byte-identical at `85ecfed` and the reviewed SHA. |
| G2 | Tokens | Pass (ruling) | The only hex or px literals in `src/components/Avatar/Avatar.css` are `width`/`height: 24px` (lines 13, 14), `30px` (18, 19) and `40px` (23, 24). No hex values, no `var()` fallbacks, and the only token read is `var(--radius-full)` (line 8). The header comment (lines 1-2) holds no value. All six literals are covered exactly by the ruling quoted below. |
| G3 | Surface | Pass | `src/index.ts:3` exports `Avatar`, and `src/index.ts:4` exports `AvatarProps` and `AvatarSize`. The commit that added it is titled for Avatar, so the export was a decision. See the note on `VERSIONING.md` under G7. |
| G4 | Names | Pass | Folder `src/components/Avatar/`, symbol `Avatar` (`Avatar.tsx:18`), CSS prefix `hz-avatar` (`Avatar.css`), intent `Avatar.intent.json`, board row `Avatar`. |
| G5 | States | Pass | Figma node `113:2` (component `112:9`) publishes `size=sm` (112:7, 24x24), `size=md` (112:6, 30x30) and `size=lg` (112:8, 40x40), and no other variant or state. `AvatarSize` (`Avatar.tsx:4`) is the same three values. Stories `Sm`, `Md`, `Lg` and `AllSizes` exist (`Avatar.stories.tsx`) and appear in the deployed `index.json`. |
| G6 | Intent | Pass | `src/components/Avatar/Avatar.intent.json` exists at the reviewed SHA and passes checks 1 and 3 to 6. Check 2 has nothing to flag. |
| G7 | Version | Pass | `VERSIONING.md` exists at the reviewed SHA. It states the 0.x bump rules, what counts as public, and what 0.1.0 commits you to. Note: line 35 says 0.1.0 "contains one component, `Button`". That is true of 0.1.0 as published (`npm view` lists 0.1.0, and `package.json` reads 0.1.0). Avatar is exported on `main` but is not in 0.1.0, so it would ship as an addition (a patch on 0.x per the table). Line 35 is stale as soon as a version containing Avatar is published, and **a human must update it then**. This review did not edit it. |
| C1 | Fields present | Pass | All seven fields are present with the right types. `use_when`, `dont_use_when`, `placement` and `pairs_with` are `[]`. Empty `use_when` and `dont_use_when` pass this check as recorded Figma gaps. |
| C2 | Alternatives named | Pass, nothing to flag | `dont_use_when` is empty, so there are no entries without an `instead`. |
| C3 | a11y specific | Pass | One entry: the photo is a native `<img>` whose alt text comes from the `alt` prop, defaulting to an empty string. Source `Avatar.tsx:21` is `{src && <img src={src} alt={alt} className="hz-avatar__image" />}`, and the default `alt = ""` is on line 18. The cited line implements the fact. |
| C4 | Tokens resolve | Pass | `npm run build:tokens` at the reviewed SHA wrote `build/css/tokens.css`. The one `required_tokens` entry, `--radius-full`, is defined there (line 42, `999px`). The set of `var(--…)` names in `Avatar.css` is `{--radius-full}`, identical to `required_tokens`. |
| C5 | Variants covered | Pass | `variant_intent` keys are `sm`, `md`, `lg`, exactly the `AvatarSize` union (`Avatar.tsx:4`). |
| C6 | No duplicate job | Pass | Compared with the only other intent file, `Button.intent.json`. Avatar's `use_when` is empty, so it can't claim a use Button also lists. Note that this check can't tell two components apart when one list is empty. |

## Ruling applied

G2 passes under `decisions.md`, "2026-10-01 · Avatar diameters with no token":

> These literals in `src/components/Avatar/Avatar.css` are accepted, because they're what the Figma node specifies (node 113:2, component 112:9), until the designer adds avatar size tokens:
>
> | Value | Property | Lines |
> |---|---|---|
> | `24px` | `width`, `height` on `.hz-avatar--sm` | 13, 14 |
> | `30px` | `width`, `height` on `.hz-avatar--md` | 18, 19 |
> | `40px` | `width`, `height` on `.hz-avatar--lg` | 23, 24 |
>
> **For an agent that hits it.** Gate 2 passes for exactly these values on exactly these properties in `Avatar.css`. Quote this ruling in the report. When an avatar size token appears, the ruling no longer covers that value: use the token.

**Staying inside the boundary.** The file's six literals match the table value for value, property for property and line for line, and there are no others. The ruling's "Not ruled" line is respected: there is no `var()` fallback, no value in another component, and no changed number. The ruling was committed unchanged in the reviewed SHA. No avatar size token exists in `build/css/tokens.css` (the ruling names `--spacing-2xl` and `--lineheight-4xl` as the nearest, and neither is a size token), so the ruling still applies. The reviewed SHA also doesn't read the ruling as covering the missing photo fallback or the empty `use_when` / `dont_use_when`: those are left as Figma gaps for the designer.

## Failures

None.

## Warnings (not blocking)

None from check 2.

## Other findings (outside the gates)

- **No production docs page to read first.** `Astro Link` is empty on the row, and no Avatar page exists under `docs-site/`. Step 2 of the review (read the docs page before the source) couldn't be done, so the docs-to-source comparison is still owed. This is the circular docs gate listed as an open item in `.claude/agents/release.md`.
- **Intent gaps from Figma.** `use_when` and `dont_use_when` are empty, and there is no photo fallback in the design. These are for the designer, per the ruling's "Not ruled" line.
- **Staleness.** The row's `Last Modified` (2026-10-01T08:36:44Z) was written after the `Blocked` review at `85ecfed` and is earlier than the reviewed commit's time (2026-10-01T09:40:15+01:00, i.e. 08:40:15Z), so it doesn't make this review stale. Writing the two registry cells will move `Last Modified` later than the commit again, which is the standing problem noted in the Button review.
- **Not run here.** Package preflight (npm token), the package and docs tracks, and any publish are out of scope for this review.
