# Cute business-help animated promo

Base main: d22a8a838f36aa3f0f1c734cd0413843c90b9f02.

Adds the owner-requested FREE development offer to the homepage and existing services page, plus a real, locally hosted 21-second MP4 animation to the homepage's existing business hero, replacing the decorative website illustration. Both English and Tamil pages use the same original cartoon artwork with localized visible scene captions and two optional WebVTT caption tracks.

Seven three-second scenes: understanding the business; shop advertising; website; customer chatbot; automation/data-entry tasks; local information; invitation to discuss a project. An original small robot mascot accompanies the scenes. It is an illustrative advertisement, not footage of a real client, office, business meeting or actual Podaturpet location. No sales/customer claims or invented portfolio projects. Offer wording (free website, chatbot and automation development; no service charge) is supplied by the website owner. The homepage highlights it in a lime badge and headline; the actual MP4 displays FREE badges in the website, chatbot, automation and closing scenes. Both VTT tracks and visible captions carry the offer. No third-party hosting or API-fee waiver is claimed.

The video is silent, 720×450, H.264/yuv420p at 20fps, MP4 faststart; approximately 260 KB. Poster is a 9.2 KB WebP. No remote video host or paid API. Native controls allow play/pause/seeking. The script makes one muted play attempt after the video enters view, with no autoplay for reduced-motion/data-saver users. It pauses offscreen and when the tab is hidden; user pause is not followed by repeated automatic restarts. If autoplay is blocked, native controls remain. Content and enquiry links remain available independently of the video.

## Install on your Mac

Download `Podaturpet-Animated-Promo-Changes.zip` to Downloads. In your existing website checkout, check for newer local edits before extracting. Preserve/reconcile them first if present.

```bash
git status --short
backup_dir="../website-backup-$(date +%Y%m%d-%H%M%S)"
ditto . "$backup_dir"
unzip -o "$HOME/Downloads/Podaturpet-Animated-Promo-Changes.zip" -d .
git diff --stat
git diff --check
```

The archive has actual source files at the root, no inner ZIP. No deletions required. Test both homepage languages in a browser, the video controls, captions, mobile layout, reduced-motion setting and contact links.

```bash
git add index.html index-ta.html business-website-development.html podaturpet-business-promo.css podaturpet-business-promo.js images/business-promo/ tools/render_business_promo.py docs/animated-promo-20261018/
git diff --cached --stat
git commit -m "Add free development offer and animated business promo"
git push origin main
```

Do not stage downloaded ZIPs. Nothing was committed, pushed or deployed by the assistant.

## Original artwork and source

All new scenes, characters, icons and animation are original code-drawn shapes from `tools/render_business_promo.py`. No stock photos, copied mascots, music or third-party artwork. MR text represents the established MuraRaj brand. The generated artwork and source are supplied for use with this website. Pillow and ffmpeg are optional development tools for regeneration; the website has no runtime dependency on them.

To regenerate, install Pillow and ffmpeg in your own development environment, then run `python3 tools/render_business_promo.py`. The renderer optionally accepts PODATURPET_PROMO_FONT as a local font path; it falls back to Pillow's bundled font when DejaVu is absent. Fonts are rasterized into the video and no font file is distributed.

## Verification

- FFprobe: 21.000 seconds; 720×450 H.264, yuv420p, no audio stream.
- FFmpeg full decode: no errors.
- Contact sheet of six representative original scene frames visually inspected. Poster and declared dimensions match. Browser rendering/native playback is not verified here.
- 9 focused DOM video checks pass: visible-only autoplay attempt, one-attempt behavior, pause/offscreen, seeking captions, Tamil switch, reduced motion, data saver, both native language fallbacks/media paths.
- Existing 10-page integration suite passes with mocked network; existing scripts/nav/language initialization preserved.
- Root link/file/anchor checker: 52 HTML pages, zero errors.
- JS syntax and git diff --check pass.
- Actual autoplay policy, native controls/caption rendering, mobile layout and published deployment need a real browser check after you apply the update. No live messages, API writes or deployment performed.
