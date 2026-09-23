# Community update — changes and verification

Built against the uploaded `website(20260923-010345).zip`.

## What changed

- 36 existing active HTML pages receive the shared comments widget and optional page-count controls. All 14 redirect pages are preserved byte-for-byte. No useful page was removed. Existing canonical URLs, main content and tool inputs are retained.
- One quiet, non-modal “Add your comments” invitation per tab session after 30 seconds; it does not interrupt typing or another open dialog. A permanent button and User comments section remain on every active public page. English/Tamil form labels follow the site language.
- Comments ask for optional public name, town/country and purpose plus a required message. Explicit publication/rights checkbox. Pending comments are private; only approved comments display below their page. More-comments pagination, text-only rendering, loading/error/empty states and submission reference are included.
- Removed the WhatsApp-only feedback workflow and public live-visitor counter calls. A private noindex admin page provides page/date/location counts and approve/delete controls. Anonymous people cannot be identified; analytics are consenting page loads, not people or individual histories.
- Added source-controlled Cloudflare Worker + D1 schema and a single-file version for browser dashboard deployment. Server-side authentication, exact-origin checks, known page allowlist, bounded input, parameterized SQL, signed one-use forms, proof-of-work, daily caps and retention cleanup.
- Analytics off before consent; GPC/DNT respected. Stored aggregates contain day/page/country/region/city/count only. No IP, cookie identifier, fingerprint, referrer, query or form data is stored by this analytics application. Existing device-only tool counters preserved.
- Privacy notice updated in English/Tamil. Tool notices clarify the separation from optional site page counts/comments. Backend setup, licence/cost scope and old-tracker retirement instructions included.
- Shared layout helper integrates the feature idempotently and excludes the private admin page from the public shell. No preview files or fake testimonials/data added.

## Main files

- Public UI: podaturpet-feedback.js, podaturpet-feedback.css, podaturpet-community-config.js.
- Tracking: podaturpet-visitor-tracking.js; podaturpet-visitor-counter.js becomes a harmless compatibility stub.
- Private dashboard: community-admin.html, community-admin.js, community-admin.css.
- Backend: community-worker/worker.mjs, pages.mjs, worker-dashboard.mjs, schema.sql, wrangler.toml, build-dashboard.py, worker.test.mjs, LICENSE, SETUP.md.
- Integration/privacy: 36 existing HTML pages, podaturpet-editorial.js, travel-planner/i18n.js, tools/community_layout.py, tools/site_layout.py, tools/check_site_links.py, ANALYTICS-NOTES.md, local-secret exclusions.
- Complete exact paths: FILES-CHANGED.txt and the package-root changed-files.txt.

## Verification completed

- Eight Node built-in tests against in-memory SQLite exercising the actual Worker route code and SQL: auth/origins/disabled service, analytics consent/GPC/aggregation, pending→approve→delete, replay prevention, bounded validation, free-service application caps, expiry/cleanup, page-scoped pagination and signed-token tampering.
- Client DOM tests: no request before opt-in, refusal/GPC, no duplicate count, no query-string leakage, form consent, popup session rule, modal controls, literal rendering of HTML-like comments, submission receipt and unconfigured disabled state. A local development-only jsdom harness was used; no jsdom code/dependency is shipped or loaded by the website.
- Admin DOM test: no unauthenticated startup requests, memory-only token, text-only comment rendering and data cleared on sign-out.
- JS syntax and Python compile checks passed.
- 51 root HTML pages checked (50 original + admin): 0 missing local link targets, 0 missing local assets/fragments reported by tools/check_site_links.py.
- Feature integration verified idempotent on all 36 active public pages, one script instance each, configuration loaded first.
- No Cloudflare production integration, account plan, live mobile visual test, external-link health or old server data retention was verified. No new service is live yet.

## Activation and practical limits

The public API URL is intentionally blank and Worker ENABLED defaults to false. Configure your own Workers Free account, D1 binding, private secrets and cleanup trigger using community-worker/SETUP.md. Then set the public API URL and publish. Copying HTML alone does not activate shared storage.

No paid service or library was added. A Workers Paid account is not guaranteed zero-cost: the account must actually be Workers Free. App caps and provider quotas can make the optional features unavailable while the static site continues to work. Anti-spam checks do not guarantee bot-free submissions or accurate human counts.

The old remote tracker was not supplied and has not been changed remotely. Disable or restrict it after migration; publishing new files alone does not remove its old public statistics or historical records. The provided legal/privacy safeguards do not certify the rights to all pre-existing content or worldwide legal compliance.
