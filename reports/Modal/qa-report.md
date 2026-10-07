# Modal — QA report

**Result: 1 finding. 4 of 6 cases Failed (one shared finding, the shadow), 2 Passed.** Tested on the `build/modal` Vercel preview (commit `1192cce`), light theme, 1440px viewport, against Figma file `dIHHqSq8c75n4olME0s9JS`, component set `243:181`. Registry rows are in `Staging Testing`, linked to the Modal row.

Tester note: run by the orchestrating session, not the session that built Modal. The browser pane was not displayed, so real mouse and keyboard input could not be sent; behaviour was driven by programmatic activation.

## Checks performed

| Check | Result |
|---|---|
| Font loaded (Inter vs bogus family) | **Not confirmed.** Inter is not installed in the test browser and the repo ships no font loading. Glyph widths were not judged; the wrapped-line heights (394 and 410 on the sheets) matched Figma anyway. |
| Dialog, 8 flag combinations x 2 tones: width, padding, gap, radius, background, type scale, rows, buttons, heights | Pass (heights 156 / 176 / 188 / 208 / 288 / 308 / 320 / 340, derived from the node) |
| Sheet, 8 flag combinations x 2 tones: width, padding, top radius, grab handle, stacked buttons, heights | Pass (heights 230 / 262 / 278 / 362 / 394 / 410) |
| Drop shadow | **Fail** (finding 1) |
| Primary and destructive button fills | Not counted. They render `--color-primary-default` (#2b5ad6) and `--color-status-error` (#d02727), where Figma draws #3b71f2 and #ea3d3d: the same ruled treatment as Chip, Toggle, ProgressBar. |
| Opens as a native modal, focus inside, centred, backdrop `--color-bg-overlay` at 40%, labelled and described | Pass |
| Close button, Cancel, primary action close it; focus returns to the trigger; click inside the panel does not close it; cancel event handed to the owner | Pass |
| Sheet open at 390px: 390 wide, flush to the bottom, stacked 342px buttons | Pass |
| Dark theme: backdrop token unchanged, panel and title switch | Pass |
| Tab focus trap, real Escape key, real backdrop click, screen reader output | **Not tested** (no real input, no screen reader). Not claimed. |

## Finding

1. **Drop shadow.** Figma (`243:3`, `243:49`, `243:93`, `243:137`) draws `0 8 12` at `rgba(0,0,0,0.2)`, bound to no variable. `Modal.css:45` uses `--elevation-lg` (`0 8 16` at 16% navy). No elevation token matches (`--elevation-sm`, `--elevation-md`, `--elevation-lg`). Human call: bind the Figma shadow to `--elevation-lg`, or accept the nearest-token version.

## Not findings, for the record

- **Desktop sheet width.** Open at 1440px the sheet spans the viewport. Figma draws only the 390px sheet and says it slides up on mobile. Design gap for the designer to specify.
- **Close target 20x20**, as drawn, below the 24px WCAG 2.2 AA target size.
- **Initial focus** lands on the close button; for the destructive tone, Cancel first is the usual practice. Figma draws no focus behaviour.
- **No `role="alertdialog"`** for the destructive tone, and the title is a `<p>` named through `aria-labelledby`, not a heading.
- **Literals** (520, 390, 48x4, 20x20, two 10px, 40%) are listed in the engineer's report for a human ruling; none is a test failure.

## Round 2 — decision on the shadow

**Result: all 6 cases Passed. The four layout cases pass against a human decision, not against the Figma node.**

- **Finding 1 (drop shadow) — accepted, not fixed.** On 2026-10-07 the user chose to accept the nearest-token shadow: `--elevation-lg` (`0 8 16` at 16% navy), set at `Modal.css:45`. Figma nodes `243:3`, `243:49`, `243:93` and `243:137` still draw `0 8 12` at `rgba(0,0,0,0.2)`, unbound, and were not changed, so design and code still differ in blur (16 vs 12), opacity (16% vs 20%) and colour (navy vs black). The four layout rows were first recorded Failed and are now Passed, each with that stated in `Context`. If the designer later binds the shadow to a token in Figma, re-test it.
- **No code changed.** The engineer had nothing to do; the component is as tested at `1192cce`.
- **Still open:** the tests not run with real input (Tab trap, real Escape, real backdrop click, screen reader), and Inter not being loaded in the test browser. Both remain unverified, not passed.
