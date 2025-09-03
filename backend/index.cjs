#!/usr/bin/env node
// Minimal API server for Soulfield (Claude Aiden)
const http = require("http");
const url  = require("url");

require("dotenv").config();

const { handleJob } = require("./jobs.js");
const { runWithCouncil } = require("./council.js");

const PORT = process.env.PORT ? Number(process.env.PORT) : 8790;

function json(res, code, obj) {
  res.writeHead(code, { "Content-Type": "application/json" });
  res.end(JSON.stringify(obj));
}

async function route(req, res) {
  const { pathname } = url.parse(req.url);
  if (req.method === "GET" && pathname === "/health") {
    return json(res, 200, { ok: true, service: "soulfield", model: process.env.AIDEN_MODEL || "unset" });
  }

  if (req.method === "POST" && pathname === "/chat") {
    let body = "";
    req.on("data", (c) => (body += c));
    req.on("end", async () => {
      try {
        const { prompt = "" } = JSON.parse(body || "{}");

        let output;
        // “!” commands -> jobs.js
        if (/^!\w+/.test(prompt.trim())) {
          output = await handleJob(prompt.trim());
          return json(res, 200, { output });
        }

        // “@agent …” or plain text -> council / Claude
        const r = await runWithCouncil(prompt);
        return json(res, 200, { output: r.output, agent: r.agent });
      } catch (e) {
        return json(res, 500, { error: e.message || String(e) });
      }
    });
    return;
  }

  json(res, 404, { error: "not found" });
}

http.createServer(route).listen(PORT, () => {
  console.log(`Soulfield listening on :${PORT}`);
});

