# QA Report — Link

Source: [Figma node 133:12](https://www.figma.com/design/dIHHqSq8c75n4olME0s9JS/Core-Component?node-id=133-12) (component set 133:12; four cells: size md/sm × state default/hover)
Component: `src/components/Link/Link.tsx` (branch `build/link`, commit `082c6f4`)

## Staging QA pass — 2026-10-01

**Environment:** a real Vercel preview deployment of branch `build/link` (`https://horizon-design-system-cdfi-sih2o18in-mavis17.vercel.app`), not production and not `main`. Measured in a browser by the orchestrating session, since the qa subagent has no browser. Expectations come from Figma via `get_design_context`, not the story file.

| Case | Expected (Figma) | Measured (live) | Result |
|---|---|---|---|
| md / default (133:4) | Inter Medium 13px/20px, `--color-text-link` `#1d44ba`, no underline | native `<a>`, Inter 13px/20px 500, `rgb(29,68,186)`, no underline | ✅ Pass |
| md / hover (133:6) | same plus a solid underline | same, underline solid | ✅ Pass |
| sm / default (133:8) | Inter Medium 12px/18px, `#1d44ba`, no underline | Inter 12px/18px 500, `rgb(29,68,186)`, no underline | ✅ Pass |
| sm / hover (133:10) | same plus a solid underline | same, underline solid | ✅ Pass |

Behaviour: a real mouse hover over the default story underlines it (so the forced `state="hover"` story matches the real `:hover`). A real Tab shows the browser's native focus ring (`outline: auto`). The token `--color-text-link` is `#1d44ba` in both Figma and the build, so there is no colour drift. Console clean. Four `Staging Testing` rows written, all `Passed`, linked to the Link row. Figma `default` is logged as `idle` and `hover` as `hovered`.

**Not failed, by design:** Figma draws no focus, visited or disabled state and no inline/standalone variant, so none is built. The Usage text asks for a visible keyboard focus style and for underlining a link inside body text; neither is drawn, and the native focus ring applies. `font-weight: 500` is hard-coded because there is no weight token (as in Button, Checkbox and Chip).

## Summary: PASS
