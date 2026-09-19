# Podaturpet reorganization and visual upgrade

The current site was extended in place from website(20260919-213238).zip. Nothing has been deployed. All 303 retained original files remain; 32 active pages use the shared presentation layer and 14 root redirects remain unchanged.

## What changed

- One homepage introduction and five clear areas: People Information / Tamil Life Assistant, Global Service Marketplace, Advertise, Lungi / Textiles, Podaturpet Local Hub.
- One shared header/footer from the existing build workflow, with keyboard-accessible mobile navigation. Tools are clearly linked within areas and the footer instead of competing as ten top-level links.
- Original EN/TA homepage and commercial copy, consistent green/cream/pastel palette, typography, spacing, cards and focus states using the existing colourful stylesheet and licensed Tamil font.
- Duplicate homepage promotions, route strips and competing heroes merged; original product selection, quote form, video, lifestyle content and international market selector remain in a dedicated expandable buyer workspace. Old hash links reveal the workspace.
- Existing feedback and aggregate visitor counter placed in the footer. The assistant, advertising code and analytics remain intact. Repeated MuraRaj credit/contact strips consolidated.
- Advertising/website enquiry pages get a consistent two-card structure. Local article calls to action lead to the existing local contribution form. General homepage contact no longer pre-fills a wholesale-only message.
- Product/market parameters stay in textile routes. Existing provider verification, privacy consent, calculators, forms and saved-data behavior are preserved.
- Homepage SEO/social descriptions now match the site’s scope; canonical URLs, language alternatives, sitemap and redirects are preserved. Historical backup folders are retained but excluded in robots.txt.

## Verification and limits

227 automated tests passed. All original form IDs/field names and old homepage anchors remain. No broken local references found; both builders are deterministic. Package installer and ZIP checks are also performed.

Native Safari/Chrome/mobile rendering, screen-reader behavior, real print dialogs and external message handoff were not available for verification. Static visual checks are approximate, and live analytics backend acceptance remains unverified. The marketplace still needs approved real providers; no fake records were added. See TEST-REPORT.md for exact coverage and device preview steps.

## Install and preview

Unzip the full package into Downloads and run the NEW outer installer only:

```bash
bash "$HOME/Downloads/Podaturpet-Reorganization-Full/INSTALL-REORGANIZATION.command" "$HOME/website"
cd "$HOME/website"
python3 -m http.server 8000
```

Visit http://localhost:8000/ and preview both languages and all five areas. Ctrl+C stops the preview. The installer checks old/new hashes, refuses conflicting edits before copying, backs up replaced files and applies only this delivery’s explicit changes. It does not alter .git, delete unrelated files or publish. Do not run older installers preserved inside the website archive.

## Exact Git commands

```bash
cd "$HOME/website"

git add \
  about-podaturpet.html \
  advertise-on-podaturpet.html \
  blue-border-lungi-wholesale.html \
  business-website-development.html \
  content/site.json \
  cotton-lungi-wholesale.html \
  docs/site-reorganization/COPYRIGHT-PRIVACY-SEO.md \
  docs/site-reorganization/DESIGN-AND-CLEANUP.md \
  docs/site-reorganization/FINAL-REPORT.md \
  docs/site-reorganization/PAGE-BY-PAGE-AUDIT.md \
  docs/site-reorganization/PAGE-INVENTORY.json \
  docs/site-reorganization/TEST-REPORT.md \
  free-invoice.html \
  handloom-lungis.html \
  how-checked-lungis-are-made.html \
  index.html \
  lungi-product-catalogue.html \
  lungi-wholesale-india.html \
  lungi-wholesale-worldwide.html \
  modern-lungi-global-collection.html \
  modern-lungi-investors-research-partners.html \
  modern-lungi-product-innovation.html \
  people-hub/build.py \
  people-hub/tests/directory.test.py \
  people-hub/tests/dom.test.cjs \
  people-information-hub-ta.html \
  people-information-hub.html \
  podaturpet-buyer-journey.js \
  podaturpet-buyer-languages.js \
  podaturpet-colourful.css \
  podaturpet-editorial.js \
  podaturpet-government-offices.html \
  podaturpet-local-business-directory.html \
  podaturpet-lungi-weaving-story.html \
  podaturpet-stories-and-culture.html \
  podaturpet-textile-supplier-enquiry.html \
  podaturpet-tourist-places.html \
  podaturpet-town-guide.html \
  podaturpet-travel-pin-code.html \
  podaturpet-useful-information.html \
  podaturpet-weaving-textiles.html \
  powerloom-lungis.html \
  privacy-policy.html \
  robots.txt \
  tools/build_content.py \
  tools/site_layout.py \
  tools/tests/site_journeys.cjs \
  us-india-family-travel-planner.html \
  white-checked-lungi-wholesale.html \
  wholesale-lungi-sample-buying-guide.html

git diff --cached --check && git diff --cached --stat
git diff --cached
git status --short

# After reviewing the staged changes:
git diff --cached --check && git commit -m "Reorganize Podaturpet into five clear areas with shared bilingual design" && git push origin main
```

