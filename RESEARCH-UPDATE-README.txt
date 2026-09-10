PODATURPET — RESEARCH IMPLEMENTATION
Prepared 10 September 2026. Based on the package corresponding to commit 446031f.

INSTALL
1. Unzip this download.
2. Copy the CONTENTS of website/ into your existing website folder. Replace matching files.
   Do not replace or delete your .git folder. No files need to be deleted.
3. From your existing website folder run:
   git status
   git add .
   git commit -m "Improve buyer journey, bilingual controls and enquiry tracking"
   git push origin main
4. After GitHub deployment completes, reload with Command+Shift+R.

CHANGES
- Homepage: catalogue and quote actions first; smaller seller and partnership links.
- Real product section comes before the town story; quote form comes before lifestyle inspiration.
- Existing photos, local guides, innovation pages and optional weaving video retained.
- Hero illustration labelled as AI lifestyle imagery; no new third-party images.
- All six catalogue references pass through to product and quote pages.
- Shared quote handler supports WhatsApp and email without popup dependence.
- Market queries preselect destinations, including destinations outside the standard list.
- English/Tamil controls across content pages; 153 additional dictionary entries cover
  navigation, catalogue descriptions, product choices, form fields, hints and messages.
  Translated passages use lang="ta"; stable English/reference values remain behind options.
- Other-language selector opens Google translation in the chosen language.
- No customer form information is stored in localStorage or added to analytics events.
- Tracking records a contact-app handoff as an existing contact click event, not an order.
- Removed the separate duplicate contact tracker and inaccurate qualified-enquiry event.
- Analytics referrer reduced to the origin, excluding path and query details.
- Consistent short privacy notices; no names or IP addresses displayed.
- Weaving overview explains manufacturing, other business introductions and town information.
- Removed the homepage's repeated specification strip; linked repeated weaving explanation
  to the dedicated process guide. Added clearer supplier and prototype enquiry guidance.
- Legacy URLs retain instant meta-refresh and canonical fallbacks suitable for static hosting.
  Removed noindex used alongside the permanent-move signals. _redirects remains available
  for compatible hosts, but it does NOT establish HTTP 301 behavior on GitHub Pages.

VERIFICATION COMPLETED
- 41 HTML files checked for duplicate IDs and missing local href/src targets.
- Inline JavaScript syntax checked; new and edited shared JavaScript syntax checked.
- Isolated functional checks: exact SKU prefill, destination propagation, preserving
  a different selected SKU, WhatsApp and email message construction, Tamil message,
  invalid-form blocking, query sanitization and no customer data in handoff events.
- ZIP contents verified against the prepared source.

AFTER DEPLOYMENT
- Try /?product=PT-WC-01&market=Chennai#quick-quote and verify both selected values.
- Try /lungi-wholesale-worldwide.html?product=PT-NC-06&market=Finland.
- Switch English/Tamil; test the form and email alternative on your iPhone and Mac.
- Confirm your analytics dashboard receives contact clicks. A click is not proof of a sent message.
- Check legacy UAE and Chennai URLs and inspect canonical selection in Search Console.

OWNER INPUT STILL REQUIRED
No fabric composition, dimensions, MOQ, price, stock, capacity, certifications,
workshop address, response-time promise or investment figures were invented.
Provide confirmed specifications for the six references and business details for publication.
Editorial town, guide and innovation content is not fully translated; the switch accurately
states that it covers buying controls and selected content. Have Tamil copy reviewed by a
native speaker before calling the whole site fully bilingual.
Real-device/browser visual QA, backend data-retention verification, received-message tests,
Core Web Vitals and Search Console indexing verification have not been completed in this update.
This download changes source files; the live site changes only after you push and deploy.
