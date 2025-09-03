/* InfraNodus adapter (stub) */
const fs = require("fs");
const path = require("path");
const { applyTruthLens } = require("../../truthlens.cjs");

function saveGraphDump(topic, json) {
  const dir = path.resolve(__dirname, "../../../workspace/data/infranodus");
  fs.mkdirSync(dir, { recursive:true });
  const p = path.join(dir, `${Date.now()}-${topic}.json`);
  fs.writeFileSync(p, JSON.stringify(json, null, 2));
  return p;
}

async function analyze({ topic, texts=[] }) {
  // TODO: call InfraNodus API or parse exports
  const mock = { topic, nodes:[], edges:[], gaps:["stub-gap"] };
  const file = saveGraphDump(topic.replace(/[^a-z0-9-]+/gi,"-").toLowerCase(), mock);
  return applyTruthLens({ ok:true, file, summary:{ gaps: mock.gaps } });
}

// Export both analyze and run for router compatibility
module.exports = { analyze, run: analyze };
