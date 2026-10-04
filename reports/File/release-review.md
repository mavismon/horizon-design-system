# File · release review

- **Reviewed SHA:** `028ec8912fcde6c3ec9d23023de7ba8f42d0cbf6` (branch `release-review/file`). Three commits on top of `origin/main` `50cbfea`: `8c0433f` (`File: add intent file from Figma usage frame 204:76`, a cherry-pick of `c1d35d1` from `origin/intent/file`, adds only `src/components/File/File.intent.json`), the `decisions.md` commit (appends the human ruling "2026-10-04 · File thumbnail size with no token", verbatim, 15 lines) and the QA report commit (adds `reports/File/qa-report.md`, copied unchanged). `src/` differs from `origin/main` only in the intent file; the File build is `db7e1d5`, in `origin/main`'s history. This report is committed on top of the reviewed SHA.
- **Date:** 2026-10-04
- **Verdict:** **Cleared**
- **Reviewer:** release agent, running `release-review`
- **Board row:** `File` (`recuhcmEhj6IH7RL3`), read fresh: `Development` = `Completed`, `Design` = `Done`, `Staging Storybook` and `Production Storybook` set, `Commit` = `db7e1d5`, 5 `Staging Testing` rows all `Passed`, `Composes` = ProgressBar, `Astro Link` empty, `Last Modified` = 2026-10-04T15:20:04Z (16:20 BST, after `50cbfea` at 16:16 BST; `src/` has not changed since the build commit `db7e1d5`, only the intent file was added). `Release Review` and `Release Verdict` empty before this review.

## Rulings applied

`decisions.md` was read in full at the reviewed SHA. One ruling is applied, to gate 2 only: **"2026-10-04 · File thumbnail size with no token"**, appended in this branch as a separate commit before this review. Verified against `src/components/File/File.css` at the reviewed SHA: line 95 is `width: 32px;` and line 96 is `height: 32px;`, both in `.hz-file__thumbnail` (which opens at line 89). Quoted:

> **Ruling.** These literals in `src/components/File/File.css` are accepted, because they are what the Figma node specifies, until the designer adds a matching size token: `32px` `width` (thumbnail), `.hz-file__thumbnail`, line 95; `32px` `height` (thumbnail), `.hz-file__thumbnail`, line 96.
>
> **For an agent that hits it.** Gate 2 passes for exactly these values on exactly these properties in `File.css`. Quote this ruling in the report. When a size token for 32px appears, the ruling no longer covers it: use the token.
>
> **Not ruled.** Any other literal value, including a `var()` fallback. These values in any other component. A change to these values: a different number needs a new ruling or a token. The `disabled` prop's `0.6` opacity, which Figma does not draw: it is unitless, and whether it should exist is for the designer. The primary and error colours, which use bound tokens (`#2b5ad6`, `#d02727`) and differ from the `#3b71f2` and `#ea3d3d` Figma shows: that is accepted pipeline drift, not a gate finding. Any state Figma does not draw.

The ruling covers nothing else in this review. No other ruling is applied.

## Gates and checks

