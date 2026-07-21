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
  "oz-01": { name: "Heavyweight Hoodie", price: 18000 },
  "oz-02": { name: "14oz Selvedge Denim", price: 24000 },
  "oz-03": { name: "Gram Tee", price: 6500 },
  "oz-04": { name: "Featherweight Shell", price: 32000 },
  "oz-05": { name: "Ballast Cargo", price: 21000 },
  "oz-06": { name: "Counterweight Knit", price: 19500 },
  "oz-07": { name: "Troy Beanie", price: 5500 },
  "oz-08": { name: "Density Overshirt", price: 23000 },
  "oz-09": { name: "Null Socks", price: 2200 },
  "oz-10": { name: "Standard Sweatpant", price: 15000 },
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
              description: i.size ? `Size ${i.size}` : undefined,
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
