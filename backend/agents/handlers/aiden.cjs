const path = require("path");
const { askAiden } = require(path.resolve(__dirname, "../../../tools/aiden.cjs"));
async function run({ brief, context = {} }) {
  const system = "You are Aiden, produce concise, actionable output for Soulfield OS.";
  const msg = [{ role:"user", content: `Brief: ${brief}\nContext: ${JSON.stringify(context).slice(0,1200)}` }];
  const text = await askAiden({ system, messages: msg, maxTokens: 1500 });
  return { agent:"aiden", ok:true, text };
}
module.exports = { run };
