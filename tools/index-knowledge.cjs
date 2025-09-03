const fs = require("fs"); const path = require("path"); const crypto = require("crypto");
const ROOT = path.resolve(__dirname, "..");
const zones = JSON.parse(fs.readFileSync(path.join(ROOT, ".agent-os", "zones.json"), "utf8")).zones;
const roots = ["product","research","knowledge","recaps","docs","data"].map(k => path.join(ROOT, zones[k].replace("./","")));

function gather(dir) {
  const out = [];
  function walk(p) {
    if (!fs.existsSync(p)) return;
    for (const name of fs.readdirSync(p)) {
      const fp = path.join(p,name);
      const st = fs.statSync(fp);
      if (st.isDirectory()) { walk(fp); continue; }
      if (!/\.(md|json)$/i.test(name)) continue;
      const rel = path.relative(ROOT, fp);
      const size = st.size; const mtime = st.mtimeMs;
      let title = name; let tags = [];
      try {
        const head = fs.readFileSync(fp, "utf8").slice(0, 4096);
        const h1 = head.match(/^#\s+(.+)$/m); if (h1) title = h1[1].trim();
        const fm = head.match(/^---\n([\s\S]*?)\n---/); // YAML frontmatter (optional)
        if (fm) {
          for (const line of fm[1].split("\n")) {
            const m = line.match(/tags:\s*\[(.*)\]/i); if (m) tags = m[1].split(",").map(s=>s.trim().replace(/^"|"$/g,""));
          }
        }
      } catch {}
      out.push({ path: rel, size, mtime, title, tags, hash: crypto.createHash("md5").update(rel+size+mtime).digest("hex") });
    }
  }
  walk(dir); return out;
}

let items = [];
for (const r of roots) items = items.concat(gather(r));
const outPath = path.join(ROOT, "workspace", "data", "index.json");
fs.mkdirSync(path.dirname(outPath), { recursive: true });
fs.writeFileSync(outPath, JSON.stringify({ generated: Date.now(), count: items.length, items }, null, 2));
console.log(outPath, items.length);
