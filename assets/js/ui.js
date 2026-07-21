/* ============================================================
   OUNCE — shared chrome + interactions
   Injects nav, mobile drawer, cart slide-over and footer so
   every page stays in sync. Set <body data-page="shop"> to mark
   the active link.
   ============================================================ */

const NAVLINKS = [
  ["Shop", "/shop.html", "shop"],
  ["Lookbook", "/lookbook.html", "lookbook"],
  ["About", "/about.html", "about"],
];

function mountChrome() {
  const page = document.body.dataset.page || "";
  const dark = document.body.classList.contains("void");

  // ---- NAV ----
  const nav = document.createElement("header");
  nav.className = "nav";
  nav.innerHTML = `
    <a class="nav__brand" href="/" aria-label="ounce — home">ounce<sup>oz</sup></a>
    <nav class="nav__links">
      ${NAVLINKS.map(([t, h, k]) => `<a href="${h}"${k === page ? ' aria-current="page"' : ""}>${t}</a>`).join("")}
    </nav>
    <div class="nav__right">
      <button class="cart-btn" data-cart-open aria-label="Open cart">
        Cart<span class="cart-btn__count" data-empty="true">0</span>
      </button>
      <button class="nav__burger" aria-label="Menu" data-burger><span></span><span></span><span></span></button>
    </div>`;
  document.body.prepend(nav);

  // ---- MOBILE DRAWER ----
  const drawer = document.createElement("div");
  drawer.className = "drawer";
  drawer.innerHTML = `
    <nav>
      <a href="/"><span>00</span> Index</a>
      ${NAVLINKS.map(([t, h], i) => `<a href="${h}"><span>0${i + 1}</span> ${t}</a>`).join("")}
    </nav>
    <div class="drawer__meta">
      <span class="mono">EST · MMXXV</span>
      <span class="mono">1 oz = 28.35 g</span>
    </div>`;
  document.body.appendChild(drawer);

  // ---- CART SLIDE-OVER ----
  const cart = document.createElement("div");
  cart.innerHTML = `
    <div class="cart-veil"></div>
    <aside class="cart-panel" aria-label="Cart">
      <div class="cart-panel__head">
        <h3>Cart <span data-cart-mass class="mono" style="color:var(--ash)"></span></h3>
        <button class="cart-close" data-cart-close>Close ✕</button>
      </div>
      <div class="cart-items"></div>
      <div class="cart-foot" hidden>
        <div class="cart-foot__row"><span>Subtotal</span><span data-cart-subtotal>—</span></div>
        <div class="cart-foot__row"><span>Shipping</span><span>Calculated at checkout</span></div>
        <div class="cart-foot__row cart-foot__row--total"><span>Total</span><span data-cart-subtotal>—</span></div>
        <button class="btn btn--block" data-checkout>Checkout</button>
        <div class="cart-foot__note">Free shipping over £200 · 30-day returns</div>
      </div>
    </aside>`;
  document.body.appendChild(cart);

  // ---- FOOTER ----
  if (!document.body.hasAttribute("data-no-footer")) {
    const footer = document.createElement("footer");
    footer.className = "footer";
    footer.innerHTML = `
      <div class="wrap">
        <h2 class="footer__word">ounce<span class="oz">®</span></h2>
        <div class="footer__grid">
          <div>
            <h4>Newsletter</h4>
            <form class="footer__news" data-news>
              <input type="email" placeholder="your@email — weigh in" aria-label="Email" required>
              <button type="submit">Join →</button>
            </form>
            <p class="mono" style="color:var(--chalk-dim);margin-top:14px">No noise. Drops, restocks, and the occasional gram of sense.</p>
          </div>
          <div>
            <h4>Index</h4>
            <ul>
              <li><a href="/shop.html">Shop</a></li>
              <li><a href="/lookbook.html">Lookbook</a></li>
              <li><a href="/about.html">About</a></li>
              <li><a href="/shop.html">New Arrivals</a></li>
            </ul>
          </div>
          <div>
            <h4>Info</h4>
            <ul>
              <li><a href="#" data-info="ship">Shipping & Returns</a></li>
              <li><a href="#" data-info="size">Size Guide</a></li>
              <li><a href="#" data-info="care">Care</a></li>
              <li><a href="mailto:studio@ounce.supply">studio@ounce.supply</a></li>
            </ul>
          </div>
        </div>
        <div class="footer__base">
          <span class="mono">© MMXXV OUNCE SUPPLY CO.</span>
          <span class="mono">DESIGNED BY WEIGHT</span>
          <span class="mono">1 OZ · 28.349523 G</span>
        </div>
      </div>`;
    document.body.appendChild(footer);
  }

  // burger toggle
  const burger = nav.querySelector("[data-burger]");
  burger.addEventListener("click", () => {
    const open = drawer.getAttribute("data-open") === "true";
    drawer.setAttribute("data-open", String(!open));
    burger.classList.toggle("is-open", !open);
    document.body.style.overflow = open ? "" : "hidden";
  });
  drawer.querySelectorAll("a").forEach((a) => a.addEventListener("click", () => { drawer.removeAttribute("data-open"); document.body.style.overflow = ""; }));

  // newsletter (demo)
  document.querySelectorAll("[data-news]").forEach((f) => f.addEventListener("submit", (e) => {
    e.preventDefault(); f.reset(); toast("On the list — welcome to ounce");
  }));

  // info modals
  document.addEventListener("click", (e) => {
    const a = e.target.closest("[data-info]");
    if (!a) return; e.preventDefault(); openInfo(a.dataset.info);
  });

  Cart.render();
}

