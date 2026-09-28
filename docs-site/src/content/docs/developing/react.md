---
title: React
description: Using Horizon components in a React app.
---

## Props and native attributes

Each component's props are listed on its Code tab. Button's props type extends the native button attributes (except `children`), and every attribute you pass that isn't one of its own props is spread onto the rendered `<button>`:

```tsx
<Button text="Delete" state="error" onClick={remove} aria-describedby="delete-help" disabled={busy} />
```

- **`type`** defaults to `"button"`. Because your attributes are spread after it, `type="submit"` overrides it.
- **`className`** is added to Button's own `hz-button` classes, not substituted for them.
- **The label** is the `text` prop, which defaults to `"Label"`. Button takes no `children`.
- **Icons:** `startIcon` and `endIcon` both default to `true` and show a decorative star. Pass `swapIcon` to render your own node in both positions instead, or set either flag to `false`.

## Class names

Every class a component adds itself starts with `hz-` (for Button: `hz-button`, `hz-button__icon` and one `hz-button--<state>` modifier). They're part of the public surface, so a rename is a breaking change; see [Versioning](/get-started/versioning/).

## Themes

Set `data-theme="dark"` on an element to switch everything inside it to the dark tokens. See [Theming](/styling/theming/).
