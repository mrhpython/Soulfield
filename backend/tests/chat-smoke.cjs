#!/usr/bin/env node
/* Simple smoke test for /chat using DEV_NO_API=1 (offline). */
const cp = require('child_process');
const fetch = require('node-fetch');

const PORT = 8790;

function sleep(ms){ return new Promise(r=>setTimeout(r, ms)); }

async function waitForHealth(timeoutMs=5000){
  const deadline = Date.now() + timeoutMs;
  while (Date.now() < deadline){
    try {
      const r = await fetch(`http://127.0.0.1:${PORT}/health`);
      if (r.ok) return true;
    } catch {}
    await sleep(150);
  }
  return false;
}

(async () => {
  const child = cp.spawn(process.execPath, ['backend/index.cjs'], {
    env: { ...process.env, DEV_NO_API: '1', PORT: String(PORT) },
    stdio: 'ignore'
  });

  try {
    const ok = await waitForHealth(6000);
    if (!ok) throw new Error('API did not become healthy');

    // !help path
    const helpRes = await fetch(`http://127.0.0.1:${PORT}/chat`, {
      method: 'POST', headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ prompt: '!help' })
    });
    if (!helpRes.ok) throw new Error('!help request failed');
    const helpJson = await helpRes.json();
    if (!helpJson.output || typeof helpJson.output !== 'string') throw new Error('!help output missing');

    // @aiden path
    const aidenRes = await fetch(`http://127.0.0.1:${PORT}/chat`, {
      method: 'POST', headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ prompt: '@aiden: ping' })
    });
    if (!aidenRes.ok) throw new Error('@aiden request failed');
    const aidenJson = await aidenRes.json();
    if (!aidenJson.output || typeof aidenJson.output !== 'string') throw new Error('@aiden output missing');

    process.exit(0);
  } catch (e){
    console.error(String(e && e.message || e));
    process.exit(1);
  } finally {
    child.kill('SIGTERM');
  }
})();

