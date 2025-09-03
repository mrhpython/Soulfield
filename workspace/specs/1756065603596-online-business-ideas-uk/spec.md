```markdown
---
doc: spec
tags: [mvp, execution, online-business-ideas-uk]
constraints: [online-first, uk-based, no-dropshipping]
budget: £350
timeline: 7-days
---

# UK Business Launch Toolkit MVP Spec

## Intent & Acceptance Criteria

**Intent:** Build a digital toolkit that helps UK residents launch compliant online businesses in 7 days, targeting the "online business ideas UK" search cluster with immediate monetization through template sales.

**Acceptance Criteria:**
- [ ] 3+ template purchases at £29 each
- [ ] 50+ email captures with >20% open rate
- [ ] 10+ completed business assessment forms
- [ ] GDPR compliant with ICO registration number displayed
- [ ] Mobile responsive (>60% mobile score)
- [ ] Payment processing live (Stripe/PayPal)

## Day 1 Thin-Slice MVP

**Live URL:** ukbusinesslaunch.co.uk

**Components:**
1. Landing page with UK business compliance checker (5 questions)
2. Free "UK Online Business Readiness Score" PDF generator
3. £29 "Companies House Registration Template Pack" (5 documents)
4. Email capture for "7-Day UK Business Launch" email course

**Content:**
- Headline: "Launch Your UK Online Business in 7 Days - Legally"
- 3 case studies: IR35 consultant, course creator, SaaS founder
- Trust signals: ICO reg, SSL, UK phone number

## Task List (12 Items)

1. **Register ukbusinesslaunch.co.uk** + SSL setup via Namecheap (£15)
2. **Deploy Carrd landing page** with compliance checker quiz (£19/year)
3. **Create 5-document template pack** (Articles, shareholder agreement, service agreement, privacy policy, terms)
4. **Set up Stripe payment link** for £29 template pack
5. **Build email automation** in ConvertKit free tier (7-day sequence)
6. **Generate ICO registration** + add to footer (£40)
7. **Create "Business Readiness Score" PDF** template in Canva
8. **Write 3 UK founder case studies** (500 words each)
9. **Set up GA4 + Hotjar** tracking with conversion goals
10. **Launch £100 Google Ads campaign** targeting "start online business uk"
11. **Post in 5 UK business communities** (r/smallbusinessuk, UK Business Forums, LinkedIn groups)
12. **Schedule 10 discovery calls** via Calendly with template buyers

## Week 1 Metrics

**Revenue Targets:**
- Day 1-2: 1 template sale (£29)
- Day 3-4: 2 template sales (£58)
- Day 5-7: 4 template sales (£116)
- **Total: £203 revenue**

**Engagement Targets:**
- 500 unique visitors (100 paid, 400 organic/direct)
- 50 email signups (10% conversion)
- 25 compliance checks completed
- 10 discovery calls booked
- 3 testimonials collected

**Operational Metrics:**
- CAC < £25 per template buyer
- Time to first sale < 48 hours
- Support response time < 4 hours
- Refund rate < 10%

## Technical Stack

**Frontend:**
- Carrd (landing page)
- Typeform (compliance checker)
- Calendly (discovery calls)

**Backend:**
- Stripe Payment Links (processing)
- ConvertKit (email automation)
- Google Drive (template delivery)
- Zapier free tier (automation)

**Analytics:**
- GA4 (traffic)
- Hotjar free (heatmaps)
- Stripe Dashboard (revenue)

## Launch Sequence

**Day 1 (Monday):**
- 09:00: Domain + Carrd live
- 12:00: Payment processing tested
- 15:00: First Reddit/LinkedIn posts
- 18:00: Google Ads live

**Day 2-3:**
- A/B test two headlines
- Iterate pricing (£29 vs £39)
- Add social proof as collected

**Day 4-5:**
- Launch affiliate program (30% commission)
- Add "Book a Call" upsell (£99)

**Day 6-7:**
- Analyze funnel dropoff
- Prepare Week 2 product expansion

## Risk Mitigations

**Legal:** Use vetted template language with disclaimers
**Technical:** Manual delivery acceptable for first 10 sales
**Marketing:** Focus on one channel until £100 revenue
**Financial:** Break-even at 12 sales (£348)

## Success Indicators

✓ First sale within 48 hours
✓ 10%+ email-to-sale conversion
✓ <£25 customer acquisition cost
✓ One 5-star review
✓ One customer requesting additional services
```

## Run (approved)
echo "[spec] sanity checks"
ls -alh /home/michael/soulfield/workspace/specs
echo "[policy] show TruthLens rules"
head -n 20 /home/michael/soulfield/workspace/knowledge/TruthLens.md
echo "[index] first 10 lines"
head -n 10 /home/michael/soulfield/workspace/data/index.json

