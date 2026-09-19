# Test report — 19 September 2026

- 20 core tests passed: dates/leap years/calendar boundaries, stage due dates, itinerary validation, route/parent filtering, passport/visa/I-94 warnings, schema validation, oversized/malformed data, unique IDs, and original bilingual task data.
- 26 jsdom interface tests passed: fields, tasks/progress, packing, medicines/gifts, English/Tamil translations, large text, section switching, explicit save/load/delete, malformed/valid imports, denied storage, safe text insertion, print-content assembly and no runtime exceptions.
- All planner JS passes Node syntax checks. JSON and sitemap XML parse. Referenced local assets exist. Existing scripts, titles and meta tags on modified pages remain present.
- Preservation audit: 207 original files retained, 202 byte-identical, exactly five modified. Existing invoice code, styles, analytics, advertisements and other tools are unchanged.
- Print QA used actual generated print DOM with the production stylesheet and bundled Tamil font in WeasyPrint. Visually inspected all five full-plan pages and the one-page emergency card. Tamil rendered; no observed clipping/overlap. This checks print layout in that renderer, not a browser's print dialog.

## Browser testing limitation
The environment blocked local preview in its browser. Real Chrome/Safari/Firefox visual rendering, phone/tablet viewports, native date pickers, CSP behavior in browser, file downloads and native Print/Save-as-PDF dialogs were NOT verified end-to-end. Responsive CSS is implemented but a real device check remains required before claiming full browser acceptance. jsdom is not a visual browser. No claim of exhaustive testing or government-rule compliance is made.

## Official reference review
Included official links cover State Department India travel, Indian e-Visa, OCI, US visa expiry versus stay, USA.gov I-94, CDC medicines, TSA liquids, customs and emergency contacts. Changing rules are deliberately linked, not duplicated as definitive advice.
State Department, Indian e-Visa, USA.gov, CDC and 911 pages were accessible during review. TSA/MHA were supported by official search results; CBP blocked automated access, CBIC timed out and OCI exposed only its loading shell. Those official links need user-side verification. Links are maintained centrally in content.js. Review date is not a promise that all rules remain current.

## Remaining manual acceptance
Open the tool on an iPhone/Android phone and desktop browser; inspect English and Tamil at normal and large sizes, enter a test itinerary, save and reload, import/export a backup, print the full plan and card, then delete test data. Check homepage/town-guide links and existing invoice tool. Do not enter real sensitive data for testing.
