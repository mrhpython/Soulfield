/* Soulfield MCP (read-only FS) — port 8791 */
const express = require("express");
const fs = require("fs");
const path = require("path");

const app = express();
app.use(express.json());

const ROOT = path.resolve(__dirname); // ~/soulfield
const SAFE = ROOT;                     // restrict to project root

function safePath(p){
  const abs = path.resolve(SAFE, p || ".");
  if (!abs.startsWith(SAFE)) throw new Error("path escapes SAFE root");
  return abs;
}
function listDir(p){
  const abs = safePath(p);
  const ents = fs.readdirSync(abs, { withFileTypes: true });
  return ents.map(e => ({
    name: e.name,
    type: e.isDirectory() ? "dir" : e.isFile() ? "file" : "other",
    size: e.isFile() ? (fs.statSync(path.join(abs, e.name)).size) : null,
  }));
}
function readFile(p, maxBytes=131072){ // 128 KiB cap
  const abs = safePath(p);
  const st = fs.statSync(abs);
  if (!st.isFile()) throw new Error("not a file");
  const cap = Math.min(st.size, maxBytes|0 || 0);
  return fs.readFileSync(abs, { encoding: "utf8", flag: "r" }).slice(0, cap);
}

/* Tool manifest */
app.get("/mcp/tools", (_req,res) => {
  res.json({
    name: "soulfield.fs.readonly",
    root: SAFE,
    tools: [
      { name: "list_dir", args: { path: "string (relative to project root)" } },
      { name: "read_file", args: { path: "string (relative)", maxBytes: "number (optional, default 131072)" } },
    ],
  });
});

/* Tool invocation */
app.post("/mcp/call", (req,res) => {
  const { name, args = {} } = req.body || {};
  try {
    if (name === "list_dir") {
      const out = listDir(args.path || ".");
      return res.json({ ok: true, result: out });
    }
    if (name === "read_file") {
      const out = readFile(args.path, args.maxBytes);
      return res.json({ ok: true, result: out });
    }
    return res.status(400).json({ ok: false, error: "unknown tool" });
  } catch (e) {
    return res.status(400).json({ ok: false, error: String(e.message || e) });
  }
});

const PORT = 8791;
app.listen(PORT, () => {
  console.log(`MCP FS (ro) → http://127.0.0.1:${PORT}/mcp/tools  (SAFE=${SAFE})`);
});
