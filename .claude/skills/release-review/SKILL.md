---
name: release-review
description: The gate the release agent runs before a Completed Horizon Design System component can read Released — seven gates and six checks, a report committed at the reviewed commit, and a verdict of Cleared or Blocked. Never edits an intent file, never fixes what it finds, never publishes.
---

# Release review

Runs after a component reaches `Completed` (production deployed) and has `Astro Link` set. It isn't part of the develop → test → deploy ladder and doesn't feed `Development`. Read `registry` for the table contract and `component-intent` for the intent file this reviews.

The output is two `Components` fields, written together or not at all: `Release Review` (a URL) and `Release Verdict` (`Cleared` or `Blocked`).

## The seven gates

Every gate must pass for `Cleared`. Any failure is `Blocked`.

1. **Intent written.** `src/components/[Name]/[Name].intent.json` exists at the reviewed commit.
2. **Status Completed.** The component's `Components` row reads `Completed` in `Development`.
3. **Tokens clean.** Every colour, size, spacing, radius and type value in the component's stylesheet is read through a `var(--…)` token. A literal value is allowed only as the fallback inside `var()`.
4. **Public surface decided.** The component and its props type are exported from `src/index.ts`. A component that isn't exported there hasn't had its public surface decided.
5. **Names final.** The component name, every prop name and every variant value match the Figma node exactly, including spelling, case and spaces.
6. **States complete.** Every variant and state the Figma node publishes exists in the code and is rendered by at least one story.
7. **Version meaning known.** `VERSIONING.md` exists and says what a change to a component means for the package version. It doesn't exist yet, so every review blocks here until someone writes it.

## The six checks

Run on the intent file, at the reviewed commit. Every check blocks except check 2.

1. **Fields present.** All seven fields from `component-intent` are present with the right types. An empty `use_when` or `dont_use_when` passes this check (it's a recorded Figma gap), but say so in the report.
2. **Every `dont_use_when` names an alternative.** An entry with an empty `instead` is a **warning, never a blocker**. List each one in the report.
3. **`a11y` is specific, not generic.** Each entry names a concrete element, attribute or behaviour, and its `source` points at a file and line that exists at the reviewed commit and implements it. "Accessible", "follows WCAG" or an entry with no source line fails.
4. **`required_tokens` resolve in the built output.** Run the token build (`npm run build:tokens`) at the reviewed commit. Every listed token is defined in `build/css/tokens.css`, and every token the stylesheet reads is listed.
5. **All variants covered.** The keys of `variant_intent` are exactly the values of the component's variant union type: none missing, none extra.
6. **No two components claim the same job.** Compare this component's `use_when` with every other intent file in `src/components/`. Two components listing the same use fails, and the report names both.

## Steps

1. **Pin the commit.** Record the full SHA you're reviewing. Everything below is read at that commit.
2. **Read the production docs page first** (`Astro Link`), then the source. The docs page is what users see; a difference between it and the source is a finding.
3. **Run the seven gates, then the six checks**, in order. Record each as pass, fail or (check 2 only) warning, with the evidence: a file and line, a command's output, or the Figma node ID.
4. **Write the report** to `reports/[Name]/release-review.md` and commit it:
   - The reviewed SHA, the date, and the verdict.
   - A table of all seven gates and six checks with their result and evidence.
   - For `Blocked`: each failing gate or check, what exactly failed, and which agent owns the fix (for example: intent file, engineer; Figma gap, the designer; `VERSIONING.md`, a human).
   - Warnings, listed separately from failures.
5. **Write the registry fields**, together: `Release Review` = the report's GitHub URL at the reviewed commit (`https://github.com/mavismon/horizon-design-system/blob/<SHA>/reports/[Name]/release-review.md`), and `Release Verdict` = `Cleared` or `Blocked`.

## Staleness

A review goes stale when the row's `Last Modified` is later than the commit the report cites. It then describes a component that no longer exists in that state and needs running again.

## Never

- Never edit an intent file, including to fix a typo. Report it; `component-intent` owns that file.
- Never fix what you find. Name the owner.
- Never publish, bump the version or tag a release. `Cleared` is not permission to publish; a human still bumps `package.json` and tags the release.
- Never link `Release Review` to a branch. A branch shows the file as it is today, not as it was when the verdict was formed.
- Never write `Cleared` with a gate unrun, or `Blocked` without naming the gate or check that failed.
- Never treat a warning from check 2 as a block, or a failed gate as a warning.
