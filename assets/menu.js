/* Menu button for the inner pages (car hire, stays). */
(function () {
  var head = document.querySelector("header.site"), btn = document.getElementById("menuBtn"), nav = document.getElementById("mainNav");
  if (!head || !btn || !nav) return;
  btn.addEventListener("click", function () { var o = head.classList.toggle("open"); btn.setAttribute("aria-expanded", String(o)); });
  nav.addEventListener("click", function () { head.classList.remove("open"); btn.setAttribute("aria-expanded", "false"); });
})();
