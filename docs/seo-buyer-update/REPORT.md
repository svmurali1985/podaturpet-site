# SEO, buyer enquiry and country/state view counts

Updated from website(20260926-033400).zip. No production deployment performed.

## Changes
- Clear wholesale-lungi homepage H1 in English and Tamil, preserving the existing design and navigation.
- Buyer enquiry: sample/quotation/design-help intent, known-product suggestions, optional quantity, WhatsApp/email drafts and copy-message fallback. Editing fields or changing language invalidates stale drafts. No message is sent automatically.
- Product-specific sample links and bilingual ordering guidance on India/international hubs. Neutral-product catalogue schema now targets its actual catalogue card.
- Public page views: this page and entire site over the last 30 UTC calendar days, plus top 20 country/state groups across the site. These are consenting page loads, not unique people. No fabricated numbers or external paid API.
- Worker stops collecting city for new views; public and admin aggregates expose only country and state/region. Legacy city column remains for schema compatibility and old rows expire under existing 90-day cleanup. No schema migration or destructive data cleanup required.
- Updated consent/privacy language. Comments remain separately moderated; this update does not remove voluntarily supplied location text from comments or location filters in travel/directory tools.
- Shared script/style versions refreshed across public pages. Most HTML changes are only asset version changes.

## Verification
- Worker tests: 9 passed, including authentication, consent, GPC, aggregation, historical city suppression, moderation and expiry.
- DOM behaviour checks: 25 passed across English/Tamil homepages and enquiry page; draft links, input escaping, clipboard, stale draft reset, quantity validation and count consent/error handling checked using jsdom with mocked network responses. No test enquiries were sent.
- Local link/ID checker: 51 HTML pages, zero errors.
- JavaScript syntax checked for changed application scripts.
- Visual mobile/browser QA remains unverified: local browser executable could not be installed, and cloud browser refused localhost. DOM tests do not substitute for real-device layout checks.
- Live Worker responses and production counts must be verified after deployment; no Cloudflare deployment access was used.

## Remaining owner input
Actual composition, dimensions, MOQ, sample prices, availability, packing and dispatch facts were not supplied. Existing unconfirmed values are not replaced with invented promises. Complete PRODUCT-DETAILS-TO-CONFIRM.json to prepare the next factual product update.

## Deployment
Deploy the Worker first, then publish static files. Existing Cloudflare database binding and secrets are reused. Public counts need the new /v1/stats endpoint; before deployment the site displays an unavailable message rather than a made-up zero. Public reads do not increment views; a consenting page load does. Old counts are retained.

## Post-deployment check
Open a product sample link; verify reference and sample purpose. Enter a destination and prepare the draft. Test WhatsApp/email handoff without sending a fake enquiry. Check English/Tamil at 390px and desktop widths. At the bottom of a page, confirm 30-day totals and country/state headings. Decline counting and confirm no view POST is sent. A missing API response must show unavailable, not zero. No city column should appear in the admin statistics.
