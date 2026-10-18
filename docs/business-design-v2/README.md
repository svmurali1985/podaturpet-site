# Business showcase design V2

Baseline main: 4fc50b5a0e4cc51c6ddc98c1dfa5a6d9bd284b03.

Replaces the pale announcement design with a dark navy introduction, lime enquiry CTA, decorative website illustration, eight coloured line icons and more compact service cards. Homepage descriptions are shorter; the full descriptions and service-specific WhatsApp enquiries stay on the existing details page. All content remains English/Tamil. On narrow screens, the illustration is hidden and service cards become compact icon/text rows. Corrects contrast by removing the dark-on-dark side heading entirely. Scoped CSS preserves town/textile sections and existing scripts.

Icons are original inline SVG paths. The decorative website preview is made with HTML/CSS, is hidden from screen readers and does not depict a real customer project. No external images, fonts, scripts, APIs or dependencies added.

## Install on your Mac

Download `Podaturpet-Business-Design-V2.zip` into Downloads. Open Terminal in your existing website folder. If you have newer uncommitted homepage edits, preserve and reconcile those first.

```bash
git status --short
backup_dir="../website-backup-$(date +%Y%m%d-%H%M%S)"
ditto . "$backup_dir"
unzip -o "$HOME/Downloads/Podaturpet-Business-Design-V2.zip" -d .
git diff --stat
git diff --check
```

The ZIP contains actual source files at its root, no inner archive. No deletions required. Review locally on desktop/mobile and both language pages before publishing.

```bash
git add index.html index-ta.html business-website-development.html podaturpet-tech-banner.css docs/business-design-v2/README.md
git diff --cached --stat
git commit -m "Redesign business showcase with navy hero and compact service icons"
git push origin main
```

Do not stage downloaded ZIP files. No assistant commit, push or deployment.

## Verification

- Root HTML link/file/anchor/duplicate-ID checker: 52 pages, 0 errors.
- Existing refreshed-page integration suite: 10 page checks passed (mocked network), including script initialization, keyboard menu and bilingual switching.
- Both homepage native-language fallbacks, new headline, eight SVG icons, decorative preview, single H1 and eight service links checked.
- git diff --check passed.
- Source screenshot reviewed to identify poor visual hierarchy and low contrast. The new design has not been rendered in a supported browser here; real-device layout, screenshots and live deployment remain to be checked. No rendered visual verification is claimed.
