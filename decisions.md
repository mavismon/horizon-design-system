# Decisions

Rulings on findings that aren't defects. Only a human writes here. Each ruling says what it means for an agent that hits it, and what it doesn't cover. An agent never stretches a ruling past its "Not ruled" line, and never writes one itself.

## 2026-09-28 · npm token type in release preflight

**Finding.** The release agent's preflight halts when `npm token list` shows a "Publish token". npm 10.9.2 labels every token that isn't read-only as "Publish token", granular ones included (`lib/commands/token.js`, line 74), so that output can't show a token's type.

**Ruling.** The user checked on npmjs.com that the token named **Horizon** (`npm_yppt…QEPB`, id `8dd8a5`, created 2026-09-27, expires 2026-12-26) is a granular access token. It has read and write access to all packages and to the `layerbasesystemic` organization.

**For an agent that hits it.** If `npm token list` shows exactly one token, id `8dd8a5`, labelled "Publish token", treat the granular-token check as passed and quote this ruling in the report.

**Not ruled.** Any other token id. More than one token in the list. This token after 2026-12-26. Whether the token's permissions are enough for a given publish. Each of those needs the user to check again.

## 2026-09-28 · Publishing keeps 2FA

**Finding.** The Horizon token has "Bypass two-factor authentication" turned off, and the account has 2FA enabled, so `npm publish` asks for a one-time code. An agent can't type one.

**Ruling.** Keep 2FA on. The user runs the real publish.

**For an agent that hits it.** At step 9, the release agent runs `npm run release:publish -- <version> --dry-run`, reads the file list, then **stops**. It hands the user the exact command, `npm run release:publish -- <version>`, to run in their own terminal. After the user says it's published, the agent carries on from step 9's registry check (wait for npm, smoke-test the registry copy) and step 10.

**Not ruled.** Turning on Bypass 2FA, or creating a token that does. Running the real publish from an agent in any other way. Whether the version is approved: that's still step 8.
