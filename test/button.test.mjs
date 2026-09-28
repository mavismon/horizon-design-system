// Tests the built package (dist/), which is what consumers install.
// `npm test` runs build:package first, so dist is complete and current.

import { test } from "node:test";
import assert from "node:assert/strict";
import { createRequire } from "node:module";
import { readFileSync } from "node:fs";
import { createElement as h } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import * as esm from "../dist/index.mjs";

const require = createRequire(import.meta.url);
const cjs = require("../dist/index.js");
const { Button } = esm;
const render = (props = {}) => renderToStaticMarkup(h(Button, props));

const STATES = {
  default: "hz-button--default",
  hover: "hz-button--hover",
  error: "hz-button--error",
  outline: "hz-button--outline",
  "outline error": "hz-button--outline-error",
};

test("dist ships both stylesheets, with component styles and tokens", () => {
  const styles = readFileSync(new URL("../dist/styles.css", import.meta.url), "utf8");
  const tokens = readFileSync(new URL("../dist/tokens.css", import.meta.url), "utf8");
  assert.match(styles, /\.hz-button\s*\{/);
  assert.match(tokens, /--color-primary-default:/);
  assert.match(tokens, /\[data-theme="dark"\]/);
});

test("ESM and CommonJS builds both export Button", () => {
  assert.equal(typeof esm.Button, "function");
  assert.equal(typeof cjs.Button, "function");
});

test("renders a native button with type=button and the default label", () => {
  const html = render();
  assert.match(html, /^<button type="button" class="hz-button hz-button--default">/);
  assert.match(html, /<span>Label<\/span>/);
});

for (const [state, cls] of Object.entries(STATES)) {
  test(`state "${state}" adds ${cls}`, () => {
    assert.match(render({ state }), new RegExp(`class="hz-button ${cls}"`));
  });
}

test("shows both icons by default, each decorative (alt=\"\")", () => {
  const icons = render().match(/<img [^>]*>/g) ?? [];
  assert.equal(icons.length, 2);
  for (const icon of icons) assert.match(icon, /alt=""/);
});

test("startIcon and endIcon can each be turned off", () => {
  assert.equal((render({ startIcon: false }).match(/<img /g) ?? []).length, 1);
  assert.equal((render({ endIcon: false }).match(/<img /g) ?? []).length, 1);
  assert.doesNotMatch(render({ startIcon: false, endIcon: false }), /<img /);
});

test("swapIcon replaces the default icon", () => {
  const html = render({ swapIcon: h("i", { "data-icon": "custom" }) });
  assert.doesNotMatch(html, /<img /);
  assert.equal((html.match(/data-icon="custom"/g) ?? []).length, 2);
});

test("text sets the label", () => {
  assert.match(render({ text: "Save changes" }), /<span>Save changes<\/span>/);
});

test("className is added after the component's own classes", () => {
  assert.match(render({ className: "extra" }), /class="hz-button hz-button--default extra"/);
});

test("native button attributes pass through", () => {
  const html = render({ disabled: true, "aria-label": "Save" });
  assert.match(html, / disabled=""/);
  assert.match(html, / aria-label="Save"/);
});

test("every class the component renders is defined in Button.css", () => {
  const css = readFileSync(new URL("../src/components/Button/Button.css", import.meta.url), "utf8");
  for (const cls of ["hz-button", "hz-button__icon", ...Object.values(STATES)]) {
    assert.match(css, new RegExp(`\\.${cls}[\\s{:,]`), `${cls} has no rule in Button.css`);
  }
});
