# Apply safely — macOS

Download Podaturpet-Free-Services-Town-Changes.zip into Downloads. Open Terminal in your website checkout. Baseline: 0158b7e4d12d90fa5e12cb22671e9b8d53a0f80d. Preserve any existing local changes before extraction. If main has advanced, review before overwriting files.

```sh
git status
backup_dir="../website-backup-$(date +%Y%m%d-%H%M%S)"
ditto . "$backup_dir"
unzip -l "$HOME/Downloads/Podaturpet-Free-Services-Town-Changes.zip"
unzip -o "$HOME/Downloads/Podaturpet-Free-Services-Town-Changes.zip" -d .
git diff --stat
git diff --check
```

Review changes, then stage only the manifest files. Do not add downloaded ZIP files.

```sh
while IFS= read -r file; do
  git add -- "$file"
done < docs/free-services-town-20261018/CHANGED-FILES.txt
git diff --cached --stat
git diff --cached --check
git diff --cached
git commit -m "Highlight free business services and restore Podaturpet local guides"
git push origin main
git status
```

You run commit/push manually. Existing hosting may automatically deploy on push. No file deletions required.

After deployment: hard refresh both homepages; check narrow/mobile and desktop widths, Tamil, menu, top offer, product links, town resources, photo credits and single contact area. Test video play/pause, sound on/off, captions, direct MP4 and English/Tamil installed voices. Confirm no community forms, only one site-view total, and collapsed aggregate geography. Check console/network, accessibility and reduced-motion behavior. Check robots.txt/sitemap.xml. In verified Google Search Console, test live English/Tamil URLs, submit sitemap.xml if needed and request indexing only after live checks. No indexing request was submitted here, and no ranking outcome is promised.
