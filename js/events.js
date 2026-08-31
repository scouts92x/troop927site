/*
 * Troop 927 event calendar.
 *
 * The list below is the single source of truth for the schedule. Each event has:
 *   start : "YYYY-MM-DD"           (required)
 *   end   : "YYYY-MM-DD"           (optional; omit for single-day events)
 *   title : short name
 *   desc  : optional detail line
 *   cat   : "meeting" | "campout" | "service" | "holiday" | "event"
 *
 * The page renders ONLY current and upcoming events (anything whose final day is
 * today or later), so it stays accurate on its own as the year rolls forward.
 * To add or change an event, just edit this array.
 */
var TROOP_EVENTS = [
  { start: "2026-08-10", title: "Troop Meeting: PLC / BOR", desc: "New leadership takes over.", cat: "meeting" },
  { start: "2026-08-12", title: "Join Scout Night", desc: "Mt. Gallant, Sunset Park, Cherry Park, Independence.", cat: "event" },
  { start: "2026-08-17", title: "Troop Meeting: Prep for Patrol Cook-Off", desc: "Board Game Night / Field Games.", cat: "meeting" },
  { start: "2026-08-24", title: "Troop Meeting: Court of Honor", desc: "Celebrating our scouts' achievements.", cat: "meeting" },
  { start: "2026-08-31", title: "Troop Meeting: Patrol Cook-Off", desc: "Patrols show off their outdoor cooking skills.", cat: "meeting" },
  { start: "2026-09-07", title: "Labor Day", desc: "No troop meeting — enjoy the holiday!", cat: "holiday" },
  { start: "2026-09-14", title: "Troop Meeting: AOL Recruiting", desc: "Welcoming Arrow of Light scouts.", cat: "meeting" },
  { start: "2026-09-21", title: "Troop Meeting: Camping Prep & Service Project", desc: "Bring your devices and make eCards for patients at St. Jude's.", cat: "service" },
  { start: "2026-09-25", end: "2026-09-27", title: "Campout: Kayaking", desc: "New River, Sparta, NC.", cat: "campout" },
  { start: "2026-09-28", title: "Troop Meeting", desc: "Weekly troop meeting.", cat: "meeting" },
  { start: "2026-10-23", end: "2026-10-25", title: "Campout: Mecklenburg Girls' Camporee", desc: "District camporee weekend.", cat: "campout" },
  { start: "2026-11-20", end: "2026-11-21", title: "Troop BBQ Sale & Lock-In", desc: "Troop BBQ Sale at St. John's UMC; Friday night lock-in at SJUMC.", cat: "event" },
  { start: "2026-12-11", end: "2026-12-13", title: "Glampout: Camp Bud Schiele", desc: "Advancement weekend.", cat: "campout" },
  { start: "2027-01-22", end: "2027-01-24", title: "Campout: Skiing", desc: "Winter ski weekend.", cat: "campout" },
  { start: "2027-02-26", end: "2027-02-28", title: "Campout: Caving", desc: "Sweetwater, TN.", cat: "campout" },
  { start: "2027-03-19", end: "2027-03-21", title: "Campout: New Scout", desc: "Bethelwoods.", cat: "campout" },
  { start: "2027-04-16", end: "2027-04-18", title: "Campout: Spring Camporee", desc: "Spring district camporee.", cat: "campout" },
  { start: "2027-05-07", end: "2027-05-09", title: "Campout: Kayaking", desc: "Spring kayaking adventure.", cat: "campout" },
  { start: "2027-06-06", end: "2027-06-12", title: "High Adventure: Kayaking", desc: "New River Kayaking, The Summit, WV.", cat: "campout" },
  { start: "2027-06-27", end: "2027-07-03", title: "Summer Camp: Justice Scout Camp", desc: "The Summit, WV.", cat: "campout" }
];

