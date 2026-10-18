# Verification — 18 October 2026

## Completed

| Check | Result |
| --- | --- |
| Clone main and record baseline | PASS — 27a11f2e9a2986bf689d496f3ee3b8f5f75b3235 |
| Repository instructions | No AGENTS.md found. Read README, content-maintenance guidance, relevant prior refresh reports/source registers, hosting and Worker configuration. |
| Internal files, links, anchors and duplicate IDs | PASS — `python3 tools/check_site_links.py`, 52 root HTML pages, 0 errors |
| Dated news search, Tamil switch, topic/reset, expired dates, no-JS content | PASS — 12 tests in `docs/local-refresh/dom-test.cjs` (expected total updated from four to six notices) |
| Attractions, bilingual filters, deep links, schema anchors, retained scripts | PASS — 15 tests in `docs/town-discovery/dom-test.cjs` |
| Changed-page local script initialization, keyboard menu, Tamil/English leaves, heading/canonical presence, native Tamil fallback | PASS — 10 page checks in `docs/refresh-20261018/verify.cjs`; network mocked, no messages or external writes |
| Existing buyer draft suite | First 21 assertions PASS: three enquiry entry points, WhatsApp/email draft content, input safety, clipboard, language change and negative quantity |
| JSON-LD syntax | PASS — 28 root-page JSON-LD blocks parse as JSON; retained destination schema maps to 14 visible anchors |
| Sitemap XML/crawl-readiness | PASS — 37 unique existing URLs, each resolves locally, matches page canonical and has no noindex meta. Only the 10 substantively changed HTML URLs receive lastmod 2026-10-18. |
| Home language alternatives | Existing reciprocal en/ta/x-default links and self-canonicals preserved; new Tamil homepage panels have native Tamil fallback text without JS |
| JavaScript syntax and whitespace | PASS — `node --check podaturpet-local-updates.js`, `git diff --check` |
| Images | Two new local WebP derivatives decode: 480×270 (18,050 bytes), 960×539 (77,848 bytes). Source image identity/licence checked; dimensions, srcset, sizes, lazy loading and credit provided. |
| Existing integrations | Enquiry, language, analytics, consent-related scripts, community configuration/Worker, maps, comments and admin files are unmodified. Modified pages initialize local scripts without synchronous exceptions in DOM tests. |

## Pre-existing legacy test failure (not hidden)

`docs/seo-buyer-update/dom-test.cjs` fails at line 23 after 21 passing assertions: it expects zero tracking POST requests before opt-in but the baseline `podaturpet-visitor-tracking.js` records an aggregate view unless declined or privacy-blocked. Observed actual 1, expected 0. Reproduced the same assertion against a clean `git archive` of the original baseline commit. The suite also contains older country/state-only UI expectations while current main displays aggregate city counts.

This refresh did not change the analytics policy or its code. Public reporting remains aggregate; no IP address or individual visitor record was added. The failing legacy test is reported rather than weakened to manufacture a green result. Review the existing consent policy separately if you want collection to require affirmative opt-in. Later assertions in that suite were not reached.

## Not completed / requires a browser, deployment or credentials

- Desktop/mobile rendered screenshots, real-device Tamil font rendering, responsive overflow, browser console/network review and measured accessibility/performance. The managed runtime lacks the supported control-browser capability; no substitute browser route or visual score is claimed. CSS breakpoints and DOM navigation checks are not rendered layout tests.
- Actual WhatsApp, phone and email app opening/delivery. Draft preparation tested; no enquiry sent.
- Live Worker, comments, consent persistence across actual browsers, administration login and durable service writes. No private credentials provided and no external state changed.
- Google Search Console indexing diagnostics/submission, Rich Results Test, Schema Markup Validator and live crawler behavior. JSON syntax and local canonical checks do not establish rich-result eligibility or indexing.
- Full external-link crawl: new factual source pages were retrieved via web search, with failures recorded in SOURCES.md. Interactive NTES/booking flows were not exercised. Historical external links on unchanged pages were not exhaustively checked.
- Existing asset ownership outside the reverified Nagari derivative was not independently re-established; existing captions and registers retained.

## Maintenance

The update adds static source-backed sections outside the content generator's shared-header/footer/product markers. Do not run historical redesign scripts. Normal `tools/build_content.py` marker updates should preserve these sections; inspect the diff whenever regenerating. Refresh notices by checking official sources, not by changing dates. New dependencies were installed only in `/tmp/podaturpet-qa`, not the source checkout or downloads.
