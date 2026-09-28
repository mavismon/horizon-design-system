---
title: Versioning
description: What a version number of the Horizon package promises.
---

`@layerbasesystemic/horizon-design-system` follows [Semantic Versioning](https://semver.org). While the version starts with `0.`, the API isn't declared stable yet, and the numbers shift down one place:

| Change | While 0.x | From 1.0.0 |
|---|---|---|
| Breaking: code that worked stops working, such as a removed or renamed export, prop, prop value, `hz-` class, token or entry point | **Minor** (0.1.0 → 0.2.0) | Major |
| New, backwards-compatible: a new component, prop, state or token | Patch (0.1.0 → 0.1.1) | Minor |
| Fix: behaviour or styling brought back in line with its Figma design and docs | Patch | Patch |

So on 0.x, `^0.1.0` gets fixes and additions but never a breaking change. 1.0.0 ships when the maintainers decide the API is stable; it's a decision, not a date.

## What counts as public

Changing any of these in a way that breaks existing use is a breaking change:

- **Exports** from the package root: every component and type exported from `src/index.ts`.
- **Props:** their names, their types, their allowed values (for example Button's `state` values) and their defaults.
- **CSS class names** starting with `hz-`, since consumers may target them.
- **Token names** in `tokens.css` (the `--…` custom properties).
- **Entry points:** `.`, `./styles.css` and `./tokens.css`.

## What isn't public

- Anything not exported from `src/index.ts`, such as internal helpers.
- A token's value when it's changed on purpose to match the design (for example a colour adjusted for contrast). That's a patch, and it's listed in the changelog.
- The files under `dist/` beyond the three entry points, and how they're built.

## Deprecation

Something is deprecated in one release before it's removed in a later breaking release. The [changelog](/get-started/changelog/) names the replacement.

## What 0.1.0 commits you to

0.1.0 contains one component, [Button](/core/components/button/), with the props, `state` values and `hz-button` classes it ships with, and the tokens in `tokens.css`. Any change that breaks those bumps the version to 0.2.0.

*Written from `VERSIONING.md` in the repository.*
