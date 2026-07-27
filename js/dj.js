/* Defend Jerusalem mockup — progressive enhancement only.
   Every page is fully readable and navigable with this file removed. */

(function () {
  // Image slots: if a local generated image is missing, fall back to the
  // current site's real thumbnail; if that also fails, show the styled slot.
  function imgFail(img) {
    var fb = img.getAttribute("data-fallback");
    if (fb && img.src !== fb) {
      img.src = fb;
    } else {
      img.style.display = "none";
      var t = img.closest(".thumb");
      if (t) t.classList.add("missing");
    }
  }
  document.querySelectorAll(".thumb img").forEach(function (img) {
    img.addEventListener("error", function () { imgFail(img); });
    // the image may have failed before this script ran
    if (img.complete && img.naturalWidth === 0) imgFail(img);
  });

  // Mobile menu
  var btn = document.querySelector(".menu-btn");
  var panel = document.querySelector(".mobile-nav");
  if (btn && panel) {
    btn.addEventListener("click", function () {
      var open = panel.classList.toggle("open");
      btn.setAttribute("aria-expanded", open ? "true" : "false");
    });
  }

  // Donate: frequency toggle
  var freqBtns = document.querySelectorAll(".freq button");
  freqBtns.forEach(function (b) {
    b.addEventListener("click", function () {
      freqBtns.forEach(function (o) { o.setAttribute("aria-pressed", "false"); });
      b.setAttribute("aria-pressed", "true");
    });
  });

  // Donate: amount presets + custom field
  var amountBtns = document.querySelectorAll(".amounts button");
  var custom = document.querySelector(".custom-amount input");
  amountBtns.forEach(function (b) {
    b.addEventListener("click", function () {
      amountBtns.forEach(function (o) { o.setAttribute("aria-pressed", "false"); });
      b.setAttribute("aria-pressed", "true");
      if (custom) custom.value = "";
    });
  });
  if (custom) {
    custom.addEventListener("input", function () {
      amountBtns.forEach(function (o) { o.setAttribute("aria-pressed", "false"); });
    });
  }

  // Report: highlight current chapter in the TOC
  var tocLinks = document.querySelectorAll(".toc a[href^='#']");
  if (tocLinks.length && "IntersectionObserver" in window) {
    var map = {};
    tocLinks.forEach(function (a) { map[a.getAttribute("href").slice(1)] = a; });
    var obs = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting && map[e.target.id]) {
          tocLinks.forEach(function (a) { a.classList.remove("current"); });
          map[e.target.id].classList.add("current");
        }
      });
    }, { rootMargin: "-20% 0px -70% 0px" });
    Object.keys(map).forEach(function (id) {
      var el = document.getElementById(id);
      if (el) obs.observe(el);
    });
  }
})();
