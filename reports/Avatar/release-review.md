# Avatar · release review

- **Reviewed SHA:** `16984a7e2905ab09b96f7376dbb6d8a1e81fc04e` (`intent/avatar-usage`, one commit on top of `origin/staging` `909ab5c`). Source differs from the previously reviewed `8945957` only in `src/components/Avatar/Avatar.intent.json` (`git diff 8945957 16984a7 -- . ':!reports'` lists that one file). This report is committed on top of the reviewed SHA.
- **Date:** 2026-10-01
- **Verdict:** **Cleared**
- **Reviewer:** release agent, running `release-review`
- **Board row:** Avatar (`rectJuhuTajVVrT4f`). The row was read fresh before this review: `Development` = `Released`, `Release Verdict` = `Cleared` (from the `8945957` review), `Astro Link` = `https://horizon-docs-zeta.vercel.app/core/components/avatar/`, `Last Modified` = 2026-10-01T08:47:52Z.
- **Supersedes:** the `Cleared` review at `8945957`. Every gate and check below was run fresh, not carried over.

`decisions.md` was read in full at the reviewed SHA. One ruling is applied (G2, quoted below). The three 2026-09-28 rulings (Button values, npm token type, keeping 2FA on publish) don't bear on Avatar.

## Gates and checks

| # | Gate / check | Result | Evidence |
|---|---|---|---|
| G1 | Done | Pass | The row reads `Released`, which sits above `Completed` in the `Development` formula and needs `Production Storybook` to have been set. `Production Storybook` opens: `iframe.html?id=components-avatar--all-sizes` returns 200 at `https://horizon-design-system-cdfi.vercel.app`, and `index.json` lists `components-avatar--sm`, `--md`, `--lg` and `--all-sizes`. `Avatar.tsx`, `Avatar.css` and the stories are unchanged between `8945957` and `16984a7`. |
| G2 | Tokens | Pass (ruling) | The only hex or px literals in `src/components/Avatar/Avatar.css` are `width`/`height: 24px` (lines 13, 14), `30px` (18, 19) and `40px` (23, 24). No hex values and no `var()` fallbacks; the only token read is `var(--radius-full)` (line 8). All six literals are covered exactly by the ruling quoted below. |
| G3 | Surface | Pass | `src/index.ts:3` exports `Avatar`, `src/index.ts:4` exports `AvatarProps` and `AvatarSize`. Added deliberately in the Avatar build commit. |
| G4 | Names | Pass | Folder `src/components/Avatar/`, symbol `Avatar` (`Avatar.tsx:18`), CSS prefix `hz-avatar`, intent `Avatar.intent.json`, board row `Avatar`. |
| G5 | States | Pass | Figma node `113:2` (component `112:9`) publishes `size=sm`, `md`, `lg` and no other variant or state. `AvatarSize` (`Avatar.tsx:4`) is the same three values. Stories `Sm`, `Md`, `Lg`, `AllSizes` exist and appear in the deployed `index.json`. |
| G6 | Intent | Pass | `Avatar.intent.json` exists at the reviewed SHA and passes checks 1 to 6 below (check 2 has nothing to flag). |
| G7 | Version | Pass | `VERSIONING.md` exists at the reviewed SHA and states the 0.x bump rules, what counts as public and what 0.1.0 commits you to. Standing note, not a finding on this review: line 35 says 0.1.0 "contains one component, `Button`". True of 0.1.0 as published; it goes stale once a version containing Avatar ships, and a human must update it then. This review did not edit it. |
| C1 | Fields present | Pass | All seven fields are present with the right types. `use_when` (3 strings) and `dont_use_when` (3 objects of `when` + `instead`) are now filled; `variant_intent` (3 keys), `required_tokens` (1) and `a11y` (1) are as before; `placement` and `pairs_with` are `[]` (the stories render Avatar on its own, so there is no placement or pairing to record). |
| C2 | Alternatives named | Pass, no warnings | All three `dont_use_when` entries have a non-empty `instead`: `Logo`, `Image`, `Button or Link`. See "How check 2 treats unbuilt alternatives" below. |
| C3 | a11y specific | Pass | One entry: the photo is a native `<img>` whose alt text comes from the `alt` prop, defaulting to an empty string. `Avatar.tsx:21` is `{src && <img src={src} alt={alt} className="hz-avatar__image" />}` and the default `alt = ""` is on line 18. The cited line exists at the reviewed SHA and implements the fact. The new `dont_use_when` text about an accessible name via Button or Link is a Figma usage statement, not an `a11y` entry, so it needs no source line. |
| C4 | Tokens resolve | Pass | `npm run build:tokens` at the reviewed SHA wrote `build/css/tokens.css`. `--radius-full` is defined there (line 42, `999px`). The set of `var(--…)` names in `Avatar.css` is `{--radius-full}`, identical to `required_tokens`. |
| C5 | Variants covered | Pass | `variant_intent` keys are `sm`, `md`, `lg`, exactly the `AvatarSize` union (`Avatar.tsx:4`). |
| C6 | No duplicate job | Pass | `use_when` is now filled, so the comparison is real this time. Compared with the only other intent file, `Button.intent.json`: Button's seven items are triggering a primary action, a single clear next step, calls-to-action, secondary actions, opening a modal or view, destructive actions, and forms/toolbars/cards/dialogs. Avatar's three are showing the signed-in user's profile photo, representing a person next to their name or content, and which size to use where. No item is shared or restated, so neither component claims the other's job. Avatar's third `dont_use_when` entry points at Button, which is the opposite of claiming its job. |

