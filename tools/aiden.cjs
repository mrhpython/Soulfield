const fs = require("fs");
const path = require("path");

function loadEnv() {
  const envPath = path.join(__dirname, "..", ".env");
  if (fs.existsSync(envPath)) {
    for (const line of fs.readFileSync(envPath, "utf8").split("\n")) {
      const m = line.match(/^\s*([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*)\s*$/);
      if (m && !process.env[m[1]]) process.env[m[1]] = m[2].trim();
    }
  }
}
loadEnv();

const API_KEY = process.env.ANTHROPIC_API_KEY || process.env.CLAUDE_API_KEY || "";
const MODEL   = process.env.AIDEN_MODEL || "claude-opus-4-1-20250805";

if (!API_KEY) throw new Error("Missing ANTHROPIC_API_KEY (or CLAUDE_API_KEY) in .env");

async function askAiden({ system = "", messages = [], maxTokens = 2000 }) {
  const body = { model: MODEL, max_tokens: maxTokens, system, messages };
  const r = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "x-api-key": API_KEY,
      "anthropic-version": "2023-06-01"
    },
    body: JSON.stringify(body)
  });
  if (!r.ok) {
    const t = await r.text().catch(()=>String(r.status));
    throw new Error(`Anthropic ${r.status}: ${t}`);
  }
  const j = await r.json();
  return (j.content || []).map(x => x.text || "").join("\n").trim();
}

module.exports = { askAiden };
