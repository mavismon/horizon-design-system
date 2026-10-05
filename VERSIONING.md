# Versioning

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

Something is deprecated in one release before it's removed in a later breaking release. The changelog names the replacement.

## What 0.2.1 commits you to

0.2.1 adds one component, Stepper, on top of 0.2.0. It contains seventeen components, each exported from the package root with its props type: Avatar, Breadcrumbs, Button, ButtonGroup, Checkbox, Chip, Dropdown, File, Header, Image, Link, Logo, ProgressBar, RadioCard, SearchBar, Stepper, Toggle. It commits you to their props, prop values and defaults, their `hz-` class names, the tokens in `tokens.css` and the three entry points (`.`, `./styles.css`, `./tokens.css`). Stepper is a pure addition, so it's a patch on 0.x (see the table above). Any change that breaks those on 0.x bumps the version to 0.3.0.

The 0.2.0 commitments below still hold in full: nothing from 0.2.0 was changed, removed or renamed.

## What 0.2.0 commits you to

0.2.0 contains sixteen components, each exported from the package root with its props type: Avatar, Breadcrumbs, Button, ButtonGroup, Checkbox, Chip, Dropdown, File, Header, Image, Link, Logo, ProgressBar, RadioCard, SearchBar, Toggle. It commits you to their props, prop values and defaults, their `hz-` class names, the tokens in `tokens.css` and the three entry points (`.`, `./styles.css`, `./tokens.css`). Any change that breaks those on 0.x bumps the version to 0.3.0.

`Header` takes a few props that are not Figma properties: `buttonText`, `avatarSrc`, `avatarAlt`, `searchPlaceholder`, `link1Href`, `link2Href`, `link3Href`, `onButtonClick`, `onBackClick`, `onActionClick` and `onSearch`. They are public from 0.2.0 and a breaking change to them follows the same rule.

## What 0.1.0 committed you to

0.1.0 contained one component, `Button`, with the props, `state` values and `hz-button` classes it ships with, and the tokens in `tokens.css`. 0.2.0 keeps all of them: `Button`'s props and `hz-button` classes are unchanged, and no token was removed or renamed.
