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

## Components

0.3.0 ships twenty-three components: Avatar, Breadcrumbs, Button, ButtonGroup, Calendar, Card, Checkbox, Chip, Dropdown, File, Form, Header, Image, Link, Logo, Modal, ProgressBar, RadioCard, SearchBar, SideBar, Stepper, Table, Toggle. `Textfield`, the input Form is built from, is exported too. Each page on the docs site shows its props, variants and when to use it. See [VERSIONING.md](VERSIONING.md) for what each version commits you to and [CHANGELOG.md](CHANGELOG.md) for what changed.

## Links

- Storybook: https://horizon-design-system-cdfi.vercel.app
- Docs: https://horizon-docs-zeta.vercel.app
