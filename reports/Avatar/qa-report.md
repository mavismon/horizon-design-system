# QA Report — Avatar

Source: [Figma node 113:2](https://www.figma.com/design/dIHHqSq8c75n4olME0s9JS/Core-Component?node-id=113-2) (component 112:9)
Component: `src/components/Avatar/Avatar.tsx` (commit `85ecfed`)

## Staging QA pass — 2026-10-01

**Environment note:** the registry's `Staging Storybook` for Avatar is the **production** Storybook (`https://horizon-design-system-cdfi.vercel.app`), by the user's explicit decision for this one row. No separate staging build was tested; the Vercel project deploys every push to `main` to that URL. Browser measurements were taken by the orchestrating session, since the qa subagent has no browser.

Expectations come from Figma node 113:2 via `get_design_context`, not the story file. Each size was loaded as its own story and measured in the live page.

| Case | Expected (Figma) | Measured (live) | Result |
|---|---|---|---|
| size sm (112:7) | 24×24, circle (`--radius-full`), clip, photo cover | 24×24, `999px`, `overflow: clip`, img 24×24, `object-fit: cover`, loaded | ✅ Pass |
| size md (112:6) | 30×30, same | 30×30, same, img 30×30 | ✅ Pass |
| size lg (112:8) | 40×40, same | 40×40, same, img 40×40 | ✅ Pass |

Console clean. Three `Staging Testing` rows written, all `Passed`, linked to the Avatar row.

**Not failed, by decision:** sizes are raw px (24/30/40) because Figma binds no avatar size tokens (user-approved). No fallback or states exist in the design.

**Notes:** the story image is `avatar-sample.jpg` (1024×1024), a copy of the Figma placeholder photo. `use_when` / `dont_use_when` in `Avatar.intent.json` are empty because the Figma page has no usage region.

## Summary: PASS
