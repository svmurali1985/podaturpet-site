# Town-first homepage refresh

Base: main, 3b27e50f336fe6ea5fcf65161c81df1ff152a6a5.
Execution date: 18 October 2026 UTC / 17 October America/Chicago.

Changed: index.html, index-ta.html. Added: podaturpet-town-front.css and this documentation/test folder. No required deletions.

The homepage now opens with a regional landscape and adjacent lungi product card. Four colourful entry cards introduce weaving, agriculture, temples and everyday services. The existing town/attractions section now appears before the product grid. A new bilingual regional agriculture section links directly to official sources. Existing catalogue, wholesale form, contact actions, language controls, consent, analytics, comments and administration code are retained. No new businesses, prices, contacts or opening hours were invented.

## Sources and image rights

Accessed 18 October 2026 UTC:
- https://tiruvallur.nic.in/agriculture-department-of-agriculture/ — district crop background; page itself carries an older 2021 update date. Background only, not a new announcement or current production estimate.
- https://tiruvallur.nic.in/horticulture/ — district horticulture and farmer information. Current scheme eligibility must be confirmed with the department.

All imagery is reused from the existing repository; no new external or AI images added. Hero: images/nagari-hills-town-guide.jpg, Chirag1745, CC0, https://commons.wikimedia.org/wiki/File:Nagari_hills.jpg. It is explicitly labelled a regional Nagari landscape, not a photograph of Podaturpet town. Existing regional attraction photographs retain their credit records in images/region/IMAGE-CREDITS.txt and docs/local-refresh/SOURCES.md. Lungi photographs retain the existing source provenance; this update does not independently establish ownership of user-supplied images.

## Checks completed

- Existing refresh integration suite: 10 pages passed, including script initialization, navigation, English/Tamil and metadata (mocked network; no external writes).
- New homepage test: 144 assertions passed, including town-before-catalogue ordering, four topic cards, hero image dimensions and English/Tamil switching for all added text.
- All root HTML pages: zero missing local href/src file targets.
- git diff --check: passed.

No browser visual QA was available. Responsive CSS includes desktop, tablet and mobile breakpoints, but actual desktop/mobile appearance still needs review. Live enquiries, administration, analytics backend and Search Console were not exercised. No deployment, push or merge performed. Existing sitemap homepage dates already match the UTC modification date.

## Apply safely (English)

1. Work from your existing website checkout. Confirm `git branch --show-current` shows main and `git rev-parse HEAD` starts with 3b27e50. If your checkout has moved beyond this commit, review and merge the patch instead of overwriting newer edits.
2. Run `git status --short`. Save or commit any unrelated changes before applying this update.
3. Back up your checkout outside the website folder, for example from its parent directory: `cp -a website website-backup-before-town-front` (choose an unused backup name).
4. Extract podaturpet-homepage-changes.zip to a separate temporary folder. Copy its files into your website folder, preserving paths. No deletions are required. The full-source ZIP is an alternative clean source copy, not a reason to delete your existing checkout.
5. Run `git diff --check`, `git diff --stat`, and `git diff -- index.html index-ta.html`. Review the added CSS and documentation too.
6. Review both homepage languages in a local preview. Check phone-width layout, images, catalogue, enquiry form, language switching, consent and contact actions.
7. Stage only this update:

```bash
git add index.html index-ta.html podaturpet-town-front.css docs/town-front-20261018
git diff --cached --stat
git commit -m "Redesign homepage around Podaturpet town, agriculture and textiles"
git push origin main
```

After your hosting build completes, hard refresh the public site and repeat the mobile, language and enquiry checks. Check browser console/network errors. In Google Search Console inspect / and /index-ta.html, test live URLs and request indexing if appropriate. Check the existing sitemap https://podaturpet.com/sitemap.xml; resubmit only if needed. No indexing requests were made here, and indexing/rankings are not guaranteed.
