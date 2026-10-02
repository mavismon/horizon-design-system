# QA Report — Logo

Source: [Figma node 137:18](https://www.figma.com/design/dIHHqSq8c75n4olME0s9JS/Core-Component?node-id=137-18) (component set 137:17; variants 137:6 type=lockup, 137:12 type=mark)
Component: `src/components/Logo/Logo.tsx` (branch `build/logo`, commit `0430408`)

## Staging QA pass — 2026-10-02

**Environment:** a real Vercel preview deployment of branch `build/logo` (`https://horizon-design-system-cdfi-lzickwi5j-mavis17.vercel.app`), not production and not `main`. Measured in a browser by the orchestrating session, since the qa subagent has no browser. Expected sizes were read from Figma (`get_metadata` and `get_design_context` on 137:17).

| Case | Expected (Figma) | Measured (live) | Result |
|---|---|---|---|
| type=lockup (137:6) | 162×32; 32×32 mark (`#3B82F6` tile, white sun and wave); 8px gap (`--spacing-sm`); wordmark "Horizon Stays", Inter semibold 18px/26px, `#2e7cc4` | height 32; mark 32×32, loaded; gap 8px; wordmark 18px/26px, weight 600, `rgb(46,124,196)`; mark `alt` empty | ✅ Pass (width unverified, see below) |
| type=mark (137:12) | 32×32 mark only | 32×32, SVG loaded, blue tile with white sun and wave; `alt="Horizon Stays"` | ✅ Pass |

Console clean. Two `Staging Testing` rows written, both `Passed`, linked to the Logo row. Figma has no states, so both are logged as `idle`.

**Limitation (not a defect):** Inter is not installed or loaded in the test browser. The wordmark measured 108.51px with `Inter` and 108.51px with a made-up fallback font, so it renders in the browser's default serif. The overall lockup width (148.5px measured against Figma's 162px) and the wordmark glyph shapes therefore could not be verified. The design system ships no font files, and the 32px height, the mark, the gap, the font size, line height, weight and colour are all verified.

**Not failed, by decision:**
- The wordmark colour `#2e7cc4` is the one hex literal in `Logo.css` (line 20). Figma binds no variable to it, and the Figma description says the brand colours are fixed on purpose and do not follow the UI tokens. The user chose to allow it under a `decisions.md` ruling.
- The mark is an `<img>` at the SVG's own 32×32 with no CSS size, so there is no px literal for its height. `alt` defaults to empty on the lockup and to "Horizon Stays" on the mark-only variant (the user's choices).
- Not built, because Figma does not draw them: a size prop, a dark-background version (the Usage text says none exists yet), and any link behaviour.

## Summary: PASS
