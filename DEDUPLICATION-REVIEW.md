# Website duplicate-content cleanup

Reviewed 41 HTML files and all linked/local JavaScript. Applied to the latest website package from this conversation, following commit 15346e8.

## Changes

- Removed four hidden duplicate homepage town/map/retail sections. Their destinations remain available through the local-information hub.
- Removed four repetitive product tiles and one repeated hero detail image. The two white/border cards complement the separate blue/pattern photo feature.
- Removed the repeated homepage FAQ and FAQ schema; retained a link to the dedicated buying guide.
- Removed eleven repeated footer SEO link walls from retained pages; retired location pages also no longer contain those walls.
- Consolidated thirteen mostly interchangeable market pages into two destination-aware buyer guides.
- Added fifteen legacy page redirects (thirteen market pages, the old nested homepage, and the former ModuLungi URL). Also mapped the old directory and sitemap routes.
- Removed the catalogue copy of the lifestyle gallery and two duplicated images from the Modern Lungi gallery.
- Removed duplicate advertising popup activation from the homepage; retired the unused rotating-notice script. Seller and local-advertising buttons remain.
- Removed JavaScript that moved homepage sections after load; the HTML order is now the display order.
- Updated internal links and sitemap to canonical destinations.

## What was intentionally retained

Shared branding, menu links, privacy links, and a relevant enquiry CTA may recur across pages. Distinct product descriptions, town services, research concepts and manufacturing explanations were kept. Reusing a relevant product image on its own detail page is intentional. This cleanup does not promise search rankings or sales.

## Page-by-page review

| Page | Outcome |
| --- | --- |
| about-podaturpet.html | Retained town facts and source links; removed repeated footer link wall. |
| blue-border-lungi-wholesale.html | Retained distinct product detail. Simplified repeated enquiry guidance where present; checked links and assets. |
| cotton-lungi-wholesale.html | Retained distinct product detail. Simplified repeated enquiry guidance where present; checked links and assets. |
| handloom-lungis.html | Retained distinct product detail. Simplified repeated enquiry guidance where present; checked links and assets. |
| how-checked-lungis-are-made.html | Retained step-by-step production explainer; removed repeated footer link wall. |
| index.html | Streamlined homepage: product introduction, two white design cards, photo feature, one AI lifestyle gallery, enquiry form, market selector and one local-information hub. |
| lungi-product-catalogue.html | Actual photographed designs. Removed duplicated AI lifestyle gallery; link points to its homepage location. |
| lungi-suppliers-mumbai.html | Redirects to `/lungi-wholesale-india.html?market=Mumbai`. Original content consolidated. |
| lungi-wholesale-bengaluru.html | Redirects to `/lungi-wholesale-india.html?market=Bengaluru`. Original content consolidated. |
| lungi-wholesale-chennai.html | Redirects to `/lungi-wholesale-india.html?market=Chennai`. Original content consolidated. |
| lungi-wholesale-delhi.html | Redirects to `/lungi-wholesale-india.html?market=Delhi`. Original content consolidated. |
| lungi-wholesale-hyderabad.html | Redirects to `/lungi-wholesale-india.html?market=Hyderabad`. Original content consolidated. |
| lungi-wholesale-india.html | Single India buyer guide with destination selector and enquiry form. Replaces seven near-identical city/state pages. |
| lungi-wholesale-kerala.html | Redirects to `/lungi-wholesale-india.html?market=Kerala`. Original content consolidated. |
| lungi-wholesale-kolkata.html | Redirects to `/lungi-wholesale-india.html?market=Kolkata`. Original content consolidated. |
| lungi-wholesale-worldwide.html | Single international buyer guide with destination selector and enquiry form. Replaces six near-identical country pages. |
| modern-lungi-global-collection.html | 14 distinct gallery cards; removed city image repeated by hero and how-to image repeated by dedicated instructions. |
| modern-lungi-investors-research-partners.html | Retained: dedicated partner/research purpose. |
| modern-lungi-product-innovation.html | Retained: prototype mechanics and testing topics differ from the visual concept gallery. |
| modulungi-product-innovation-concept.html | Redirects to `/modern-lungi-product-innovation.html`. Original content consolidated. |
| podaturpet-government-offices.html | Retained public office contacts; repaired links to town guide and advertising enquiries. |
| podaturpet-local-business-directory.html | Retained searchable business categories; repaired advertising navigation. |
| podaturpet-lungi-weaving-story.html | Retained local weaving narrative; removed repeated footer link wall. |
| podaturpet-site-v1/index.html | Redirects to `/`. Original content consolidated. |
| podaturpet-stories-and-culture.html | Retained cultural stories; repaired navigation. |
| podaturpet-textile-supplier-enquiry.html | Retained supplier/business enquiry flow. |
| podaturpet-tourist-places.html | Retained regional destination guide; repaired navigation. |
| podaturpet-town-guide.html | Retained as town-service navigation; detailed facilities and tourist pages serve separate purposes. |
| podaturpet-travel-pin-code.html | Retained concise travel and location reference. |
| podaturpet-useful-information.html | Retained practical transport, education and facilities detail. |
| podaturpet-weaving-textiles.html | Retained weaving-method comparison; removed repeated footer link wall. |
| powerloom-lungis.html | Retained distinct product detail. Simplified repeated enquiry guidance where present; checked links and assets. |
| privacy-policy.html | Retained policy content; legitimate shared policy/navigation text is not treated as a duplicate page. |
| white-checked-lungi-wholesale.html | Retained distinct product detail. Simplified repeated enquiry guidance where present; checked links and assets. |
| wholesale-lungi-sample-buying-guide.html | Canonical detailed sample/order guidance; homepage now links here instead of repeating the FAQ. |
| wholesale-lungis-malaysia.html | Redirects to `/lungi-wholesale-worldwide.html?market=Malaysia`. Original content consolidated. |
| wholesale-lungis-oman.html | Redirects to `/lungi-wholesale-worldwide.html?market=Oman`. Original content consolidated. |
| wholesale-lungis-saudi-arabia.html | Redirects to `/lungi-wholesale-worldwide.html?market=Saudi%20Arabia`. Original content consolidated. |
| wholesale-lungis-singapore.html | Redirects to `/lungi-wholesale-worldwide.html?market=Singapore`. Original content consolidated. |
| wholesale-lungis-sri-lanka.html | Redirects to `/lungi-wholesale-worldwide.html?market=Sri%20Lanka`. Original content consolidated. |
| wholesale-lungis-uae.html | Redirects to `/lungi-wholesale-worldwide.html?market=UAE`. Original content consolidated. |

