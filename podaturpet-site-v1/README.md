# Podaturpet.com — Version 1

A mobile-first local portal for Podaturpet 631208.

## What is included

- Bilingual Tamil + English homepage
- Local business categories
- Search/filter interaction
- Jobs, offers, local information and business-listing sections
- Responsive mobile navigation
- SEO title, description, canonical URL and WebSite structured data
- `robots.txt` and `sitemap.xml`
- No framework or build process required

## Preview locally

Open `index.html` in a browser, or run:

```bash
python3 -m http.server 8000
```

Then visit `http://localhost:8000`.

## Push to GitHub

Create a new repository named `podaturpet-site` (or any name), then:

```bash
git init
git add .
git commit -m "Launch redesigned Podaturpet.com"
git branch -M main
git remote add origin https://github.com/svmurali1985/podaturpet-site.git
git push -u origin main
```

If the repository already exists, skip `git init` and use the correct existing remote URL.

## Deploy to GoDaddy

For standard cPanel/static hosting:

1. Back up the current site.
2. Open cPanel / File Manager.
3. Go to the document root for `podaturpet.com` (commonly `public_html`).
4. Upload `index.html`, `styles.css`, `script.js`, `robots.txt`, and `sitemap.xml`.
5. Clear any GoDaddy/site cache and reload the domain.

If GoDaddy is serving a Website Builder site instead of cPanel hosting, the deployment path is different. Do not share your GoDaddy password. Use delegated access or export/connect hosting instead.

## Next recommended upgrades

1. Add a real database/business directory.
2. Connect the "Add Business" form to WhatsApp, email, Formspree, Supabase, Firebase, or your own API.
3. Add separate SEO pages:
   - `/shops/`
   - `/jobs/`
   - `/offers/`
   - `/textiles/`
   - `/medical/`
   - `/restaurants/`
   - `/bus-timings/`
4. Add real verified local listings, photos and map links.
5. Add Google Search Console and analytics.
6. Generate a branded Open Graph image/favicon.
7. Add Tamil-first landing pages for important local queries.

## Important

The current listing form copies the user's submission to their clipboard. This avoids collecting personal data until a backend/contact destination is configured.
