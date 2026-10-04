# QA Report — File

Source: [Figma node 204:41](https://www.figma.com/design/dIHHqSq8c75n4olME0s9JS/Core-Component?node-id=204-41) (component set 204:41; 5 cells: type dropzone × state default/dragover, type item × state uploaded/uploading/error; usage frame 204:76). The registry link (57-1642) is the canvas page, not a component.
Component: `src/components/File/File.tsx` (branch `build/file`, commit `db7e1d5`)

## Staging QA pass — 2026-10-04

**Environment:** a real Vercel preview deployment of branch `build/file` (`https://horizon-design-system-cdfi-fx6gmu7g1-mavis17.vercel.app`), not production and not `main`. Measured in a browser by the orchestrating session, since the qa subagent has no browser. Expectations come from Figma via `get_metadata` (the qa agent's `get_design_context` calls failed on network errors, so colour and padding expectations are relayed from the orchestrator's read).

| Case | Expected (Figma) | Measured (live) | Result |
|---|---|---|---|
| dropzone / default (204:6) | 400×80 | 400×80, bg `#f2f3f5`, 1px dashed `#d7dee7`, radius 2px | ✅ Pass |
| dropzone / dragover (204:9) | 400×80, blue tint | 400×80, bg `#eff3ff`, 1px solid `#2b5ad6` | ✅ Pass (token drift) |
| item / uploaded (204:12) | 400×62 | 400×62, bg `#f9fafb`, 1px solid `#d7dee7`, 32px thumbnail | ✅ Pass |
| item / uploading (204:19) | 400×72, progress bar | 400×72, ProgressBar sm at 60% | ✅ Pass |
| item / error (204:34) | 400×62, red border | 400×62, border `#d02727` | ✅ Pass (token drift) |

Five `Staging Testing` rows written, all `Passed`, linked to the File row. Figma `state` mapping: default → idle, dragover → hovered, uploaded → completed, uploading → loading, error → error. Console clean.

**Behaviour (real events):** choosing files through the hidden input adds items; dragenter/dragover on the zone sets dragover and dragleave clears it; drop adds an item; Remove deletes one.

**First preview failed, then fixed:** the first build (`4e14317`) measured 82/82/64/74/64, 2px taller than Figma in every cell, because the 1px border was added outside the padding. The engineer subtracted the border from the padding in `db7e1d5`, and all five cells now match exactly.

**Limitations (not defects):** Inter is not installed in the test browser, so text widths are unverified. Screenshot attachments are empty.

**Not failed, by decision:**
- `--color-primary-default` renders `#2b5ad6` (Figma `#3b71f2`) and `--color-status-error` renders `#d02727` (Figma `#ea3d3d`): accepted pipeline drift.
- Raw `32px` thumbnail width and height (`File.css`): no token matches; Figma specifies 32px. Needs a `decisions.md` ruling at release review.
- `disabled` prop with a `0.6` opacity is an engineer addition; Figma draws no disabled state. Figma also draws no hover, pressed or focus; the engineer added a focus outline.
- `progress`, `actionLabel`, `onAction`, `onFiles`, `accept`, `multiple` and `disabled` are not Figma properties.
- Composes ProgressBar (uploading item). Remove and Cancel are native buttons styled with link tokens, as Figma draws plain text.

## Summary: PASS
