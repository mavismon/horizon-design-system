# Modal · release review

- **Reviewed SHA:** `1fd601d7afde2850d6ec8304c9e7d015487dc819` (`origin/main`, "Merge pull request #87 from mavismon/staging", 2026-10-07 10:53:08 +01:00, fetched before the review). `src/components/Modal/` at this SHA is identical to `build/modal` at `189b2a8` (`git diff 189b2a8 1fd601d -- src/components/Modal` is empty); the component was last changed in `1192cce` ("Modal: build from Figma 57:1650"). This report is committed on top of the reviewed SHA, on branch `release-review/modal`.
- **Date:** 2026-10-07
- **Verdict:** **Cleared**, with warnings (listed below, separately from failures). There are no failures.
- **Reviewer:** release agent, running `release-review` as a single-component run, not a release. No version bump, no tag, no publish, no npm. Every gate and check was run fresh at the reviewed SHA. The intent file, `decisions.md` and the component were not edited.
- **Board row:** Modal (`recnprKtZ1NE6CGB1`), read fresh: `Development` = `Completed`, `Design` = `Done`, `Production Storybook` = `https://horizon-design-system-cdfi.vercel.app/?path=/story/components-modal--all-variants`, `Commit` = `1192cce`, `Composes` = ButtonGroup, six `Staging Testing` rows (rollup reads `Passed` only), `Astro Link` empty, `Release Review` and `Release Verdict` empty. `Last Modified` = 2026-10-07T09:44:49Z (10:44:49 +01:00), earlier than the reviewed SHA's commit time (10:53:08 +01:00), so the review is not stale.

## Rulings

`decisions.md` was read in full at the reviewed SHA. It has no merge conflict markers (`grep` for `<<<<<<<`, `=======`, `>>>>>>>` returns 0). One ruling covers Modal: **"2026-10-07 · Modal sizes with no token, and the accepted shadow"**. Quoted in full (the ruling, the instruction to agents, and the boundary):

> **Ruling.** These literals in `src/components/Modal/Modal.css` are accepted, because they are what the Figma nodes specify or document, until the designer adds matching size and alpha tokens:
>
> | Value | Property | Selector | Lines |
> |---|---|---|---|
> | `520px` | `width` | `.hz-modal--dialog .hz-modal__panel` | 50 |
> | `390px` | `width` | `.hz-modal--sheet .hz-modal__panel` | 57 |
> | `10px` | `padding-top` (first value of the `padding` shorthand) | `.hz-modal--sheet .hz-modal__panel` | 59 |
> | `48px` | `width` | `.hz-modal__handle` | 80 |
> | `4px` | `height` | `.hz-modal__handle` | 81 |
> | `20px` | `width` | `.hz-modal__close` | 124 |
> | `20px` | `height` | `.hz-modal__close` | 125 |
> | `10px` | `padding-block` (first value of the `padding` shorthand) | `.hz-modal__row` | 159 |
> | `40%` | alpha in `color-mix(in srgb, var(--color-bg-overlay) 40%, transparent)` | `.hz-modal::backdrop` | 36 |
>
> The panel shadow in `Modal.css` stays on the nearest token, `--elevation-lg` (`0 8 16` at 16% navy), against Figma's `0 8 12` at 20% black on nodes 243:3, 243:49, 243:93 and 243:137. This deviation is accepted as a design decision (2026-10-07), the Figma nodes were not changed, and the QA report (`reports/Modal/qa-report.md`, round 2) records it.
>
> **For an agent that hits it.** Gate 2 passes for exactly these values on exactly these properties in `Modal.css`. The shadow is not a gate item, since it uses a token: do not count it against a verdict, and quote this ruling when you report it. The 10px values match the Button ruling in value only; that ruling covers `Button.css`, not this file. When a size token for 520px, 390px, 48px, 4px or 20px, a 10px spacing token, or an alpha token for the overlay appears, the ruling no longer covers that value: use the token. If the designer binds the shadow to a token in Figma, the shadow part of this ruling no longer applies and the shadow must be re-tested against the node.
>
> **Not ruled.** Any other literal value, including a `var()` fallback. These values in any other component. A change to these values: a different number needs a new ruling or a token. The unitless font weights 400, 500 and 600, and the responsive limits `100%`, `100dvh` and `max-width: 100%`, which need no ruling. The inline px and `color-mix` in `Modal.stories.tsx`, which is not part of the stylesheet gate. The open-sheet width on a desktop viewport, which Figma does not draw. The 20px close target against the 24px WCAG 2.2 AA minimum, the initial focus on the close button, and the destructive tone's missing `alertdialog` role, which are design and accessibility gaps for a human to settle.

How it was applied, and its limits:

