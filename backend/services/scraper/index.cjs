/* Scraping Browser service (policy-first stub, hardened) */
const fs = require("fs");
const path = require("path");

function loadAllowlist() {
  const p = path.resolve(__dirname, "config", "allowlist.yaml");
  if (!fs.existsSync(p)) return { domains:[], notes:"create config/allowlist.yaml" };
  const text = fs.readFileSync(p,"utf8");
  const domains = text.split(/\r?\n/).map(l=>l.trim()).filter(l=>l && !l.startsWith("#"));
  return { domains };
}

async function scrape({ url }) {
  let host;
  try {
    host = new URL(url).hostname;
  } catch {
    return { ok:false, error:"invalid URL", url };
  }
  const { domains } = loadAllowlist();
  const allowed = domains.some(d => host === d || host.endsWith("."+d));
  if (!allowed) return { ok:false, error:"domain not in allowlist", host, allowlist: domains };

  const out = { url, html:"<!-- stub -->", ts:Date.now() };
  const dir = path.resolve(__dirname, "../../../workspace/data/scrapes");
  fs.mkdirSync(dir, { recursive:true });
  const file = path.join(dir, `${Date.now()}-${host}.jsonl`);
  fs.appendFileSync(file, JSON.stringify(out)+"\n");
  return { ok:true, file };
}

// Provide run alias for manager compatibility
module.exports = { scrape, loadAllowlist, run: scrape };
