# Homepage technology announcement

Base main commit: a65ddbe1d71ac626954db2dbfad6023b3eea5c5d.

Adds an attractive, compact English/Tamil technology-service announcement at the top of both homepages. Four topics: company websites, chatbots, AI tools and workflow automation. The main CTA points to the existing contact section; the second CTA opens the existing technology services page. No personal contact information added. Existing town-focused layout, lungi products and integrations remain.

A softly animated decorative glow runs on a four-second cycle, with no blinking text or moving marquee. It stops for prefers-reduced-motion. Narrow screens use a single-column banner, wrapping labels and large links. Content and links work without JavaScript; the existing site language handler switches the bilingual text. No new scripts, external images, APIs, dependencies or tracking.

## Apply on your Mac (English instructions)

The ZIP contains the actual changed source files at its root. There is NO inner ZIP to extract.
Download `Podaturpet-Tech-Banner-Changes.zip` to Downloads. In Terminal, go to your existing website checkout. Confirm your local homepage has no newer uncommitted edits before extraction; if it does, preserve and reconcile them first.

```bash
git status --short
backup_dir="../website-backup-$(date +%Y%m%d-%H%M%S)"
ditto . "$backup_dir"
unzip -o "$HOME/Downloads/Podaturpet-Tech-Banner-Changes.zip" -d .
git diff --stat
git diff --check
```

You should see changes to BOTH index.html and index-ta.html. The new CSS/docs appear as untracked until staged. Preview locally if desired:

```bash
python3 -m http.server 8000
```

Open http://localhost:8000 and /index-ta.html; check banner, language switches, narrow screen layout and the two links. Stop with Ctrl+C. Then manually commit only the intended files:

```bash
git add index.html index-ta.html podaturpet-tech-banner.css docs/technology-banner-20261018/README.md
git diff --cached --stat
git commit -m "Add bilingual homepage technology services banner"
git push origin main
```

Do not add the downloaded ZIP to Git. No deletions required. No assistant commit, push or deployment.

## Verification

- Internal file/anchor/duplicate ID checker: 52 HTML pages, 0 errors.
- Existing refreshed-page DOM integration suite: 10 page checks passed, including both homepages, local script initialization, keyboard menu and English/Tamil switching (network mocked).
- Banner assertions: exactly one banner, four topics, native English/Tamil fallback, retained single H1, local CSS reference and valid contact target.
- git diff --check: passed.
- Browser-rendered mobile/desktop visual QA, real-device font/layout and live deployment are not verified in this environment. Responsive CSS and DOM assertions are not a substitute for a rendered browser check.
