# QA Report — SearchBar

Source: [Figma node 213:54](https://www.figma.com/design/dIHHqSq8c75n4olME0s9JS/Core-Component?node-id=213-54) (component set 213:54; 7 cells: type field × size md/lg × state empty/focused/filled, plus type stay, size lg, state filled; usage frame 214:29). The registry link (57-1645) is the canvas page, not a component.
Component: `src/components/SearchBar/SearchBar.tsx` (branch `build/searchbar`, commit `96ecae0`)

## Staging QA pass — 2026-10-04

**Environment:** a real Vercel preview deployment of branch `build/searchbar` (`https://horizon-design-system-cdfi-g8bq9ok34-mavis17.vercel.app`), not production and not `main`. Measured in a browser by the orchestrating session, since the qa subagent has no browser. Expectations come from Figma via `get_metadata` and `get_design_context` on 213:54.

| Case | Expected (Figma) | Measured (live) | Result |
|---|---|---|---|
| field / md / empty (213:2) | 320×36, icon 14px, placeholder | 320×36, bg `#f9fafb`, 1px solid `#d7dee7`, radius 2px, icon 14px at x=12, input at x=34 | ✅ Pass |
| field / md / focused (213:6) | focus-blue border | border `#1d44ba` | ✅ Pass |
| field / md / filled (213:10) | value and × clear | value shown with × | ✅ Pass |
| field / lg / empty (213:16) | 320×44 | 320×44 | ✅ Pass |
| field / lg / focused (213:20) | focus-blue border | border `#1d44ba` | ✅ Pass |
| field / lg / filled (213:24) | value and × clear | value shown with × | ✅ Pass |
| stay / lg / filled (213:30) | 960×56, four columns, three 1px×32px dividers, Search Button 80 wide | 960×56, four 185×38 columns, dividers 1×32 `#eef1f5`, Button 80×36 | ✅ Pass |

Seven `Staging Testing` rows written, all `Passed`, linked to the SearchBar row. State mapping: empty → idle, focused → focus, filled → filled; stay is drawn once and logged as lg / filled. Console clean.

**Behaviour (real events):** typing shows the × clear; × empties the field and refocuses it; Enter fires `onSearch` ("Last search: lisbon"); the native search clear is suppressed; the stay Search button increments the counter.

**Limitations (not defects):** Inter is not installed in the test browser, so text widths are unverified. Font size and line height were checked from token values, not computed styles. Dark mode was not tested.

**Not failed, by decision:**
- Stay parts (Where, Check in, Check out, Guests) are drawn as static text in Figma and rendered as non-interactive spans, so they are not keyboard reachable. Accessibility gap for the designer.
- Figma draws no hover, disabled or error state. Figma `state` is only an initialiser; focus follows `:focus-within`.
- `defaultValue`, `onValueChange`, `onSearch`, `onClear`, `label` and `name` are not Figma properties; they were added so the component is usable. The clear button's focus ring is an engineer addition.
- The search and clear SVG icons carry `width="14" height="14"` as intrinsic size; no token matches 14px. No hex and no px in `SearchBar.css`; sizes come from token arithmetic.
- Specimen instances 214:14, 214:19 and 214:24 are drawn at 47, 46 and 57 high; treated as board artefacts and not tested.
- Composes Button (the stay variant's Search button).

## Summary: PASS