(function () {
  var MONTHS = ["January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"];
  var MON_ABBR = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  var CAT_LABEL = { meeting: "Meeting", campout: "Campout", service: "Service", holiday: "Holiday", event: "Event" };

  // Parse "YYYY-MM-DD" as a LOCAL midnight date (avoids UTC off-by-one).
  function parseDate(s) {
    var p = s.split("-");
    return new Date(+p[0], +p[1] - 1, +p[2]);
  }
  function startOfToday() {
    var n = new Date();
    return new Date(n.getFullYear(), n.getMonth(), n.getDate());
  }
  function sameDay(a, b) {
    return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
  }

  var container = document.getElementById("events");
  if (!container) { return; }
  var toggleBtn = document.getElementById("togglePast");
  var showPast = false;

  function render() {
    var today = startOfToday();
    var list = TROOP_EVENTS.map(function (e) {
      var start = parseDate(e.start);
      var end = e.end ? parseDate(e.end) : start;
      return { e: e, start: start, end: end };
    }).sort(function (a, b) { return a.start - b.start; });

    var visible = list.filter(function (item) {
      return showPast ? true : item.end >= today;
    });

    container.innerHTML = "";

    if (visible.length === 0) {
      container.innerHTML =
        '<div class="empty-state">' +
        '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/></svg>' +
        '<p>No upcoming events are scheduled right now. Check back soon — new adventures are always around the corner!</p>' +
        '</div>';
      return;
    }

    var currentKey = null;
    var group = null;

    visible.forEach(function (item) {
      var key = item.start.getFullYear() + "-" + item.start.getMonth();
      if (key !== currentKey) {
        currentKey = key;
        group = document.createElement("div");
        group.className = "month-group";
        var label = document.createElement("h3");
        label.className = "month-label";
        label.textContent = MONTHS[item.start.getMonth()] + " " + item.start.getFullYear();
        group.appendChild(label);
        container.appendChild(group);
      }
      group.appendChild(buildRow(item, today));
    });
  }

  function buildRow(item, today) {
    var e = item.e;
    var multi = item.end.getTime() !== item.start.getTime();
    var isToday = (today >= item.start && today <= item.end);
    var isPast = item.end < today;

    var row = document.createElement("div");
    row.className = "event-row" + (isToday ? " today" : "");
    row.setAttribute("data-cat", e.cat);
    if (isPast) { row.style.opacity = "0.55"; }

    // Date badge
    var badge = document.createElement("div");
    badge.className = "date-badge";
    if (multi) {
      var sameMonth = item.start.getMonth() === item.end.getMonth();
      var rangeText = sameMonth
        ? MON_ABBR[item.start.getMonth()] + " " + item.start.getDate() + "\u2013" + item.end.getDate()
        : MON_ABBR[item.start.getMonth()] + " " + item.start.getDate() + " \u2013 " + MON_ABBR[item.end.getMonth()] + " " + item.end.getDate();
      badge.innerHTML = '<div class="rng">' + rangeText + '</div>';
    } else {
      badge.innerHTML = '<div class="d">' + item.start.getDate() + '</div><div class="m">' + MON_ABBR[item.start.getMonth()] + '</div>';
    }

    // Body
    var body = document.createElement("div");
    body.className = "event-body";
    var title = document.createElement("p");
    title.className = "title";
    title.textContent = e.title;
    body.appendChild(title);
    if (e.desc) {
      var desc = document.createElement("p");
      desc.className = "desc";
      desc.textContent = e.desc;
      body.appendChild(desc);
    }
    var tag = document.createElement("span");
    if (isToday) {
      tag.className = "tag today-tag";
      tag.textContent = "Happening today";
    } else {
      tag.className = "tag " + e.cat;
      tag.textContent = CAT_LABEL[e.cat] || "Event";
    }
    body.appendChild(tag);

    row.appendChild(badge);
    row.appendChild(body);
    return row;
  }

  if (toggleBtn) {
    toggleBtn.addEventListener("click", function () {
      showPast = !showPast;
      toggleBtn.setAttribute("aria-pressed", showPast ? "true" : "false");
      toggleBtn.textContent = showPast ? "Hide past events" : "Show past events";
      render();
    });
  }

  render();
})();
