# Podaturpet three-pillar refresh

Prepared against GitHub main commit d66d1c9e07e76bc0b47c0a1217ee8c118d890948. This update is prepared for review and has not been committed, pushed or deployed.

## Changes

- Three shared navigation pillars on all 36 active root pages: Lungis & textiles; Explore Podaturpet; Technology & collaboration. Fourteen existing redirect pages remain unchanged.
- English and Tamil homepages follow the requested eight-part order: lungi hero → featured collection → wholesale enquiry → why Podaturpet → buyer clarity → Explore Podaturpet → technology and collaboration → contact.
- Product photography replaces the AI lifestyle hero. Product images use responsive WebP sources, explicit dimensions, lazy loading below the hero and priority loading for the hero.
- Local stories, attractions, information, directory and advertising are grouped under Explore. All useful underlying pages remain. Regional photo assets and their attribution files remain available.
- Technology has concise service and collaboration links; its landing page now also links to textile concepts, research partnerships and the existing invoice tool.
- Buyer clarity uses factual purchasing steps, not invented testimonials, customer counts, certifications, guarantees or unverified production claims. Fabric, sample terms, MOQ, delivery and price remain items to confirm.
- The business dataset has no approved entries. The homepage transparently invites local businesses to submit details rather than showing fabricated advertisements.
- One final contact area preserves the existing public phone, WhatsApp and email. Wholesale CTAs continue to use the existing enquiry page.
- Feedback remains available on demand in the footer. Its timed invitation and associated state/timer code were removed.
- Unneeded assistant and community/directory JS and assistant CSS are no longer loaded on the homepage. Those features remain on relevant pages.
- Removed five scripts with no references from current HTML, JS or maintenance tools: town-map, market-enquiry, gentle-notifications, page-explorer and advertise-flash. Their history is retained by Git.
- Removed 113 unused earlier homepage CSS rules; retained shared responsive navigation and tool styles. Added a single dedicated homepage stylesheet.
- Shared navigation configuration and maintenance templates reflect the new hierarchy. Generated product enquiry links now point directly to the current enquiry form. Added two catalogue specification anchors for the featured designs.

## Performance evidence

Raw local resource sizes referenced by index.html, compared with files from the baseline commit:

| Resource group | Before | After | Reduction |
|---|---:|---:|---:|
| JavaScript | 75,549 bytes | 33,453 bytes | 55.7% |
| Stylesheets | 50,008 bytes | 28,052 bytes | 43.9% |
| Fallback image sources | 1,066,927 bytes | 212,144 bytes | 80.1% |

These are raw file totals, not compressed network transfers, Lighthouse scores or measured load times. Actual image downloads depend on viewport and srcset selection. The new layout has responsive breakpoints, a single-column mobile hero, wrapping actions, a collapsible shared menu, readable Tamil sizing and reduced-motion support.

## SEO and preservation

No useful page URLs were deleted. Existing 301 mappings, redirect stubs, robots.txt and sitemap.xml are unchanged. Both native homepages retain their own canonical URL and reciprocal en/ta/x-default hreflang links. Titles and descriptions now lead with wholesale lungis; Tamil metadata is localized. One H1 per homepage, semantic section headings and valid existing JSON-LD are retained. Historic homepage fragment IDs are preserved near related sections. Internal local file and fragment destinations resolve.

## Verification

PASS:
- 50 root HTML files checked for local href/src destinations, fragments and duplicate IDs: zero errors.
- All referenced local homepage files exist.
- JavaScript syntax check for feedback changes; Python compile check for changed maintenance tools.
- Homepage H1 count, JSON-LD parsing, CSS brace balance and maintenance CSS ordering.
- Existing SEO redirect/robots/sitemap files unchanged.
- git diff --check.
- Patch applied cleanly to a fresh worktree at the baseline commit; all 50 root pages passed the link/fragment checker again.

Browser verification limitation: the available browser blocked the localhost preview and disallowed file URLs. Desktop/mobile screenshots, rendered overflow, keyboard interactions, language switching and the WhatsApp review flow were therefore NOT verified in a browser. External links, production redirects and live delivery of enquiries were not end-to-end tested. No messages were sent. Preview on your Mac before publishing; no claim of a Lighthouse or mobile-rendering pass is made.

Suggested review: run `python3 -m http.server 8000` in the website folder after applying the patch, then visit http://localhost:8000. Inspect at 390px and desktop width, open Menu, switch English/Tamil, open each featured design, and prepare an enquiry without sending it. Check Feedback opens only when clicked. Stop the local server with Control-C.

## Files

See FILES-CHANGED.txt for the complete status/path list. Most HTML changes update only shared navigation, footer and asset cache versions. The substantive page edits are index.html, index-ta.html, lungi-product-catalogue.html and business-website-development.html.
