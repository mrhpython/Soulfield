# Spec: Soulfield OS GUI (Local-first Desktop App)

## SRD — Requirements & Outcomes
### Goal
Provide a local-first Soulfield OS GUI to replace terminal-only interaction.  
Integrates TruthLens + Aiden, supports both `!jobs` (structured commands) and `!ask` (freeform).

### Users
- Single researcher/developer on Ubuntu (local environment).

### Success Criteria
- Browse/run Soulfield commands visually.
- Send `!ask` prompts via GUI and see Aiden replies.
- Review sessions, specs, logs, memory, agents.
- Trigger safe `dry/apply` flows from the GUI.

### Constraints
- Localhost only (`127.0.0.1:8790`), no cloud dependencies.
- Must run alongside existing Soulfield backend without conflict.

---

## Technical Specs

### Architecture & Directory
Single-window layout with left navigation rail (collapsible), status bar, and main content.

soulfield-gui/
├── src/
│ ├── shell/ # App frame + navigation shell
│ │ ├── AppShell
│ │ ├── NavRail
│ │ └── StatusBar
│ ├── tabs/ # Individual feature views
│ │ ├── Projects/ Sessions/ Agents/ Commands/
│ │ ├── Memory/ Specs/ Logs/ Settings/ MCP/
│ ├── services/ # API/state/storage clients
│ │ ├── api/ # HTTP client wrappers to backend
│ │ ├── state/ # app/global state helpers
│ │ └── storage/ # local prefs/cache helpers
│ ├── components/ # Reusable UI parts
│ │ ├── Editor, DataTable, Terminal, TruthLensFlag
│ └── utils/ # Helpers, constants
├── assets/ # Icons, fonts, static resources
└── config/ # Build/runtime config

bash
Copy code

### Views (wireframe intent)
- **Projects**: cards with sessions count + last activity; “+ New”.
- **Sessions**: list, time travel (later), branch checkpoints.
- **Agents**: list + editor for prompts/roles.
- **Commands**: buttons for common `!jobs` and a request/response console.
- **Memory**: search & inspect entries.
- **Specs**: browse `.agent-os/specs/*/spec.md`, open latest.
- **Logs**: tail `.agent-os/runs/*-run.log`.
- **Settings**: local preferences; show TruthLens flag.
- **MCP**: read-only panel for MCP status and tools.

### Backend contract (used by GUI later)
- `GET /health` status badge.
- `POST /chat` — send `!ask` or `!jobs`.
- (Later) thin `/api/*` wrappers for sessions/agents/memory/logs, if needed.

### Non-Functional
- Local-only privacy, no telemetry.
- TruthLens pass/fail indicator visible.
- Errors surfaced in-UI with retry paths.
- Keyboard navigation + accessible contrast.

### Scaffolding Behavior (automated)
- Create per-module `README-TODO.md` with mini-spec template.
- Seed a static **HTML mockup** (`index.html` + `styles.css`) for immediate visual iteration.
- Keep all commands whitelist-safe (no pipes/semicolons; only `echo/ls/cat/head/mkdir/touch/printf` + single `>` redirects).

---

## Tasks (phased)
1) **Scaffold**: folders, TODO docs, static mock.  
2) **MVP**: wire `/health`, Commands tab posting to `/chat`, Specs & Logs viewers.  
3) **Enhance**: session time travel, analytics, MCP panel, memory viz.

### Risks & Mitigations
- Mis-scaffold → idempotent mkdir/touch; safe re-runs.
- Write errors → explicit absolute paths; no redirects to privileged dirs.
- Later UI debt → TODO docs force per-module intent before coding.

---

