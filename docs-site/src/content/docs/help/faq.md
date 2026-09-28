---
title: FAQ
description: Common questions about the Horizon Design System.
---

## Why is the version 0.x?

The API isn't declared stable yet. On 0.x, a breaking change bumps the minor number, so `^0.1.0` never picks one up. See [Versioning](/get-started/versioning/).

## Why does Button have a `hover` state value?

The Figma component set publishes `state=hover` as its own variant, and the code matches Figma's values exactly. `state="hover"` renders the hover look permanently; a `state="default"` button also shows it under the pointer.

## Does it support dark mode?

Yes, through tokens: set `data-theme="dark"` on an ancestor. See [Theming](/styling/theming/).

## Do I need to load a font?

Yes. The tokens name Inter, but the package ships no font files. See [Developing](/developing/introduction/#fonts).

## Where are the live components?

In the [Storybook](https://horizon-design-system-cdfi.vercel.app). Each component page on this site embeds and links the matching stories.

## Why isn't a component I need here?

A component gets a page only once it's built, tested, deployed and has cleared its release review. The [Roadmap](/get-started/roadmap/) lists the rest.
