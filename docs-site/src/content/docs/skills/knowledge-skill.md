---
title: The knowledge skill
description: What an agent can read about Horizon today.
---

## Not in 0.2.0

No knowledge skill ships inside `@layerbasesystemic/horizon-design-system`. The package's `files` list is `dist` only, and nothing in it is a skill an agent loads.

## What an agent can read today

- **This site.** Each component page's Usage tab says when to use the component and when not to, in the design team's own words, and its Code tab lists every prop.
- **The types.** `dist/index.d.ts` carries every public prop and union type.
- **The intent files in the repository.** `src/components/<Name>/<Name>.intent.json` holds `use_when`, `dont_use_when`, what each variant is for, placement, pairings, required tokens and accessibility facts. They aren't in the package.

## When it ships

If a knowledge skill ships, it will be listed in the [changelog](/get-started/changelog/).
