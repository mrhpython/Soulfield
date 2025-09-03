# MVP Spec: UK Digital Consultancy Platform
*1-Week Sprint: Online-First B2B Service*

## Intent & Acceptance Criteria
**Intent**: Launch minimal viable UK-based digital consultancy matching platform connecting SMEs with vetted consultants.

**Acceptance Criteria**:
- UK-registered business entity compliant with Companies House
- GDPR-compliant data handling with clear privacy policy
- Sterling-only transactions via Stripe UK
- Mobile-responsive landing page with consultation booking
- No physical products/dropshipping - services only

## Day 1 Thin-Slice MVP
Single-page consultation booking form with:
- Service type selector (Strategy/Tech/Marketing)
- Budget range dropdown (£500-5000)
- Email capture with double opt-in
- Static "Thank you" confirmation page
- Manual backend processing via email notifications

## Tasks (Week 1)
1. Register UK LTD company via Companies House WebFiling
2. Setup business bank account (Tide/Starling)
3. Configure Stripe UK merchant account
4. Deploy landing page (Vercel/Netlify)
5. Implement booking form with validation
6. Setup GDPR-compliant email automation (SendGrid)
7. Create privacy policy & terms (Docusign templates)
8. Configure Google Analytics 4 + conversion tracking
9. Setup customer support email with auto-responder
10. Create 3 consultant profile templates
11. Implement basic lead qualification webhook
12. Launch £100 Google Ads test campaign

## Metrics/KPIs (Week 1)
- Conversion rate: >2% form submissions
- CAC: <£50 per qualified lead
- Response time: <2 hours business hours
- Legal compliance: 100% GDPR consent rate
- Uptime: >99.5%

## Risks & Mitigations
| Risk | Mitigation |
|------|------------|
| FCA regulations if handling payments | Use Stripe Connect; consultants invoice directly |
| GDPR breach | Explicit consent checkboxes; data minimization |
| VAT threshold | Monitor revenue; register if approaching £85k |
| Professional indemnity | Require consultants carry own insurance |

## Run (approved)

```bash
echo "=== Verifying project structure ==="
ls -la ./src/
cat ./src/index.html | head -20
cat ./privacy-policy.md | head -15
echo "Build timestamp: $(date '+%Y-%m-%d %H:%M:%S')"
```

**Launch Gate**: Legal entity registered + payment processor verified before going live.