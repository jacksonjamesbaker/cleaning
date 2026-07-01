/* ==========================================================================
   SparkleClean — global site behaviour
   - Mobile navigation toggle (accessible)
   - Sticky header shadow on scroll
   - UTM capture: stores marketing parameters for the session so they can be
     attached to the quote submission later (see js/quote.js)
   ========================================================================== */
(function () {
  'use strict';

  /* ---- Mobile nav toggle -------------------------------------------------- */
  var toggle = document.querySelector('.nav-toggle');
  var nav = document.getElementById('primary-nav');

  if (toggle && nav) {
    toggle.addEventListener('click', function () {
      var open = nav.getAttribute('data-open') === 'true';
      nav.setAttribute('data-open', String(!open));
      toggle.setAttribute('aria-expanded', String(!open));
    });

    // Close the menu when a link is chosen (mobile)
    nav.addEventListener('click', function (e) {
      if (e.target.closest('a')) {
        nav.setAttribute('data-open', 'false');
        toggle.setAttribute('aria-expanded', 'false');
      }
    });

    // Close on Escape
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && nav.getAttribute('data-open') === 'true') {
        nav.setAttribute('data-open', 'false');
        toggle.setAttribute('aria-expanded', 'false');
        toggle.focus();
      }
    });
  }

  /* ---- UTM / marketing parameter capture ---------------------------------
     Captured once per session on first landing and persisted to
     sessionStorage. The quote form reads this back so the lead payload always
     carries the original campaign attribution, even after internal navigation.
  ------------------------------------------------------------------------- */
  try {
    var UTM_KEYS = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content', 'gclid', 'fbclid'];
    var params = new URLSearchParams(window.location.search);
    var stored = JSON.parse(sessionStorage.getItem('sc_marketing') || '{}');
    var changed = false;

    UTM_KEYS.forEach(function (key) {
      var val = params.get(key);
      if (val && !stored[key]) { stored[key] = val; changed = true; }
    });

    // Record the first landing page + referrer once
    if (!stored.landing_page) {
      stored.landing_page = window.location.pathname + window.location.search;
      stored.referrer = document.referrer || '(direct)';
      changed = true;
    }

    if (changed) { sessionStorage.setItem('sc_marketing', JSON.stringify(stored)); }
  } catch (err) {
    /* sessionStorage may be unavailable (private mode) — fail silently */
  }

  /* ---- Footer year -------------------------------------------------------- */
  var yearEl = document.getElementById('year');
  if (yearEl) { yearEl.textContent = new Date().getFullYear(); }
})();
