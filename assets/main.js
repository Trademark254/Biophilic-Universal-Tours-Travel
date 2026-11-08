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
if (reduceMotion) { hv.setAttribute("preload", "none"); } else { playHero(); }

/* ---------- sample routes ---------- */
var ROUTES = [
  { t: "Tsavo East Short Break", d: "2 days, 1 night", k: "Road safari", p: "Tsavo East", img: "tsavo-east", alt: "Elephants gathered at a waterhole on red earth, some bathing in the water", x: "Two days on the red-earth plains of Tsavo East, then back to the coast." },
  { t: "Masai Mara Fly-in", d: "3 days, 2 nights", k: "Fly-in safari", p: "Masai Mara", img: "masai-mara", alt: "Elephants and calves silhouetted against an orange setting sun", x: "Fly to the Mara, spend two nights on the plains and take several game drives." },
  { t: "Amboseli and Tsavo", d: "4 days, 3 nights", k: "Multi-park", p: "Amboseli, Tsavo West, Tsavo East", img: "amboseli", alt: "Snow-capped Mount Kilimanjaro above acacia trees and open plain", x: "Kilimanjaro rising over the Amboseli plains, then both Tsavo parks on the way back." },
  { t: "Rift Valley Lakes", d: "3 days, 2 nights", k: "Road safari", p: "Lake Nakuru, Lake Naivasha", img: "rift-valley-lakes", alt: "Flamingos wading and taking off from a lake below green hills", x: "Lake Nakuru and Lake Naivasha for birdlife, rhino, hippo and walks along the shore." },
  { t: "Samburu in the North", d: "4 days, 3 nights", k: "Road safari", p: "Samburu", img: "samburu", alt: "A herd of eland and acacia trees silhouetted against a golden sunset", x: "Dry northern country with Grevy's zebra, reticulated giraffe, gerenuk and Beisa oryx, rarely seen on southern routes." },
  { t: "Nairobi to the Coast", d: "7 days, 6 nights", k: "Multi-park", p: "Nairobi, Masai Mara, Lake Nakuru, Amboseli, Tsavo", img: "nairobi-to-the-coast", alt: "Close view of a buffalo with an oxpecker bird on its head", x: "Five parks in one week, ending on the coast." }
];
function askUrl(r) {
  return "https://wa.me/" + WHATSAPP_NUMBER + "?text=" + encodeURIComponent("Hello Biophilic Universal, I am interested in the " + r.t + " route (" + r.d + ").");
}
var routesEl = document.getElementById("routes");
ROUTES.forEach(function (r) {
  var el = document.createElement("article");
  el.className = "route"; el.setAttribute("data-kind", r.k);
  el.innerHTML = '<div class="art"><span class="tag mono" aria-hidden="true">' + r.p + '</span><img src="assets/routes/' + r.img + '-720.jpg" srcset="assets/routes/' + r.img + '-720.jpg 720w, assets/routes/' + r.img + '-1200.jpg 1200w" sizes="(max-width: 620px) 100vw, (max-width: 960px) 50vw, 380px" width="1200" height="800" alt="' + r.alt + '" loading="lazy" decoding="async"></div>' +
    '<div class="body"><div class="meta mono"><span>' + r.d + '</span><span class="kind">' + r.k + '</span></div>' +
    '<h3>' + r.t + '</h3><p>' + r.x + '</p><span class="where mono">' + r.p + '</span>' +
    '<a class="ask" href="' + askUrl(r) + '" target="_blank" rel="noopener">Ask about this route on WhatsApp</a></div>';
  el.style.viewTransitionName = "route-" + routesEl.children.length;
  routesEl.appendChild(el);
});
document.getElementById("filters").addEventListener("click", function (e) {
  var b = e.target.closest("button");
  if (!b || b.getAttribute("aria-pressed") === "true") return;
  var f = b.getAttribute("data-f"), cards = [].slice.call(routesEl.querySelectorAll(".route"));
  var before = cards.map(function (el) { return el.hidden ? null : el.getBoundingClientRect(); });
  function update() {
    document.querySelectorAll("#filters button").forEach(function (x) { x.setAttribute("aria-pressed", String(x === b)); });
    cards.forEach(function (el) { el.hidden = !(f === "all" || el.getAttribute("data-kind") === f); });
  }
  if (!document.startViewTransition || reduceMotion) { update(); return; }
  var st = document.createElement("style"), moved = [], fresh = 0;
  var t = document.startViewTransition(function () {
    update();
    cards.forEach(function (el, i) {
      if (el.hidden) return;
      if (!before[i]) { st.textContent += "::view-transition-new(route-" + (i + 1) + "){animation-delay:" + (fresh++ * 30) + "ms}"; return; }
      var r = el.getBoundingClientRect();
      if (Math.abs(r.left - before[i].left) > 1 || Math.abs(r.top - before[i].top) > 1) moved.push(i + 1);
    });
    document.head.appendChild(st);
  });
  /* cards that move travel on a shallow arc, not a straight line */
  t.ready.then(function () {
    moved.forEach(function (n) {
      document.documentElement.animate({ translate: ["0 0", "0 -14px", "0 0"] }, { duration: 400, easing: "ease-in-out", pseudoElement: "::view-transition-group(route-" + n + ")" });
    });
  }, function () {});
  t.finished.then(function () { st.remove(); }, function () { st.remove(); });
});

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
