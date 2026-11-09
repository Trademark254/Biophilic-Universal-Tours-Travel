/* Trip enquiry: fills the destination from the card the visitor came from, then sends the enquiry to WhatsApp. */
(function () {
  var form = document.getElementById("enqForm");
  if (!form) return;
  var q = new URLSearchParams(location.search);
  var trip = (q.get("trip") || "").trim().slice(0, 80);
  var sample = (q.get("sample") || "").trim().slice(0, 120);
  var dest = form.elements.destination, samp = form.elements.sample, sampRow = document.getElementById("sampleRow");
  if (trip) {
    dest.value = trip; dest.readOnly = true; dest.classList.add("locked");
    dest.setAttribute("aria-describedby", "destNote");
    document.getElementById("destNote").hidden = false;
  }
  if (trip && sample) { samp.value = sample; sampRow.hidden = false; }

  var today = new Date(); today.setMinutes(today.getMinutes() - today.getTimezoneOffset());
  var iso = today.toISOString().slice(0, 10);
  form.elements.start.min = iso; form.elements.end.min = iso;
  form.elements.start.addEventListener("change", function () {
    form.elements.end.min = form.elements.start.value || iso;
  });

  function fail(field, msg) {
    var box = document.getElementById("enqError");
    box.textContent = msg; box.hidden = false; field.focus();
  }
  form.addEventListener("submit", function (e) {
    e.preventDefault();
    var f = form.elements;
    document.getElementById("enqError").hidden = true;
    if (!f.name.value.trim()) return fail(f.name, "Please enter your full name.");
    if (!f.destination.value.trim()) return fail(f.destination, "Please tell us where you want to go.");
    if (!f.start.value) return fail(f.start, "Please choose a start date.");
    if (!f.end.value) return fail(f.end, "Please choose an end date.");
    if (f.end.value < f.start.value) return fail(f.end, "The end date must be on or after the start date.");
    var n = parseInt(f.guests.value, 10);
    if (!n || n < 1) return fail(f.guests, "Please enter the number of travellers.");
    var lines = ["Hello Biophilic Universal, I would like to plan a trip.", "",
      "Name: " + f.name.value.trim(),
      "Destination: " + f.destination.value.trim()];
    if (f.sample.value) lines.push("Sample trip: " + f.sample.value);
    lines.push("Start: " + f.start.value, "End: " + f.end.value, "Travellers: " + n,
      "Add to my trip: " + f.addon.value);
    if (f.notes.value.trim()) lines.push("Notes: " + f.notes.value.trim());
    var url = "https://wa.me/" + WHATSAPP_NUMBER + "?text=" + encodeURIComponent(lines.join("\n"));
    window.open(url, "_blank", "noopener");
  });
})();
