# UK Online Marketplace MVP - Week 1 Spec

## Intent & Acceptance Criteria
**Intent:** Launch a compliant UK online-first marketplace for pre-owned electronics with verified sellers.

**Acceptance Criteria:**
- UK LTD company registered with Companies House
- Domain secured with UK hosting
- Basic seller verification system operational
- GDPR-compliant data handling
- Payment processing via Stripe Connect (UK entity)
- Returns policy meeting UK Consumer Rights Act 2015

## Day 1 MVP Deliverable
Single landing page with:
- Email capture for seller waitlist
- Basic value proposition
- UK business registration number displayed
- Cookie consent banner

## Tasks (Week 1)
1. Register UK LTD via Companies House online (3hrs)
2. Open Tide business account with UK sort code (2hrs)
3. Purchase .co.uk domain + Vercel hosting (1hr)
4. Create Next.js landing page with Tailwind CSS (4hrs)
5. Implement GDPR-compliant email capture via ConvertKit (2hrs)
6. Set up Stripe Connect UK test account (2hrs)
7. Write T&Cs and Privacy Policy using Rocket Lawyer templates (3hrs)
8. Create seller onboarding form with KYC fields (3hrs)
9. Deploy landing page to Vercel (1hr)
10. Configure Cloudflare for UK edge location (1hr)
11. Set up Fathom Analytics (GDPR-compliant) (1hr)
12. Submit ICO registration for data processing (1hr)

## Metrics/KPIs (Week 1)
- Seller waitlist signups: Target 50
- Landing page conversion rate: >3%
- UK traffic percentage: >70%
- Page load time: <2s from London
- ICO registration: Submitted

## Risks & Mitigations
| Risk | Mitigation |
|------|------------|
| Companies House delays | Use formation agent (1st Formations) for same-day |
| Stripe Connect approval | Start with test mode, gather required docs parallel |
| GDPR non-compliance | Use pre-approved templates, explicit consent only |
| UK banking delays | Use Tide/Revolut Business for instant account |
| Consumer rights violations | Mandatory 14-day cooling-off period built-in |

## Run (approved)

```bash
# Verify project structure exists
echo "=== Checking UK marketplace project files ==="
ls -la ./uk-marketplace-mvp/ 2>/dev/null || echo "Project directory not found"

# Check for critical compliance docs
cat ./uk-marketplace-mvp/legal/terms.md 2>/dev/null | head -5 || echo "Terms not yet created"

# Verify landing page exists
ls ./uk-marketplace-mvp/pages/index.tsx 2>/dev/null || echo "Landing page not initialized"

# Check environment configuration
cat ./uk-marketplace-mvp/.env.example 2>/dev/null | head -10 || echo "No env template found"
```

**Budget:** £500 (formation, domain, initial marketing)  
**Go-live:** Friday 17:00 GMT