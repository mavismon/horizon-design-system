# QA Report — Dropdown

Source: [Figma node 57:1641](https://www.figma.com/design/dIHHqSq8c75n4olME0s9JS/Core-Component?node-id=57-1641) (component set 199:66; size md/sm × state closed/open/disabled; usage frame 200:30)
Component: `src/components/Dropdown/Dropdown.tsx` (branch `build/dropdown`, commit `7adcd52`)

## Staging QA pass — 2026-10-04

**Environment:** a real Vercel preview deployment of branch `build/dropdown` (`https://horizon-design-system-cdfi-2190ixtos-mavis17.vercel.app`), not production and not `main`. Measured in a browser by the orchestrating session, since the qa subagent has no browser. Expectations come from Figma via `get_design_context` and `get_metadata`.

| Case | Expected (Figma) | Measured (live) | Result |
|---|---|---|---|
| md closed (199:12) | 36px field | 240×36, bg `#f9fafb`, border `#d7dee7`, 12px Inter | ✅ Pass |
| sm closed (199:39) | 30px field | 240×30, same colours | ✅ Pass |
| md open (199:18) | focus-blue border, up chevron, menu 4px below, first option light blue medium weight | border `#1d44ba`, `aria-expanded=true`, menu 4px below, 4 options of 30px, selected bg `#eff3ff` weight 500, others 400 | ✅ Pass (see shadow note) |
| sm open (199:45) | as md open, 30px field | same values at 30px | ✅ Pass |
| md disabled (199:33) | grey fill, grey text and chevron | bg `#e5e7ed`, text `#d1d5db`, button disabled | ✅ Pass |
| sm disabled (199:60) | as md disabled at 30px | same at 30px | ✅ Pass |
| ShowLabel off | no visible label | renders field only; label becomes `aria-label` | ✅ Pass |
| Keyboard | — | Enter, Space, ArrowDown, ArrowUp open; arrows, Home, End move the active option; Enter, Space, click select and return focus to the field; Escape closes; a real outside click closes | ✅ Pass |

Eight `Staging Testing` rows written, all `Passed`, linked to the Dropdown row. Figma's `state` is not a prop: closed is logged as `idle`, open as `focus`. Console clean.

**Limitations (not defects):** Inter is not installed in the test browser, so text widths are unverified. Dark mode, long-value truncation and the `name` hidden input were not tested.

**Not failed, by decision:**
- Menu shadow: Figma draws `0 4 12 rgba(15,23,41,.08)`; the code uses the nearest token `--elevation-md` (`0 4 8`, alpha .12). Designer to bind the effect style or add a matching token.
- Figma draws no hover, pressed, error or keyboard-focus styling; the engineer added keyboard focus (focus-blue border, outline) only, and deliberately no hover.
- The menu is an absolutely positioned overlay 4px below the field (Figma places it in flow), so opening does not push content.
- `options`, `value`, `defaultValue`, `onValueChange`, `open`/`defaultOpen`, `onOpenChange` and `name` are not Figma properties; they were added so the component is usable.
- No raw px or hex in `Dropdown.css` (paddings are token arithmetic), so no `decisions.md` ruling is needed.
- Composes no existing Horizon component (Button, ButtonGroup and Chip appear in the usage notes only as alternatives).

## Summary: PASS
