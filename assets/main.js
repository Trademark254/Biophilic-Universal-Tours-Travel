/* ---------- loading skeleton: remove once the page is ready ---------- */
(function () {
  var sk = document.getElementById("skeleton");
  if (!sk) return;
  var done = false;
  function hide() {
    if (done) return;
    done = true;
    document.documentElement.classList.add("hero-go");
    sk.classList.add("done");
    setTimeout(function () { if (sk.parentNode) sk.parentNode.removeChild(sk); }, 300);
  }
  function once(target, ev) { return new Promise(function (res) { target.addEventListener(ev, res); }); }
  var pageLoaded = document.readyState === "complete" ? Promise.resolve() : once(window, "load");
  var fontsLoaded = (window.__gfReady || Promise.resolve()).then(function () { return document.fonts && document.fonts.ready ? document.fonts.ready : null; });
  var poster = new Promise(function (res) { var im = new Image(); im.onload = res; im.onerror = res; im.src = "assets/hero-poster.jpg"; });
  Promise.all([pageLoaded, fontsLoaded, poster]).then(hide, hide);
  setTimeout(hide, 4000); /* never leave the skeleton stuck */
})();

/* Home page: generated landscapes, sample routes, menu and the quotation form. */

var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/* ---------- hero video ---------- */
var hv = document.getElementById("heroVideo");
function heroSrc() {
  var w = window.innerWidth;
  if (w > 1100) return "assets/hero-1080.mp4";
  if (w > 700) return "assets/hero-1280.mp4";
  return "assets/hero-720.mp4";
}
function playHero() {
  if (!hv.getAttribute("src")) hv.setAttribute("src", heroSrc());
  var pr = hv.play();
  if (pr && pr.catch) pr.catch(function () {});
}
/* Visitors who ask their device for reduced motion see the still frame only. */
/* Also skip the video on Data Saver or a slow connection: the poster photo shows instead. */
var conn = navigator.connection || {};
var slowLink = conn.saveData || /(^|-)2g$/.test(conn.effectiveType || "");
if (reduceMotion || slowLink) { hv.setAttribute("preload", "none"); } else { playHero(); }

/* Save data and battery: pause the video when the hero is off screen, play it again when it returns. */
if (!reduceMotion && "IntersectionObserver" in window) {
  new IntersectionObserver(function (entries) {
    entries.forEach(function (en) {
      if (en.isIntersecting && hv.getAttribute("src")) { var pr = hv.play(); if (pr && pr.catch) pr.catch(function () {}); }
      else hv.pause();
    });
  }, { threshold: 0.05 }).observe(hv.closest(".hero") || hv);
}

/* ---------- hero words: four true statements take turns, then it settles ----------
   Each line is taken from the site's own text. The first slide is the page as written, so with no script
   or with reduced motion nothing changes. New words arrive as the old ones leave (30ms apart per line),
   the loop runs once, and it pauses while the pointer or keyboard focus is on the hero text. */
(function () {
  if (reduceMotion) return;
  var eb = document.querySelector(".hero .eyebrow"), hs = document.querySelector(".hero h1 span"), lede = document.querySelector(".hero .lede");
  if (!eb || !hs || !lede) return;
  var slides = [
    { e: eb.textContent.trim(), h: hs.textContent.trim(), p: lede.textContent.trim() },
    { e: "One quotation", h: "priced in one clear quotation.", p: "Every quotation lists what is included, what costs extra and the terms that apply, so you decide with the full picture." },
    { e: "Private vehicles", h: "in a vehicle just for your group.", p: "One vehicle per group keeps the day quiet and the pace in your hands." },
    { e: "Fewer stops", h: "with fewer stops, longer looks.", p: "Biophilia means a love of living things. We apply it to trip planning by leaving room to watch, walk and sit still." }
  ];
  var lines = [["e", eb], ["h", hs], ["p", lede]];
  lines.forEach(function (l) {
    var el = l[1]; el.textContent = ""; el.classList.add("rot");
    l.push(slides.map(function (s, i) {
      var v = document.createElement("span"); v.className = "rv" + (i === 0 ? " on" : ""); v.textContent = s[l[0]];
      if (i) v.setAttribute("aria-hidden", "true");
      el.appendChild(v); return v;
    }));
  });
  var cur = 0, paused = false, ticks = 0, hold = 5200;
  function go() {
    var next = (cur + 1) % slides.length;
    lines.forEach(function (l, i) {
      var v = l[2], d = (i * 30) + "ms";
      v[cur].style.setProperty("--d", d); v[next].style.setProperty("--d", d);
      v[cur].classList.add("out"); v[next].classList.add("in"); v[next].removeAttribute("aria-hidden"); v[cur].setAttribute("aria-hidden", "true");
    });
    var old = cur; cur = next;
    setTimeout(function () {
      lines.forEach(function (l) { var v = l[2]; v[old].classList.remove("on", "out"); v[cur].classList.remove("in"); v[cur].classList.add("on"); });
    }, 620);
  }
  function tick() {
    if (paused || document.hidden) { setTimeout(tick, 800); return; }
    go(); ticks++;
    if (ticks < slides.length) setTimeout(tick, hold);
  }
  var area = document.querySelector(".hero-top");
  area.addEventListener("pointerenter", function () { paused = true; });
  area.addEventListener("pointerleave", function () { paused = false; });
  area.addEventListener("focusin", function () { paused = true; });
  area.addEventListener("focusout", function () { paused = false; });
  setTimeout(tick, 6200);
})();

/* ---------- menu ---------- */
var head = document.querySelector("header.site"), menuBtn = document.getElementById("menuBtn");
menuBtn.addEventListener("click", function () {
  var o = head.classList.toggle("open");
  menuBtn.setAttribute("aria-expanded", String(o));
});
document.getElementById("mainNav").addEventListener("click", function () {
  head.classList.remove("open"); menuBtn.setAttribute("aria-expanded", "false");
});
