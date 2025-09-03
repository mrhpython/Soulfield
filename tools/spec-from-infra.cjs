/* Build a spec.md from an InfraNodus result file */
const fs = require("fs");
const path = require("path");
const { askAiden } = require("./aiden.cjs");

const ROOT = path.resolve(__dirname, "..");
const RESULTS = path.join(ROOT, "workspace", "data", "infranodus", "results");
const SPECS   = path.join(ROOT, ".agent-os", "specs");
fs.mkdirSync(SPECS, { recursive: true });

function newestResult() {
  const files = (fs.existsSync(RESULTS) ? fs.readdirSync(RESULTS) : [])
    .filter(f => f.endsWith(".result.json"))
    .map(f => path.join(RESULTS, f))
    .sort()
    .reverse();
  return files[0] || null;
}

(async () => {
  const chosen = process.argv[2] || newestResult();
  if (!chosen || !fs.existsSync(chosen)) {
    console.error("Result not found. Usage: node tools/spec-from-infra.cjs <path-to-result.json>");
    process.exit(2);
  }
  const res = JSON.parse(fs.readFileSync(chosen,"utf8"));
  const label = (res.label || "infra").toLowerCase().replace(/[^a-z0-9]+/g,"-").replace(/^-+|-+$/g,"");
  const gaps  = Array.isArray(res.gaps) ? res.gaps.slice(0,10) : [];
  const nodes = (res.nodes || []).slice(0,50);

  const system = "You are Aiden (Claude). Produce a concise, executable 1-week spec for an online-first UK business. Honor TruthLens: be explicit, avoid fluff, include ## Run (approved) with safe shell (echo|ls|cat|head).";
  const user = `
From an InfraNodus graph analysis we have:

LABEL: ${res.label}
TOP GAPS (first 10): ${JSON.stringify(gaps, null, 2)}
KEY NODES (sample): ${nodes.map(n=>n.id||n.name||n.label||"").slice(0,20).join(", ")}

Write a **spec.md** that includes:
- Intent & Acceptance Criteria (UK online-first, no dropshipping unless compliant)
- Thin-slice MVP deliverable for Day 1
- Tasks list (<=12)
- Metrics / KPIs for week 1
- Risks & mitigations (policy-aware)
- ## Run (approved) with 3–5 *read-only* commands (echo|ls|cat|head) to verify files exist in workspace

Keep it practical and short enough to execute.
  `.trim();

  const spec = await askAiden({ system, messages: [{ role: "user", content: user }], maxTokens: 3000 });

  const dir = path.join(SPECS, `${Date.now()}-from-infra-${label || "topic"}`);
  fs.mkdirSync(dir, { recursive: true });
  const outPath = path.join(dir, "spec.md");
  fs.writeFileSync(outPath, spec);
  console.log(outPath);
})().catch(e => { console.error(e.stack||e); process.exit(1); });
