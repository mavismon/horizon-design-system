# Tools

Which tools each agent in the component-build crew can use, gathered in one place.

**Source of truth:** the `tools:` line at the top of each file in `.claude/agents/`. That line is what Claude Code actually enforces; this file only summarises it. Change the agent file first, then update this table to match.

## At a glance

| Tool | engineer | qa | devops | doc-generator | release | pm | token-runner |
|---|:-:|:-:|:-:|:-:|:-:|:-:|:-:|
| **Files** | | | | | | | |
| Read | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |  |
| Grep | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |  |
| Glob | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |  |
| Edit | ✓ |  |  | ✓ |  |  |  |
| Write | ✓ |  |  | ✓ | ✓ | ✓ |  |
| Bash | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| **Delegation** | | | | | | | |
| Agent |  |  |  |  | ✓ |  |  |
| **Figma** (read only) | | | | | | | |
| get_design_context | ✓ | ✓ |  | ✓ | ✓ |  |  |
| get_screenshot | ✓ | ✓ |  | ✓ | ✓ |  |  |
| get_metadata | ✓ | ✓ |  | ✓ | ✓ |  |  |
| get_variable_defs | ✓ |  |  | ✓ |  |  |  |
| **Airtable registry** | | | | | | | |
| list_tables_for_base | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |  |
| get_table_schema | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |  |
| list_records_for_table | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |  |
| analyze_table |  |  |  |  |  | ✓ |  |
| create_records_for_table | ✓ | ✓ |  |  |  |  |  |
| update_records_for_table | ✓ |  | ✓ | ✓ | ✓ |  |  |
| **Browser pane** | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ |

Full tool names: Figma tools are `mcp__figma__<name>`; Airtable tools are `mcp__8c46864c-e3e7-4f12-a12e-6574df27a9e5__<name>`.

## Per agent

### engineer
Builds and repairs components; changes the token pipeline.
- **Tools:** Read, Edit, Write, Bash, Grep, Glob · Figma: get_design_context, get_variable_defs, get_metadata, get_screenshot · Airtable: list_tables_for_base, get_table_schema, list_records_for_table, create_records_for_table, update_records_for_table
- **Skills it follows:** `build`, `registry`, `security-check`
- The only agent that can edit code (Edit/Write).

### qa
Tests a built component against its Figma node; validates token changes.
- **Tools:** Read, Bash, Grep, Glob · Figma: get_design_context, get_screenshot, get_metadata · Airtable: list_tables_for_base, get_table_schema, list_records_for_table, create_records_for_table
- **Skills it follows:** `test`, `finding-format`, `build`, `registry`
- No Edit/Write: read-only on code by design, so it hands fixes to engineer. It can create `Staging Testing` rows but has no update tool.

### devops
Merges and deploys what qa passed; publishes to the Astro reference site.
- **Tools:** Read, Bash, Grep, Glob · Airtable: list_tables_for_base, get_table_schema, list_records_for_table, update_records_for_table
- **Skills it follows:** `registry`, `security-check`
- No Edit/Write and no Figma: it builds, fixes and tests nothing.

### doc-generator
Writes intent files (Job A); builds, deploys and verifies the docs site, then writes `Astro Link` (Job B).
- **Tools:** Read, Write, Edit, Bash, Grep, Glob · Figma: get_design_context, get_metadata, get_screenshot, get_variable_defs · Airtable: list_tables_for_base, get_table_schema, list_records_for_table, update_records_for_table
- **Skills it follows:** `component-intent`, `astro-page`, `registry`
- Writes `Astro Link` and nothing else on the board.

### release
Reviews, packages and publishes a version; hands the docs go-live to doc-generator.
- **Tools:** Read, Write, Bash, Grep, Glob, Agent · Figma: get_design_context, get_metadata, get_screenshot · Airtable: list_tables_for_base, get_table_schema, list_records_for_table, update_records_for_table
- **Skills it follows:** `release-review`, `registry`
- The only agent with `Agent`, which it uses to delegate to doc-generator. Its agent file forbids writing to `src/`. Writes `Release Review` and `Release Verdict`, always together. Replaces the retired reviewer agent.

### pm
Audits the whole registry and reports discrepancies.
- **Tools:** Read, Write, Bash, Grep, Glob · Airtable: list_tables_for_base, get_table_schema, list_records_for_table, analyze_table
- **Skills it follows:** `sweep`, `registry`
- No Airtable create or update tool, deliberately: an auditor that can edit what it audits will eventually tidy a problem away. Write is only for its report file.

### token-runner
Runs `node build-tokens.js` and reports the raw output.
- **Tools:** Bash
- No skills, no analysis, no editing.

## Docs site (Astro Starlight)

Where component releases publish their reference pages. devops deploys it; see `devops.md`.

| | |
|---|---|
| Folder | `docs-site/`, its own npm package with its own `package.json` and `package-lock.json` |
| Branch | `astro` (the only branch that has the site). Production deploys come from here. |
| Vercel project | `horizon-docs` on the `mavis17` account (`prj_5uVrnsHEiTJIPmd3pbkbVBjZ2Nf2`): root directory `docs-site`, production branch `astro`, framework Astro. The build settings are in `docs-site/vercel.json`. |
| Production URL | https://horizon-docs-zeta.vercel.app, confirmed to serve this site. Not `horizon-docs.vercel.app`: that address belongs to an unrelated site. |

- `docs-site/vercel.json` on `astro` uses `npm install`, not `npm ci`: a lockfile written on macOS can leave out packages Linux needs, and `npm ci` refuses it.
- Every other branch has a `docs-site/vercel.json` containing only `{"git": {"deploymentEnabled": false}}`, so the docs project skips their pushes instead of failing the build and leaving a red check on PRs. If `astro` is ever merged into another branch, keep the full `astro` version of that file.
- The Storybook project is separate: `horizon-design-system-cdfi` on the `mavis17` Vercel account, production from `main`, staging from `testing`.

## Limits that apply to everyone

- **No browser.** Every agent runs as a spawned subagent, and the agent files record that Browser pane tools were tested and are unavailable to them. Anything that needs a page opened, such as writing a `Staging Storybook`, `Production Storybook` or `Astro Link`, belongs to the orchestrating session.
- **Bash is broad.** Every agent has Bash, which can do more than the other tools in its list suggest (including writing files). The limits on what each agent may do come from its agent file and the `registry` skill's owner table, not only from the tool list.
