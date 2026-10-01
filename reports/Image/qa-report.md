# QA Report — Image

Source: [Figma node 124:2](https://www.figma.com/design/dIHHqSq8c75n4olME0s9JS/Core-Component?node-id=124-2) (component set 123:22; 15 variants: ratio × radius)
Component: `src/components/Image/Image.tsx` (branch `build/image`, commit `ed350d2`)

## Staging QA pass — 2026-10-01

**Environment:** a real Vercel preview deployment of branch `build/image` (`https://horizon-design-system-cdfi-ac82qaq9o-mavis17.vercel.app`), not production and not `main`. Measured in a browser by the orchestrating session, since the qa subagent has no browser. Expected sizes were read independently from Figma (`get_metadata` on component set 123:22); radii come from the bound tokens and the component description (none, sm 6px, md 12px).

| ratio | Figma size (w×h) | none | sm (6px) | md (12px) |
|---|---|---|---|---|
| 4:3 (default) | 240×180 | ✅ | ✅ | ✅ |
| 1:1 | 240×240 | ✅ | ✅ | ✅ |
| 3:2 | 240×160 | ✅ | ✅ | ✅ |
| 16:9 | 240×135 | ✅ | ✅ | ✅ |
| 2:1 | 240×120 | ✅ | ✅ | ✅ |

All 15 cells measured exactly as Figma draws them (width 240 in the story's 240px container, the heights above, the radius, `object-fit: cover`, image loaded, `alt` empty). 15 `Staging Testing` rows written, all `Passed`, linked to the Image row. Console clean.

**Behaviour:** the component is `width: 100%` with an `aspect-ratio`. Resizing the container to 120, 240 and 480px (16:9) gave heights 67.5, 135 and 270, never stretched, which matches the Figma description ("the ratio is locked, so resize by width").

**Not failed, by design:**
- The component has no intrinsic 240px width (Figma shows 240px; no token matches it). The stories wrap it in a 240px container. This is the engineer's recommendation and is raised for a decision.
- The Usage text says to show a placeholder while a photo loads; Figma draws no loading state, so none is built. The aspect-ratio box does reserve the space.
- `alt` defaults to `""` (decorative), as Avatar does.
- Figma variant 123:9 (4:3, md) contains two stacked identical image layers; the build uses a single `<img>` (a design artefact).

## Summary: PASS
