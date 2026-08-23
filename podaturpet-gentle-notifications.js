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
  var rotationStorageKey = "podaturpet-gentle-notice-next-message";
  var soundStorageKey = "podaturpet-gentle-notice-sound-enabled";
  var pauseStorageKey = "podaturpet-gentle-notice-paused-until";
  var firstAppearanceDelay = 2800;
  var visibleDuration = 18000;
  var intervalBetweenMessages = 14000;
  var dismissalPauseDuration = 15 * 60 * 1000;
  var pausedUntil = 0;
  var messageIndex = 0;
  var soundEnabled = true;
  var audioUnlocked = false;
  var audioContext = null;
  var showTimer = null;
  var hideTimer = null;
  var activeMessage = null;

  var messages = [
    {
      type: "advertising",
      label: "Advertising opportunity",
      title: "Want to advertise your shop?",
      copy: "Showcase your business on Podaturpet.com.",
      tamil: "உங்கள் கடையை விளம்பரம் செய்ய வேண்டுமா?",
      action: "Ask about advertising",
      whatsapp: "Hello Podaturpet Team, I would like to advertise my shop or business on Podaturpet.com."
    },
    {
      type: "lungi",
      label: "Podaturpet lungi wholesale",
      title: "Looking for quality lungis?",
      copy: "Explore checked designs and send a wholesale enquiry.",
      tamil: "மொத்தமாக லுங்கி வாங்க வேண்டுமா?",
      action: "Ask about lungis",
      whatsapp: "Hello Podaturpet Team, I am interested in wholesale lungis. Please share the available designs and sourcing details."
    },
    {
      type: "advertising",
      label: "Grocery shop advertising",
      title: "Own a grocery or provision shop?",
      copy: "Help local shoppers find your grocery store.",
      tamil: "உங்கள் மளிகைக் கடையை விளம்பரம் செய்ய வேண்டுமா?",
      action: "Advertise your grocery",
      whatsapp: "Hello Podaturpet Team, I would like to advertise my grocery or provision shop on Podaturpet.com."
    },
    {
      type: "advertising",
      label: "Cars and rental services",
      title: "Offer cars or rental vehicles?",
      copy: "Showcase your taxi or car rental service locally.",
      tamil: "உங்கள் வாடகை கார் சேவையை விளம்பரம் செய்ய வேண்டுமா?",
      action: "Advertise your car service",
      whatsapp: "Hello Podaturpet Team, I would like to advertise my car rental, taxi or vehicle service on Podaturpet.com."
    },
    {
      type: "advertising",
      label: "Weaving supplies",
      title: "Sell loom parts or weaving supplies?",
      copy: "Reach customers looking for local weaving essentials.",
      tamil: "உங்கள் தறி சாமான்கள் கடையை விளம்பரம் செய்ய வேண்டுமா?",
      action: "Advertise weaving supplies",
      whatsapp: "Hello Podaturpet Team, I would like to advertise loom parts, weaving supplies or a related service on Podaturpet.com."
    },
    {
      type: "advertising",
      label: "Temples and local discovery",
      title: "Looking for nearby temple information?",
      copy: "Discover temples and useful local visitor information.",
      tamil: "அருகிலுள்ள கோவில்கள் பற்றிய தகவல்கள் வேண்டுமா?",
      action: "Ask about local temples",
      whatsapp: "Hello Podaturpet Team, I would like information about temples and visitor attractions near Podaturpet."
    },
    {
      type: "advertising",
      label: "Land, homes and property agents",
      title: "Buying or selling land or a home?",
      copy: "Advertise property listings and local real-estate agent services.",
      tamil: "நிலம், வீடு வாங்க அல்லது விற்க விளம்பரம் செய்ய வேண்டுமா?",
      action: "Advertise your property",
      whatsapp: "Hello Podaturpet Team, I would like to advertise land for sale, a property purchase, a house or my real-estate agent service on Podaturpet.com."
    }
  ];

  try {
    var savedMessageIndex = Number(window.sessionStorage.getItem(rotationStorageKey));
    if (Number.isFinite(savedMessageIndex) && savedMessageIndex >= 0) {
      messageIndex = savedMessageIndex % messages.length;
    }
    soundEnabled = window.sessionStorage.getItem(soundStorageKey) !== "off";
    pausedUntil = Number(window.sessionStorage.getItem(pauseStorageKey)) || 0;
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

  function playGentleChime() {
    if (!soundEnabled || !audioContext || audioContext.state !== "running") return;

    try {
      var now = audioContext.currentTime;
      [740, 988].forEach(function (frequency, index) {
        var oscillator = audioContext.createOscillator();
        var gain = audioContext.createGain();
        var start = now + index * 0.12;
        oscillator.type = "sine";
        oscillator.frequency.setValueAtTime(frequency, start);
        gain.gain.setValueAtTime(0.0001, start);
        gain.gain.exponentialRampToValueAtTime(0.022, start + 0.035);
        gain.gain.exponentialRampToValueAtTime(0.0001, start + 0.23);
        oscillator.connect(gain);
        gain.connect(audioContext.destination);
        oscillator.start(start);
        oscillator.stop(start + 0.25);
      });
    } catch (error) {
      soundEnabled = false;
      soundButton.setAttribute("aria-pressed", "false");
      soundButton.setAttribute("aria-label", "Enable a gentle notification sound");
    }
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
    if (audioUnlocked) return;
    audioUnlocked = true;

    if (!soundEnabled) return;

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

    if (activeMessage && notice.classList.contains("is-visible")) {
      speakMessage(activeMessage);
    }
  }

  function scheduleNext(delay) {
    window.clearTimeout(showTimer);
    showTimer = window.setTimeout(showNotice, delay);
  }

  function hideNotice() {
    window.clearTimeout(hideTimer);
    notice.classList.remove("is-visible");
    notice.setAttribute("aria-hidden", "true");
    activeMessage = null;
    scheduleNext(intervalBetweenMessages);
  }

  function showNotice() {
    if (document.hidden) {
      scheduleNext(6000);
      return;
    }

    var message = messages[messageIndex];
    notice.setAttribute("data-notice-type", message.type);
    label.textContent = message.label;
    title.textContent = message.title;
    copy.textContent = message.copy;
    tamil.textContent = message.tamil;
    action.textContent = message.action;
    action.href = "https://wa.me/918778836385?text=" + encodeURIComponent(message.whatsapp);
    notice.setAttribute("aria-hidden", "false");
    notice.classList.add("is-visible");

    activeMessage = message;
    messageIndex = (messageIndex + 1) % messages.length;

    try {
      window.sessionStorage.setItem(rotationStorageKey, String(messageIndex));
    } catch (error) {
      // Rotation continues in memory if session storage is unavailable.
    }

    playGentleChime();
    speakMessage(message);
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
    notice.classList.remove("is-visible");
    notice.setAttribute("aria-hidden", "true");

    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    }

    activeMessage = null;
    pausedUntil = Date.now() + dismissalPauseDuration;

    try {
      window.sessionStorage.setItem(pauseStorageKey, String(pausedUntil));
    } catch (error) {
      // The current page still honors the full fifteen-minute pause.
    }

    scheduleNext(dismissalPauseDuration);
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
      if ("speechSynthesis" in window) window.speechSynthesis.cancel();
      return;
    }

    unlockAudio();
    playGentleChime();
    if (activeMessage) speakMessage(activeMessage);
  });

  document.addEventListener("pointerdown", unlockAudio, { once: true, capture: true });
  document.addEventListener("keydown", unlockAudio, { once: true, capture: true });

  document.addEventListener("visibilitychange", function () {
    if (document.hidden && notice.classList.contains("is-visible")) {
      if ("speechSynthesis" in window) window.speechSynthesis.cancel();
      hideNotice();
    }
  });

  scheduleNext(pausedUntil > Date.now() ? pausedUntil - Date.now() : firstAppearanceDelay);
})();
