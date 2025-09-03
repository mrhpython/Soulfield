const fs = require("fs");
const path = require("path");

function env() {
  const envPath = path.resolve(__dirname, "../../..", ".env");
  if (fs.existsSync(envPath)) {
    for (const line of fs.readFileSync(envPath,"utf8").split("\n")) {
      const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
      if (m && !process.env[m[1]]) process.env[m[1]] = m[2].trim();
    }
  }
  return {
    key: process.env.INFRANODUS_API_KEY || "",
    base: process.env.INFRANODUS_API_BASE || "https://api.infranodus.com"
  };
}

async function call({route, method="POST", body}) {
  const { key, base } = env();
  if (!key) throw new Error("INFRANODUS_API_KEY missing");
  const r = await fetch(`${base}${route}`, {
    method,
    headers: { "content-type":"application/json", "authorization": `Bearer ${key}` },
    body: body ? JSON.stringify(body) : undefined
  });
  if (!r.ok) throw new Error(`InfraNodus ${r.status}: ${await r.text()}`);
  return r.json();
}

/** Save raw & result alongside topic for provenance */
function writeResult(topic, payload, result) {
  const root = path.resolve(__dirname, "../../../workspace/data/infranodus");
  fs.mkdirSync(root+"/results", { recursive:true });
  fs.mkdirSync(root+"/logs", { recursive:true });
  const id = `${Date.now()}-${topic.replace(/[^a-z0-9-]+/gi,"-").toLowerCase()}`;
  fs.writeFileSync(`${root}/logs/${id}.request.json`, JSON.stringify(payload,null,2));
  fs.writeFileSync(`${root}/results/${id}.result.json`, JSON.stringify(result,null,2));
  return { id, resultPath: `${root}/results/${id}.result.json` };
}

/** Public API (to be filled with the real InfraNodus routes) */
async function analyzeText({ topic, texts }) {
  // Example payload shape (adjust to real API)
  const payload = { topic, texts };
  try {
    const data = await call({ route: "/v1/analyze", body: payload });
    return writeResult(topic, payload, data);
  } catch (e) {
    // Offline-safe fallback: enqueue
    const root = path.resolve(__dirname, "../../../workspace/data/infranodus/incoming");
    fs.mkdirSync(root, { recursive:true });
    const file = `${root}/${Date.now()}-${topic}.pending.json`;
    fs.writeFileSync(file, JSON.stringify(payload,null,2));
    return { queued:true, file, error:String(e) };
  }
}

module.exports = { analyzeText };
