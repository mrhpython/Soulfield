const fs = require("fs");
const path = require("path");
const { askAiden } = require("./aiden.cjs");

const ROOT = path.resolve(__dirname, "..");
const OUT  = path.join(ROOT, "workspace", "research");
fs.mkdirSync(OUT, { recursive: true });

function slug(s){ return String(s).toLowerCase().replace(/[^a-z0-9]+/g,"-").replace(/^-+|-+$/g,"").slice(0,80); }

(async ()=>{
  const q = process.argv.slice(2).join(" ").trim();
  if (!q) { console.error("usage: node tools/research.cjs \"topic or brief\""); process.exit(1); }

  const id = `${Date.now()}-${slug(q.slice(0,60))}`;
  const dir = path.join(OUT, id);
  fs.mkdirSync(dir, { recursive: true });

  const system = "You are Aiden, a precise research orchestrator. Output concise, actionable files.";
  const user = `
Brief: ${q}

Produce:
- research.md (overview, approaches, concrete integration ideas)
- keywords.json (array of {keyword, intent, difficulty, volume_est} if relevant)
- questions.md (top questions grouped)
- competitors.md (if relevant)
- plan.md (7-day MVP plan)
Keep it UK online-first, adhere to TruthLens constraints.`;

  const out = await askAiden({ system, messages:[{role:"user", content:user}], maxTokens: 3500 });

  fs.writeFileSync(path.join(dir,"research.md"), out);
  // try to extract a JSON block for keywords
  let k = "[]";
  const m = out.match(/```json\s*([\s\S]*?)```/i) || out.match(/\[\s*{[\s\S]*}\s*\]/m);
  if (m) { try { k = JSON.stringify(JSON.parse(m[1]||m[0]), null, 2); } catch {} }
  fs.writeFileSync(path.join(dir,"keywords.json"), k);

  // headers (best-effort)
  for (const name of ["questions.md","competitors.md","plan.md"]) {
    const re = new RegExp(`^##\\s*${name.replace(".md","").replace(/[-_]/g,"[ -_]")}\\s*$([\\s\\S]*?)(?=^##\\s|\\Z)`, "im");
    const mm = out.match(re);
    if (mm && mm[1]) fs.writeFileSync(path.join(dir, name), mm[1].trim()+"\n");
  }

  console.log(dir);
})().catch(e => { console.error(e.stack||e); process.exit(1); });
