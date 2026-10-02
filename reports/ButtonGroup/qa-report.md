# QA Report — ButtonGroup

Source: [Figma node 191:123](https://www.figma.com/design/dIHHqSq8c75n4olME0s9JS/Core-Component?node-id=191-123) (component set 191:123; 7 cells: type primary/destructive/secondary × layout row/stack, plus type segmented, row only; sub-component 194:111)
Component: `src/components/ButtonGroup/ButtonGroup.tsx` (branch `build/buttongroup`, commit `7f7fdfa`)

## Staging QA pass — 2026-10-03

**Environment:** a real Vercel preview deployment of branch `build/buttongroup` (`https://horizon-design-system-cdfi-qrotyu4ii-mavis17.vercel.app`), not production and not `main`. Measured in a browser by the orchestrating session, since the qa subagent has no browser. Expectations come from Figma via `get_metadata` and `get_design_context` on 191:123.

| Case | Expected (Figma) | Measured (live) | Result |
|---|---|---|---|
| primary / row (191:3) | filled "Save" + outline "Cancel", 12px gap, hugs content | `role="group"`, inline-flex, gap 12px, Button default 36px + Button outline 38px, group 38px high, hugs content | ✅ Pass |
| primary / stack (191:26) | 320px column, 86px high, full-width buttons | in a 320px wrapper: 320×86, gap 12px, both buttons 320px wide | ✅ Pass |
| destructive / row (191:45) | error "Delete" + outline "Keep it" | Button error 36px + outline 38px, gap 12px | ✅ Pass (see note) |
| destructive / stack (191:66) | 320px column, 86px high | 320×86 | ✅ Pass |
| secondary / row (191:85) | two outline buttons | both outline 38px, gap 12px | ✅ Pass |
| secondary / stack (191:104) | 320px column, 88px high | 320×88 | ✅ Pass |
| segmented / row (195:44) | 30px segments, 2px radius, 8px gap; selected navy `#161925`, others `#f9fafb` with a `#d7dee7` border and `#4d5361` text; 10px/16px | `role="radiogroup"`, 30px high, radius 2px, gap 8px, colours as expected, 10px/16px | ✅ Pass |
| showThird / showFourth (Figma properties) | third button or segment; fourth segment, segmented only, independent of showThird | buttons: `More` added, showFourth has no effect, stack with three buttons is 136px high; segmented: `30 days`, `Custom range` alone, or all four | ✅ Pass |

Eight `Staging Testing` rows written, all `Passed`, linked to the ButtonGroup row. Figma draws no states, so cells are logged as `idle` (the segmented row also as `selected`). Console clean.

**Behaviour (real input events):** clicking the "7 days" segment selects it and exactly one radio stays checked; ArrowLeft moves the selection back; the native focus ring shows on the label for keyboard focus (the radio input is transparent).

**First preview failed, then fixed:** the first preview (`f302205`) rendered every row group as a block-level flex container stretched to the full width of its parent (668px in a 668px container), while Figma's row groups hug their content. The engineer changed the groups to `inline-flex` in `7f7fdfa`, and the groups now hug their content (108px, 114px, 107px and 146px with the fallback font).

**Limitations (not defects):** Inter is not installed in the test browser, so text widths differ from Figma (primary row 108px against 111px; "Last 24 hours" 84.6px against 89px). The stories set no controls for `showThird` and `showFourth`, so those were tested through Storybook's args channel. The stack layout has `width: 100%`, so it needs a parent with a defined width (in an auto-width parent it collapses to zero); the stories use a 320px wrapper.

**Not failed, by decision:**
- The buttons come from the real Button component. `--color-primary-default` renders `#2b5ad6` (Figma `#3b71f2`) and `--color-status-error` renders `#d02727` (Figma `#ea3d3d`): accepted pipeline drift, as for Button, Chip and Toggle.
- Contrast as drawn, for the designer: the unselected segment border is about 1.3:1 on the light page and dark-theme unselected segment text is about 2.9:1.
- `labels`, `onItemClick`, `value`, `defaultValue` and `onValueChange` are not Figma properties; they were added so the component is usable.
- No literal px, hex or alpha values in `ButtonGroup.css`, so no `decisions.md` ruling is needed.

## Summary: PASS
