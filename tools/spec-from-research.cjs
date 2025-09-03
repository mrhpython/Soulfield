const fs = require("fs");
const path = require("path");
const { askAiden } = require("./aiden.cjs");

const ROOT = path.resolve(__dirname, "..");
const SPECS = path.join(ROOT, ".agent-os", "specs");
const RDIR  = path.join(ROOT, "workspace", "research");
fs.mkdirSync(SPECS, { recursive: true });

function newestResearch() {
  if (!fs.existsSync(RDIR)) return null;
  const dirs = fs.readdirSync(RDIR).filter(d => fs.statSync(path.join(RDIR,d)).isDirectory()).sort().reverse();
  return dirs[0] ? path.join(RDIR, dirs[0]) : null;
}
function slug(s){ return String(s).toLowerCase().replace(/[^a-z0-9]+/g,"-").replace(/^-+|-+$/g,"").slice(0,80); }

function ensureRunBlock(txt){
  if (/^##\s*Run\s*\(approved\)/m.test(txt)) return txt;
  const safe = [
    "## Run (approved)",
    'echo "[spec] sanity checks"',
    "ls -alh /home/michael/soulfield/workspace/specs",
    'echo "[policy] show TruthLens rules"',
    "head -n 20 /home/michael/soulfield/workspace/knowledge/TruthLens.md",
    'echo "[index] first 10 lines"',
    "head -n 10 /home/michael/soulfield/workspace/data/index.json",
    ""
  ].join("\n");
  return (txt.trim() + "\n\n" + safe + "\n");
}

(async ()=>{
  const id = process.argv[2] || null;
  const src = id ? path.join(RDIR,id) : newestResearch();
  if (!src || !fs.existsSync(src)) { console.error("research folder not found"); process.exit(2); }

  const research  = fs.existsSync(path.join(src,"research.md")) ? fs.readFileSync(path.join(src,"research.md"),"utf8") : "";
  const keywords  = fs.existsSync(path.join(src,"keywords.json")) ? fs.readFileSync(path.join(src,"keywords.json"),"utf8") : "[]";

  const system = "You are a senior product builder. Output a concise, buildable spec.md.";
  const prompt = `
UK online-first MVP from research+keywords.
Include: intent, acceptance criteria, thin-slice MVP, ≤12 tasks, week-1 metrics.
You MUST respect TruthLens constraints.
`;
  let spec = await askAiden({ system, messages:[{role:"user", content: prompt + "\n\n=== RESEARCH ===\n" + research + "\n\n=== KEYWORDS ===\n" + keywords }], maxTokens: 3500 });
  spec = ensureRunBlock(spec);

  const topicSlug = slug(path.basename(src).split("-").slice(1).join("-") || "pop-up");
  const dir = path.join(SPECS, `${Date.now()}-${topicSlug}`);
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, "spec.md"), spec);
  console.log(path.join(dir, "spec.md"));
})().catch(e => { console.error(e.stack||e); process.exit(1); });