## Run (approved)
echo "seed README-TODOs and HTML mockup"
printf '%s\n' ':root{--bg:#0f1115;--panel:#161a22;--rail:#0c0f14;--text:#e5e7eb;--muted:#9aa3b2;--green:#34d399;--accent:#4f46e5;--card:#1b2130;--border:#232a38}' \
'*{box-sizing:border-box}html,body{height:100%;margin:0;font-family:Inter,system-ui,Segoe UI,Roboto,Arial}' \
'body{background:var(--bg);color:var(--text)}' \
'.app{display:grid;grid-template-columns:240px 1fr;height:100vh}' \
'.nav{background:var(--rail);padding:16px;border-right:1px solid var(--border)}' \
'.brand{font-weight:700;margin-bottom:12px;letter-spacing:.4px}' \
'.menu{list-style:none;padding:0;margin:8px 0 0 0}' \
'.menu li{padding:10px 12px;border-radius:10px;color:var(--muted);cursor:default}' \
'.menu li.active{background:var(--panel);color:var(--text)}' \
'.content{display:flex;flex-direction:column}' \
'.statusbar{display:flex;gap:10px;align-items:center;padding:12px 16px;border-bottom:1px solid var(--border);background:var(--panel)}' \
'.dot{width:9px;height:9px;border-radius:50%;display:inline-block}' \
'.dot.green{background:var(--green)}' \
'.badge{margin-left:auto;background:#223;padding:6px 10px;border-radius:999px;color:#c7cff9;border:1px solid #334}' \
'.panel{padding:16px}' \
'.panel-head{display:flex;align-items:center;gap:12px;margin-bottom:12px}' \
'.panel-head h1{margin:0;font-size:18px}' \
'.btn{margin-left:auto;background:var(--accent);color:#fff;border:none;border-radius:10px;padding:8px 12px;cursor:default}' \
'.card-list{display:grid;grid-template-columns:repeat(auto-fill,minmax(240px,1fr));gap:12px}' \
'.card{background:var(--card);border:1px solid var(--border);padding:12px;border-radius:16px}' \
'.title{font-weight:600;margin-bottom:6px}' \
'.meta{color:var(--muted);font-size:12px}' \
> /home/michael/soulfield/soulfield-gui/styles.css

# 2.1) App controller (nav, health ping, Commands demo, Sessions mock)
printf '%s\n' \
"'use strict';" \
'const $  = s => document.querySelector(s);' \
'const $$ = s => Array.from(document.querySelectorAll(s));' \
'' \
'async function pingHealth(){' \
'  try{' \
'    const r = await fetch("http://127.0.0.1:8790/health");' \
'    const ok = r.ok; const el = $(".dot");' \
'    if(el) el.style.background = ok ? "var(--green)" : "#666";' \
'  }catch{ const el = $(".dot"); if(el) el.style.background = "#666"; }' \
'}' \
'' \
'async function sendCommand(){' \
'  const ta = $("#cmdInput"); const out = $("#cmdOut");' \
'  if(!ta||!out) return;' \
'  const prompt = ta.value.trim(); if(!prompt) return;' \
'  out.textContent = "…running";' \
'  try{' \
'    const r = await fetch("http://127.0.0.1:8790/chat",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({prompt})});' \
'    const j = await r.json();' \
'    out.textContent = j.output ?? JSON.stringify(j,null,2);' \
'  }catch(e){ out.textContent = "error: "+e; }' \
'}' \
'' \
'function mountProjects(){' \
'  $(".panel").innerHTML = $("#tpl-projects").innerHTML;' \
'}' \
'' \
'function mountCommands(){' \
'  $(".panel").innerHTML = [' \
'    "<div class=\\"panel-head\\"><h1>Commands</h1></div>",' \
'    "<div style=\\"display:flex;gap:8px;align-items:flex-start\\">",' \
'      "<textarea id=\\"cmdInput\\" rows=\\"4\\" style=\\"flex:1;background:var(--panel);color:var(--text);border:1px solid var(--border);border-radius:10px;padding:10px\\" placeholder=\\"Try: !ask In one line, what is Soulfield OS?\\"></textarea>",' \
'      "<button id=\\"sendBtn\\" class=\\"btn\\">Send</button>",' \
'    "</div>",' \
'    "<pre id=\\"cmdOut\\" class=\\"preout\\"></pre>"' \
'  ].join("");' \
'  const b = $("#sendBtn"); if(b) b.onclick = sendCommand;' \
'}' \
'' \
'function mountSessions(){' \
'  // Static mock; will be wired to backend later' \
'  const html = [' \
'    "<div class=\\"panel-head\\"><h1>Sessions</h1></div>",' \
'    "<div class=\\"split\\">",' \
'      "<div class=\\"left\\">",' \
'        "<div class=\\"list\\">",' \
'          "<div class=\\"row active\\"><div class=\\"title\\">Session #12</div><div class=\\"meta\\">Applied • 2h ago</div></div>",' \
'          "<div class=\\"row\\"><div class=\\"title\\">Session #11</div><div class=\\"meta\\">Draft • 6h ago</div></div>",' \
'          "<div class=\\"row\\"><div class=\\"title\\">Session #10</div><div class=\\"meta\\">Failed • 1d ago</div></div>",' \
'        "</div>",' \
'      "</div>",' \
'      "<div class=\\"right\\">",' \
'        "<div class=\\"card\\">",' \
'          "<div class=\\"title\\">Session #12</div>",' \
'          "<div class=\\"meta\\">id: s-12 • tag: #apply • cost: 13¢</div>",' \
'          "<pre class=\\"preout\\">!coder-apply --spec 2025-08-28-soulfield-gui --dry</pre>",' \
'        "</div>",' \
'      "</div>",' \
'    "</div>"' \
'  ].join("");' \
'  $(".panel").innerHTML = html;' \
'}' \
'' \
'function navSetup(){' \
'  const items = $$(".menu li");' \
'  items.forEach(li=>li.onclick=()=>{' \
'    items.forEach(x=>x.classList.remove("active")); li.classList.add("active");' \
'    const name = li.textContent.trim();' \
'    if(name==="Projects")  return mountProjects();' \
'    if(name==="Commands")  return mountCommands();' \
'    if(name==="Sessions")  return mountSessions();' \
'    $(".panel").innerHTML = "<div class=\\"panel-head\\"><h1>"+name+"</h1></div><div class=\\"meta\\">Placeholder</div>";' \
'  });' \
'}' \
'' \
'window.addEventListener("DOMContentLoaded",()=>{' \
'  pingHealth(); setInterval(pingHealth,4000);' \
'  navSetup();' \
'});' \
> /home/michael/soulfield/soulfield-gui/app.js

