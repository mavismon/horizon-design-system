# QA Report — Button

Source: [Figma node 19:31](https://www.figma.com/design/dIHHqSq8c75n4olME0s9JS/Core-Component?node-id=19-31)
Component: `src/components/Button/Button.tsx`
Tested: Storybook (`npm run storybook`, localhost:6006), TypeScript (`tsc --noEmit`)

## Summary: PASS

Renders correctly, token-accurate, and type-checks clean. The contrast finding
below was fixed at the token level by the `engineer` agent. One new, unrelated
finding (dark-mode hover contrast) surfaced while verifying the fix and needs a
design/token decision — see [Finding 2](#2-dark-mode-hover-fails-contrast-new-unfixed).

## Checks performed

| Check | Result |
|---|---|
| All 5 states render (Default, Hover, Error, Outline, Outline Error) | ✅ Pass |
| Computed bg/text colors match Figma tokens exactly | ✅ Pass |
| Border radius (`--radius-sm`, 6px) | ✅ Pass |
| Typography (`Inter`, 10px / 16px line-height) matches Figma | ✅ Pass |
| Semantic markup (`<button type="button">`, decorative icons `alt=""`) | ✅ Pass |
| Accessible name resolves to visible label text | ✅ Pass |
| Keyboard focus shows visible ring (`:focus-visible`, `--color-border-focus`, 2px) | ✅ Pass |
| Storybook controls (`text`, `startIcon`, `endIcon`, `state`) update live | ✅ Pass |
| Button sizes to content instead of a hardcoded width (tested with longer label) | ✅ Pass |
| Icon asset committed locally (not dependent on the 7-day Figma asset URL) | ✅ Pass |
| `tsc --noEmit` | ✅ Pass (0 errors) |
| Console errors/warnings during render | ✅ None from Button; Storybook's own framework warnings only |
| Text/background contrast (WCAG 2.1 AA, 4.5:1 for normal text — 10px counts as normal, not large) | ⚠️ Fails in 3 of 5 states |

## Findings

### 1. Contrast failed WCAG AA in 3 of 5 states (Fixed)

Originally measured:

| State | Foreground / Background | Contrast ratio | AA (4.5:1) |
|---|---|---|---|
| default | `#f9fafb` on `#3b71f2` | 4.16:1 | ❌ Fail |
| hover | `#f9fafb` on `#2b5ad6` | 5.68:1 | ✅ Pass |
| error | `#f9fafb` on `#ea3d3d` | 3.84:1 | ❌ Fail |
| outline | `#161925` on transparent (white) | 17.50:1 | ✅ Pass |
| outline-error | `#ea3d3d` on transparent (white) | 4.01:1 | ❌ Fail |

**Fix applied** by the `engineer` agent in
[tokens/semantic.light.tokens.json](../../tokens/semantic.light.tokens.json):
re-aliased `color-primary-default`, `color-status-error`, and `color-negative-default`
from their `/500` scale step to the existing `/600` step already present in
`tokens/core.value.tokens.json` (no new primitive invented). `color-primary-hover`
and `color-negative-hover` were bumped `/600` → `/700` in turn, to stay one step
darker than the new `/default` values per their own token descriptions.

Re-verified in Storybook after rebuilding tokens — all 5 states now pass:

| State | Foreground / Background | Contrast ratio | AA (4.5:1) |
|---|---|---|---|
| default | `#f9fafb` on `#2b5ad6` | 5.68:1 | ✅ Pass |
| hover | `#f9fafb` on `#1d44ba` | 7.76:1 | ✅ Pass |
| error | `#f9fafb` on `#d02727` | 5.02:1 | ✅ Pass |
| outline | `#161925` on transparent (white) | 17.50:1 | ✅ Pass |
| outline-error | `#d02727` on transparent (white) | 5.25:1 | ✅ Pass |

`node build-tokens.js` output is unchanged (no new warnings) and no previously-passing
state regressed.

### 2. Dark-mode hover fails contrast (New, unfixed)

While re-verifying Finding 1 across both themes, the engineer found dark-mode
`hover` at **1.99:1** — a failure unrelated to the fix above. Cause:
`color-interactive-on-primary` stays `{color-gray-50}` (near-white) in
**both** themes in
[tokens/semantic.dark.tokens.json](../../tokens/semantic.dark.tokens.json), while
dark-mode `color-primary-hover` intentionally goes *lighter* than `/default`
(`blue-300`, the inverse of light mode's darkening direction) — near-white text
on a near-white hover fill. `color-text-inverse` already flips to `gray-900` in
dark mode for exactly this reason; `color-interactive-on-primary` doesn't, which
looks like an oversight rather than something this session introduced.

This wasn't fixed — it's a token-semantics call (should this token flip per-theme
like `color-text-inverse` does?) rather than an obvious value swap, and it's not
currently visible in Storybook since there's no dark-mode toggle wired up yet.
Flagging for a design/token-owner decision before it's fixed.

## Fixed during this session (for the record, not action items)

- **Storybook was fully broken before Button existed** — every story, including
  Storybook's own onboarding page, failed with `Uncaught SyntaxError: ... does not
  provide an export named 'default'` for `react`. Root cause: the dependency
  pre-bundler wasn't including bare `react` (only `react-dom` variants), so it
  served the raw CommonJS file unprocessed. Fixed via `optimizeDeps.include` in
  [.storybook/main.ts](../../.storybook/main.ts).
- **Missing `vite-env.d.ts`** caused `tsc` to report `Cannot find module '*.svg'`
  and `'*.module.css'` (worked fine at runtime via Vite, just untyped for
  standalone type-checking). Fixed by adding
  [src/vite-env.d.ts](../../src/vite-env.d.ts).
