/* Shared by every page: contact details, social links and the light/dark switch.
   To change a phone number, email or social link, edit the values below. Every page updates. */
var CONTACT = {
  email: "info@biophilictours.com",
  phone: "+254 745 734 823",
  phoneRaw: "+254745734823",
  address: "Nairobi, Kenya"
};
/* Leave a value empty and the icon shows but does nothing yet. LAUNCH TASK: add the Facebook page address. */
var SOCIAL = {
  facebook: "",
  instagram: "https://www.instagram.com/biophilic_tours",
  tiktok: "https://www.tiktok.com/@biophilic_tours",
  whatsapp: "https://wa.me/254745734823"
};
var WHATSAPP_NUMBER = CONTACT.phoneRaw.replace("+", "");
var WHATSAPP_HELLO = "https://wa.me/" + WHATSAPP_NUMBER + "?text=" + encodeURIComponent("Hello Biophilic Universal, I would like to plan a trip.");

document.querySelectorAll("[data-contact]").forEach(function (el) {
  var k = el.getAttribute("data-contact"), v = CONTACT[k];
  if ((k === "email" || k === "phone") && !el.closest("b")) {
    var a = document.createElement("a");
    a.className = "contact-link"; a.textContent = v;
    a.href = k === "email" ? "mailto:" + v : "tel:" + CONTACT.phoneRaw;
    el.textContent = ""; el.appendChild(a);
  } else {
    el.textContent = v;
  }
});
document.querySelectorAll("[data-wa-text]").forEach(function (a) { a.href = "https://wa.me/" + WHATSAPP_NUMBER + "?text=" + encodeURIComponent(a.getAttribute("data-wa-text")); });
document.querySelectorAll("[data-whatsapp-hello]").forEach(function (a) { a.href = WHATSAPP_HELLO; });

var ICONS = {
  facebook: '<path d="M14 21v-7.500h2.800l.5-3.300H14V8.300c0-1 .4-1.700 1.800-1.700h1.600V3.700c-.3 0-1.300-.2-2.500-.2-2.600 0-4.200 1.600-4.200 4.300v2.400H8v3.300h2.700V21"/>',
  instagram: '<rect x="3.500" y="3.500" width="17" height="17" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17" cy="7" r=".6" fill="currentColor"/>',
  tiktok: '<path d="M15.500 3v10.500a4.500 4.500 0 1 1-4.500-4.500"/><path d="M15.500 3c.3 2.700 2.300 4.700 5 5"/>',
  whatsapp: '<path d="M12 3.200a8.800 8.800 0 0 0-7.600 13.200L3.200 20.800l4.500-1.200A8.800 8.800 0 1 0 12 3.200Z"/><path d="M9 8.300c0 3.500 2.800 6.400 6.300 6.400l1-1.500-2-1-.9.800c-1-.4-1.900-1.300-2.300-2.300l.8-.9-1-2Z"/>'
};
var SOCIAL_LABEL = { facebook: "Facebook", instagram: "Instagram", tiktok: "TikTok", whatsapp: "WhatsApp" };
var socialBox = document.getElementById("socials");
if (socialBox) {
  ["facebook", "instagram", "tiktok", "whatsapp"].forEach(function (k) {
    var li = document.createElement("li");
    if (!SOCIAL[k]) {
      /* No address yet: show the icon but make it a plain, inactive badge until a link is added above. */
      li.innerHTML = '<a class="pending" aria-label="' + SOCIAL_LABEL[k] + ' (coming soon)" title="' + SOCIAL_LABEL[k] + ' (coming soon)"><svg viewBox="0 0 24 24" aria-hidden="true">' + ICONS[k] + '</svg></a>';
      socialBox.appendChild(li);
      return;
    }
    li.innerHTML = '<a href="' + SOCIAL[k] + '" target="_blank" rel="noopener" aria-label="' + SOCIAL_LABEL[k] + '" title="' + SOCIAL_LABEL[k] + '"><svg viewBox="0 0 24 24" aria-hidden="true">' + ICONS[k] + '</svg></a>';
    socialBox.appendChild(li);
  });
}

function currentTheme() {
  var t = document.documentElement.getAttribute("data-theme");
  if (t) return t;
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

var themeBtn = document.getElementById("themeBtn");
if (themeBtn) {
  themeBtn.addEventListener("click", function () {
    var next = currentTheme() === "dark" ? "light" : "dark";
    document.documentElement.setAttribute("data-theme", next);
    try { localStorage.setItem("bu-theme", next); } catch (e) {}
  });
}

/* Floating WhatsApp button on every page. Eases in once the page has settled; no motion if the visitor asks for less. */
(function () {
  if (document.getElementById("waFloat")) return;
  var a = document.createElement("a");
  a.id = "waFloat"; a.className = "wa-float"; a.href = WHATSAPP_HELLO; a.target = "_blank"; a.rel = "noopener";
  a.setAttribute("aria-label", "Message us on WhatsApp"); a.title = "Message us on WhatsApp";
  a.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true">' + ICONS.whatsapp + '</svg><span>Chat with us</span>';
  document.body.appendChild(a);
  setTimeout(function () { a.classList.add("on"); }, 1500);
})();

/* Click-to-call button, phones only: sits above the chat button. */
(function () {
  if (document.getElementById("callFloat")) return;
  var a = document.createElement("a");
  a.id = "callFloat"; a.className = "call-float"; a.href = "tel:" + CONTACT.phoneRaw;
  a.setAttribute("aria-label", "Call us"); a.title = "Call us";
  a.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true">' + '<path d="M5 4h4l2 5-2.500 1.500a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2Z"/>' + '</svg>';
  document.body.appendChild(a);
  setTimeout(function () { a.classList.add("on"); }, 1700);
})();

/* Logo: on the home page scroll to the very top; on other pages the link goes to the home page. */
(function () {
  var links = document.querySelectorAll("a.brand, a.foot-logo-link, footer a[aria-label*='back to top']");
  var isHome = document.body.classList.contains("home");
  for (var i = 0; i < links.length; i++) {
    links[i].addEventListener("click", function (e) {
      if (!isHome) return;
      e.preventDefault();
      var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      window.scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" });
      if (history.replaceState) history.replaceState(null, "", location.pathname + location.search);
    });
  }
})();

/* Shrink the header logo once the visitor scrolls. */
(function () {
  var ticking = false;
  function update() {
    ticking = false;
    var on = (window.scrollY || document.documentElement.scrollTop) > 40;
    if (on !== document.body.classList.contains("scrolled")) document.body.classList.toggle("scrolled", on);
  }
  window.addEventListener("scroll", function () {
    if (!ticking) { ticking = true; requestAnimationFrame(update); }
  }, { passive: true });
  update();
})();
