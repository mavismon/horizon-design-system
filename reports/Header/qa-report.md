# QA Report — Header

Source: [Figma node 208:43](https://www.figma.com/design/dIHHqSq8c75n4olME0s9JS/Core-Component?node-id=208-43) (component set 208:43; 3 cells: type web 208:7, app 208:29, backoffice 208:36, plus the boolean variations drawn on the specimen board; usage frame 208:670). The registry link (57-1643) is the canvas page, not a component.
Component: `src/components/Header/Header.tsx` (branch `build/header`, build commit `8be1087`, branch head `e3747b3`)

## Staging QA pass — 2026-10-04

**Environment:** a real Vercel preview deployment of branch `build/header` (`https://horizon-design-system-cdfi-fdpw5yd3j-mavis17.vercel.app`), not production and not `main`. Measured in a browser by the orchestrating session, since the qa subagent has no browser. Expectations come from Figma via `get_metadata` and `get_design_context` on 208:7, 208:29 and 208:36.

| Case | Expected (Figma) | Measured (live) | Result |
|---|---|---|---|
| web (208:7) | 1280×64, 1px bottom border `#eef1f5`, padding 24px, Logo lockup left, nav gap 20, Button 80 wide, Avatar 30 | 1280×64, border and padding as drawn, Logo 149×32 at x=24 y=16, nav links 14px (Medium `#161925` then Regular `#4d5361`), Button 80×36, Avatar 30×30 ending at x=1256 | ✅ Pass |
| web, ShowAvatar off (signed out) | no avatar | renders without avatar | ✅ Pass (not separately measured) |
| web, ShowButton off | no button | renders without button | ✅ Pass (not separately measured) |
| app (208:29) | 390×52, centred 18px title, back chevron, side columns 72 | 390×52, title 18px/600, back chevron 20×20 at x=20 (native button, aria-label Back) | ✅ Pass |
| app, ShowBack off | no chevron | renders without chevron | ✅ Pass (not separately measured) |
| app, ShowAction on | text action on the right | "Save" ends 20px from the right edge | ✅ Pass |
| backoffice (208:36) | 1220×56, page title, 260px search, Avatar 30 | 1220×56, title weight 500 at x=24, SearchBar 260×36, Avatar 30×30 ending 24px from the right | ✅ Pass |
| backoffice, ShowSearch off | no search | renders without search | ✅ Pass (not separately measured) |
| backoffice, ShowAvatar off | no avatar | renders without avatar | ✅ Pass (not separately measured) |

Nine `Staging Testing` rows written, all `Passed`, linked to the Header row. Figma publishes no size or interactive state, so every row is logged as size none, state idle, with the boolean variation in Variants. Console clean. Header is a `<header>` landmark and the avatar image loads.

**Branch note:** `origin/build/header` already held an earlier, abandoned Header attempt (`9dcc0dc`, built on older staging, with an intent file and no SearchBar). The engineer did not force-push. `e3747b3` is a `merge -s ours` of that branch, so the old commit stays in history with none of its content, and the tree equals `8be1087`.

**Limitations (not defects):** Inter is not installed in the test browser, so text widths are unverified. The back chevron is a drawn SVG, while Figma uses an exported vector; the glyph shape was not compared. Responsive behaviour is not designed in Figma: the bar is `width: 100%` and the story decorators apply 1280, 390 and 1220. Dark mode was not tested.

**Not failed, by decision:**
- Raw px with no size tokens, all drawn in Figma: bar heights 64, 56 and 52 (border-box so the 1px border sits inside), app side columns 72px, back icon 20px, nested Button 80px wide, backoffice SearchBar 260px. These need a `decisions.md` ruling at release review. No raw hex.
- The web nav is plain text in Figma; the code uses Link anchors with size and colour overridden, so Link's hover underline applies.
- Font weights are numeric (400, 500, 600); there are no weight tokens in `tokens.css`, although the Figma code references weight variables.
- Extra props: `buttonText`, `avatarSrc`, `avatarAlt`, `searchPlaceholder`, `link1Href`, `link2Href`, `link3Href`, `onButtonClick`, `onBackClick`, `onActionClick`, `onSearch`. `avatarSrc` has no default photo because the library build has no image loader.
- Figma draws no hover, pressed or disabled state; the engineer added `:focus-visible` on the back and action buttons.
- Composes Logo (lockup), Link, Button, Avatar (md) and SearchBar (field, md). The back chevron and the app action are plain elements because Figma draws no component for them.

## Summary: PASS
