(() => {
  'use strict';
  const videoPanel = document.querySelector('.ptcf-video');
  videoPanel?.addEventListener('toggle', () => {
    if (!videoPanel.open) videoPanel.querySelector('video')?.pause();
  });
  const hero = document.querySelector('.hero');
  const gallery = document.getElementById('lungi-lifestyle-gallery');
  const story = document.getElementById('podaturpet-colour-story');
  const collection = document.getElementById('powerloom-video');
  const scopes = [hero, gallery, story, collection].filter(Boolean);
  if (!scopes.length) return;
  const bar = document.createElement('nav');
  bar.className = 'pt-language-options';
  bar.setAttribute('aria-label', 'Choose introduction and gallery language');
  const dictionary = {
    "Patterns worth a closer look": "அருகில் பார்த்து ரசிக்க வேண்டிய வடிவங்கள்",
    "Bring more colour to your collection.": "உங்கள் தொகுப்பில் மேலும் வண்ணங்களைச் சேருங்கள்.",
    "Explore blue checks and colourful woven patterns. Choose a style for your shop, then ask us about available designs and bulk prices.": "நீல நிறக் கட்டங்களையும் வண்ணமயமான நெசவு வடிவங்களையும் பாருங்கள். உங்கள் கடைக்கான பாணியைத் தேர்ந்தெடுத்து, கிடைக்கும் வடிவங்கள் மற்றும் மொத்த விலை பற்றி எங்களிடம் கேளுங்கள்.",
    "Find lungis for my shop": "என் கடைக்கான லுங்கிகளைத் தேர்வு செய்ய",
    "Explore woven patterns": "நெசவு வடிவங்களைப் பார்க்க",
    "Watch weaving · Optional video": "நெசவைக் காணுங்கள் · விருப்பக் காணொளி",
    "Original weaving footage from the existing website.": "இணையதளத்தில் ஏற்கெனவே உள்ள உண்மையான நெசவுக் காணொளி.",
    "Explore designs & watch weaving": "வடிவங்களையும் நெசவையும் பார்க்க",

    "Checks. Colours. Everyday style.": "கட்டங்கள். வண்ணங்கள். அன்றாட அணியும் பாணி.",
    "Podaturpet · Lungis & local life": "பொதட்டூர்பேட்டை · லுங்கிகளும் ஊர் வாழ்க்கையும்",
    "Discover the colours of Podaturpet.": "பொதட்டூர்பேட்டையின் வண்ணங்களைக் கண்டறியுங்கள்.",
    "Get to know a Tamil Nadu town where handloom and powerloom weaving are part of local life. Then explore the checks, stripes and colours in our lungi collection.": "கைத்தறி மற்றும் விசைத்தறி நெசவு ஊர் வாழ்க்கையின் ஒரு பகுதியாக இருக்கும் பொதட்டூர்பேட்டையை அறிந்துகொள்ளுங்கள். எங்கள் லுங்கித் தொகுப்பில் உள்ள கட்டங்கள், கோடுகள் மற்றும் வண்ணங்களைப் பாருங்கள்.",
    "From subtle everyday patterns to bold colour combinations, find a look to share with your customers—or discover the places and community behind Podaturpet.": "எளிமையான அன்றாட வடிவங்கள் முதல் கவர்ச்சியான வண்ணக் கலவைகள் வரை, உங்கள் வாடிக்கையாளர்களுக்கான பாணியைத் தேர்ந்தெடுங்கள். பொதட்டூர்பேட்டையின் இடங்களையும் சமூக வாழ்க்கையையும் அறிந்துகொள்ளுங்கள்.",
    "Explore Lungi Designs": "லுங்கி வடிவங்களைப் பார்க்க",
    "Discover Podaturpet": "பொதட்டூர்பேட்டையை அறிய",

    'Discover Podaturpet Lungis.': 'பொதட்டூர்பேட்டை லுங்கிகளை அறிமுகப்படுத்துகிறோம்.',
    'Buy. Sell. Grow Together.': 'வாங்குங்கள். விற்பனை செய்யுங்கள். இணைந்து வளருங்கள்.',
    'Buy lungis wholesale, promote your lungi business, or explore investment and partnership opportunities. Connect with us to discuss your needs.': 'லுங்கிகளை மொத்தமாக வாங்க, உங்கள் லுங்கி வணிகத்தை விளம்பரப்படுத்த, அல்லது முதலீடு மற்றும் கூட்டாண்மை வாய்ப்புகளைப் பற்றி அறிய எங்களைத் தொடர்பு கொள்ளுங்கள்.',
    'Buy Lungis Wholesale': 'மொத்தமாக லுங்கி வாங்க',
    'Sell / Advertise Your Business': 'விற்க / வணிகத்தை விளம்பரப்படுத்த',
    'Investment & Partnership Enquiry': 'முதலீடு மற்றும் கூட்டாண்மை விசாரணை',
    'Lungi manufacturing · Podaturpet, Tamil Nadu, India': 'லுங்கி உற்பத்தி · பொதட்டூர்பேட்டை, தமிழ்நாடு, இந்தியா',
    'Tradition in every thread. Trust in every order.': 'ஒவ்வொரு நூலிலும் பாரம்பரியம். ஒவ்வொரு ஆர்டரிலும் நம்பிக்கை.',
    'International buyer desk · Call / WhatsApp': 'வணிக விசாரணைகள் · அழைப்பு / வாட்ஸ்அப்',
    'Message now': 'இப்போது தொடர்பு கொள்ள',
    'Direct wholesale enquiry': 'நேரடி மொத்த விற்பனை விசாரணை',
    'Original product photographs': 'உண்மையான தயாரிப்புப் படங்கள்',
    'India & overseas buyers welcome': 'இந்தியா மற்றும் வெளிநாட்டு வாடிக்கையாளர்களை வரவேற்கிறோம்',
    '▶ Watch the weaving story come to life': '▶ நெசவுக் காணொளியைப் பார்க்க',
    'Lungi lifestyle inspiration': 'லுங்கி அணியும் பாணிகள்',
    'Help your customers picture the look.': 'உங்கள் வாடிக்கையாளர்களுக்குப் புதிய அணியும் பாணிகளைக் காட்டுங்கள்.',
    'Explore three ways to wear traditional checked lungis. These original AI-generated images illustrate styling ideas; they do not show confirmed stock or exact product specifications.': 'பாரம்பரிய கட்டம் போட்ட லுங்கிகளை அணியும் மூன்று பாணிகளைப் பாருங்கள். இவை AI மூலம் உருவாக்கப்பட்ட மாதிரிப் படங்கள்; கையிருப்பில் உள்ள பொருட்களையோ துல்லியமான தயாரிப்பு விவரங்களையோ காட்டவில்லை.',
    'AI styling concept · Not a stock photo': 'AI மாதிரிப் படம் · கையிருப்புப் பொருளின் படம் அல்ல',
    'Classic blue checks': 'நீல நிறக் கட்டங்கள்',
    'Rich green checks': 'அடர் பச்சை நிறக் கட்டங்கள்',
    'Traditional maroon checks': 'பாரம்பரிய மெரூன் நிறக் கட்டங்கள்',
    'Like this look? Ask for photographs of available designs in similar colours.': 'இந்தப் பாணி பிடித்திருக்கிறதா? இதே போன்ற நிறங்களில் கிடைக்கும் பொருட்களின் உண்மையான படங்களைக் கேளுங்கள்.',
    'Request photos & bulk prices': 'படங்கள் மற்றும் மொத்த விலை கேட்க',
    'Buying for your shop or distribution business?': 'உங்கள் கடைக்காக அல்லது விநியோக வணிகத்திற்காக வாங்குகிறீர்களா?',
    'Browse actual product photographs': 'உண்மையான தயாரிப்புப் படங்களைப் பார்க்க',
    ', then share your quantity and destination. Confirm samples, fabric, colours and availability before placing an order.': ' பின்னர் தேவையான எண்ணிக்கை மற்றும் விநியோக இடத்தைத் தெரிவியுங்கள். ஆர்டர் செய்வதற்கு முன் மாதிரி, துணி, நிறங்கள் மற்றும் கையிருப்பை உறுதிப்படுத்துங்கள்.'
  };
  const nodes = [];
  scopes.forEach(scope => {
    const walker = document.createTreeWalker(scope, NodeFilter.SHOW_TEXT);
    while (walker.nextNode()) {
      const node = walker.currentNode;
      const key = node.textContent.trim();
      if (dictionary[key]) nodes.push([node, node.textContent, dictionary[key]]);
    }
  });
  const buttons = [];
  const setLanguage = lang => {
    nodes.forEach(([node, en, ta]) => { node.textContent = lang === 'ta' ? ta : en; node.parentElement.lang = lang; });
    buttons.forEach(button => button.setAttribute('aria-pressed', String(button.dataset.language === lang)));
    try { localStorage.setItem('podaturpet-intro-language', lang); } catch (_) {}
  };
  [['en', 'English'], ['ta', 'தமிழ்']].forEach(([lang, label]) => {
    const button = document.createElement('button');
    button.type = 'button'; button.textContent = label; button.lang = lang;
    button.dataset.language = lang; button.addEventListener('click', () => setLanguage(lang));
    buttons.push(button); bar.append(button);
  });
  const more = document.createElement('a');
  more.textContent = 'More languages / பிற மொழிகள்';
  more.href = 'https://translate.google.com/translate?sl=auto&tl=en&u=' + encodeURIComponent('https://podaturpet.com' + location.pathname);
  more.target = '_blank'; more.rel = 'noopener noreferrer';
  bar.append(more);
  const note = document.createElement('small');
  note.textContent = 'English / தமிழ்: introduction, town story & gallery. More languages: translate the website.';
  bar.append(note);
  const placement = hero?.querySelector('.hero-inner') || gallery?.querySelector('.ll-wrap') || scopes[0];
  placement.prepend(bar);
  let saved = 'en';
  try { saved = localStorage.getItem('podaturpet-intro-language') || 'en'; } catch (_) {}
  setLanguage(saved === 'ta' ? 'ta' : 'en');
})();
