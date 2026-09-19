# Existing analytics extension

No second visitor counter, tracking endpoint or analytics framework was created. podaturpet-visitor-tracking.js remains the only event sender. Existing general page_view/contact/business events remain on old pages. New directory interactions are excluded from the old generic quote/WhatsApp classifier so service enquiries do not become lungi clicks or duplicate contact counts.

| Journey stage | Recorded event / evidence | Meaning |
|---|---|---|
| Visit | existing page_view | General visit, not unique person |
| Search | market_search | Explicit valid service-filter submission |
| Profile | market_profile | Provider detail expanded |
| Contact | market_contact | Chosen provider channel link opened |
| Enquiry preparation | market_enquiry_prepared | Consented WhatsApp draft prepared |
| Enquiry handoff | market_enquiry_handoff | That draft opened in the message app |
| Received / qualified / quoted / won | private operator outcome record | Actual outcome attested with private evidence reference |

Local counts reuse the existing podaturpet.life.counts.v1 store with a backward-compatible allowlisted schema. Existing saved shortcut and travel/invoice storage keys are untouched. Directory local counts and network sharing are separate opt-ins. Network sharing is unchecked on every visit and is never inferred from old device-count consent. GPC/DNT block both. Hub CSP still forbids network connections; hub counts stay local.

New network events contain only the existing payload keys: event, page (origin + pathname), title, referrer origin and allowlisted campaign tags. They contain no service search text, city, language preference, provider ID, enquiry reference, quote amount, phone, email or message. A fixed event name cannot be replaced with arbitrary user text. Raw form values never enter this event payload.

The source ZIP does not contain the deployed Cloudflare Worker or its database schema. Browser delivery to the existing endpoint is implemented and tested against captured requests, but server acceptance/aggregation is not verified here. If the Worker uses an event allowlist, the owner must add the five names above in that existing backend before claiming a site-wide funnel. No unknown Worker was replaced or deployed. Check server-side aggregated event counts after a consented test visit; do not export raw logs with IPs or personal fields. Network errors are not represented as successful receipt.

The private CLI provides real recorded business-outcome reports now, without a paid API or new public lead database. Those records are distinct from anonymous web analytics: there is deliberately no user-tracking join between a person's search and a lead. No multi-user attribution, CRM synchronization, automated payment reconciliation or measured conversion-rate claim is fabricated.