## Intent content against Figma 113:7

Read with `get_design_context` at review time. The three `use_when` items and the three `dont_use_when` items match the "Use an Avatar" and "Do not use an avatar" lists word for word and in order (nodes 115:6, 115:13, 115:19 and 115:25, 115:31, 115:37). Each `instead` is the component the sentence names. Nothing is invented. The "Best Practice" items (nodes 115:47 to 115:71, five of them) are not in the file because the file has no field for them; this is intentional per `component-intent`, and they remain in Figma.

## How check 2 treats unbuilt alternatives

Check 2 asks one thing: is `instead` non-empty. It doesn't check that the named component exists, in `src/components/`, on the board or in the package. `Logo`, `Image` and `Link` are not built (only `Button` and `Avatar` exist under `src/components/`), and `Button or Link` is half built. The check therefore passes all three entries with no warning. This is recorded here so the reader isn't left thinking the pointers resolve: today they point at components consumers can't import. Button's intent already does the same (`Link`, `Badge/Lozenge`, `Toggle or Checkbox`), so this isn't new. The user decided to keep the pointers as written in Figma.

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

**Staying inside the boundary.** The file's six literals match the table value for value, property for property and line for line, and there are no others. No `var()` fallback, no value in another component, no changed number. `Avatar.css` is unchanged from `8945957`, and `decisions.md` at `16984a7` still contains the ruling. No avatar size token exists in `build/css/tokens.css`, so the ruling still applies. The ruling's "Not ruled" line also names "the empty `use_when` / `dont_use_when`" as a Figma gap; that gap is now closed by the intent commit, and the ruling is not stretched to cover anything else. The missing photo fallback remains a Figma gap (Figma's own best-practice item says "There's no fallback for a missing photo yet").

## Failures

None.

## Warnings (not blocking)

None from check 2. See the unbuilt-alternatives note above, which is informational.

## Other findings (outside the gates)

- **The live docs page is behind the new intent.** Step 2 (read the production docs page first) was done this time: `Astro Link` opens (200). It was built from `8945957` and still reads "Missing source … use_when is empty" for "When to use it" and "When not to use it". That differs from the source at `16984a7`. It is not a gate failure, and resolves when `doc-generator` restages the page and `devops` pushes it after this intent merges.
- **`variant_intent` values are Figma-derived fragments, not verbatim.** `sm` "dense lists, inline with text", `md` "the header avatar", `lg` "profiles, message threads" are shortened from the third `use_when` item. They are unchanged from the earlier review and the check only needs the keys, so this is not a finding against the gates. `component-intent` says to copy Figma wording and never shorten it, so the owner (`doc-generator`) may want to decide whether these should stay.
- **`VERSIONING.md` line 35** is a standing human task (see G7).
- **Staleness.** The row's `Last Modified` (2026-10-01T08:47:52Z) is earlier than the reviewed commit (2026-10-01T09:53:42+01:00 = 08:53:42Z), so the review isn't stale on entry. Writing the two registry cells will move `Last Modified` later than the commit again, which is the standing problem noted in earlier reviews.
- **Not run here.** Package preflight, the package and docs tracks, any version bump, publish or merge. Out of scope for this instruction.
