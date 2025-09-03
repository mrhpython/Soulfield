Contributing to Soulfield

Thanks for helping improve Soulfield! This guide keeps contributions smooth and predictable.

Basics
- Use feature branches from `main`; open PRs early as draft when helpful.
- Keep PRs focused and small; include a clear title and summary.
- Prefer tests or a quick manual validation plan in the PR.

Development
- Node: `npm ci && DEV_NO_API=1 npm start` then hit `GET /health`.
- MCP (read‑only FS): `npm run start:mcp` then `GET /mcp/tools`.
- Python (optional): run `pytest` for FastAPI sanity tests.

Coding Standards
- JS/Node: follow existing patterns; keep changes minimal and explicit.
- Python: prefer pytest for tests; descriptive names; no one‑letter vars.
- Avoid unrelated refactors in the same PR; call them out if necessary.

CI & Checks
- CI runs Node and Python jobs; both must be green.
- New workflows should be minimal and secure by default.

Commit & PR Hygiene
- Conventional style (suggested):
  - feat:, fix:, chore:, docs:, ci:, test:, refactor:
- PR template: fill Summary, Checklist, and Validation steps.

Security
- Never commit secrets. `.env` is ignored; use `.env.example` for docs.
- MCP is read‑only and hardened, but treat it as a potential disclosure surface.
- See SECURITY.md for reporting vulnerabilities.

Release
- Tag `vX.Y.Z` on main to trigger Docker image publish and a GitHub Release.

