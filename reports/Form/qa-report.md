# QA Report — Form

Source: [Figma node 57:1649](https://www.figma.com/design/dIHHqSq8c75n4olME0s9JS/Core-Component?node-id=57-1649) (grid 233:8441, textfield states 240:37)
Component: `src/components/Form/Form.tsx`
Tested: staging Storybook, branch `build/form`, commit `ea4519b`, light theme, 1600px viewport

## Re-test — commit `f10ec35` (round 2): PASS

Finding 1 fixed: `.hz-textfield__input` now computes to 40px (padding-block 9px + 1px border each side + 20px line), every textfield is 84px (62px inside forms). Re-measured live on staging at 1600px: all 64 grid cases match Figma in width and height (zero delta against the formulas below), the card example is 354 (Figma 354), the invite example is 336 (Figma 336), all 5 textfield states are 84. 71 new `Staging Testing` rows written, all `Passed`. Real-focus, disabled-behaviour and play-function checks were not re-run (the fix touched only vertical padding); their round-1 Passed rows stand.

**Registry caveat:** the 71 round-1 rows still read `Fixed (To re-test)` (engineer's marker, not editable by QA), so `Development` reads `Fixed` rather than `To be deployed` until a human decides how to retire them.

## Round 1 — commit `ea4519b`: FAIL

One root cause accounts for all 71 failed rows. Widths, colours, typography, spacing and behaviour all match Figma. 73 `Staging Testing` rows written: 71 Failed, 2 Passed.

**Font check (done first):** the same string measured 364.4px in `Inter, sans-serif` and 481.6px in a bogus family, so Inter is loading and the size measurements can be trusted.

## Checks performed

| Check | Result |
|---|---|
| Width, all 64 grid cases (section 720, card 440) | Pass |
| Height, all 64 grid cases | Fail, +2px per textfield |
| Form padding 24, gap 20, heading gap 4, fields gap 16 | Pass |
| Background #f9fafb, radius 2, edge as inset 1px #eef1f5 shadow on `::after` | Pass |
| Title 18/26/600 #161925; description 13/20 #4d5361; label 12/18/500 #4d5361; footnote 12/18 #4d5361 | Pass |
| ButtonGroup gap 12; buttons 10/16, radius 6; card Button full width 392 | Pass |
| Link 13/20, weight 500, #1d44ba, no underline | Pass |
| Textfield default, focused (forced class), filled, error, disabled: colours | Pass |
| Textfield height, all 5 states (86 vs 84) | Fail |
| Real focus (click, then type): `:focus-visible` matched, border #1d44ba | Pass |
| Disabled input: truly disabled, not focusable, Tab skips it, cursor not-allowed | Pass |
| Error: `aria-invalid="true"`, `aria-describedby` set, message in error colour | Pass |
| Interaction play function (6 steps) | Pass |
| Card Keyboard play function (Tab, Tab, Enter submits) | Pass |
| Console clean; All Variants story renders 64 forms | Pass |
| Examples 242:65 and 242:94 | Fail, +4 each (same finding) |

## Findings

### 1. Input renders 42px, Figma specifies 40px

- **Expected:** Figma node 240:2 and grid node 233:8441 use a 40px input (node description: "40px input"). Every Figma instance height reproduces only with 40px.
- **Seen (computed style):** `.hz-textfield__input` is 42px tall: 1px `--border-width-sm` border, 10px `padding-block` (midpoint of `--spacing-sm` and `--spacing-md`), 20px `--lineheight-lg` line height, `box-sizing: border-box`. Each textfield is 86px against Figma's 84px.
- **Effect:** sections with 2, 3 and 4 fields are +4, +6 and +8px (8, 16 and 8 cases); all 32 cards +4px; both examples +4px; all 5 textfield states +2px.
- **Location:** `src/components/Form/Form.css`, `.hz-textfield__input` `padding-block`. The border must be absorbed into the 40px (for example subtract `--border-width-sm` from the padding).

## Notes (not failures)

- At a 692px-wide pane, section forms render 692 wide rather than 720 because of `max-width:100%`. At 1600px all 64 are the right width.
- The error colour computes to `rgb(208,39,39)`, the resolved value of `--color-status-error`; the Figma hex is #ea3d3d. The Button QA already accepted this as existing pipeline behaviour.
- Open question for design: in the invite example (242:94), "Full name" looks greyer in Figma than the rendered filled input. It may be intended as a placeholder.

## Expected-height formulas (reproduce all 64 Figma instance heights)

- Section: 510, less 24 with no description, less 78 with no Field3 (Display name), less 78 with no Field4 (Phone), less 38 with no footnote. Width 720.
- Card: 354, less 24 with no description, less 40 with no link. Width 440; unaffected by Field3, Field4 and footnote.