# 2.2) Update HTML with named templates + script tag
printf '%s\n' \
'<!doctype html>' \
'<html lang="en">' \
'<head>' \
'  <meta charset="utf-8" />' \
'  <meta name="viewport" content="width=device-width,initial-scale=1" />' \
'  <title>Soulfield OS GUI — Mock</title>' \
'  <link rel="stylesheet" href="styles.css" />' \
'</head>' \
'<body>' \
'  <div class="app">' \
'    <aside class="nav">' \
'      <div class="brand">Soulfield OS</div>' \
'      <ul class="menu">' \
'        <li class="active">Projects</li>' \
'        <li>Sessions</li>' \
'        <li>Agents</li>' \
'        <li>Commands</li>' \
'        <li>Memory</li>' \
'        <li>Specs</li>' \
'        <li>Logs</li>' \
'        <li>Settings</li>' \
'        <li>MCP</li>' \
'      </ul>' \
'    </aside>' \
'    <main class="content">' \
'      <header class="statusbar">' \
'        <span class="dot green"></span> Connected: 8790' \
'        <span class="badge">TruthLens: Active</span>' \
'      </header>' \
'      <section class="panel">' \
'        <template id="tpl-projects">' \
'          <div class="panel-head"><h1>Projects</h1><button class="btn">+ New</button></div>' \
'          <div class="card-list">' \
'            <div class="card"><div class="title">my-app</div><div class="meta">3 sessions · last: 2h ago</div></div>' \
'            <div class="card"><div class="title">data-pipeline</div><div class="meta">8 sessions · last: 10m ago</div></div>' \
'          </div>' \
'        </template>' \
'        <div class="panel-head"><h1>Projects</h1><button class="btn">+ New</button></div>' \
'        <div class="card-list">' \
'          <div class="card"><div class="title">my-app</div><div class="meta">3 sessions · last: 2h ago</div></div>' \
'          <div class="card"><div class="title">data-pipeline</div><div class="meta">8 sessions · last: 10m ago</div></div>' \
'        </div>' \
'      </section>' \
'    </main>' \
'  </div>' \
'  <script src="app.js"></script>' \
'</body>' \
'</html>' \
> /home/michael/soulfield/soulfield-gui/index.html

