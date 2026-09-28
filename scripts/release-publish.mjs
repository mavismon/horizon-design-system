#!/usr/bin/env node
// Publishes one version of the package to npm. No dependencies.
//   npm run release:publish -- <version> [--dry-run]
//
// Order: gates → refuse if the version is already on npm → lift "private": true for the
// publish only → publish → put "private": true back → tag → install the published version
// into an empty folder and render a component from it.
//
// With --dry-run nothing leaves this machine: gates still run (a failure is reported and the
// run continues so you see every problem at once), npm publish runs with --dry-run, no tag is
// made, and the smoke test installs a packed tarball instead of the registry copy.

import { spawn } from "node:child_process";
import { existsSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import { setTimeout as sleep } from "node:timers/promises";

const PKG_PATH = resolve("package.json");
const args = process.argv.slice(2);
const dryRun = args.includes("--dry-run");
const version = args.find((a) => !a.startsWith("--"));

const pkg = JSON.parse(readFileSync(PKG_PATH, "utf8"));
const failures = [];
let reachedRegistry = false;

function log(msg) {
  console.log(`\nrelease: ${msg}`);
}

// Async on purpose: while a child runs, the event loop stays free, so the SIGINT listener
// below fires the moment Ctrl-C is pressed instead of after the whole release has carried on.
function run(cmd, cmdArgs, opts = {}) {
  return new Promise((done) => {
    const child = spawn(cmd, cmdArgs, { stdio: opts.capture ? "pipe" : "inherit", cwd: opts.cwd });
    let stdout = "";
    let stderr = "";
    child.stdout?.on("data", (d) => (stdout += d));
    child.stderr?.on("data", (d) => (stderr += d));
    child.on("error", (e) => done({ ok: false, status: null, stdout, stderr: String(e) }));
    child.on("close", (status) => done({ ok: status === 0, status, stdout, stderr }));
  });
}

// A failed gate stops a real release at once. A dry run records it and keeps going.
function gate(name, passed, detail = "") {
  if (passed) {
    console.log(`release: ✓ ${name}`);
    return;
  }
  const line = `✗ ${name}${detail ? ` — ${detail}` : ""}`;
  if (!dryRun) {
    const after = reachedRegistry
      ? `${pkg.name}@${version} IS published — finish the remaining steps by hand.`
      : "refused. Nothing was published.";
    console.error(`\nrelease: ${line}\nrelease: ${after}`);
    process.exit(1);
  }
  console.error(`release: ${line}`);
  failures.push(line);
}

// ---- "private": true guard --------------------------------------------------------------
// The restore is registered three ways: called inline straight after publish, on process
// exit, and on SIGINT. `finally` is deliberately not used — it doesn't run when anything
// calls process.exit(), which would leave package.json publishable with nothing reporting it.

const originalPkgText = readFileSync(PKG_PATH, "utf8");
let privateLifted = false;

function restorePrivate() {
  if (!privateLifted) return;
  writeFileSync(PKG_PATH, originalPkgText);
  privateLifted = false;
  const back = JSON.parse(readFileSync(PKG_PATH, "utf8")).private === true;
  if (back) console.log('release: "private": true restored in package.json');
  else console.error('release: !!! FAILED to restore "private": true in package.json — put it back by hand before doing anything else');
}

process.on("exit", restorePrivate);
process.on("SIGINT", () => {
  restorePrivate();
  process.exit(130);
});
process.on("SIGTERM", () => {
  restorePrivate();
  process.exit(143);
});

function liftPrivate() {
  const next = { ...pkg };
  delete next.private;
  privateLifted = true; // set before writing, so an interrupt mid-write still restores
  writeFileSync(PKG_PATH, JSON.stringify(next, null, 2) + "\n");
}

// ---- Gates ------------------------------------------------------------------------------

if (!version) {
  console.error("usage: npm run release:publish -- <version> [--dry-run]");
  process.exit(2);
}

log(`${pkg.name}@${version}${dryRun ? " (dry run — nothing will be published or tagged)" : ""}`);

gate("version is valid semver", /^\d+\.\d+\.\d+(-[0-9A-Za-z.-]+)?$/.test(version), `got "${version}"`);
gate(
  "version matches package.json",
  pkg.version === version,
  `package.json says ${pkg.version} — bump it and commit before releasing`,
);
gate('package.json has "private": true', pkg.private === true, "the guard is missing, so a stray npm publish would not be refused");

const tagName = `v${version}`;
gate(`git tag ${tagName} does not exist yet`, !(await run("git", ["rev-parse", "-q", "--verify", `refs/tags/${tagName}`], { capture: true })).ok);

const view = await run("npm", ["view", `${pkg.name}@${version}`, "version", "--json"], { capture: true });
if (view.ok) {
  gate(`${version} is not already on the registry`, view.stdout.trim() === "", `${pkg.name}@${version} is already published`);
} else if (/E404/.test(view.stderr)) {
  gate(`${version} is not already on the registry`, true); // package has never been published
} else {
  gate(`${version} is not already on the registry`, false, `could not check: ${view.stderr.trim().split("\n")[0]}`);
}

if (!dryRun) gate("logged in to npm", (await run("npm", ["whoami"], { capture: true })).ok, "run npm login");

gate("type check (tsc --noEmit)", (await run("npx", ["tsc", "--noEmit"])).ok);
gate("tests (npm test)", (await run("npm", ["test"])).ok);
gate("build:package", (await run("npm", ["run", "build:package"])).ok);

const missing = Object.values(pkg.exports)
  .flatMap((t) => (typeof t === "string" ? [t] : Object.values(t).flatMap((c) => (typeof c === "string" ? [c] : Object.values(c)))))
  .filter((f) => !existsSync(f));
gate("every exports target exists in dist", missing.length === 0, `missing: ${missing.join(", ")}`);

gate("security-check (static)", (await run("node", ["scripts/security-check.mjs"])).ok);

// ---- Publish ----------------------------------------------------------------------------

liftPrivate();
log(`npm publish${dryRun ? " --dry-run" : ""}`);
const published = (await run("npm", ["publish", ...(dryRun ? ["--dry-run"] : [])])).ok;
restorePrivate(); // inline restore — exit/SIGINT handlers above are the backstop
gate("npm publish", published);
reachedRegistry = !dryRun;

// ---- Tag --------------------------------------------------------------------------------

if (dryRun) {
  log(`would tag ${tagName}`);
} else {
  gate(`git tag ${tagName}`, (await run("git", ["tag", "-a", tagName, "-m", `${pkg.name}@${version}`])).ok);
  log(`tagged ${tagName} locally — push it with: git push origin ${tagName}`);
}

// ---- Smoke test: install into an empty folder and render a component ---------------------

const dir = mkdtempSync(join(tmpdir(), "horizon-release-"));
let source = `${pkg.name}@${version}`;
if (dryRun) {
  const packed = await run("npm", ["pack", "--pack-destination", dir, "--silent"], { capture: true });
  source = join(dir, packed.stdout.trim().split("\n").pop());
}
log(`smoke test: installing ${dryRun ? "packed tarball" : source} into ${dir}`);

writeFileSync(join(dir, "package.json"), JSON.stringify({ name: "horizon-smoke-test", private: true }) + "\n");
const peers = Object.entries(pkg.peerDependencies ?? {}).map(([n, r]) => `${n}@${r}`);

// A just-published version can take a little while to become installable.
let installed = false;
for (let attempt = 1; attempt <= (dryRun ? 1 : 6) && !installed; attempt++) {
  if (attempt > 1) {
    console.log(`release: not installable yet, retrying in 10s (attempt ${attempt}/6)`);
    await sleep(10_000);
  }
  installed = (await run("npm", ["install", "--no-audit", "--no-fund", source, ...peers], { cwd: dir })).ok;
}
gate("published version installs into an empty folder", installed);

const smoke = `
const assert = require("node:assert");
const { createElement: h } = require("react");
const { renderToStaticMarkup } = require("react-dom/server");
const name = ${JSON.stringify(pkg.name)};
const check = (label, { Button }) => {
  const html = renderToStaticMarkup(h(Button, { text: "Smoke", state: "outline" }));
  assert.match(html, /<button[^>]*class="hz-button hz-button--outline"/, label + ": unexpected markup " + html);
  assert.match(html, /Smoke/, label + ": text missing");
  console.log(label + " render ok: " + html.slice(0, 70) + "…");
};
check("require", require(name));
require.resolve(name + "/styles.css");
require.resolve(name + "/tokens.css");
console.log("styles.css and tokens.css resolve");
import(name).then((m) => check("import", m)).catch((e) => { console.error(e); process.exit(1); });
`;
writeFileSync(join(dir, "smoke.cjs"), smoke);
gate("component renders from the installed package", installed && (await run("node", ["smoke.cjs"], { cwd: dir })).ok);
rmSync(dir, { recursive: true, force: true });

// ---- Result -----------------------------------------------------------------------------

if (failures.length) {
  console.error(`\nrelease: dry run finished — a real run would have refused on ${failures.length} gate(s):`);
  for (const f of failures) console.error(`  ${f}`);
  process.exit(1);
}
log(dryRun ? "dry run passed — a real run would publish, tag and verify as above" : `${pkg.name}@${version} published, tagged and verified`);
