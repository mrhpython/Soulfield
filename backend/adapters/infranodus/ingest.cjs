const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

const ROOT = path.resolve(__dirname, "../../../workspace/data/infranodus");
const INCOMING = path.join(ROOT, "incoming");
fs.mkdirSync(INCOMING, { recursive: true });

function recId(){ return Date.now()+"-"+crypto.randomBytes(3).toString("hex"); }
function rec({source, topic, text, meta={}}){ return { id:recId(), source, topic, text:String(text||""), meta, ts:Date.now() }; }
function writeJSONL(arr){
  const file = path.join(INCOMING, `${Date.now()}-${arr.length}.jsonl`);
  fs.writeFileSync(file, arr.map(x=>JSON.stringify(x)).join("\n")+"\n");
  return file;
}

function readUTF8(p){ return fs.readFileSync(p,"utf8"); }
function collectFiles(p, exts){
  const out=[];
  function walk(dir){
    for (const n of fs.readdirSync(dir)){
      const fp = path.join(dir,n);
      const st = fs.statSync(fp);
      if (st.isDirectory()) walk(fp);
      else if (exts.includes(path.extname(n).toLowerCase())) out.push(fp);
    }
  }
  const st = fs.statSync(p);
  if (st.isDirectory()) walk(p); else out.push(p);
  return out;
}

function ingestMarkdown({ pathOrDir, topic="markdown" }){
  const files = collectFiles(pathOrDir, [".md"]);
  return writeJSONL(files.map(fp => rec({source:"markdown", topic, text:readUTF8(fp), meta:{file:fp}})));
}
function ingestText({ pathOrDir, topic="text" }){
  const files = collectFiles(pathOrDir, [".txt"]);
  return writeJSONL(files.map(fp => rec({source:"text", topic, text:readUTF8(fp), meta:{file:fp}})));
}
function ingestCSV({ file, col, topic="csv" }){
  const rows = readUTF8(file).split(/\r?\n/).filter(Boolean);
  const header = rows.shift().split(",");
  const idx = header.indexOf(col);
  if (idx < 0) throw new Error(`column "${col}" not found in ${file} (have: ${header.join(",")})`);
  return writeJSONL(rows.map(r => {
    const cells = r.split(",");
    return rec({source:"csv", topic, text:cells[idx], meta:{file, col}});
  }));
}
function ingestPlain({ text, topic="plain" }){
  return writeJSONL([rec({source:"plain", topic, text})]);
}
function ingestURL({ url, topic="url" }){
  return writeJSONL([rec({source:"url", topic, text:url, meta:{url}})]);
}

module.exports = { ingestMarkdown, ingestText, ingestCSV, ingestPlain, ingestURL };

// --- export parser (add-on) ---
function parseExportJSON({ file, label="export" }){
  const fs = require("fs");
  const path = require("path");
  const ROOT = path.resolve(__dirname, "../../../workspace/data/infranodus");
  const RES  = path.join(ROOT, "results"); require("fs").mkdirSync(RES,{recursive:true});
  const raw = JSON.parse(fs.readFileSync(file,"utf8"));
  const out = {
    label,
    ts: Date.now(),
    meta: { file },
    nodes: raw.nodes || raw.graph?.nodes || [],
    edges: raw.edges || raw.graph?.edges || [],
    gaps:  raw.insights?.gaps || raw.gaps || [],
    raw
  };
  const dest = path.join(RES, `${Date.now()}-${label}.result.json`);
  fs.writeFileSync(dest, JSON.stringify(out,null,2));
  return dest;
}
module.exports.parseExportJSON = parseExportJSON;

// --- export parser (add-on) ---
function parseExportJSON({ file, label="export" }){
  const fs = require("fs");
  const path = require("path");
  const ROOT = path.resolve(__dirname, "../../../workspace/data/infranodus");
  const RES  = path.join(ROOT, "results"); require("fs").mkdirSync(RES,{recursive:true});
  const raw = JSON.parse(fs.readFileSync(file,"utf8"));
  const out = {
    label,
    ts: Date.now(),
    meta: { file },
    nodes: raw.nodes || raw.graph?.nodes || [],
    edges: raw.edges || raw.graph?.edges || [],
    gaps:  raw.insights?.gaps || raw.gaps || [],
    raw
  };
  const dest = path.join(RES, `${Date.now()}-${label}.result.json`);
  fs.writeFileSync(dest, JSON.stringify(out,null,2));
  return dest;
}
module.exports.parseExportJSON = parseExportJSON;
