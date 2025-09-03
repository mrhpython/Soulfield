// jobs.js — specs + timeline + roadmap + backup + knowledge + agents handoff
const fs = require("fs");
const path = require("path");
const os = require("os");
const cp = require("child_process");
// Use root memory store (file) for notes/knowledge capture
const { add, recall } = require("../memory.js");

const ROOT = __dirname;
const PLAN = path.join(ROOT, "data", "plan.json");
const AGENTS = path.join(ROOT, "data", "agents.json");
const SPECS_DIR = path.join(ROOT, ".agent-os", "specs");

function nowISO(){ return new Date().toISOString(); }

function loadPlan(){
  try { return JSON.parse(fs.readFileSync(PLAN, "utf-8")); }
  catch { return { version:"1.0", notes:[], projects_active:[], future_projects:[], golden:[], session:[] }; }
}
function savePlan(p){
  fs.mkdirSync(path.dirname(PLAN), { recursive:true });
  fs.writeFileSync(PLAN, JSON.stringify(p,null,2));
}
function loadAgents(){
  try {
    const j = JSON.parse(fs.readFileSync(AGENTS, "utf-8"));
    return Array.isArray(j) ? j : (j.agents || []);
  } catch { return []; }
}
function ensureSpecsDir(){
  fs.mkdirSync(SPECS_DIR, { recursive:true });
  return SPECS_DIR;
}
function sessionNote(content, tags=[]){
  const p = loadPlan();
  p.session = p.session || [];
  p.session.push({ id:Date.now().toString(), content, tags, timestamp:nowISO() });
  savePlan(p);
}

