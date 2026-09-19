# Testing notes — 20 September 2026

## Passed
- 23 core tests: Unicode/Tamil search, AND matching, category/region intersection, India/Tamil/global inclusion, saved-only filtering, safe shortcut schemas, malformed storage, old/invalid review dates, time-zone day boundaries, localized dates, safe fragments and complete bilingual content/source references.
- 31 jsdom interface tests: both languages, aliases, filter reset, empty results, save opt-in, persistent round trip, removal without affecting another key, corrupted/denied storage, large text, hostile search text, labels, official-link attributes, static no-JS content, stale notices, deep links, category anchors, print preparation/restoration, copy success/failure and runtime error checks.
- Deterministic rebuild of both HTML pages and data.js; Node syntax checks; JSON/XML validation.
- Preservation audit: all 229 original files retained, 223 byte-identical, six intentionally modified. Original scripts, stylesheets, forms, titles and meta tags on changed pages remain. No existing invoice/travel source changed.
- Local asset paths and fragment targets validated. New pages load only hub scripts. Static code contains no network/analytics call or unsafe string-to-HTML path. CSP blocks connection and form targets.
- Print rendering: actual jsdom-generated print state rendered with WeasyPrint and the production stylesheet/font. English and Tamil Podaturpet guide samples are one page each, with sources and disclaimer; visually checked for Tamil glyphs and clipping. These are renderer checks, not native browser-print certification.
- Safe installer tested in a disposable Git repository: backup created, targeted files installed, unrelated content retained, conflicts rejected before any overwrite. ZIP integrity and every packaged website byte checked.

## Important validation limits
Cloud browser local-preview access was blocked in this session's environment. Real Safari/Chrome/Firefox layout, 320/390/768px device behavior, native Print/Save-PDF dialogs, clipboard permissions, CSP enforcement in a real browser, and screen-reader announcements are NOT end-to-end certified. jsdom has no visual layout engine. WeasyPrint screen experiments do not implement browser media-query behavior and are not evidence of mobile-browser correctness. Do not call the release exhaustively browser-tested.

## Existing baseline finding
Three missing relative assets occur only inside the old invoice-backup-20260919-124050/free-invoice.html snapshot. These pre-existing backup references were retained; deployed root invoice assets exist. No new missing local reference was introduced.

## Final device acceptance before push
1. Open both new URLs locally in Safari and on a phone; test normal/large text and keyboard focus.
2. Search Tamil and English, select a region/category, use clear and no-results states.
3. Save shortcuts, enable device saving, reload, change language and forget; confirm other tools' saved data remains.
4. Open a guide permalink and category anchor; copy a public link.
5. Print a single guide and filtered results in both languages; inspect every page of the native PDF.
6. Recheck external official links, homepage/town/useful-info entry links, invoice and family travel planner.

Tests are included. See README.md for exact commands. No tests submit applications, credentials, personal data or payments.
