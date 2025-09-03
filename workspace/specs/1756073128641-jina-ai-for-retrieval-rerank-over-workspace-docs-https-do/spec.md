# spec.md

## Intent
Build a UK-focused semantic search API that integrates Jina AI's embedding and reranking capabilities with TruthLens verification, enabling developers to add fact-checked RAG pipelines to their applications within minutes.

## Acceptance Criteria
1. **API responds to search queries in <300ms** with ranked, truth-verified results
2. **Successfully indexes 100+ documents** from URLs/files via Jina Reader
3. **Returns confidence scores** mapped from rerank scores (0.0-1.0)
4. **Provides source citations** with exact document references
5. **Handles 10 concurrent requests** without degradation

## Thin-Slice MVP
A REST API endpoint that accepts a search query, embeds it using Jina, searches a pre-indexed knowledge base, reranks results, and returns truth-verified responses with citations.

```
POST /api/v1/search
{
  "query": "how to implement vector search",
  "max_results": 5,
  "verify": true
}
→ Returns ranked results with TruthLens confidence scores
```

## Implementation Tasks (≤12)

### Core Infrastructure (4 tasks)
1. **Setup Jina client wrapper** with API credentials and error handling
2. **Create PostgreSQL schema** with pgvector extension for embeddings storage
3. **Build document chunker** (1000 tokens, 200 overlap) with metadata preservation
4. **Implement Redis cache** for embedding results (TTL: 1 hour)

### Processing Pipeline (4 tasks)
5. **Create indexer service** that processes documents via Jina Reader → chunks → embeddings
6. **Build search endpoint** that handles query → embed → vector search → rerank flow
7. **Implement TruthLens mapper** converting rerank scores to confidence levels
8. **Add citation tracker** linking results to source documents with offsets

### API & Testing (4 tasks)
9. **Define OpenAPI schema** for /api/v1/search endpoint with validation
10. **Write integration tests** covering happy path + edge cases (empty results, timeout)
11. **Create Docker compose** setup with PostgreSQL, Redis, and API service
12. **Deploy to Railway/Render** with environment variables and monitoring

## Week-1 Success Metrics
- **Throughput**: 100+ successful API calls/day
- **Latency**: P95 response time <300ms
- **Quality**: 80%+ relevance score on test queries
- **Adoption**: 5+ unique API consumers
- **Reliability**: 99%+ uptime, <1% error rate

## Technical Constraints (TruthLens)
- All responses must include `confidence_score` field
- Citations must reference indexed document IDs
- Fact verification must complete within 100ms budget
- Results must be traceable to source material

## Run (approved)
echo "[spec] sanity checks"
ls -alh /home/michael/soulfield/workspace/specs
echo "[policy] show TruthLens rules"
head -n 20 /home/michael/soulfield/workspace/knowledge/TruthLens.md
echo "[index] first 10 lines"
head -n 10 /home/michael/soulfield/workspace/data/index.json

