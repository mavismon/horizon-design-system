---
name: build
description: Two build procedures for the Horizon Design System — (1) the token pipeline (Style Dictionary), used when tokens/*.json or build-tokens.js changes, and (2) turning one Figma design node into one component under src/components/, used by the engineer agent on a To-do or To be fixed registry row.
---

# Build

Two distinct procedures share this file because they share an owner (`engineer`) and a repo. Use the section that matches the work.

## A. Token pipeline build

Runs the token pipeline defined in `build-tokens.js` and checks the result.

### Steps

1. Run the build:
   ```bash
   node build-tokens.js
   ```
   (equivalent to `npm run build:tokens`)

2. Confirm all four outputs were written with no errors:
   - `build/css/tokens.css` — `:root`, core + light colors + web typography + styles
   - `build/css/tokens-dark.css` — `[data-theme="dark"]`, only dark color overrides
   - `build/ios/Tokens.swift`
   - `build/android/colors.xml`

3. Read any warnings printed by Style Dictionary (not just errors). Known benign one: "Unknown CSS Font Shorthand properties" for composite typography tokens — pre-existing, not a regression. Any other warning (unresolved reference, missing token, transform failure) should be investigated.

### Common failure modes in this repo

- **Renamed token files**: `build-tokens.js` hardcodes the token file names it reads (`CORE`, `STYLES`, and the per-platform `source` arrays). If a Figma export renames or restructures a file under `tokens/`, the build throws "file not found" or silently drops tokens. Fix the references in `build-tokens.js` to match `ls tokens/`.
- **Font weight names with spaces**: Figma sometimes exports `fontWeight` as `"Semi Bold"` instead of `"SemiBold"`. The `WEIGHTS` map in `build-tokens.js` keys on the no-space form — the preprocessor strips whitespace before lookup. If a new weight name shows up unmapped, add it to `WEIGHTS`.
- **Unresolved token aliases**: a token value like `"{color-gray-900}"` that doesn't exist in `core.value.tokens.json` fails silently in some formats or throws in others — grep for the alias name across `tokens/` if the build complains.

### After building

`build/` is gitignored — nothing to commit there. If `build-tokens.js` itself changed, that's the file to stage/commit.

## B. Component build

Turns one Figma design node into one component under `src/components/[Name]/`, in ordered stages, each with a check that must be green before moving to the next. Triggered when a `Components` registry row reads `To-do` (fresh build) or `To be fixed` / `Fixing` (repair round) — see the `registry` skill for what that status means and what evidence unlocks it.

### Stages

1. **Read the design, write down the full variant matrix.** Every variant × size × state combination the node publishes. A property the design leaves unbound (no value, no clear default) is a design gap to report — not a decision to make quietly. This repo's existing components use CSS Modules (`[Name].module.css`) and a `Storybook` story per component (`[Name].stories.tsx`) — follow that shape, e.g. `src/components/Button/Button.tsx` + `Button.module.css` + `Button.stories.tsx`.
2. **Resolve every value to a semantic token** from `tokens/semantic.*.tokens.json` (rebuilt into `build/css/tokens.css` by the token pipeline above). Report unbound values rather than substituting a raw hex/px — grep `build/css/tokens.css` for the nearest existing token before assuming one is missing.
3. **Implement**, with real behavior for every state (an actual `disabled` attribute, an actual `:hover`/`:focus-visible` rule) rather than a class that only changes color.
4. **Verify what's mechanically checkable without a browser**: `tsc --noEmit`, `npm run build-storybook` completing without error, and (if run as a subagent — see the Browser limitation note in `engineer.md`) confirming each story ID responds with a real page rather than an error, e.g. via `curl`. That is a weak proxy for "renders correctly," not a substitute — it can't catch a visually wrong layout or a broken interaction. A genuine render-and-compare-against-the-node check needs a real browser, which this agent doesn't have; note in the handoff that this step is still owed.
5. **Commit and hand off**: once the mechanical checks in step 4 are green, commit and push, then write `Commit` and the `GitHub Commits` link (both git-verifiable, no browser needed) per the `registry` skill. Do **not** write `Staging Storybook` — deploying, opening the result, and watching it render is the orchestrating session's job (see `engineer.md`'s Browser limitation note), and that session writes the link once it has actually seen it render.

State clearly, in the handoff report, any property the design left unbound — that's a gap for a human, not something to guess at.

