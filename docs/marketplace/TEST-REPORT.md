# Verification report — 2026-09-19 UTC

145 automated tests passed against the finished source:

| Suite | Passed |
|---|---:|
| Existing People Hub core | 23 |
| Existing Hub DOM | 31 |
| Existing Tamil Life Assistant | 32 |
| Existing directory publisher | 5 |
| New marketplace browser-DOM journeys | 34 |
| New private moderation / publication / outcomes | 20 |

The new journeys cover Tamil/Tanglish service parsing (including Toronto la Tamil accountant venum), explicit location confirmation, unknown cities, exact country/city/language/mode filters, no silent fallback, expiry, currency rendering, profile/contact consent, preview/reference generation, consent revocation, website-only contacts, storage denial, GPC, two independent analytics choices, no personal analytics fields, no duplicate lungi contact event, labels/unique IDs and shared assistant routing. Real provider fixtures exist only inside isolated tests, never the delivered public dataset.

Private workflow tests run intake → review → approval → public export → the real existing HTML builder, as well as pause/removal, rejected private-field exports, professional register/scope rules, safeguarding, unsafe links, old/future dates, private store boundaries, unknown-record protection and received/qualified/quoted/won/withdrawn outcome handling. These are synthetic workflow tests, not identity checks on real businesses.

## Preservation and build checks

All 287 retained original files remain. All 46 root HTML pages remain; no new directory page is created. Existing canonical and hreflang links are unchanged. No newly broken local references in modified HTML were found. Existing lungi pages, invoice tool, travel planner, image/font assets, sitemap and counter/ad files are byte-identical. Shared assistant, community and analytics scripts are intentionally extended and regression-tested. Original businesses.json remains an empty list; 24 existing local retail categories remain available.

Changed/new JavaScript passes node --check. The existing Hub and directory builders produce byte-identical output across two consecutive builds. Package verification separately checks installer conflict refusal, hash integrity, backup/application, preservation of unrelated files, Git whitespace and ZIP integrity.

## Visual and environmental limits

English desktop and Tamil narrow layouts were inspected using static rendered output. A clipped long Tamil button was corrected with wrapping and scoped sizing. WeasyPrint is not Chrome/Safari: actual mobile browser layout, screen-reader interaction and native WhatsApp/call handoff must still be checked on a device. DOM tests do not prove native-browser end-to-end behavior.

The deployed analytics Worker source is not in the supplied ZIP. Fixed new event payloads and consent gating are tested in a stub; remote acceptance, storage and aggregate reporting have NOT been verified or deployed. Existing page-view behavior is preserved. Real enquiries and business outcomes require recipient confirmation and honest private operator records; a contact click is not a received enquiry or sale.

## Repeat the automated tests

```bash
cd "$HOME/website/people-hub/tests"
npm install --ignore-scripts
npm test
cd "$HOME/website"
python3 people-hub/tests/directory.test.py
python3 -m unittest discover -s tools/tests -p '*test.py'
```

Node dependencies are test-only. Do not stage node_modules or Python cache directories. Preview with python3 -m http.server 8000 from the website folder and visit the existing directory and both Hub languages. Test empty-result behavior first; onboard a real provider through the private CLI before expecting genuine matches. Never deploy the synthetic test fixtures.
