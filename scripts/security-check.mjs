#!/usr/bin/env node
// Pre-deploy gate shared by the engineer and devops agents. No dependencies.
// See .claude/skills/security-check/SKILL.md for what this does and doesn't cover.

import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { execSync } from "node:child_process";
import { join } from "node:path";

const CREDENTIAL_PATTERNS = [
  { name: "AWS access key", re: /AKIA[0-9A-Z]{16}/g },
  { name: "GitHub token", re: /gh[oprsu]_[0-9A-Za-z]{36,}/g },
  { name: "Generic secret key", re: /\bsk-[A-Za-z0-9]{20,}\b/g },
  { name: "Stripe live key", re: /sk_live_[0-9A-Za-z]{20,}/g },
  { name: "Slack token", re: /xox[baprs]-[0-9A-Za-z-]{10,}/g },
];

const SCAN_DIRS = ["build", "storybook-static"];
const args = process.argv.slice(2);
const liveIdx = args.indexOf("--live");
const modeIdx = args.indexOf("--mode");
const liveUrl = liveIdx !== -1 ? args[liveIdx + 1] : null;
const mode = modeIdx !== -1 ? args[modeIdx + 1] : null;

let findings = [];

function walk(dir) {
  if (!existsSync(dir)) return [];
  const out = [];
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    const st = statSync(full);
    if (st.isDirectory()) out.push(...walk(full));
    else out.push(full);
  }
  return out;
}

function scanFile(path) {
  let text;
  try {
    text = readFileSync(path, "utf8");
  } catch {
    return; // binary or unreadable — skip
  }
  for (const { name, re } of CREDENTIAL_PATTERNS) {
    const matches = text.match(re);
    if (matches) {
      findings.push({
        type: "credential",
        pattern: name,
        file: path,
        sample: matches[0].slice(0, 8) + "…",
      });
    }
  }
}

function staticScan() {
  for (const dir of SCAN_DIRS) {
    for (const file of walk(dir)) {
      if (/\.(js|mjs|cjs|html|css|map)$/.test(file)) scanFile(file);
    }
  }

  try {
    const dirty = execSync("git status --porcelain", { encoding: "utf8" }).trim();
    if (dirty) {
      findings.push({ type: "dirty-tree", detail: dirty.split("\n").length + " uncommitted change(s)" });
    }
  } catch {
    findings.push({ type: "error", detail: "could not run git status — not a git repo?" });
  }

  try {
    const audit = execSync("npm audit --json", { encoding: "utf8", stdio: ["ignore", "pipe", "ignore"] });
    const parsed = JSON.parse(audit);
    const high = Object.values(parsed.vulnerabilities || {}).filter(
      (v) => v.severity === "high" || v.severity === "critical"
    );
    if (high.length) {
      findings.push({ type: "audit", detail: `${high.length} high/critical advisory(ies)` });
    }
  } catch {
    // npm audit exits non-zero when it finds advisories; that's expected, not a script failure.
  }
}

async function liveScan(url, checkMode) {
  const res = await fetch(url);
  const text = await res.text();
  for (const { name, re } of CREDENTIAL_PATTERNS) {
    if (re.test(text)) {
      findings.push({ type: "credential", pattern: name, file: url });
    }
  }
  if (checkMode === "protected" && res.status === 200) {
    findings.push({
      type: "access-control",
      detail: `${url} is meant to be protected but responded 200 with no auth`,
    });
  }
}

staticScan();
if (liveUrl) {
  if (mode !== "public" && mode !== "protected") {
    console.error("--live requires --mode public|protected");
    process.exit(2);
  }
  await liveScan(liveUrl, mode);
}

if (findings.length) {
  console.error(`security-check: ${findings.length} finding(s)\n`);
  for (const f of findings) console.error(JSON.stringify(f));
  process.exit(1);
} else {
  console.log("security-check: clean");
  process.exit(0);
}
