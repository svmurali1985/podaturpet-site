(function () {
  "use strict";

  var storageKey = "podaturpet-advertise-flash-shown-v1";
  var showDelay = 45 * 1000;
  var visibleDuration = 10 * 1000;
  var hideTimer;

  try {
    if (sessionStorage.getItem(storageKey)) return;
    sessionStorage.setItem(storageKey, "1");
  } catch (error) {
    // Continue without storage when the browser blocks it.
  }

  function hideFlash(flash) {
    window.clearTimeout(hideTimer);
    flash.classList.remove("is-visible");
    document.body.classList.remove("has-advertise-flash");
    window.setTimeout(function () {
      flash.remove();
    }, 400);
  }

  function showFlash() {
    var flash = document.createElement("aside");
    flash.className = "podaturpet-ad-flash";
    flash.setAttribute("role", "status");
    flash.setAttribute("aria-live", "polite");
    flash.setAttribute("aria-label", "Advertise on Podaturpet.com");
    flash.innerHTML =
      '<button class="podaturpet-ad-flash-close" type="button" aria-label="Close advertisement message">&times;</button>' +
      '<span class="podaturpet-ad-flash-label">Advertise on Podaturpet.com</span>' +
      '<strong>Own a shop or lungi business?</strong>' +
      '<p>Promote your shop, lungi brand or wholesale business and help customers discover you.</p>' +
      '<p class="podaturpet-ad-flash-tamil" lang="ta">உங்கள் கடை அல்லது லுங்கி வியாபாரத்தை இங்கே விளம்பரம் செய்யுங்கள்.</p>' +
      '<div class="podaturpet-ad-flash-actions">' +
      '<a class="podaturpet-ad-flash-action" href="https://wa.me/14793201970?text=Hello%20Podaturpet%20Advertising%20Team%2C%20I%20would%20like%20to%20advertise%20my%20shop%20or%20lungi%20business%20on%20Podaturpet.com." target="_blank" rel="noopener noreferrer">Contact us on WhatsApp</a>' +
      '<a class="podaturpet-ad-flash-phone" href="tel:+14793201970">+1 479-320-1970</a>' +
      '</div>';

    document.body.appendChild(flash);
    document.body.classList.add("has-advertise-flash");
    flash.querySelector(".podaturpet-ad-flash-close").addEventListener("click", function () {
      hideFlash(flash);
    });

    window.requestAnimationFrame(function () {
      flash.classList.add("is-visible");
    });
    hideTimer = window.setTimeout(function () {
      hideFlash(flash);
    }, visibleDuration);
  }

  window.setTimeout(showFlash, showDelay);
})();