| # | Gate / check | Result | Evidence |
|---|---|---|---|
| G1 | Done | Pass | `Development` reads `Completed`. `Production Storybook` (`https://horizon-design-system-cdfi.vercel.app/?path=/story/components-file--all-variants`) returns HTTP 200, and the deployed `index.json` lists nine File stories: `dropzone-default`, `dropzone-dragover`, `item-uploaded`, `item-uploading`, `item-error`, `dropzone-custom-copy`, `item-image-file`, `all-variants`, `interactive`. No browser was available to this agent, so "opens" is evidenced by the 200 and the story index; the QA report records the live render on the preview deployment. |
| G2 | Tokens | Pass (by ruling) | A grep of `File.css` for `px`, hex, `rgb(a)`, `hsl(a)`, `%`, decimals, `calc(` and any `var(` with a comma finds: lines 95 and 96, `32px` width and height of `.hz-file__thumbnail`, **covered exactly by the ruling above**; no hex, no `rgb`/`hsl`, no `var()` fallback. Everything else is unitless, keyword or token arithmetic: `width: 100%` (lines 4, 29, 37, 58, 70), `height: 100%` (38), `opacity: 0` (40, the visually hidden native input), `opacity: 0.6` (54, the disabled dropzone, unitless and named in the ruling's "Not ruled" as a designer question; it is not a hex or px literal, so it is reported as finding 3, not a gate failure), `font-weight: 400/500`, `flex: 1 0 0`. Two `calc()` expressions are token arithmetic, judged the same way as the Dropdown and ButtonGroup reviews: line 30 `calc(var(--spacing-xl) - var(--border-width-sm))` (20px - 1px = 19px) and line 81 `calc(var(--spacing-md) - var(--border-width-sm))` (11px). Every operand is a token. `var(--fontfamily-body), sans-serif` (line 7) has `sans-serif` outside the `var()`, a keyword. |
| G3 | Surface | Pass | `src/index.ts:31` exports `File`; line 32 exports `FileProps`, `FileType` and `FileState`. `src/styles.css:13` imports `File.css`. The `Dropzone` helper in `File.tsx:98` is not exported and is internal. Nothing says File should stay internal. |
| G4 | Names | Pass | Folder `src/components/File/`, symbol `File` (`File.tsx:37`), CSS prefix `hz-file`, intent `File.intent.json`, board row `File`; Figma calls the set `file` (204:41). Same word. Note that `File` shadows the browser global `File` for any consumer that imports it unaliased (finding 8). |
| G5 | States | Pass | Figma set `204:41` read fresh with `get_metadata`: five cells: `204:6` dropzone/default, `204:9` dropzone/dragover, `204:12` item/uploaded, `204:19` item/uploading, `204:34` item/error. Code: `FileType` (`dropzone`, `item`) and `FileState` (`default`, `dragover`, `uploaded`, `uploading`, `error`) at `File.tsx:6-7`. Each cell has a story: `DropzoneDefault`, `DropzoneDragover`, `ItemUploaded`, `ItemUploading`, `ItemError`, plus `AllVariants`; `DropzoneCustomCopy`, `ItemImageFile` and `Interactive` are extra. Figma draws no hover, pressed or disabled state; the code adds a `disabled` prop and focus styling (finding 3). |
| G6 | Intent | Pass | `File.intent.json` exists at the reviewed SHA and passes checks 1 to 6. |
| G7 | Version | Pass, with a standing note | `VERSIONING.md` exists at the reviewed SHA and states the 0.x bump rules and what 0.1.0 commits you to. Line 35 is stale: it says 0.1.0 "contains one component, `Button`", while the source now exports thirteen components including File. Reported, not edited. A human updates it before a version containing File ships. |
| C1 | Fields present | Pass | All seven fields present with the right types: `use_when` 6 strings, `dont_use_when` 3 objects (`when`, `instead`), `variant_intent` object with 2 keys, `placement` `[]`, `pairs_with` `[]`, `required_tokens` 26 strings, `a11y` 5 objects (`fact`, `source`). `placement` and `pairs_with` are empty; see finding 4. |
| C2 | Alternatives named | Pass, one warning | Two of three `dont_use_when` entries name an alternative (`Link, table row`; `Avatar`). Entry 3, "Do not hide the limits: never leave the Hint empty." has an empty `instead`: **warning**, not a block (it is a rule about this component, with no other component to point at). |
| C3 | a11y specific | Pass | Five entries; every cited line checked at the reviewed SHA. `File.tsx:121` is the `<label>` (htmlFor the native `<input type="file">`, line 129 to 142); `:137` is `aria-describedby` on the input; `:136` is `disabled={disabled}` on the input (the dropzone focus outline the entry mentions is in `File.css:48-51`, not on the cited line); `:72` is `role={error ? "alert" : undefined}` on the meta line; `:67` is the thumbnail `aria-hidden="true"` (the native `<button type="button">` the entry also mentions is at line 79). Each names a concrete element, attribute or behaviour and its line implements the first claim in it; see finding 7 for the second claims. |
| C4 | Tokens resolve | Pass | `npm run build:tokens` run at the reviewed SHA wrote `build/css/tokens.css`. All 26 listed tokens are defined there. The set of `var(--...)` names in `File.css` equals the listed set exactly (26 and 26, no difference either way). |
| C5 | Variants covered | Pass | `variant_intent` keys are `dropzone`, `item`: exactly the values of `FileType` (`File.tsx:6`). None missing, none extra. |
| C6 | No duplicate job | Pass | Compared `use_when` with the twelve other intent files in `src/components/`: no identical entry, and no two components claim the same job. The nearest neighbours mention files or photos (Avatar, Image); File's `dont_use_when` routes profile photos to Avatar and Avatar's routes the reverse. Adjacent, not the same job. |

## Intent against Figma Usage 204:76

The intent file was written by `doc-generator` from the Figma usage frame on the `intent/file` branch. This review did not re-read the frame and did not edit the file; it checked shape, lines, tokens, variants and overlap only.

## Failures

None.

## Warnings (not blocking)

- **Check 2:** `dont_use_when` entry 3 ("Do not hide the limits: never leave the Hint empty.") has an empty `instead`.

## Findings outside the gates

1. **Props that are not Figma properties.** `progress`, `actionLabel`, `onAction`, `onFiles`, `accept`, `multiple` and `disabled` (`File.tsx:24-34`), plus passthrough div attributes. The source header and the QA report say they were added so the component is usable. They are public API once published (a 0.x breaking-change surface under `VERSIONING.md`). Owner: a human, to accept them as intended API or ask the designer to draw them.
2. **Pipeline colour drift.** `--color-primary-default` renders `#2b5ad6` (Figma `#3b71f2`) and `--color-status-error` renders `#d02727` (Figma `#ea3d3d`). Accepted drift under the ruling's "Not ruled" paragraph and the QA report. Same as Button, Chip, Toggle and Dropdown.
3. **Unspecified states.** The `disabled` prop dims the dropzone to `opacity: 0.6` (`File.css:54`) and disables the item action (`File.css:89`); Figma draws no disabled, hover, pressed or focus state. The engineer added keyboard focus (focus-border outline on the dropzone, `File.css:48-51`; on the action, `:84-87`) and an underline on action hover. The 0.6 is the one the ruling leaves to the designer. Owner: the designer.
4. **Empty `placement` and `pairs_with`.** File imports and renders ProgressBar for state=uploading (`File.tsx:4`, `:76`) and the board row's `Composes` is ProgressBar, but `pairs_with` is `[]`, because the stories import only `File`. Check 1 allows an empty list. Owner: `component-intent`, if the team wants the composition recorded.
5. **Astro Link empty.** `release-review` expects `Astro Link` before a review, but `Astro Link` is written by devops after a Cleared verdict (the circular docs gate noted in `release.md`). The review therefore had no production docs page to read first, and compared the source with Figma and the QA report instead. Owner: devops, after merge.
6. **Computed spacing.** Dropzone and item padding come from `calc()` over a spacing token minus the border width (`File.css:30`, `:81`), so that the box including its 1px border matches Figma's 400x80 / 62 / 72 cells (the QA report records the first build measuring 2px too tall). If the designer adds exact spacing tokens, these should bind to them.
7. **a11y second claims.** Entries 3 and 5 each cite one line for two facts (`File.tsx:136` for disabled and the focus outline, which is in `File.css:48`; `File.tsx:67` for the aria-hidden badge and the button, which is at line 79). Check 3 is met by the first fact on each line; precision owner: `component-intent`.
8. **Name shadows a browser global.** The exported symbol `File` has the same name as the DOM `File` constructor; a consumer who imports it without aliasing shadows the global in that module. The row, Figma and folder all say `File`, so G4 passes. Owner: a human, to accept it or rename before 1.0.
9. **QA limitations carried over.** Inter was not installed in the test browser, so text widths are unverified; screenshot attachments are empty; the qa agent's `get_design_context` calls failed on network errors, so colour and padding expectations were relayed by the orchestrating session.
10. **Standing `VERSIONING.md` note.** See G7: line 35 says 0.1.0 contains one component, `Button`.
