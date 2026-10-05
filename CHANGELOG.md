# Changelog

All notable changes to `@layerbasesystemic/horizon-design-system`. Versioning rules are in [VERSIONING.md](VERSIONING.md).

## 0.2.1

### Added

One component, Stepper, exported from the package root with its props types (`StepperProps`, `StepperType`, `StepperState`, `StepperStep`, `StepperStepState`) and styled by `styles.css`.

### Changed

Nothing.

### Fixed

Nothing.

### Deprecated

Nothing.

### Removed

Nothing. No export, prop, class or token from 0.2.0 was removed or renamed.

## 0.2.0

### Added

Fifteen components, each exported from the package root with its props type and styled by `styles.css`: Avatar, Breadcrumbs, ButtonGroup, Checkbox, Chip, Dropdown, File, Header, Image, Link, Logo, ProgressBar, RadioCard, SearchBar, Toggle.

### Changed

- `Button`: every `var()` in `Button.css` lost its literal fallback, and borders and the focus outline width now use `--border-width-*` tokens. Props, `state` values and `hz-button` classes are unchanged. Consumers must load `tokens.css`, as the README already says: without it Button no longer falls back to built-in colours.

### Fixed

Nothing.

### Deprecated

Nothing.

### Removed

Nothing. No export, prop, class or token from 0.1.0 was removed or renamed.
