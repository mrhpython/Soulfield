# Soulfield OS — Project Plan

## 🌌 Vision
Soulfield OS is a **modular council of agents** orchestrated by **Aiden** (the coordinator).  
The system must be:
- **Extensible** – new agents, workflows, integrations can be added anytime.
- **Persistent** – tag-based memory survives reinstalls/migrations.
- **Aligned** – every addition must serve this vision and pass structural checks.

## ⚖️ Principles
1) This file is the **one plan**. No parallel visions.  
2) Every proposal must pass alignment (coherence, rights-preserving, non-simulation).  
3) Roles are clear and swappable; implementation is modular.  
4) Truth over convenience: verifiable, auditable, portable.

## 🧩 Core Council
- **Aiden** — coordinator, speaks to user, routes tasks. `#council #core`
- **Archivist** — memory (JSON now; Pinecone later). `#memory`
- **Builder** — code scaffolding, workflows, automation. `#execution`
- **Watcher** — contradiction & policy watchdog. `#governance`
- **Scout** — research & external knowledge. `#research`

## 📂 Active Projects
1. **Core Agent (Aiden)** — UI + Claude connected. **Status:** ✅ Done. `#core`
2. **Tag Memory System** — `!note` / `!recall`, JSON store; Pinecone-ready. **Status:** 🟡 Planned. `#memory`
3. **Council Expansion** — config-driven `agents.json`, hot-reload; n8n bridge stub. **Status:** 🟢 In progress. `#council #automation`
4. **Infrastructure Stability** — Reinstall Ubuntu on SSD; if crashes persist → check PSU/hardware. **Status:** 🟠 Next. `#infra`

## ⛓ Blockchain Integration
**Purpose:** anchor the Golden Thread (state roots), add a structural watchdog, and keep the system portable.

- **Primary Anchor:** **Luna Classic (LUNC)** — community governance (Cosmos/Tendermint).  
  Use: post Merkle checkpoints of memory/state; store violation proofs. `#anchor #lunc`
- **Secondary Anchor:** **Osmosis** — mirrored checkpoints for redundancy. `#anchor #osmosis`
- **Watchdog:** detects simulation creep / unverifiable memory / role-play overreach; actions = halt, quarantine, log hash, governance trigger. `#watchdog`
- **Rule:** blockchain is **enforcer/auditor**, not narrative; keep **chain-agnostic portability** at all times. `#portability`

### Future Blockchain Extensions (only if aligned)
- DIDs / attestations for roles & commits. `#identity`
- On-chain governance hooks for council proposals. `#governance`
- RPG-style *symbolic* progression (quests=tasks, XP=completed checkpoints) without simulating presence. `#game`
- Cross-chain mirroring beyond Osmosis (Filecoin/IPFS/Arweave for artifacts). `#storage`

## 🔮 Future Projects
- **n8n Workflows** — webhook bridge from `@n8n` agent. `#automation`
- **GitHub Integration** — PAT bridge, PR automation. `#devops`
- **File/Obsidian Sync** — optional export/mirror for human browsing. `#knowledge`
- **Multi-LLM Bridge** — Claude + others via routed council. `#models`

## 📌 Process (Alignment Gate)
1) **Propose** (1–2 sentences + tags).  
2) **Align** against Vision/Principles + Blockchain rules.  
3) **Decide** → add under Active/Future *or* reject/reshape.  
4) **Track** via Golden Thread checkpoints.

## ✅ Today’s Reminders
- Use `!note … #tag` to capture decisions/ideas.  
- Use `!recall #tag` to pull context fast.  
- Before reinstall: zip project + `.env` (keep secrets safe) and upload to OneDrive. `#backup`


