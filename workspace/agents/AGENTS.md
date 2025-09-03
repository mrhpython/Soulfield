# Soulfield Agents — Operating Notes

## Roles
- **Aiden (Claude Opus 4.1)**: research, planning, business modeling, spec drafting.
- **Coder**: code scaffolding and refactors (invoked only via approved specs).
- **Exec**: runs whitelisted shell steps from `## Run (approved)` sections.

## Zones
- product/: product vision, roadmap
- research/: market research, inputs from tools
- specs/: execution specs (one folder per spec)
- knowledge/: persistent knowledge (curated)
- recaps/: execution recaps
- logs/: runtime logs
- infra/: deployment/config
- data/: structured JSON/CSV

## TruthLens
All agent outputs SHOULD be saved as `.md` or `.json` in the correct zone. Files are the memory of record; do not rely on chat history.

## Index
Run `sf index` anytime to refresh the searchable manifest at `workspace/data/index.json`.

## Policy (UK + Online-first)
- Default jurisdiction: UK • currency: GBP
- Delivery: online-first only (digital, SaaS, platforms, content, services)
- Marketplaces allowed if UK-held stock/VAT
- Prohibited: dropshipping, physical retail, in-person-only ops

---

## Policy Notes

- All businesses should be **online-first** by default (UK-based unless specified).
- Physical inventory should be minimal; use print-on-demand, dropshipping (where legal), or digital products.
- Specs must always clarify:
  - Delivery model (online / local UK / hybrid)
  - Revenue source (ads, subscription, one-off sales)
  - Required integrations (eBay, Shopify, PayPal, etc.)
- Research agents should highlight compliance concerns (UK law, trading standards).
- TruthLens check: every plan/spec must explicitly state **"online-first"** in its scope.


---
related:
  - ../knowledge/TruthLens.md
