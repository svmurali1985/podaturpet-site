# Verification report

## Automated results

91 assertions/tests passed:

- 23 existing core tests: search, Unicode/Tamil marks, region/category selection, shortcut schemas, source age, timezone/date and source references.
- 31 existing DOM tests: both language pages, 36 static guides, bookmarks, print state, copy fallback, source warnings, malicious text, labels, IDs and denied storage.
- 32 new assistant tests: worked calculator examples and rejection cases, Tamil/English matching, unknown questions, sensitive inputs, DOM injection resistance, voice fallback, consent requirement/revocation, preview isolation, no default persistence/network, local counts opt-in/deletion/GPC/storage failure, directory search, existing assistant diaspora routing and preserved lungi routing.
- 5 real directory-publisher tests: isolated sponsored fixture, escaping and selected-page rebuild; no consent, stale/future dates and unsafe URL rejection.

No WhatsApp/email message, provider enquiry, payment or external analytics event was sent. Browser network functions were stubbed to detect unexpected calls in hub tests. The production hub retains connect-src none.

## Preservation and build checks

- All 251 original source/content files retained; no original page removed or renamed. Exact final changed/unchanged counts and paths are in CHANGES.md.
- Existing sitemap.xml, content/site.json, invoice implementation and font/license bytes unchanged. No new duplicate page or navigation entry needed.
- SEO metadata/canonical/hreflang unchanged on modified HTML pages. No newly introduced missing local asset/link target found in those pages.
- Static rebuild produces identical generated pages/data on repetition.
- JavaScript syntax and Python compilation checked. Installer integrity/conflict tests and ZIP integrity checked during packaging.

## Visual/accessibility scope

English desktop and Tamil narrow-layout static renderings were inspected using WeasyPrint. They check typography/content flow, not real browser rendering. Native form labels, visible focus, 44px-or-larger primary controls, language declarations, large-text mode and status announcements are implemented. CSS has single-column narrow-screen layouts and print exclusions for private enquiry controls.

The permitted browser preview environment did not allow local-site interaction. Therefore actual Safari/Chrome/iPhone/Android layout, screen-reader speech, operating-system voice availability, print dialogs and WhatsApp/mail app handoff are NOT end-to-end verified here. No Lighthouse score or WCAG certification is claimed. Before publishing: test each language at a narrow viewport, complete each calculator, revoke consent after preview, check a draft without sending, and verify a normal lungi enquiry. The package is ready for owner review; publishing has not occurred.

## Operational limits

Source fetch success is not proof that government transactions will work. No private government account was used. No approved business supply was invented. Funnel counts are device-local, not website-wide reporting; the analytics Worker source and CRM are absent from the source ZIP. Human lead handling and provider verification remain real operator responsibilities.
