# Soulfield OS — STATUS

_Last updated: 2025-08-29T22:08:46+01:00_

_Last updated: $(date -Iseconds)_

## Services & Ports
- **App (chat + coder UI)**: `soulfield.service`
  - **HTTP**: `http://127.0.0.1:8790`
  - **Endpoints**:
    - UI: `/chat` (Claude Aiden UI)
    - UI: `/coder` (Coder UI)
    - Health: `/health` → expect **200**
    - API: `POST /chat` with `{"prompt":"..."}`
- **MCP FS (read‑only)**: `soulfield-mcp.service`
  - **HTTP**: `http://127.0.0.1:8791`
  - **Endpoints**:
    - `GET /mcp/tools` (manifest)
    - `POST /mcp/call` (tools: `list_dir`, `read_file`)

## Binaries & Runtime
- **Node.js**: v20.x (seen: v20.19.4)
- **Working dir**: `~/soulfield`
- **Main entry**: `index.cjs`
- **Job router**: `jobs.js` (contains `!help`, `!agents`, `!coder-open`, `!coder-apply`, etc.)
- **User CLI helper**: `~/bin/sf`
  - `sf dry`   → run `!coder-apply --dry`
  - `sf apply` → run `!coder-apply #apply` + auto‑tail latest run log
  - `sf log`   → show last run log tail
  - (optional) `sf mcp:ls <path>` / `sf mcp:cat <file> <bytes>` if you added those

## Data & Project Layout
- **Agents registry**: `~/soulfield/data/agents.json`
- **Agent‑OS workspace**: `~/soulfield/.agent-os/`
  - `specs/`      → each feature spec: `.<timestamp>-<slug>/spec.md`
  - `runs/`       → execution logs: `*-run.log`
  - `product/`    → product plan / roadmap (when created)
  - `standards/`  → coding standards (when created)
  - `recaps/`     → execution recaps (when created)
  - `instructions/` → flows/prompts (when created)

## Spec Flow (what we verified)
1. Create spec via chat command:
   - `!coder-open "Add MCP Filesystem (read-only)" #code #plan-aligned`
   - Writes: `~/soulfield/.agent-os/specs/<id>/spec.md`
2. Preview approved commands:
   - `sf dry`
3. Execute approved commands (whitelist only):
   - `sf apply`
   - Whitelist: **echo, ls, cat, head** (no pipes/redirects)

## MCP FS (read‑only) — quick reference
- File: `~/soulfield/mcp-server.cjs`
- Tools:
  - `list_dir(path=".")` → lists names/types/sizes (project‑root confined)
  - `read_file(path, maxBytes=131072)` → UTF‑8 slice, 128 KiB cap
- Safety: path confined to `~/soulfield` (blocks `..` traversal)

## Systemd (user) — lifecycle
- **Reload units**: `systemctl --user daemon-reload`
- **Start/Restart**:
  - App:  `systemctl --user restart soulfield`
  - MCP:  `systemctl --user restart soulfield-mcp`
- **Status (short)**:
  - `systemctl --user status soulfield --no-pager -l | sed -n '1,15p'`
  - `systemctl --user status soulfield-mcp --no-pager -l | sed -n '1,15p'`
- **Logs**:
  - `journalctl --user -u soulfield -n 120 --no-pager`
  - `journalctl --user -u soulfield-mcp -n 120 --no-pager`

## Health Checks (copy/paste)
- App:
  - `curl -s -o /dev/null -w '%{http_code}\n' http://127.0.0.1:8790/health  # expect 200`
  - `curl -s http://127.0.0.1:8790/chat -H 'Content-Type: application/json' -d '{"prompt":"!help"}' | jq -r .output | sed -n '1,40p'`
- MCP:
  - `curl -s http://127.0.0.1:8791/mcp/tools | jq .`
  - `curl -s http://127.0.0.1:8791/mcp/call -H 'Content-Type: application/json' -d '{"name":"list_dir","args":{"path":".agent-os/specs"}}' | jq .`

## Memory & Ports (how to check)
- **Ports listening**: `ss -ltnp | grep -E '8790|8791'`
- **Process tree**: `ps -fp $(pgrep -u "$USER" -x node) | sed -n '1,80p'`
- **Service RSS**:
  - `pmap $(systemctl --user show -p MainPID --value soulfield) | tail -n1`
