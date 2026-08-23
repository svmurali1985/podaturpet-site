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
  var storageKey = "podaturpet-gentle-notices-dismissed";
  var firstAppearanceDelay = 7500;
  var visibleDuration = 9000;
  var intervalBetweenMessages = 26000;
  var maximumAppearances = 6;
  var appearanceCount = 0;
  var messageIndex = 0;
  var soundEnabled = false;
  var audioContext = null;
  var showTimer = null;
  var hideTimer = null;
  var dismissed = false;

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
    }
  ];

  try {
    dismissed = window.sessionStorage.getItem(storageKey) === "yes";
  } catch (error) {
    dismissed = false;
  }

  if (dismissed) return;

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

  function scheduleNext(delay) {
    window.clearTimeout(showTimer);
    if (dismissed || appearanceCount >= maximumAppearances) return;
    showTimer = window.setTimeout(showNotice, delay);
  }

  function hideNotice() {
    window.clearTimeout(hideTimer);
    notice.classList.remove("is-visible");
    notice.setAttribute("aria-hidden", "true");
    scheduleNext(intervalBetweenMessages);
  }

  function showNotice() {
    if (dismissed || appearanceCount >= maximumAppearances) return;
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

    appearanceCount += 1;
    messageIndex = (messageIndex + 1) % messages.length;
    playGentleChime();
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
    dismissed = true;
    window.clearTimeout(showTimer);
    window.clearTimeout(hideTimer);
    notice.classList.remove("is-visible");
    notice.setAttribute("aria-hidden", "true");
    try {
      window.sessionStorage.setItem(storageKey, "yes");
    } catch (error) {
      // The in-memory dismissed flag still prevents further messages.
    }
  });

  soundButton.addEventListener("click", function () {
    soundEnabled = !soundEnabled;
    soundButton.setAttribute("aria-pressed", soundEnabled ? "true" : "false");
    soundButton.setAttribute("aria-label", soundEnabled ? "Mute the gentle notification sound" : "Enable a gentle notification sound");
    soundButton.title = soundEnabled ? "Sound on — tap to mute" : "Sound off — tap for a gentle chime";

    if (!soundEnabled) return;
    var AudioContextConstructor = window.AudioContext || window.webkitAudioContext;
    if (!AudioContextConstructor) {
      soundEnabled = false;
      soundButton.setAttribute("aria-pressed", "false");
      return;
    }

    try {
      if (!audioContext) audioContext = new AudioContextConstructor();
      if (audioContext.state === "suspended") {
        audioContext.resume().then(playGentleChime).catch(function () {});
      } else {
        playGentleChime();
      }
    } catch (error) {
      soundEnabled = false;
      soundButton.setAttribute("aria-pressed", "false");
    }
  });

  document.addEventListener("visibilitychange", function () {
    if (document.hidden && notice.classList.contains("is-visible")) {
      hideNotice();
    }
  });

  scheduleNext(firstAppearanceDelay);
})();
