/* Agent-as-Tool adapter (wshobson/agents compatible, stub) */
const { applyTruthLens, lensMeta } = require("../../truthlens.cjs");

async function runAgent({ name, input, params={} }) {
  // TODO: wire to external agents framework (wshobson/agents)
  const out = { agent:name, received: input, params, note:"stub adapter — fill me" };
  return applyTruthLens({ ok:true, out, meta: lensMeta });
}

module.exports = { runAgent };
