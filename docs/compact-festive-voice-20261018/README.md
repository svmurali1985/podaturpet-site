# Compact entrance, festive wishes, sound and verified local updates

Baseline main: 62f7fe60abb42eb47a3c1cf935566272999bb877.

## Changes

- One compact FREE offer panel instead of the large business hero plus eight descriptive cards. Eight small service links remain; full descriptions stay on the service page.
- Smaller side video and simple Play/Pause and Sound controls. Native video controls remain as the no-JavaScript fallback. The old repeated lower website/chatbot/automation cards are removed; #services, collaboration links and useful tools stay.
- Slim advance Deepavali greeting mentioning Podaturpet, with native English/Tamil wording and a native expandable list of 18 languages.
- Improved original cartoon animation: people, storefront, website cursor/confirmation, chatbot reply and workflow completion. The 21-second MP4 now contains original gentle background music.
- Optional narration scripts in 18 languages, using installed browser/device voices after Sound on is clicked. Unsupported voices are marked. Speech, language availability and pronunciation depend on the device/browser; this is not 18 baked audio tracks or a guarantee of every world language.
- The video can hold the end of a scene while narration finishes, so spoken viewing may take longer than the MP4’s 21 seconds. Switching sound off returns to the muted loop. Offscreen/hidden-tab playback pauses; no automatic audible playback.
- Two new official dated positive news summaries, plus two credited regional photo cards, with source/licence register.

No paid API, subscriptions, credentials, stock music, copied news photographs or visitor-level reporting was added. Public contact details and existing enquiries/community integrations remain.

## Apply safely on your Mac

Download `Podaturpet-Compact-Festive-Voice-Update.zip` into Downloads. Run from your existing website checkout. If git status shows newer uncommitted source edits, reconcile them before copying.

```bash
git status --short
backup_dir="../website-backup-$(date +%Y%m%d-%H%M%S)"
ditto . "$backup_dir"
unzip -o "$HOME/Downloads/Podaturpet-Compact-Festive-Voice-Update.zip" -d .
git diff --stat
git diff --check
```

The ZIP contains actual source/media files directly, no inner ZIP. No deletions required; obsolete homepage cards are removed by the changed HTML. Downloaded ZIPs must not be staged.

Preview locally with `python3 -m http.server 8000`. On both homepages, check greeting/languages, compact layout, town/lungi navigation, service links, video Play/Pause, Sound on/off and the installed voice list. On Safari/iPhone, click Sound on directly and allow the media gesture; voices unavailable on that device will remain unavailable. Browser narration and video audio need real-device verification. In the news page, check filters, source dates and visible photo credits. No test enquiry is sent by the update.

```bash
git add index.html index-ta.html podaturpet-business-promo.js podaturpet-compact-entrance.css podaturpet-promo-voice.js content/business-promo-narration.js podaturpet-local-updates.html podaturpet-local-photo-picks.css images/business-promo/business-help.mp4 images/business-promo/business-help-poster.webp images/region/tiruttani-news-520.webp images/region/poondi-news-520.webp tools/render_business_promo.py tools/render_promo_audio.py docs/animated-promo-20261018/verify.cjs docs/local-refresh/dom-test.cjs docs/compact-festive-voice-20261018/
git diff --cached --stat
git diff --cached --check
git commit -m "Compact homepage with Deepavali wishes, voiced promo and sourced local news"
git push origin main
```

No assistant commit, push, merge or deployment was performed.

## Rebuild original media (optional)

Pillow and ffmpeg are development-only tools. Run `python3 tools/render_business_promo.py` and then `python3 tools/render_promo_audio.py`. The second command adds the original music to the newly rendered silent video. The site needs only the supplied media and frontend files.

## Verification limits

See TEST-RESULTS.md. DOM speech tests use a mocked speech engine; they cannot certify real voice availability or audio quality on your Mac/iPhone. The compact CSS is responsive by construction, but no supported browser-rendered screenshot/real-device visual verification is claimed. The original source screenshot and representative animation frames were reviewed. No post-deployment or Search Console operation was performed.
