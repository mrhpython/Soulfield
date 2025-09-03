# spec.md

## Intent & Acceptance Criteria

**Intent:** Launch an IR35 Status Checker MVP targeting UK contractors facing compliance uncertainty, validating demand for a £29/month automated determination tool.

**Acceptance Criteria:**
- [ ] 10+ contractors complete full status assessment
- [ ] 3+ email captures with pricing intent signal (£29/month)
- [ ] 1+ Letter of Intent from recruitment agency
- [ ] <£35 customer acquisition cost validated
- [ ] 80%+ assessment completion rate once started

## MVP (Thin Slice)

**Core Feature:** 10-question IR35 status determination form that generates a basic PDF report with risk score (Low/Medium/High) and email capture for detailed guidance.

**What's In:**
- Single-page assessment form
- Basic scoring algorithm (weighted questions)
- PDF generator with template report
- Email capture before results
- Stripe payment link (manual fulfillment)

**What's Out:**
- User accounts/login
- Contract upload/parsing
- Detailed HMRC guidance
- API integrations
- Multi-assessment history

## Tasks (≤12)

1. **Setup hosting & domain** (ir35checker.co.uk) - 2hrs
2. **Create landing page** with value prop & CTA - 3hrs
3. **Build 10-question form** (HTML/JS) - 4hrs
4. **Implement scoring logic** (simple weighted calc) - 3hrs
5. **Design PDF template** (risk score + basic tips) - 2hrs
6. **Add email capture** gate before results - 1hr
7. **Setup Stripe payment link** (£29 one-time) - 1hr
8. **Write 3 SEO pages** (What is IR35, Calculator, Guide) - 4hrs
9. **Configure analytics** (GA4 + form tracking) - 1hr
10. **Create £100 Google Ads** campaign (exact match) - 2hrs
11. **Add GDPR notice** & cookie banner - 1hr
12. **Deploy & test** full user journey - 2hrs

## Week 1 Metrics

**Acquisition:**
- 500 unique visitors (organic + paid)
- 50 assessment starts (10% conversion)
- 10 completed assessments (20% completion)

**Validation:**
- 3 email captures with payment intent
- 1 recruitment agency LOI
- £35 CAC or lower
- 1 actual payment (£29)

**Engagement:**
- 2:30+ average session duration
- <65% bounce rate
- 80%+ form completion (once started)
- 3+ user feedback responses

## Run (approved)

echo "[spec] Compliance Calculator — sanity checks"

ls -alh /home/michael/soulfield/workspace/specs

echo "[policy] show TruthLens rules"

head -n 20 /home/michael/soulfield/workspace/knowledge/TruthLens.md

echo "[index] last 10 lines"

head -n 10 /home/michael/soulfield/workspace/data/index.json


