---
name: astro-page
description: Builds and deploys the whole Horizon Design System docs site (Astro Starlight in docs-site/ on the astro branch) every run — generated pages from one script, guides re-checked against the code, verified live before any component's Astro Link is written. Never builds one page at a time, never invents.
---

# Astro page

Every run rebuilds the **whole** docs site, never one page at a time, so a page can't drift from its neighbours or from the code. The format to match is the reference site: https://horizon-docs-alpha.vercel.app.

## Where it lives

- Astro Starlight in `docs-site/`, on the `astro` branch. `docs-site/` is its own npm package.
- The Vercel project `horizon-docs` deploys that branch. `tools.md` records the folder, project and production URL; read it, don't restate it here.
- Other branches carry a `docs-site/vercel.json` that disables deployment. Never bring the `astro` site onto them.

## Sidebar

Written out entry by entry in `astro.config.mjs`, in this order. Every entry is a `slug`, never `autogenerate`, so a missing page fails the build instead of quietly vanishing from the navigation. Slugs follow the reference site (for example `get-started/changelog`, `core/components/overview`, `core/tokens`); check it for any slug not listed here.

| Group | Pages, in order |
|---|---|
| Get Started | Changelog, Roadmap, News, Versioning, Upgrading |
| Designing | Introduction |
| Developing | Introduction, React, React Router |
| Skills | Knowledge skill |
| Core | Components (All components, then one page per component), Tokens |
| Styling | Theming |
| Help | FAQ, Report a bug, Request a feature, Contributing, Embedding |

## Pages

### Home

A splash page.
- **Hero line:** the first paragraph of the repo's `README.md`.
- **Buttons:** Start designing, Start coding, Open Storybook.
- **Then:** the latest release with its install command, and link cards to Designing, Developing, Components and Tokens.

### Component page

A header strip: the component's status and the version it shipped in, then links to Storybook, the Figma node and the source. Then five tabs, in this order:

| Tab | Source | Contents |
|---|---|---|
| Usage | `[Name].intent.json` | When to use, where it goes, when not to (with each alternative), best practice, what each variant is for, accessibility facts linked to their source lines, composition, what this version promises. |
| Examples | README, Storybook | The README usage example, then every story that isn't a variant-matrix row, embedded live from Storybook in light and in dark. |
| Code | The component's types | The import, props with defaults and doc comments, union types, the tokens it needs with their light and dark values, and Storybook's own props table embedded. |
| Design | Figma, stories | The Figma node embedded, the variant matrix with every matrix story linked, both themes, every value Figma never bound, and the design gaps recorded against it. |
| Changelog | git | `git log` for the component and its subcomponents, each commit marked with the version it shipped in. |

### Generated, never edited by hand

Home, All components, every component page, Tokens, Changelog, Roadmap, News.

One script, `docs-site/scripts/generate.mjs`, builds them all from:
1. **The repo at a pinned commit.** Pass the SHA; read every file at that commit (`git show <SHA>:<path>`), not from the working tree.
2. **Two source files the agent writes each run:**
   - `docs-site/sources/board.json`: each component's status from the registry, with **no record IDs**.
   - `docs-site/sources/figma.json`: the live Figma reads (nodes, variant matrices, unbound values, usage regions).
3. **The deployed Storybook's `index.json`** (the Storybook production URL is in `tools.md`), for story IDs.

Roadmap and News state no date, owner or priority that a source doesn't state.

### Written from the repo

Every guide (Designing, Developing, Versioning, Upgrading, Skills, Theming and Help). Each run re-reads every guide against the code and corrects any sentence that stopped being true. Correct only what the code contradicts; don't expand a guide beyond what a source supports.

## Styling

- The site wears the system's own tokens: one stylesheet maps Starlight's `--sl-*` variables onto Horizon semantic tokens, in light and dark. It contains no hex of its own.
- Fonts are self-hosted. No font CDN.

## Missing source

Keep the section in place with a notice naming exactly what's missing, for example "No usage region in Figma for Button". **Never invent** a sentence to fill it.

## Steps

1. **Refresh the sources:** write `sources/board.json` and `sources/figma.json`, fetch Storybook's `index.json`, and pin the commit.
2. **Generate:** run `node scripts/generate.mjs` against the pinned commit. It overwrites every generated page.
3. **Re-check every guide** against the code at the pinned commit and correct what stopped being true.
4. **Build with zero broken internal links.** A link validator must run as part of `astro build`, so a broken link fails the build rather than printing a warning.
5. **Open the pages before pushing:** the home page, one component page (every tab) and Tokens, each in light and in dark.
6. **Push `astro`**, which triggers the production deployment. Confirm in Vercel that the deployment's target is `production`, not a preview.
7. **Verify live:**
   - Fetch every page of the live site. Each one returns 200.
   - Each component page has all five tabs, each with content (a missing-source notice counts as content).
   - Every header link returns 200. The one exception: a Figma link to a team-only file may answer 403.
8. **Only then write each component's `Astro Link`** to the registry. If any check in step 7 fails, write nothing, and report what failed.

## Who does what

`doc-generator` generates, builds, checks links and fetches the live pages (steps 1–4 and 7). `devops` pushes the `astro` branch (step 6); neither changes the other's part. The orchestrating session opens pages in light and dark (step 5), and, after opening each live component page and seeing it render, writes its `Astro Link` (step 8), which is devops's column.

## Known gaps today

- `docs-site/scripts/generate.mjs` doesn't exist yet, and `docs-site/` still holds Starlight's template pages.
- The repo has no `README.md`, so the home hero line and the Examples tab's README usage example have no source.
- No component has an intent file yet (see `component-intent`), so every Usage tab would show a missing-source notice.
- The Storybook has no theme switch, so dark-mode story embeds have no source.

## Never

- Never build or deploy one page on its own.
- Never edit a generated page by hand. Fix the source or the script.
- Never invent a date, owner, priority, rule or example that no source states.
- Never put a record ID from the registry into `board.json` or onto the site.
- Never hard-code a hex value or load a font from a CDN.
- Never write `Astro Link` before every live check in step 7 has passed.
