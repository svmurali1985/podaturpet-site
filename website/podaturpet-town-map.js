(function () {
  "use strict";

  var frame = document.getElementById("podaturpet-map-frame");
  var buttons = document.querySelectorAll("[data-map-view]");

  if (!frame || !buttons.length) {
    return;
  }

  function setMapView(view) {
    var satellite = view === "satellite";
    var mapType = satellite ? "k" : "m";

    frame.src = "https://maps.google.com/maps?q=Podaturpet%2C%20Tamil%20Nadu%20631208&t=" + mapType + "&z=16&output=embed";
    frame.title = satellite
      ? "Interactive satellite map of Podaturpet, Tamil Nadu"
      : "Interactive street map of Podaturpet, Tamil Nadu";

    buttons.forEach(function (button) {
      var selected = button.getAttribute("data-map-view") === view;
      button.classList.toggle("is-active", selected);
      button.setAttribute("aria-pressed", selected ? "true" : "false");
    });
  }

  buttons.forEach(function (button) {
    button.addEventListener("click", function () {
      setMapView(button.getAttribute("data-map-view"));
    });
  });
})();
