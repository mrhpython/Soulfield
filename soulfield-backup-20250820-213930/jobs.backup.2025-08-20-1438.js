// jobs.js — specs + timeline + roadmap + backup + knowledge
const fs = require("fs");
const path = require("path");
const os = require("os");
const cp = require("child_process");
const { add, recall } = require("./memory.js");

const ROOT = __dirname;
const PLAN = path.join(ROOT, "data", "plan.json");

function nowISO() { return new Date().toISOString(); }

function loadPlan() {
  try { return JSON.parse(fs.readFileSync(PLAN, "utf-8")); }
  catch { return { version: "1.0", notes: [], projects_active: [], future_projects: [], golden: [], session: [] }; }
}

function savePlan(p) {
  fs.mkdirSync(path.dirname(PLAN), { recursive: true });
  fs.writeFileSync(PLAN, JSON.stringify(p, null, 2));
}

function sessionNote(content, tags = []) {
  const p = loadPlan();
  p.session = p.session || [];
  p.session.push({ id: Date.now().toString(), content, tags, timestamp: nowISO() });
  savePlan(p);
}

function slug(s) {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

/* ------------------------------------------------------------------ */
async function handleJob(line) {
  const [cmd, ...rest] = line.trim().split(/\s+/);
  const tail = rest.join(" ");

  /* 📝 note */
  if (cmd === "!note") {
    const tags = (tail.match(/#\w+/g) || []).map(t => t.slice(1));
    const text = tail.replace(/#\w+/g, "").trim();
    const e = add(text, tags, "note");
    const plan = loadPlan();
    plan.notes = plan.notes || [];
    plan.notes.push({ id: e.id, content: text, tags, source: "chat", timestamp: e.timestamp });
    savePlan(plan);
    return `📝 saved: "${text}"  ⌁ tags:${tags.join(",")}`;
  }

  /* 🔎 recall */
  if (cmd === "!recall") {
    const tag = tail.trim().replace(/^#/, "");
    const rows = recall({ tag: tag || "all", limit: 30 });
    if (!rows.length) return tag ? `no memory for #${tag}` : "no memory yet";
    return rows.map(r => `- ${r.content}  ⌁ tags:${(r.tags||[]).join(",")}`).join("\n");
  }

  /* 📋 plan-notes (last 15) */
  if (cmd === "!plan-notes") {
    const items = (loadPlan().notes || []).slice(-15);
    if (!items.length) return "no plan notes yet";
    return items.map(n => `- ${n.content}  ⌁ tags:${(n.tags||[]).join(",")}`).join("\n");
  }

  /* ⚡ plan-add active|future "Name" #tags */
  if (cmd === "!plan-add") {
    const bucket = (rest[0] || "").toLowerCase();
    const match = line.match(/"!plan-add\s+(active|future)"?\s+"([^"]+)"/) || tail.match(/^(active|future)\s+"([^"]+)"/);
    if (!match) return 'usage: !plan-add active|future "Name" #tags';
    const status = match[1];
    const name = match[2];
    const tags = (tail.match(/#\w+/g) || []).map(t => t.slice(1));

    const p = loadPlan();
    const obj = { name, status: status === "active" ? "planned" : "future", owner: "you", tags };
    if (status === "active") p.projects_active.push(obj); else p.future_projects.push(obj);
    savePlan(p);
    return `📌 added to ${status}: ${name}  ⌁ tags:${tags.join(",")}`;
  }

  /* 🧭 plan-list — show roadmap summary */
  if (cmd === "!plan-list") {
    const p = loadPlan();
    const fmt = (arr, icon) =>
      arr.map((x, i) => `${icon} ${i+1}. ${x.name}  ⌁ status:${x.status}  ⌁ tags:${(x.tags||[]).join(",")}`).join("\n") || "(none)";

    return [
      "🎯 Project Roadmap",
      "— Active —",
      fmt(p.projects_active || [], "🚀"),
      "",
      "— Future —",
      fmt(p.future_projects || [], "🌱")
    ].join("\n");
  }

  /* ✨ golden "desc" #tags — set checkpoint */
  if (cmd === "!golden") {
    const tags = (tail.match(/#\w+/g) || []).map(t => t.slice(1));
    const desc = tail.replace(/#\w+/g, "").trim();
    if (!desc) return 'usage: !golden "desc" #tags';
    const p = loadPlan();
    p.golden = p.golden || [];
    p.golden.push({ id: Date.now().toString(), desc, tags, timestamp: nowISO() });
    savePlan(p);
    return `✨ golden saved: "${desc}"  ⌁ tags:${tags.join(",")}`;
  }

  /* ✨ golden-list [#tag] [N] */
  if (cmd === "!golden-list") {
    const parts = tail.trim().split(/\s+/).filter(Boolean);
    const tag = (parts.find(x => x.startsWith("#")) || "").slice(1);
    const n = parseInt(parts.find(x => /^\d+$/.test(x)) || "10", 10);
    const p = loadPlan();
    let rows = (p.golden || []).slice(-n);
    if (tag) rows = rows.filter(g => (g.tags||[]).includes(tag));
    if (!rows.length) return tag ? `no golden for #${tag}` : "no golden entries yet";
    return rows.map(g => `• ${g.desc}  ⌁ tags:${(g.tags||[]).join(",")}`).join("\n");
  }

  /* 🧾 session-note "text" #tags */
  if (cmd === "!session-note") {
    const tags = (tail.match(/#\w+/g) || []).map(t => t.slice(1));
    const text = tail.replace(/#\w+/g, "").replace(/^"|"$/g,"").trim();
    if (!text) return 'usage: !session-note "text" #tags';
    sessionNote(text, tags);
    return `🗒️ session note saved: "${text}"  ⌁ tags:${tags.join(",")}`;
  }

  /* 🧭 session-list [#tag] [N] */
  if (cmd === "!session-list") {
    const parts = tail.trim().split(/\s+/).filter(Boolean);
    const tag = (parts.find(x => x.startsWith("#")) || "").slice(1);
    const n = parseInt(parts.find(x => /^\d+$/.test(x)) || "3", 10);
    const p = loadPlan();
    let rows = (p.session || []);
    if (tag) rows = rows.filter(s => (s.tags||[]).includes(tag));
    rows = rows.slice(-n);
    if (!rows.length) return tag ? `no session items for #${tag}` : "no session items yet";
    return `🧭 session timeline (${rows.length}/${(p.session||[]).length} shown${tag?` for #${tag}`:""})\n` +
      rows.map(s => `• ${s.content}  ⌁ tags:${(s.tags||[]).join(",")}  ⌁ ${s.timestamp}`).join("\n");
  }

  /* 💾 backup [label] — zip repo (excl node_modules, receipts) */
  if (cmd === "!backup") {
    const label = (tail.trim() || "snapshot").replace(/\s+/g, "_");
    const out = path.join(os.homedir(), `${label}-backup.${new Date().toISOString().slice(0,10)}.zip`);
    const cwd = ROOT;
    try {
      cp.execSync(`zip -qr "${out}" . -x "node_modules/*" "receipts/*"`, { cwd });
      return `📦 backup created → ${out}`;
    } catch (e) {
      return `❌ backup failed: ${e.message}`;
    }
  }

  /* 📚 !learn — store a fact/snippet as knowledge (hashtags optional) */
  if (cmd === "!learn") {
    const tags = (tail.match(/#\w+/g) || []).map(t => t.slice(1));
    const text = tail.replace(/#\w+/g, "").trim();
    if (!text) return 'usage: !learn <text> #tag #tag2';
    const e = add(text, tags.length ? tags : ["knowledge"], "knowledge");
    return `📚 learned: "${text}"  ⌁ tags:${e.tags.join(",")}`;
  }

  /* 📖 !knowledge-list [#tag] [N] — list recent knowledge items */
  if (cmd === "!knowledge-list") {
    const pieces = tail.trim().split(/\s+/).filter(Boolean);
    const tag = (pieces.find(p => p.startsWith("#")) || "").replace("#","");
    const n = parseInt(pieces.find(p => /^\d+$/.test(p)) || "10", 10);
    const rows = recall({ tag: tag || "knowledge", limit: n });
    if (!rows.length) return tag ? `no knowledge for #${tag}` : "no knowledge yet";
    return rows.map(r => `• ${r.content}  ⌁ tags:${(r.tags||[]).join(",")}`).join("\n");
  }

  /* 📥 !learn-file <relative/path> [#tag...] — read small file from repo */
  if (cmd === "!learn-file") {
    const m = tail.trim().match(/^(\S+)(.*)$/);
    if (!m) return 'usage: !learn-file <relative/path> [#tag #tag2]';
    const rel = m[1];
    const extraTags = (m[2].match(/#\w+/g) || []).map(t => t.slice(1));
    const base = path.join(ROOT, rel);
    if (!fs.existsSync(base)) return `file not found: ${rel}`;
    const text = fs.readFileSync(base, "utf8").trim();
    if (!text) return `file empty: ${rel}`;
    const e = add(`[file:${rel}] ${text.slice(0, 1000)}`, extraTags.length ? extraTags : ["knowledge"], "knowledge");
    return `📥 learned file: ${rel}  ⌁ tags:${e.tags.join(",")}`;
  }

  /* 🆘 help */
  if (cmd === "!help") {
    return [
      "🎛️ Soulfield Command Menu",
      "─────────────────────────",
      "📝 !note <text> #tags           → save to memory + plan.json notes",
      "🔍 !recall #tag                 → list memories by tag",
      "📋 !plan-notes                  → show last 15 plan notes",
      "⚡ !plan-add active|future \"Name\" #tags → add a project to plan.json",
      "🧭 !plan-list                   → list Active + Future projects",
      "✨ !golden \"desc\" #tags         → mark Golden Thread checkpoint",
      "🗒️ !session-note \"text\" #tags   → log a timeline/session note",
      "🧭 !session-list [#tag] [N]     → show last N session notes (optionally for a tag)",
      "📚 !learn <text> #tags          → store knowledge snippet",
      "📖 !knowledge-list [#tag] [N]   → list knowledge items",
      "📥 !learn-file <path> [#tag..]  → ingest small repo file as knowledge",
      "💾 !backup [label]              → zip repo (excl. node_modules, receipts)",
      "📖 end of help"
    ].join("\n");
  }

  // ---- unknown ------------------------------------------------------------
  return "(🤔 unknown job)";
}

module.exports = { handleJob };

