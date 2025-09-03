# UK Online Marketplace MVP - Week 1 Spec

## Intent & Acceptance Criteria
**Intent**: Launch minimal viable UK-based online marketplace for pre-owned electronics with compliance-first approach.

**Acceptance Criteria**:
- [ ] UK-registered business entity confirmed
- [ ] Payment processing for UK cards (Stripe UK)
- [ ] GDPR-compliant data handling
- [ ] Consumer Rights Act 2015 returns policy visible
- [ ] VAT registration initiated if projecting >£85k
- [ ] Single product category live (refurbished phones)

## Day 1 Thin-Slice MVP
- Static landing page with email capture
- Legal entity registration started
- Domain secured (.co.uk)
- "Coming Soon" with value prop: "Certified Pre-Owned Tech, UK Warranty"

## Tasks (Week 1)
1. Register UK LTD company via Companies House (£50, same-day)
2. Open Tide/Starling business account 
3. Setup Stripe UK merchant account
4. Deploy landing page (Vercel/Netlify)
5. Implement email capture (ConvertKit/Mailchimp)
6. Draft T&Cs, Privacy Policy (template + legal review)
7. Create 5 product listings (phones, grading system A/B/C)
8. Setup basic inventory tracking (Airtable/Notion)
9. Configure UK shipping zones (Royal Mail integration)
10. Implement basic checkout flow (Stripe Checkout)
11. Setup customer service email workflow
12. Register ICO for data processing (£40-60)

## Metrics/KPIs (Week 1)
- Email signups: Target 50
- Site deployment uptime: 99%
- Legal compliance checklist: 100%
- Product listings live: 5
- Payment test transactions: 3 successful
- Page load speed: <3s

## Risks & Mitigations
| Risk | Mitigation |
|------|------------|
| Payment processor delays | Pre-verify documents, use Stripe's instant onboarding |
| GDPR non-compliance | Use verified templates, explicit consent checkboxes |
| Supply chain (no dropship) | Partner with UK refurbisher, hold 10 units stock |
| Consumer rights claims | 14-day returns clearly stated, factor 10% return rate |
| VAT threshold | Monitor sales, register early if approaching £7k/month |

## Run (approved)

```bash
# Verify workspace structure for UK marketplace
echo "=== UK Marketplace MVP Workspace Check ==="
ls -la ./legal/ 2>/dev/null || echo "Legal docs directory not found"
cat ./config/stripe_uk.env 2>/dev/null | head -3 || echo "Stripe UK config pending"
head -5 ./public/index.html 2>/dev/null || echo "Landing page not deployed"
ls ./inventory/*.json 2>/dev/null | head -3 || echo "No inventory files yet"
```

**Budget**: £500-800 (incorporation, legal review, initial inventory sample)
**Go/No-Go**: Day 3 - Stripe approved + 20 email signups