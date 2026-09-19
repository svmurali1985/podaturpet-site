# Copyright, privacy and security report

## Original work and licensing

All added service taxonomy copy, Tamil/English interface text, parsing/matching logic, directory styling, moderation/outcome tools, tests and reports are original to this task. Existing user-supplied components are extended in place. No external site design, paragraph, image, logo, code snippet or provider database was copied. Sources are linked with original summaries; no regulator logo or endorsement is implied. There is no scraping job, paid API, Google Images asset or remote AI dependency.

The existing NotoSansTamil.ttf is reused unmodified under its existing SIL Open Font License 1.1. Keep travel-planner/fonts/OFL.txt. Copyright: 2022 The Noto Project Authors (https://github.com/notofonts/tamil). Font SHA-256: aa3a9b321f4b0bb2c40203ffbde9af89713227866e0e13f76e5b9eeea727cf88. Country/currency identifiers are factual standardized codes, not copied software. Native Intl formats labels/currencies; no downloaded locale package is bundled.

jsdom 26.1.0 (MIT) is development-only and already declared by the existing tests. Python/Node and WeasyPrint 66 (BSD-3-Clause)/Poppler support QA; no dependency binaries, node_modules or preview PDFs are bundled as runtime assets. Existing images, ads, logos and historical tools retain their prior rights status. This task did not prove ownership of every historical asset, so it does not provide an absolute legal guarantee for user-supplied material.

## Privacy

No precise user location, geolocation permission or address lookup. Search accepts a city/region/country and optional language. Inputs are page-local, not in URLs, shared storage or analytics. The assistant-to-directory link carries only a public service ID; the user confirms location in the directory. Matching never silently relaxes language, city or local/remote mode.

One named provider is chosen before contact. Consent is unchecked by default; changing request/channel/language or withdrawing consent destroys the prepared link/reference. WhatsApp gets the exact visible preview only when the user opens it; sending is a separate action in that app. Call/website links do not attach notes. External apps/sites have their own privacy practices and may receive identity when contacted. No enquiry is posted publicly or forwarded to multiple providers. No marketing consent is bundled.

Sensitive-pattern checks catch common long-number/email/URL inputs, not every personal fact. Users are explicitly asked not to enter confidential details or child identities. Local storage holds only optional stage totals; network sharing requires an independent visit-specific choice. The private operator store contains moderation evidence references and minimal outcome records outside the web root, with restrictive permissions. It is not encrypted automatically; OS access, secure backups and retention/deletion procedures remain owner responsibilities.

## Security controls

- Dynamic text uses textContent; server output is HTML-escaped. Public schema rejects unknown top-level and nested fields, preventing private application data from leaking into published JSON.
- Contact URLs are generated only from reviewed public channels. HTTPS public domain links reject credentials, IP addresses and unsafe schemes. No server-side fetching of supplied URLs occurs.
- Provider IDs, country/language/service enums, E.164 contacts, amount/currency precision and date validity are checked. Regulated services need the configured register, active status and permitted scope. Clinical/high-risk research-only categories cannot be approved.
- Moderation uses an owner-operated CLI, a private store outside the website, locks and atomic writes. Approval requires review; pause/revoke take effect publicly only after publish/rebuild/deploy. A different empty store cannot silently wipe managed public records.
- Expired providers are withheld at publication and refused by browser matching/contact actions. Registry checks are human review evidence, not an automated guarantee that a provider is legitimate.
- No personal enquiry/lead reference is sent to analytics. Duplicate old classifier events are suppressed for the new service component. GPC/DNT remain honored.
- Existing hub CSP and canonical language routes are retained. The directory adds no-referrer protection. Existing ad/analytics scripts on other pages retain their previous behavior.

This is a scoped code/privacy review, not a penetration test of the hosting platform, an automated identity-verification service or a global regulatory certification. Real provider checks and honest operator outcome recording are essential launch operations.
