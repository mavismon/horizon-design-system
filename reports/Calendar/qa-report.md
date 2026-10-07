# QA Report — Calendar

Source: [Figma node 235:392](https://www.figma.com/design/dIHHqSq8c75n4olME0s9JS/Core-Component?node-id=235-392) (component set 235:392: type picker 235:2 and type occupancy 235:137; sub-components `_calendar-day` with 8 states, 234:5 to 234:26, and `_calendar-occupancy-day` with 5 states, 234:30 to 234:58; two-month specimen 236:265 and 236:400; usage frame 236:573). The registry link (57-1647) is the canvas page, not a component.
Component: `src/components/Calendar/Calendar.tsx` (branch `build/calendar`, commit `29e7c46`)

## Staging QA pass — 2026-10-05

**Environment:** a real Vercel preview deployment of branch `build/calendar` (`https://horizon-design-system-cdfi-muh94bq0y-mavis17.vercel.app`), not production and not `main`. Measured in a browser by the orchestrating session, since the qa subagent has no browser. Expectations come from Figma via `get_metadata` and `get_design_context` on 235:2 and 235:137.

| Case | Expected (Figma) | Measured (live) | Result |
|---|---|---|---|
| picker (235:2) | 536×340, 64×40 days with 8px gaps, September 2026 | 536×340, all day cells 64×40; days 1 to 8 past, 9 today (1px primary border, price 101), 14 start and 18 end solid `#2b5ad6`, 15 to 17 in-range `#eff3ff`, 23 and 24 unavailable | ✅ Pass |
| occupancy (235:137) | 1170×645, August 2026 | 1170×645, 42 cells of 158×90: 11 empty, 22 normal, 4 high, 4 soldout, 1 over (navy 5, 6, 13, 14; over tag on 12; red 4, 15, 22, 30) | ✅ Pass |
| `_calendar-day` empty, past, available, today, unavailable, start, in-range, end | 64×40 each | each 64×40; empty transparent with no border, past `#f2f3f5`, available `#f9fafb`, today 1px primary border, start and end `#2b5ad6`, in-range `#eff3ff` | ✅ Pass (8 cases) |
| `_calendar-occupancy-day` empty, normal, high, soldout, over | 158×90 each | each 158×90 with a 1px `#eef1f5` border; empty `#f2f3f5`, normal and high `#f9fafb`, soldout and over navy `#161925`, over shows an "over" tag | ✅ Pass (5 cases) |
| keyboard and pointer interaction | usable date-range picker | click picks the start, a second click picks the end with in-range between; a past day is ignored (`aria-disabled`); roving tabindex; ArrowRight and ArrowDown move by day and week, Home goes to Monday, PageDown to the next month; the next button advances the month | ✅ Pass |

Sixteen `Staging Testing` rows written, all `Passed`, linked to the Calendar row. `Staging Testing` has no options for past, unavailable, start, in-range, end, soldout or over, so each was mapped to the nearest option (disabled, isCurrent, selected, completed, error) and the mapping and the Figma state name are recorded in each row. Console clean.

**Limitations (not defects):** Inter is not installed in the test browser, so text widths are unverified. The two-month specimen (236:265, 236:400), the controlled props (`value`, `visibleMonth`, `prices`, `isDateUnavailable`), multi-month navigation beyond the next button, and dark mode were not tested. The qa agent read the day sub-component states from the instances inside 235:2 and 235:137, not from their own nodes.

**Not failed, by decision:**
- Literal px: `repeat(7, 64px)` (picker column width, `Calendar.css` about line 68) and `repeat(7, 158px)` (occupancy column width, about line 187). No hex. Needs a `decisions.md` ruling at release review.
- Derived without px literals but with no matching token: day heights via `aspect-ratio: 8/5` and `158/90`; the 28px nav button as `2em` with a `1em` icon (relies on `--fontsize-xl` being 14px); the "over" tag padding as calc over spacing tokens.
- Figma's occupancy data is inconsistent (day 30 reads "48 of 48, 99%" in the red `high` style rather than `soldout`; 47 of 48 reads 97% on the 15th and 98% on the 22nd; 35 of 48 reads 72%). The story reproduces the drawn values with explicit `percent` and `state`.
- Figma draws no month title for the occupancy cell (aria-label only), and no hover, pressed or disabled state. The keyboard focus ring and the pointer cursor are engineer additions.
- `--color-primary-default` renders `#2b5ad6` (Figma `#3b71f2`): accepted pipeline drift.
- Extra props: `value`, `defaultValue`, `onChange`, `visibleMonth`, `defaultVisibleMonth`, `onVisibleMonthChange`, `today`, `prices`, `isDateUnavailable`, `occupancy`. `CalendarDay` and `CalendarOccupancyDay` are not exported from `src/index.ts` (Figma marks them not for direct use).
- Composes nothing: Figma has no Button, Chip or Link instances here.

## Summary: PASS
