# Apply safely on macOS

Download Podaturpet-Compact-Town-Counter-Changes.zip into Downloads. Open Terminal in your website checkout. Baseline: 7c63df4115f0c93d3177ee57bb382372974ab0e2. Preserve local changes before extraction. If main has advanced, review before overwriting.

```sh
git status
backup_dir="../website-backup-$(date +%Y%m%d-%H%M%S)"
ditto . "$backup_dir"
unzip -l "$HOME/Downloads/Podaturpet-Compact-Town-Counter-Changes.zip"
unzip -o "$HOME/Downloads/Podaturpet-Compact-Town-Counter-Changes.zip" -d .
git diff --stat
git diff --check
```

Review/stage only the manifest; do not add downloaded ZIPs.

```sh
while IFS= read -r file; do
  git add -- "$file"
done < docs/compact-town-counter-20261018/CHANGED-FILES.txt
git diff --cached --stat
git diff --cached --check
git diff --cached
git commit -m "Compact homepage banner and restore geographic view reports"
git push origin main
git status
```

You manually run commit/push. Your existing website hosting may deploy on push.

## Required separate analytics Worker update

Website/GitHub push does not deploy Cloudflare Worker code. For country/state/city tables to appear, deploy the updated existing Worker with your existing authorized Cloudflare account. No database creation, migration, token reset or secret change is needed.

From the website root, after reviewing the changes:

```sh
node --test community-worker/worker.test.mjs
cd community-worker
npx wrangler deploy
cd ..
```

Check that Wrangler targets worker podaturpet-community and existing D1 database podaturpet-community as configured in wrangler.toml. Reuse the existing account/credentials; do not put tokens into source or frontend files. If not signed in, complete Wrangler's official login flow. Do not create a new database or reset existing secrets. If deployment fails, keep its exact error for troubleshooting. The older Worker still provides the existing total/city fallback; frontend will label country/state unavailable until updated.

## Verify after both updates

- Hard refresh English/Tamil homepages on desktop and phone. Banner text/video should align on desktop; intentional single column at narrow phone widths. Check no large empty grid cell and no horizontal overflow.
- Check local-information cards, credited photos, catalogue, one contact block and video play/pause/sound. Browser/device voice availability varies.
- At the bottom, check total views, Country/State/City and the Refresh button. A normal permitted page load records one view; Refresh only retrieves counts. These are recorded loads over 30 days, not unique users. Counts are not guaranteed for GPC/DNT, prior refusal, blockers or failed API requests.
- If unavailable, open browser Developer Tools → Network and inspect /v1/stats and /v1/view. For 403, check allowed production Origin and Cloudflare security rules; do not disable origin checks or expose secrets. For 503, check Worker ENABLED/D1 binding. For 429, existing free-service budget is reached. Report the exact response; do not fabricate a number.
- Confirm public rows expose only country/region/city and aggregate totals, not IPs/individuals. Test private admin separately with authorized credentials.
- Check robots.txt and sitemap.xml return 200. Search Console: inspect live / and /index-ta.html; submit sitemap.xml if needed, request indexing after live checks. No submission was made here and no indexing/ranking guarantee is offered.