- Applied to exactly the nine rows of the table. Each value, property, selector and line was checked against `Modal.css` at the reviewed SHA and matches: `520px` line 50, `390px` line 57, `10px` line 59, `48px` line 80, `4px` line 81, `20px` lines 124 and 125, `10px` line 159, `40%` line 36.
- "Use the token" is not triggered: `build/css/tokens.css` (built at the reviewed SHA) has no size token for 520, 390, 48, 4 or 20, no 10px spacing token, and no overlay alpha token. See the observation on `--spacing-xl` and `--spacing-xs` under Warnings.
- The shadow was not counted against the verdict, as the ruling says. It is reported under Warnings because the Figma nodes still differ from the code, and the ruling says it must be re-tested if the designer binds the shadow.
- The "Not ruled" line was honoured: the 20px close target, the initial focus, the missing `alertdialog` role and the desktop sheet width are reported as warnings, not waived and not blocked. The stories' inline px and `color-mix` were not counted either way (outside the stylesheet gate).

## Gates

| # | Gate | Result | Evidence |
|---|---|---|---|
| G1 | Done | Pass | `Development` reads `Completed`. `Production Storybook` returns HTTP 200, and the deployed `index.json` lists 14 Modal stories: `dialog`, `dialog-destructive`, `sheet`, `sheet-destructive`, `without-close`, `without-content`, `without-note`, `custom-content`, `all-variants`, `on-overlay`, `open-dialog`, `open-dialog-destructive`, `open-sheet`, `open-sheet-destructive`. No browser was available, so "opens" is evidenced by the 200 and the story index, not a render by this review. |
| G2 | Tokens | Pass, by ruling | `Modal.css` read in full, every declaration, grepped for px, rem, em, vh, `%`, hex, `rgb`, `hsl` and any `var()` fallback. No hex, no `rgb`/`hsl`, no rem or em, no `var()` fallback with a literal (the only comma after a `var()` is `var(--fontfamily-body), sans-serif`, a generic family, line 46). Literals: `520px` (50), `390px` (57), `10px` (59), `48px` (80), `4px` (81), `20px` (124, 125), `10px` (159), `40%` (36), all covered exactly by the ruling. Not literals needing a ruling, as the ruling states: `100dvh` (69), `max-width: 100%` (5, 51, 58), `width: 100%` (64, 136, 137), unitless `font-weight` 400, 500, 600, `0` values and the `* 2` multiplier on line 69. Without the ruling this gate fails on the nine rows. The shadow (line 45) is `var(--elevation-lg)`, a token. |
| G3 | Surface | Pass | `src/index.ts` lines 50-51 export `Modal` and the types `ModalProps`, `ModalType`, `ModalTone`, `ModalRow`. Nothing says it was meant to stay internal; it is in the 0.2.x export list being built up. `ModalRow` is the type of the `rows` prop, so exporting it is needed to type that prop. |
| G4 | Names | Pass | Folder `src/components/Modal/`, symbol `Modal`, class prefix `hz-modal`, intent `Modal.intent.json`, board row `Modal`. |
| G5 | States | Pass | Figma `243:181` (read fresh) publishes four variants: `type=dialog, tone=default` (243:3), `dialog, destructive` (243:49), `sheet, default` (243:93), `sheet, destructive` (243:137), plus the flags showClose, showContent, showNote. Code: `ModalType = "dialog" \| "sheet"`, `ModalTone = "default" \| "destructive"` (`Modal.tsx:6-7`), the three flags as props (lines 49-53). Stories: `Dialog`, `DialogDestructive`, `Sheet`, `SheetDestructive`, `WithoutClose`, `WithoutContent`, `WithoutNote`, `CustomContent`, `OnOverlay`, `AllVariants` (all 32 combinations, `Modal.stories.tsx:49-80`), and the four `Open*` stories for the on-screen mode. Figma draws no hover, focus or disabled state for the panel. The close button's focus ring (`Modal.css:140`) has no story that forces it; it is not a Figma state. |
| G6 | Intent | Pass | `src/components/Modal/Modal.intent.json` exists at the reviewed SHA and passes the six checks below. |
| G7 | Version | Pass, with a warning | `VERSIONING.md` exists and states what 0.x commits consumers to. It names seventeen components and does not name Modal, Form or Card (see Warnings). Not edited. |

## Checks

