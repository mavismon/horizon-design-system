# Horizon Design System

React components and design tokens for the Horizon Design System, built from its Figma library.

## Install

```bash
npm install @layerbasesystemic/horizon-design-system react react-dom
```

React and React DOM are peer dependencies (version 19).

## Use

```tsx
import "@layerbasesystemic/horizon-design-system/tokens.css";
import "@layerbasesystemic/horizon-design-system/styles.css";
import { Button } from "@layerbasesystemic/horizon-design-system";

export function Save() {
  return <Button text="Save changes" state="default" />;
}
```

`tokens.css` defines the design tokens (light by default, dark under `[data-theme="dark"]`). `styles.css` holds every component's styles.

## Links

- Storybook: https://horizon-design-system-cdfi.vercel.app
- Docs: https://horizon-docs-zeta.vercel.app
