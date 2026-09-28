---
title: Developing
description: Install the package, load the two stylesheets, render a component.
---

## Install

```bash
npm install @layerbasesystemic/horizon-design-system react react-dom
```

React and React DOM are peer dependencies, version `^19.2.8`.

## Load the stylesheets

The package has three entry points:

| Entry point | What it holds |
|---|---|
| `@layerbasesystemic/horizon-design-system` | The components and their types, as ESM and CommonJS |
| `@layerbasesystemic/horizon-design-system/tokens.css` | The design tokens: light on `:root`, dark under `[data-theme="dark"]` |
| `@layerbasesystemic/horizon-design-system/styles.css` | Every component's styles, in one file |

Load both stylesheets once, before any component renders. Components read every colour, radius and type size from `tokens.css`, so `styles.css` on its own isn't enough.

## Render a component

```tsx
import "@layerbasesystemic/horizon-design-system/tokens.css";
import "@layerbasesystemic/horizon-design-system/styles.css";
import { Button } from "@layerbasesystemic/horizon-design-system";

export function Save() {
  return <Button text="Save changes" state="default" />;
}
```

## Fonts

The tokens name `Inter` as the body and heading font (`--fontfamily-body`, `--fontfamily-heading`). The package doesn't ship font files, so load Inter in your app; without it, text falls back to `sans-serif`.

## Next

- [React](/developing/react/): props, native attributes and class names.
- [React Router](/developing/react-router/): where the stylesheets go.
- [All components](/core/components/overview/).