# 2.3) Append CSS helpers (Sessions split + list + preout)
printf '%s\n' \
'.split{display:grid;grid-template-columns:360px 1fr;gap:12px}' \
'.left{}.right{}' \
'.list{background:var(--card);border:1px solid var(--border);border-radius:12px;overflow:hidden}' \
'.row{padding:12px;border-bottom:1px solid var(--border);cursor:default}' \
'.row:last-child{border-bottom:none}' \
'.row.active{background:rgba(255,255,255,0.04)}' \
'.row .title{font-weight:600}' \
'.preout{background:var(--card);border:1px solid var(--border);padding:12px;border-radius:12px;margin-top:12px;white-space:pre-wrap}' \
>> /home/michael/soulfield/soulfield-gui/styles.css


# 2.1) Minimal JS app (health ping + commands POST)
printf '%s\n' \
"'use strict';" \
'const $ = s => document.querySelector(s);' \
'async function pingHealth(){' \
'  try{' \
'    const r = await fetch("http://127.0.0.1:8790/health");' \
'    const ok = r.ok; const el = $(".dot");' \
'    if(el) el.style.background = ok ? "var(--green)" : "#666";' \
'  }catch{ const el = $(".dot"); if(el) el.style.background = "#666"; }' \
'}' \
'async function sendCommand(){' \
'  const ta = document.getElementById("cmdInput");' \
'  const out = document.getElementById("cmdOut");' \
'  if(!ta||!out) return;' \
'  const prompt = ta.value.trim(); if(!prompt) return;' \
'  out.textContent = "…running";' \
'  try{' \
'    const r = await fetch("http://127.0.0.1:8790/chat",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({prompt})});' \
'    const j = await r.json();' \
'    out.textContent = j.output ?? JSON.stringify(j);' \
'  }catch(e){ out.textContent = "error: "+e; }' \
'}' \
'function mountCommandsDemo(){' \
'  const host = document.getElementById("commands-demo");' \
'  if(!host) return;' \
'  host.innerHTML = [' \
'    "<h2>Commands</h2>",' \
'    "<div style=\\"display:flex;gap:8px;align-items:flex-start\\">",' \
'      "<textarea id=\\"cmdInput\\" rows=\\"4\\" style=\\"flex:1;background:var(--panel);color:var(--text);border:1px solid var(--border);border-radius:10px;padding:10px\\" placeholder=\\"Try: !ask In one line, what is Soulfield OS?\\"></textarea>",' \
'      "<button id=\\"sendBtn\\" class=\\"btn\\">Send</button>",' \
'    "</div>",' \
'    "<pre id=\\"cmdOut\\" style=\\"background:var(--card);border:1px solid var(--border);padding:12px;border-radius:12px;margin-top:12px;white-space:pre-wrap\\"></pre>"' \
'  ].join("");' \
'  const b = document.getElementById("sendBtn"); if(b) b.onclick = sendCommand;' \
'}' \
'function navSetup(){' \
'  const items = document.querySelectorAll(".menu li");' \
'  items.forEach(li=>li.onclick=()=>{' \
'    items.forEach(x=>x.classList.remove("active")); li.classList.add("active");' \
'    const panel = document.querySelector(".panel");' \
'    if(!panel) return;' \
'    const name = li.textContent.trim();' \
'    if(name==="Commands"){ panel.innerHTML = "<div id=\\"commands-demo\\"></div>"; mountCommandsDemo(); }' \
'    if(name==="Projects"){ panel.innerHTML = document.getElementById("projects-template").innerHTML; }' \
'  });' \
'}' \
'window.addEventListener("DOMContentLoaded",()=>{ pingHealth(); setInterval(pingHealth,4000); navSetup(); });' \
> /home/michael/soulfield/soulfield-gui/app.js

