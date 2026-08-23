(function () {
  "use strict";

  var endpoint = "https://podaturpet-visitor-tracker.svmuralicenterton.workers.dev/track";
  var trackedHostnames = ["podaturpet.com", "www.podaturpet.com"];

  if (trackedHostnames.indexOf(window.location.hostname) === -1) {
    return;
  }

  if (navigator.globalPrivacyControl === true || navigator.doNotTrack === "1") {
    return;
  }

  function track(eventName) {
    var payload = JSON.stringify({
      event: eventName,
      page: window.location.origin + window.location.pathname,
      title: document.title,
      referrer: document.referrer
    });

    if (navigator.sendBeacon) {
      var body = new Blob([payload], { type: "text/plain;charset=UTF-8" });

      if (navigator.sendBeacon(endpoint, body)) {
        return;
      }
    }

    fetch(endpoint, {
      method: "POST",
      mode: "cors",
      keepalive: true,
      headers: { "Content-Type": "text/plain;charset=UTF-8" },
      body: payload
    }).catch(function () {});
  }

  function linkContext(link) {
    var text = [
      link.textContent || "",
      link.getAttribute("aria-label") || "",
      link.getAttribute("href") || ""
    ].join(" ").toLowerCase();

    var advertisingSection = link.closest(
      "#advertise, .town-advertising, .town-ad-copy, [data-notice-type='advertising']"
    );

    if (advertisingSection || /advertis|promot.*shop|promot.*business/.test(text)) {
      return "advertisement_click";
    }

    if (/catalogue|catalog|collection|lungi-product/.test(text)) {
      return "catalogue_click";
    }

    if (/lungi|wholesale|weav|textile|quote|product|sourc/.test(text)) {
      return "lungi_click";
    }

    return "";
  }

  track("page_view");

  document.addEventListener("click", function (event) {
    var link = event.target.closest("a[href], button");

    if (!link) {
      return;
    }

    var href = (link.getAttribute("href") || "").toLowerCase();
    var context = linkContext(link);
    var contactEvent = "";

    if (/wa\.me|whatsapp/.test(href)) {
      contactEvent = "whatsapp_click";
    } else if (href.indexOf("tel:") === 0) {
      contactEvent = "phone_click";
    } else if (href.indexOf("mailto:") === 0) {
      contactEvent = "email_click";
    }

    if (context) {
      track(context);
    }

    if (contactEvent && contactEvent !== context) {
      track(contactEvent);
    }
  }, { capture: true, passive: true });
})();