- **Node heap (quick)**:
  - Foreground run: `node --expose-gc -e "console.log(process.memoryUsage());global.gc()"`

## Backups & Snapshots
- Quick snapshot of critical files:
  - `tar czf ~/soulfield-snapshot-$(date +%Y%m%d-%H%M%S).tgz -C ~ soulfield/index.cjs soulfield/jobs.js soulfield/data/agents.json soulfield/.agent-os/specs`
- Safe edit pattern:
  - `cp jobs.js jobs.js.bak.$(date +%Y%m%d-%H%M%S)`

## Common Recovery
- **Service runs but `/chat` 000**:
  - Check journal: `journalctl --user -u soulfield -n 120 --no-pager`
  - Run foreground for stack: `cd ~/soulfield && node index.cjs`
- **“unknown job”**:
  - Ensure handler exists in `jobs.js`, then restart service.
- **Spec not found**:
  - Create one: `!coder-open "Feature name" #code #plan-aligned`
- **`coder-apply` rejects commands**:
  - Only `echo|ls|cat|head` allowed; remove pipes/redirects from `## Run (approved)`

## Handy One-liners
- Last spec file:
  - `SPEC=$(find ~/.agent-os/specs -maxdepth 2 -type f -name spec.md | sort | tail -n1); echo "$SPEC"`
- Tail last run:
  - `tail -f ~/soulfield/.agent-os/runs/*-run.log`
- Use CLI helper:
  - `sf dry | sf apply | sf log`

---

Keep this current

When you want to refresh the timestamp at the top, run:

sed -i "1s/.*/# Soulfield — Ops Status (Local)\n\n_Last updated: $(date -Iseconds)_/" ~/soulfield/STATUS.md


This gives us a single source of truth for ports, services, paths, and “what to do if X breaks.” When you’re ready, tell me the product/feature details and we’ll start filling in .agent-os/product/ and specs/ together.
---




# Soulfield STATUS — recap & runbook

> Snapshot of what’s working now, where files live, and exactly how to run the loop (gap → research → spec → compliance → execute). Keep this in `workspace/docs/STATUS.md`.

---

## High‑level

* **Core loop**: InfraNodus gaps → `sf specify:infra` → spec in `.agent-os/specs/…/spec.md` → `sf dry` → `sf apply --apply`.
* **Aiden/Claude**: used by `sf specify` (turns newest research into a spec). Invoked from CLI; no dedicated UI yet.
* **Jina**: stubbed handler for semantic search/rerank (returns placeholder results until API wired).
* **Scraper**: policy‑first scraper + allowlist; Bright Data wiring pending (account verification).
* **TruthLens**: advisory rules live in `workspace/knowledge/TruthLens.md`; index is `workspace/data/index.json`.

---

## Commands (cheat sheet)

### Research → Spec → Index → Run

```bash
# 1) Create research
sf research "<topic>"
# -> workspace/research/<id>-<slug>/{research.md,keywords.json,meta.yaml}

# 2) Turn newest research into a spec (Aiden/Claude)
sf specify
# -> .agent-os/specs/<ts>-<slug>/spec.md

# 3) Build/refresh index for TruthLens & agents
sf index
# -> workspace/data/index.json

# 4) Sanity test (no writes)
sf dry

# 5) Execute approved steps (whitelist only)
sf apply --apply

# 6) Tail latest run log
sf log
```

### InfraNodus → Spec

```bash
# Put InfraNodus export JSON into:
#   workspace/data/infranodus/exports/

sf specify:infra
sf index
sf dry
sf apply --apply
```

### Agent manager (routing/tests)

```bash
# List available agents
aiden@> node -e "const m=require('./backend/agents/manager.cjs'); console.table(m.listAgents())"

# Let router choose from brief (scrape or search demos)
node -e "const m=require('./backend/agents/manager.cjs'); m.autoRoute({brief:'do a compliant scrape on https://bbc.co.uk/news'}).then(console.log)"
node -e "const m=require('./backend/agents/manager.cjs'); m.autoRoute({brief:'semantic search over workspace about TruthLens'}).then(console.log)"

# Run specific handlers
node -e "const m=require('./backend/agents/manager.cjs'); m.run('jina',{query:'truthlens'}).then(console.log)"
node -e "const m=require('./backend/agents/manager.cjs'); m.run('infranodus',{topic:'content gap demo',texts:['a','b']}).then(console.log)"
node -e "const m=require('./backend/agents/manager.cjs'); m.run('scraper',{url:'https://bbc.co.uk/'}).then(console.log)"
```

