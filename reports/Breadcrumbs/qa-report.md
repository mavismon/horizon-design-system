# QA Report — Breadcrumbs

Source: [Figma node 163:2](https://www.figma.com/design/dIHHqSq8c75n4olME0s9JS/Core-Component?node-id=163-2) (component 163:2; four cells: showItem2 × showItem3, nodes 164:1504, 164:1516, 164:1529, 164:1542)
Component: `src/components/Breadcrumbs/Breadcrumbs.tsx` (branch `build/breadcrumbs`, commit `39b7b9a`)

## Staging QA pass — 2026-10-02

**Environment:** a real Vercel preview deployment of branch `build/breadcrumbs` (`https://horizon-design-system-cdfi-kv1x6ir7o-mavis17.vercel.app`), not production and not `main`. Measured in a browser by the orchestrating session, since the qa subagent has no browser. Expectations come from Figma via `get_design_context` on 163:2.

| Case | Expected (Figma) | Measured (live) | Result |
|---|---|---|---|
| showItem2 true, showItem3 true (164:1504) | Stays / Portugal / Lisbon / Alfama; Inter 12px/18px; 8px gaps; ancestors and "/" `#4d5361`; current page `#161925` and not a link | `<nav aria-label="Breadcrumb">` with an `<ol>`; 4 items in that order; font 12px/18px 400; gap 8px; ancestors `rgb(77,83,97)` as links; "/" `rgb(77,83,97)` and `aria-hidden`; current page `rgb(22,25,37)` as a span with `aria-current="page"` | ✅ Pass |
| item2 false, item3 true (164:1516) | Stays / Lisbon / Alfama | 3 items, same styling | ✅ Pass |
| item2 true, item3 false (164:1529) | Stays / Portugal / Alfama | 3 items, same styling | ✅ Pass |
| both false (164:1542) | Stays / Alfama | 2 items, same styling | ✅ Pass |
| ancestor hover (component description) | ancestors underline on hover; current page not a link | hovering "Portugal" underlines that link only (`text-decoration-thickness: from-font`); the current page is unchanged | ✅ Pass |

Five `Staging Testing` rows written, all `Passed` (the four Figma cells plus the described hover), linked to the Breadcrumbs row. Figma draws no states, so the cells are logged as `idle`. Console clean.

**Keyboard:** a real Tab goes to the first ancestor link and shows the browser's native focus ring; the current page is not focusable.

**Limitation (not a defect):** Inter is not installed or loaded in the test browser, so the rendered text widths could not be verified. Font size, line height, weight, gaps, colours and the markup were verified.

**Not failed, by decision:**
- The hover underline is not a Figma cell. It is in the component description (163:2), and the user decided to build it.
- `item1Href`, `item2Href` and `item3Href` are not Figma properties. They are optional props added by the engineer so that the ancestor links have destinations; with no href an ancestor renders an `<a>` that is not a real link.
- `font-weight: 400` is hard-coded (`Breadcrumbs.css:5`) because there is no weight token; it is not a px or hex value.
- No focus or visited styling beyond the browser defaults, because Figma draws none.

## Summary: PASS
