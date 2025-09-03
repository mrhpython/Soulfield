const axios = require("axios");

/* Optional lens shim: if you have a real truth lens, export applyTruthLens(text)
   that returns { text, meta }. If not, we use a no-op to keep flow working. */
let applyTruthLens;
try {
  const lens = require("./truthLens.js");
  applyTruthLens = lens.applyTruthLens || lens.truthLens || ((t)=>({ text: String(t ?? "") , meta:{lens:{passed:[],failed:[],emergent:false}} }));
} catch {
  applyTruthLens = (t)=>({ text: String(t ?? "") , meta:{lens:{passed:[],failed:[],emergent:false}} });
}

/* Load agents from ./data/agents.json (array or {agents:[...]}) */
function agents(){
  try { delete require.cache[require.resolve("./data/agents.json")]; } catch {}
  try {
    const j = require("./data/agents.json");
    return Array.isArray(j) ? j : (j.agents || []);
  } catch {
    return [];
  }
}

/* Robust parser: accepts string or {text:"..."}; returns {id,text,agent} */
function pick(text){
  const s = typeof text === "string" ? text : (text && text.text) ? String(text.text) : "";
  const m = s.match(/^@([\w-]+):?\s*(.*)$/s);
  const list = agents();

  if (!m){
    return {
      id: "aiden",
      text: s,
      agent: list.find(a => a.id === "aiden") || list[0] || { id:"aiden", name:"Aiden", system:"You are Aiden, an orchestrator." }
    };
  }
  const id = m[1];
  return {
    id,
    text: m[2] || "",
    agent: list.find(a => a.id === id) || list[0] || { id, name:id, system:`You are ${id}.` }
  };
}

/* Anthropic call (Messages API). Uses AIDEN_MODEL from .env or default. */
async function callClaude(system, user){
  if (process.env.DEV_NO_API === "1") return "(dev offline)";
  const model = process.env.AIDEN_MODEL || "claude-opus-4.1-20250805";

  const r = await axios.post(
    "https://api.anthropic.com/v1/messages",
    {
      model,
      max_tokens: 800,
      temperature: 0.2,
      system: String(system || ""), // ✅ Claude-compatible top-level field
      messages: [
        { role: "user", content: String(user || "") }
      ]
    },
    {
      headers: {
        "x-api-key": process.env.CLAUDE_API_KEY,
        "anthropic-version": "2023-06-01"
      },
      timeout: 60000
    }
  );

  return r.data?.content?.[0]?.text || "(no response)";
}

/* Main entry used by index.cjs */
async function runWithCouncil(raw){
  const gated = applyTruthLens ? applyTruthLens(raw) : { text: String(raw ?? "") };
  const { id, text, agent } = pick(gated.text);

  // Simple: always route to the chosen agent's system prompt via Claude
  const out = await callClaude(agent?.system || "", text);
  return { agent: id, output: out };
}

module.exports = { runWithCouncil };
require("dotenv").config();

