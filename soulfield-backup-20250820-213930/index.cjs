// index.cjs — single app, single listener, chat + coder UI

require("dotenv").config();

const path = require("path");
const fs = require("fs");
const express = require("express");

// --- core app & config ---
const app = express();
const PORT = process.env.PORT || 8790;

// JSON body
app.use(express.json({ limit: "1mb" }));

// simple CORS (local use)
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") return res.sendStatus(204);
  next();
});

// --- chat endpoint (calls jobs.js) ---
const { handleJob } = require("./jobs.js");

app.post("/chat", async (req, res) => {
  try {
    const prompt = (req.body && req.body.prompt) ? String(req.body.prompt) : "";
    if (!prompt.trim()) return res.status(400).json({ error: "missing prompt" });

    const out = await handleJob(prompt);
    res.json({ output: out });
  } catch (err) {
    console.error("chat error:", err);
    res.status(500).json({ error: String(err && err.message || err) });
  }
});

// --- health ---
app.get("/health", (_req, res) => res.json({ ok: true, ts: new Date().toISOString() }));

// --- CoderOS mini UI (read-only) ---
const SPECS_DIR = path.join(__dirname, ".agent-os", "specs");

function listSpecs() {
  if (!fs.existsSync(SPECS_DIR)) return [];
  return fs.readdirSync(SPECS_DIR)
    .map(id => ({ id, file: path.join(SPECS_DIR, id, "spec.md") }))
    .filter(x => fs.existsSync(x.file))
    .sort((a, b) => b.id.localeCompare(a.id)); // newest-first by id prefix
}

app.get("/coder", (_req, res) => {
  const specs = listSpecs();
  const rows = specs.map(s =>
    `<li><a href="/coder/spec/${encodeURIComponent(s.id)}">${s.id}</a></li>`
  ).join("");
  res.type("html").send(`<!doctype html>
  <meta charset="utf-8"/>
  <title>CoderOS — Specs</title>
  <style>
    body{font:14px/1.5 system-ui, sans-serif; margin:2rem; max-width:900px}
    ul{line-height:1.8}
    a{color:#1e6fff;text-decoration:none} a:hover{text-decoration:underline}
  </style>
  <h1>CoderOS — Specs</h1>
  <p>Newest first. Click to open.</p>
  <ul>${rows || "<li>(none yet)</li>"}</ul>
  <p><a href="/health">health</a> · <a href="/chat">/chat (POST)</a></p>`);
});

app.get("/coder/spec/:id", (req, res) => {
  const id = req.params.id;
  const file = path.join(SPECS_DIR, id, "spec.md");
  if (!/^[0-9].+/.test(id)) return res.status(400).send("bad id");
  if (!fs.existsSync(file)) return res.status(404).send("spec not found");
  const esc = s => s.replace(/[&<>]/g, m => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;" }[m]));
  const md = esc(fs.readFileSync(file, "utf8"));
  res.type("html").send(`<!doctype html>
  <meta charset="utf-8"/>
  <title>${id}</title>
  <style>
    body{font:14px/1.6 system-ui, sans-serif; margin:2rem; max-width:900px}
    pre{white-space:pre-wrap; background:#111; color:#eee; padding:1rem; border-radius:8px; overflow:auto}
    a{color:#1e6fff;text-decoration:none} a:hover{text-decoration:underline}
  </style>
  <a href="/coder">← back</a>
  <h1>${id}</h1>
  <pre>${md}</pre>`);
});

// --- start server (single listener) ---
app.listen(PORT, () => {
  console.log(`Claude Aiden UI → http://localhost:${PORT}/chat`);
  console.log(`Coder UI  → http://localhost:${PORT}/coder`);
});

