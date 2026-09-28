---
title: React Router
description: Using Horizon components in a React Router app.
---

The repository has no React Router integration or example, so this page only covers what follows from how the package is built.

## The stylesheets

Import `tokens.css` and `styles.css` once, in the module every route shares (the root route or the file that creates the router), so every page has them before it renders. See [Developing](/developing/introduction/).

## The theme

Set `data-theme="dark"` on `<html>`, or any element that wraps your routes, to use the dark tokens. See [Theming](/styling/theming/).

## Navigation

Button doesn't navigate: it renders a native `<button>` with `type="button"`. The Figma usage guidance says not to use a button "for navigation between pages or views — use a Link component instead", so use your router's link component for navigation.
