# research.md

## Overview
Bright Data's Scraping Browser provides a headless browser API with built-in proxy rotation, CAPTCHA solving, and JavaScript rendering. Integration enables TruthLens to gather real-time data from approved sources while maintaining compliance with UK data protection laws and website terms of service.

## Technical Approaches

### 1. Puppeteer-Compatible Integration
- Direct drop-in replacement for Puppeteer/Playwright
- Maintains existing scraping logic while adding enterprise features
- Automatic proxy rotation and browser fingerprinting

### 2. REST API Implementation
- Simple HTTP endpoints for scraping requests
- Built-in rate limiting and request queuing
- JSON response format matching our JSONL output requirements

### 3. Session Management
- Persistent sessions for authenticated scraping
- Cookie and localStorage preservation
- Multi-step interaction support

## Concrete Integration Ideas

### Policy-Safe Architecture
```
backend/services/scraper/
├── config/
│   ├── allowlist.json
│   ├── site-configs/
│   │   ├── gov.uk.json
│   │   ├── nhs.uk.json
│   │   └── bbc.co.uk.json
├── core/
│   ├── BrightDataClient.js
│   ├── PolicyValidator.js
│   └── RateLimiter.js
└── outputs/
    └── JSONLWriter.js
```

### Site-Specific Configurations
- Custom selectors per domain
- Rate limiting rules
- Data extraction templates
- Compliance headers and user-agent strings

### Data Pipeline
1. Request validation against allowlist
2. Site config loading
3. Bright Data browser session initiation
4. Content extraction with retry logic
5. JSONL formatting and storage
6. Metadata enrichment (timestamp, source, hash)

## UK Compliance Features
- GDPR-compliant data handling
- Robots.txt respect enforcement
- UK-specific proxy endpoints
- Public data only extraction rules

---

# keywords.json

```json
[
  {"keyword": "bright data scraping browser", "intent": "research", "difficulty": "medium", "volume_est": 500},
  {"keyword": "web scraping api uk", "intent": "commercial", "difficulty": "high", "volume_est": 1200},
  {"keyword": "compliant web scraping", "intent": "informational", "difficulty": "low", "volume_est": 300},
  {"keyword": "headless browser api", "intent": "technical", "difficulty": "medium", "volume_est": 2000},
  {"keyword": "puppeteer alternative", "intent": "comparison", "difficulty": "medium", "volume_est": 3500},
  {"keyword": "gdpr web scraping", "intent": "compliance", "difficulty": "high", "volume_est": 800},
  {"keyword": "automated data collection uk", "intent": "commercial", "difficulty": "high", "volume_est": 400},
  {"keyword": "jsonl data export", "intent": "technical", "difficulty": "low", "volume_est": 150}
]
```

---

# questions.md

## Technical Implementation
- How to authenticate with Bright Data API?
- What's the optimal request batching strategy?
- How to handle rate limiting gracefully?
- Should we use WebSocket or REST endpoints?

## Compliance & Legal
- Which UK sites explicitly allow automated access?
- How to ensure GDPR compliance in data storage?
- What metadata must be retained for audit trails?
- How to handle cookie consent banners programmatically?

## Performance & Scaling
- What's the concurrent session limit?
- How to implement request queuing?
- What's the optimal retry strategy for failed requests?
- How to monitor and alert on scraping failures?

## Data Management
- How to validate scraped data quality?
- What compression strategy for JSONL files?
- How to implement incremental updates?
- Should we implement change detection?

---

# competitors.md

## Direct Competitors

### ScrapingBee
- Strengths: Simple API, good documentation
- Weaknesses: Limited UK presence, expensive at scale
- Pricing: $49/month starting
- UK Focus: Limited

### Scrapfly
- Strengths: Anti-bot bypass, screenshot API
- Weaknesses: Complex pricing, learning curve
- Pricing: €99/month starting
- UK Focus: Moderate

### Apify
- Strengths: Actor marketplace, pre-built scrapers
- Weaknesses: Over-engineered for simple tasks
- Pricing: $49/month starting
- UK Focus: Good

## Indirect Competitors

### Octoparse
- Desktop-based, no-code solution
- Limited API capabilities
- Not suitable for backend integration

### ParseHub
- Visual scraping tool
- Cloud-based but limited customisation
- Better for one-off projects

## Differentiation Strategy
- UK-first compliance focus
- Pre-configured for UK government and public services
- Transparent allowlist system
- Open-source friendly approach

---

# plan.md

# 7-Day MVP Implementation Plan

## Day 1: Setup & Authentication
- [ ] Create Bright Data account and obtain API credentials
- [ ] Set up environment variables and secrets management
- [ ] Install SDK: `npm install brightdata-sdk`
- [ ] Create basic connection test script
- [ ] Document authentication flow

## Day 2: Core Client Development
- [ ] Build `BrightDataClient.js` wrapper class
- [ ] Implement session management
- [ ] Add error handling and retry logic
- [ ] Create unit tests for client methods
- [ ] Set up logging infrastructure

## Day 3: Policy & Configuration
- [ ] Create `allowlist.json` with initial UK sites
- [ ] Build `PolicyValidator.js` for request validation
- [ ] Implement site-specific config loader
- [ ] Add robots.txt checker
- [ ] Create configuration schema documentation

## Day 4: Scraping Logic
- [ ] Implement generic page scraper
- [ ] Add configurable selector extraction
- [ ] Build JSON-LD and metadata parsers
- [ ] Create screenshot capability
- [ ] Test with 3 different UK sites

## Day 5: Data Pipeline
- [ ] Build `JSONLWriter.js` for output formatting
- [ ] Implement data validation layer
- [ ] Add deduplication logic
- [ ] Create file rotation system
- [ ] Set up data archival process

## Day 6: Integration & Testing
- [ ] Integrate with existing TruthLens services
- [ ] Create API endpoints for scraping requests
- [ ] Build request queue system
- [ ] Implement rate limiting
- [ ] End-to-end testing with real sites

## Day 7: Documentation & Deployment
- [ ] Write API documentation
- [ ] Create usage examples
- [ ] Set up monitoring and alerts
- [ ] Deploy to staging environment
- [ ] Conduct security review

## Success Metrics
- Successfully scrape 5 UK government sites
- Process 100 pages without errors
- Maintain 99% uptime
- Average response time under 5 seconds
- Zero compliance violations