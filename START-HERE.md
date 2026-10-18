# Podaturpet local discovery refresh

Based on GitHub main `01fdad9a2e293c32fc8a380dd580dfc908ce8499`.

## What changed

- Colourful, scoped local-information entry cards on the English/Tamil homepages and town guide. Wholesale lungi sections remain first.
- New `podaturpet-local-updates.html`: four dated official Tiruvallur district stories, English/Tamil search and topic filtering, twelve everyday information links, publication dates and a distinct job-fair event date.
- Attraction guide extended from ten to fourteen: Veeraraghava Perumal Temple, Periyapalayam Bhavani Amman Temple, Arcot Delhi Gate and Talakona waterfall. Longer journeys are explicitly identified.
- Three locally hosted, compressed, licensed WebP photographs: Poondi, Pulicat and Delhi Gate. Source, author, licence and conversion/crop credits accompany each photograph.
- News dates are evaluated in Asia/Kolkata. Completed events receive a reference label; notices older than thirty days receive an older-notice label. All summaries and source links remain available with JavaScript disabled.
- Updated attraction structured data, breadcrumb, sitemap, source register and functional tests.

This is a curated news section, not an automatic news feed. Refresh selections after reviewing official sources. Do not change the review date without checking the content. No scraping service, paid API, government logos, newspaper photos or article copies were added.

## Install on your Mac

1. Back up any uncommitted website work. Run `git status` in your existing website folder.
2. Extract the ZIP into a separate folder. Copy its website files into your existing repository at the same relative paths. The ZIP contains changed/new files only.
3. Review `git diff --stat` and `git diff`. Preview the website locally before publishing:

```bash
python3 -m http.server 8000
```

Open `http://localhost:8000`, `/podaturpet-local-updates.html`, and `/podaturpet-tourist-places.html` in desktop and mobile browsers. Switch English/Tamil and try both filters.

4. Publish from your website folder after review:

```bash
git add index.html index-ta.html podaturpet-town-guide.html podaturpet-tourist-places.html podaturpet-local-updates.html podaturpet-local-updates.js podaturpet-local-refresh.css images/region/poondi.webp images/region/pulicat.webp images/region/delhi-gate.webp sitemap.xml docs/local-refresh docs/town-discovery/dom-test.cjs
git commit -m "Expand Podaturpet local attractions and dated official information"
git push origin main
```

## Verification

Functional DOM tests exercise bilingual search, combined filters, reset/focus, no-JavaScript content, official-news date rollover and attraction schema anchors. The repository link checker checks files, internal anchors and duplicate IDs.

```bash
node docs/town-discovery/dom-test.cjs
node docs/local-refresh/dom-test.cjs
python3 tools/check_site_links.py
```

DOM tests require `jsdom` available to Node. They do not measure real-device layout or Core Web Vitals. Live deployment has not been changed by this package.

## Results in this session
- 15 attraction checks and 12 local-information checks passed.
- Internal link/anchor checker: 52 pages, 0 errors.
- Thirteen new district links checked; one revenue link corrected to the working official department page.
- Local preview was blocked by the remote browser. Real-device visual QA and performance measurement remain required before publication.
