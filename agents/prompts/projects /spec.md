# Spec: Soulfield OS — Projects Domain (Scaffold)

## SRD — Scope & Outcomes

Goal: introduce a minimal, file-based **Projects** store to act as the hub for Sessions/Agents later.  
No backend code changes yet; just structure, seed data, and usage docs that we can evolve.

Success:
- A canonical projects root at `~/soulfield/projects`.
- Human-readable data files (JSON) with light metadata.
- Ready-to-use templates + README with next steps.
- Safe to re-run (idempotent).

Constraints:
- Local-first only.
- Use Agent OS `!coder-apply` with the command whitelist (no pipes; only `echo`, `ls`, `cat`, `head`, `mkdir`, `touch`, `printf`).

Data model v0:
- Project: `{ id, name, description, status, createdAt, updatedAt, tags[], sessions[], agents[] }`
- Store file: `projects.json` (array of Project), plus 1-file-per-project under `projects/records/<id>.json` for future deltas.

Directory plan:
~/soulfield/projects/
README.md
projects.json # canonical list
records/
<id>.json # single-project record (mirrors canonical)
templates/
project.template.json
prompts/
create-project.prompt.txt
list-projects.prompt.txt

swift
Copy code

---

## Run (approved)

# 0) Folders
mkdir -p /home/michael/soulfield/projects
mkdir -p /home/michael/soulfield/projects/records
mkdir -p /home/michael/soulfield/projects/templates
mkdir -p /home/michael/soulfield/projects/prompts

# 1) README
printf '%s\n' \
'# Soulfield Projects (v0)' \
'' \
'Local-first project registry used by Aiden (via TruthLens) and the GUI.' \
'' \
'## Files' \
'- `projects.json` — canonical list of projects' \
'- `records/<id>.json` — single-project mirror; append-only-friendly later' \
'- `templates/project.template.json` — suggested new-project skeleton' \
'' \
'## Suggested Next Steps' \
'1. Add a lightweight Projects API to the backend later.' \
'2. Link Sessions to Projects (session files carry `projectId`).' \
'3. Extend GUI to read from `projects.json` (or API).' \
'' \
'## Idempotency' \
'Re-running this spec is safe; existing files will be overwritten with the same schema.' \
> /home/michael/soulfield/projects/README.md

# 2) Template
printf '%s\n' \
'{' \
'  "id": "proj-<yyyyMMddhhmmss>",' \
'  "name": "new-project",' \
'  "description": "short description",' \
'  "status": "active",' \
'  "createdAt": "<ISO8601>",' \
'  "updatedAt": "<ISO8601>",' \
'  "tags": [],' \
'  "sessions": [],' \
'  "agents": []' \
'}' \
> /home/michael/soulfield/projects/templates/project.template.json

# 3) Seed projects.json (canonical)
printf '%s\n' \
'[' \
'  {' \
'    "id": "proj-my-app",' \
'    "name": "my-app",' \
'    "description": "Example application project",' \
'    "status": "active",' \
'    "createdAt": "2025-08-28T12:00:00.000Z",' \
'    "updatedAt": "2025-08-28T12:00:00.000Z",' \
'    "tags": ["example","seed"],' \
'    "sessions": ["sess-my-app-001","sess-my-app-002","sess-my-app-003"],' \
'    "agents": ["aiden"]' \
'  },' \
'  {' \
'    "id": "proj-data-pipeline",' \
'    "name": "data-pipeline",' \
'    "description": "ETL/analytics pipeline exploration",' \
'    "status": "active",' \
'    "createdAt": "2025-08-28T12:10:00.000Z",' \
'    "updatedAt": "2025-08-28T12:10:00.000Z",' \
'    "tags": ["etl","analytics"],' \
'    "sessions": ["sess-etl-001","sess-etl-002","sess-etl-003","sess-etl-004","sess-etl-005","sess-etl-006","sess-etl-007","sess-etl-008"],' \
'    "agents": ["aiden"]' \
'  }' \
']' \
> /home/michael/soulfield/projects/projects.json

# 4) Mirror single-project records (for future deltas/appends)
printf '%s\n' \
'{' \
'  "id": "proj-my-app",' \
'  "name": "my-app",' \
'  "description": "Example application project",' \
'  "status": "active",' \
'  "createdAt": "2025-08-28T12:00:00.000Z",' \
'  "updatedAt": "2025-08-28T12:00:00.000Z",' \
'  "tags": ["example","seed"],' \
'  "sessions": ["sess-my-app-001","sess-my-app-002","sess-my-app-003"],' \
'  "agents": ["aiden"]' \
'}' \
> /home/michael/soulfield/projects/records/proj-my-app.json

printf '%s\n' \
'{' \
'  "id": "proj-data-pipeline",' \
'  "name": "data-pipeline",' \
'  "description": "ETL/analytics pipeline exploration",' \
'  "status": "active",' \
'  "createdAt": "2025-08-28T12:10:00.000Z",' \
'  "updatedAt": "2025-08-28T12:10:00.000Z",' \
'  "tags": ["etl","analytics"],' \
'  "sessions": ["sess-etl-001","sess-etl-002","sess-etl-003","sess-etl-004","sess-etl-005","sess-etl-006","sess-etl-007","sess-etl-008"],' \
'  "agents": ["aiden"]' \
'}' \
> /home/michael/soulfield/projects/records/proj-data-pipeline.json

# 5) Prompt stubs (so you can ask Aiden to mutate data later)
printf '%s\n' \
'You are Aiden operating with TruthLens (structure/no-simulation).' \
'Task: Add a new project to ~/soulfield/projects/projects.json and write its mirror to ~/soulfield/projects/records/<id>.json.' \
'- Use the template fields: {id,name,description,status,createdAt,updatedAt,tags,sessions,agents}.' \
'- Maintain pretty JSON and stable ordering.' \
'- Ensure id uniqness (prefix with proj-).' \
'' \
'INPUT (example):' \
'{ "name":"marketing-site","description":"static site work","tags":["web"],"status":"active" }' \
> /home/michael/soulfield/projects/prompts/create-project.prompt.txt

printf '%s\n' \
'You are Aiden operating with TruthLens.' \
'Task: Read and summarize projects from ~/soulfield/projects/projects.json as a concise table.' \
'Include id, name, status, #sessions, updatedAt.' \
> /home/michael/soulfield/projects/prompts/list-projects.prompt.txt

# 6) Quick view helpers (optional)
head -n 20 /home/michael/soulfield/projects/README.md
head -n 50 /home/michael/soulfield/projects/projects.json
ls -la /home/michael/soulfield/projects/records
