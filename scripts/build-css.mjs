#!/usr/bin/env node
// Writes the package's two stylesheets into dist/. No dependencies.
//   dist/styles.css — src/styles.css with every @import inlined, so consumers load one file.
//   dist/tokens.css — the token build's light (:root) and dark ([data-theme="dark"]) variables.
// Run after build:tokens (which writes build/css) and build:lib (which cleans dist).

import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";

const IMPORT_RE = /^@import\s+["'](.+?)["'];\s*$/gm;

function inline(file) {
  return readFileSync(file, "utf8").replace(IMPORT_RE, (_, rel) => {
    const target = resolve(dirname(file), rel);
    if (!existsSync(target)) throw new Error(`${file}: @import "${rel}" not found`);
    return inline(target).trimEnd();
  });
}

const TOKEN_FILES = ["build/css/tokens.css", "build/css/tokens-dark.css"];
for (const f of TOKEN_FILES) {
  if (!existsSync(f)) throw new Error(`${f} is missing — run npm run build:tokens first`);
}

mkdirSync("dist", { recursive: true });
writeFileSync("dist/styles.css", inline(resolve("src/styles.css")));
writeFileSync("dist/tokens.css", TOKEN_FILES.map((f) => readFileSync(f, "utf8").trimEnd()).join("\n\n") + "\n");
console.log("dist/styles.css, dist/tokens.css written");
