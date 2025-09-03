# spec.md

## Intent
Enable UK content teams to discover and prioritise content gaps through automated text network analysis, transforming structural insights into actionable content opportunities.

## Acceptance Criteria
- [ ] Analyse 50+ pages in <30 seconds with visual gap mapping
- [ ] Generate 5+ prioritised content briefs per analysis
- [ ] Achieve 90% accuracy in gap significance scoring
- [ ] Display interactive knowledge graph with <1s render time
- [ ] Export gap analysis as CSV/JSON with keyword mappings

## Thin-Slice MVP
Single-domain content gap analyser with visual network display and automated brief generation for top 3 gaps.

### Core Flow
1. Paste website URL → Crawl up to 50 pages
2. Generate knowledge graph → Identify disconnected clusters
3. Score gaps by search volume × difficulty inverse
4. Output 3 content briefs with target keywords

## Tasks (≤12)

### Backend (6)
1. **Create InfraNodus adapter** - API client with auth, retry logic `backend/adapters/infranodus/client.js`
2. **Build crawler service** - Sitemap parser, page fetcher, text extractor `services/crawler.js`
3. **Implement gap scorer** - Algorithm: `(volume × (100-difficulty)/100) × cluster_distance`
4. **Design brief generator** - Template engine mapping gaps to keywords + headings
5. **Set up Redis cache** - Store analyses for 7 days, key: `gap:domain:hash`
6. **Create REST endpoint** - `POST /api/gaps/analyse` with domain validation

### Frontend (4)
1. **Build analysis form** - URL input with crawl depth selector (10/25/50 pages)
2. **Create graph visualiser** - D3.js force-directed graph, clickable nodes
3. **Design brief cards** - Collapsible panels with keywords, volume, difficulty
4. **Add export button** - Download gaps + briefs as structured JSON

### Infrastructure (2)
1. **Configure rate limits** - 10 analyses/hour per user, queue overflow
2. **Set up monitoring** - Track API latency, cache hits, completion rates

## Week-1 Metrics
- **Analyses completed**: Target 100+ (track completion rate)
- **Briefs generated**: Target 300+ (3 per analysis minimum)
- **Avg. gap significance**: >0.7 (validate scoring accuracy)
- **Cache hit ratio**: >40% (optimise for common domains)
- **API response time**: P95 <3s (monitor InfraNodus latency)

## Technical Constraints
- Max 50 pages per analysis (InfraNodus limit)
- 1 concurrent analysis per user (prevent abuse)
- Graph renders client-side (reduce server load)
- UK-specific keyword data only (volume estimates × 0.15 for UK market)

## Run (approved)
echo "[spec] sanity checks"
ls -alh /home/michael/soulfield/workspace/specs
echo "[policy] show TruthLens rules"
head -n 20 /home/michael/soulfield/workspace/knowledge/TruthLens.md
echo "[index] first 10 lines"
head -n 10 /home/michael/soulfield/workspace/data/index.json

