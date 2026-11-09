/* Gallery: click a photo to see it larger. Esc, the close button or a click outside closes it. */
(function () {
  var buttons = document.querySelectorAll(".gallery button[data-full]");
  if (!buttons.length || typeof HTMLDialogElement === "undefined") return;
  var dlg = document.createElement("dialog");
  dlg.className = "lightbox";
  dlg.setAttribute("aria-label", "Photo");
  dlg.innerHTML = '<button type="button" class="lb-close" aria-label="Close photo">×</button><img alt=""><p></p>';
  document.body.appendChild(dlg);
  var img = dlg.querySelector("img"), cap = dlg.querySelector("p");
  var last = null;
  buttons.forEach(function (b) {
    b.addEventListener("click", function () {
      last = b;
      img.src = b.getAttribute("data-full"); img.alt = b.getAttribute("data-alt") || "";
      cap.textContent = b.getAttribute("data-cap") || "";
      dlg.showModal();
    });
  });
  dlg.querySelector(".lb-close").addEventListener("click", function () { dlg.close(); });
  dlg.addEventListener("click", function (e) { if (e.target === dlg) dlg.close(); });
  dlg.addEventListener("close", function () { img.removeAttribute("src"); if (last) last.focus(); });
})();
