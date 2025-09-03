# spec.md

## Intent & Acceptance Criteria

**Intent:** Launch a UK Online Business Compliance Calculator that helps aspiring entrepreneurs understand their tax/VAT obligations before starting, capturing leads for a future full compliance automation platform.

**Acceptance Criteria:**
- [ ] Live calculator at domain with SSL certificate
- [ ] 25+ email captures with 10%+ conversion rate
- [ ] 3 customer testimonials collected
- [ ] £297+ in pre-launch revenue
- [ ] Sub-4 hour support response time established

## MVP (Thin Slice)

**Core Feature:** Interactive web calculator that takes 5 inputs (business type, expected revenue, VAT status, location, industry) and outputs a personalised UK compliance checklist with deadlines, thresholds, and estimated costs.

**Value Prop:** "Know your UK tax obligations in 60 seconds - avoid £1000s in penalties"

**Monetisation:** £47 one-time "Compliance Starter Pack" (templates + 30-min consultation)

## Tasks (≤12)

1. **Setup hosting & domain** - Register domain, configure Netlify/Vercel hosting
2. **Build calculator logic** - JavaScript form with conditional logic for VAT/tax thresholds
3. **Create landing page** - Hero, calculator embed, social proof, CTA sections
4. **Write compliance content** - 3 guides: VAT basics, Company vs Sole Trader, First Year Tax
5. **Configure email capture** - ConvertKit integration with 3-email welcome sequence
6. **Generate legal pages** - Terms, Privacy Policy, Cookie Policy using templates
7. **Setup payment processing** - Stripe checkout for Starter Pack product
8. **Create lead magnet** - "UK Online Business Tax Checklist 2024" PDF
9. **Launch social proof campaign** - Collect 3 beta user testimonials via TypeForm
10. **Configure analytics** - GA4 + Hotjar for conversion tracking
11. **Build support system** - Crisp chat widget + FAQ page
12. **Execute soft launch** - Email 50 contacts, post in 3 UK business forums

## Week 1 Metrics

**Primary KPIs:**
- Unique visitors: 250+
- Email capture rate: 10%+ (25 emails)
- Calculator completions: 100+
- Starter Pack sales: 3+ (£141 revenue)

**Secondary KPIs:**
- Average session duration: 3+ minutes
- Support tickets resolved: 100% within 4 hours
- Social shares: 10+
- Organic keyword rankings: 5+ keywords in top 50

**Leading Indicators:**
- Day 1-2: Domain live, calculator functional
- Day 3-4: First email captured, payment system tested
- Day 5-6: First testimonial collected, 10+ calculator uses
- Day 7: First sale completed, 25+ emails captured

## Run (approved)

```bash
echo "=== UK Online Business Compliance Calculator MVP ==="
echo "Week 1 Sprint: $(date)"
echo ""
ls -la ./project/
cat ./project/index.html | head -20
echo ""
echo "Deployment Status:"
cat ./project/.env | head -5
echo ""
echo "Analytics Summary:"
cat ./project/analytics.log | head -10
```