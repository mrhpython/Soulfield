# UK Online Compliance – Starter Pack (Living Document)

> Purpose: give agents a consistent checklist when proposing UK-facing, online-only businesses.
> This is guidance, not legal advice. Always verify against GOV.UK / ICO sources.

## Scope
- Audience: UK online marketplace / SaaS / content sites (no in-person services)
- Data: personal data collected online (web/email/payments)
- Payments: Stripe UK (SCA/3DS2)
- Taxes: VAT rules for UK

## CAN (typical allowances)
- Sell digital/physical goods online to UK consumers
- Take card payments with SCA/3DS2
- Offer subscriptions (clear pricing & cancellation)
- Email marketing with explicit opt‑in & unsubscribe

## CANNOT / MUST NOT
- Dropshipping to UK consumers without UK‑compliant returns & duty handling
- Hidden fees (“drip pricing”) not shown before checkout
- Collect personal data without a lawful basis/consent and privacy notice
- Ignore consumer cancellation/returns rights

## Must‑Have Pages/Artifacts
- `/privacy` (privacy policy, lawful basis, data rights, DPO/contact)
- `/terms` (seller T&Cs incl. governing law, address, email)
- `/returns` (clear 14‑day cancellation/returns for consumer distance contracts)
- Company details (registered address or geographic address, email) visible from footer
- Cookie consent banner + preferences if non-essential cookies used
- Pricing inclusive of VAT; VAT number displayed if registered

## Payment & SCA
- Stripe UK account configured (SCA/3DS2 active)
- Refunds & chargeback policy documented
- Automatic email receipt

## VAT (threshold guidance)
- Monitor turnover vs threshold (historically ~£85k/year)
- Register & display VAT number once registered
- Apply correct VAT rate for goods/services sold

## Data Protection (GDPR/UK GDPR)
- Explicit consent for marketing (unticked checkbox)
- Data subject rights: access/erasure/export on request
- Retention schedule for customer data
- Third‑party processors listed (e.g., Stripe, Mailchimp)

## Agent Checklists (what specs should verify)
- [ ] `privacy.md` exists with contact + lawful basis
- [ ] `terms.md` exists with address + email
- [ ] `returns.md` exists mentioning 14‑day consumer rights
- [ ] Footer includes address + contact
- [ ] Stripe UK keys present in config and SCA enabled
- [ ] If VAT-registered: VAT number shown on checkout/receipt pages

## TODO: Sources to cite (fill during research)
- GOV.UK: eCommerce regulations, display of company information
- ICO: Privacy notices, cookies, direct marketing
- CMA: Pricing practices (no drip pricing)
- HMRC: VAT registration and rates
