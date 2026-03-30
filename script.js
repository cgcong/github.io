(function () {
  "use strict";

  var STORAGE_KEY = "intro-theme";
  var doc = document.documentElement;

  function getStoredTheme() {
    try {
      return localStorage.getItem(STORAGE_KEY);
    } catch (e) {
      return null;
    }
  }

  function setStoredTheme(theme) {
    try {
      localStorage.setItem(STORAGE_KEY, theme);
    } catch (e) {
      /* ignore */
    }
  }

  function applyTheme(theme) {
    if (theme === "dark") {
      doc.setAttribute("data-theme", "dark");
    } else {
      doc.setAttribute("data-theme", "light");
    }
  }

  function initTheme() {
    var stored = getStoredTheme();
    var prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    var theme = stored === "dark" || stored === "light" ? stored : prefersDark ? "dark" : "light";
    applyTheme(theme);
  }

  function toggleTheme() {
    var next = doc.getAttribute("data-theme") === "dark" ? "light" : "dark";
    applyTheme(next);
    setStoredTheme(next);
  }

  function initNav() {
    var toggle = document.querySelector(".nav-toggle");
    var list = document.querySelector(".nav-list");
    if (!toggle || !list) return;

    function closeNav() {
      list.classList.remove("is-open");
      toggle.setAttribute("aria-expanded", "false");
    }

    toggle.addEventListener("click", function () {
      var open = list.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
    });

    list.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        if (window.matchMedia("(max-width: 768px)").matches) {
          closeNav();
        }
      });
    });

    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") closeNav();
    });
  }

  function initAccordion() {
    var root = document.querySelector("[data-accordion]");
    if (!root) return;

    var triggers = root.querySelectorAll(".accordion-trigger");
    triggers.forEach(function (btn) {
      btn.addEventListener("click", function () {
        var expanded = btn.getAttribute("aria-expanded") === "true";
        var panelId = btn.getAttribute("aria-controls");
        var panel = panelId ? document.getElementById(panelId) : null;
        if (!panel) return;

        if (expanded) {
          btn.setAttribute("aria-expanded", "false");
          panel.classList.add("accordion-panel--hidden");
          panel.hidden = true;
        } else {
          triggers.forEach(function (other) {
            if (other === btn) return;
            other.setAttribute("aria-expanded", "false");
            var oid = other.getAttribute("aria-controls");
            var op = oid ? document.getElementById(oid) : null;
            if (op) {
              op.classList.add("accordion-panel--hidden");
              op.hidden = true;
            }
          });
          btn.setAttribute("aria-expanded", "true");
          panel.classList.remove("accordion-panel--hidden");
          panel.hidden = false;
        }
      });
    });
  }

  function initBackToTop() {
    var btn = document.querySelector(".back-to-top");
    if (!btn) return;

    function onScroll() {
      if (window.scrollY > 400) {
        btn.hidden = false;
      } else {
        btn.hidden = true;
      }
    }

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    btn.addEventListener("click", function () {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  initTheme();
  document.querySelector(".theme-toggle")?.addEventListener("click", toggleTheme);

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", function () {
      initNav();
      initAccordion();
      initBackToTop();
    });
  } else {
    initNav();
    initAccordion();
    initBackToTop();
  }
})();