/* ------------------------------------------------------------------ */
async function handleJob(line){
  const [cmd, ...rest] = line.trim().split(/\s+/);
  const tail = rest.join(" ");

  // 📝 note
  if (cmd === "!note"){
    const tags = (tail.match(/#[\w-]+/g)||[]).map(t=>t.slice(1));
    const text = tail.replace(/#[\w-]+/g,"").trim();
    const e = add(text, tags, "note");
    const plan = loadPlan();
    plan.notes = plan.notes||[];
    plan.notes.push({ id:e.id, content:text, tags, source:"chat", timestamp:e.timestamp });
    savePlan(plan);
    return `📝 saved: "${text}"  ⌁ tags:${tags.join(",")}`;
  }

  // 🔎 recall
  if (cmd === "!recall"){
    const tag = tail.trim().replace(/^#/,"");
    const rows = recall({ tag: tag||"all", limit:30 });
    if (!rows.length) return tag ? `no memory for #${tag}` : "no memory yet";
    return rows.map(r => `- ${r.content}  ⌁ tags:${(r.tags||[]).join(",")}`).join("\n");
  }

  // 📋 plan-notes
  if (cmd === "!plan-notes"){
    const items = (loadPlan().notes||[]).slice(-15);
    if (!items.length) return "no plan notes yet";
    return items.map(n => `- ${n.content}  ⌁ tags:${(n.tags||[]).join(",")}`).join("\n");
  }

  // ⚡ plan-add active|future "Name" #tags
  if (cmd === "!plan-add"){
    const m = tail.match(/^(active|future)\s+"([^"]+)"/);
    if (!m) return 'usage: !plan-add active|future "Name" #tags';
    const status = m[1];
    const name = m[2];
    const tags = (tail.match(/#[\w-]+/g)||[]).map(t=>t.slice(1));
    const p = loadPlan();
    const obj = { name, status: status==="active" ? "planned" : "future", owner:"you", tags };
    if (status==="active") p.projects_active.push(obj); else p.future_projects.push(obj);
    savePlan(p);
    return `📌 added to ${status}: ${name}  ⌁ tags:${tags.join(",")}`;
  }

  // 🧭 plan-list
  if (cmd === "!plan-list"){
    const p = loadPlan();
    const fmt = (arr, icon) => arr.map((x,i)=>`${icon} ${i+1}. ${x.name}  ⌁ status:${x.status}  ⌁ tags:${(x.tags||[]).join(",")}`).join("\n") || "(none)";
    return [
      "🎯 Project Roadmap",
      "— Active —",
      fmt(p.projects_active||[], "🚀"),
      "",
      "— Future —",
      fmt(p.future_projects||[], "🌱")
    ].join("\n");
  }

  // ✨ golden "desc" #tags
  if (cmd === "!golden"){
    const tags = (tail.match(/#[\w-]+/g)||[]).map(t=>t.slice(1));
    const desc = tail.replace(/#[\w-]+/g,"").trim();
    if(!desc) return 'usage: !golden "desc" #tags';
    const p = loadPlan();
    p.golden = p.golden||[];
    p.golden.push({ id:Date.now().toString(), desc, tags, timestamp:nowISO() });
    savePlan(p);
    return `✨ golden saved: "${desc}"  ⌁ tags:${tags.join(",")}`;
  }

  // ✨ golden-list [#tag] [N]
  if (cmd === "!golden-list"){
    const parts = tail.trim().split(/\s+/).filter(Boolean);
    const tag = (parts.find(x=>x.startsWith("#"))||"").slice(1);
    const n = parseInt(parts.find(x=>/^\d+$/.test(x))||"10",10);
    const p = loadPlan();
    let rows = (p.golden||[]).slice(-n);
    if (tag) rows = rows.filter(g => (g.tags||[]).includes(tag));
    if (!rows.length) return tag ? `no golden for #${tag}` : "no golden entries yet";
    return rows.map(g => `• ${g.desc}  ⌁ tags:${(g.tags||[]).join(",")}`).join("\n");
  }

  // 🗒️ session-note "text" #tags
  if (cmd === "!session-note"){
    const tags = (tail.match(/#[\w-]+/g)||[]).map(t=>t.slice(1));
    const text = tail.replace(/#[\w-]+/g,"").replace(/^"|"$/g,"").trim();
    if (!text) return 'usage: !session-note "text" #tags';
    const p = loadPlan();
    p.session = p.session || [];
    p.session.push({ id:Date.now().toString(), content:text, tags, timestamp:nowISO() });
    savePlan(p);
    return `🗒️ session note saved: "${text}"  ⌁ tags:${tags.join(",")}`;
  }

  // 🧭 session-list [#tag] [N]
  if (cmd === "!session-list"){
    const parts = tail.trim().split(/\s+/).filter(Boolean);
    const tag = (parts.find(x=>x.startsWith("#"))||"").slice(1);
    const n = parseInt(parts.find(x=>/^\d+$/.test(x))||"3",10);
    const p = loadPlan();
    let rows = (p.session||[]);
    if (tag) rows = rows.filter(s => (s.tags||[]).includes(tag));
    rows = rows.slice(-n);
    if (!rows.length) return tag ? `no session items for #${tag}` : "no session items yet";
    return `🧭 session timeline (${rows.length}/${(p.session||[]).length} shown${tag?` for #${tag}`:""})\n` +
      rows.map(s => `• ${s.content}  ⌁ tags:${(s.tags||[]).join(",")}  ⌁ ${s.timestamp}`).join("\n");
  }

  // 💾 backup [label]
  if (cmd === "!backup"){
    const label = (tail.trim()||"snapshot").replace(/\s+/g,"_");
    const out = path.join(os.homedir(), `${label}-backup.${new Date().toISOString().slice(0,10)}.zip`);
    try {
      cp.execSync(`zip -qr "${out}" . -x "node_modules/*" "receipts/*"`, { cwd: ROOT });
      return `📦 backup created → ${out}`;
    } catch(e){ return `❌ backup failed: ${e.message}`; }
  }

  // 📚 !learn
  if (cmd === "!learn"){
    const tags = (tail.match(/#[\w-]+/g)||[]).map(t=>t.slice(1));
    const text = tail.replace(/#[\w-]+/g,"").trim();
    if(!text) return 'usage: !learn <text> #tag #tag2';
    const e = add(text, tags.length?tags:["knowledge"], "knowledge");
    return `📚 learned: "${text}"  ⌁ tags:${e.tags.join(",")}`;
  }

  // 📖 !knowledge-list [#tag] [N]
  if (cmd === "!knowledge-list"){
    const pieces = tail.trim().split(/\s+/).filter(Boolean);
    const tag = (pieces.find(p=>p.startsWith("#"))||"").replace("#","");
    theN = parseInt(pieces.find(p=>/^\d+$/.test(p))||"10",10);
    const rows = recall({ tag: tag||"knowledge", limit: theN });
    if(!rows.length) return tag ? `no knowledge for #${tag}` : "no knowledge yet";
    return rows.map(r=>`• ${r.content}  ⌁ tags:${(r.tags||[]).join(",")}`).join("\n");
  }

  // 📥 !learn-file <relative/path> [#tag...]
  if (cmd === "!learn-file"){
    const m = tail.trim().match(/^(\S+)(.*)$/);
    if(!m) return 'usage: !learn-file <relative/path> [#tag #tag2]';
    const rel = m[1];
    const extraTags = (m[2].match(/#[\w-]+/g)||[]).map(t=>t.slice(1));
    const base = path.join(ROOT, rel);
    if(!fs.existsSync(base)) return `file not found: ${rel}`;
    const text = fs.readFileSync(base,"utf8").trim();
    if(!text) return `file empty: ${rel}`;
    const e = add(`[file:${rel}] ${text.slice(0,1000)}`, extraTags.length?extraTags:["knowledge"], "knowledge");
    return `📥 learned file: ${rel}  ⌁ tags:${e.tags.join(",")}`;
  }

  // 👥 !agents
  if (cmd === "!agents"){
    const list = loadAgents();
    if (!list.length) return "no agents registered yet";
    return list.map(a => `• ${a.name} (${a.id}) — ${a.role}  ⌁ status:${a.status}`).join("\n");
  }

  // ⚙️ coder-apply (safe)
  if (cmd === "!coder-apply"){
    const WHITELIST = new Set(["echo","ls","cat","head"]);
    const RUNS_DIR  = path.join(ROOT, ".agent-os", "runs");
    fs.mkdirSync(RUNS_DIR,{recursive:true});
    ensureSpecsDir();

    function newestSpec(){
      const dirs = fs.readdirSync(SPECS_DIR)
        .filter(d => fs.existsSync(path.join(SPECS_DIR, d, "spec.md")))
        .sort().reverse();
      return dirs.length ? { id: dirs[0], file: path.join(SPECS_DIR, dirs[0], "spec.md") } : null;
    }
    function specById(id){ const p = path.join(SPECS_DIR, id, "spec.md"); return fs.existsSync(p) ? { id, file:p } : null; }

    function extractRun(md){
      const parts = md.split(/^##\s+Run\s+\(approved\)\s*$/m);
      if (parts.length < 2) return [];
      const after = parts[1];
      const block = (after.split(/^##\s+/m)[0] || "");
      return block.split("\n").map(s => s.trim().replace(/^[-•]\s+/, "")).filter(Boolean).filter(s => !s.startsWith("#"));
    }
    function isSafe(cmd){
      if (/[|;&><`$]/.test(cmd)) return { ok:false, reason:"contains control/redirect characters" };
      const first = cmd.split(/\s+/)[0];
      if (!WHITELIST.has(first)) return { ok:false, reason:`"${first}" not in whitelist` };
      return { ok:true };
    }

    const raw = tail.trim();
    const wantApply = /(^|\s)#apply(\s|$)/.test(raw);
    const mSpec = raw.match(/--spec\s+(\S+)/);
    const spec = mSpec ? specById(mSpec[1]) : newestSpec();
    if (!spec) return "no spec found (use --spec <id>)";
    const md = fs.readFileSync(spec.file,"utf8");
    const all = extractRun(md);
    if (!all.length) return 'no "## Run (approved)" commands found in spec';

    const safe=[], rej=[];
    for (const c of all){ const ok=isSafe(c); if (ok.ok) safe.push(c); else rej.push(`${c} ⟶ ${ok.reason}`); }

    const preview = [
      `📄 spec: ${spec.file.replace(os.homedir(),"~")}`,
      `🔎 candidates: ${all.length} • allowed: ${safe.length} • rejected: ${rej.length}`,
      rej.length ? `\n🚫 rejected:\n- ${rej.join("\n- ")}\n` : ""
    ].join("\n");

    if (!wantApply) return preview + `\n\n🧪 dry-run only — re-run with #apply to execute.`;

    const logPath = path.join(ROOT, ".agent-os", "runs", `${Date.now()}-run.log`);
    fs.appendFileSync(logPath, `# run @ ${new Date().toISOString()}  (cwd:${ROOT})\n`);
    const { execSync } = require("child_process");
    const outputs = [];
    for (const line of safe){
      try {
        const out = execSync(line, { cwd: ROOT, stdio:["ignore","pipe","pipe"], timeout:15000, shell:"/bin/bash" }).toString();
        fs.appendFileSync(logPath, `$ ${line}\n${out}`);
        outputs.push({ ok:true, cmd:line, out });
      } catch (e){
        const txt = (e.stdout||"").toString() + (e.stderr||"").toString();
        fs.appendFileSync(logPath, `$ ${line}\n${txt}`);
        outputs.push({ ok:false, cmd:line, out:txt });
      }
    }
    const head = outputs.slice(0,3).map(o=>`- ${o.ok?"✅":"❌"} ${o.cmd}\n${o.out.trim().split("\n").slice(0,6).join("\n")}`).join("\n");
    return [preview, `\n⚙️ executing ${safe.length} command(s)…`, head?`\n— output (head) —\n${head}`:"", `\n🗒️ full log → ${logPath.replace(os.homedir(),"~")}`].join("\n");
  }

  // 🆘 Aiden meta
  if (cmd === "!aiden" || cmd === "@aiden"){
    const q = (tail||"").trim().toLowerCase();
    if (q === "model" || /^model\b/.test(q)) return `Aiden model: ${process.env.AIDEN_MODEL || "unset"}`;
    return "Aiden ready. Try: !aiden model";
  }

  // 🧭 help
  if (cmd === "!help"){
    return [
      "🎛️ Soulfield Command Menu",
      "─────────────────────────",
      "📝 !note <text> #tags",
      "🔍 !recall #tag",
      "📋 !plan-notes",
      "⚡ !plan-add active|future \"Name\" #tags",
      "🧭 !plan-list",
      "✨ !golden \"desc\" #tags",
      "🗒️ !session-note \"text\" #tags",
      "🧭 !session-list [#tag] [N]",
      "📚 !learn <text> #tags",
      "📖 !knowledge-list [#tag] [N]",
      "📥 !learn-file <path> [#tag..]",
      "⚙️ !coder-apply [--spec <id>] [--dry] [#apply]",
      "👥 !agents",
      "@aiden model",
      "!aiden model"
    ].join("\n");
  }

  return "(🤔 unknown job)";
}
module.exports = { handleJob };
