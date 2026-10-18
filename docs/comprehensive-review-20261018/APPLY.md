# Safe manual application — macOS Terminal

Use the changed-files ZIP for your existing checkout. Do not commit either downloaded ZIP. Read the included change manifest. No deletions required.

1. Put Podaturpet-Reviewed-Changes.zip in Downloads. Open Terminal in your website checkout.
2. Check your branch and working tree:

```sh
git status --short
git log -1 --oneline
```

If there are local edits, commit or stash them before proceeding. The patch was made against 2641552e413d3bba65abd3ce59d8bd3907991b61. If main has advanced, review differences first; extracting overwrites matching files.

3. Back up the entire checkout, including uncommitted files:

```sh
backup_dir="../website-backup-$(date +%Y%m%d-%H%M%S)"
ditto . "$backup_dir"
```

4. Inspect and extract the changed files:

```sh
unzip -l "$HOME/Downloads/Podaturpet-Reviewed-Changes.zip"
unzip -o "$HOME/Downloads/Podaturpet-Reviewed-Changes.zip" -d .
git status --short
git diff --stat
git diff --check
git diff -- index.html index-ta.html business-website-development.html podaturpet-feedback.js
```

Review newly added CSS, docs and build script as well. Do not use git add . if other unrelated files or ZIPs are present.

5. Optional local checks (Python lxml required for link/static checks; Node jsdom required for DOM suites):

```sh
python3 tools/build_home_styles.py
python3 tools/check_site_links.py
python3 docs/comprehensive-review-20261018/verify.py
node --check podaturpet-feedback.js
```

6. Stage exactly the manifest, review, and manually commit/push when satisfied:

```sh
while IFS= read -r file; do git add -- "$file"; done < docs/comprehensive-review-20261018/CHANGED-FILES.txt
git diff --cached --stat
git diff --cached --check
git diff --cached
git commit -m "Consolidate homepage and clarify business support journeys"
git push origin main
```

Only you run the last commands. If your repository deploys automatically after a push, that push may trigger its existing hosting workflow.

## Post-deployment checklist

- Open both homepages in a private window on phone and desktop; inspect layout at narrow widths, Tamil rendering, menu, language switch, free offer and greeting.
- Play/pause video; explicitly enable sound and try available English/Tamil voices. Confirm no audible autoplay, and usable fallback when a voice is unavailable.
- Follow catalogue, enquiry, official resources, FAQ and all eight technology links. Check phone, WhatsApp draft and email addresses before sending anything.
- Test comments and admin with authorized credentials; test consent controls and confirm public visitor reports contain only aggregate geography, no individual visitor records or IPs.
- Check browser console/network for errors, image loading, reduced-motion preference and keyboard focus. Test performance/accessibility with Lighthouse; no score was measured here.
- Verify https://podaturpet.com/robots.txt and https://podaturpet.com/sitemap.xml return 200 and the production pages have correct canonicals/language alternatives without accidental noindex.
- In the verified Google Search Console property, submit https://podaturpet.com/sitemap.xml. Inspect the homepage, Tamil homepage and changed business page; use Test live URL, then Request indexing only after successful live checks. Review Page indexing, sitemap processing and canonical reports later.
- No indexing request was submitted here; indexing or ranking is not guaranteed.
