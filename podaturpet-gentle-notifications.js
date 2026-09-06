(function () {
  "use strict";

  var notice = document.getElementById("gentle-notice");
  if (!notice) return;

  var closeButton = document.getElementById("gentle-notice-close");
  var soundButton = document.getElementById("gentle-notice-sound");
  var label = document.getElementById("gentle-notice-label");
  var title = document.getElementById("gentle-notice-title");
  var copy = document.getElementById("gentle-notice-copy");
  var tamil = document.getElementById("gentle-notice-tamil");
  var action = document.getElementById("gentle-notice-action");
  var rotationStorageKey = "podaturpet-gentle-notice-next-message-v5";
  var nextAppearanceStorageKey = "podaturpet-gentle-notice-next-appearance-v5";
  var soundStorageKey = "podaturpet-gentle-notice-sound-enabled";
  var shownStorageKey = "podaturpet-gentle-notice-shown-v2";
  var pauseStorageKey = "podaturpet-gentle-notice-paused-until-v5";
  var rotationInterval = 3 * 60 * 1000;
  var firstAppearanceDelay = 12 * 1000;
  var visibleDuration = 22000;
  var dismissalPauseDuration = rotationInterval;
  var pausedUntil = 0;
  var nextAppearanceAt = 0;
  var messageIndex = 0;
  var soundEnabled = false;
  var hasShownThisSession = false;
  var audioUnlocked = false;
  var audioContext = null;
  var showTimer = null;
  var hideTimer = null;
  var speechTimer = null;
  var activeMessage = null;
  var shownAt = 0;

  var messages = [
    {
        "type": "lungi",
        "label": "Wholesale buyer invitation",
        "title": "Looking for lungis your customers will remember?",
        "copy": "Explore original checked designs from the Podaturpet textile region. Tell us your quantity and destination to request available options.",
        "tamil": "தரமான லுங்கிகளை மொத்தமாக வாங்க வேண்டுமா? உங்கள் தேவையை எங்களுக்கு அனுப்புங்கள்.",
        "action": "Request wholesale options",
        "whatsapp": "Hello Podaturpet Textile Team, I am interested in wholesale lungis. Country or city: ____ Required quantity: ____ Preferred design: ____ Please share available options and quotation."
    },
    {
        "type": "lungi",
        "label": "Try before a larger order",
        "title": "Begin with designs, samples and clear details.",
        "copy": "Ask about available patterns, sample possibilities, packing and commercial terms before planning your bulk order.",
        "tamil": "பெரிய ஆர்டருக்கு முன் டிசைன், சாம்பிள் மற்றும் விவரங்களை கேட்டுத் தெரிந்து கொள்ளுங்கள்.",
        "action": "Ask about samples",
        "whatsapp": "Hello Podaturpet Textile Team, I would like to ask about lungi designs and sample options before a bulk order. Destination: ____ Approximate bulk quantity: ____"
    },
    {
        "type": "advertising",
        "label": "Grocery and provision stores",
        "title": "Own a grocery or provision store?",
        "copy": "Reach nearby families looking for everyday groceries and household essentials.",
        "tamil": "உங்கள் மளிகை அல்லது அத்தியாவசிய பொருட்கள் கடையை விளம்பரம் செய்யுங்கள்.",
        "action": "Advertise your grocery store",
        "whatsapp": "Hello Podaturpet Advertising Team, I would like to advertise my grocery or provision store on Podaturpet.com."
    },
    {
        "type": "advertising",
        "label": "Vegetable and fruit shops",
        "title": "Sell fresh vegetables or fruit?",
        "copy": "Help local shoppers discover your vegetable stall, fruit shop, or fresh produce.",
        "tamil": "உங்கள் காய்கறி மற்றும் பழக்கடையை விளம்பரம் செய்யுங்கள்.",
        "action": "Advertise your produce shop",
        "whatsapp": "Hello Podaturpet Advertising Team, I would like to advertise my vegetable or fruit shop on Podaturpet.com."
    },
    {
        "type": "advertising",
        "label": "Restaurants, bakeries and tea shops",
        "title": "Run a restaurant, bakery, or tea shop?",
        "copy": "Promote your meals, bakery treats, tea, snacks, and special offers.",
        "tamil": "உங்கள் உணவகம், பேக்கரி அல்லது தேநீர் கடையை விளம்பரம் செய்யுங்கள்.",
        "action": "Advertise your food business",
        "whatsapp": "Hello Podaturpet Advertising Team, I would like to advertise my restaurant, bakery, tea shop, or food business on Podaturpet.com."
    },
    {
        "type": "advertising",
        "label": "Clothing and lungi retail shops",
        "title": "Own a clothing or lungi retail shop?",
        "copy": "Showcase clothing, family fashion, traditional garments, and retail lungis.",
        "tamil": "உங்கள் துணிக்கடை அல்லது லுங்கி விற்பனை கடையை விளம்பரம் செய்யுங்கள்.",
        "action": "Advertise your clothing shop",
        "whatsapp": "Hello Podaturpet Advertising Team, I would like to advertise my clothing, garment, or lungi retail shop on Podaturpet.com."
    },
    {
        "type": "advertising",
        "label": "Jewellery and fancy stores",
        "title": "Have a jewellery or fancy store?",
        "copy": "Promote jewellery, accessories, gifts, cosmetics, and festive collections.",
        "tamil": "உங்கள் நகைக்கடை அல்லது பேன்சி கடையை விளம்பரம் செய்யுங்கள்.",
        "action": "Advertise your jewellery shop",
        "whatsapp": "Hello Podaturpet Advertising Team, I would like to advertise my jewellery, accessories, or fancy store on Podaturpet.com."
    },
    {
        "type": "lungi",
        "label": "Lungi wholesale enquiries",
        "title": "Looking for quality lungis in bulk?",
        "copy": "Connect with Podaturpet textile suppliers for wholesale and business enquiries.",
        "tamil": "தரமான லுங்கிகளை மொத்தமாக வாங்க வேண்டுமா? எங்களை தொடர்பு கொள்ளுங்கள்.",
        "action": "Request a wholesale quote",
        "whatsapp": "Hello Podaturpet Team, I would like a wholesale lungi quotation. Quantity: ____ Delivery location: ____"
    },
    {
        "type": "advertising",
        "label": "Mobile phones and electronics",
        "title": "Sell phones, electronics, or accessories?",
        "copy": "Reach customers looking for mobile phones, gadgets, repairs, and accessories.",
        "tamil": "உங்கள் மொபைல் அல்லது எலக்ட்ரானிக்ஸ் கடையை விளம்பரம் செய்யுங்கள்.",
        "action": "Advertise your electronics shop",
        "whatsapp": "Hello Podaturpet Advertising Team, I would like to advertise my mobile phone, electronics, or accessories shop on Podaturpet.com."
    },
    {
        "type": "advertising",
        "label": "Pharmacies and medical services",
        "title": "Own a pharmacy or medical service?",
        "copy": "Help families find your medical shop, pharmacy, or healthcare service.",
        "tamil": "உங்கள் மருந்தகம் அல்லது மருத்துவ சேவையை விளம்பரம் செய்யுங்கள்.",
        "action": "Advertise your medical service",
        "whatsapp": "Hello Podaturpet Advertising Team, I would like to advertise my pharmacy, medical shop, or healthcare service on Podaturpet.com."
    },
    {
        "type": "advertising",
        "label": "Car rentals and taxi services",
        "title": "Offer car rentals or taxi services?",
        "copy": "Advertise local taxi rides, rental cars, airport trips, and travel bookings.",
        "tamil": "உங்கள் வாடகை கார் அல்லது டாக்சி சேவையை விளம்பரம் செய்யுங்கள்.",
        "action": "Advertise your car service",
        "whatsapp": "Hello Podaturpet Advertising Team, I would like to advertise my car rental, taxi, or local transport service on Podaturpet.com."
    },
    {
        "type": "advertising",
        "label": "Bike repairs and vehicle workshops",
        "title": "Run a bike or vehicle workshop?",
        "copy": "Promote two-wheeler repairs, spare parts, servicing, and vehicle maintenance.",
        "tamil": "உங்கள் இருசக்கர வாகன பழுதுபார்ப்பு மையத்தை விளம்பரம் செய்யுங்கள்.",
        "action": "Advertise your vehicle workshop",
        "whatsapp": "Hello Podaturpet Advertising Team, I would like to advertise my bike repair, vehicle workshop, or spare-parts business on Podaturpet.com."
    },
    {
        "type": "advertising",
        "label": "Real estate and land brokers",
        "title": "Buying or selling land, plots, or homes?",
        "copy": "Promote property listings, land sales, rentals, and local broker services.",
        "tamil": "நிலம், வீடு, மனை அல்லது தரகர் சேவையை விளம்பரம் செய்யுங்கள்.",
        "action": "Advertise your property",
        "whatsapp": "Hello Podaturpet Advertising Team, I would like to advertise my land, house, plot, real-estate, or property broker service on Podaturpet.com."
    },
    {
        "type": "advertising",
        "label": "Electrical and hardware stores",
        "title": "Sell electrical or hardware supplies?",
        "copy": "Reach customers looking for fittings, tools, plumbing, paint, and materials.",
        "tamil": "உங்கள் எலக்ட்ரிக்கல் அல்லது ஹார்டுவேர் கடையை விளம்பரம் செய்யுங்கள்.",
        "action": "Advertise your hardware store",
        "whatsapp": "Hello Podaturpet Advertising Team, I would like to advertise my electrical, hardware, plumbing, or building supplies shop on Podaturpet.com."
    },
    {
        "type": "town-guide",
        "label": "Temples and nearby places",
        "title": "Explore temples around Podaturpet",
        "copy": "Discover local temples, visitor attractions, and places worth exploring nearby.",
        "tamil": "பொதட்டூர்பேட்டை அருகிலுள்ள கோவில்கள் மற்றும் சுற்றுலா இடங்களை அறிந்து கொள்ளுங்கள்.",
        "action": "Ask about nearby places",
        "whatsapp": "Hello Podaturpet Team, I would like information about nearby temples and visitor attractions."
    },
    {
        "type": "advertising",
        "label": "Furniture and household goods",
        "title": "Have a furniture or household store?",
        "copy": "Showcase furniture, kitchen items, home essentials, and household products.",
        "tamil": "உங்கள் மரச்சாமான்கள் அல்லது வீட்டு உபயோக பொருட்கள் கடையை விளம்பரம் செய்யுங்கள்.",
        "action": "Advertise your home store",
        "whatsapp": "Hello Podaturpet Advertising Team, I would like to advertise my furniture, kitchenware, or household goods store on Podaturpet.com."
    },
    {
        "type": "advertising",
        "label": "Salons and beauty parlours",
        "title": "Run a salon or beauty parlour?",
        "copy": "Promote haircuts, grooming, beauty treatments, bridal styling, and appointments.",
        "tamil": "உங்கள் சலூன் அல்லது அழகு நிலையத்தை விளம்பரம் செய்யுங்கள்.",
        "action": "Advertise your salon",
        "whatsapp": "Hello Podaturpet Advertising Team, I would like to advertise my salon, barber shop, beauty parlour, or bridal service on Podaturpet.com."
    },
    {
        "type": "advertising",
        "label": "Tuition and coaching classes",
        "title": "Offer tuition or coaching classes?",
        "copy": "Help local families discover tuition, exam coaching, training, and classes.",
        "tamil": "உங்கள் டியூஷன், பயிற்சி வகுப்பு அல்லது கல்வி மையத்தை விளம்பரம் செய்யுங்கள்.",
        "action": "Advertise your classes",
        "whatsapp": "Hello Podaturpet Advertising Team, I would like to advertise my tuition centre, coaching class, training, or educational service on Podaturpet.com."
    },
    {
        "type": "advertising",
        "label": "Weddings and event organisers",
        "title": "Provide wedding or event services?",
        "copy": "Advertise wedding planning, decoration, catering, and event arrangements.",
        "tamil": "உங்கள் திருமண அல்லது நிகழ்ச்சி ஏற்பாட்டு சேவையை விளம்பரம் செய்யுங்கள்.",
        "action": "Advertise your event service",
        "whatsapp": "Hello Podaturpet Advertising Team, I would like to advertise my wedding planning, event organising, decoration, or catering business on Podaturpet.com."
    },
    {
        "type": "advertising",
        "label": "Photography and video services",
        "title": "Offer photography or video services?",
        "copy": "Showcase wedding photography, videography, studio work, and family events.",
        "tamil": "உங்கள் புகைப்படம் அல்லது வீடியோ சேவையை விளம்பரம் செய்யுங்கள்.",
        "action": "Advertise your photography",
        "whatsapp": "Hello Podaturpet Advertising Team, I would like to advertise my photography, videography, studio, or event coverage service on Podaturpet.com."
    },
    {
        "type": "advertising",
        "label": "Travel agencies and tourism",
        "title": "Run a travel agency or tourist service?",
        "copy": "Promote trip planning, tour packages, pilgrimages, and local travel support.",
        "tamil": "உங்கள் சுற்றுலா, பயண நிறுவனம் அல்லது டிராவல்ஸ் சேவையை விளம்பரம் செய்யுங்கள்.",
        "action": "Advertise your travel agency",
        "whatsapp": "Hello Podaturpet Advertising Team, I would like to advertise my travel agency, tourism, pilgrimage, or tour service on Podaturpet.com."
    },
    {
        "type": "town-guide",
        "label": "Local travel advice",
        "title": "Planning a visit to Podaturpet?",
        "copy": "Find practical guidance about local travel, nearby towns, and transport connections.",
        "tamil": "பொதட்டூர்பேட்டைக்கு வர திட்டமிடுகிறீர்களா? பயண தகவல்களுக்கு எங்களை தொடர்பு கொள்ளுங்கள்.",
        "action": "Ask for travel information",
        "whatsapp": "Hello Podaturpet Team, I would like local travel information for visiting Podaturpet."
    },
    {
        "type": "advertising",
        "label": "Agriculture and farming supplies",
        "title": "Sell agricultural or farming supplies?",
        "copy": "Connect with farmers looking for seeds, feed, tools, and agricultural products.",
        "tamil": "உங்கள் விவசாய பொருட்கள் அல்லது கால்நடை தீவன கடையை விளம்பரம் செய்யுங்கள்.",
        "action": "Advertise your farming business",
        "whatsapp": "Hello Podaturpet Advertising Team, I would like to advertise my agricultural supplies, seeds, farming tools, or livestock feed business on Podaturpet.com."
    },
    {
        "type": "advertising",
        "label": "Textile manufacturers and wholesalers",
        "title": "Manufacture or wholesale textile products?",
        "copy": "Promote your weaving unit, textile production, wholesale products, and supplier services.",
        "tamil": "உங்கள் நெசவு நிறுவனம், ஜவுளி உற்பத்தி அல்லது மொத்த விற்பனையை விளம்பரம் செய்யுங்கள்.",
        "action": "Advertise your textile business",
        "whatsapp": "Hello Podaturpet Advertising Team, I would like to advertise my textile manufacturing, weaving unit, lungi wholesale, or supplier business on Podaturpet.com."
    },
    {
        "type": "advertising",
        "label": "Local jobs and recruitment",
        "title": "Hiring staff or looking for local workers?",
        "copy": "Advertise genuine vacancies, recruitment needs, and local job opportunities.",
        "tamil": "உங்கள் வேலைவாய்ப்பு அல்லது பணியாளர் தேவை விவரங்களை விளம்பரம் செய்யுங்கள்.",
        "action": "Advertise a job opportunity",
        "whatsapp": "Hello Podaturpet Advertising Team, I would like to advertise my local job vacancy, staffing requirement, or recruitment service on Podaturpet.com."
    }
];

  try {
    var savedMessageIndex = Number(window.sessionStorage.getItem(rotationStorageKey));
    if (Number.isFinite(savedMessageIndex) && savedMessageIndex >= 0) {
      messageIndex = savedMessageIndex % messages.length;
    }
    soundEnabled = window.sessionStorage.getItem(soundStorageKey) === "on";
    hasShownThisSession = window.sessionStorage.getItem(shownStorageKey) === "yes";
    pausedUntil = Number(window.sessionStorage.getItem(pauseStorageKey)) || 0;
    nextAppearanceAt = Number(window.sessionStorage.getItem(nextAppearanceStorageKey)) || 0;
    if (pausedUntil > Date.now() + rotationInterval) pausedUntil = 0;
    if (nextAppearanceAt > Date.now() + rotationInterval) nextAppearanceAt = 0;
  } catch (error) {
    messageIndex = 0;
  }

  function updateSoundButton() {
    soundButton.setAttribute("aria-pressed", soundEnabled ? "true" : "false");
    soundButton.setAttribute("aria-label", soundEnabled ? "Mute spoken advertising announcements" : "Enable spoken advertising announcements");
    soundButton.title = soundEnabled ? "Voice on — tap to mute" : "Voice off — tap to enable";
    soundButton.textContent = soundEnabled ? "🔊" : "🔇";
  }

  updateSoundButton();

  var promoVisual = document.createElement("div");
  promoVisual.className = "ad-promo-visual";
  promoVisual.setAttribute("aria-hidden", "true");
  promoVisual.innerHTML = '<span class="ad-promo-icon">📣</span><span><span class="ad-promo-caption">Featured local business</span><span class="ad-promo-subtitle">Reach more customers in Podaturpet</span></span><span class="ad-promo-sparkle">✦</span>';
  notice.insertBefore(promoVisual, title);

  var progress = document.createElement("div");
  progress.className = "ad-promo-progress";
  progress.setAttribute("aria-hidden", "true");
  progress.innerHTML = '<div class="ad-promo-progress-bar"></div>';
  notice.appendChild(progress);

  function updatePromoVisual(message) {
    var text = (message.label + " " + message.title).toLowerCase();
    var icon = "📣";
    var theme = "gold";

    if (/grocery|provision/.test(text)) { icon = "🛒"; theme = "green"; }
    else if (/vegetable|fruit|agricultur|farm/.test(text)) { icon = "🥬"; theme = "green"; }
    else if (/restaurant|bakery|tea|food/.test(text)) { icon = "🍽️"; theme = "rose"; }
    else if (/clothing|lungi|textile|weav/.test(text)) { icon = "🧵"; theme = "green"; }
    else if (/jewellery|fancy/.test(text)) { icon = "💎"; theme = "rose"; }
    else if (/mobile|phone|electronic/.test(text)) { icon = "📱"; theme = "blue"; }
    else if (/pharmac|medical|health/.test(text)) { icon = "💊"; theme = "blue"; }
    else if (/car|taxi|rental/.test(text)) { icon = "🚕"; theme = "blue"; }
    else if (/bike|vehicle|workshop/.test(text)) { icon = "🏍️"; theme = "blue"; }
    else if (/estate|land|property|home/.test(text)) { icon = "🏡"; theme = "green"; }
    else if (/electric|hardware/.test(text)) { icon = "🔧"; theme = "blue"; }
    else if (/furniture|household/.test(text)) { icon = "🛋️"; theme = "gold"; }
    else if (/salon|beauty/.test(text)) { icon = "💇"; theme = "rose"; }
    else if (/tuition|coaching|class/.test(text)) { icon = "📚"; theme = "violet"; }
    else if (/wedding|event/.test(text)) { icon = "🎊"; theme = "rose"; }
    else if (/photo|video/.test(text)) { icon = "📸"; theme = "violet"; }
    else if (/travel|touris/.test(text)) { icon = "✈️"; theme = "blue"; }
    else if (/jobs|hiring|recruitment/.test(text)) { icon = "💼"; theme = "violet"; }
    else if (/temple/.test(text)) { icon = "🛕"; theme = "gold"; }

    notice.setAttribute("data-ad-theme", theme);
    promoVisual.querySelector(".ad-promo-icon").textContent = icon;
    promoVisual.querySelector(".ad-promo-caption").textContent = message.type === "lungi" ? "Podaturpet wholesale collection" : (message.type === "advertising" ? "Featured local business" : "Discover Podaturpet");
    promoVisual.querySelector(".ad-promo-subtitle").textContent = message.type === "lungi" ? "Original designs for retailers and distributors" : (message.type === "advertising" ? "Reach more customers in Podaturpet" : "Helpful information from our town");
    progress.innerHTML = '<div class="ad-promo-progress-bar"></div>';
  }

  function playGentleChime() {
    if (!soundEnabled || !audioContext || audioContext.state !== "running") return;

    try {
      var now = audioContext.currentTime;
      var melody = [
        { frequency: 523.25, start: 0.00, duration: 0.31 },
        { frequency: 659.25, start: 0.17, duration: 0.32 },
        { frequency: 783.99, start: 0.35, duration: 0.37 },
        { frequency: 1046.50, start: 0.58, duration: 0.54 },
        { frequency: 1318.51, start: 0.80, duration: 0.44 }
      ];

      melody.forEach(function (note) {
        var start = now + note.start;
        var bell = audioContext.createOscillator();
        var bellGain = audioContext.createGain();
        bell.type = "sine";
        bell.frequency.setValueAtTime(note.frequency, start);
        bellGain.gain.setValueAtTime(0.0001, start);
        bellGain.gain.exponentialRampToValueAtTime(0.052, start + 0.045);
        bellGain.gain.exponentialRampToValueAtTime(0.0001, start + note.duration);
        bell.connect(bellGain);
        bellGain.connect(audioContext.destination);
        bell.start(start);
        bell.stop(start + note.duration + 0.02);

        var overtone = audioContext.createOscillator();
        var overtoneGain = audioContext.createGain();
        overtone.type = "triangle";
        overtone.frequency.setValueAtTime(note.frequency * 2, start);
        overtoneGain.gain.setValueAtTime(0.0001, start);
        overtoneGain.gain.exponentialRampToValueAtTime(0.012, start + 0.035);
        overtoneGain.gain.exponentialRampToValueAtTime(0.0001, start + note.duration * 0.74);
        overtone.connect(overtoneGain);
        overtoneGain.connect(audioContext.destination);
        overtone.start(start);
        overtone.stop(start + note.duration + 0.02);
      });
    } catch (error) {
      soundEnabled = false;
      soundButton.setAttribute("aria-pressed", "false");
      soundButton.setAttribute("aria-label", "Enable a gentle notification sound");
    }
  }

  function announceMessage(message) {
    window.clearTimeout(speechTimer);
    playGentleChime();
    speechTimer = window.setTimeout(function () {
      if (activeMessage === message && notice.classList.contains("is-visible")) {
        speakMessage(message);
      }
    }, 1350);
  }

  function findVoice(voices, language) {
    var exactVoice = voices.find(function (voice) {
      return voice.lang.toLowerCase().indexOf(language.toLowerCase()) === 0 && voice.localService;
    });

    return exactVoice || voices.find(function (voice) {
      return voice.lang.toLowerCase().indexOf(language.toLowerCase()) === 0;
    }) || null;
  }

  function speakMessage(message) {
    if (!soundEnabled || !audioUnlocked || !("speechSynthesis" in window) || !("SpeechSynthesisUtterance" in window)) {
      return;
    }

    try {
      window.speechSynthesis.cancel();

      var voices = window.speechSynthesis.getVoices();
      var tamilVoice = findVoice(voices, "ta");
      var englishVoice = findVoice(voices, "en-IN") || findVoice(voices, "en");

      if (tamilVoice) {
        var tamilSpeech = new window.SpeechSynthesisUtterance(
          message.tamil + " மேலும் தகவல்களுக்கு எங்களை தொடர்பு கொள்ளுங்கள். தொடர்பு எண், எட்டு ஏழு ஏழு எட்டு எட்டு, மூன்று ஆறு மூன்று எட்டு ஐந்து."
        );
        tamilSpeech.lang = tamilVoice.lang;
        tamilSpeech.voice = tamilVoice;
        tamilSpeech.rate = 0.91;
        tamilSpeech.pitch = 1.03;
        tamilSpeech.volume = 0.76;
        window.speechSynthesis.speak(tamilSpeech);
      }

      var englishSpeech = new window.SpeechSynthesisUtterance(
        message.title + " " + message.copy + " " + message.action + ". Contact us at eight seven seven eight eight, three six three eight five."
      );
      englishSpeech.lang = englishVoice ? englishVoice.lang : "en-IN";
      if (englishVoice) englishSpeech.voice = englishVoice;
      englishSpeech.rate = 0.93;
      englishSpeech.pitch = 1.02;
      englishSpeech.volume = 0.72;
      window.speechSynthesis.speak(englishSpeech);
    } catch (error) {
      // The advertisements continue visually when browser speech is unavailable.
    }
  }

  function unlockAudio() {
    if (audioUnlocked || !soundEnabled) return false;
    audioUnlocked = true;

    var AudioContextConstructor = window.AudioContext || window.webkitAudioContext;

    if (AudioContextConstructor) {
      try {
        if (!audioContext) audioContext = new AudioContextConstructor();
        if (audioContext.state === "suspended") {
          audioContext.resume().catch(function () {});
        }
      } catch (error) {
        audioContext = null;
      }
    }

    return true;
  }

  function handleFirstInteraction() {
    if (!unlockAudio()) return;

    if (activeMessage && notice.classList.contains("is-visible")) {
      announceMessage(activeMessage);
    }
  }

  function scheduleNext(delay) {
    window.clearTimeout(showTimer);
    showTimer = window.setTimeout(showNotice, Math.max(0, delay));
  }

  function resumeNoticeSchedule() {
    if (document.hidden || hasShownThisSession || notice.classList.contains("is-visible")) return;

    var scheduledAppearance = Math.max(pausedUntil, nextAppearanceAt);

    scheduleNext(scheduledAppearance > 0 ? scheduledAppearance - Date.now() : firstAppearanceDelay);
  }

  function hideNotice() {
    window.clearTimeout(hideTimer);
    window.clearTimeout(speechTimer);
    notice.classList.remove("is-visible");
    document.body.classList.remove("has-podaturpet-notice");
    notice.setAttribute("aria-hidden", "true");
    activeMessage = null;
    shownAt = 0;
  }

  function showNotice() {
    if (hasShownThisSession || notice.classList.contains("is-visible")) return;

    if (document.hidden) {
      scheduleNext(6000);
      return;
    }

    if (pausedUntil > Date.now()) {
      scheduleNext(pausedUntil - Date.now());
      return;
    }

    var message = messages[messageIndex];
    notice.setAttribute("data-notice-type", message.type);
    updatePromoVisual(message);
    label.textContent = message.label;
    title.textContent = message.title;
    copy.textContent = message.copy;
    tamil.textContent = message.tamil;
    action.textContent = message.action;
    action.href = "https://wa.me/918778836385?text=" + encodeURIComponent(message.whatsapp);
    notice.setAttribute("aria-hidden", "false");
    notice.classList.add("is-visible");
    document.body.classList.add("has-podaturpet-notice");

    activeMessage = message;
    hasShownThisSession = true;
    shownAt = Date.now();
    messageIndex = (messageIndex + 1) % messages.length;
    nextAppearanceAt = Date.now() + rotationInterval;

    try {
      window.sessionStorage.setItem(rotationStorageKey, String(messageIndex));
      window.sessionStorage.setItem(nextAppearanceStorageKey, String(nextAppearanceAt));
      window.sessionStorage.setItem(shownStorageKey, "yes");
    } catch (error) {
      // Rotation continues in memory if session storage is unavailable.
    }

    announceMessage(message);
    window.clearTimeout(hideTimer);
    hideTimer = window.setTimeout(hideNotice, visibleDuration);
  }

  notice.addEventListener("pointerenter", function () {
    window.clearTimeout(hideTimer);
  });

  notice.addEventListener("pointerleave", function () {
    if (notice.classList.contains("is-visible")) {
      hideTimer = window.setTimeout(hideNotice, 3500);
    }
  });

  closeButton.addEventListener("click", function () {
    window.clearTimeout(hideTimer);
    window.clearTimeout(speechTimer);
    notice.classList.remove("is-visible");
    document.body.classList.remove("has-podaturpet-notice");
    notice.setAttribute("aria-hidden", "true");

    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    }

    activeMessage = null;
    shownAt = 0;
    pausedUntil = Date.now() + dismissalPauseDuration;
    nextAppearanceAt = pausedUntil;

    try {
      window.sessionStorage.setItem(pauseStorageKey, String(pausedUntil));
      window.sessionStorage.setItem(nextAppearanceStorageKey, String(nextAppearanceAt));
    } catch (error) {
      // The current page still honors the full three-minute pause.
    }

  });

  soundButton.addEventListener("click", function () {
    soundEnabled = !soundEnabled;
    updateSoundButton();

    try {
      window.sessionStorage.setItem(soundStorageKey, soundEnabled ? "on" : "off");
    } catch (error) {
      // The sound preference still works for the current page.
    }

    if (!soundEnabled) {
      window.clearTimeout(speechTimer);
      if ("speechSynthesis" in window) window.speechSynthesis.cancel();
      return;
    }

    unlockAudio();
    if (activeMessage) announceMessage(activeMessage);
    else playGentleChime();
  });

  document.addEventListener("pointerdown", handleFirstInteraction, { once: true, capture: true });
  document.addEventListener("touchstart", handleFirstInteraction, { once: true, capture: true, passive: true });
  document.addEventListener("keydown", handleFirstInteraction, { once: true, capture: true });

  document.addEventListener("visibilitychange", function () {
    if (document.hidden && notice.classList.contains("is-visible")) {
      if ("speechSynthesis" in window) window.speechSynthesis.cancel();
      hideNotice();
      return;
    }

    resumeNoticeSchedule();
  });

  window.addEventListener("pageshow", resumeNoticeSchedule);
  window.addEventListener("focus", resumeNoticeSchedule);

  // A separate heartbeat recovers missed browser timers and prevents a hovered
  // advertisement from blocking every later item in the rotation.
  window.setInterval(function () {
    if (document.hidden || hasShownThisSession) return;

    if (notice.classList.contains("is-visible")) {
      if (shownAt > 0 && Date.now() - shownAt >= visibleDuration + 2500) {
        hideNotice();
      }
      return;
    }

    var dueAt = Math.max(pausedUntil, nextAppearanceAt);
    if (dueAt > 0 && Date.now() >= dueAt) {
      showNotice();
    }
  }, 1500);

  if (!hasShownThisSession) {
    var nextScheduledAppearance = Math.max(pausedUntil, nextAppearanceAt);
    scheduleNext(nextScheduledAppearance > Date.now() ? nextScheduledAppearance - Date.now() : firstAppearanceDelay);
  }
})();
