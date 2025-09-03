# research.md

## Overview
Integration of GitHub agents repository as modular tools within existing backend architecture, enabling agent-as-tool paradigm with zone-aware orchestration and TruthLens compliance.

## Current Repository Analysis
- **wshobson/agents**: Appears to be a multi-agent framework with task orchestration capabilities
- **Key Components**: Agent definitions, task routing, execution contexts
- **Architecture Pattern**: Microservice-oriented with message passing

## Integration Approaches

### 1. Adapter Pattern Implementation
- Create `backend/adapters/agents/` directory structure
- Implement `AgentAdapter` base class for standardised agent wrapping
- Each external agent becomes a tool via adapter interface
- Maintain loose coupling with main system

### 2. Tool Registry System
- Extend `tools/` with agent registration mechanism
- Dynamic agent discovery and loading
- Metadata-driven capability mapping
- Version control for agent specifications

### 3. Manager Agent Architecture
- Central orchestrator in `backend/adapters/agents/manager.py`
- Handles agent lifecycle, routing, and zone compliance
- Implements circuit breaker pattern for resilience
- TruthLens validation at boundaries

## Concrete Integration Ideas

### CLI Integration
```bash
# Agent management commands
agents list --zone=uk
agents deploy <agent-name> --config=config.yaml
agents test <agent-name> --input=test.json
agents logs <agent-name> --tail=100
```

### Zone-Aware Implementation
- Geographic routing based on data residency requirements
- UK-first processing with fallback zones
- Latency-based agent selection
- Compliance metadata per zone

### Logging Architecture
```
logs/
├── agents/
│   ├── execution/
│   ├── errors/
│   └── performance/
├── zones/
│   ├── uk/
│   └── global/
└── truthlens/
    └── validations/
```

### TruthLens Integration Points
1. **Input Validation**: Verify agent inputs against TruthLens schemas
2. **Output Sanitisation**: Ensure responses meet truth constraints
3. **Audit Trail**: Complete lineage tracking for compliance
4. **Fact Checking**: Cross-reference agent outputs with verified sources

## Technical Considerations
- Message queue for async agent communication
- Redis for agent state management
- Docker containers for agent isolation
- API gateway for external agent access
- Prometheus metrics for monitoring

---

# keywords.json

```json
[
  {
    "keyword": "agent orchestration platform",
    "intent": "informational",
    "difficulty": "medium",
    "volume_est": "1200"
  },
  {
    "keyword": "multi agent systems UK",
    "intent": "commercial",
    "difficulty": "low",
    "volume_est": "450"
  },
  {
    "keyword": "agent as a service",
    "intent": "transactional",
    "difficulty": "high",
    "volume_est": "3400"
  },
  {
    "keyword": "autonomous agent framework",
    "intent": "informational",
    "difficulty": "medium",
    "volume_est": "890"
  },
  {
    "keyword": "TruthLens integration",
    "intent": "navigational",
    "difficulty": "low",
    "volume_est": "120"
  },
  {
    "keyword": "zone aware computing UK",
    "intent": "informational",
    "difficulty": "low",
    "volume_est": "230"
  },
  {
    "keyword": "agent tool integration",
    "intent": "commercial",
    "difficulty": "medium",
    "volume_est": "670"
  },
  {
    "keyword": "CLI agent management",
    "intent": "informational",
    "difficulty": "medium",
    "volume_est": "540"
  }
]
```

---

# questions.md

## Architecture Questions
- How should agents communicate with the main system?
- What's the optimal way to handle agent versioning?
- Should agents run in containers or separate processes?
- How to implement rollback mechanisms for failed agents?

## Integration Questions
- Which agents from wshobson/agents are priority for integration?
- How to map agent capabilities to existing tools?
- What's the authentication mechanism between agents?
- How to handle agent dependencies and conflicts?

