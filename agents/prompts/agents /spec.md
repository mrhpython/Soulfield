# Spec: Soulfield OS — Agents Store (fixed model)

## SRD — Requirements
- Local-first JSON store for agents.
- Seed two agents (`agent-aiden`, `agent-coder`) with model **claude-opus-4-1-20250805**.
- Mirror each agent into `/records/<id>.json`.
- Provide a reusable template and prompt stubs.
- Only use whitelisted commands (echo, ls, cat, head, mkdir, touch, printf). No pipes/redirect tricks other than `printf >`.

---

## Run (approved)

echo "seed AGENTS files (model=claude-opus-4-1-20250805)"

mkdir -p /home/michael/soulfield/agents
mkdir -p /home/michael/soulfield/agents/prompts
mkdir -p /home/michael/soulfield/agents/templates
mkdir -p /home/michael/soulfield/agents/records

# agents.json (canonical)
printf '%s\n' \
'[' \
'  {' \
'    "id": "agent-aiden",' \
'    "name": "Aiden",' \
'    "role": "orchestrator",' \
'    "status": "active",' \
'    "model": "claude-opus-4-1-20250805",' \
'    "tools": ["truthlens","retrieval"],' \
'    "createdAt": "2025-08-28T00:00:00Z",' \
'    "updatedAt": "2025-08-28T00:00:00Z",' \
'    "prompts": {"system": "Aiden operates via TruthLens. Structure first, no simulation.", "instructions": ""}' \
'  },' \
'  {' \
'    "id": "agent-coder",' \
'    "name": "Coder",' \
'    "role": "implementation",' \
'    "status": "active",' \
'    "model": "claude-opus-4-1-20250805",' \
'    "tools": ["coder","retrieval"],' \
'    "createdAt": "2025-08-28T00:00:00Z",' \
'    "updatedAt": "2025-08-28T00:00:00Z",' \
'    "prompts": {"system": "Coder applies approved specs only. No side effects beyond plan.", "instructions": ""}' \
'  }' \
']' \
> /home/michael/soulfield/agents/agents.json

# records/agent-aiden.json
printf '%s\n' \
'{' \
'  "id": "agent-aiden",' \
'  "name": "Aiden",' \
'  "role": "orchestrator",' \
'  "status": "active",' \
'  "model": "claude-opus-4-1-20250805",' \
'  "tools": ["truthlens","retrieval"],' \
'  "createdAt": "2025-08-28T00:00:00Z",' \
'  "updatedAt": "2025-08-28T00:00:00Z",' \
'  "prompts": {' \
'    "system": "Aiden operates via TruthLens. Structure first, no simulation.",' \
'    "instructions": ""' \
'  }' \
'}' \
> /home/michael/soulfield/agents/records/agent-aiden.json

# records/agent-coder.json
printf '%s\n' \
'{' \
'  "id": "agent-coder",' \
'  "name": "Coder",' \
'  "role": "implementation",' \
'  "status": "active",' \
'  "model": "claude-opus-4-1-20250805",' \
'  "tools": ["coder","retrieval"],' \
'  "createdAt": "2025-08-28T00:00:00Z",' \
'  "updatedAt": "2025-08-28T00:00:00Z",' \
'  "prompts": {' \
'    "system": "Coder applies approved specs only. No side effects beyond plan.",' \
'    "instructions": ""' \
'  }' \
'}' \
> /home/michael/soulfield/agents/records/agent-coder.json

# templates/agent.template.json
printf '%s\n' \
'{' \
'  "id": "agent-__ID__", ' \
'  "name": "__NAME__", ' \
'  "role": "__ROLE__", ' \
'  "status": "__STATUS__", ' \
'  "model": "claude-opus-4-1-20250805", ' \
'  "tools": __TOOLS__, ' \
'  "createdAt": "__CREATED__", ' \
'  "updatedAt": "__UPDATED__", ' \
'  "prompts": { "system": "__SYSTEM__", "instructions": "__INSTRUCTIONS__" }' \
'}' \
> /home/michael/soulfield/agents/templates/agent.template.json

# prompts/create-agent.prompt.txt
printf '%s\n' \
'Task: create a new agent using /home/michael/soulfield/agents/templates/agent.template.json' \
'Rules:' \
'- id must start with agent- and be unique' \
'- model MUST be claude-opus-4-1-20250805' \
'- mirror the record into /home/michael/soulfield/agents/records/<id>.json' \
'- append to /home/michael/soulfield/agents/agents.json (stable, pretty JSON)' \
'INPUT example:' \
'{"name":"Researcher","role":"analysis","status":"active","tools":["retrieval"],"prompts":{"system":"research focus","instructions":""}}' \
> /home/michael/soulfield/agents/prompts/create-agent.prompt.txt

# prompts/list-agents.prompt.txt
printf '%s\n' \
'Task: list agents from /home/michael/soulfield/agents/agents.json as a concise table.' \
'Columns: id, name, role, model, status, updatedAt' \
> /home/michael/soulfield/agents/prompts/list-agents.prompt.txt

# prompts/assign-agent-to-project.prompt.txt
## Run (approved)

# seed agents folders
mkdir -p /home/michael/soulfield/agents
mkdir -p /home/michael/soulfield/agents/records
mkdir -p /home/michael/soulfield/agents/prompts/Agents
mkdir -p /home/michael/soulfield/agents/templates

# write canonical agents.json
printf '%s\n' '[
  {
    "id": "agent-aiden",
    "name": "Aiden",
    "role": "research assistant",
    "model": "claude-opus-4-1-20250805",
    "tools": ["memory","truth-lens","jobs"],
    "status": "active"
  },
  {
    "id": "agent-coder",
    "name": "Coder",
    "role": "code generation",
    "model": "claude-opus-4-1-20250805",
    "tools": ["mcp","fs","exec"],
    "status": "active"
  }
]' > /home/michael/soulfield/agents/agents.json

# mirror individual records
printf '%s\n' '{
  "id": "agent-aiden",
  "name": "Aiden",
  "role": "research assistant",
  "model": "claude-opus-4-1-20250805",
  "tools": ["memory","truth-lens","jobs"],
  "status": "active"
}' > /home/michael/soulfield/agents/records/agent-aiden.json

printf '%s\n' '{
  "id": "agent-coder",
  "name": "Coder",
  "role": "code generation",
  "model": "claude-opus-4-1-20250805",
  "tools": ["mcp","fs","exec"],
  "status": "active"
}' > /home/michael/soulfield/agents/records/agent-coder.json

# write prompts (Agents)
printf '%s\n' "You are Aiden with TruthLens.
Task: Create a new agent record in ~/soulfield/agents/agents.json and mirror to ~/soulfield/agents/records/<id>.json.
INPUT: {id,name,role,model,tools[],status}.
Ensure JSON is pretty and dedup existing agents by id." \
> /home/michael/soulfield/agents/prompts/Agents/create-agent.prompt.txt

printf '%s\n' "You are Aiden with TruthLens.
Task: List all agents in ~/soulfield/agents/agents.json as a concise table.
Output: JSON array with {id, name, role, model, status}." \
> /home/michael/soulfield/agents/prompts/Agents/list-agents.prompt.txt

printf '%s\n' "You are Aiden with TruthLens.
Task: Assign an agent to a project in ~/soulfield/projects/projects.json.
Update project record to include assigned agent id." \
> /home/michael/soulfield/agents/prompts/Agents/assign-agent-to-project.prompt.txt

