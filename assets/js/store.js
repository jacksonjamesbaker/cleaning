/* ============================================================
   OUNCE — cart + checkout
   Persists to localStorage. Renders the slide-over cart.
   ============================================================ */

const CART_KEY = "ounce.cart.v1";

const Cart = {
  items: [],

  load() {
    try { this.items = JSON.parse(localStorage.getItem(CART_KEY)) || []; }
    catch { this.items = []; }
  },
  save() {
    localStorage.setItem(CART_KEY, JSON.stringify(this.items));
    this.render();
    window.dispatchEvent(new CustomEvent("cart:change"));
  },

  key(id, size) { return id + "::" + size; },

  add(id, size, qty = 1) {
    const p = OUNCE.getProduct(id);
    if (!p) return;
    const k = this.key(id, size);
    const found = this.items.find((i) => i.k === k);
    if (found) found.qty += qty;
    else this.items.push({ k, id, size, qty });
    this.save();
    toast(`Added · ${p.name} · ${size}`);
    this.open();
  },

  setQty(k, qty) {
    const it = this.items.find((i) => i.k === k);
    if (!it) return;
    it.qty = Math.max(0, qty);
    if (it.qty === 0) this.items = this.items.filter((i) => i.k !== k);
    this.save();
  },
  remove(k) { this.items = this.items.filter((i) => i.k !== k); this.save(); },

  count() { return this.items.reduce((n, i) => n + i.qty, 0); },
  subtotal() {
    return this.items.reduce((s, i) => {
      const p = OUNCE.getProduct(i.id);
      return s + (p ? p.price * i.qty : 0);
    }, 0);
  },
  mass() {
    return this.items.reduce((m, i) => {
      const p = OUNCE.getProduct(i.id);
      return m + (p ? p.mass * i.qty : 0);
    }, 0);
  },

  open() { document.querySelector(".cart-veil")?.setAttribute("data-open", "true"); document.querySelector(".cart-panel")?.setAttribute("data-open", "true"); document.body.style.overflow = "hidden"; },
  close() { document.querySelector(".cart-veil")?.removeAttribute("data-open"); document.querySelector(".cart-panel")?.removeAttribute("data-open"); document.body.style.overflow = ""; },

  render() {
    // badge
    const c = this.count();
    document.querySelectorAll(".cart-btn__count").forEach((el) => {
      el.textContent = c;
      el.setAttribute("data-empty", c === 0);
      el.style.setProperty("--pop", "1.4");
      setTimeout(() => el.style.setProperty("--pop", "1"), 200);
    });
    // panel body
    const body = document.querySelector(".cart-items");
    const foot = document.querySelector(".cart-foot");
    if (!body) return;
    if (this.items.length === 0) {
      body.innerHTML = `<div class="cart-empty"><span class="label">Nothing weighed yet</span><a class="btn btn--ghost" href="/shop.html">Enter the shop</a></div>`;
      if (foot) foot.hidden = true;
      return;
    }
    if (foot) foot.hidden = false;
    body.innerHTML = this.items.map((i) => {
      const p = OUNCE.getProduct(i.id);
      const img = p.images?.[0] || OUNCE.artURI(p, 0, { label: false });
      return `<div class="cart-line">
        <div class="cart-line__media"><img src="${img}" alt="${p.name}"></div>
        <div>
          <div class="cart-line__name">${p.name}</div>
          <div class="cart-line__meta">${p.code} · Size ${i.size} · ${p.mass}g</div>
          <div class="cart-line__qty">
            <button aria-label="Decrease" data-dec="${i.k}">–</button>
            <span>${i.qty}</span>
            <button aria-label="Increase" data-inc="${i.k}">+</button>
          </div>
        </div>
        <div>
          <div class="cart-line__price">${OUNCE.money(p.price * i.qty)}</div>
          <button class="cart-line__rm" data-rm="${i.k}">Remove</button>
        </div>
      </div>`;
    }).join("");

    document.querySelectorAll("[data-cart-subtotal]").forEach((el) => { el.textContent = OUNCE.money(this.subtotal()); });
    const mass = document.querySelector("[data-cart-mass]");
    if (mass) mass.textContent = (this.mass() / 1000).toFixed(2) + " kg";
  },
};