# 2.2) Inject a hidden Projects template + script tag
# (Rewrites index.html safely with an extra template + <script src="app.js">)
printf '%s\n' \
'<!doctype html>' \
'<html lang="en">' \
'<head>' \
'  <meta charset="utf-8" />' \
'  <meta name="viewport" content="width=device-width,initial-scale=1" />' \
'  <title>Soulfield OS GUI — Mock</title>' \
'  <link rel="stylesheet" href="styles.css" />' \
'</head>' \
'<body>' \
'  <div class="app">' \
'    <aside class="nav">' \
'      <div class="brand">Soulfield OS</div>' \
'      <ul class="menu">' \
'        <li class="active">Projects</li>' \
'        <li>Sessions</li>' \
'        <li>Agents</li>' \
'        <li>Commands</li>' \
'        <li>Memory</li>' \
'        <li>Specs</li>' \
'        <li>Logs</li>' \
'        <li>Settings</li>' \
'        <li>MCP</li>' \
'      </ul>' \
'    </aside>' \
'    <main class="content">' \
'      <header class="statusbar">' \
'        <span class="dot green"></span> Connected: 8790' \
'        <span class="badge">TruthLens: Active</span>' \
'      </header>' \
'      <section class="panel">' \
'        <div id="projects-template" style="display:none">' \
'          <div class="panel-head">' \
'            <h1>Projects</h1>' \
'            <button class="btn">+ New</button>' \
'          </div>' \
'          <div class="card-list">' \
'            <div class="card"><div class="title">my-app</div><div class="meta">3 sessions · last: 2h ago</div></div>' \
'            <div class="card"><div class="title">data-pipeline</div><div class="meta">8 sessions · last: 10m ago</div></div>' \
'          </div>' \
'        </div>' \
'        <div class="panel-head"><h1>Projects</h1><button class="btn">+ New</button></div>' \
'        <div class="card-list">' \
'          <div class="card"><div class="title">my-app</div><div class="meta">3 sessions · last: 2h ago</div></div>' \
'          <div class="card"><div class="title">data-pipeline</div><div class="meta">8 sessions · last: 10m ago</div></div>' \
'        </div>' \
'      </section>' \
'    </main>' \
'  </div>' \
'  <script src="app.js"></script>' \
'</body>' \
'</html>' \
> /home/michael/soulfield/soulfield-gui/index.html


# 1) README-TODOs (mini-spec template) — explicit (no loops, no pipes)
mkdir -p /home/michael/soulfield/soulfield-gui/src/{shell,tabs,services,components,utils}
mkdir -p /home/michael/soulfield/soulfield-gui/src/services/{api,state,storage}
mkdir -p /home/michael/soulfield/soulfield-gui/src/tabs/{Projects,Sessions,Agents,Commands,Memory,Specs,Logs,Settings,MCP}