## Compliance Questions
- How does TruthLens validate agent outputs?
- What are UK-specific data processing requirements?
- How to ensure GDPR compliance in agent logs?
- What audit trails are required for agent actions?

## Performance Questions
- What's the expected latency for agent calls?
- How many concurrent agents can the system support?
- What caching strategies work best for agent responses?
- How to implement rate limiting per agent?

## Operational Questions
- What monitoring metrics are essential?
- How to handle agent failures gracefully?
- What's the backup strategy for critical agents?
- How to implement blue-green deployments for agents?

---

# competitors.md

## Direct Competitors

### 1. AutoGPT
- **Strengths**: Large community, extensive plugins
- **Weaknesses**: Complex setup, resource intensive
- **Market Position**: Open-source leader
- **UK Presence**: Limited

### 2. LangChain Agents
- **Strengths**: Python-native, good documentation
- **Weaknesses**: Steep learning curve
- **Market Position**: Developer favourite
- **UK Presence**: Growing adoption

### 3. Microsoft Semantic Kernel
- **Strengths**: Enterprise ready, Azure integration
- **Weaknesses**: Vendor lock-in
- **Market Position**: Enterprise focused
- **UK Presence**: Strong via Azure

## Indirect Competitors

### 4. Zapier AI Actions
- **Strengths**: No-code approach, vast integrations
- **Weaknesses**: Limited customisation
- **Market Position**: SMB focused
- **UK Presence**: Moderate

### 5. n8n with AI nodes
- **Strengths**: Self-hosted option, GDPR friendly
- **Weaknesses**: Smaller ecosystem
- **Market Position**: Privacy-conscious segment
- **UK Presence**: Strong in enterprise

## Differentiation Opportunities
- UK-first data processing guarantee
- TruthLens verification unique selling point
- Zone-aware architecture for compliance
- Superior logging and audit capabilities
- CLI-first developer experience

---

# plan.md

## 7-Day MVP Implementation Plan

### Day 1: Foundation Setup
- [ ] Clone and analyse wshobson/agents repository
- [ ] Create `backend/adapters/agents/` directory structure
- [ ] Implement base `AgentAdapter` class
- [ ] Set up logging infrastructure in `logs/agents/`
- [ ] Document agent interface specifications

### Day 2: Core Integration
- [ ] Develop agent loader/registry system
- [ ] Implement first agent wrapper (simplest from repo)
- [ ] Create agent-to-tool bridge in `tools/`
- [ ] Write unit tests for adapter layer
- [ ] Setup Docker container for agent isolation

### Day 3: Manager Agent
- [ ] Build manager agent orchestrator
- [ ] Implement message queue (Redis/RabbitMQ)
- [ ] Create agent routing logic
- [ ] Add basic health check system
- [ ] Implement circuit breaker pattern

### Day 4: Zone Awareness
- [ ] Add zone configuration system
- [ ] Implement UK-first routing logic
- [ ] Create zone-based logging separation
- [ ] Add latency monitoring per zone
- [ ] Test failover scenarios

### Day 5: TruthLens Integration
- [ ] Integrate TruthLens validation at agent boundaries
- [ ] Add input/output schema validation
- [ ] Implement fact-checking hooks
- [ ] Create audit trail system
- [ ] Add compliance reporting

### Day 6: CLI Development
- [ ] Build CLI commands for agent management
- [ ] Implement agent deployment command
- [ ] Add logging tail functionality
- [ ] Create testing harness via CLI
- [ ] Write CLI documentation

### Day 7: Testing & Documentation
- [ ] End-to-end integration testing
- [ ] Performance benchmarking
- [ ] Security audit of agent boundaries
- [ ] Complete API documentation
- [ ] Create deployment guide

## Success Metrics
- Single agent successfully integrated and callable
- CLI can deploy and manage agents
- Logs properly segregated by zone
- TruthLens validates all agent I/O
- Sub-500ms response time for UK zone
- 100% test coverage for adapter layer