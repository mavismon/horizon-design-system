# Decisions

Rulings on findings that aren't defects. Only a human writes here. Each ruling says what it means for an agent that hits it, and what it doesn't cover. An agent never stretches a ruling past its "Not ruled" line, and never writes one itself.

## 2026-09-28 · npm token type in release preflight

**Finding.** The release agent's preflight halts when `npm token list` shows a "Publish token". npm 10.9.2 labels every token that isn't read-only as "Publish token", granular ones included (`lib/commands/token.js`, line 74), so that output can't show a token's type.

**Ruling.** The user checked on npmjs.com that the token named **Horizon** (`npm_yppt…QEPB`, id `8dd8a5`, created 2026-09-27, expires 2026-12-26) is a granular access token. It has read and write access to all packages and to the `layerbasesystemic` organization.

**For an agent that hits it.** If `npm token list` shows exactly one token, id `8dd8a5`, labelled "Publish token", treat the granular-token check as passed and quote this ruling in the report.

**Not ruled.** Any other token id. More than one token in the list. This token after 2026-12-26. Whether the token's permissions are enough for a given publish. Each of those needs the user to check again.

## 2026-09-28 · Button values with no token

**Finding.** Release review gate 2 (Tokens) failed Button for literal px values. After removing every `var()` fallback and moving borders and the focus outline width to `--border-width-*`, four Figma values remain that no token matches: the spacing scale has 8px and 12px but no 10px, there are no size tokens, and no spacing token is 2px.

**Ruling.** These literals in `src/components/Button/Button.css` are accepted, because they're what the Figma node specifies (node 19:31), until the designer adds matching tokens:

| Value | Property | Lines |
|---|---|---|
| `10px` | `gap`, `padding` on `.hz-button` | 5, 6 |
| `12px` | `width`, `height` on `.hz-button__icon` | 25, 26 |
| `2px` | `outline-offset` on `.hz-button:focus-visible` | 19 |

**For an agent that hits it.** Gate 2 passes for exactly these values on exactly these properties in `Button.css`. Quote this ruling in the report. When a token with the same value appears (for example a 10px spacing token), the ruling no longer covers that value: use the token.

**Not ruled.** Any other literal value, including a `var()` fallback. These values in any other component. A change to these values: a different number needs a new ruling or a token.

## 2026-09-28 · Publishing keeps 2FA

**Finding.** The Horizon token has "Bypass two-factor authentication" turned off, and the account has 2FA enabled, so `npm publish` asks for a one-time code. An agent can't type one.

**Ruling.** Keep 2FA on. The user runs the real publish.

**For an agent that hits it.** At step 9, the release agent runs `npm run release:publish -- <version> --dry-run`, reads the file list, then **stops**. It hands the user the exact command, `npm run release:publish -- <version>`, to run in their own terminal. After the user says it's published, the agent carries on from step 9's registry check (wait for npm, smoke-test the registry copy) and step 10.

**Not ruled.** Turning on Bypass 2FA, or creating a token that does. Running the real publish from an agent in any other way. Whether the version is approved: that's still step 8.

## 2026-10-01 · Avatar diameters with no token

**Finding.** Release review gate 2 (Tokens) failed Avatar for literal px values. The three diameters in Figma node 113:2 (sm 24px, md 30px, lg 40px) are not bound to any variable, and no avatar size token exists. The nearest values are `--spacing-2xl` (24px), a spacing token, and `--lineheight-4xl` (40px), a line-height token. Neither is a size, and nothing matches 30px.

**Ruling.** These literals in `src/components/Avatar/Avatar.css` are accepted, because they're what the Figma node specifies (node 113:2, component 112:9), until the designer adds avatar size tokens:

| Value | Property | Lines |
|---|---|---|
| `24px` | `width`, `height` on `.hz-avatar--sm` | 13, 14 |
| `30px` | `width`, `height` on `.hz-avatar--md` | 18, 19 |
| `40px` | `width`, `height` on `.hz-avatar--lg` | 23, 24 |

**For an agent that hits it.** Gate 2 passes for exactly these values on exactly these properties in `Avatar.css`. Quote this ruling in the report. When an avatar size token appears, the ruling no longer covers that value: use the token.

**Not ruled.** Any other literal value, including a `var()` fallback. These values in any other component. A change to these values: a different number needs a new ruling or a token. The missing photo fallback and the empty `use_when` / `dont_use_when` in `Avatar.intent.json`: those are Figma gaps for the designer.
