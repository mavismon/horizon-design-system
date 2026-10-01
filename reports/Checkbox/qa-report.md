# QA Report — Checkbox

Source: [Figma node 118:2](https://www.figma.com/design/dIHHqSq8c75n4olME0s9JS/Core-Component?node-id=118-2) (component set 117:23; variants 117:12 unchecked, 117:15 checked)
Component: `src/components/Checkbox/Checkbox.tsx` (branch `build/checkbox`, commit `5f824e8`)

## Staging QA pass — 2026-10-01

**Environment:** a real Vercel preview deployment of branch `build/checkbox` (`https://horizon-design-system-cdfi-dqc2cl6qn-mavis17.vercel.app`), not production and not `main`. Measured in a browser by the orchestrating session, since the qa subagent has no browser. Expectations come from Figma via `get_design_context` (the checked fill from the exported box SVG), not from the story file.

| Case | Expected (Figma) | Measured (live) | Result |
|---|---|---|---|
| unchecked, ShowLabel true | 16×16, `#f9fafb`, 1px `#c8d2dd`, radius 2px, gap 10px, label Inter 13/20 `#4d5361` | same; tick hidden | ✅ Pass |
| checked, ShowLabel true | 16×16, fill `#3B71F2`, white tick, same label | `rgb(59,113,242)`, tick shown, same label | ✅ Pass |
| unchecked, ShowLabel false | box only | box only, `aria-label` present | ✅ Pass |
| checked, ShowLabel false | filled box with tick only | same | ✅ Pass |

Behaviour: clicking the label toggles the box. A real Tab shows the browser's native focus ring (`outline: auto`), and Space toggles. Console clean. Four `Staging Testing` rows written, all `Passed`, linked to the Checkbox row. Figma states are logged as `idle` (unchecked) and `selected` (checked) because no matching options exist.

**Not failed, by decision:** the raw `10px` gap and `16px` box size (covered by the 2026-10-01 `decisions.md` ruling); the `error` state, described in Figma but not drawn; and disabled, hover, focus and indeterminate, which Figma does not draw. A disabled checkbox looks identical to an enabled one, which is a gap for the designer.

**Notes:** Figma's checked/unchecked property is named `state` (boolean in the codegen); the code uses `checked`/`defaultChecked`/`onChange`. The Figma primary variable (`#3b71f2`) is darker in the token pipeline (`#2b5ad6`); the checked fill uses `--color-interactive-primary` (`#3b71f2`), which matches Figma exactly.

## Summary: PASS