const INFO = {
  ship: ["Shipping & Returns", "Complimentary worldwide shipping over £200; a flat £12 below. Dispatched within 48 hours from our Lisbon studio, tracked door-to-door. Unworn pieces returned within 30 days for a full refund — we cover the first return label."],
  size: ["Size Guide", "We cut boxy and true. If you sit between sizes and want it clean, take your usual; for the intended drape, size up once. Every product page lists garment mass and flat measurements. Still unsure? Mail the studio — a human answers."],
  care: ["Care", "Cold wash, inside out, like colours. Hang to dry — heat is where weight goes to die. Denim: wait as long as you can, then wash rarely. Knitwear: fold, never hang. Everything here is built to be worn hard and kept long."],
};
function openInfo(k) {
  const [title, body] = INFO[k] || [];
  if (!title) return;
  const el = document.createElement("div");
  el.className = "cart-veil"; el.setAttribute("data-open", "true"); el.style.zIndex = 1300;
  el.innerHTML = `<div style="position:fixed;inset:0;display:grid;place-items:center;padding:24px" data-x>
    <div style="background:var(--paper);max-width:480px;width:100%;padding:40px">
      <div class="label" style="color:var(--signal);margin-bottom:14px">Info</div>
      <h3 style="font-size:28px;font-weight:700;letter-spacing:-.03em;margin-bottom:14px">${title}</h3>
      <p style="color:#2b2b27;font-size:15px;line-height:1.55;margin-bottom:24px">${body}</p>
      <button class="btn btn--block" data-x-close>Close</button>
    </div></div>`;
  document.body.appendChild(el); document.body.style.overflow = "hidden";
  const close = () => { el.remove(); document.body.style.overflow = ""; };
  el.querySelector("[data-x-close]").onclick = close;
  el.querySelector("[data-x]").onclick = (e) => { if (e.target.dataset.x != null) close(); };
}

/* scroll reveal */
function initReveal() {
  const io = new IntersectionObserver((entries) => {
    entries.forEach((en) => { if (en.isIntersecting) { en.target.classList.add("in"); io.unobserve(en.target); } });
  }, { threshold: 0.12, rootMargin: "0px 0px -8% 0px" });
  document.querySelectorAll("[data-reveal]").forEach((el) => io.observe(el));
}

/* duplicate marquee/ticker content so the loop is seamless */
function initMarquees() {
  document.querySelectorAll(".marquee__track, .units__track").forEach((t) => {
    t.innerHTML += t.innerHTML;
  });
}

document.addEventListener("DOMContentLoaded", () => {
  mountChrome();
  initReveal();
  initMarquees();
});
