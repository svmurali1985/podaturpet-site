# US ↔ India Family Travel Planner
A fully free, English/Tamil, browser-based planner. Open `/us-india-family-travel-planner.html` through a web server. No build step or account is needed.

Features: two travel directions, family document date reminders, parents checklist, 30/14/7/3-day and travel-day tasks, arrival tasks, three packing categories, medicines, gifts, bilingual emergency card, printing/PDF through the browser, explicit local save/load, JSON backup/import, and large text.

Save is explicit, not automatic. Reminders appear while using the page; there are no email, push or background alerts. Six-month passport warnings are planning buffers, not universal entry rules. Visa validity and I-94 permitted stay are separate. The planner does not determine eligibility. Official links and bilingual disclaimer are included.

Privacy: no passport/visa numbers, scans or dates of birth are requested. No analytics or ads load on this dedicated tool page; all pre-existing analytics/ads remain on existing pages. Form entries never enter network requests. The local saved plan and downloaded files are not encrypted. Other users, browser extensions and same-origin code can access browser storage. Use nicknames and minimal information. The server still sees ordinary page/asset requests.

## Development tests
Requires Node.js 18 or later. From the website directory:
```
node travel-planner/tests/core.test.cjs
npm install --prefix travel-planner/tests --ignore-scripts --no-audit --no-fund
npm test --prefix travel-planner/tests
```
The npm dependency is for testing only. Do not commit or deploy generated node_modules. No install is required to use the site.

For a local manual preview: `python3 -m http.server 8000`, then open http://localhost:8000/us-india-family-travel-planner.html . Local saves are specific to origin; localhost saves will not appear on the live website.

Before publishing, check on your actual phone and desktop browser: both languages, A+ size, each section, both routes, saved reload, JSON backup/import, and Print / Save as PDF (all pages and emergency card). See TEST-REPORT.md for completed checks and remaining limitations.
