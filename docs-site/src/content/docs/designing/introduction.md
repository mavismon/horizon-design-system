---
title: Designing
description: The Figma file, the themes you design against, and how tokens reach code.
---

## The Figma file

Horizon's components are designed in the [Core Component](https://www.figma.com/design/dIHHqSq8c75n4olME0s9JS/Core-Component) Figma file. Button has its own page there, `Button`, which holds:

- the component set, one variant per value of each property (Button's is node `19:31`);
- a documentation frame that lays the variants out as a matrix;
- a **Usage** frame with "when to use", "when not to use" and "best practice" lists.

The file is shared with the team only.

## How design reaches the docs

The Usage frame is the source of a component's intent file (`src/components/<Name>/<Name>.intent.json`), which is copied from it word for word and becomes the Usage tab of the component's page here. A missing Usage frame shows up on the site as a missing-source notice, not as invented text.

Values on a Figma node that aren't bound to a variable are listed on the component's Design tab, next to what the code does with each.

## Tokens

The token source files live in `tokens/` in the repository. `tokens/manifest.json` groups them into collections: `core`, `semantic` with a `light` and a `dark` mode, and `typography`, plus typography and effects styles.

`build-tokens.js` turns them into:

- `tokens.css`: the core scale, the light semantic colours, web typography and the styles, on `:root`;
- `tokens-dark.css`: only the colours that change, under `[data-theme="dark"]`;
- `Tokens.swift` for iOS and `colors.xml` for Android, from the mobile typography mode.

The package ships the two CSS files together as `tokens.css`. Every value is on the [Tokens](/core/tokens/) page.

## Themes

Design against both modes of the `semantic` collection. Light is the default; dark redeclares the semantic colours only, so spacing, radius and type are the same in both. See [Theming](/styling/theming/).
