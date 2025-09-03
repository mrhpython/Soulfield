# Soulfield OS — Design Intent (Backend-first)

Goal
- Run a repeatable loop: gap (InfraNodus) → research (Aiden) → spec → compliance → execution (coder).

Agents
- Aiden (Claude Opus 4.1): planning/specs, market research.
- InfraNodus: content/market gap, JSON export/import.
- Jina: rerank/semantic search across workspace.
- Scraper: compliant fetch to data/scrapes (allowlist).

Memory
- Pinecone serverless (1536 cosine), methods: ensureIndex, upsertDocs, query, deleteDoc(s).

Filesystem & Zones
- workspace/research, workspace/specs, workspace/data, workspace/docs, workspace/knowledge.
- MCP :8791 read-only tool to expose workspace safely.

Compliance
- TruthLens always wraps outputs.
- Scraper allowlist starts with UK gov; broaden via explicit whitelists and source tags.

Next
- Add “manager → memory” calls for capture/recall (Aiden remembers).
- Finish InfraNodus import wizard (UI later; CLI ok).
- Buttonize flows when backend is fully stable.

