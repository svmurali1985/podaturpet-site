# Testing and release review

227 automated assertions/tests passed:

| Suite | Passed |
|---|---:|
| Existing People Hub core | 23 |
| Existing Hub DOM | 31 |
| Existing Life Assistant | 32 |
| Existing marketplace journeys | 34 |
| Existing private moderation/publication/outcomes | 20 |
| Existing directory publisher | 5 |
| Travel planner core | 20 |
| Travel planner DOM | 26 |
| New reorganization journeys | 36 |

The new tests initialize all local scripts on the homepage and nine representative app/content pages, then exercise shared mobile-menu state/Escape focus, English/Tamil switching and routes, old quote-anchor disclosure, product preselection, original wholesale message preparation, invoice add-item behavior, planner Tamil/large-text controls, unique IDs, one feedback trigger and textile-only context propagation. Actual external messages are never sent in testing.

Preservation audit: all 303 retained original files remain; 46 root HTML URLs remain; all original form IDs and field names remain; every original homepage ID remains as content or a compatible anchor alias. No broken local file/anchor references found in the active pages. All canonical/hreflang destinations, sitemap and 14 redirects are preserved. All image assets, provider/product/event datasets, marketplace model, analytics/counter scripts and core tool logic are byte-identical. Changed/new JavaScript passes syntax checks. Both existing builders produce byte-identical results across two repeated builds.

The old Hub injection test assumed exactly one image on the page. It now compares image count before/after the malicious input, preserving the security assertion while allowing the shared footer logo. No security gate was weakened.

## Visual and end-to-end limits

Static English/Tamil renders were used to examine typography, copy and grouping. The available PDF renderer does not reproduce all browser Grid/Flex/media behavior, so these are not browser screenshots or proof of final responsive layout. Native Safari/Chrome/mobile, screen readers, external WhatsApp/call/email apps and real printing need device verification. Automated end-to-end coverage here means complete local DOM workflows with stubbed external services, not a claim of live browser/hosting verification.

No live site was modified. The deployed analytics Worker was not supplied; existing tracking code is unchanged and server-side acceptance of prior marketplace events remains unverified. No invented provider, visitor total, enquiry or business result is shipped.

## Repeat tests

```bash
cd "$HOME/website/people-hub/tests"
npm install --ignore-scripts
npm test
cd "$HOME/website"
python3 people-hub/tests/directory.test.py
python3 -m unittest discover -s tools/tests -p '*test.py'
NODE_PATH="$HOME/website/people-hub/tests/node_modules" node tools/tests/site_journeys.cjs
NODE_PATH="$HOME/website/people-hub/tests/node_modules" node travel-planner/tests/core.test.cjs
NODE_PATH="$HOME/website/people-hub/tests/node_modules" node travel-planner/tests/dom.test.cjs
```

Do not stage node_modules or Python cache directories. The installer is separately tested for package hashes, conflicting-edit refusal before mutation, backups, scoped application, preservation of unrelated files, whitespace and ZIP integrity.

## Device preview before publishing

Run python3 -m http.server 8000 from the website folder. Check the homepage in English/Tamil at phone and desktop widths, open the menu and close with Escape, follow all five area links, open /?product=PT-WC-01#quick-quote, switch the planner to Tamil and verify invoice Print/PDF preview. Test directory empty results and open the existing assistant/feedback. Review external message drafts without sending test enquiries to real recipients.