printf '%s\n' '# Module Mini-Spec' '**Name:** shell' '**Purpose:** ' '**Users:** ' '**Success Criteria:** ' '' '## TODOs' '- [ ] define responsibilities' '- [ ] plan UI elements' '- [ ] link to backend routes (if needed)' '- [ ] write first draft spec' > /home/michael/soulfield/soulfield-gui/src/shell/README-TODO.md
printf '%s\n' '# Module Mini-Spec' '**Name:** components' '**Purpose:** ' '**Users:** ' '**Success Criteria:** ' '' '## TODOs' '- [ ] define responsibilities' '- [ ] plan UI elements' '- [ ] link to backend routes (if needed)' '- [ ] write first draft spec' > /home/michael/soulfield/soulfield-gui/src/components/README-TODO.md
printf '%s\n' '# Module Mini-Spec' '**Name:** services/api' '**Purpose:** ' '**Users:** ' '**Success Criteria:** ' '' '## TODOs' '- [ ] endpoints map' '- [ ] error handling' '- [ ] auth/local config' '- [ ] tests' > /home/michael/soulfield/soulfield-gui/src/services/api/README-TODO.md
printf '%s\n' '# Module Mini-Spec' '**Name:** services/state' '**Purpose:** ' '**Users:** ' '**Success Criteria:** ' '' '## TODOs' '- [ ] atoms/selectors' '- [ ] persistence' '- [ ] error boundaries' '- [ ] tests' > /home/michael/soulfield/soulfield-gui/src/services/state/README-TODO.md
printf '%s\n' '# Module Mini-Spec' '**Name:** services/storage' '**Purpose:** ' '**Users:** ' '**Success Criteria:** ' '' '## TODOs' '- [ ] keys/paths' '- [ ] migration' '- [ ] export/import' '- [ ] tests' > /home/michael/soulfield/soulfield-gui/src/services/storage/README-TODO.md
printf '%s\n' '# Module Mini-Spec' '**Name:** utils' '**Purpose:** ' '**Users:** ' '**Success Criteria:** ' '' '## TODOs' '- [ ] constants' '- [ ] helpers' '- [ ] formatting' '- [ ] tests' > /home/michael/soulfield/soulfield-gui/src/utils/README-TODO.md
printf '%s\n' '# Module Mini-Spec' '**Name:** Projects' '**Purpose:** ' '**Users:** ' '**Success Criteria:** ' '' '## TODOs' '- [ ] list projects' '- [ ] open/create' '- [ ] statuses' '- [ ] tests' > /home/michael/soulfield/soulfield-gui/src/tabs/Projects/README-TODO.md
printf '%s\n' '# Module Mini-Spec' '**Name:** Sessions' '**Purpose:** ' '**Users:** ' '**Success Criteria:** ' '' '## TODOs' '- [ ] history list' '- [ ] time travel' '- [ ] branch' '- [ ] tests' > /home/michael/soulfield/soulfield-gui/src/tabs/Sessions/README-TODO.md
printf '%s\n' '# Module Mini-Spec' '**Name:** Agents' '**Purpose:** ' '**Users:** ' '**Success Criteria:** ' '' '## TODOs' '- [ ] list/edit agents' '- [ ] prompt editor' '- [ ] save/validate' '- [ ] tests' > /home/michael/soulfield/soulfield-gui/src/tabs/Agents/README-TODO.md
printf '%s\n' '# Module Mini-Spec' '**Name:** Commands' '**Purpose:** ' '**Users:** ' '**Success Criteria:** ' '' '## TODOs' '- [ ] presets' '- [ ] console I/O' '- [ ] result view' '- [ ] tests' > /home/michael/soulfield/soulfield-gui/src/tabs/Commands/README-TODO.md
printf '%s\n' '# Module Mini-Spec' '**Name:** Memory' '**Purpose:** ' '**Users:** ' '**Success Criteria:** ' '' '## TODOs' '- [ ] search/filter' '- [ ] item view' '- [ ] enrich' '- [ ] tests' > /home/michael/soulfield/soulfield-gui/src/tabs/Memory/README-TODO.md
printf '%s\n' '# Module Mini-Spec' '**Name:** Specs' '**Purpose:** ' '**Users:** ' '**Success Criteria:** ' '' '## TODOs' '- [ ] list/open spec.md' '- [ ] edit guard' '- [ ] dry/apply' '- [ ] tests' > /home/michael/soulfield/soulfield-gui/src/tabs/Specs/README-TODO.md
printf '%s\n' '# Module Mini-Spec' '**Name:** Logs' '**Purpose:** ' '**Users:** ' '**Success Criteria:** ' '' '## TODOs' '- [ ] tail runs' '- [ ] filter' '- [ ] export' '- [ ] tests' > /home/michael/soulfield/soulfield-gui/src/tabs/Logs/README-TODO.md
printf '%s\n' '# Module Mini-Spec' '**Name:** Settings' '**Purpose:** ' '**Users:** ' '**Success Criteria:** ' '' '## TODOs' '- [ ] local prefs' '- [ ] TruthLens flag' '- [ ] paths' '- [ ] tests' > /home/michael/soulfield/soulfield-gui/src/tabs/Settings/README-TODO.md
printf '%s\n' '# Module Mini-Spec' '**Name:** MCP' '**Purpose:** ' '**Users:** ' '**Success Criteria:** ' '' '## TODOs' '- [ ] status view' '- [ ] tools list' '- [ ] errors' '- [ ] tests' > /home/michael/soulfield/soulfield-gui/src/tabs/MCP/README-TODO.md

