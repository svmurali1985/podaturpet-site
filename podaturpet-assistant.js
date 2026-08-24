(function () {
  'use strict';

  if (document.getElementById('podaturpet-assistant-launcher')) return;

  var phone = '918778836385';
  var email = 'svmuralicenterton@gmail.com';
  var pageIndex = [
    { path: '/index.html', title: 'Podaturpet lungi wholesale', terms: 'lungi wholesale manufacturer supplier bulk order cotton handloom powerloom quote price export' },
    { path: '/lungi-product-catalogue.html', title: 'Lungi product catalogue', terms: 'lungi designs products collection colour colors pattern checks photo catalogue catalog' },
    { path: '/podaturpet-local-business-directory.html', title: 'Retail shops directory', terms: 'shop shops retail grocery vegetable food restaurant pharmacy medical mobile jewellery hardware bakery store' },
    { path: '/about-podaturpet.html', title: 'About Podaturpet', terms: 'podaturpet town history district population pincode pin code village location tamil nadu' },
    { path: '/podaturpet-travel-pin-code.html', title: 'Travel and PIN code', terms: 'travel pin code pincode bus route station railway transport directions address distance 631208' },
    { path: '/podaturpet-tourist-places.html', title: 'Places to visit', terms: 'temple tourist visit tourism travel tiruttani sholingur nagari kailasakona attractions' },
    { path: '/podaturpet-government-offices.html', title: 'Government offices', terms: 'government office panchayat collector taluk public official' },
    { path: '/podaturpet-useful-information.html', title: 'Useful local information', terms: 'hospital emergency police bank post office bus useful information' },
    { path: '/podaturpet-stories-and-culture.html', title: 'Town stories and culture', terms: 'festival culture history temple story stories weaving community' },
    { path: '/podaturpet-textile-supplier-enquiry.html', title: 'Textile supplier enquiries', terms: 'supplier manufacturer textile mill business wholesale registration enquiry' },
    { path: '/privacy-policy.html', title: 'Privacy policy', terms: 'privacy ip address tracking visitor data location country analytics security' },
    { path: '/lungi-wholesale-india.html', title: 'Lungi wholesale across India', terms: 'india chennai mumbai delhi hyderabad kerala kolkata bengaluru wholesale delivery' },
    { path: '/lungi-wholesale-worldwide.html', title: 'International lungi buyers', terms: 'international export overseas worldwide dubai uae saudi oman malaysia singapore sri lanka' }
  ];
  var knowledge = [
    { match: /\b(pin\s*code|pincode|postal|zip\s*code|631208)\b|பின்|அஞ்சல்/i, answer: 'The PIN code of Podaturpet is 631208. Podaturpet is in Tiruvallur district, Tamil Nadu, India.', path: '/podaturpet-travel-pin-code.html', label: 'View travel and PIN details' },
    { match: /\b(contact|phone|mobile\s*number|call|whatsapp|email|reach)\b|தொடர்பு|நம்பர்/i, answer: 'Contact the Podaturpet team on +91 87788 36385 or email ' + email + '. You can also send your enquiry directly through WhatsApp.', path: 'https://wa.me/' + phone, label: 'Contact us on WhatsApp' },
    { match: /\b(price|cost|rate|minimum|moq|piece|pieces|quantity)\b|விலை|எவ்வளவு/i, answer: 'Lungi prices, minimum quantities, fabric details, availability, and delivery charges depend on the supplier and your order. Share your preferred design, approximate quantity, and destination to request a quote.', path: '/#quick-quote', label: 'Request a wholesale quote' },
    { match: /\b(add|list|register|promote)\b.*\b(shop|business|store)\b|\b(shop|business)\b.*\b(add|list|register)\b/i, answer: 'To add your shop, send your business name, category, location, and public contact number to the Podaturpet team. Individual listings are published after the details are checked.', path: 'https://wa.me/' + phone + '?text=' + encodeURIComponent('Hello Podaturpet Team, I would like to add my shop to the retail directory.'), label: 'Add your shop through WhatsApp' },
    { match: /\b(retail|shop|shops|grocery|store|stores|pharmacy|medical|restaurant|bakery|jewell?ery|hardware)\b|கடை|ஷாப்/i, answer: 'The Podaturpet retail directory includes grocery, clothing, restaurants, pharmacies, mobile shops, jewellery, hardware, vehicle services, and other local shop categories.', path: '/podaturpet-local-business-directory.html', label: 'Explore retail shops' },
    { match: /\b(advertis|advertisement|advertising|promotion|banner)\w*\b|விளம்பர/i, answer: 'You can enquire about advertising a local shop, service, rental, property, or special offer on Podaturpet.com. Advertising is handled separately from lungi wholesale and local shop listings.', path: 'https://wa.me/' + phone + '?text=' + encodeURIComponent('Hello Podaturpet Team, I would like to advertise my business on Podaturpet.com.'), label: 'Ask about advertising' },
    { match: /\b(temple|touris|visit|attraction|sightseeing|tiruttani|sholingur|nagari|kailasakona)\w*\b|கோவில்|சுற்றுலா/i, answer: 'Places and regional attractions near Podaturpet include Tiruttani, Sholingur, Nagari Hills, and Kailasakona. Check the town guide for location and visitor information.', path: '/podaturpet-tourist-places.html', label: 'Explore places to visit' },
    { match: /\b(bus|train|railway|station|route|travel|direction|transport|distance)\b|பஸ்|பயணம்/i, answer: 'Podaturpet has road and bus connections to nearby towns, including Tiruttani, Pallipattu, Nagari, Sholingur, Arakkonam, and Vellore. Tiruttani and Nagari provide nearby rail access.', path: '/podaturpet-travel-pin-code.html', label: 'View travel information' },
    { match: /\b(where|location|located|district|state|address)\b.*\b(podaturpet|town)\b|\b(podaturpet|town)\b.*\b(where|location|located|district)\b|எங்கே/i, answer: 'Podaturpet is a town in Pallipattu Taluk, Tiruvallur district, Tamil Nadu, India. Its PIN code is 631208.', path: '/about-podaturpet.html', label: 'Learn about Podaturpet' },
    { match: /\b(privacy|track|tracking|ip\s*address|visitor|personal\s*data|information\s*collect)\b/i, answer: 'The website may collect IP address, approximate location, browser details, pages visited, and visit time for analytics, security, advertising performance, and legitimate business purposes. Visitor information is not sold.', path: '/privacy-policy.html', label: 'Read our privacy policy' },
    { match: /\b(export|international|overseas|worldwide|dubai|uae|oman|malaysia|singapore|saudi|sri\s*lanka)\b/i, answer: 'Wholesale enquiries are welcome from international buyers, including the UAE, Saudi Arabia, Oman, Malaysia, Singapore, and Sri Lanka. Confirm specifications, supplier credentials, pricing, and delivery directly.', path: '/lungi-wholesale-worldwide.html', label: 'See international buyer information' },
    { match: /\b(design|designs|catalog|catalogue|collection|colour|color|pattern|check|checked|photo|image)\b/i, answer: 'The collection includes white checked lungis, blue-border designs, colourful cotton lungis, and handloom and powerloom styles. Browse the original product photographs and request your preferred design.', path: '/lungi-product-catalogue.html', label: 'Browse the lungi catalogue' },
    { match: /\b(lungi|lungis|wholesale|bulk|cotton|handloom|powerloom|weav|textile|manufacturer|supplier)\w*\b|லுங்கி|நெசவு/i, answer: 'Podaturpet is known for its weaving community and cotton, handloom, and powerloom lungis. Retailers, wholesalers, distributors, and overseas buyers can enquire about bulk sourcing and available designs.', path: '/#quick-quote', label: 'Send a lungi wholesale enquiry' }
  ];

  var launcher = document.createElement('button');
  launcher.id = 'podaturpet-assistant-launcher';
  launcher.className = 'pta-launcher';
  launcher.type = 'button';
  launcher.setAttribute('aria-expanded', 'false');
  launcher.setAttribute('aria-controls', 'podaturpet-assistant-panel');
  launcher.innerHTML = '<span class="pta-launcher-icon" aria-hidden="true">✦</span><span>Ask us</span>';

  var panel = document.createElement('section');
  panel.id = 'podaturpet-assistant-panel';
  panel.className = 'pta-panel';
  panel.setAttribute('aria-label', 'Podaturpet website assistant');
  panel.innerHTML = '<div class="pta-header"><div><div class="pta-title">Podaturpet Assistant</div><div class="pta-status">Website answers · Google search available</div></div><button class="pta-close" type="button" aria-label="Close assistant">×</button></div><div class="pta-messages" aria-live="polite"></div><div class="pta-suggestions"><button class="pta-suggestion" type="button">Lungi wholesale</button><button class="pta-suggestion" type="button">Retail shops</button><button class="pta-suggestion" type="button">PIN code</button><button class="pta-suggestion" type="button">Places to visit</button></div><form class="pta-form"><input class="pta-input" type="text" maxlength="240" placeholder="Ask about Podaturpet..." aria-label="Ask a question" autocomplete="off"><button class="pta-send" type="submit">Send</button></form><div class="pta-google">Answers use website information. Other topics can be <a href="https://www.google.com/search?q=Podaturpet" target="_blank" rel="noopener noreferrer">searched on Google</a>.</div>';

  document.body.appendChild(panel);
  document.body.appendChild(launcher);

  var messages = panel.querySelector('.pta-messages');
  var input = panel.querySelector('.pta-input');
  var googleFooter = panel.querySelector('.pta-google a');

  function addMessage(text, isUser, path, label, note) {
    var message = document.createElement('div');
    message.className = 'pta-message ' + (isUser ? 'pta-message-user' : 'pta-message-bot');
    message.appendChild(document.createTextNode(text));
    if (path && label) {
      var link = document.createElement('a');
      link.href = path;
      link.textContent = label + ' →';
      if (/^https?:\/\//i.test(path)) {
        link.target = '_blank';
        link.rel = 'noopener noreferrer';
      }
      message.appendChild(document.createElement('br'));
      message.appendChild(link);
    }
    if (note) {
      var detail = document.createElement('small');
      detail.textContent = note;
      message.appendChild(detail);
    }
    messages.appendChild(message);
    messages.scrollTop = messages.scrollHeight;
  }

  function googleUrl(question) {
    return 'https://www.google.com/search?q=' + encodeURIComponent(question);
  }

  function tokens(question) {
    return question.toLowerCase().replace(/[^a-z0-9\s]/g, ' ').split(/\s+/).filter(function (word) {
      return word.length > 2 && !/^(the|and|for|you|your|what|where|when|how|who|can|are|have|does|about|with|from|this|that|please)$/.test(word);
    });
  }

  function bestPage(words) {
    var best = null;
    var bestScore = 0;
    pageIndex.forEach(function (page) {
      var haystack = (page.title + ' ' + page.terms).toLowerCase();
      var score = words.reduce(function (total, word) {
        return total + (haystack.indexOf(word) !== -1 ? 1 : 0);
      }, 0);
      if (score > bestScore) {
        best = page;
        bestScore = score;
      }
    });
    return bestScore > 0 ? best : null;
  }

  function findPageAnswer(page, words) {
    return fetch(page.path, { credentials: 'same-origin' }).then(function (response) {
      if (!response.ok) throw new Error('Page unavailable');
      return response.text();
    }).then(function (markup) {
      var parsed = new DOMParser().parseFromString(markup, 'text/html');
      var candidates = Array.prototype.slice.call(parsed.querySelectorAll('main p, main li, article p, section p'));
      var bestText = '';
      var bestScore = 0;
      candidates.forEach(function (element) {
        var text = (element.textContent || '').replace(/\s+/g, ' ').trim();
        if (text.length < 35 || text.length > 440) return;
        var lowered = text.toLowerCase();
        var score = words.reduce(function (total, word) {
          return total + (lowered.indexOf(word) !== -1 ? 1 : 0);
        }, 0);
        if (score > bestScore) {
          bestText = text;
          bestScore = score;
        }
      });
      return bestScore > 0 ? bestText : '';
    });
  }

  function reply(question) {
    var trimmed = question.trim();
    if (!trimmed) return;
    addMessage(trimmed, true);
    input.value = '';
    googleFooter.href = googleUrl(trimmed);

    if (/^(hi|hello|hey|vanakkam|வணக்கம்)[!\s.]*$/i.test(trimmed)) {
      addMessage('Hello! Ask me about lungi wholesale, retail shops, local travel, visitor information, advertising, or Podaturpet.');
      return;
    }

    var match = knowledge.find(function (item) { return item.match.test(trimmed); });
    if (match) {
      addMessage(match.answer, false, match.path, match.label, 'Answer based on Podaturpet.com information.');
      return;
    }

    var words = tokens(trimmed);
    var page = bestPage(words);
    if (!page) {
      addMessage('I could not find that information on the Podaturpet website. You can search Google for current results.', false, googleUrl(trimmed), 'Search Google');
      return;
    }

    findPageAnswer(page, words).then(function (answer) {
      if (answer) {
        addMessage(answer, false, page.path, 'Read ' + page.title, 'Answer found in published website content.');
      } else {
        addMessage('A related page is available, but I could not find a clear answer. Open the page or use the Google search link below.', false, page.path, 'Open ' + page.title);
        addMessage('For more information beyond this website:', false, googleUrl(trimmed), 'Search Google');
      }
    }).catch(function () {
      addMessage('I could not load the related website page right now. You can search Google instead.', false, googleUrl(trimmed), 'Search Google');
    });
  }

  function setOpen(open) {
    panel.classList.toggle('pta-open', open);
    launcher.setAttribute('aria-expanded', open ? 'true' : 'false');
    if (open) input.focus();
  }

  launcher.addEventListener('click', function () { setOpen(!panel.classList.contains('pta-open')); });
  panel.querySelector('.pta-close').addEventListener('click', function () { setOpen(false); });
  panel.querySelector('.pta-form').addEventListener('submit', function (event) { event.preventDefault(); reply(input.value); });
  Array.prototype.forEach.call(panel.querySelectorAll('.pta-suggestion'), function (button) {
    button.addEventListener('click', function () { reply(button.textContent); });
  });
  document.addEventListener('keydown', function (event) {
    if (event.key === 'Escape' && panel.classList.contains('pta-open')) setOpen(false);
  });

  addMessage('Hello! I can help with lungi wholesale, retail shops, travel, and Podaturpet information. If the answer is not on this website, I can help you search Google.');
})();
