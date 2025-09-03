# Spec: Soulfield OS — Sessions Domain (Scaffold)

## SRD — Scope & Outcomes

Goal: introduce a minimal, file-based **Sessions** store linked to Projects.

Success:
- Canonical `sessions.json` registry.
- One-file-per-session under `sessions/records/`.
- Template for new sessions.
- Prompt stubs so Aiden can add/list sessions later.

Constraints:
- Local-first only, file-based.
- Only whitelist commands (`echo`, `ls`, `cat`, `head`, `mkdir`, `touch`, `printf`).
- Re-runnable, idempotent.

Data model v0:
- Session: `{ id, projectId, title, status, createdAt, updatedAt, notes[] }`

Directory plan:
~/soulfield/sessions/
README.md
sessions.json
records/
<id>.json
templates/
session.template.json
prompts/
create-session.prompt.txt
list-sessions.prompt.txt

bash
Copy code

---

## Run (approved)

# 0) Folders
mkdir -p /home/michael/soulfield/sessions
mkdir -p /home/michael/soulfield/sessions/records
mkdir -p /home/michael/soulfield/sessions/templates
mkdir -p /home/michael/soulfield/sessions/prompts

# 1) README
printf '%s\n' \
'# Soulfield Sessions (v0)' \
'' \
'Local-first registry of Sessions linked to Projects.' \
'' \
'## Files' \
'- `sessions.json` — canonical list of sessions' \
'- `records/<id>.json` — one file per session' \
'- `templates/session.template.json` — starting point for new session' \
'' \
'## Next Steps' \
'- Connect GUI Sessions tab to this store' \
'- Link to projects.json by projectId' \
> /home/michael/soulfield/sessions/README.md

# 2) Template
printf '%s\n' \
'{' \
'  "id": "sess-<yyyyMMddhhmmss>",' \
'  "projectId": "proj-<id>",' \
'  "title": "new-session",' \
'  "status": "active",' \
'  "createdAt": "<ISO8601>",' \
'  "updatedAt": "<ISO8601>",' \
'  "notes": []' \
'}' \
> /home/michael/soulfield/sessions/templates/session.template.json

# 3) Seed sessions.json (canonical)
printf '%s\n' \
'[' \
'  {' \
'    "id": "sess-my-app-001",' \
'    "projectId": "proj-my-app",' \
'    "title": "bootstrap core app",' \
'    "status": "complete",' \
'    "createdAt": "2025-08-28T12:00:00.000Z",' \
'    "updatedAt": "2025-08-28T12:20:00.000Z",' \
'    "notes": ["initial scaffolding done"]' \
'  },' \
'  {' \
'    "id": "sess-my-app-002",' \
'    "projectId": "proj-my-app",' \
'    "title": "UI wiring",' \
'    "status": "active",' \
'    "createdAt": "2025-08-28T12:30:00.000Z",' \
'    "updatedAt": "2025-08-28T13:00:00.000Z",' \
'    "notes": []' \
'  },' \
'  {' \
'    "id": "sess-etl-001",' \
'    "projectId": "proj-data-pipeline",' \
'    "title": "explore raw ingestion",' \
'    "status": "active",' \
'    "createdAt": "2025-08-28T12:15:00.000Z",' \
'    "updatedAt": "2025-08-28T12:45:00.000Z",' \
'    "notes": ["testing CSV import"]' \
'  }' \
']' \
> /home/michael/soulfield/sessions/sessions.json

# 4) Mirror single-session records
printf '%s\n' \
'{' \
'  "id": "sess-my-app-001",' \
'  "projectId": "proj-my-app",' \
'  "title": "bootstrap core app",' \
'  "status": "complete",' \
'  "createdAt": "2025-08-28T12:00:00.000Z",' \
'  "updatedAt": "2025-08-28T12:20:00.000Z",' \
'  "notes": ["initial scaffolding done"]' \
'}' \
> /home/michael/soulfield/sessions/records/sess-my-app-001.json

printf '%s\n' \
'{' \
'  "id": "sess-etl-001",' \
'  "projectId": "proj-data-pipeline",' \
'  "title": "explore raw ingestion",' \
'  "status": "active",' \
'  "createdAt": "2025-08-28T12:15:00.000Z",' \
'  "updatedAt": "2025-08-28T12:45:00.000Z",' \
'  "notes": ["testing CSV import"]' \
'}' \
> /home/michael/soulfield/sessions/records/sess-etl-001.json

# 5) Prompt stubs
printf '%s\n' \
'You are Aiden with TruthLens.' \
'Task: Add a new session to ~/soulfield/sessions/sessions.json and write its mirror file under records/.' \
'Fields: {id, projectId, title, status, createdAt, updatedAt, notes}.' \
'- Ensure projectId exists in ~/soulfield/projects/projects.json' \
'- Ensure id uniqueness (prefix sess-)' \
> /home/michael/soulfield/sessions/prompts/create-session.prompt.txt

printf '%s\n' \
'You are Aiden with TruthLens.' \
'Task: List sessions from ~/soulfield/sessions/sessions.json grouped by projectId.' \
'Show id, title, status, updatedAt.' \
> /home/michael/soulfield/sessions/prompts/list-sessions.prompt.txt

# 6) Quick view
head -n 20 /home/michael/soulfield/sessions/README.md
head -n 50 /home/michael/soulfield/sessions/sessions.json
ls -la /home/michael/soulfield/sessions/records
