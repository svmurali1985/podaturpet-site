# Apply on macOS

Download Podaturpet-Professional-Changes.zip to Downloads. In your website checkout, first run git status. If there are local edits, preserve them separately before extracting. Baseline: e34ff956c5c00f9200c3fb03477802ab25c3f575. If main has advanced, review before overwriting.

```sh
git status
backup_dir="../website-backup-$(date +%Y%m%d-%H%M%S)"
ditto . "$backup_dir"
unzip -l "$HOME/Downloads/Podaturpet-Professional-Changes.zip"
unzip -o "$HOME/Downloads/Podaturpet-Professional-Changes.zip" -d .
git diff --stat
git diff --check
```

Review changes before staging. Do not commit the ZIP files.

```sh
while IFS= read -r file; do
  git add -- "$file"
done < docs/professional-home-20261018/CHANGED-FILES.txt
git diff --cached --stat
git diff --cached --check
git diff --cached
git commit -m "Simplify homepage with professional textile and business presentation"
git push origin main
git status
```

You run commit/push manually. Your existing hosting may deploy automatically on push. No source file deletions required.

After deployment:
- Inspect English/Tamil at desktop and phone widths; check menu, alignment, no horizontal overflow, image crops and keyboard focus.
- Check single contact block, catalogue cards and business/local-guide links.
- Confirm no public community form appears; check admin access separately with authorized credentials.
- Confirm one site counter and collapsed geography; review existing privacy controls.
- Check browser console/network, robots.txt and sitemap.xml. In Search Console, test live URLs for / and /index-ta.html, submit sitemap.xml if needed and request indexing only after live checks. No request was submitted by this update; indexing/rankings are not guaranteed.
