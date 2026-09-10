---
name: release-review
description: The gate the reviewer agent runs before a Completed Horizon Design System component can read Released. INCOMPLETE — the seven gates it's supposed to check are not yet defined; see "Open item" below before using this for a real review.
---

# Release review

> **This skill is a skeleton, not a working procedure.** The `Astro Link` field's description in the live Airtable base (`fldmIejCh2VfmBkmP` on the `Components` table) says "the seven gates are in `.claude/skills/release-review/SKILL.md`" — but no such file existed anywhere in this repo before this session, and the seven gates themselves aren't specified in either Notion build doc, the FigJam board, or anywhere else read while building this crew. Everything below is what's independently verifiable from the base's actual field configuration. **The seven gates are a named open question for the user** — filling them in with a plausible-sounding guess would be exactly the kind of invented content the rest of this crew's skills were built to avoid.

## What's confirmed (from the live schema)

- This runs after a component reaches `Completed` (production deployed) and has `Astro Link` set (documented) — it is not part of the develop → test → deploy ladder, and doesn't feed `Development`.
- Output is two `Components` fields, written together or not at all: `Release Review` (a URL) and `Release Verdict` (`Cleared` or `Blocked`).
- `Release Review` must point at the exact commit reviewed — never a branch URL, because a branch shows whatever the file says *today*, not what was true when the verdict was formed.
- A review goes stale the moment the row's `Last Modified` is later than the commit the report cites — it's then describing a component that no longer exists in that state, and needs re-reviewing.
- The reviewer reads the production docs page (Astro Starlight) before the source, per the field description's own instruction.
- `Cleared` is not permission to publish on its own — a human still bumps `package.json` and tags the release; `VERSIONING.md` says why. (`VERSIONING.md` does not yet exist in this repo either — another thing to confirm with the user if this gate is built out.)
- `Blocked` names the specific gate that failed and which agent owns the fix, in the report — not a vague "needs work."

## What's missing — ask the user

The seven gates themselves. Candidates worth asking about, based on what the rest of this crew already checks and doesn't (so the reviewer isn't just re-running QA's job):

- Is there a naming/API-surface check (props match Figma exactly, no accidental breaking change vs. the last release)?
- Is there a changelog/versioning-note requirement?
- Is there an accessibility gate beyond what `qa` already checks in `test` skill section B?
- Does it check for orphaned `Composed Into` dependents that also need re-review?
- Is there a licensing/asset-provenance check (e.g. the icon-asset issue noted in `reports/Button/qa-report.md`)?

Don't build the `Steps` section of this skill until the user confirms the actual seven gates — a reviewer agent running against a guessed checklist would produce `Cleared` verdicts that don't mean what the field description promises they mean.
