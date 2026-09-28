---
name: security-check
description: The pre-deploy gate shared by engineer and devops. Runs scripts/security-check.mjs against build output and, in live mode, against a deployed URL. States plainly what it does and doesn't cover.
---

# Security check

A shared gate between `engineer` (before writing a staging link) and `devops` (before writing a production link). One script, one definition, so the two agents can't drift into checking different things.

## What this covers

- Credentials in build output — provider-specific key patterns (AWS `AKIA...`, GitHub `ghp_...`/`gh[oprsu]_...`, generic `sk-...`/`sk_live_...`), not entropy scanning. Entropy scanning flags too much noise in minified JS to be trusted.
- Private identifiers accidentally bundled (internal hostnames, `.env` values) — pattern match against `.env*` file contents that shouldn't appear verbatim in `build/` or `storybook-static/`.
- Environment leakage: any `import.meta.env.*` or `process.env.*` value that isn't prefixed `VITE_`/`PUBLIC_` but shows up in a client bundle anyway.
- `npm audit` advisories at `high` or above.
- A dirty working tree — uncommitted changes present when a deploy is about to happen.

## What this does NOT cover

No gate protects against every attack, and claiming otherwise makes it untrustworthy. This does not check: XSS in component props (that's a QA/code-review concern, not a build-output scan), dependency confusion, supply-chain compromise of a package already in `package-lock.json`, or anything at the network/infra layer once deployed.

## Steps

1. Run `node scripts/security-check.mjs` — static mode, scans `build/` and `storybook-static/` if present, plus `git status --porcelain` for a dirty tree.
2. For a live check, run `node scripts/security-check.mjs --live <url> --mode public|protected`. `public` mode fails if it finds a credential pattern in the served HTML/JS. `protected` mode additionally fails if the URL is reachable with no auth at all, when it's meant to require one.
3. Any finding is a hard stop — fix or report, don't deploy past it.

## Who runs it, and when

- `engineer` runs static mode before committing/pushing. It never writes `Staging Storybook` itself (see `engineer.md`'s Browser limitation note) — this check just gates its own commit, not that link.
- `devops` runs static mode before merging, and live mode (`--mode public`) against the production URL after pushing. This script uses a plain Node `fetch()`, not a rendered browser, so `devops` can run it itself via Bash even though it can't independently confirm the page *renders* — those are different checks. A clean live scan is one input to the orchestrating session's decision to write `Production Storybook`, not a green light `devops` acts on itself.

## Proof it fires

Before relying on this in the crew, plant one fake credential of each pattern type in a scratch file under `build/` and confirm the script's exit code is non-zero and the finding names the pattern that matched. Remove the scratch file afterward — don't commit it.