## Validation

- All 41 HTML files checked for duplicate IDs, missing local assets, broken local links and missing anchors: zero findings after fixes.
- JavaScript syntax checked for external and inline executable scripts: 15 checks passed.
- Sitemap destinations exist and exclude consolidated pages.
- No browser visual or interaction testing was performed. No deployment was performed.

## Publishing

Copy this website folder into your existing repository, preserving .git. Review git status, then commit and push. No installer is required.

`_redirects` provides 301 mappings for hosts that support this file. Every consolidated HTML page also includes a noindex canonical redirect fallback so old HTML links still lead to the new guide. Verify hosting deployment after pushing.

## Files changed in this cleanup

- `_redirects`
- `about-podaturpet.html`
- `blue-border-lungi-wholesale.html`
- `cotton-lungi-wholesale.html`
- `handloom-lungis.html`
- `how-checked-lungis-are-made.html`
- `index.html`
- `lungi-lifestyle-gallery.css`
- `lungi-product-catalogue.html`
- `lungi-suppliers-mumbai.html`
- `lungi-wholesale-bengaluru.html`
- `lungi-wholesale-chennai.html`
- `lungi-wholesale-delhi.html`
- `lungi-wholesale-hyderabad.html`
- `lungi-wholesale-india.html`
- `lungi-wholesale-kerala.html`
- `lungi-wholesale-kolkata.html`
- `lungi-wholesale-worldwide.html`
- `modern-lungi-global-collection.html`
- `modulungi-product-innovation-concept.html`
- `podaturpet-gentle-notifications.js`
- `podaturpet-government-offices.html`
- `podaturpet-local-business-directory.html`
- `podaturpet-lungi-weaving-story.html`
- `podaturpet-market-enquiry.js`
- `podaturpet-site-v1/index.html`
- `podaturpet-site-v1/sitemap.xml`
- `podaturpet-stories-and-culture.html`
- `podaturpet-tourist-places.html`
- `podaturpet-travel-pin-code.html`
- `podaturpet-weaving-textiles.html`
- `powerloom-lungis.html`
- `sitemap.xml`
- `white-checked-lungi-wholesale.html`
- `wholesale-lungi-sample-buying-guide.html`
- `wholesale-lungis-malaysia.html`
- `wholesale-lungis-oman.html`
- `wholesale-lungis-saudi-arabia.html`
- `wholesale-lungis-singapore.html`
- `wholesale-lungis-sri-lanka.html`
- `wholesale-lungis-uae.html`
