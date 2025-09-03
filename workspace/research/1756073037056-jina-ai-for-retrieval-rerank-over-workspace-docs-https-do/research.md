# research.md

## Overview
Jina AI provides neural search infrastructure for building semantic search systems. Their offerings include embedding models, reranking capabilities, and document processing tools optimised for retrieval-augmented generation (RAG) workflows.

## Core Approaches

### 1. Document Processing Pipeline
- **Chunking**: Smart document segmentation preserving context
- **Embedding**: Multi-lingual dense embeddings (jina-embeddings-v3)
- **Reranking**: Cross-encoder models for precision ranking
- **Reader API**: Structure extraction from PDFs, HTML, markdown

### 2. Integration Architecture
```
Workspace Docs → Jina Reader → Embeddings → Vector Store
                                    ↓
User Query → Search API → Rerank → TruthLens → Results
```

### 3. Key Components
- **Jina Embeddings**: 8192 token context, 1024 dimensions
- **Jina Reranker**: Cross-attention scoring for relevance
- **Jina Reader**: Clean text extraction, metadata preservation

## Concrete Integration Ideas

### Backend Adapter (`backend/adapters/jina/`)
```python
class JinaAdapter:
    - embed_documents(texts: List[str]) → vectors
    - rerank_results(query: str, candidates: List) → scored_results
    - extract_content(url_or_file: str) → structured_text
```

### Indexer Enhancement
- Parallel processing for knowledge base ingestion
- Incremental indexing for research/specs updates
- Metadata tagging (doc_type, timestamp, source)

### Search API Integration
```python
POST /api/search
{
    "query": "user question",
    "filters": ["knowledge", "research"],
    "rerank": true,
    "truth_lens": true
}
```

### TruthLens Post-Processing
- Fact verification against indexed sources
- Confidence scoring based on rerank scores
- Citation linking to original documents

## Performance Considerations
- Batch embedding for initial indexing (100 docs/request)
- Cache frequently accessed embeddings
- Async reranking for sub-200ms response times
- Rate limiting: 10,000 embeddings/minute on free tier

## Cost Optimisation
- Free tier: 1M tokens/month embeddings
- Reranker: $0.02 per 1000 requests
- Self-host option for high-volume scenarios

---

# keywords.json

```json
[
  {"keyword": "jina ai integration", "intent": "technical", "difficulty": "medium", "volume_est": "500"},
  {"keyword": "vector search api", "intent": "implementation", "difficulty": "high", "volume_est": "1200"},
  {"keyword": "document reranking", "intent": "feature", "difficulty": "medium", "volume_est": "800"},
  {"keyword": "rag pipeline setup", "intent": "tutorial", "difficulty": "high", "volume_est": "2000"},
  {"keyword": "embedding api comparison", "intent": "research", "difficulty": "low", "volume_est": "1500"},
  {"keyword": "semantic search backend", "intent": "architecture", "difficulty": "high", "volume_est": "900"},
  {"keyword": "truth verification ai", "intent": "feature", "difficulty": "medium", "volume_est": "600"},
  {"keyword": "workspace document indexing", "intent": "solution", "difficulty": "medium", "volume_est": "400"},
  {"keyword": "jina reader api", "intent": "technical", "difficulty": "low", "volume_est": "300"},
  {"keyword": "cross-encoder reranking", "intent": "technical", "difficulty": "high", "volume_est": "700"}
]
```

---

# questions.md

## Technical Implementation
- How to integrate Jina embeddings with existing vector stores?
- What's the optimal chunk size for workspace documents?
- How to handle multi-modal content in specifications?
- Should we use Jina Cloud or self-host the models?

## Performance & Scaling
- What's the latency impact of reranking on search results?
- How many documents can be indexed in parallel?
- What's the memory footprint for 100k document embeddings?
- How to implement incremental indexing efficiently?

## Cost & Resources
- What's the break-even point for self-hosting vs API?
- How to optimise token usage for embedding generation?
- What's the cost comparison with OpenAI embeddings?

## Integration Architecture
- How to structure the adapter pattern for Jina services?
- Where to implement caching layers in the pipeline?
- How to handle fallbacks if Jina API is unavailable?
- What metadata should be preserved during indexing?

## TruthLens Compatibility
- How to map rerank scores to confidence levels?
- What's the best way to track source citations?
- How to implement fact-checking against indexed documents?

---

# competitors.md

## Direct Competitors

### Cohere
- **Strengths**: Superior reranking, multilingual support
- **Weaknesses**: Higher pricing, fewer embedding options
- **Pricing**: $1 per 1000 rerank requests

### Pinecone + OpenAI
- **Strengths**: Mature ecosystem, extensive documentation
- **Weaknesses**: Vendor lock-in, separate services
- **Pricing**: $0.0001 per 1000 tokens (embeddings)

### Voyage AI
- **Strengths**: Domain-specific embeddings, high accuracy
- **Weaknesses**: Limited reranking, smaller community
- **Pricing**: $0.05 per 1M tokens

## Open Source Alternatives

### Sentence Transformers
- **Strengths**: Free, customisable, offline capability
- **Weaknesses**: Requires infrastructure, maintenance overhead
- **Best for**: High-volume, privacy-sensitive deployments

### BGE Models (BAAI)
- **Strengths**: State-of-art performance, multiple sizes
- **Weaknesses**: Complex setup, resource intensive
- **Best for**: Self-hosted enterprise solutions

## Positioning Strategy
- Jina offers best balance of performance, cost, and ease of integration
- Unique combination of embedding + reranking + reader in one platform
- Strong UK/EU data compliance options

---

# plan.md

## 7-Day MVP Implementation Plan

### Day 1: Environment Setup
- [ ] Create `backend/adapters/jina/` directory structure
- [ ] Set up Jina API credentials in environment variables
- [ ] Install dependencies: `jina`, `httpx`, `pydantic`
- [ ] Write basic JinaClient wrapper class

### Day 2: Document Processing
- [ ] Implement document chunking strategy (1000 token chunks, 200 overlap)
- [ ] Create Reader API integration for PDF/HTML extraction
- [ ] Build metadata extraction pipeline
- [ ] Test with 10 sample workspace documents

### Day 3: Embedding & Indexing
- [ ] Implement batch embedding function
- [ ] Create vector store interface (PostgreSQL pgvector or Qdrant)
- [ ] Build indexer for knowledge base documents
- [ ] Add progress tracking and error handling

### Day 4: Search API Development
- [ ] Create `/api/search` endpoint structure
- [ ] Implement query embedding generation
- [ ] Add vector similarity search
- [ ] Integrate reranking step

### Day 5: TruthLens Integration
- [ ] Map rerank scores to confidence levels
- [ ] Implement source citation tracking
- [ ] Add fact verification against indexed docs
- [ ] Create response formatting pipeline

### Day 6: Testing & Optimisation
- [ ] Write unit tests for each component
- [ ] Benchmark search latency (target: <300ms)
- [ ] Implement caching layer for frequent queries
- [ ] Add monitoring and logging

### Day 7: Documentation & Deployment
- [ ] Create API documentation
- [ ] Write integration guide
- [ ] Set up CI/CD pipeline
- [ ] Deploy to staging environment
- [ ] Conduct end-to-end testing

## Success Metrics
- Index 100+ documents successfully
- Sub-300ms search response time
- 90%+ relevance accuracy on test queries
- TruthLens confidence scores correlating with rerank scores