const path = require("path");
const scraper = require(path.resolve(__dirname, "../../services/scraper/index.cjs"));

function extractUrl(text) {
  const m = String(text || "").match(/https?:\/\/[^\s"'<>]+/i);
  return m ? m[0] : null;
}

async function run({ url, brief }) {
  if (!url) url = extractUrl(brief);
  if (!url) return { ok:false, error:"no URL provided", hint:"pass {url} or include an http(s):// URL in the brief" };
  return scraper.scrape({ url });
}

module.exports = { run };
