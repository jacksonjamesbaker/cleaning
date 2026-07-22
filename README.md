# ounce — everything has weight

A complete, ready-to-sell clothing webshop for the brand **ounce**.
Curatorial restraint (JJJJound) crossed with an abstract, kinetic landing
(Palace energy). The whole brand is built on one idea: **weight**. An ounce
is 28.35 g, every product lists its mass in grams, and the landing page is a
literal "weighing room" you can play with.

No framework. No build step. Pure HTML / CSS / vanilla JS + one small
serverless function for real Stripe payments.

---

## What's in the box

| Page | File | What it is |
|------|------|-----------|
| **Landing** | `index.html` | Abstract soft-physics canvas of floating "weights" (drag, push, click to drop), unit ticker, editorial statements, featured rail |
| **Shop** | `shop.html` | Filterable / sortable product grid |
| **Product** | `product.html?id=hoodie-heavy` | Colour picker (Black/Grey/White), size picker, spec table (mass in g **and** oz), add-to-cart, related |
| **Lookbook** | `lookbook.html` | Generative editorial "Volume 01" grid |
| **About** | `about.html` | Brand story + five-point manifesto |
| **Cart** | injected everywhere | Slide-over cart, localStorage-persisted, live subtotal + total mass |
| **Checkout** | `api/checkout.js` | Serverless Stripe Checkout Session (Vercel **and** Netlify) |

### Product imagery
Product shots are **generated as abstract on-brand SVG** so the store looks
intentional with zero assets. To drop in real photography, add an `images`
array to any product in `assets/js/products.js`:

```js
{ id: "hoodie-heavy", name: "Heavyweight Hoodie",
  images: { Black: ["/assets/img/hoodie-heavy-black.jpg"], Grey: [...], White: [...] }, ... }
```

The store uses those and ignores the generated art automatically.

---

## Run it locally

It's static — any file server works:

```bash
npx serve .
# or
python3 -m http.server 8000
```

Open the printed URL. The cart works immediately. Checkout runs in a graceful
**demo** mode until you connect Stripe (below).

---

## Go live & take payments (≈2 minutes)

Checkout prices are read from a **server-side catalogue** in `api/checkout.js`,
never from the browser, so amounts can't be tampered with.

### Option A — Vercel
1. Push this repo to GitHub and import it at [vercel.com](https://vercel.com).
2. Project → Settings → Environment Variables → add
   `STRIPE_SECRET_KEY = sk_live_...` (or `sk_test_...` to trial).
3. Deploy. `/api/checkout` is auto-detected as a function. Done — real
   Stripe Checkout, hosted card page, address collection, the lot.

### Option B — Netlify
Same idea; `netlify.toml` already maps `/api/checkout` to the function and
`npm install` pulls in `stripe`. Add the `STRIPE_SECRET_KEY` env var and deploy.

### Option C — any static host (GitHub Pages, Cloudflare Pages…)
The storefront still works fully; checkout falls back to demo mode. To take
payments without a server, swap `checkout()` in `assets/js/store.js` for
[Stripe Payment Links](https://stripe.com/docs/payment-links) or a
[Snipcart](https://snipcart.com) key — both are drop-in for static sites.

> **Prices live in two places** — keep them in sync:
> display prices in `assets/js/products.js` and the trusted charge amounts in
> `api/checkout.js` (`CATALOGUE`, in pence). Or switch the function to use
> Stripe **Price IDs** for a single source of truth.

---

## Make it yours

- **Products** → `assets/js/products.js` (name, price, mass, fabric, sizes, colourway, copy)
- **Colours / type** → CSS variables at the top of `assets/css/styles.css`
  (`--paper`, `--ink`, `--signal` accent, fonts)
- **Landing physics** → `assets/js/landing.js` (gravity, labels, weight count)
- **Copy & manifesto** → the page HTML files
- **Currency** → `CURRENCY` in `products.js` + `currency` in `api/checkout.js`

---

## Design notes

- **Concept:** weight as honesty. Mass printed on every label; "buy less, heavier."
- **Type:** Helvetica for display, monospace for all labels/UI — the JJJJound register.
- **Palette:** warm paper `#E9E7E1`, near-black ink, a single acid signal `#E8451F`, used sparingly.
- **Two worlds:** the landing is a dark "void"; the shop is bright "paper." Nav uses `mix-blend-mode` so it reads on both.
- **Details:** film-grain overlay, scroll reveals, seamless marquees, custom slide-over cart, reduced-motion support, responsive to phones.

Built to be sold from. Enjoy — and weigh in.
