---
name: release-review
description: The gate the release agent runs before a Completed Horizon Design System component can read Released — seven gates and six checks, a report committed at the reviewed commit, and a verdict of Cleared or Blocked. Never edits an intent file, never fixes what it finds, never publishes.
---

# Release review

Runs after a component reaches `Completed` (production deployed) and has `Astro Link` set. It isn't part of the develop → test → deploy ladder and doesn't feed `Development`. Read `registry` for the table contract and `component-intent` for the intent file this reviews.

The output is two `Components` fields, written together or not at all: `Release Review` (a URL) and `Release Verdict` (`Cleared` or `Blocked`).

## The seven gates

Every gate must pass for `Cleared`. Any failure is `Blocked`, unless `decisions.md` has a ruling that covers exactly that finding (see "Rulings" below).

| # | Gate | The question |
| --- | --- | --- |
| 1 | Done | Is it actually `Completed` on the board, deployed to production? |
| 2 | Tokens | Does every value reference a token? Any raw hex or px? |
| 3 | Surface | Is it exported from `src/index.ts`? Did you mean to? |
| 4 | Names | Folder, symbol, CSS prefix, intent, board row: all the same word? |
| 5 | States | Every state the product uses, with a story each? |
| 6 | Intent | Complete? A `dont_use_when` with no alternative is a warning, never a block. |
| 7 | Version | Do you understand what `0.1.0` commits you to? |

How to answer each:

1. **Done.** The row reads `Completed` in `Development`, and `Production Storybook` opens the component's stories.
2. **Tokens.** Read every declaration in the component's stylesheet. List every literal hex or px value, with its line, including fallbacks inside `var()`. Any literal not covered by a ruling fails.
3. **Surface.** The component and its props type are exported from `src/index.ts`, and nothing says it was meant to stay internal. An export nobody decided on is a finding.
4. **Names.** The folder (`src/components/[Name]/`), the exported symbol, the CSS class prefix, the intent file name and the board row's name are all the same word, allowing only for case and the `hz-` namespace on classes.
5. **States.** Every variant and state the Figma node publishes exists in the code and is rendered by at least one story.
6. **Intent.** `src/components/[Name]/[Name].intent.json` exists at the reviewed commit and passes the six checks below.
7. **Version.** `VERSIONING.md` exists and says what `0.1.0`, and each later bump, commits consumers to. It doesn't exist yet, so every review blocks here until someone writes it.

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

## When it blocks

Expect `Blocked` on a first run. A review that passes everything first time isn't reading.

- **Never fix a finding and carry on inside the same run.** A change made after the review is a change nobody reviewed. Fix, redeploy, re-review.
- **Never ship the fix straight to production.** Branch, PR, merge, deploy, then re-review. The board records evidence, and a fix that skipped the pipeline has none.

## Rulings

Some findings aren't defects. A human rules on them in `decisions.md` at the repo root. Each ruling states **what it means for an agent that hits it** and **what is not ruled**. Read `decisions.md` before every review.

- A finding passes only if a ruling covers it exactly. Quote the ruling in the report.
- Never stretch a ruling past its stated boundary, and never write one yourself.

## Staleness

A review goes stale when the row's `Last Modified` is later than the commit the report cites. It then describes a component that no longer exists in that state and needs running again.

## Never

- Never edit an intent file, including to fix a typo. Report it; `component-intent` owns that file.
- Never fix what you find. Name the owner.
- Never publish, bump the version or tag a release. `Cleared` is not permission to publish; a human still bumps `package.json` and tags the release.
- Never link `Release Review` to a branch. A branch shows the file as it is today, not as it was when the verdict was formed.
- Never write `Cleared` with a gate unrun, or `Blocked` without naming the gate or check that failed.
- Never treat a warning from check 2 as a block, or a failed gate as a warning.
