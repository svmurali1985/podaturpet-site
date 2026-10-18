# Business support showcase

Baseline main: 13d4a352fe3c336b3c4d8fba62d432fe30e9c39e.

Replaces the small technology announcement on both homepages with a larger editorial heading, eight descriptive service cards and prominent enquiry routes. Adds detailed bilingual information to the existing business-website-development.html page rather than creating duplicate service pages.

Services: business websites; shop/business advertising; website content updates; data entry and back office; customer chatbots; AI tools; workflow automation; company profiles and content. Examples are discussion scopes, not guarantees of availability, delivery dates or sales results. No invented price, client total, testimonial or certification. Existing contact number preserved. Each detailed service offers a WhatsApp draft naming the requested service; the visitor reviews and sends it themselves.

The screenshot's small heading is addressed with scoped headline font sizes that override legacy homepage typography. The design uses green, cream, gold and lilac cards, a clear business-first headline, audience guidance and three enquiry steps. The grid changes from four columns to two and then one on small screens. The decorative side panel is omitted on narrow screens; all services remain available. No new images, remote fonts, scripts, trackers, APIs or dependencies.

## Install on your Mac

Download `Podaturpet-Business-Support-Changes.zip` to Downloads. In your existing website checkout:

```bash
git status --short
backup_dir="../website-backup-$(date +%Y%m%d-%H%M%S)"
ditto . "$backup_dir"
unzip -o "$HOME/Downloads/Podaturpet-Business-Support-Changes.zip" -d .
git diff --stat
git diff --check
```

The archive contains source files directly, not inner ZIPs. Reconcile any newer local homepage edits before extraction. Do not add the ZIP to Git. No deletions required.

Check English and Tamil homepages and the technology services page. On mobile and desktop, try all eight cards, the contact route, the language switch and the service enquiry draft; no message is sent until you choose to send it in WhatsApp.

```bash
git add index.html index-ta.html business-website-development.html podaturpet-tech-banner.css sitemap.xml docs/business-support-20261018/README.md
git diff --cached --stat
git commit -m "Expand bilingual business support showcase and service enquiries"
git push origin main
```

No assistant commit, push or deployment was performed.

## Checks

- 52 root HTML files: zero missing local files/anchors or duplicate IDs.
- Existing 10-page integration suite passes (mocked network): script initialization, keyboard navigation and English/Tamil switching.
- Eight detailed services and eight matching homepage links per language checked; 16 deep links resolve.
- Native English/Tamil fallback text checked; detail-page language switches translate service descriptions and process instructions.
- Eight service-specific WhatsApp links target the established public number and contain the service in their draft. No message sent.
- Single H1 retained; sitemap business-page substantive-change date updated to 2026-10-18.
- git diff --check passes.
- Rendered browser visual checks, real-device overflow/font behavior and live deployment are not verified here. Responsive CSS and DOM checks do not constitute screenshot verification.
