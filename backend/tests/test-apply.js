#!/usr/bin/env node
// Standalone tester for "coder-apply" (runs outside systemd/service)
// Usage:
//   node test-apply.js --dry            # preview only (default)
//   node test-apply.js --apply          # execute allowed lines
//   node test-apply.js --spec <id>      # target specific spec dir name

const fs = require("fs");
const os = require("os");
const path = require("path");
const { execSync } = require("child_process");

const ROOT = __dirname;
const SPECS_DIR = path.join(ROOT, ".agent-os", "specs");
const RUNS_DIR  = path.join(ROOT, ".agent-os", "runs");
const WHITELIST = new Set(["echo","ls","cat","head"]); // expand later (e.g., "node")

function ensureRunsDir() {
  fs.mkdirSync(RUNS_DIR, { recursive: true });
  return RUNS_DIR;
}
function newestSpecFile() {
  if (!fs.existsSync(SPECS_DIR)) return null;
  const dirs = fs.readdirSync(SPECS_DIR)
    .filter(d => fs.existsSync(path.join(SPECS_DIR, d, "spec.md")))
    .sort().reverse();
  return dirs.length ? { id: dirs[0], file: path.join(SPECS_DIR, dirs[0], "spec.md") } : null;
}
function specFileById(id) {
  const p = path.join(SPECS_DIR, id, "spec.md");
  return fs.existsSync(p) ? { id, file: p } : null;
}
function extractRunCommands(md) {
  // Take text between '## Run (approved)' and the next '##'
  const parts = md.split(/^##\s+Run\s+\(approved\)\s*$/m);
  if (parts.length < 2) return [];
  const after = parts[1];
  const block = (after.split(/^##\s+/m)[0] || "");
  return block.split("\n")
    .map(s => s.trim().replace(/^[-•]\s+/, "").trim())
    .filter(Boolean)
    .filter(s => !s.startsWith("#"));
}
function isSafe(cmd) {
  if (/[;&|><`$]/.test(cmd)) return { ok: false, reason: "contains control/redirect characters" };
  const first = cmd.split(/\s+/)[0];
  if (!WHITELIST.has(first)) return { ok: false, reason: `"${first}" not in whitelist` };
  return { ok: true };
}
function execLines(lines) {
  const logPath = path.join(ensureRunsDir(), `${Date.now()}-run.log`);
  const header  = `# run @ ${new Date().toISOString()}  (cwd:${ROOT})\n`;
  fs.appendFileSync(logPath, header);
  const outputs = [];
  for (const line of lines) {
    const stamp = `\n$ ${line}\n`;
    try {
      const out = execSync(line, { cwd: ROOT, stdio: ["ignore","pipe","pipe"], timeout: 15000, shell: "/bin/bash" });
      const txt = out.toString();
      fs.appendFileSync(logPath, stamp + txt);
      outputs.push({ cmd: line, ok: true, out: txt.slice(0, 4000) });
    } catch (e) {
      const errTxt = (e.stdout||"").toString() + (e.stderr||"").toString() || e.message;
      fs.appendFileSync(logPath, stamp + errTxt);
      outputs.push({ cmd: line, ok: false, out: errTxt.slice(0, 4000) });
    }
  }
  return { logPath, outputs };
}

// ---- CLI args ----
const argv = process.argv.slice(2);
const wantApply = argv.includes("--apply");
const mSpec = (() => {
  const i = argv.indexOf("--spec");
  return i >= 0 && argv[i+1] ? argv[i+1] : null;
})();

// Pick spec
const spec = mSpec ? specFileById(mSpec) : newestSpecFile();
if (!spec) {
  console.error("no spec found (use --spec <id> or create one with !coder-open)");
  process.exit(2);
}

// Parse
const md = fs.readFileSync(spec.file, "utf8");
const all = extractRunCommands(md);
if (!all.length) {
  console.error('no "## Run (approved)" commands found in spec');
  process.exit(3);
}

// Filter by safety
const safe = [], rejected = [];
for (const c of all) {
  const chk = isSafe(c);
  if (chk.ok) safe.push(c); else rejected.push(`${c}  ⟶  ${chk.reason}`);
}

const rel = spec.file.replace(os.homedir(), "~");
console.log(`📄 spec: ${rel}`);
console.log(`🔎 candidates: ${all.length}  • allowed: ${safe.length}  • rejected: ${rejected.length}`);
if (rejected.length) console.log(`\n🚫 rejected:\n- ${rejected.join("\n- ")}\n`);

if (!wantApply) {
  console.log("🧪 dry-run only — add --apply to execute.");
  process.exit(0);
}

// Execute allowed lines
const { logPath, outputs } = execLines(safe);
const head = outputs.slice(0,3).map(o => `- ${o.ok?"✅":"❌"} ${o.cmd}\n${o.out.trim().split("\n").slice(0,6).join("\n")}`).join("\n");
console.log(`\n⚙️ executing ${safe.length} command(s)…`);
if (head) console.log(`\n— output (head) —\n${head}`);
console.log(`\n🗒️ full log → ${logPath.replace(os.homedir(), "~")}`);
