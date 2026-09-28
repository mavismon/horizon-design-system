---
title: Upgrading
description: What changes between versions, and what to do about it.
---

## To 0.1.0

0.1.0 is the first published version, so there's nothing to upgrade from.

## After 0.1.0

The next release will carry the unreleased commits listed on the [changelog](/get-started/changelog/). One of them changes how Button behaves when `tokens.css` isn't loaded:

- In 0.1.0, `Button.css` gives most `var(--…)` references a fallback value, for example `var(--color-primary-default, #3b71f2)`.
- Since commit `f43b8e5`, `Button.css` has no fallbacks. Button's colours, radius, type and borders come from `tokens.css` only.

If your app loads `styles.css` without `tokens.css`, load both, as [Developing](/developing/introduction/) shows. If it already loads both, nothing changes for you except that Button now renders with the token values rather than the older fallback colours (see the Design tab of [Button](/core/components/button/)).