| # | Check | Result | Evidence |
|---|---|---|---|
| C1 | Fields present | Pass | All seven fields present with the right types: `use_when` 6 strings, `dont_use_when` 3 objects, `variant_intent` 4 keys, `placement` 1, `pairs_with` 1, `required_tokens` 25, `a11y` 8 objects. No empty `use_when` or `dont_use_when`. One empty value inside `variant_intent` (`default`), reported below. |
| C2 | `dont_use_when` names an alternative | Pass, with 2 warnings | Entry 2 names `Stepper`. Entries 1 and 3 have `instead: ""`. See Warnings. Not a block. |
| C3 | `a11y` specific | Pass, with a caveat | All eight entries name a concrete element, attribute or behaviour, and every source line exists at the reviewed SHA and implements its fact: `Modal.tsx:115` `showModal()`, `:130` `aria-labelledby` (and `:131` `aria-describedby`), `:132` `onCancel`, `:145` `onClick` backdrop check, `:170` close `<button aria-label>`, `:154` `aria-hidden` handle row, `:179` `<dl>`, `:192` `ButtonGroup` (the `onItemClick` wiring is on `:197`, inside the cited element). The caveat: the facts "makes the rest of the page inert, keeps focus inside and returns it to the opener on close" describe native `showModal()` behaviour. The code calls `showModal()`, so the fact is correctly sourced, but QA never ran the Tab focus trap, and this review has no browser, so those behaviours are not verified here. This check passes on the file's specificity and sourcing, not on tested behaviour. |
| C4 | `required_tokens` resolve | Pass | `npm run build:tokens` at the reviewed SHA. All 25 listed tokens are defined in `build/css/tokens.css`. Scripted comparison: the set of `var(--...)` names in `Modal.css` equals the listed set exactly (nothing read but unlisted, nothing listed but unread). |
| C5 | Variants covered | Pass | `variant_intent` keys `dialog`, `sheet`, `default`, `destructive` equal the values of `ModalType` and `ModalTone` exactly: none missing, none extra. The value for `default` is `""` (see Warnings). |
| C6 | No two components claim the same job | Pass | Compared Modal's six `use_when` lines against every `use_when` in the 20 other intent files (fuzzy match, ratio above 0.6, plus a search for "modal" and "dialog"). No line is identical or near-identical. Nearest by topic: `Button` ("To open a modal, drawer, or another view"), the trigger, not the surface; `ButtonGroup` ("At the end of a dialog or form"), the actions inside a modal; `Header` (a "don't" that mentions a modal). Each is a part of a modal or a different job, not a rival. |

## Fresh checks of the facts in the brief

1. **Shadow, accepted.** Confirmed, as stated. `build/css/tokens.css:180` `--elevation-lg: 0px 8px 16px 0px rgb(8.6% 9.8% 14.5% / 0.16)` (navy `#161925` at 16%); `Modal.css:45` `box-shadow: var(--elevation-lg)`. Figma draws `0 8 12` at `rgba(0,0,0,0.2)`, unbound (recorded on nodes 243:3, 243:49, 243:93, 243:137). The acceptance is recorded in the ruling, in `reports/Modal/qa-report.md` round 2, and in the `Context` of all four layout `Staging Testing` rows (read fresh, each reads "PASSED AGAINST A HUMAN DECISION, NOT AGAINST THE FIGMA NODE" with the shadow values). Those four rows were Failed and are now Passed on that basis. This review did not re-test the shadow, and did not need to under the ruling. Design and code still differ in blur (16 vs 12), opacity (16% vs 20%) and colour (navy vs black).
2. **Behaviour QA did not test, not credited.** The two behaviour rows say, and `reports/Modal/qa-report.md` repeats, that the Tab focus trap, the real Escape key, a real backdrop click and screen-reader output were NOT tested (no real input, no screen reader; controls were activated with `element.click()`). This review had no browser and could not test them either. They are **not passed here**. What was credited: the programmatic checks QA did record (opens as native `:modal`, focus moves to the close button, labelled and described, close/Cancel/action close it, focus returns to the trigger, the `cancel` event is handed to the owner).
3. **Inter not loaded.** Confirmed. `build/css/tokens.css:150` sets `--fontfamily-body: Inter`; there is no `@font-face`, font import or font link anywhere in `src/`, `tokens/` or `.storybook/` (`.storybook/preview.ts` has no font reference). Inter renders only where a consumer has it installed. Affects every component, not only Modal; QA could not judge glyph widths. Unverified, not passed.
4. **Intent file against the Figma Usage frame (244:154), read fresh.**
   - `use_when` 1-3 equal the three "Use a modal" lines verbatim. `use_when` 4-6 equal the three "Best Practice" lines verbatim (carried into `use_when`, as `component-intent` allows when they read as a "do").
   - `dont_use_when` 1-3 equal the three "Do not use a modal" lines verbatim. Figma names `Stepper` in line 2 only; lines 1 and 3 name no component ("show it on the page, or in a toast" names a pattern, not a Horizon component; line 3 names none), so `instead: ""` on those two is faithful to the page.
   - `pairs_with: ["Button"]` is sourced from the stories (the `Opener` story composes `Button`, `Modal.stories.tsx:106`), as `component-intent` specifies. It omits `ButtonGroup`, which `Modal.tsx:4,192` imports and renders and which the board's `Composes` records. By the skill's rule (stories only) this is not a defect. It is a gap for the intent owner to decide.
   - `variant_intent.default` is `""`: Figma's page says nothing about when to use the default tone. A recorded Figma gap, allowed by `component-intent`. `dialog`, `sheet` and `destructive` carry text taken from the `use_when` lines.
   - "Open a modal from another modal" is recorded verbatim in `dont_use_when` but **nothing enforces it**: `Modal.tsx` has no nesting guard, and two `open` Modals can both call `showModal()`. This is guidance, not a check any gate or check measures; it is reported as a warning, not a block.
