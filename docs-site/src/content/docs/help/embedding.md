---
title: Embedding
description: How this site embeds Storybook and Figma, and what to check when a frame is blank.
---

## The Storybook frames

Component pages embed stories from the [production Storybook](https://horizon-design-system-cdfi.vercel.app) in light. The Storybook has no theme switch yet, so there's no dark rendering to embed; each page says so where the dark frame would go.

Two things have to agree for a frame to show:

- This site's Content Security Policy must list the Storybook origin in `frame-src`. It does, in `docs-site/vercel.json`.
- The Storybook's own response must not forbid framing through `X-Frame-Options` or a `frame-ancestors` directive. It sends neither today.

## If a frame is blank

- **The Storybook moved:** `storybookUrl` in `docs-site/reference.config.json` and `frame-src` in `docs-site/vercel.json` both need the new origin.
- **The Storybook started forbidding framing:** add this site's origin to its `frame-ancestors`, rather than `*`.
- **The story was renamed:** the next site build picks up the new id from the Storybook's `index.json`.

Every frame has a link beneath it, so a blank frame costs a click rather than the content.

## The Figma frames

The Design tab embeds the Figma node through `embed.figma.com`. The file is shared with the team only, so the frame shows a sign-in to anyone outside it, and the link beneath it asks for the same access. That's the file's sharing setting, not a fault on this site.
