# Card — QA report

**Result: 2 findings, 10 of 11 cases Failed, 1 Passed.** Tested on the `build/card` Vercel preview (commit `907148f`), light theme, 1440px viewport, against Figma file `dIHHqSq8c75n4olME0s9JS`, nodes `238:7` (listing) and `238:20` (stat). Registry rows are in `Staging Testing`, linked to the Card row.

Tester note: the engineer's subagent run of qa had no browser, so this round was run by the orchestrating session, which is not the session that built Card.

## Checks performed

| Check | Result |
|---|---|
| Font loaded (Inter vs bogus family, measured) | **Not confirmed.** Inter is not installed in the test browser and the repo ships no `@font-face` (`.storybook/preview.ts` only imports tokens and `src/styles.css`). Glyph widths were not judged. |
| Listing size, 8 flag combinations | Fail, 284x243 vs 242 (finding 1) |
| Listing photo | Fail, 282x141 inset vs 284x142 full bleed (finding 1). Ratio 2:1 and radius none pass. |
| Listing radius `--radius-md`, bg `--color-bg-elevated`, border colour `--color-border-subtle` | Pass |
| Listing body padding `--spacing-lg`, gap `--spacing-xs`, footer top padding 4px, right gap `--spacing-md` | Pass |
| Listing title 14/600/20, details 11/400/16, price 14/600/20, rating 11/400/16, action 12/500/18 in `--color-text-link` | Pass |
| Tag position and padding | Fail, 13px/13px, 4px/8px, 24px tall vs 11px/11px, 3px/9px, 22px (finding 2) |
| Tag colour, `--fontSize-xs`, `--lineHeight-xs`, radius full | Pass |
| Stat size, helper on / off | Fail, 234x98 / 234x78 vs 96 / 76 (finding 1) |
| Stat radius `--radius-xs`, padding `--spacing-md`, gap, label 11/500/16, value 24/600/32, helper 11/400/16, colours | Pass |
| Truncation (ListingTruncation story) | Pass, one line with ellipsis, heights 20 / 16 |

Coverage: Figma's 32 instances collapse to 8 distinct listing and 2 distinct stat appearances, because ShowHelper has no effect on listing and ShowTag, ShowAction and ShowRating have none on stat. All 10 are logged. The all-variants story renders those 16 cards (8 listing, 8 stat), not the 32 the engineer reported, which is complete for the visuals but a wrong count.

## Findings

1. **Border consumes layout.** Figma draws the `--border-width-sm` / `--color-border-subtle` edge as an inside stroke. `.hz-card` in `src/components/Card/Card.css` uses a real CSS border, so every card is 2px larger in each dimension and the photo is inset 1px. Affects every row. Fix: draw the edge without taking layout space (inset box-shadow or negative-offset outline over the photo).
2. **Tag offset and padding.** Figma `238:10` has 11px offset and 9px/3px padding, all unbound. The engineer used `--spacing-md` / `--spacing-sm` / `--spacing-xs`, which with the border lands 2px off the corner and 2px taller. No token matches, so this needs a human call: bind tokens in Figma, or accept the nearest-token deviation.

## Not findings, for the record

- Font weights are raw 400/500/600 in the CSS. Figma binds `--fontWeight-*` but the repo has no such tokens (Chip and File do the same). Rendered values match, so this is a pipeline gap for the humans, not a Card defect.
- Action is plain styled text, as in Figma. It is not a Link or Button.
- Unconfirmed: Inter loading in the deployed Storybook. Anyone without Inter installed sees the `sans-serif` fallback in every component, not only Card. Worth a separate look.

## Round 2 — retest at `156db81`

**Result: all cases Passed. Tag cases pass against a human decision, not against the Figma node.**

- **Finding 1 (border) — fixed.** `.hz-card` now draws the edge with `::after` (inset 1px `--border-width-sm` in `--color-border-subtle`), no layout space. Computed on the preview: listing 284x242 with the photo 284x142 at offset 0,0; stat 234x96 with helper and 234x76 without. 6 retest rows Passed. Paint order (edge above the photo) was checked from computed positioning only; no screenshot, because the browser pane was not displayed.
- **Finding 2 (tag) — accepted, not fixed.** On 2026-10-07 the user chose to accept the nearest-token tag: offset `--spacing-md` (12px from the card edge, as built), padding `--spacing-xs` / `--spacing-sm` (4px / 8px), 24px tall. Figma node `238:10` still reads 11px / 9px / 3px and was not changed, so the design and the code still disagree by 1px on offset and 2px on height. The 4 tag rows are Passed with that stated in `Context`. If the designer later binds the tag to tokens, re-test it.
- **Still open:** Inter is not installed in the test browser and the repo ships no font loading, so glyph widths were never judged for Card or the rest of Storybook.
