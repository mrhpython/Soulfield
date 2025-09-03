# research.md

## Overview
InfraNodus is a text network analysis tool that visualises content as knowledge graphs to identify structural gaps, topical clusters, and semantic relationships. Integration with TruthLens would enable automated content gap discovery and strategic content planning through network-based text analysis.

## Core Approaches

### 1. API Integration Architecture
- RESTful API endpoints for text submission and analysis retrieval
- Webhook support for asynchronous processing of large content sets
- Rate-limited batch processing for content audits

### 2. Content Gap Analysis Methods
- **Structural Gaps**: Identify disconnected topic clusters in existing content
- **Topical Bridges**: Find linking concepts between isolated content areas
- **Semantic Density**: Measure topic coverage depth vs breadth
- **Discourse Evolution**: Track topic development over time

### 3. Data Processing Pipeline
```
Content Input → Text Preprocessing → Graph Generation → 
Gap Detection → Insight Extraction → TruthLens Integration
```

## Concrete Integration Ideas

### Content Strategy Module
- Automated weekly content gap reports
- Real-time competitor content monitoring
- Topic cluster visualisation dashboard
- Content opportunity scoring based on gap significance

### Technical Implementation
- Node.js adapter in `backend/adapters/infranodus/`
- JSON schema for gap analysis results
- Caching layer for processed graphs
- Queue system for bulk content analysis

### User Features
- Visual gap explorer with interactive graphs
- Automated content brief generation from gaps
- Gap-to-keyword mapping for SEO alignment
- Progress tracking for gap closure campaigns

## Data Structure
```json
{
  "analysis_id": "uuid",
  "content_gaps": [
    {
      "gap_type": "structural|topical|semantic",
      "keywords": ["term1", "term2"],
      "significance": 0.85,
      "suggested_topics": [],
      "competitor_coverage": {}
    }
  ],
  "graph_metrics": {
    "modularity": 0.42,
    "betweenness": {},
    "clusters": []
  }
}
```

# keywords.json

```json
[
  {
    "keyword": "content gap analysis",
    "intent": "informational",
    "difficulty": 45,
    "volume_est": 2400
  },
  {
    "keyword": "text network analysis tools",
    "intent": "commercial",
    "difficulty": 38,
    "volume_est": 890
  },
  {
    "keyword": "knowledge graph content strategy",
    "intent": "informational",
    "difficulty": 42,
    "volume_est": 320
  },
  {
    "keyword": "semantic gap detection",
    "intent": "informational",
    "difficulty": 35,
    "volume_est": 140
  },
  {
    "keyword": "automated content audit",
    "intent": "commercial",
    "difficulty": 48,
    "volume_est": 1100
  },
  {
    "keyword": "topic cluster visualisation",
    "intent": "navigational",
    "difficulty": 40,
    "volume_est": 560
  },
  {
    "keyword": "content opportunity analysis",
    "intent": "commercial",
    "difficulty": 44,
    "volume_est": 780
  },
  {
    "keyword": "competitive content gaps",
    "intent": "informational",
    "difficulty": 41,
    "volume_est": 450
  }
]
```

# questions.md

## Technical Integration
- How does InfraNodus API authentication work?
- What are the rate limits for text analysis requests?
- Can we process multiple documents simultaneously?
- How to handle large content repositories efficiently?

## Content Strategy
- What defines a significant content gap?
- How to prioritise gaps for content creation?
- Which gap types drive most organic traffic?
- How often should gap analysis run?

## User Experience
- How to visualise complex knowledge graphs simply?
- What insights are most actionable for content teams?
- Should gap detection be automated or triggered?
- How to present gaps to non-technical users?

## Data & Analytics
- What metrics best indicate gap importance?
- How to track gap closure effectiveness?
- Which graph algorithms suit content analysis?
- How to correlate gaps with search performance?

## Commercial Considerations
- What's the cost per analysis via InfraNodus?
- How to price this feature for TruthLens users?
- What tier should include gap analysis?
- ROI metrics for content gap closure?

# competitors.md

## Direct Competitors

### MarketMuse
- **Strength**: Established content intelligence platform
- **Weakness**: High price point, complex interface
- **Gap Analysis**: AI-driven but less visual
- **Pricing**: £500+ monthly

### Clearscope
- **Strength**: Strong SEO integration
- **Weakness**: Limited network analysis
- **Gap Analysis**: Keyword-focused, not structural
- **Pricing**: £170+ monthly

### ContentKing
- **Strength**: Real-time monitoring
- **Weakness**: No graph-based analysis
- **Gap Analysis**: Basic topic coverage
- **Pricing**: £200+ monthly

## Indirect Competitors

### SEMrush Content Audit
- Basic gap identification
- No network visualisation
- Part of larger suite

### Ahrefs Content Gap Tool
- Keyword-focused gaps
- Competitor comparison
- No semantic analysis

## Differentiation Opportunity
- First to combine network analysis with content strategy
- Visual, intuitive gap discovery
- Automated brief generation from gaps
- UK market focus with local search integration

# plan.md

# 7-Day MVP Plan

## Day 1: Infrastructure Setup
- [ ] Create `backend/adapters/infranodus/` directory structure
- [ ] Set up InfraNodus API client with authentication
- [ ] Define JSON schemas in `data/infranodus/`
- [ ] Configure environment variables and secrets

## Day 2: Core Integration
- [ ] Implement text submission endpoint
- [ ] Build analysis retrieval service
- [ ] Create error handling and retry logic
- [ ] Set up Redis caching for results

## Day 3: Data Processing
- [ ] Build gap extraction algorithms
- [ ] Create insight generation module
- [ ] Implement data transformation pipeline
- [ ] Design storage schema for gap history

## Day 4: API Development
- [ ] Create REST endpoints for gap analysis
- [ ] Implement webhook receivers
- [ ] Build rate limiting middleware
- [ ] Add authentication layer

## Day 5: Frontend Components
- [ ] Build gap visualisation component
- [ ] Create gap listing interface
- [ ] Implement filtering and sorting
- [ ] Add export functionality

## Day 6: Testing & Refinement
- [ ] Write integration tests
- [ ] Perform load testing
- [ ] Optimise query performance
- [ ] Fix identified bugs

## Day 7: Documentation & Deploy
- [ ] Write API documentation
- [ ] Create user guide
- [ ] Deploy to staging environment
- [ ] Conduct final QA checks

## Success Metrics
- Process 100 pages in <60 seconds
- Identify 10+ actionable gaps per analysis
- 95% uptime for API integration
- <2 second response time for cached results