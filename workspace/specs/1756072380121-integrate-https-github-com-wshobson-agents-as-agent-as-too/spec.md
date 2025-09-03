# spec.md

## Intent
Build a UK-compliant agent orchestration platform that wraps GitHub agents as modular tools, enabling developers to deploy autonomous agents via CLI with TruthLens verification and zone-aware processing.

## Acceptance Criteria
1. **Single agent from wshobson/agents repository successfully wrapped and callable via API**
2. **CLI deploys agent with: `agents deploy <name> --zone=uk`**
3. **All agent I/O validated through TruthLens with <100ms overhead**
4. **UK-zone requests processed with <500ms latency (p95)**
5. **Audit log captures: agent_id, zone, input_hash, output_hash, truthlens_score**

## Thin-Slice MVP
**User Story**: As a UK developer, I can deploy a single text-processing agent via CLI that validates outputs through TruthLens before returning results.

**Core Flow**:
1. Developer runs: `agents deploy text-processor --zone=uk`
2. System wraps agent in TruthLens validator
3. Developer calls: `curl -X POST /api/agents/text-processor -d '{"text":"..."}'`
4. Response includes: `{"result":"...", "truthlens_score":0.95, "zone":"uk"}`

## Tasks (≤12)

### Day 1-2: Foundation
1. **Clone wshobson/agents** and extract simplest text-processing agent
2. **Create AgentAdapter base class** in `backend/adapters/agents/adapter.py`
3. **Implement TruthLens validator** wrapper with pass-through for MVP
4. **Setup UK zone config** in `config/zones.yaml`

### Day 3-4: Integration
5. **Build agent registry** in `backend/adapters/agents/registry.py`
6. **Create REST endpoint** `/api/agents/{agent_name}` for agent execution
7. **Implement audit logger** writing to `logs/agents/audit.jsonl`
8. **Add zone-aware routing** with UK-first processing

### Day 5-6: CLI & Testing
9. **Build CLI command** `agents deploy` using Click framework
10. **Create health check endpoint** `/api/agents/{agent_name}/health`
11. **Write integration test** for complete flow (deploy → call → verify)
12. **Package as Docker container** with UK region environment variables

## Week-1 Metrics

### Primary KPIs
- **Deployment Success Rate**: Target >90% successful agent deployments
- **API Latency (UK)**: p50 <200ms, p95 <500ms, p99 <1s
- **TruthLens Score**: Average >0.85 across all processed requests

### Secondary Metrics
- **Daily Active Agents**: Track unique agent executions
- **Error Rate**: <5% failed requests (excluding validation failures)
- **Audit Coverage**: 100% of requests logged with required fields

### Instrumentation
```python
# Required metrics collection
{
    "timestamp": "ISO-8601",
    "agent_id": "text-processor",
    "zone": "uk",
    "latency_ms": 234,
    "truthlens_score": 0.92,
    "status": "success|failed|rejected",
    "request_id": "uuid"
}
```

## TruthLens Constraints
- **Input Validation**: Max 10KB payload, UTF-8 only, no PII without consent flag
- **Output Sanitisation**: Strip any detected falsehoods (score <0.7)
- **Audit Requirements**: Immutable logs, 90-day retention, GDPR-compliant fields
- **Zone Compliance**: UK data never leaves UK infrastructure, encrypted at rest

## File Structure
```
backend/
├── adapters/
│   └── agents/
│       ├── __init__.py
│       ├── adapter.py      # Base adapter class
│       ├── registry.py     # Agent registry
│       └── validators.py   # TruthLens integration
├── api/
│   └── agents.py           # REST endpoints
cli/
└── agents.py               # CLI commands
config/
└── zones.yaml              # Zone configuration
logs/
└── agents/
    └── audit.jsonl         # Audit trail
```

## Definition of Done
- [ ] Text-processor agent responds to API calls
- [ ] CLI successfully deploys agent to UK zone
- [ ] TruthLens validates all responses
- [ ] Audit log contains all required fields
- [ ] Docker container runs with `docker-compose up`
- [ ] README includes quickstart guide

## Run (approved)
echo "[spec] sanity checks"
ls -alh /home/michael/soulfield/workspace/specs
echo "[policy] show TruthLens rules"
head -n 20 /home/michael/soulfield/workspace/knowledge/TruthLens.md
echo "[index] first 10 lines"
head -n 10 /home/michael/soulfield/workspace/data/index.json

