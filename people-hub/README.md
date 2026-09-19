# Tamil Life Assistant + People Information Hub

A free bilingual, static-first extension of the existing hub. No new duplicate hub URL, directory, floating assistant, CSS bundle, ad network or analytics backend.

English: https://podaturpet.com/people-information-hub.html#life-assistant
Tamil: https://podaturpet.com/people-information-hub-ta.html#life-assistant
Directory: https://podaturpet.com/podaturpet-local-business-directory.html

## What works

- Ask in Tamil or English: original local topic matching across 36 bilingual guides, with clear fallback. It is not a cloud AI, legal adviser or government application service.
- Reuse official guide steps, dated source records, older-review warnings, country filters, bookmarks, larger text and existing print controls.
- Education cost/funding-gap/monthly-saving plan and same-budget remittance quote comparison. User inputs only; no rates, fees or deadlines supplied by the tool.
- Human help: explicit consent → exact message preview → user-selected WhatsApp/email draft → user sends in their own app. Editing or withdrawing consent destroys the links. No external message was sent during testing.
- Optional on-device read-aloud if the browser exposes a matching local voice; typed interaction always available. No microphone.
- Optional, deletable and exportable device-only funnel counts; off by default. No network analytics on hub pages.
- Existing directory filtering consolidated into podaturpet-community.js, with Tamil search aliases. Sponsored records are labelled by the existing publisher; no example businesses were published.
- Existing Family Travel Planner, invoice tool, lungi pages, ads and visitor counter remain in place. Lungi-specific enquiries retain their existing assistant paths; government/diaspora topics route to the hub.

## Maintain

Edit content.json / locales.json, then run from website root:

```bash
python3 people-hub/build.py
```

life_template.py contains the new original interface markup. Shared assistant/tracking scripts detect hub mode. hub.js remains the existing search/bookmark/print implementation. core.js contains pure matching and arithmetic helpers. Official-source content is never fetched in the visitor's browser. CSP prevents hub network connections and form uploads; link navigation remains available.

Tests (development only; npm requires network to install jsdom):

```bash
cd people-hub/tests
npm install --ignore-scripts
npm test
python3 directory.test.py
```

Tests do not send messages or contact providers. Do not commit node_modules. The directory publisher test uses an isolated temporary folder. See TEST-REPORT.md for exact scope and unverified browser behaviors.

Before publishing, preview both language pages in your browser. Verify that the existing contact recipient in content/site.json is the intended Podaturpet team; the generated hub uses it. Read REVENUE-AND-OPERATIONS.md before accepting leads or paid listings. No blanket regulatory or historical-asset copyright certification is claimed.
