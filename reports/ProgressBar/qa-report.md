# QA Report — ProgressBar

Source: [Figma node 140:66](https://www.figma.com/design/dIHHqSq8c75n4olME0s9JS/Core-Component?node-id=140-66) (component set 140:66; 8 cells in Figma: size md/sm × tone primary/success/neutral/inverse; 6 built)
Component: `src/components/ProgressBar/ProgressBar.tsx` (branch `build/progressbar`, commit `e01625a`)

## Staging QA pass — 2026-10-02

**Environment:** a real Vercel preview deployment of branch `build/progressbar` (`https://horizon-design-system-cdfi-kzyogvab8-mavis17.vercel.app`), not production and not `main`. Measured in a browser by the orchestrating session, since the qa subagent has no browser. Expectations come from Figma via `get_design_context` on 140:66.

| Case | Expected (Figma) | Measured (live) | Result |
|---|---|---|---|
| md / primary (140:5) | 300px wide; label Inter 13/20 `#161925` left, value Inter SemiBold 13/20 right; 8px track `#f2f3f5`, fully rounded; fill 60%; helper 11/16 `#4d5361`; 4px gaps | native `<progress value=60 max=100>`; root 300px; track 8px, radius 999px; gap 4px; label 13px/20px 400, value "60%" 13px/20px 600; helper 11px/16px 400 `rgb(77,83,97)`; fill 60% with rounded ends | ✅ Pass |
| sm / primary (140:17) | same with a 6px track | track 6px, otherwise as md | ✅ Pass |
| md / success (140:24) | fill `--color-status-success` `#229c4a` | fill `rgb(34,156,74)` | ✅ Pass |
| sm / success (140:31) | 6px track, `#229c4a` | 6px, `rgb(34,156,74)` | ✅ Pass |
| md / neutral (140:38) | fill `--color-text-secondary` `#4d5361` | fill `rgb(77,83,97)` | ✅ Pass |
| sm / neutral (140:45) | 6px track, `#4d5361` | 6px, `rgb(77,83,97)` | ✅ Pass |

Six `Staging Testing` rows written, all `Passed`, linked to the ProgressBar row. Figma has no states, so each is logged as `idle`. Console clean.

**Accessibility:** the element is a native `<progress>`; its name comes from `aria-labelledby` ("Label") and its description from `aria-describedby` ("Helper text"). Value 60 of 100.

**Measurement note:** the computed style of the `::-webkit-progress-value` pseudo-element is not reliable in this browser (it reported the track colour for every tone). The fill colours were verified from the component's own `--hz-progressbar-fill` variable, which resolves to `#2b5ad6`, `#229c4a` and `#4d5361`, and by looking at the rendered pixels (blue, green and dark grey fills at 60% width with rounded ends on a light track).

**Not failed, by decision:**
- The primary fill uses the bound token `--color-primary-default`, which the token build renders as `#2b5ad6` (darkened for WCAG AA) while Figma shows `#3b71f2`. Accepted, as for Button and Chip.
- The `inverse` tone is not built. In Figma its track and its fill are the same colour (`#f9fafb`), so the bar would show no visible fill. This is an unresolved design bug for the designer, and the user chose to build only the three working tones.
- The track heights `8px` and `6px` are the two px literals in `ProgressBar.css` (lines 50 and 60), covered by a `decisions.md` ruling.
- One `value` prop (0 to 100, clamped, default 60) sets the fill and prints `${value}%`, instead of Figma's separate typed text. The clamp and the visible text were not exercised interactively (the stories are static).
- No hover, focus, disabled, loading or indeterminate states, because Figma draws none.

## Summary: PASS
