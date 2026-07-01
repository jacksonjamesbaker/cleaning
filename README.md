# SparkleClean — Marketing Website

A production-ready, conversion-optimised marketing site for a UK cleaning
company. Built as **static HTML, CSS and vanilla JavaScript** — no build step,
no frameworks, no external dependencies or CDNs. It loads fast, works without
JavaScript for all content pages, and is easy to hand to a dev team.

> **SparkleClean** and the logo are placeholders — see [Rebranding](#rebranding).

---

## Quick start

It's a static site, so just serve the folder:

```bash
# Any static server works. For local preview:
python3 -m http.server 8000
# then open http://localhost:8000
```

Deploy by uploading the files to any static host (Netlify, Vercel, Cloudflare
Pages, GitHub Pages, S3, or plain nginx/Apache). No server-side code required.

---

## File structure

```
/
├── index.html          # Home
├── services.html       # Services (Domestic, Commercial, End of Tenancy, Deep)
├── about.html          # About / Why Us
├── reviews.html        # Reviews (with Review/AggregateRating schema)
├── faq.html            # FAQ (with FAQPage schema)
├── quote.html          # Get a Quote — the multi-step conversion form
├── thank-you.html      # Post-submission confirmation page
├── contact.html        # Contact (LocalBusiness schema, no competing form)
├── privacy.html        # Privacy Policy (UK GDPR template)
├── terms.html          # Terms & Conditions (template)
├── css/
│   └── styles.css      # Single stylesheet, design tokens at the top
├── js/
│   ├── main.js         # Sticky header, mobile nav, UTM capture, footer year
│   └── quote.js        # The multi-step quote wizard (see below)
└── assets/
    └── logo.svg        # Placeholder logo (swap to rebrand)
```

---

## Design & conversion principles

- **Single CTA rule.** The *only* call to action across the entire site is
  **"Get a Quote"**, pointing to `quote.html`. There are no competing
  "Learn more" / "Contact us" buttons. The sticky header keeps a Get-a-Quote
  button visible at all times, including on mobile.
- **Mobile-first**, responsive down to ~360px. No carousels, no pop-ups.
- **Trust-led hero**: outcome headline, one-line subhead, above-the-fold CTA,
  and trust indicators (star rating, review count, Fully insured, DBS-checked)
  directly beneath.
- **Repeated CTA** after every major section.
- **Accessibility**: semantic HTML, labelled form fields, keyboard navigation,
  skip link, ARIA on the step form and mobile menu, `prefers-reduced-motion`
  support, visible focus states.
- **SEO**: unique `<title>` / meta description per page, canonical URLs,
  Open Graph tags on the home page, and Schema.org structured data
  (`HouseCleaningService`/`LocalBusiness`, `AggregateRating`/`Review`,
  `FAQPage`).

---

## The quote form (`quote.html` + `js/quote.js`)

A data-driven, accessible, **branching multi-step wizard** — one question per
step, big tappable option cards (no dropdowns for choices), a progress bar,
a Back button, and auto-advance on selection.

**Flow**

1. **Type** — Domestic | Commercial *(branches the rest of the form)*
2. Domestic → **Service** (Regular / One-off deep / End of tenancy)
   Commercial → **Premises** (Office / Retail / Hospitality / Other)
3. Domestic → **Bedrooms** (1–5+)
   Commercial → **Size** (Small / Medium / Large / Multi-site)
4. Domestic → **Frequency** (Weekly / Fortnightly / One-off)
   Commercial → **Frequency** (Daily / Weekly / One-off contract)
5. **Postcode** (validated against the GOV.UK UK-postcode pattern)
6. **Contact details** — Title, First name, Last name, Email, Mobile
   → submit button **"Get My Quote"** with the reassurance line
   *"No obligation. We'll be in touch within 1 working hour."*

**Behaviour**

- Inline validation with friendly, specific error messages (postcode, name,
  email, UK mobile).
- **UTM / marketing attribution** is captured on first landing by `main.js`
  (`utm_source`, `utm_medium`, `utm_campaign`, `utm_term`, `utm_content`,
  `gclid`, `fbclid`, plus landing page & referrer), stored in `sessionStorage`,
  and attached to every submission — so attribution survives internal
  navigation.
- On submit, a **clean JSON payload** is POSTed to a placeholder webhook, then
  the user is redirected to `thank-you.html` (which greets them by name and
  shows the phone number).

### Editing the steps

All questions, options and branching live in the `STEPS` array near the top of
`js/quote.js`. Each choice step declares its `options` and a `next(answers)`
function that returns the id of the following step — that's how branching
works. Add, remove or reorder steps by editing that array; no other changes
needed.

### Submission payload shape

```json
{
  "form": "sparkleclean-quote",
  "submitted_at": "2026-07-01T12:00:00.000Z",
  "lead": {
    "title": "Ms",
    "first_name": "Jane",
    "last_name": "Smith",
    "email": "jane@example.com",
    "mobile": "07123456789",
    "postcode": "SW1A 1AA"
  },
  "requirements": {
    "cleaning_type": "Domestic",
    "service": "Regular cleaning",
    "premises": "",
    "bedrooms": "3",
    "size": "",
    "frequency": "Fortnightly"
  },
  "marketing": {
    "utm_source": "google",
    "utm_medium": "cpc",
    "utm_campaign": "spring",
    "utm_term": "",
    "utm_content": "",
    "gclid": "",
    "fbclid": "",
    "landing_page": "/quote.html?utm_source=google",
    "referrer": "(direct)"
  },
  "meta": {
    "page": "https://www.sparkleclean.co.uk/quote.html",
    "user_agent": "..."
  }
}
```

---

## Configuration you'll want to change

| What | Where |
| --- | --- |
| **Webhook endpoint** (where leads are sent) | `WEBHOOK_URL` at the top of `js/quote.js` |
| Thank-you redirect target | `THANK_YOU_URL` in `js/quote.js` |
| Phone number | Search `020 1234 5678` / `tel:+442012345678` across the HTML + `thank-you.html` |
| Email address | Search `hello@sparkleclean.co.uk` |
| Postal address & opening hours | JSON-LD in `index.html` / `contact.html` |
| Prices ("from £X") | `index.html` and `services.html` |
| Review content & ratings | `reviews.html` (and the review cards on `index.html`) |
| Canonical domain | Search `www.sparkleclean.co.uk` and replace with your domain |

> The webhook is a placeholder (`https://webhook.example.com/...`). Point it at
> Zapier, Make, your CRM, or a serverless function. The form fails gracefully
> and still shows the thank-you page even if the endpoint errors — add stricter
> error handling once your real endpoint is in place.

---

## Rebranding

1. **Name** — the brand appears as `Sparkle<b>Clean</b>` in the header/footer of
   each page. Find-and-replace to change it.
2. **Logo** — replace `assets/logo.svg`. The inline logo SVG is also embedded in
   each page's header/footer (so it renders instantly without a second request);
   update those inline copies too, or replace them with `<img src="assets/logo.svg">`.
3. **Accent colour** — change the single `--accent` token in `css/styles.css`
   (`:root`). `--accent-dark` and `--accent-light` are its shades. The logo SVG
   also uses `#0fb5a6` — update it to match.
4. **Fonts** — the site uses the system font stack (fast, no tracking). Swap the
   `--font` token to use a custom font.

All design tokens (colours, spacing, radius, shadows) live at the top of
`css/styles.css` under `:root`.

---

## Testing

The quote flow has been exercised end-to-end (both the Domestic and Commercial
branches) with a headless browser: option selection & auto-advance, the Back
button preserving state, postcode + contact validation, UTM capture into the
payload, webhook POST, and the personalised thank-you page — all passing with
no console errors. The mobile header CTA stays visible and the mobile menu
toggles correctly.

---

## Browser support

Modern evergreen browsers (Chrome, Edge, Firefox, Safari). Uses standard
features — Flexbox, CSS Grid, `<details>` accordions, `URLSearchParams`,
`fetch`, `sessionStorage`. No transpilation needed.

---

## Notes for going live

- [ ] Set the real `WEBHOOK_URL` in `js/quote.js`.
- [ ] Replace placeholder contact details, address, prices and reviews.
- [ ] Swap the logo and brand name; set your accent colour.
- [ ] Update canonical URLs / Open Graph URL to your domain.
- [ ] Add a real favicon set and an OG share image if desired.
- [ ] **Have a solicitor review `privacy.html` and `terms.html`** — they are
      templates, not legal advice.
- [ ] Add analytics/consent tooling per your privacy requirements.
