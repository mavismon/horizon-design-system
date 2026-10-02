# Logo · release review

- **Reviewed SHA:** `1ab3ee25887007ee03e8b70336473a7c18f84bb7` (branch `release-review/logo-0430408`). Three commits on top of `origin/main` `500e73c`: the intent commit (cherry-picked from `35a5ee1`, `Logo.intent.json` only), then the QA report and the `decisions.md` ruling. Source under `src/` differs from the Logo build commit `0430408` only in `src/components/Logo/Logo.intent.json` (`git diff 0430408 500e73c -- src` is empty). This report is committed on top of the reviewed SHA.
- **Date:** 2026-10-02
- **Verdict:** **Cleared**
- **Reviewer:** release agent, running `release-review`
- **Board row:** Logo (`recRKl3rLEONeusHj`), read fresh: `Development` = `Completed`, `Design` = `Done`, `Production Storybook` and `Staging Storybook` set, `Commit` = `0430408`, `Astro Link` empty, `Release Review` and `Release Verdict` empty, `Last Modified` = 2026-10-02T05:19:35Z.

`decisions.md` was read in full at the reviewed SHA. One ruling is applied (G2, quoted below). The rulings of 2026-09-28 and the Avatar, Button and other component rulings do not bear on Logo.

## Gates and checks

| # | Gate / check | Result | Evidence |
|---|---|---|---|
| G1 | Done | Pass | `Development` reads `Completed`. `Production Storybook` (`https://horizon-design-system-cdfi.vercel.app/?path=/story/components-logo--all-variants`) returns 200, and `index.json` lists `components-logo--lockup`, `--mark` and `--all-variants`. |
| G2 | Tokens | Pass (ruling) | One literal in `src/components/Logo/Logo.css`: `color: #2e7cc4;` on `.hz-logo__wordmark`, line 20. No other hex or px value (`grep` for hex, `px` and `var(` with a comma finds only line 20). The mark is `<img width={32} height={32}>` (`Logo.tsx:20`) with no CSS size. `font-weight: 600` (line 18) is not a px or hex value. No `var()` fallbacks. Covered exactly by the ruling below. |
| G3 | Surface | Pass | `src/index.ts:13` exports `Logo`; `src/index.ts:14` exports `LogoProps` and `LogoType` (`"lockup" \| "mark"`, `Logo.tsx:5`). Added deliberately in the Logo build commit. |
| G4 | Names | Pass | Folder `src/components/Logo/`, symbol `Logo` (`Logo.tsx:12`), CSS prefix `hz-logo`, intent `Logo.intent.json`, board row `Logo`. |
| G5 | States | Pass | Figma component set `137:17` publishes `type=lockup` (137:6) and `type=mark` (137:12): two cells, no states, no sizes. `LogoType` is the same two values. Stories `Lockup`, `Mark`, `AllVariants` exist and appear in the deployed `index.json`. The Usage frame says there is no dark-background version yet; none is built, none is a gap in the code. |
| G6 | Intent | Pass | `Logo.intent.json` exists at the reviewed SHA and passes checks 1 to 6. |
| G7 | Version | Pass | `VERSIONING.md` exists at the reviewed SHA and states the 0.x bump rules and what 0.1.0 commits you to. Standing note, not a finding: line 35 says 0.1.0 "contains one component, `Button`". It goes stale once a version containing Logo ships; a human edits it then. This review did not edit it. |
| C1 | Fields present | Pass | All seven fields present with the right types. `use_when` 2 strings, `dont_use_when` 3 objects (`when`, `instead`), `variant_intent` 2 keys, `required_tokens` 4, `a11y` 3 entries; `placement` and `pairs_with` are `[]` (the stories render Logo on its own). |
| C2 | Alternatives named | Pass, no warnings | All three `dont_use_when` entries have a non-empty `instead`: `Image`, `Avatar`, `Icon Library`. The check asks only that `instead` is non-empty; it does not check the target exists. `Image` and `Avatar` are built (this branch); `Icon Library` is not built, so that pointer does not resolve to anything consumers can import. Check 2 passes it with no warning. Recorded so the reader is not misled; the pointer is as Figma words it. |
| C3 | a11y specific | Pass | Three entries, all cite lines that exist and implement the fact at the reviewed SHA. `Logo.tsx:14`: `const markAlt = alt ?? (isMark ? "Horizon Stays" : "");` (empty alt in the lockup, "Horizon Stays" on the mark, `alt` prop overrides). `Logo.tsx:20`: `<img ... alt={markAlt} width={32} height={32} />` (native img, explicit 32 by 32). `Logo.tsx:21`: `{!isMark && <span className="hz-logo__wordmark">Horizon Stays</span>}` (wordmark is real text). |
| C4 | Tokens resolve | Pass | `npm run build:tokens` at the reviewed SHA wrote `build/css/tokens.css`. `--fontfamily-body`, `--fontsize-2xl`, `--lineheight-2xl` and `--spacing-sm` are each defined there once. The set of `var(--...)` names in `Logo.css` is exactly those four, identical to `required_tokens`. |
| C5 | Variants covered | Pass | `variant_intent` keys are `lockup`, `mark`, exactly the `LogoType` union (`Logo.tsx:5`). |
| C6 | No duplicate job | Pass | Compared with all six other intent files. Logo's `use_when`: the header lockup, and the mark alone where there is no room. No other component lists either. Avatar claims a person's profile photo (including in the header), Image claims listing, room and place photos, and both of their `dont_use_when` lists send brand marks to Logo, which is the opposite of claiming the job. Logo's `dont_use_when` sends photos to Image and profile photos to Avatar, a matching handover, not an overlap. Button, Checkbox, Chip and Link are unrelated. |

