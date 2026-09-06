(function () {
  "use strict";

  var endpoint = "https://podaturpet-visitor-tracker.svmuralicenterton.workers.dev/stats";
  var refreshMilliseconds = 5 * 60 * 1000;
  var trackedHostnames = ["podaturpet.com", "www.podaturpet.com"];

  if (trackedHostnames.indexOf(window.location.hostname) === -1) {
    return;
  }

  var panel = document.createElement("aside");
  panel.className = "pvc-panel";
  panel.setAttribute("aria-label", "Podaturpet website visitor activity");
  panel.setAttribute("data-collapsed", "true");

  var toggle = document.createElement("button");
  toggle.className = "pvc-toggle";
  toggle.type = "button";
  toggle.setAttribute("aria-expanded", panel.getAttribute("data-collapsed") === "false" ? "true" : "false");

  var toggleCopy = document.createElement("span");
  toggleCopy.className = "pvc-toggle-copy";

  var label = document.createElement("small");
  label.textContent = "Live website activity";

  var title = document.createElement("strong");
  title.textContent = "Visits today";

  var count = document.createElement("span");
  count.className = "pvc-count";
  count.textContent = "…";
  count.setAttribute("aria-live", "polite");

  toggleCopy.appendChild(label);
  toggleCopy.appendChild(title);
  toggle.appendChild(toggleCopy);
  toggle.appendChild(count);

  var details = document.createElement("div");
  details.className = "pvc-details";
  details.innerHTML = '<p class="pvc-empty">Loading visitor locations…</p>';

  panel.appendChild(toggle);
  panel.appendChild(details);
  var footer = document.querySelector("footer");
  if (footer) {
    footer.appendChild(panel);
  } else {
    document.body.appendChild(panel);
  }

  toggle.addEventListener("click", function () {
    var willCollapse = panel.getAttribute("data-collapsed") !== "true";
    panel.setAttribute("data-collapsed", willCollapse ? "true" : "false");
    toggle.setAttribute("aria-expanded", willCollapse ? "false" : "true");
  });

  function countryFlag(code) {
    if (!/^[A-Z]{2}$/.test(code)) {
      return "🌐";
    }

    return String.fromCodePoint(
      code.charCodeAt(0) + 127397,
      code.charCodeAt(1) + 127397
    );
  }

  function countryName(code) {
    try {
      if (typeof Intl.DisplayNames === "function") {
        return new Intl.DisplayNames(["en"], { type: "region" }).of(code) || code;
      }
    } catch (error) {}

    return code;
  }

  function makeSection(headingText, rows, rowLabel) {
    var section = document.createElement("section");
    section.className = "pvc-section";

    var heading = document.createElement("h2");
    heading.className = "pvc-heading";
    heading.textContent = headingText;
    section.appendChild(heading);

    if (!rows.length) {
      var empty = document.createElement("p");
      empty.className = "pvc-empty";
      empty.textContent = "Not enough activity yet.";
      section.appendChild(empty);
      return section;
    }

    var list = document.createElement("ul");
    list.className = "pvc-list";

    rows.forEach(function (row) {
      var item = document.createElement("li");
      item.className = "pvc-row";

      var name = document.createElement("span");
      name.textContent = rowLabel(row);

      var total = document.createElement("strong");
      total.textContent = String(row.total);

      item.appendChild(name);
      item.appendChild(total);
      list.appendChild(item);
    });

    section.appendChild(list);
    return section;
  }

  function render(data) {
    count.textContent = String(data.views || 0);
    details.replaceChildren();

    details.appendChild(makeSection("Top countries", data.countries || [], function (row) {
      return countryFlag(row.code) + " " + countryName(row.code);
    }));

    details.appendChild(makeSection("Top states / regions", data.regions || [], function (row) {
      return row.name + " · " + row.code;
    }));

    details.appendChild(makeSection("Top cities", data.cities || [], function (row) {
      return row.name + " · " + row.code;
    }));

    var note = document.createElement("p");
    note.className = "pvc-note";
    note.textContent = "Private aggregate counts only. No names or IP addresses are shown.";
    details.appendChild(note);
  }

  function showError() {
    count.textContent = "—";
    details.innerHTML = '<p class="pvc-empty">Visitor activity is temporarily unavailable.</p>';
  }

  function loadStats() {
    fetch(endpoint, {
      method: "GET",
      mode: "cors",
      cache: "no-store"
    })
      .then(function (response) {
        if (!response.ok) {
          throw new Error("Statistics request failed.");
        }

        return response.json();
      })
      .then(render)
      .catch(showError);
  }

  loadStats();
  window.setInterval(loadStats, refreshMilliseconds);
})();
