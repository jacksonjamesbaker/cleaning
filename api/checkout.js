/* ============================================================
   OUNCE — Stripe Checkout (serverless)
   ------------------------------------------------------------
   Works out of the box on Vercel or Netlify (functions).
   The storefront POSTs the cart here; we create a Stripe
   Checkout Session and return its URL. The front-end redirects.

   TO GO LIVE:
   1. `npm install` (installs the `stripe` package — see package.json)
   2. Set env var  STRIPE_SECRET_KEY = sk_live_...  (or sk_test_...)
   3. Deploy. That's it — real payments, no other wiring.

   Prices are read from THIS file's trusted catalogue, never from
   the client, so the amount charged can't be tampered with.
   Keep the `price` values in sync with assets/js/products.js
   (or swap to Stripe Price IDs — see the note below).
   ============================================================ */

// server-trusted prices, in minor units (pence). Source of truth for charges.
const CATALOGUE = {
  "tee-light":    { name: "Lightweight Tee", price: 4500 },
  "tee-mid":      { name: "Midweight Tee", price: 5500 },
  "tee-heavy":    { name: "Heavyweight Tee", price: 6500 },
  "hoodie-light": { name: "Lightweight Hoodie", price: 11000 },
  "hoodie-mid":   { name: "Midweight Hoodie", price: 13000 },
  "hoodie-heavy": { name: "Heavyweight Hoodie", price: 15000 },
  "pant-light":   { name: "Lightweight Sweatpant", price: 9500 },
  "pant-mid":     { name: "Midweight Sweatpant", price: 11500 },
  "pant-heavy":   { name: "Heavyweight Sweatpant", price: 13500 },
  "short-light":  { name: "Lightweight Sweatshort", price: 7000 },
  "short-mid":    { name: "Midweight Sweatshort", price: 8500 },
  "short-heavy":  { name: "Heavyweight Sweatshort", price: 10000 },
  "beanie-light": { name: "Lightweight Fisherman Beanie", price: 4000 },
  "beanie-mid":   { name: "Midweight Fisherman Beanie", price: 4500 },
  "beanie-heavy": { name: "Heavyweight Fisherman Beanie", price: 5000 },
  "cap-light":    { name: "Lightweight Dad Cap", price: 4000 },
  "cap-mid":      { name: "Midweight Dad Cap", price: 4500 },
  "cap-heavy":    { name: "Heavyweight Dad Cap", price: 5000 },
};

// Vercel-style handler (Node). Netlify wrapper is exported below too.
module.exports = async function handler(req, res) {
  if (req.method !== "POST") {
    res.statusCode = 405;
    return res.end("Method Not Allowed");
  }

  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) {
    // No key configured yet — tell the client so it shows the demo flow.
    res.statusCode = 501;
    res.setHeader("Content-Type", "application/json");
    return res.end(JSON.stringify({ error: "stripe_not_configured" }));
  }

  try {
    const stripe = require("stripe")(key);
    const body = await readJSON(req);
    const items = Array.isArray(body.items) ? body.items : [];
    const currency = (body.currency || "gbp").toLowerCase();

    const line_items = items
      .map((i) => {
        const p = CATALOGUE[i.id];
        if (!p) return null;
        const qty = Math.max(1, Math.min(20, parseInt(i.qty, 10) || 1));
        return {
          quantity: qty,
          price_data: {
            currency,
            unit_amount: p.price,
            product_data: {
              name: p.name,
              description: [i.color, i.size ? `Size ${i.size}` : null].filter(Boolean).join(" · ") || undefined,
            },
          },
        };
      })
      .filter(Boolean);

    if (!line_items.length) {
      res.statusCode = 400;
      res.setHeader("Content-Type", "application/json");
      return res.end(JSON.stringify({ error: "empty_cart" }));
    }

    const origin =
      req.headers.origin ||
      (req.headers.host ? `https://${req.headers.host}` : "");

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items,
      billing_address_collection: "auto",
      shipping_address_collection: { allowed_countries: ["GB", "US", "CA", "AU", "DE", "FR", "NL", "IT", "ES", "PT", "IE", "SE", "DK", "JP"] },
      success_url: `${origin}/?checkout=success`,
      cancel_url: `${origin}/shop.html?checkout=cancelled`,
    });

    res.statusCode = 200;
    res.setHeader("Content-Type", "application/json");
    return res.end(JSON.stringify({ url: session.url }));
  } catch (err) {
    res.statusCode = 500;
    res.setHeader("Content-Type", "application/json");
    return res.end(JSON.stringify({ error: "checkout_failed", message: String(err.message || err) }));
  }
};

function readJSON(req) {
  return new Promise((resolve) => {
    if (req.body) return resolve(typeof req.body === "string" ? JSON.parse(req.body) : req.body);
    let data = "";
    req.on("data", (c) => (data += c));
    req.on("end", () => { try { resolve(JSON.parse(data || "{}")); } catch { resolve({}); } });
  });
}

/* ---- Netlify Functions adapter ----
   If deploying to Netlify, this same file is reused at
   netlify/functions/checkout.js via the redirect in netlify.toml.
   Netlify passes (event) not (req,res); this shim bridges it. */
module.exports.handler = async function (event) {
  const key = process.env.STRIPE_SECRET_KEY;
  if (event.httpMethod !== "POST") return { statusCode: 405, body: "Method Not Allowed" };
  if (!key) return { statusCode: 501, body: JSON.stringify({ error: "stripe_not_configured" }) };
  try {
    const stripe = require("stripe")(key);
    const body = JSON.parse(event.body || "{}");
    const currency = (body.currency || "gbp").toLowerCase();
    const line_items = (body.items || [])
      .map((i) => {
        const p = CATALOGUE[i.id];
        if (!p) return null;
        const qty = Math.max(1, Math.min(20, parseInt(i.qty, 10) || 1));
        return { quantity: qty, price_data: { currency, unit_amount: p.price, product_data: { name: p.name, description: i.size ? `Size ${i.size}` : undefined } } };
      })
      .filter(Boolean);
    if (!line_items.length) return { statusCode: 400, body: JSON.stringify({ error: "empty_cart" }) };
    const origin = event.headers.origin || `https://${event.headers.host}`;
    const session = await stripe.checkout.sessions.create({
      mode: "payment", line_items,
      shipping_address_collection: { allowed_countries: ["GB", "US", "CA", "AU", "DE", "FR", "NL", "IT", "ES", "PT", "IE", "SE", "DK", "JP"] },
      success_url: `${origin}/?checkout=success`,
      cancel_url: `${origin}/shop.html?checkout=cancelled`,
    });
    return { statusCode: 200, headers: { "Content-Type": "application/json" }, body: JSON.stringify({ url: session.url }) };
  } catch (err) {
    return { statusCode: 500, body: JSON.stringify({ error: "checkout_failed", message: String(err.message || err) }) };
  }
};
