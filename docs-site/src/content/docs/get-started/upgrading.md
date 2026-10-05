---
title: Upgrading
description: What changes between versions, and what to do about it.
---

## To 0.2.0

0.2.0 adds fifteen components (Avatar, Breadcrumbs, ButtonGroup, Checkbox, Chip, Dropdown, File, Header, Image, Link, Logo, ProgressBar, RadioCard, SearchBar, Toggle) and removes nothing: no export, prop, class or token from 0.1.0 was removed or renamed. See the [changelog](/get-started/changelog/).

One change affects Button when `tokens.css` isn't loaded:

- In 0.1.0, `Button.css` gives most `var(--…)` references a fallback value, for example `var(--color-primary-default, #3b71f2)`.
- In 0.2.0, `Button.css` has no fallbacks, and borders and the focus outline width use `--border-width-*` tokens. Button's colours, radius, type and borders come from `tokens.css` only. Its props, `state` values and `hz-button` classes are unchanged.

If your app loads `styles.css` without `tokens.css`, load both, as [Developing](/developing/introduction/) shows. If it already loads both, nothing changes for you except that Button now renders with the token values rather than the older fallback colours (see the Design tab of [Button](/core/components/button/)).

## To 0.1.0

0.1.0 is the first published version, so there's nothing to upgrade from.
