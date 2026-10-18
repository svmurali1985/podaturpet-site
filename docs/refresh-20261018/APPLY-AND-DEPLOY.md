# Apply this update safely on your Mac

Nothing has been committed, pushed, merged or deployed by the assistant.

Baseline main commit: `27a11f2e9a2986bf689d496f3ee3b8f5f75b3235`.

## Back up and check your checkout

Replace the first path below with your existing website repository path. Run commands in Terminal, without Markdown link formatting.

```bash
cd "/absolute/path/to/your/Website"
pwd
git status --short
backup_dir="${PWD}-backup-$(date +%Y%m%d-%H%M%S)"
ditto "$PWD" "$backup_dir"
printf 'Backup saved to %s\n' "$backup_dir"
git branch --show-current
git rev-parse HEAD
```

The backup includes your Git history and any uncommitted files. Before copying, confirm you are on `main`, the commit matches the baseline above and `git status --short` has no output. If it differs or you have local changes, keep the backup and reconcile those edits first. Do not reset, clean or overwrite newer work. This package is based on the specified baseline, not any later main commit.

## Copy only the changes

Extract `podaturpet-changes.zip` into Downloads. Its top-level folder is `podaturpet-changes`. The full ZIP is an alternative complete source snapshot, not a folder to replace your `.git` directory with.

```bash
rsync -av "$HOME/Downloads/podaturpet-changes/" ./
git status --short
git diff --stat
git diff --check
git diff -- index.html index-ta.html podaturpet-government-offices.html podaturpet-local-updates.html sitemap.xml
```

No deletions are required. Do not use rsync `--delete`. Review every path in `docs/refresh-20261018/CHANGED-FILES.txt`, including untracked additions. Existing `.git` history stays in your checkout.

## Local checks and preview

```bash
python3 tools/check_site_links.py
node --check podaturpet-local-updates.js
python3 -m http.server 8000
```

Open http://localhost:8000 and http://localhost:8000/index-ta.html. Test widths near 390px, 768px and 1440px; zoom to 200%; check that Tamil text, navigation, buttons, photos and the contact footer do not overflow. Test keyboard navigation, menu Escape, catalogue product selection, the WhatsApp/email draft preview, government phone/email links, attraction search/reset and news search/category controls. Stop the server with Ctrl+C.

Optional DOM tests need Node and `jsdom`. Install QA dependencies outside the checkout:

```bash
npm install --prefix /tmp/podaturpet-qa jsdom --no-audit --no-fund
NODE_PATH=/tmp/podaturpet-qa/node_modules node docs/refresh-20261018/verify.cjs
NODE_PATH=/tmp/podaturpet-qa/node_modules node docs/local-refresh/dom-test.cjs
NODE_PATH=/tmp/podaturpet-qa/node_modules node docs/town-discovery/dom-test.cjs
```

See TEST-RESULTS.md for the pre-existing legacy SEO suite failure. Do not mistake DOM tests for visual browser tests or live service tests.

## Manually commit and push after review

These commands are for YOU to run once satisfied. They publish through your existing GitHub/hosting setup.

```bash
git status --short
git add -- .
git diff --cached --stat
git diff --cached --check
git diff --cached
git commit -m "Refresh Podaturpet guides, official notices and wholesale buyer guidance"
git push origin main
```

Only use `git add -- .` after verifying the working tree contains solely the expected update files. If any other files are present, stage the intended paths individually. Never force-push. If origin/main advanced, fetch and reconcile safely before pushing.

## Post-deployment checks

- Confirm HTTPS and preferred-domain redirects, and view the actual published HTML rather than only a cached tab.
- Check English/Tamil homepages, catalogue/enquiry, offices, travel and attraction pages on a phone and desktop.
- Confirm the new CSS and both Nagari WebP files return 200 and no console errors occur. Check navigation and non-JavaScript page content.
- Prepare a test enquiry and review the destination contact app; send only if you intend to contact the team.
- Test news/attraction filters and language switches. Check that the October 10 event is labelled as passed.
- Verify aggregate visitor counts and consent/decline behavior with the existing Worker. Confirm no IP addresses or individual visitor records appear. Test comments and admin only with your own authorized credentials; no credentials were supplied here.
- Measure mobile performance with PageSpeed Insights/Lighthouse after deployment. Inspect layout shift, text rendering and large-image loading on a real device.

## Google Search Console after deployment

No authenticated Search Console connection was available or used. No submission or inspection request was sent.

1. Sign in to your existing verified property for `podaturpet.com`. If ownership is missing, complete Google's property verification first.
2. Open `https://podaturpet.com/robots.txt` and `https://podaturpet.com/sitemap.xml`. Confirm the sitemap loads with the expected 37 canonical URLs and only substantively changed pages have the new lastmod date.
3. In Search Console → Sitemaps, submit or resubmit `https://podaturpet.com/sitemap.xml`; record the actual result and last-read date.
4. Inspect the homepage, `/index-ta.html`, catalogue, offices and local-updates URLs. Run Test Live URL, check crawl permission, canonical selection and rendered content. Request indexing for the important changed URLs only after their live tests succeed.
5. Review Page indexing, Crawl stats, HTTPS, Core Web Vitals, manual actions and security reports. Resolve reported errors rather than repeatedly requesting indexing.
6. Use Rich Results Test for eligible markup and Schema Markup Validator for general JSON-LD. The package's JSON parse check does not certify Google rich-result eligibility.
7. Recheck processing and impressions later; a submission does not guarantee indexing, traffic or rankings.
