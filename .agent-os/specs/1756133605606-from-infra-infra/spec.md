# UK Online Marketplace MVP - Week 1 Spec

## Intent & Acceptance Criteria
**Intent**: Launch a compliant UK online marketplace for artisan home goods with direct fulfillment from verified UK makers.

**Acceptance Criteria**:
- [ ] Domain secured with UK hosting (GDPR-compliant infrastructure)
- [ ] Legal entity registered (Ltd company via Companies House)
- [ ] Payment processing live (Stripe UK with SCA/3DS2)
- [ ] 5 verified UK makers onboarded with signed agreements
- [ ] Consumer rights policy displayed (14-day returns, UK Consumer Rights Act 2015)
- [ ] VAT registration initiated if projecting >£85k turnover

## Day 1 Thin-Slice MVP
Single landing page with:
- Email capture for "early access" list
- One featured maker profile with 3 products (static)
- Stripe payment link for test transaction (£1 donation to maker)
- Terms of Service and Privacy Policy links (template-based)

## Tasks (Priority Order)
1. Register Ltd company via Companies House online (3hrs)
2. Set up Stripe UK business account with test mode (2hrs)
3. Purchase .co.uk domain + SSL cert (1hr)
4. Deploy landing page on Vercel/Netlify (2hrs)
5. Draft maker agreement template (2hrs)
6. Contact 10 UK makers via Etsy/Instagram DM (2hrs)
7. Create GDPR-compliant privacy policy (1hr)
8. Set up Google Analytics 4 with cookie consent (1hr)
9. Implement email capture with Mailchimp/SendGrid (2hrs)
10. Create returns policy page per UK law (1hr)
11. Add Trustpilot widget integration (1hr)
12. Schedule Companies House VAT registration if needed (1hr)

## Week 1 KPIs
- Email signups: 100+
- Maker applications: 5 verified
- Test transactions: 10 successful
- Page load time: <2s (UK visitors)
- Compliance checklist: 100% complete
 

---

## Run (approved)


# Verify workspace structure for UK marketplace
echo "=== UK Marketplace MVP Workspace Check ==="

# Check that key legal + config files exist
ls -la ./legal/
head -n 5 ./requirements.txt
head -n 5 ./maker-agreement-template.md
head -n 5 ./.env.example

# Show Stripe config (if present)
head -n 3 ./config/stripe_uk.env

# Show landing page snippet (if present)
head -n 5 ./public/index.html

# Show first 3 inventory files (if any)
head -n 3 ./inventory/*.json
