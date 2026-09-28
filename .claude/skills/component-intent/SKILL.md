---
name: component-intent
description: Writes src/components/[Name]/[Name].intent.json, the record of when a Horizon Design System component should and shouldn't be used, transposed from its Figma documentation page, code and stories. Read by release-review (gate 1) and astro-page (the Usage tab). Never invents a product rule.
---

# Component intent

One file per component, beside it: `src/components/[Name]/[Name].intent.json`. It says what the component is for, in the design team's own words, so the docs site and the release review read the same facts instead of each re-deriving them.

**An empty field is better than a plausible one.** Nothing downstream can tell a made-up sentence from a sourced one: the docs site publishes it and the release review checks it for shape, not truth. So every value in this file traces to a source below, or the field stays empty and the gap is reported.

## Fields

```json
{
  "use_when": ["…"],
  "dont_use_when": [{ "when": "…", "instead": "…" }],
  "variant_intent": { "<variant value>": "…" },
  "placement": ["…"],
  "pairs_with": ["…"],
  "required_tokens": ["--token-name"],
  "a11y": [{ "fact": "…", "source": "src/components/[Name]/[Name].tsx:LINE" }]
}
```

| Field | Source | What goes in it |
|---|---|---|
| `use_when` | Figma usage region | Each "when to use" item, verbatim. |
| `dont_use_when` | Figma usage region | Each "when not to use" item, verbatim, in `when`. `instead` is the alternative component the page names; leave it `""` if the page names none. |
| `variant_intent` | Code, then Figma | One key per value of the component's variant union type in code, so every variant is present. The value is what the Figma page says that variant is for, or `""` if it says nothing. |
| `placement` | Stories | Where the stories place the component (for example inside a form or a dialog footer). Empty if every story shows it alone. |
| `pairs_with` | Stories | Other Horizon components the stories compose it with, by component name. Empty if none. |
| `required_tokens` | Code | Every CSS custom property the component's stylesheet reads, sorted, with no duplicates. |
| `a11y` | Code | Accessibility facts the code actually implements (native element, focus style, label handling, `alt`), each with the file and line that implements it. |

The Figma page's "best practice" items have no field of their own. Transpose them into `use_when` or `dont_use_when` if they read as one, otherwise leave them in Figma and report that they weren't carried over. Never reword one to make it fit.

## Steps

1. **Read the Figma documentation page first.** Find the component's documentation page in the Figma file (the component's `Figma` link in the registry points at its design node; the documentation page is a separate page in the same file). Read its usage region with `get_design_context` / `get_metadata`, and copy "when to use", "when not to use" and "best practice" exactly as written: same wording, same order, same number of items. Split a bullet list into array items; don't merge, shorten or generalise them.
2. **No usage region?** Leave `use_when` and `dont_use_when` as empty arrays, and list the component as a gap in the handoff (step 6). Don't fill them from general knowledge of what a component of that type is usually for.
3. **Read the code** for `variant_intent` keys and `required_tokens`:
   - Keys: the union type the component exports for its variants (for Button, `ButtonState`). Every value becomes a key, even if its description stays `""`.
   - Tokens: every `var(--…)` in the component's stylesheet. Record the token name only, not the fallback value after the comma.
   - `a11y`: read the component source and cite line numbers from the file as committed, not from memory.
4. **Read the stories** (`[Name].stories.tsx`) for `placement` and `pairs_with`. A story that only renders the component on its own (including a variant-matrix story) shows no placement and no pairing.
5. **Write the file** as formatted JSON (2-space indent, trailing newline). Commit it with the component.
6. **Report gaps in the handoff**, by component and field: no usage region, a variant Figma doesn't describe, a `dont_use_when` with no alternative, best-practice items that weren't carried over. A gap is information for the designer, not a task to finish here.

## Never

- Never write a sentence no source states. A plausible rule is worse than an empty field.
- Never paraphrase the Figma usage region into something shorter or vaguer. Transpose it.
- Never describe a variant from its name alone. `"error"` does not tell you when the design team wants it used.
- Never list a token the stylesheet doesn't read, or an `a11y` fact without the line that implements it.
- Never edit the component to make its intent file easier to write. Report the mismatch instead.
