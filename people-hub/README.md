# People Information Hub / மக்கள் தகவல் மையம்

32 original bilingual guides, six categories, 40 official source records. English: `/people-information-hub.html`. Tamil: `/people-information-hub-ta.html`.

## Use
Search in English, Tamil or supported spelling aliases. Select a region and category. General guides remain visible with each region. India and Tamil Nadu filters include relevant national and Tamil Nadu guidance. “General / worldwide” shows only general guides; it is not the same as All regions.

Save shortcuts for the current page visit, or explicitly choose Keep shortcuts on this device. Only public guide IDs persist. Forget removes this hub's key only. There is no login, sync, search history, location permission, live API or background data fetching. Language links open separate static pages; unsaved session-only shortcuts/search filters do not transfer across a page navigation. Device-saved shortcuts are shared by both languages.

Today uses the device clock and the selected time zone; it is not a public-holiday or events feed. Fees, deadlines, results, vacancies, temple schedules and travel rules are intentionally obtained from official links. A source's review date is not a live-rule guarantee. After 90 days, a review-due warning appears. Limited-access sources are labelled separately even before 90 days.

Print one guide or the visible results, then choose Save as PDF in your browser. No PDF service or upload is involved. Permalinks include only a known guide ID; Copy never includes the search query.

## Editing and building
Edit `content.json` (guides and source register) and `locales.json` (UI/category/region strings). Run from the website directory:
```
python3 people-hub/build.py
```
This builds both HTML pages and data.js deterministically. Upload rendered files; Python is not needed by visitors. Do not manually edit generated pages or data.js. No network request occurs during the build. The existing tools/build_content.py is not run or changed by this update.

## More languages
Content fields are keyed by language and guide IDs are language-neutral. To add a language: add translated guide/UI/category/region fields, a slug in build.py's SLUGS, update hub.js language selection and core.js Intl locale mapping, generate all hreflang alternatives, add the new URL to sitemap.xml, then test labels, dates, font coverage and RTL layout where applicable. Do not publish machine-translated official rules as authoritative. This release supports English and Tamil only; no unsupported language button is shown.

## Maintenance
Review the source register monthly and before promoting a time-sensitive topic. Reopen each source, check its authority and function, review the original bilingual wording, and update only that source's date/evidence/status. Never advance review dates automatically. Remove or replace broken sources and regenerate. Keep figures, fees, vacancies, examination results and annual calendars out of static copy unless a dated editorial process is explicitly introduced. No submission endpoint or notification service exists in this release.

## Testing and preview
Requires Node 18+ for development tests only:
```
node people-hub/tests/core.test.cjs
npm install --prefix people-hub/tests --ignore-scripts --no-audit --no-fund
npm test --prefix people-hub/tests
python3 -m http.server 8000
```
Open http://localhost:8000/people-information-hub.html and the Tamil page. Test files' .gitignore excludes node_modules and generated package-lock. Website runtime has no npm dependencies.

See RESEARCH.md, SOURCES.md, FACT-CHECK-AND-PRIVACY.md, COPYRIGHT-LICENSE-REPORT.md, TEST-REPORT.md and CHANGES.md for scope and validation limits.
