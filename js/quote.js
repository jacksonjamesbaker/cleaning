/* ==========================================================================
   SparkleClean — Multi-step quote form
   --------------------------------------------------------------------------
   A data-driven, accessible, branching wizard.

   - One question per step, big tappable option cards, auto-advance on select
   - Progress bar + Back button
   - Branches on Step 1 (Domestic vs Commercial)
   - Inline validation for postcode + contact details
   - Captures UTM/marketing params (stored by js/main.js) into the payload
   - Posts a clean JSON payload to a placeholder webhook, then redirects to
     the thank-you page

   ===>  TO GO LIVE: change WEBHOOK_URL below to your endpoint.  <===
   ========================================================================== */
(function () {
  'use strict';

  /* -----------------------------------------------------------------------
     CONFIG — swap this for your real endpoint (Zapier, Make, CRM, etc.)
  ----------------------------------------------------------------------- */
  var WEBHOOK_URL = 'https://webhook.example.com/sparkleclean-leads'; // <-- placeholder
  var THANK_YOU_URL = 'thank-you.html';

  /* -----------------------------------------------------------------------
     STEP DEFINITIONS
     Each choice step lists its options. `next` decides the following step id,
     which is how branching works (a function receives the current answers).
  ----------------------------------------------------------------------- */
  var ICONS = {
    home: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 10l9-7 9 7v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><path d="M9 22V12h6v10"/></svg>',
    office: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 21h18"/><path d="M5 21V7l7-4 7 4v14"/><path d="M9 9h.01M9 13h.01M15 9h.01M15 13h.01"/></svg>',
    sparkle: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2l2 5 5 2-5 2-2 5-2-5-5-2 5-2z"/></svg>',
    box: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 7h18M6 7V4h12v3M8 7v13M16 7v13M5 20h14"/></svg>',
    calendar: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/></svg>',
    shop: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9l1-5h16l1 5M4 9v11h16V9M4 9h16"/></svg>',
    cup: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 8h1a3 3 0 0 1 0 6h-1M3 8h15v5a5 5 0 0 1-5 5H8a5 5 0 0 1-5-5z"/><path d="M6 2v2M10 2v2M14 2v2"/></svg>',
    grid: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></svg>',
    bed: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 17v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5M2 17h20M2 17v3M22 17v3M6 10V7a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v3"/></svg>'
  };

  var STEPS = [
    {
      id: 'type',
      key: 'cleaning_type',
      title: 'What type of cleaning do you need?',
      sub: 'Pick the option that fits best — you can add detail later.',
      layout: 2,
      options: [
        { value: 'Domestic', label: 'Domestic', desc: 'My home', icon: ICONS.home },
        { value: 'Commercial', label: 'Commercial', desc: 'A business or workplace', icon: ICONS.office }
      ],
      next: function (a) { return a.cleaning_type === 'Commercial' ? 'premises' : 'service'; }
    },

    /* ---- Domestic branch -------------------------------------------- */
    {
      id: 'service',
      key: 'service',
      branch: 'Domestic',
      title: 'What service are you looking for?',
      sub: 'This helps us match you with the right cleaner.',
      options: [
        { value: 'Regular cleaning', label: 'Regular cleaning', desc: 'Weekly or fortnightly upkeep', icon: ICONS.home },
        { value: 'One-off deep clean', label: 'One-off deep clean', desc: 'A thorough top-to-bottom reset', icon: ICONS.sparkle },
        { value: 'End of tenancy', label: 'End of tenancy', desc: 'Deposit-back move-out clean', icon: ICONS.box }
      ],
      next: function () { return 'bedrooms'; }
    },
    {
      id: 'bedrooms',
      key: 'bedrooms',
      branch: 'Domestic',
      title: 'How many bedrooms?',
      sub: 'A rough guide to the size of your home.',
      layout: 2,
      options: [
        { value: '1', label: '1 bedroom', icon: ICONS.bed },
        { value: '2', label: '2 bedrooms', icon: ICONS.bed },
        { value: '3', label: '3 bedrooms', icon: ICONS.bed },
        { value: '4', label: '4 bedrooms', icon: ICONS.bed },
        { value: '5+', label: '5+ bedrooms', icon: ICONS.bed }
      ],
      next: function () { return 'frequency'; }
    },
    {
      id: 'frequency',
      key: 'frequency',
      branch: 'Domestic',
      title: 'How often?',
      sub: 'You can change this any time — no long contracts.',
      options: [
        { value: 'Weekly', label: 'Weekly', desc: 'Same cleaner every week', icon: ICONS.calendar },
        { value: 'Fortnightly', label: 'Fortnightly', desc: 'Every two weeks', icon: ICONS.calendar },
        { value: 'One-off', label: 'One-off', desc: 'Just this once', icon: ICONS.calendar }
      ],
      next: function () { return 'postcode'; }
    },

    /* ---- Commercial branch ------------------------------------------ */
    {
      id: 'premises',
      key: 'premises',
      branch: 'Commercial',
      title: 'What type of premises?',
      sub: 'This helps us match you with the right team.',
      layout: 2,
      options: [
        { value: 'Office', label: 'Office', icon: ICONS.office },
        { value: 'Retail', label: 'Retail', icon: ICONS.shop },
        { value: 'Hospitality', label: 'Hospitality', icon: ICONS.cup },
        { value: 'Other', label: 'Other', icon: ICONS.grid }
      ],
      next: function () { return 'size'; }
    },
    {
      id: 'size',
      key: 'size',
      branch: 'Commercial',
      title: 'Approximate size?',
      sub: 'A rough estimate is fine.',
      options: [
        { value: 'Small', label: 'Small', desc: 'Under 1,000 sq ft', icon: ICONS.grid },
        { value: 'Medium', label: 'Medium', desc: '1,000–5,000 sq ft', icon: ICONS.grid },
        { value: 'Large', label: 'Large', desc: 'Over 5,000 sq ft', icon: ICONS.grid },
        { value: 'Multi-site', label: 'Multi-site', desc: 'Several locations', icon: ICONS.office }
      ],
      next: function () { return 'frequency_c'; }
    },
    {
      id: 'frequency_c',
      key: 'frequency',
      branch: 'Commercial',
      title: 'How often?',
      sub: 'We build a schedule around your business.',
      options: [
        { value: 'Daily', label: 'Daily', desc: 'Every working day', icon: ICONS.calendar },
        { value: 'Weekly', label: 'Weekly', desc: 'Once or twice a week', icon: ICONS.calendar },
        { value: 'One-off contract', label: 'One-off contract', desc: 'A single project', icon: ICONS.box }
      ],
      next: function () { return 'postcode'; }
    },

    /* ---- Shared: postcode ------------------------------------------- */
    {
      id: 'postcode',
      key: 'postcode',
      title: 'What’s your postcode?',
      sub: 'So we can match you with cleaners who cover your area.',
      type: 'postcode',
      next: function () { return 'contact'; }
    },

    /* ---- Shared: contact details ------------------------------------ */
    {
      id: 'contact',
      title: 'Almost there — where shall we send your quote?',
      sub: 'Your details are safe with us and never shared.',
      type: 'contact'
    }
  ];

  /* -----------------------------------------------------------------------
     STATE
  ----------------------------------------------------------------------- */
  var answers = {};          // collected answers keyed by step.key
  var history = [];          // stack of visited step ids (for Back)
  var currentId = STEPS[0].id;

  var stepHost = document.getElementById('quote-steps');
  var progressFill = document.getElementById('progress-fill');
  var progressLabel = document.getElementById('progress-label');
  var backBtn = document.getElementById('quote-back');

  function stepById(id) {
    for (var i = 0; i < STEPS.length; i++) { if (STEPS[i].id === id) return STEPS[i]; }
    return null;
  }

  /* Estimate progress based on the branch length (5 choice/entry steps + contact) */
  function updateProgress() {
    var totalSteps = 6; // type, service/premises, size, frequency, postcode, contact
    var current = history.length + 1;
    var pct = Math.min(100, Math.round((current / totalSteps) * 100));
    progressFill.style.width = pct + '%';
    progressLabel.textContent = 'Step ' + Math.min(current, totalSteps) + ' of ' + totalSteps;
    backBtn.hidden = history.length === 0;
  }

  /* -----------------------------------------------------------------------
     RENDER
  ----------------------------------------------------------------------- */
  function render(id) {
    var step = stepById(id);
    if (!step) return;
    currentId = id;

    var html = '';
    html += '<div class="quote-step active" role="group" aria-labelledby="q-' + step.id + '-title">';
    html += '<h2 id="q-' + step.id + '-title">' + step.title + '</h2>';
    if (step.sub) { html += '<p class="step-sub">' + step.sub + '</p>'; }

    if (step.type === 'postcode') {
      html += renderPostcode(step);
    } else if (step.type === 'contact') {
      html += renderContact(step);
    } else {
      html += renderOptions(step);
    }

    html += '</div>';
    stepHost.innerHTML = html;

    bindStep(step);
    updateProgress();

    // Move focus to the step heading for screen-reader users
    var heading = document.getElementById('q-' + step.id + '-title');
    if (heading) { heading.setAttribute('tabindex', '-1'); heading.focus({ preventScroll: true }); }
    stepHost.scrollIntoView({ block: 'nearest' });
  }

  function renderOptions(step) {
    var cols = step.layout === 2 ? ' options--2' : '';
    var out = '<div class="options' + cols + '" role="listbox" aria-label="' + step.title + '">';
    step.options.forEach(function (opt) {
      var selected = answers[step.key] === opt.value;
      out += '<button type="button" class="option-card" role="option" aria-pressed="' + selected + '" data-value="' + escapeAttr(opt.value) + '">';
      if (opt.icon) { out += '<span class="opt-icon" aria-hidden="true">' + opt.icon + '</span>'; }
      out += '<span class="opt-text">' + escapeHtml(opt.label);
      if (opt.desc) { out += '<small>' + escapeHtml(opt.desc) + '</small>'; }
      out += '</span>';
      out += '<svg class="opt-check" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20 6L9 17l-5-5"/></svg>';
      out += '</button>';
    });
    out += '</div>';
    return out;
  }

  function renderPostcode(step) {
    var val = answers.postcode || '';
    var out = '<div class="field">';
    out += '<label for="postcode-input" class="sr-only">Postcode</label>';
    out += '<input class="input" id="postcode-input" name="postcode" type="text" inputmode="text" autocomplete="postal-code" placeholder="e.g. SW1A 1AA" value="' + escapeAttr(val) + '" aria-describedby="postcode-error" autocapitalize="characters">';
    out += '<span class="field-error" id="postcode-error" role="alert"></span>';
    out += '</div>';
    out += '<div class="step-nav"><span></span><button type="button" class="btn btn--primary" id="postcode-continue">Continue</button></div>';
    return out;
  }

  function renderContact(step) {
    var a = answers;
    var out = '<form id="contact-form" novalidate>';
    out += '<div class="field">';
    out += '<label for="title">Title</label>';
    out += '<select class="select" id="title" name="title">';
    ['Mr', 'Mrs', 'Miss', 'Ms', 'Mx'].forEach(function (t) {
      out += '<option value="' + t + '"' + (a.title === t ? ' selected' : '') + '>' + t + '</option>';
    });
    out += '</select></div>';

    out += '<div class="field-row">';
    out += fieldText('first_name', 'First name', 'given-name', a.first_name);
    out += fieldText('last_name', 'Last name', 'family-name', a.last_name);
    out += '</div>';

    out += fieldText('email', 'Email', 'email', a.email, 'email');
    out += fieldText('mobile', 'Mobile', 'tel', a.mobile, 'tel', 'e.g. 07123 456789');

    out += '<button type="submit" class="btn btn--primary btn--block btn--lg" id="submit-quote" style="margin-top:8px;">Get My Quote</button>';
    out += '<p class="reassure"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20 6L9 17l-5-5"/></svg> No obligation. We’ll be in touch within 1 working hour.</p>';
    out += '</form>';
    return out;
  }

  function fieldText(name, label, autocomplete, value, type, placeholder) {
    var out = '<div class="field">';
    out += '<label for="' + name + '">' + label + '</label>';
    out += '<input class="input" id="' + name + '" name="' + name + '" type="' + (type || 'text') + '" autocomplete="' + autocomplete + '"';
    if (placeholder) { out += ' placeholder="' + escapeAttr(placeholder) + '"'; }
    out += ' value="' + escapeAttr(value || '') + '" aria-describedby="' + name + '-error">';
    out += '<span class="field-error" id="' + name + '-error" role="alert"></span>';
    out += '</div>';
    return out;
  }

  /* -----------------------------------------------------------------------
     BIND EVENTS PER STEP
  ----------------------------------------------------------------------- */
  function bindStep(step) {
    if (step.type === 'postcode') { bindPostcode(step); return; }
    if (step.type === 'contact') { bindContact(step); return; }

    // Option cards — auto-advance on selection
    var cards = stepHost.querySelectorAll('.option-card');
    cards.forEach(function (card) {
      card.addEventListener('click', function () {
        answers[step.key] = card.getAttribute('data-value');
        answers.path = answers.cleaning_type; // convenience field
        cards.forEach(function (c) { c.setAttribute('aria-pressed', 'false'); });
        card.setAttribute('aria-pressed', 'true');

        // Brief highlight, then advance
        window.setTimeout(function () { advance(step); }, 180);
      });
    });
  }

  function bindPostcode(step) {
    var input = document.getElementById('postcode-input');
    var btn = document.getElementById('postcode-continue');
    function go() {
      var value = (input.value || '').trim();
      if (!isValidUKPostcode(value)) {
        showError('postcode', 'Please enter a valid UK postcode, e.g. SW1A 1AA.');
        input.setAttribute('aria-invalid', 'true');
        input.focus();
        return;
      }
      clearError('postcode');
      input.removeAttribute('aria-invalid');
      answers.postcode = formatPostcode(value);
      advance(step);
    }
    btn.addEventListener('click', go);
    input.addEventListener('keydown', function (e) { if (e.key === 'Enter') { e.preventDefault(); go(); } });
    input.addEventListener('input', function () { clearError('postcode'); input.removeAttribute('aria-invalid'); });
    input.focus();
  }

  function bindContact(step) {
    var form = document.getElementById('contact-form');
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      if (validateContact(form)) { submit(form); }
    });
  }

  /* -----------------------------------------------------------------------
     VALIDATION
  ----------------------------------------------------------------------- */
  // UK postcode regex (GOV.UK recommended pattern, case-insensitive)
  function isValidUKPostcode(v) {
    var re = /^(GIR ?0AA|[A-Z]{1,2}\d[A-Z\d]? ?\d[A-Z]{2})$/i;
    return re.test(v.replace(/\s+/g, ' ').trim());
  }
  function formatPostcode(v) {
    var s = v.toUpperCase().replace(/\s+/g, '');
    if (s.length > 3) { s = s.slice(0, s.length - 3) + ' ' + s.slice(s.length - 3); }
    return s;
  }
  function isValidEmail(v) { return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v); }
  function isValidMobile(v) {
    var digits = v.replace(/[^\d+]/g, '');
    // UK mobile: 07xxxxxxxxx or +447xxxxxxxxx
    return /^(?:0|\+?44)7\d{9}$/.test(digits);
  }

  function validateContact(form) {
    var ok = true;
    var first = form.first_name.value.trim();
    var last = form.last_name.value.trim();
    var email = form.email.value.trim();
    var mobile = form.mobile.value.trim();

    if (first.length < 2) { showError('first_name', 'Please enter your first name.'); markInvalid(form.first_name); ok = false; } else { clearError('first_name'); form.first_name.removeAttribute('aria-invalid'); }
    if (last.length < 2) { showError('last_name', 'Please enter your last name.'); markInvalid(form.last_name); ok = false; } else { clearError('last_name'); form.last_name.removeAttribute('aria-invalid'); }
    if (!isValidEmail(email)) { showError('email', 'Please enter a valid email address.'); markInvalid(form.email); ok = false; } else { clearError('email'); form.email.removeAttribute('aria-invalid'); }
    if (!isValidMobile(mobile)) { showError('mobile', 'Please enter a valid UK mobile number.'); markInvalid(form.mobile); ok = false; } else { clearError('mobile'); form.mobile.removeAttribute('aria-invalid'); }

    if (!ok) {
      var firstBad = form.querySelector('[aria-invalid="true"]');
      if (firstBad) { firstBad.focus(); }
    }
    return ok;
  }

  function markInvalid(el) { el.setAttribute('aria-invalid', 'true'); }
  function showError(name, msg) {
    var el = document.getElementById(name + '-error');
    if (el) { el.textContent = msg; el.classList.add('show'); }
  }
  function clearError(name) {
    var el = document.getElementById(name + '-error');
    if (el) { el.textContent = ''; el.classList.remove('show'); }
  }

  /* -----------------------------------------------------------------------
     NAVIGATION
  ----------------------------------------------------------------------- */
  function advance(step) {
    var nextId = typeof step.next === 'function' ? step.next(answers) : step.next;
    if (!nextId) return;
    history.push(currentId);
    render(nextId);
  }

  backBtn.addEventListener('click', function () {
    if (history.length === 0) return;
    var prev = history.pop();
    render(prev);
  });

  /* -----------------------------------------------------------------------
     SUBMISSION — build a clean JSON payload and POST to the webhook
  ----------------------------------------------------------------------- */
  function submit(form) {
    var btn = document.getElementById('submit-quote');
    btn.disabled = true;
    btn.textContent = 'Sending…';

    // Persist contact answers
    answers.title = form.title.value;
    answers.first_name = form.first_name.value.trim();
    answers.last_name = form.last_name.value.trim();
    answers.email = form.email.value.trim();
    answers.mobile = form.mobile.value.trim();

    var marketing = {};
    try { marketing = JSON.parse(sessionStorage.getItem('sc_marketing') || '{}'); } catch (e) {}

    // Clean, well-structured JSON payload — easy to map in any CRM/automation
    var payload = {
      form: 'sparkleclean-quote',
      submitted_at: new Date().toISOString(),
      lead: {
        title: answers.title,
        first_name: answers.first_name,
        last_name: answers.last_name,
        email: answers.email,
        mobile: answers.mobile,
        postcode: answers.postcode || ''
      },
      requirements: {
        cleaning_type: answers.cleaning_type || '',
        service: answers.service || '',           // domestic path
        premises: answers.premises || '',         // commercial path
        bedrooms: answers.bedrooms || '',         // domestic path
        size: answers.size || '',                 // commercial path
        frequency: answers.frequency || ''
      },
      marketing: {
        utm_source: marketing.utm_source || '',
        utm_medium: marketing.utm_medium || '',
        utm_campaign: marketing.utm_campaign || '',
        utm_term: marketing.utm_term || '',
        utm_content: marketing.utm_content || '',
        gclid: marketing.gclid || '',
        fbclid: marketing.fbclid || '',
        landing_page: marketing.landing_page || '',
        referrer: marketing.referrer || ''
      },
      meta: {
        page: window.location.href,
        user_agent: navigator.userAgent
      }
    };

    // Store the summary so the thank-you page can greet the customer
    try { sessionStorage.setItem('sc_last_quote', JSON.stringify(payload.lead)); } catch (e) {}

    fetch(WEBHOOK_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    })
      .then(function () { finish(); })
      .catch(function () {
        // Even if the placeholder webhook rejects, don't block the customer.
        // Swap WEBHOOK_URL for a real endpoint and add error handling as needed.
        finish();
      });
  }

  function finish() {
    window.location.href = THANK_YOU_URL;
  }

  /* -----------------------------------------------------------------------
     HELPERS
  ----------------------------------------------------------------------- */
  function escapeHtml(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }
  function escapeAttr(s) { return escapeHtml(s); }

  /* -----------------------------------------------------------------------
     INIT
  ----------------------------------------------------------------------- */
  render(currentId);
})();
