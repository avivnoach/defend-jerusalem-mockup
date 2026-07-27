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

  // Relative timestamps — "3 hours ago" feed vibe, computed from real datetimes
  function relTime(iso) {
    var then = new Date(iso).getTime();
    if (isNaN(then)) return null;
    var mins = Math.round((Date.now() - then) / 60000);
    if (mins < 1) return "Just now";
    if (mins < 60) return mins + " min ago";
    var hrs = Math.round(mins / 60);
    if (hrs < 24) return hrs + (hrs === 1 ? " hour ago" : " hours ago");
    var days = Math.round(hrs / 24);
    if (days === 1) return "Yesterday";
    if (days < 8) return days + " days ago";
    return null; // older than a week: keep the printed date
  }
  document.querySelectorAll(".news time[datetime*='T']").forEach(function (t) {
    var rel = relTime(t.getAttribute("datetime"));
    if (rel) {
      t.textContent = rel + (t.dataset.suffix ? " · " + t.dataset.suffix : "");
      t.title = new Date(t.getAttribute("datetime")).toLocaleString();
    }
  });

  // Share buttons — native share sheet on phones, copy-link elsewhere
  document.querySelectorAll(".share").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var url = btn.dataset.url || window.location.href;
      var title = btn.dataset.title || document.title;
      if (navigator.share) {
        navigator.share({ title: title, url: url }).catch(function () {});
      } else if (navigator.clipboard) {
        navigator.clipboard.writeText(url).then(function () {
          btn.setAttribute("data-tip", "Link copied");
          setTimeout(function () { btn.removeAttribute("data-tip"); }, 1600);
        });
      }
    });
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