# 2) Static HTML mockup (status bar + nav rail + cards)
printf '%s\n' '<!doctype html>' '<html lang="en">' '<head>' '  <meta charset="utf-8" />' '  <meta name="viewport" content="width=device-width,initial-scale=1" />' '  <title>Soulfield OS GUI — Mock</title>' '  <link rel="stylesheet" href="styles.css" />' '</head>' '<body>' '  <div class="app">' '    <aside class="nav">' '      <div class="brand">Soulfield OS</div>' '      <ul class="menu">' '        <li class="active">Projects</li>' '        <li>Sessions</li>' '        <li>Agents</li>' '        <li>Commands</li>' '        <li>Memory</li>' '        <li>Specs</li>' '        <li>Logs</li>' '        <li>Settings</li>' '        <li>MCP</li>' '      </ul>' '    </aside>' '    <main class="content">' '      <header class="statusbar">' '        <span class="dot green"></span> Connected: 8790' '        <span class="badge">TruthLens: Active</span>' '      </header>' '      <section class="panel">' '        <div class="panel-head">' '          <h1>Projects</h1>' '          <button class="btn">+ New</button>' '        </div>' '        <div class="card-list">' '          <div class="card"><div class="title">my-app</div><div class="meta">3 sessions · last: 2h ago</div></div>' '          <div class="card"><div class="title">data-pipeline</div><div class="meta">8 sessions · last: 10m ago</div></div>' '        </div>' '      </section>' '    </main>' '  </div>' '</body>' '</html>' > /home/michael/soulfield/soulfield-gui/index.html

printf '%s\n' ':root{--bg:#0f1115;--panel:#161a22;--rail:#0c0f14;--text:#e5e7eb;--muted:#9aa3b2;--green:#34d399;--accent:#4f46e5;--card:#1b2130;--border:#232a38}' '*{box-sizing:border-box}html,body{height:100%;margin:0;font-family:Inter,system-ui,Segoe UI,Roboto,Arial}' 'body{background:var(--bg);color:var(--text)}' '.app{display:grid;grid-template-columns:240px 1fr;height:100vh}' '.nav{background:var(--rail);padding:16px;border-right:1px solid var(--border)}' '.brand{font-weight:700;margin-bottom:12px;letter-spacing:.4px}' '.menu{list-style:none;padding:0;margin:8px 0 0 0}' '.menu li{padding:10px 12px;border-radius:10px;color:var(--muted);cursor:default}' '.menu li.active{background:var(--panel);color:var(--text)}' '.content{display:flex;flex-direction:column}' '.statusbar{display:flex;gap:10px;align-items:center;padding:12px 16px;border-bottom:1px solid var(--border);background:var(--panel)}' '.dot{width:9px;height:9px;border-radius:50%;display:inline-block}' '.dot.green{background:var(--green)}' '.badge{margin-left:auto;background:#223;padding:6px 10px;border-radius:999px;color:#c7cff9;border:1px solid #334}' '.panel{padding:16px}' '.panel-head{display:flex;align-items:center;gap:12px;margin-bottom:12px}' '.panel-head h1{margin:0;font-size:18px}' '.btn{margin-left:auto;background:var(--accent);color:#fff;border:none;border-radius:10px;padding:8px 12px;cursor:default}' '.card-list{display:grid;grid-template-columns:repeat(auto-fill,minmax(240px,1fr));gap:12px}' '.card{background:var(--card);border:1px solid var(--border);padding:12px;border-radius:16px}' '.title{font-weight:600;margin-bottom:6px}' '.meta{color:var(--muted);font-size:12px}' > /home/michael/soulfield/soulfield-gui/styles.css

# 3) Quick sanity checks (no pipes)
ls -la /home/michael/soulfield/soulfield-gui
head -n 12 /home/michael/soulfield/soulfield-gui/index.html
head -n 8 /home/michael/soulfield/soulfield-gui/styles.css