## Live URLs after your deployment

- https://podaturpet.com/
- https://podaturpet.com/people-information-hub.html
- https://podaturpet.com/people-information-hub-ta.html
- https://podaturpet.com/podaturpet-local-business-directory.html#service-marketplace
- https://podaturpet.com/advertise-on-podaturpet.html
- https://podaturpet.com/lungi-product-catalogue.html
- https://podaturpet.com/podaturpet-town-guide.html

## Reports

PAGE-BY-PAGE-AUDIT.md and PAGE-INVENTORY.json cover every existing HTML document and shared component. DESIGN-AND-CLEANUP.md explains the hierarchy and ongoing maintenance. TEST-REPORT.md records tests/limits. COPYRIGHT-PRIVACY-SEO.md covers original/reused assets, licenses, privacy and SEO preservation.

## Full file list

42 modified; 8 new; no removals. Installer, manifest and START-HERE are outer delivery helpers.

### Modified

- about-podaturpet.html
- advertise-on-podaturpet.html
- blue-border-lungi-wholesale.html
- business-website-development.html
- content/site.json
- cotton-lungi-wholesale.html
- free-invoice.html
- handloom-lungis.html
- how-checked-lungis-are-made.html
- index.html
- lungi-product-catalogue.html
- lungi-wholesale-india.html
- lungi-wholesale-worldwide.html
- modern-lungi-global-collection.html
- modern-lungi-investors-research-partners.html
- modern-lungi-product-innovation.html
- people-hub/build.py
- people-hub/tests/directory.test.py
- people-hub/tests/dom.test.cjs
- people-information-hub-ta.html
- people-information-hub.html
- podaturpet-buyer-journey.js
- podaturpet-buyer-languages.js
- podaturpet-colourful.css
- podaturpet-editorial.js
- podaturpet-government-offices.html
- podaturpet-local-business-directory.html
- podaturpet-lungi-weaving-story.html
- podaturpet-stories-and-culture.html
- podaturpet-textile-supplier-enquiry.html
- podaturpet-tourist-places.html
- podaturpet-town-guide.html
- podaturpet-travel-pin-code.html
- podaturpet-useful-information.html
- podaturpet-weaving-textiles.html
- powerloom-lungis.html
- privacy-policy.html
- robots.txt
- tools/build_content.py
- us-india-family-travel-planner.html
- white-checked-lungi-wholesale.html
- wholesale-lungi-sample-buying-guide.html

### New

- docs/site-reorganization/COPYRIGHT-PRIVACY-SEO.md
- docs/site-reorganization/DESIGN-AND-CLEANUP.md
- docs/site-reorganization/FINAL-REPORT.md
- docs/site-reorganization/PAGE-BY-PAGE-AUDIT.md
- docs/site-reorganization/PAGE-INVENTORY.json
- docs/site-reorganization/TEST-REPORT.md
- tools/site_layout.py
- tools/tests/site_journeys.cjs
