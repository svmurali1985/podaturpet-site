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

  function safeReferrer() {
    try { return document.referrer ? new URL(document.referrer).origin : ""; }
    catch (_) { return ""; }
  }
  document.addEventListener("podaturpet:enquiry-handoff", function (event) {
    if (event.detail && event.detail.channel === "email") track("email_click");
    else if (event.detail && event.detail.channel === "whatsapp") track("whatsapp_click");
  });

  function track(eventName) {
    var path = window.location.pathname;
    var journey = /town|stories|tourist|local-business|government|useful-information|travel-pin/.test(path) ? "town" : path === "/" || path === "/index.html" ? "home" : "wholesale";
    var params = new URLSearchParams(window.location.search);
    // Only known campaign tags are recorded; arbitrary query strings and form data are excluded.
    var allowed = {utm_source:["whatsapp","facebook","instagram","email"],utm_medium:["social","group","email"],utm_campaign:["wholesale-buyers","town-community","local-businesses"]};
    var campaign = {};
    Object.keys(allowed).forEach(function(key){var value=params.get(key);if(allowed[key].indexOf(value)!==-1)campaign[key]=value;});
    var payload = JSON.stringify({
      event: eventName,
      page: window.location.origin + window.location.pathname,
      title: document.title,
      referrer: safeReferrer(),
      journey: journey,
      campaign: campaign
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
      "#advertise, .town-advertising, .town-ad-copy, .local-services-banner, [data-notice-type='advertising']"
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
  document.addEventListener("podaturpet:feedback-handoff", function () { track("feedback_handoff"); });
  document.addEventListener("podaturpet:community-handoff", function () { track("community_handoff"); });

  document.addEventListener("click", function (event) {
    var link = event.target.closest("a[href], button");

    if (!link) {
      return;
    }

    var href = (link.getAttribute("href") || "").toLowerCase();
    var context = linkContext(link);
    if (link.dataset.track === "directions_click") context = "directions_click";
    else if (/podaturpet-stories-and-culture/.test(href)) context = "story_click";
    else if (/podaturpet-town-guide/.test(href) && !/contribute=/.test(href)) context = "town_guide_click";
    else if (/contribute=business/.test(href)) context = "listing_request_click";
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
