(function () {
  "use strict";

  var PHONE = "14793201970";

  function track(eventName, details) {
    var payload = Object.assign({ event: eventName, page: location.pathname }, details || {});
    if (Array.isArray(window.dataLayer)) window.dataLayer.push(payload);
    window.dispatchEvent(new CustomEvent("podaturpet:conversion", { detail: payload }));
  }

  document.addEventListener("click", function (event) {
    var link = event.target.closest("a");
    if (!link) return;
    var href = link.getAttribute("href") || "";
    if (href.indexOf("wa.me/" + PHONE) !== -1) track("whatsapp_click", { label: link.textContent.trim() });
    if (href.indexOf("tel:+" + PHONE) === 0) track("phone_click", { label: link.textContent.trim() });
    if (href.indexOf("mailto:") === 0) track("email_click", { label: link.textContent.trim() });
  });

  var quoteForm = document.getElementById("wholesale-quote-form");
  if (quoteForm) {
    quoteForm.addEventListener("submit", function () {
      var data = new FormData(quoteForm);
      track("qualified_enquiry_started", {
        product: String(data.get("product") || "").slice(0, 80),
        destination: String(data.get("destination") || "").slice(0, 80),
        business_type: String(data.get("business") || "").slice(0, 80)
      });
    });
  }
})();
