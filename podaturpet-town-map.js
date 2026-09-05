(function () {
  "use strict";

  var frame = document.getElementById("podaturpet-map-frame");
  var buttons = document.querySelectorAll("[data-map-view]");
  var placeButtons = document.querySelectorAll("[data-map-place]");

  if (!frame || !buttons.length) {
    return;
  }

  var currentView = "satellite";
  var currentPlace = "Podaturpet, Tamil Nadu 631208";
  var currentLabel = "Podaturpet";

  function setMapView(view) {
    currentView = view;
    var satellite = view === "satellite";
    var mapType = satellite ? "k" : "m";

    frame.src = "https://maps.google.com/maps?q=" + encodeURIComponent(currentPlace) + "&t=" + mapType + "&z=" + (currentLabel === "Podaturpet" ? "16" : "14") + "&output=embed";
    frame.title = satellite
      ? "Interactive satellite map of " + currentLabel
      : "Interactive street map of " + currentLabel;

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

  placeButtons.forEach(function (button) {
    button.addEventListener("click", function () {
      currentPlace = button.getAttribute("data-map-place") || currentPlace;
      currentLabel = button.getAttribute("data-map-label") || currentPlace;
      placeButtons.forEach(function (item) {
        var selected = item === button;
        item.classList.toggle("is-active", selected);
        item.setAttribute("aria-pressed", selected ? "true" : "false");
      });
      setMapView(currentView);
    });
  });
})();
