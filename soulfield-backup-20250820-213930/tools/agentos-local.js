const fs = require("fs");
const path = require("path");

const ROOT = path.resolve(path.join(__dirname, ".."));
const AOS  = path.join(ROOT, ".agent-os");
const SPECS = path.join(AOS, "specs");
const PRODUCT = path.join(AOS, "product");
const PLAN = path.join(ROOT, "data", "plan.json");

function iso(){ return new Date().toISOString(); }
function slug(s){ return s.toLowerCase().replace(/[^a-z0-9]+/g,"-").replace(/^-|-$/g,""); }
function ensure(p){ fs.mkdirSync(p, { recursive:true }); }

function loadPlan(){
  try { return JSON.parse(fs.readFileSync(PLAN,"utf-8")); }
  catch { return { version:"1.0", notes:[], projects_active:[], future_projects:[], golden:[], session:[] }; }
}
function savePlan(p){ fs.mkdirSync(path.dirname(PLAN),{recursive:true}); fs.writeFileSync(PLAN, JSON.stringify(p,null,2)); }

function sessionNote(content, tags=[]){
  const plan = loadPlan();
  plan.session = plan.session || [];
  plan.session.push({ id: Date.now().toString(), content, tags, timestamp: iso() });
  savePlan(plan);
}

/** /plan-product — initialize product mission/roadmap skeleton */
function planProduct(title="Soulfield Product"){
  ensure(PRODUCT);
  const file = path.join(PRODUCT, "mission.md");
  if(!fs.existsSync(file)){
    const md = `# ${title}\n\n## Mission\n- Describe the mission.\n\n## Roadmap\n- v0: working agent + memory\n- v1: council + MCP files\n- v2: integrations\n`;
    fs.writeFileSync(file, md, "utf-8");
  }
  sessionNote(`Initialized product mission (${title})`, ["agentos","product"]);
  return { ok:true, created:file.replace(ROOT+"/","") };
}

/** /create-spec — create spec folder + template */
function createSpec(name){
  const day = new Date().toISOString().slice(0,10);
  const dir = path.join(SPECS, `${day}-${slug(name)}`);
  ensure(dir);
  const spec = path.join(dir, "spec.md");
  if(!fs.existsSync(spec)){
    const md = `# Spec: ${name}\n\n## Outcome\n- \n\n## Acceptance Criteria\n- \n\n## Tasks\n- \n\n## Notes\n- \n`;
    fs.writeFileSync(spec, md, "utf-8");
  }
  sessionNote(`Spec created: ${name}`, ["agentos","spec"]);
  return { ok:true, created: spec.replace(ROOT+"/","") };
}

/** /execute-tasks (offline): scaffold a task log */
function executeTasks(name="Unnamed Feature"){
  const day = new Date().toISOString().slice(0,10);
  const dir = path.join(SPECS, `${day}-${slug(name)}`);
  ensure(dir);
  const log = path.join(dir, "execution.md");
  const md = `# Execution Log: ${name}\n\n- ${iso()} init (offline)\n`;
  fs.appendFileSync(log, md, "utf-8");
  sessionNote(`Execution started: ${name}`, ["agentos","exec"]);
  return { ok:true, created: log.replace(ROOT+"/","") };
}

module.exports = { planProduct, createSpec, executeTasks };
