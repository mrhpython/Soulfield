# Soulfield OS

A backend‑first agent OS for research → gap analysis → spec → (safe) execution. It exposes a minimal HTTP API, a read‑only MCP filesystem tool, a terminal spec browser, and adapters for Claude (Aiden), Jina rerank, InfraNodus gap analysis, and a policy‑first scraper.

## Features
- API server: `/health`, `/chat` with “!” command router and `@agent` council routing.
- Agents: Aiden (Claude), Jina (semantic rerank), InfraNodus (gap analysis), Scraper (allowlist only).
- Memory: File memory by default; optional Pinecone with OpenAI embeddings.
- Compliance: TruthLens shim wraps outputs; scraper domain allowlist; read‑only MCP filesystem server.
- TUI: Terminal UI to browse/edit specs in `.agent-os/specs/*/spec.md`.
- Safe execution: `!coder-apply` executes only whitelisted commands from approved spec sections.

## Quickstart
- Requirements: Node.js 18+ (20+ recommended). Create `.env` (see below). Do not commit real keys.
- Install: `npm install`
- Start API: `npm start`
  - Health: `curl -s http://127.0.0.1:8790/health`
  - Help: `curl -s -X POST http://127.0.0.1:8790/chat -H 'content-type: application/json' -d '{"prompt":"!help"}'`
  - Aiden: `curl -s -X POST http://127.0.0.1:8790/chat -H 'content-type: application/json' -d '{"prompt":"@aiden: Summarize the workspace goals"}'`
- MCP (read‑only FS): `npm run start:mcp`
  - Tools: GET `http://127.0.0.1:8791/mcp/tools`
  - Call: POST `http://127.0.0.1:8791/mcp/call` `{ "name":"list_dir", "args": {"path":"workspace"} }`
- Spec TUI: `npm run start:tui`
- Spec apply tests: `npm run test:apply` (dry) or `npm run test:apply:run` (execute whitelisted commands)

## Environment
Set in `.env`:
- Claude: `CLAUDE_API_KEY`, `AIDEN_MODEL`
- Jina: `JINA_API_KEY`, `JINA_MODEL`
- Pinecone (optional): `USE_PINECONE=1`, `PINECONE_API_KEY`, `PINECONE_INDEX`
- OpenAI Embeddings (if Pinecone): `OPENAI_API_KEY`
- InfraNodus: `INFRANODUS_API_KEY`, `INFRANODUS_API_BASE`

## Commands (via /chat)
- `!help` – menu
- `!note <text> #tags` / `!recall #tag` – capture/recall
- `!plan-add active|future "Name" #tags` / `!plan-list` – roadmap
- `!golden "desc" #tags` / `!golden-list [#tag] [N]` – golden ideas
- `!session-note "text" #tags` / `!session-list [#tag] [N]` – session timeline
- `!learn <text> #tags` / `!knowledge-list [#tag] [N]` – knowledge
- `!learn-file <relative/path> [#tags]` – ingest file
- `!coder-apply [--spec <id>] [#apply]` – safe execute from latest/given spec

## Paths and Data
- API: `backend/index.cjs`
- Jobs: `backend/jobs.js`
- Council: `backend/council.js`
- Memory (file): `memory.js` → `data/memory.json`
- Memory (Pinecone): `backend/services/memory/memory-pinecone.cjs`
- Scraper: `backend/services/scraper/index.cjs` → `workspace/data/scrapes/*.jsonl`
- Specs: `backend/.agent-os/specs/<id>/spec.md`
- Apply logs: `backend/.agent-os/runs/*.log`
- MCP: `backend/mcp-server.cjs`
- TUI: `backend/tui.js`

## Security & Compliance
- TruthLens wraps outputs (see `backend/truthLens.js` / `truthlens.cjs`).
- Scraper requires domain allowlist (`backend/services/scraper/config/allowlist.yaml`).
- MCP is read‑only and jailed to project root.
- `!coder-apply` whitelists basic commands only (`echo`, `ls`, `cat`, `head`).

## Known Issues / Notes
- Rotate any real API keys in `.env` before sharing.
- InfraNodus client stubs queue requests offline; integrate the real API when keys are set.
- Pinecone path is optional; with `USE_PINECONE!=1`, the system uses file memory.

## License
See repository terms or your organization policy. No license header added by default.

