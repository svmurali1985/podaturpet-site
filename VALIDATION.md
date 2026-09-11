# Validation — 11 September 2026

Passed:

- All 40 top-level HTML pages checked for local navigation, fragments, scripts, image sources, responsive image variants and video posters; none missing.
- All 26 content pages have one H1 and one shared primary navigation, with no duplicate IDs. Fourteen existing redirect pages preserved.
- All 12 root JavaScript files and executable inline scripts pass Node syntax checks. JSON-LD blocks parse successfully.
- Content generation tested in a temporary copy: unapproved businesses and expired events excluded; HTML escaped; incomplete approved records rejected; repeat generation leaves output unchanged. Test records are not in the deliverable.
- Isolated JavaScript checks cover event-specific form requirements, whitespace rejection, encoded WhatsApp handoffs and expired-event hiding. No messages were sent.
- Isolated tracker checks cover approved campaign tags, query/form-data exclusion, distinct community handoffs, and privacy opt-out behaviour. No live analytics requests were made.

Limits:

- No live deployment, authenticated analytics access, backend integration test, Lighthouse measurement or browser visual/device test was performed.
- Responsive CSS is included, but final appearance and native app opening should be checked on your phone and desktop after local preview or publication.
- External map, government and contact links retain the supplied sources; current business hours and events were not independently collected for this code update.
- New town photos, interviews, verified businesses, event dates and product specifications remain dependent on real material from you or contributors.
