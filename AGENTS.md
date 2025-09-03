# Agents Spec (Repo‑specific)

This repository implements an agent system aligned with the OpenAI Agents guidance. For the canonical reference, see:

- https://github.com/openai/agents.md

Because this repo runs offline by default, this document summarizes how Soulfield OS maps to the Agents concepts.

## Roles and Routing
- `@aiden` (Claude): Primary orchestrator; planning, research prompts, spec drafting. Routed via `backend/council.js` to Claude Messages API using the agent’s system prompt.
- `@jina`: Semantic rerank over candidate documents (workspace memory). Adapter in `backend/adapters/jina/`.
- `@infranodus`: Gap analysis (topic + texts). Adapter in `backend/adapters/infranodus/` with offline queue.
- `@scraper`: Policy‑first scraping, restricted by allowlist. Service in `backend/services/scraper/`.

Input addressing follows: `@agent: <text>`. Without a prefix, prompts route to Aiden by default.

## Messages and Context
- System prompts: Each agent can define a system (e.g., Aiden’s system prompt in handlers or via config). Council applies the system prompt when calling the LLM.
- User prompts: `/chat` accepts `{ prompt: string }`.
- TruthLens: All outputs pass through a structuring shim to encourage non‑simulative, structured responses.

## Tools and Safety
- MCP (read‑only filesystem): `backend/mcp-server.cjs` exposes `list_dir` and `read_file` tools under a jailed root. Intended for tool‑use integration.
- Safe executor: `!coder-apply` executes only whitelisted commands from a spec section labeled `## Run (approved)`; no control operators, restricted commands.
- Scraper allowlist: Only domains present in `backend/services/scraper/config/allowlist.yaml` are permissible.

## Memory
- Default: File memory at `data/memory.json` via `memory.js` with `add` and `recall`.
- Vector: Optional Pinecone with OpenAI embeddings (`backend/services/memory/memory-pinecone.cjs`). Controlled with `USE_PINECONE=1` and relevant API keys.
- Jobs shortcuts: `!note`, `!learn`, `!knowledge-list`, `!recall` for quick capture and retrieval.

## Planner and Specs
- Specs live in `backend/.agent-os/specs/<id>/spec.md`.
- Terminal UI (`backend/tui.js`) lists, previews, and opens specs in your `$EDITOR`.
- Execution section: The agent writes commands under `## Run (approved)`; humans review and then use `!coder-apply #apply` to run.

## HTTP API
- `GET /health` → `{ ok, service, model }`.
- `POST /chat` with `{ prompt }`:
  - `!` prefixed: handled by `backend/jobs.js` for plan/notes/knowledge/spec‑apply.
  - `@agent …` or plain text: routed by `backend/council.js` to the chosen agent.

## Environment Variables
See `.env` template. Expected keys include `CLAUDE_API_KEY`, `AIDEN_MODEL`, `JINA_API_KEY`, `USE_PINECONE`, `PINECONE_API_KEY`, `OPENAI_API_KEY`, `INFRANODUS_API_KEY`.

## Extending Agents
1. Add an adapter or handler under `backend/agents/handlers/` or `backend/adapters/<name>/`.
2. Register it for routing (either via `@name:` convention in `council.js` or through a higher‑level manager).
3. Define the system prompt and tool access if needed.
4. Add tests/stubs to keep offline safety intact.

## Notes
- This document is an adaptation; for the latest agent protocol details and best practices, consult the canonical Agents spec linked above.

