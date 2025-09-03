const fs=require("fs"), path=require("path");
const { askAiden } = require("./aiden.cjs");

const ROOT=path.resolve(__dirname,"..");
const RROOT=path.join(ROOT,"workspace","research");
const id = process.argv[2];
if(!id){ console.error("usage: node tools/fill-research.cjs <research-id-folder>"); process.exit(2); }
const DIR = path.isAbsolute(id) ? id : path.join(RROOT,id);

const rPath = path.join(DIR,"research.md");
const kPath = path.join(DIR,"keywords.json");

function read(p,fallback=""){ try { return fs.readFileSync(p,"utf8"); } catch { return fallback; } }

(async()=>{
  const research = read(rPath);
  const keywords = read(kPath);

  // ---- competitors.md ----
  const compSys = "You are a market analyst. Output clean markdown with YAML frontmatter.";
  const compUser = `Create **competitors.md** with frontmatter:
---
doc: competitors
tags: [car-care, competitor, manchester]
---
List 3–7 competitors. For each: name, strengths, weaknesses, pricing (if known), and the exploitable gap.
Keep bullets tight. Ground in Manchester context.`;

  const compOut = await askAiden({ system: compSys, messages:[{role:"user", content: compUser}], maxTokens: 1600 });
  fs.writeFileSync(path.join(DIR,"competitors.md"), compOut.trim()+"\n");

  // ---- plan.md ----
  const planSys = "You are a product operator. Output tight, actionable plans.";
  const planUser = `Create **plan.md** for a 7-day MVP sprint with frontmatter:
---
doc: plan
tags: [sprint, mvp]
---
Sections: Day 1–2, Day 3–4, Day 5–6, Day 7, Success Metrics, Acceptance & Budget Guardrail (cap £350), Risks & Mitigations.
Base your plan on this research + keywords.

=== RESEARCH ===
${research}

=== KEYWORDS JSON ===
${keywords}`;

  const planOut = await askAiden({ system: planSys, messages:[{role:"user", content: planUser}], maxTokens: 2400 });
  fs.writeFileSync(path.join(DIR,"plan.md"), planOut.trim()+"\n");

  console.log("Filled:", DIR);
})().catch(e=>{ console.error(e.stack||e); process.exit(1); });
