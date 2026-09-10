---
name: finding-format
description: The format a Staging Testing "Suggestion for Improvement" finding must follow so an engineer can act on it without asking a follow-up question. Used by qa when it writes a finding, and by engineer when it reads one.
---

# Finding format

A finding is what QA hands the engineer through the `Suggestion for Improvement` field on a `Staging Testing` row (see the `registry` skill for the table contract). It must be actionable without a follow-up question.

## Required parts

Every finding states, in this order:

1. **The case** — which `Staging Testing` row this is: component, variant, size, state (the same fields already on the row — restate them in the text so the finding reads standalone if copied elsewhere).
2. **What was expected, and where that expectation came from** — the Figma node ID and the specific property (e.g. "Figma node 26:104, `color-status-error` on the fill").
3. **What was actually seen** — the rendered/computed value, read from the browser, not guessed from the code.
4. **Where in the code it lives** — file and, where meaningful, the line or prop name.

## The rule

Name the token or the prop. Never a raw value.

- ❌ "The colour looks off." — not a finding. No token named, no location, not measurable.
- ❌ "Button background should be a bit darker." — still no token, still not actionable.
- ✅ "Button, `outlined` / `disabled` state, Figma node 26:104: `color-border-disabled` should render at `#9AA0AE` (semantic token `color-border-disabled`) but computed style shows `#C4C8D0` — `Button.module.css` is aliasing `color-border-muted` instead. Swap to `color-border-disabled`."

The good example names the token on both sides (expected and actual), the node, the case, and the file — an engineer can act on it with no back-and-forth. The bad examples give a vibe, not a diff.

## Never

- Never report a raw hex/px value as the fix — always resolve to the semantic token name.
- Never write a finding without the Figma node ID behind the expectation.
- Never write a finding from reading the component's own source code instead of the rendered, computed result — a finding built by re-deriving expectations from the story file agrees with the code by construction and proves nothing (see the `test` skill).
- Never leave `Suggestion for Improvement` blank on a `Failed` row.
