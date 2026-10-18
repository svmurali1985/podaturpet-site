# Podaturpet global website update — 20 September 2026

Source: the uploaded `website(20260920-025920).zip`. This is an incremental update to the existing static website. No production deployment, messages, orders or repository push was performed.

## What changed

- Reworked the first screen around Podaturpet as a town, textile and digital-services platform. Preserved the existing multigeneration illustration, original product photographs, regional image credits, stories, advertising routes and useful tools.
- Added five first-screen routes: town and culture, wholesale lungis, AI/digital services, local services and advertising. Compressed mobile hero spacing and kept English/Tamil and other-language choices visible.
- Corrected the buyer journey. Several quote calls to action led to a **supplier introduction form**. Those now lead to `wholesale-lungi-enquiry.html`, which prepares a reviewable WhatsApp draft with design, quantity, destination and requirements. The original supplier page remains available for supplier introductions.
- Redirected legacy catalogue quote links to the buyer form while retaining product references. Repaired catalogue links to removed homepage video/gallery sections, directing them to the existing weaving video and modern collection.
- Added focused AI chatbot development and business workflow automation pages. Their content describes example tasks, review steps, project scope and costs to agree; it does not fabricate customers, completed projects, savings or performance claims.
- Added a shared Google Translate link menu to every current content page. It loads no Google translation JavaScript on first visit. Translation opens in a new tab only after the visitor chooses a language. Only the public pathname is sent, never a query string or form contents.
- Added a static Tamil homepage with a self-canonical URL and reciprocal English/Tamil/x-default language links. Preserved native Tamil information-hub pages, travel-planner controls and the existing dictionary translations. Fixed shared document-language and persisted-choice synchronization.
- Kept language choices and form labels available to keyboard and screen-reader users. Fixed the two low-contrast service-number labels found by automated accessibility testing.
- Fixed legacy anchor markers taking up grid cells, which produced large gaps in the town and contact sections.
- Removed an unsupported homepage VideoObject declaration because the homepage no longer contained the matching video. Removed an unverified street-address assumption and restrictive country list from the homepage Organization declaration.
- Updated the sitemap with current canonical content pages and four new URLs. Extended robots exclusions for archived update copies and tooling. Preserved legacy redirects.

## Audit findings and scope

The source contained 46 root HTML pages: 32 content pages and 14 redirects. The audit inventory records all titles, headings, forms, scripts, stylesheets and existing translation markers. Nested invoice, travel and Tamil-life backup folders and the historic site version were inspected as archive directories, not treated as current pages. Their contents were retained rather than published as new destinations.

The current site still has several generations of CSS and page-building scripts. Replacing every legacy layout at once would risk the invoice, directory, public-information and travel tools. This release keeps their interfaces and functionality, adds the shared finishing layer and tests the most important journeys. For the homepage and three newly built content pages, two unnecessary legacy stylesheets (42,108 bytes combined, before HTTP compression) were removed. The 73,547-byte legacy buyer translation dictionary is kept off these fully marked-up first-open pages. Existing hero responsive image variants, lazy-loaded lower-page images and local Tamil font with font-display:swap are retained. No new image/video payload is introduced.

The invoice's existing “3 trial exports” model, native travel tools, directory review/expiry behavior, advertising enquiry links, assistant and visitor-tracking behavior remain in place. This update adds no analytics provider or new data collector. The old timed advertisement script remains in the repository; it was not injected into pages that did not load it in the uploaded version.

## Language coverage — explicit limits

The homepage, new AI service pages and new buyer flow have authored English/Tamil interface and main copy. A crawlable static Tamil homepage is included. The existing People Information Hub retains its separate native Tamil URL, and the family planner retains its full native language controls.

Some older long reference pages and the invoice tool still contain English-only content. Their existing native translations and shared controls are retained and extended; a clearly labelled full-page Tamil Google Translate link is supplied in the language menu. This is a fallback, **not a claim that every legacy paragraph has been manually translated**. Automatic translations and interactive features on Google's translated copy may vary. Form operations are verified on the original site, not on Google’s translated proxy. Further authored Tamil coverage should be built from the source content rather than indexing unreviewed machine translations.

## Validation

- 30 existing website journey checks passed (buyer-route expectation updated to match the corrected form).
- Existing travel core: 20 passed; travel DOM: 26 passed; information-hub core: 23 passed; Life Assistant: 32 passed; marketplace journeys: 34 passed.
- Chromium rendered 13 main pages at 390px and 1440px: no horizontal overflow, broken images, duplicate H1s or page-script errors in those checks.
- Additional browser journeys covered product prefill, safe text rendering of script-like user input, WhatsApp draft preparation, stale-draft invalidation and exclusion of query strings from translation links.
- Tamil selection persisted between the homepage and AI page. The explicit Tamil homepage won over a previously saved English preference.
- Automated WCAG A/AA checks on English/Tamil homepages, the buyer form and both new service pages: no violations after the contrast fix. This is not certification of the whole site or a substitute for human assistive-technology testing.
- Static scan of current root pages: no missing local link/image/script/stylesheet targets or missing static fragment targets; valid JSON-LD blocks; one H1 on each current page. Sources and archived pages are not given fabricated QA scores.
- Additional 320px and 768px checks covered both homepages and the buyer form. A Tamil text wrapping issue at 320px was fixed. No-JavaScript checks verified the static Tamil homepage and direct contact fallback.
- Desktop and mobile screenshots were inspected. Mobile previews show the initial viewport; desktop preview shows the whole page.

Local tests do not establish live search rankings, traffic growth, Core Web Vitals or Google indexing. No live WhatsApp message was sent. Existing public contact data and external reference destinations were not independently reverified during this code-focused release.

## SEO approach and owner follow-through

See KEYWORD-MAP.md for target phrases and actual destination pages. Keywords appear naturally in titles, headings, descriptions, service explanations and relevant internal links. There are no invisible keyword lists, fabricated local offices, duplicate country doorway pages or first-position guarantees. Google does not promise rankings based on a keyword count.

After applying and publishing: submit `https://podaturpet.com/sitemap.xml` in your existing Google Search Console property, inspect the homepage, Tamil homepage and three new commercial URLs, and monitor query/page impressions, clicks and actual enquiries. Compare equivalent 28-day periods. Do not treat a WhatsApp click as a completed order or lead. Confirm new customer enquiries manually.

Days 1–7: publish this release, inspect live page URLs and indexing, confirm enquiry handoff on your phone. Days 8–30: add accurate original town photos, business details and supplier/product specifications that you can verify. Days 31–60: complete authored Tamil translations for high-demand legacy pages and publish original answers to real buyer/project questions. Days 61–90: improve the pages with search impressions but weak click-through or enquiry completion; maintain dated sources and remove stale listings. Adjust priorities using real Search Console data.

Primary guidance consulted:
- https://developers.google.com/search/docs/specialty/international/localized-versions
- https://developers.google.com/search/docs/appearance/snippet
- https://support.google.com/translate/answer/2534559?hl=en

## Maintenance

The served HTML is the release output. Keep the changed files together. Old one-off redesign/patch scripts included in the uploaded archive should not be rerun blindly because they may restore old page copy. `tools/site_layout.py` now retains the global finishing assets during layout application. New page copy and static Tamil homepage content must be maintained alongside English, and reciprocal language annotations should be retained.

To run the additional browser suite, install `playwright`, `@sparticuz/chromium` and `axe-core` in your development environment and run `tools/tests/global_browser.cjs` from a temporary QA output directory. The existing DOM suites use jsdom. These development dependencies are not loaded by visitors.