5. **Accessibility gaps not covered by the ruling.** See Warnings: close target 20x20, initial focus, no `alertdialog` role, title as `<p>`. Each is reported, none waived.
6. **Composes.** The board records `ButtonGroup`. Confirmed in code: `Modal.tsx:4` imports it and `:192-198` renders it for the actions. Consistent. No other Horizon component is imported. Consequence for re-testing: a change to ButtonGroup means Modal must be re-tested.

## Failures

None. Gate 2 would fail on nine literal rows without the ruling; with it, none.

## Warnings

None of these is a block. Each is a finding for its owner. Owners in brackets.

**Accessibility (not waived, not covered by the ruling; the ruling's "Not ruled" line leaves them to a human):**

1. **Close target is 20x20 px** (`Modal.css:124-125`), under the 24x24 px minimum of WCAG 2.2 AA success criterion 2.5.8. The size itself is accepted for gate 2 by the ruling, but the accessibility shortfall is not. [designer, then engineer; a human settles]
2. **Initial focus lands on the close button.** For the destructive tone, focusing Cancel first is the usual practice, so a stray Enter or Space does not confirm a deletion. Figma draws no focus behaviour. [designer to specify, then engineer]
3. **No `role="alertdialog"` for the destructive tone.** The root is a plain `<dialog>` for both tones (`Modal.tsx:120`). [designer and engineer]
4. **The title is a `<p>`** (`Modal.tsx:160`), named through `aria-labelledby`, not a heading, so it is not in the page's heading outline. [engineer]
5. **Unverified accessibility behaviour:** Tab focus trap, real Escape key, real backdrop click, screen-reader output. Not tested by QA, not testable here. The `a11y` entries that describe them cite correct code but are not evidence of behaviour. A human or a session with real input should test them. [qa, with real input]

**Design and tokens:**

6. **Shadow differs from Figma** (accepted by ruling): code `--elevation-lg` `0 8 16` at 16% navy against Figma `0 8 12` at 20% black, unbound. If the designer binds the Figma shadow to a token, re-test it against the node. [designer]
7. **Observation on the ruled 20px and 4px:** the token build does define `--spacing-xl: 20px` and `--spacing-xs: 4px` (`build/css/tokens.css:36, 32`). They are spacing tokens, and the ruling states there are no size tokens, so the ruling was applied as written to `width`/`height` of the close and handle. A human may want to confirm the ruling was meant to cover values that coincide with a spacing token. Not stretched, not blocked. [human]
8. **Desktop sheet width is unspecified.** The open sheet spans the viewport at 1440px (QA, 1440x374); Figma draws only the 390px sheet. In the ruling's "Not ruled" line. [designer]
9. **Inter is not loaded** (see above); the repo ships no font loading. Affects all components. [engineer, or a human decision on font delivery]

**Intent (owner: `component-intent`, never edited by this review):**

10. **C2: two `dont_use_when` entries have an empty `instead`:** "For information people should read while they keep working: show it on the page, or in a toast." and "Open a modal from another modal." Figma names no Horizon component for either.
11. **`variant_intent.default` is empty.** Figma gap.
12. **"Open a modal from another modal" is not enforced** in code (see above).
13. **`pairs_with` omits `ButtonGroup`**, which Modal composes and the board records.

**Process:**

14. **G7:** `VERSIONING.md` does not name Modal (nor Form, nor Card). A human updates it before a version containing Modal ships. This review does not bump or tag.
15. **`Astro Link` is empty.** Step 2 of the skill (read the production docs page first) could not be done, and `docs-site/` holds no Modal page. Source and Storybook were read instead. `Astro Link` is devops' cell and was not written. `Development` cannot read `Released` for Modal until it is set; `Cleared` does not change `Development` on its own.

## Not checked

- No browser: G1 is evidenced by HTTP 200 and the deployed story index, not a render. The shadow, the layout, the Tab trap, real Escape, real backdrop click and screen-reader output were not tested here.
- The Astro docs page (empty, see warning 15).
- Other components' rows and review files, and the version, tag and npm state, which are out of scope for this run.
