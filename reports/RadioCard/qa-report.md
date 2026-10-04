# QA Report — RadioCard

Source: [Figma node 57:1644](https://www.figma.com/design/dIHHqSq8c75n4olME0s9JS/Core-Component?node-id=57-1644) (component set 212:21, usage frame 212:49)
Component: `src/components/RadioCard/RadioCard.tsx`
Tested: branch preview Storybook `https://horizon-design-system-cdfi-git-build-radiocard-mavis17.vercel.app` (build commit `122dada` on `build/radiocard`), light mode.

## Summary: PASS (6/6)

Six `Staging Testing` rows written to the registry (`recu5asK4dNqFyP2b`, `recYLMUEd79eikDQ2`, `recGfPvFjeTiDnQSq`, `recymJWclAeeyF4yj`, `recuXAVyv8wxUqAdP`, `recPKbe5FalVAhsAp`), all `Passed`. Expectations come from Figma `get_design_context` on node 212:21, not from the story file.

**Font-load check (done first):** 2× "Whole apartment" at 14px/500 in the computed family `Inter, sans-serif` measured `217.1px`, against `196.8px` in a bogus family. Inter is loading, so size measurements are trustworthy.

## Checks performed

| Case | Expected (Figma) | Computed (live) | Result |
|---|---|---|---|
| unselected / idle | 480 wide, 16 pad, 12 gap, 2 radius, border `--color-border-subtle` `#eef1f5`, bg `--color-bg-elevated`, radio border `--color-border-strong` `#c8d2dd`, text 14/20 500, 12/18 400, 14/20 600 | 480x76, all values exact | ✅ Pass |
| selected | border, ring and 8px dot `--color-primary-default`, same text | border/ring/dot `rgb(43,90,214)`, dot 8px | ✅ Pass (see note) |
| disabled | bg `--color-state-disabled-bg`, border `--color-border-default`, text `--color-text-disabled` | `rgb(229,231,237)`, `rgb(215,222,231)`, `rgb(209,213,219)`; input `disabled` | ✅ Pass |
| showDescription=false | description removed, card 54px | 54px, title + trailing only (selected title-only also 54px) | ✅ Pass |
| showTrailing=false | trailing removed, 480x76 kept | 480x76, title + description only | ✅ Pass |
| Group, real input | one selected at a time, disabled can't be picked | Tab lands on checked card; ArrowDown moves selection and focus; wraps past the disabled card; click moves selection | ✅ Pass |
| Keyboard focus ring | Figma draws no focus state | `2px solid rgb(29,68,186)` (`--color-border-focus`), offset 2px, `:focus-visible` | ✅ Pass (engineer's choice, matches Button) |
| Console | clean | only Storybook's own `PopoverProvider ariaLabel` warning | ✅ Pass |

## Notes for a human (not failures)

1. **Selected blue differs from Figma's variable export.** Figma node 212:8 resolves `color-primary-default` to `#3b71f2`; `build/css/tokens.css` sets it to `#2b5ad6` (documented WCAG AA bump, blue/500 to blue/600). RadioCard references the correct token; this is a token-level decision, and Button was passed on the same basis. Checkbox uses `--color-interactive-primary` (`#3b71f2`), so the two components render different blues. A designer should confirm which is intended.
2. No hover or pressed state is drawn in Figma, so none was tested.
3. Not tested: dark mode (no theme toggle in this Storybook).