/* ---------- checkout ----------
   Default flow posts the cart to /api/checkout, a serverless
   function that creates a Stripe Checkout Session (see
   /api/checkout.js + README). With no backend configured it
   falls back to a graceful demo confirmation so the UX is
   always intact. Flip CHECKOUT.mode to 'stripe' once deployed. */
const CHECKOUT = {
  mode: "auto",           // 'auto' | 'stripe' | 'demo'
  endpoint: "/api/checkout",
};

async function checkout() {
  if (Cart.items.length === 0) return;
  const btn = document.querySelector("[data-checkout]");
  const line = Cart.items.map((i) => {
    const p = OUNCE.getProduct(i.id);
    return { id: i.id, name: p.name, size: i.size, qty: i.qty, price: p.price };
  });

  if (CHECKOUT.mode === "demo") return demoCheckout();

  if (btn) { btn.dataset.loading = "true"; btn.textContent = "Weighing…"; }
  try {
    const res = await fetch(CHECKOUT.endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ items: line, currency: OUNCE.CURRENCY.code }),
    });
    if (!res.ok) throw new Error("no-endpoint");
    const data = await res.json();
    if (data.url) { window.location.href = data.url; return; }
    throw new Error("no-url");
  } catch (e) {
    if (CHECKOUT.mode === "stripe") {
      toast("Checkout unavailable — try again");
      if (btn) { btn.dataset.loading = "false"; btn.textContent = "Checkout"; }
      return;
    }
    demoCheckout();
  }
}

function demoCheckout() {
  const total = OUNCE.money(Cart.subtotal());
  const kg = (Cart.mass() / 1000).toFixed(2);
  Cart.close();
  const el = document.createElement("div");
  el.className = "cart-veil";
  el.setAttribute("data-open", "true");
  el.style.zIndex = 1300;
  el.innerHTML = `<div style="position:fixed;inset:0;display:grid;place-items:center;padding:24px">
    <div style="background:var(--paper);max-width:440px;width:100%;padding:40px;text-align:center">
      <div class="label" style="color:var(--signal)">Order received — demo</div>
      <h3 style="font-size:34px;font-weight:700;letter-spacing:-.03em;margin:16px 0 10px">Thank you.</h3>
      <p style="color:var(--ash);font-size:14px;margin-bottom:8px">${Cart.count()} pieces · ${kg} kg · ${total}</p>
      <p class="mono" style="color:var(--ash);margin-bottom:24px">Connect Stripe in /api/checkout.js to take live payments.</p>
      <button class="btn btn--block" data-demo-close>Close</button>
    </div></div>`;
  document.body.appendChild(el);
  el.querySelector("[data-demo-close]").onclick = () => { el.remove(); document.body.style.overflow = ""; Cart.items = []; Cart.save(); };
  el.onclick = (e) => { if (e.target === el) el.remove(), document.body.style.overflow = ""; };
}

/* toast */
let toastTimer;
function toast(msg) {
  let t = document.querySelector(".toast");
  if (!t) { t = document.createElement("div"); t.className = "toast"; document.body.appendChild(t); }
  t.textContent = msg;
  requestAnimationFrame(() => t.setAttribute("data-show", "true"));
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => t.removeAttribute("data-show"), 2200);
}

/* delegated cart events */
document.addEventListener("click", (e) => {
  const t = e.target.closest("[data-inc],[data-dec],[data-rm],[data-cart-open],[data-cart-close],[data-checkout]");
  if (!t) return;
  if (t.dataset.inc != null) { const it = Cart.items.find((i) => i.k === t.dataset.inc); Cart.setQty(t.dataset.inc, it.qty + 1); }
  else if (t.dataset.dec != null) { const it = Cart.items.find((i) => i.k === t.dataset.dec); Cart.setQty(t.dataset.dec, it.qty - 1); }
  else if (t.dataset.rm != null) Cart.remove(t.dataset.rm);
  else if (t.dataset.cartOpen != null) Cart.open();
  else if (t.dataset.cartClose != null) Cart.close();
  else if (t.dataset.checkout != null) checkout();
});
document.addEventListener("click", (e) => { if (e.target.classList?.contains("cart-veil") && e.target.dataset.open) Cart.close(); });
document.addEventListener("keydown", (e) => { if (e.key === "Escape") Cart.close(); });

Cart.load();
window.Cart = Cart;
