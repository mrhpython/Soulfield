const fs = require("fs");
const path = require("path");
const MEM_FILE = path.join(__dirname, "data", "memory.json");
fs.mkdirSync(path.dirname(MEM_FILE), { recursive: true });
if (!fs.existsSync(MEM_FILE)) fs.writeFileSync(MEM_FILE, "[]", "utf-8");

function load(){ return JSON.parse(fs.readFileSync(MEM_FILE, "utf-8")); }
function save(v){ fs.writeFileSync(MEM_FILE, JSON.stringify(v, null, 2)); }

function add(content, tags=[], source="chat", meta={}) {
  const all = load();
  const entry = {
    id: Date.now().toString(),
    content: String(content),
    tags: tags.map(t=>t.replace(/^#/, "")),
    source, meta,
    timestamp: new Date().toISOString()
  };
  all.push(entry); save(all); return entry;
}

function recall({ tag, limit=30 }={}) {
  let all = load();
  if (tag) { const t = tag.replace(/^#/, ""); all = all.filter(e => e.tags.includes(t)); }
  all.sort((a,b)=> b.id.localeCompare(a.id));
  return all.slice(0, limit);
}

module.exports = { add, recall, load };
