/* Soulfield MCP (read-only FS) — port 8791 */
const express = require("express");
const fs = require("fs");
const path = require("path");

const app = express();
app.use(express.json());

const ROOT = path.resolve(__dirname); // ~/soulfield
const SAFE = ROOT;                     // restrict to project root

// Basic denylist to avoid accidental secret exfiltration when MCP is exposed.
const FORBIDDEN_DIRS = new Set([".git", ".ssh", "receipts"]);
function isForbidden(relPath){
  const rel = relPath.replace(/\\/g, "/");
  if (!rel || rel === ".") return false;
  // Block .env files anywhere
  if (/(^|\/)\.env(\.|$)/.test(rel)) return true;
  // Block specific directories anywhere in the path
  const parts = rel.split("/");
  if (parts.some(p => FORBIDDEN_DIRS.has(p))) return true;
  return false;
}

function safePath(p){
  const abs = path.resolve(SAFE, p || ".");
  if (!abs.startsWith(SAFE)) throw new Error("path escapes SAFE root");
  return abs;
}
function listDir(p){
  const abs = safePath(p);
  const baseRel = path.relative(SAFE, abs) || ".";
  const ents = fs.readdirSync(abs, { withFileTypes: true });
  return ents
    .filter(e => {
      const rel = baseRel === "." ? e.name : path.posix.join(baseRel.replace(/\\/g,"/"), e.name);
      // Hide forbidden entries from listing
      return !isForbidden(rel);
    })
    .map(e => ({
      name: e.name,
      type: e.isDirectory() ? "dir" : e.isFile() ? "file" : "other",
      size: e.isFile() ? (fs.statSync(path.join(abs, e.name)).size) : null,
    }));
}
function readFile(p, maxBytes=131072){ // 128 KiB cap
  const abs = safePath(p);
  const rel = path.relative(SAFE, abs).replace(/\\/g, "/");
  if (isForbidden(rel)) throw new Error("access denied");
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
