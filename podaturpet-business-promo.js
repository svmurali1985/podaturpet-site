/* Local video only; no network APIs, identifiers or enquiry submission. */
(() => {
 'use strict';
 const video = document.querySelector('.biz-promo-video');
 const caption = document.querySelector('.biz-promo-caption');
 if (!video || !caption) return;
 const scenes = [["Let’s understand your business.", "உங்கள் தொழிலின் தேவைகளைப் புரிந்துகொள்வோம்."], ["Introduce your shop with clear advertising.", "தெளிவான விளம்பரத்துடன் உங்கள் கடையை அறிமுகப்படுத்துங்கள்."], ["We build your business website for FREE.", "உங்கள் தொழிலுக்கான இணையதளம் இலவசமாக உருவாக்கித் தருகிறோம்."], ["Your customer chatbot — built for FREE.", "உங்கள் வாடிக்கையாளர் சாட்பாட் — இலவசமாக உருவாக்கித் தருகிறோம்."], ["Automation tools for your work — built for FREE.", "உங்கள் பணிகளுக்கான ஆட்டோமேஷன் கருவிகள் — இலவசமாக உருவாக்கித் தருகிறோம்."], ["Connect with local information and businesses.", "உள்ளூர் தகவல் மற்றும் வணிகங்களுடன் இணைவோம்."], ["Website. Chatbot. Automation. FREE. No service charge.", "Website. Chatbot. Automation. இலவசம். சேவைக் கட்டணம் இல்லை."]];
 function updateCaption() {
  const i = Math.max(0, Math.min(scenes.length - 1, Math.floor((video.currentTime || 0) / 3)));
  const [en, ta] = scenes[i];
  caption.dataset.siteEn = en; caption.dataset.siteTa = ta;
  caption.textContent = document.documentElement.lang.startsWith('ta') ? ta : en;
 }
 video.addEventListener('timeupdate', updateCaption);
 video.addEventListener('seeked', updateCaption);
 document.addEventListener('podaturpet:language', updateCaption);
 const toggle = document.querySelector('.biz-promo-toggle');
 function updateToggle() {
  if (!toggle) return;
  const label = toggle.querySelector('[data-site-en]');
  const en = video.paused ? 'Play animation' : 'Pause animation';
  const ta = video.paused ? 'அனிமேஷனை இயக்குங்கள்' : 'அனிமேஷனை நிறுத்துங்கள்';
  label.dataset.siteEn = en; label.dataset.siteTa = ta;
  label.textContent = document.documentElement.lang.startsWith('ta') ? ta : en;
  toggle.setAttribute('aria-pressed', String(!video.paused));
 }
 if (toggle) {
  toggle.hidden = false; video.controls = false;
  toggle.addEventListener('click', () => {
   if (!video.paused) video.pause();
   else { const playing = video.play(); if (playing?.catch) playing.catch(() => {}); }
  });
  video.addEventListener('play', updateToggle);
  video.addEventListener('pause', updateToggle);
  document.addEventListener('podaturpet:language', updateToggle);
  updateToggle();
 }
 const motion = window.matchMedia?.('(prefers-reduced-motion: reduce)');
 const saveData = navigator.connection?.saveData === true;
 let attempted = false;
 // A single automatic play attempt when visible. Native pause remains respected.
 if ('IntersectionObserver' in window) {
  const observer = new IntersectionObserver(entries => {
   for (const entry of entries) {
    if (!entry.isIntersecting) { video.pause(); continue; }
    if (attempted || motion?.matches || saveData || document.hidden) continue;
    attempted = true; video.muted = true;
    const playing = video.play();
    if (playing?.catch) playing.catch(() => {}); // Controls remain if autoplay is blocked.
   }
  }, {threshold: 0.4});
  observer.observe(video);
  window.addEventListener('pagehide', () => observer.disconnect(), {once:true});
 }
 document.addEventListener('visibilitychange', () => { if (document.hidden) video.pause(); });
 motion?.addEventListener?.('change', event => { if (event.matches) video.pause(); });
 updateCaption();
})();
