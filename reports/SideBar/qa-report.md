# SideBar — QA report

**Result: 2 findings, both need a human decision. 2 of 6 cases Failed, 4 Passed.** Tested on the `build/sidebar` Vercel preview (commit `2ed2679`), light theme page, 1440px viewport, against Figma file `dIHHqSq8c75n4olME0s9JS`, component `246:11` and item set `246:10`. Registry rows are in `Staging Testing`, linked to the SideBar row.

Tester note: run by the orchestrating session, not the session that built SideBar. The browser pane was not displayed, so real mouse and keyboard input could not be sent; behaviour was driven by programmatic activation.

## Checks performed

| Check | Result |
|---|---|
| Font loaded (Inter vs bogus family) | **Not confirmed.** Inter is not installed in the test browser and the repo ships no font loading. Glyph widths were not judged; the layout does not depend on them. Truncation was measured from scroll and client widths. |
| Panel 220x1000, padding 20px 12px, gap 16px, bg `--color-bg-inverse` | Pass |
| Header: logo mark 32x32 with empty alt, title 18/700/26 in `--color-text-inverse` | Pass |
| Nav: top 68, 12 items, 36px pitch, ending at 496; item 196x32, padding-inline 12px, radius 2px | Pass |
| Default item 13/400/20 in `--color-text-inverse-secondary`; active item fill `--color-primary-foreground`, 13/500/20 in `--color-text-inverse` | Pass |
| Footer: at 946, 20px bottom margin, organisation 11/500/16, detail 10/400/16, 2px gap | Pass |
| ShowFooter=false: divider and footer absent, panel still 220x1000 | Pass |
| Divider colour and opacity | **Fail** (finding 1) |
| Hover item label colour | **Fail** (finding 2) |
| Current page marked with `aria-current="page"`, one at a time, click moves it | Pass |
| Native `nav` landmark labelled "Main", list of links, decorative parts hidden | Pass |
| Long labels truncate at 196px with an ellipsis, items stay 32px; few items keep the footer pinned | Pass |
| Real Tab order, focus ring contrast, real mouse hover, screen-reader output, dark theme | **Not tested** (no real input, no screen reader). Not claimed. |

## Findings

1. **Divider opacity.** Figma `246:45` fills the 1px divider with `--color-text-inverse` at a partial opacity the design tools do not expose; Figma's render shows a faint line. `SideBar.css:95` uses `color-mix(... 12% ...)`, the engineer's estimate (6% to 12%) from a sampled pixel. No alpha token exists. Human call: the designer confirms and documents the real opacity, or 12% is accepted. I could not read the Figma value, so I cannot say whether 12% is right.
2. **Hover label colour.** Figma draws the hover item (`246:6`) with the fill `--color-text-inverse` (#f9fafb) and the label (`246:7`) in the same `--color-text-inverse`, so the label is invisible as designed; Figma's own render shows a blank row. The engineer kept the fill and set the label to `--color-bg-inverse` (#161925, 16.75:1 on the fill; `SideBar.css` around lines 66-70). The fix belongs in Figma. Human call: the designer fixes the hover label in Figma, or the built colour is accepted as a design decision.

## Not findings, for the record

- The focus ring and the nav's `overflow-y: auto` are not in Figma; the engineer added them. The ring's contrast against the dark panel was not checked by anyone.
- Not drawn in Figma, so not built and not tested: a collapse state or toggle, small-screen layout, arrow-key navigation, groups or submenus, disabled items, a skip link, per-item `href` (default `#`), pressed states. Enforcing a single active item and the 12-item cap is left to the consumer.
- The Usage frame says "the app currently always marks Dashboard active, which needs fixing". It is transposed verbatim into the intent file but reads as a bug note, not a design rule: a designer should look at it.
- Literals (220px, 32px, 2px, 12%) are listed in the engineer's report for a human ruling; none is a test failure.

## Round 2 — decisions on the divider and the hover label

**Result: all 6 cases Passed. Two cases pass against a human decision, not against the Figma node.**

- **Finding 1 (divider opacity) — accepted, not fixed.** On 2026-10-07 the user chose to accept the built divider: `--color-text-inverse` at 12% (`SideBar.css:95`). Figma `246:45` fills it with `--color-text-inverse` at an opacity the design tools do not expose, and that opacity was never read, so it is **unconfirmed whether 12% matches Figma**. The case was first recorded Failed and is now Passed, with that stated in `Context`. If the designer later documents or binds the opacity, re-test it.
- **Finding 2 (hover label colour) — accepted, not fixed.** On 2026-10-07 the user chose to accept the built label colour `--color-bg-inverse` (#161925) on the `#f9fafb` hover fill. Figma `246:6` / `246:7` draws the label in the same `#f9fafb` as the fill, so it is invisible as designed; Figma was not changed. If the designer fixes the hover label in Figma, re-test against it.
- **No code changed.** The engineer had nothing to do; the component is as tested at `2ed2679`.
- **Still open:** the tests not run with real input (Tab order, focus ring contrast, real hover, screen reader, dark theme), and Inter not being loaded in the test browser. Both remain unverified, not passed.
