# QA Report — Chip

Source: [Figma node 122:2](https://www.figma.com/design/dIHHqSq8c75n4olME0s9JS/Core-Component?node-id=122-2) (component set 121:15; variants 121:8 unselected, 121:11 selected, 121:13 selected-strong)
Component: `src/components/Chip/Chip.tsx` (branch `build/chip`, commit `25239c9`)

## Staging QA pass — 2026-10-01

**Environment:** a real Vercel preview deployment of branch `build/chip` (`https://horizon-design-system-cdfi-8sb57djm3-mavis17.vercel.app`), not production and not `main`. Measured in a browser by the orchestrating session, since the qa subagent has no browser. Expectations come from Figma via `get_design_context`, not the story file.

| Case | Expected | Measured (live) | Result |
|---|---|---|---|
| unselected | 32px pill, radius 999px, 1px `#d7dee7` border, bg `#f9fafb`, padding-x 16px, label Inter Medium 12/18 `#4d5361` | 32px, 999px, `rgb(215,222,231)`, `rgb(249,250,251)`, 16px, Inter 12px/18px 500, `rgb(77,83,97)`; `aria-pressed=false` | ✅ Pass |
| selected (blue) | same, fill+border `--color-primary-default`, label `#f9fafb` | fill+border `rgb(43,90,214)` (`#2b5ad6`), label `rgb(249,250,251)`; `aria-pressed=true` | ✅ Pass (see note) |
| selected-strong (navy) | same, fill+border `--color-bg-inverse` `#161925`, label `#f9fafb` | `rgb(22,25,37)`, label `rgb(249,250,251)`; `aria-pressed=true` | ✅ Pass |

Behaviour: it is a native `<button type="button">`; Tab shows the browser's native focus ring (`outline: auto`). Console clean. Three `Staging Testing` rows written, all `Passed`, linked to the Chip row. Figma `unselected` is logged as `idle` and `selected-strong` as `selected` (no matching options exist; the Variants column carries the real names).

**Not failed, by decision:**
- **Selected colour:** Figma shows `#3b71f2`, but the bound token `--color-primary-default` renders `#2b5ad6` (darkened for WCAG AA; white text on `#3b71f2` is 4.16:1). The user chose to use the bound token, as Button does.
- **Height:** the single `height: 32px` literal (with `box-sizing: border-box`) was chosen by the user in place of Figma's 7px padding.
- **Undrawn states:** hover, focus, disabled and pressed are not drawn in Figma and are not styled.

**Notes:** clicking a chip does not change its state in Storybook, because `state` is a prop (a controlled component); the stories are static. The Figma stroke sits inside the 32px frame, so the CSS uses `border-box` to match.

## Summary: PASS
