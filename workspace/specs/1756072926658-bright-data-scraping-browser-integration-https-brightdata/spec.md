# spec.md

## Intent
Build a UK-compliant web scraping service using Bright Data's infrastructure to collect public information from approved UK sources, ensuring GDPR compliance while providing reliable data extraction for TruthLens fact-checking operations.

## Acceptance Criteria
- [ ] Successfully authenticate and connect to Bright Data API
- [ ] Scrape 3 UK government sites (gov.uk, nhs.uk, parliament.uk) without violations
- [ ] Validate all requests against allowlist before execution
- [ ] Export data in JSONL format with source metadata
- [ ] Achieve 95% success rate on scraping attempts
- [ ] Respect robots.txt and rate limits automatically

## Thin-Slice MVP
A Node.js service that scrapes a single gov.uk page using Bright Data's API, validates the request against an allowlist, and outputs structured data in JSONL format.

```javascript
// Minimal viable flow
const scraper = new BrightDataClient(config);
const validator = new PolicyValidator(allowlist);
if (validator.isAllowed(url)) {
  const data = await scraper.extract(url, selectors);
  await JSONLWriter.append(data);
}
```

## Implementation Tasks (≤12)

### Core Setup (Day 1)
1. **Environment Setup** - Configure Bright Data credentials, create `.env` file, test connection
2. **Project Structure** - Initialize Node.js project with `scraper/`, `config/`, `outputs/` directories

### Policy Layer (Day 2)
3. **Allowlist System** - Create `allowlist.json` with gov.uk, nhs.uk, bbc.co.uk domains
4. **Policy Validator** - Build validation class checking URL against allowlist and robots.txt

### Scraping Core (Day 3)
5. **Bright Data Client** - Wrapper class for API with session management and retry logic
6. **Selector Engine** - Configurable extraction using CSS selectors from site configs

### Data Pipeline (Day 4)
7. **JSONL Writer** - Output formatter with timestamp, source URL, content hash
8. **Error Handling** - Graceful failure recovery with exponential backoff

### Integration (Day 5)
9. **API Endpoint** - POST `/scrape` accepting URL and returning job ID
10. **Queue System** - In-memory queue for request management with concurrency limit of 3

### Testing & Launch (Day 6)
11. **Integration Tests** - End-to-end test scraping gov.uk/guidance page
12. **Monitoring Setup** - Basic health check endpoint and success rate tracking

## Week 1 Success Metrics
- **Volume**: 100+ successful page extractions
- **Reliability**: <5% error rate on approved sites
- **Performance**: <10s average extraction time
- **Compliance**: 0 robots.txt violations logged
- **Coverage**: 3 distinct UK domains successfully scraped

## Technical Stack
- **Runtime**: Node.js 18+
- **Dependencies**: brightdata-sdk, dotenv, winston (logging)
- **Output**: JSONL files in `outputs/` directory
- **Config**: JSON-based per-site selectors

## Constraints Acknowledgment
- UK-first approach targeting government and public service sites
- Strict allowlist enforcement (no arbitrary URL scraping)
- GDPR-compliant with public data only
- Respects TruthLens ethical guidelines for automated collection

## Run (approved)
echo "[spec] sanity checks"
ls -alh /home/michael/soulfield/workspace/specs
echo "[policy] show TruthLens rules"
head -n 20 /home/michael/soulfield/workspace/knowledge/TruthLens.md
echo "[index] first 10 lines"
head -n 10 /home/michael/soulfield/workspace/data/index.json

