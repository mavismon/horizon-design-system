# QA Report — Toggle

Source: [Figma node 144:20](https://www.figma.com/design/dIHHqSq8c75n4olME0s9JS/Core-Component?node-id=144-20) (component set 144:20; 8 cells: size md/sm × state off/on/disabled-off/disabled-on)
Component: `src/components/Toggle/Toggle.tsx` (branch `build/toggle`, commit `c70925e`)

## Staging QA pass — 2026-10-02

**Environment:** a real Vercel preview deployment of branch `build/toggle` (`https://horizon-design-system-cdfi-dg1424gkq-mavis17.vercel.app`), not production and not `main`. Measured in a browser by the orchestrating session, since the qa subagent has no browser. Expectations come from Figma (the engineer read the exported cell SVGs and `get_variable_defs`; geometry and colours below are those values).

| Case | Expected (Figma) | Measured (live) | Result |
|---|---|---|---|
| md / off (144:4) | 44×24 track, `#C8D2DD`, 20px knob `#F9FAFB` inset 2px, left | 44×24, `rgb(200,210,221)`, 2px transparent border inset, knob 20×20, `flex-start` | ✅ Pass |
| sm / off (144:6) | 40×22, `#C8D2DD`, 18px knob, left | 40×22, same colour, knob 18×18, left | ✅ Pass |
| md / on (144:8) | 44×24, `--color-primary-default`, knob right | 44×24, `rgb(43,90,214)`, knob 20×20, `flex-end` | ✅ Pass (see note) |
| sm / on (144:10) | 40×22, primary, knob right | 40×22, `rgb(43,90,214)`, knob 18×18, right | ✅ Pass (see note) |
| md / disabled-off (144:12) | 44×24, `#E5E7ED`, knob left | 44×24, `rgb(229,231,237)`, disabled, `cursor: not-allowed`, knob left | ✅ Pass |
| sm / disabled-off (144:14) | 40×22, `#E5E7ED`, knob left | 40×22, same, disabled, knob 18×18 | ✅ Pass |
| md / disabled-on (144:16) | 44×24, primary at 40% alpha, opaque knob right | 44×24, `#2b5ad6` at 0.4, disabled and checked, knob 20×20 opaque, right | ✅ Pass |
| sm / disabled-on (144:18) | 40×22, primary at 40% alpha, knob right | 40×22, same, knob 18×18 right | ✅ Pass |

Eight `Staging Testing` rows written, all `Passed`, linked to the Toggle row. Figma's combined `state` is logged as `idle` (off), `selected` (on) and `disabled` (both disabled cells). Console clean.

**Behaviour (real input events):** clicking an enabled switch toggles it (the knob moves from left to right and the colour changes); clicking a disabled switch does nothing; Tab goes to the first enabled switch and shows the browser's native focus ring (`outline: auto`); Space toggles it; five Tab presses leave the four enabled switches, so the four disabled ones are skipped.

**Layout technique:** the engineer replaced the px values with CSS: width from `aspect-ratio` (11 / 6 for md, 20 / 11 for sm), the knob from `height: 100%` plus `aspect-ratio: 1`, the 2px inset from a transparent `var(--border-width-md)` border, and the knob position from flex. The rendered sizes are exactly Figma's (44×24, 40×22, 20px and 18px knobs).

**Not failed, by decision:**
- The on track uses the bound token `--color-primary-default` (`#2b5ad6`, darkened for WCAG AA) where Figma shows `#3b71f2`. Accepted, as for Button, Chip and ProgressBar.
- The two track heights (`24px` line 16, `22px` line 21) and the one 40% alpha (line 45) are the literals in `Toggle.css`, covered by a `decisions.md` ruling.
- **Low contrast, as drawn (for the designer):** the off track (`#C8D2DD`) on a light page is about 1.5:1, below the 3:1 non-text contrast guideline, and the knob on the disabled-off track (`#E5E7ED`) is about 1.2:1, nearly invisible. The user chose to build it as drawn.
- No hover, pressed, error or loading states and no built-in label, because Figma draws none.

**Not checked:** Firefox. The knob uses `::before` on an `appearance: none` input as a flex item, which the engineer expects to work in Chromium, Safari and Firefox; only Chromium was tested here.

## Summary: PASS