---

## Where things live

* **Research** → `workspace/research/<id>-<slug>/`
* **Specs (generated)** → `.agent-os/specs/<ts>-*/spec.md`
* **Index** → `workspace/data/index.json`
* **Knowledge & rules**

  * `workspace/knowledge/TruthLens.md`
  * `workspace/knowledge/UK-Online-Compliance.md`
  * `workspace/knowledge/README.md`
* **Compliance policy files**

  * `backend/services/policy/uk-online-marketplace.yaml`
  * `backend/services/policy/config/whitelist.yaml` (allowed commands: `echo|ls|cat|head` etc.)
* **InfraNodus**

  * exports in → `workspace/data/infranodus/exports/`
  * processed/incoming → `workspace/data/infranodus/incoming/`
* **Scraper**

  * allowlist → `backend/services/scraper/config/allowlist.yaml`
  * results → `workspace/data/scrapes/*.jsonl`
* **Agent code**

  * manager → `backend/agents/manager.cjs`
  * handlers → `backend/agents/handlers/{infranodus.cjs,jina.cjs,scraper.cjs}`

---

## Aiden / Claude notes

* **Invocation**: via `sf specify` and the agent manager; **no web UI deployed** yet.
* **Health check** (optional local service):

```bash
curl -s -o /dev/null -w '%{http_code}\n' http://127.0.0.1:8790/health  # expect 200 if running
```

* **Env**: `.env` holds CLAUDE\_API\_KEY and model (`AIDEN_MODEL=claude-opus-4-1-20250805`).

---

## Bright Data status

* Signup flagged as bot (awaiting confirmation). Once approved:

  1. Add API key to `.env` (we’ll name `BRIGHTDATA_API_KEY=`).
  2. Wire scraper handler to use Bright Data Web Scraper API (eBay profiles), still gated by `allowlist.yaml` & TruthLens.

---

## Jina plan

* Replace stub with real API calls for search/rerank.
* Persist snippets to `workspace/data/jina/*.jsonl`.
* Surface in `workspace/data/index.json` for TruthLens cross‑refs.

---

## Daily quick run

```bash
cd ~/soulfield
sf research "eco-friendly digital planners UK"
sf specify
sf index
sf dry
sf apply --apply
```

---

## Troubleshooting

* **Spec not found**: ensure a recent research folder exists, or pass an InfraNodus export and run `sf specify:infra`.
* **Dry run rejects commands**: your spec has a non‑whitelisted command — keep `## Run (approved)` to `echo|ls|cat|head` only.
* **Aiden UI?** None built yet; we only use CLI. To find any prior UI remnants:

```bash
grep -Rni "8790\|aiden\|manager.cjs\|autoRoute" backend frontend || true
```

---

## Next steps (short)

* ✅ Continue using InfraNodus → `sf specify:infra` for weekly MVP plans.
* ⏳ Bright Data: enable after account ready (wire API key; add eBay scrapers behind allowlist).
* ⏳ Jina: connect API, save results, index.
* 🧭 Optional: minimal UI later (reads `index.json`, lists specs/logs, can trigger `sf` subcommands).

---
cat >> ~/soulfield/workspace/docs/STATUS.md <<'MD'

## Quick refs I keep forgetting
- Core loop: InfraNodus → `sf specify:infra` → spec → `sf dry` → `sf apply --apply`.
- Aiden: CLI-only (no UI). Use `sf specify`.
- Handlers: backend/agents/{manager.cjs,handlers/*}. See “Agent manager quick tests”.

## Commands I actually run each time
sf research "<topic>"; sf specify; sf index; sf dry; sf apply --apply

## Ports & health (only if the old app UI is running)
ss -ltnp | grep -E '8790|8791'
curl -s -o /dev/null -w '%{http_code}\n' http://127.0.0.1:8790/health
MD

