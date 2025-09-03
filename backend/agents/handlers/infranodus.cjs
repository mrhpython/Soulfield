const path = require("path");
const { analyzeText } = require(path.resolve(__dirname, "../../adapters/infranodus/client.cjs"));
async function run({ topic, texts = [], brief }) {
  const t = topic || brief || "topic";
  return analyzeText({ topic: t, texts });
}
module.exports = { run };
