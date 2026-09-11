(() => {
  'use strict';
  const drawer = document.getElementById('pt-page-explorer');
  if (!drawer) return;
  const summary = drawer.querySelector('summary');
  const close = drawer.querySelector('.pt-explorer-close');
  const words = {"Explore pages": "பக்கங்களைப் பார்க்க", "Find your next page": "அடுத்த பக்கத்தைத் தேர்வு செய்ய", "Lungi business": "லுங்கி வணிகம்", "Town & culture": "ஊரும் பண்பாடும்", "Modern Lungi": "நவீன லுங்கி", "Request a quote": "விலை விவரம் கேட்க", "Close page links": "பக்க இணைப்புகளை மூட", "Lungi catalogue": "லுங்கி பட்டியல்", "See designs and product references.": "வடிவங்களையும் தயாரிப்பு எண்களையும் பார்க்க.", "Buyer guide": "வாங்குபவர் வழிகாட்டி", "Samples, specifications and bulk orders.": "மாதிரிகள், விவரங்கள், மொத்த ஆர்டர்கள்.", "How lungis are made": "லுங்கி உருவாகும் முறை", "Follow the yarn-to-lungi process.": "நூலிலிருந்து லுங்கி வரை அறிய.", "Town guide": "ஊர் வழிகாட்டி", "Travel, facilities and local information.": "பயணம், வசதிகள் மற்றும் உள்ளூர் தகவல்கள்.", "Stories & culture": "கதைகளும் பண்பாடும்", "Weaving traditions and village stories.": "நெசவு பாரம்பரியமும் கிராமக் கதைகளும்.", "Local shops": "உள்ளூர் கடைகள்", "Browse shops and service categories.": "கடைகள் மற்றும் சேவை வகைகளைப் பார்க்க.", "Places to visit": "சுற்றிப் பார்க்கும் இடங்கள்", "Explore regional temples and landscapes.": "அருகிலுள்ள கோவில்கள் மற்றும் இயற்கை இடங்கள்.", "Product innovation": "புதிய லுங்கி யோசனைகள்", "Discover new lungi concepts and features.": "புதிய வடிவங்களையும் அம்சங்களையும் அறிய.", "Concept collection": "புதிய வடிவத் தொகுப்பு", "Explore modern styling ideas.": "நவீன அணியும் பாணிகளைப் பார்க்க.", "Partnerships": "கூட்டாண்மை", "Research and prototype collaboration.": "ஆராய்ச்சி மற்றும் மாதிரி உருவாக்கத்தில் இணைய."};
  close.hidden = false;
  function dismiss(restoreFocus) {
    drawer.open = false;
    if (restoreFocus) summary.focus({preventScroll:true});
  }
  close.addEventListener('click', () => dismiss(true));
  drawer.addEventListener('keydown', event => {
    if (event.key === 'Escape' && drawer.open) {event.preventDefault();dismiss(true);}
  });
  document.addEventListener('pointerdown', event => {
    if (drawer.open && !drawer.contains(event.target)) dismiss(false);
  });
  drawer.querySelectorAll('a').forEach(a => a.addEventListener('click', () => dismiss(true)));
  function translate(language) {
    const tamil = language === 'ta';
    drawer.lang = tamil ? 'ta' : 'en';
    drawer.querySelectorAll('[data-explorer-text]').forEach(el => {
      const english = el.dataset.explorerText;
      el.textContent = tamil ? words[english] || english : english;
    });
    close.setAttribute('aria-label', tamil ? words['Close page links'] : 'Close page links');
  }
  document.addEventListener('podaturpet:language', event => translate(event.detail.language));
  translate(document.documentElement.dataset.buyerLanguage);
})();
