/* Troop 927 — Philmont Cavalcade 2028
   Countdown + mobile nav. Target: June 10, 2028 (subject to Philmont allotment). */

(function () {
  "use strict";

  // ----- Countdown -----
  var TARGET = new Date("2028-06-10T00:00:00-06:00"); // Philmont is Mountain Time (Cimarron, NM)

  function pad(n) { return (n < 10 ? "0" : "") + n; }

  function tick() {
    var elDays = document.getElementById("cd-days");
    if (!elDays) return; // no countdown on this page
    var now = new Date();
    var diff = TARGET - now;

    if (diff <= 0) {
      elDays.textContent = "0";
      set("cd-hours", "00"); set("cd-mins", "00"); set("cd-secs", "00");
      var d = document.querySelector(".countdown__date");
      if (d) d.textContent = "The trek is here — saddle up!";
      return;
    }

    var days = Math.floor(diff / 86400000);
    var hours = Math.floor((diff % 86400000) / 3600000);
    var mins = Math.floor((diff % 3600000) / 60000);
    var secs = Math.floor((diff % 60000) / 1000);

    set("cd-days", days.toLocaleString());
    set("cd-hours", pad(hours));
    set("cd-mins", pad(mins));
    set("cd-secs", pad(secs));
  }

  function set(id, val) {
    var el = document.getElementById(id);
    if (el) el.textContent = val;
  }

  tick();
  setInterval(tick, 1000);

  // ----- Mobile nav -----
  document.addEventListener("click", function (e) {
    var toggle = e.target.closest(".nav__toggle");
    if (toggle) {
      var links = document.querySelector(".nav__links");
      if (links) links.classList.toggle("open");
    }
  });

  // ----- Active nav link -----
  var here = (location.pathname.split("/").pop() || "index.html").toLowerCase();
  document.querySelectorAll(".nav__links a").forEach(function (a) {
    var href = (a.getAttribute("href") || "").toLowerCase();
    if (href === here || (here === "" && href === "index.html")) {
      a.classList.add("active");
    }
  });
})();
