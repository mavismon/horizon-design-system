---
title: Theming
description: Light and dark, and how the tokens switch between them.
---

## Two themes, one stylesheet

`tokens.css` holds both themes:

- **Light** is the default. Every token is declared on `:root`.
- **Dark** redeclares only the semantic colours, under `[data-theme="dark"]`. Spacing, radius, border widths, type and the core colour scale are the same in both themes.

The [Tokens](/core/tokens/) page lists each token's light and dark value.

## Switching

Set `data-theme="dark"` on an element. The selector is an attribute selector, not tied to `:root`, so it works on `<html>` for the whole page or on any element for just what's inside it:

```html
<html data-theme="dark">
```

Remove the attribute, or set any other value, to go back to light.

## What the components do

Components take their colours from semantic tokens through `var(--…)`, so they follow the theme with no prop of their own. Button has no `theme` prop.

## This site

This site uses the same `tokens.css`: its stylesheet maps Starlight's colour variables onto Horizon's semantic tokens, and the theme picker sets `data-theme` on `<html>`.
