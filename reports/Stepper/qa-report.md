# QA Report — Stepper

Source: [Figma node 57:1646](https://www.figma.com/design/dIHHqSq8c75n4olME0s9JS/Core-Component?node-id=57-1646) (component set 215:73, step part 215:15, usage frame 216:84)
Component: `src/components/Stepper/Stepper.tsx`
Tested: branch preview Storybook `https://horizon-design-system-cdfi-git-build-stepper-mavis17.vercel.app` (build commit `e79120e` on `build/stepper`), light mode.

## Summary: PASS (8/8)

Eight `Staging Testing` rows written to the registry (`recn1pENprwS0AJbx`, `recMlu1Pv8qaSPOSo`, `reciohfKl9kysUvZA`, `rectkri1UiNr2RC7t`, `recAKkNmZrfXg5BtR`, `recgu2oPNCvoz6fd6`, `reckaRoXIzqo4npg9`, `recdsVdnq75KUr3e9`), all `Passed`. Expectations come from Figma `get_design_context` on node 215:73, not from the story file.

**Font-load check (done first):** "Dates and guests Dates" at 13px/400 in `Inter, sans-serif` measured `138.75px`, against `120.22px` in a bogus family. Inter is loading, so size measurements are trustworthy.

## Checks performed

| Case | Expected (Figma) | Computed (live) | Result |
|---|---|---|---|
| progress, 5 steps | 20px circles; done/current fill `--color-primary-default`; upcoming `--color-bg-elevated` + 1px `--color-border-strong`; labels 13/20 (current semibold); step gap 8, item gap 12; connectors 32x1, primary to current then `--color-border-default` | all exact | ✅ Pass |
| progress, 4 steps | fifth step and connector removed | 4 items, 3 connectors | ✅ Pass |
| progress, 3 steps | steps 4 and 5 removed | 3 items, 2 blue connectors | ✅ Pass |
| quantity, default | 280 wide, space-between, 28px buttons, 1px `--color-border-default`, radius 2, value 13/20 medium in a 20px column | all exact, value 2 | ✅ Pass |
| quantity, at-min | minus: `--color-state-disabled-bg` fill, `--color-border-subtle` border | `rgb(229,231,237)` / `rgb(238,241,245)`, disabled | ✅ Pass |
| quantity, at-max | plus disabled, same colours | same, value 8 | ✅ Pass |
| quantity, no label | label removed, width kept | no label node, 280px | ✅ Pass |
| interaction (real input) | done steps revisitable; counter bounded | Tab focus ring `2px solid rgb(29,68,186)`; Next step 3 to 4; back to step 1; counter 2 to 8 (+ disabled) to 0 (- disabled) | ✅ Pass |

## Notes for a human (not failures)

1. Selected blue is the build token `--color-primary-default` `#2b5ad6`; Figma shows `#3b71f2` (accepted pipeline drift, same basis as Button).
2. Figma's tick, minus and plus are image assets; the build draws inline SVG with a 1.5 stroke and `currentColor`. Stroke width and icon colours are an approximation of the Figma assets.
3. Raw px values with no token (engineer report): 20px circle, 32px connector width, 28px counter button, 14px and 12px icons, 20px value column, 280px row width, font weights 500/600. These need a `decisions.md` ruling before release review gate 2.
4. When a done step becomes current it stops being a button, so keyboard focus falls back to the page.
5. Figma draws no focus state; the ring is the engineer's choice (`--color-border-focus`), matching Button.
6. Not tested: dark mode (no theme toggle in this Storybook).
7. A resource `403` appears in the console on every Storybook preview page; none comes from Stepper.