## Intent content against Figma 137:506

Read with `get_design_context` at review time. Both `use_when` strings ("At the left of the header on every page, using the lockup at 32px high." and "Use the mark on its own where there's no room for the wordmark, such as a collapsed sidebar, an app icon or a favicon.") match the "Use the Logo" lines (nodes 137:605, 137:612) word for word, in order. The three `dont_use_when` `when` strings match the "Do not use the logo" lines (137:618, 137:624, 137:630) word for word, in order; each `instead` is the component the sentence names. Nothing is invented. The six "Best Practice" lines (137:636 to 137:666) are not in the file, because `component-intent` has no field for them; they remain in Figma. Two of them matter to this review: "Place it on a light background ... there's no version for dark backgrounds yet", and "Don't show the mark and the lockup side by side on the same screen" (see Other findings).

## Brand mark asset

`src/assets/images/logo-mark.svg` is the real brand mark: a 32 by 32 rounded-square tile filled `#3B82F6` (path id `tile`), a white half-disc (`sun`) and a white 1.8-stroke wavy line (`wave`). It is not a placeholder.

## Ruling applied

G2 passes under `decisions.md`, "2026-10-02 · Logo wordmark colour with no token":

> **Ruling.** This literal in `src/components/Logo/Logo.css` is accepted, because it is the fixed brand colour the Figma node specifies, and it does not follow the UI tokens by design:
>
> | Value | Property | Selector | Lines |
> |---|---|---|---|
> | `#2e7cc4` | `color` on the wordmark | `.hz-logo__wordmark` | 20 |
>
> **For an agent that hits it.** Gate 2 passes for exactly this value on exactly this property in `Logo.css`. Quote this ruling in the report. If the designer later binds a token to the wordmark colour, or the brand colour is added to the token set, the ruling no longer covers it: use the token.
>
> **Not ruled.** Any other literal value, including a `var()` fallback. This value in any other component. A change to this value: a different colour needs a new ruling or a token. The `font-weight: 600` hard-coded on line 18 is not a px or hex value and needs no ruling. The Logo has no dark-background version, and any recolouring of the mark or wordmark is outside this ruling.

**Staying inside the boundary.** Line 20 of `Logo.css` at the reviewed SHA is exactly `  color: #2e7cc4;` inside `.hz-logo__wordmark` (lines 15 to 22). Value, property, selector and line match the ruling. There is no other literal, no `var()` fallback, and no hex or px in any other component's change. No token for `#2e7cc4` exists in `build/css/tokens.css`, so the ruling still applies. The ruling was appended to `origin/main`'s `decisions.md` verbatim; `git diff` against `origin/main` shows only the added Logo section.

## Failures

None.

## Warnings (not blocking)

None from check 2.

## Other findings (outside the gates)

- **No docs page yet.** `Astro Link` is empty, so step 2 (read the production docs page first) had nothing to read. `Release Verdict` = `Cleared` will not make the row read `Released` until `doc-generator` stages the page and `devops` pushes it and the orchestrating session writes `Astro Link`.
- **Story against Figma guidance.** The `AllVariants` story renders the lockup and the mark side by side (`Logo.stories.tsx`), which Figma's Best Practice line 137:666 says not to do on the same screen. It is a documentation overview, not product use, and the stories file is not a gate; the owner is the engineer if the designer wants it changed. The same story uses numeric inline styles (`gap: 24`) in the story wrapper, which is outside the stylesheet that G2 reads.
- **Dark background.** Figma says there is no dark-background version yet; the intent file has no field for it. Nothing to fix; stays a Figma and designer gap.
- **`VERSIONING.md` line 35** is a standing human task (see G7).
- **Staleness.** Row `Last Modified` (2026-10-02T05:19:35Z) is earlier than the reviewed commit, so the review is not stale on entry. Writing the two registry cells will move `Last Modified` later than the commit again, the standing problem noted in earlier reviews.
- **Not run here.** Package preflight, package and docs tracks, any version bump, publish or merge. Out of scope for this instruction. The package build of the SVG import was not exercised.
