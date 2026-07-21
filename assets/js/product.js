/* ============================================================
   OUNCE — product detail page
   Reads ?id= , renders gallery / panel / spec / related.
   ============================================================ */

(function () {
  const root = document.querySelector("[data-pdp]");
  if (!root) return;
  const id = new URLSearchParams(location.search).get("id");
  const p = OUNCE.getProduct(id) || OUNCE.PRODUCTS[0];

  document.title = `${p.name} — ounce`;

  const shots = p.images
    ? p.images.map((src) => `<div class="pdp__shot"><img src="${src}" alt="${p.name}"></div>`).join("")
    : [0, 1, 2].map((v) => `<div class="pdp__shot"><img src="${OUNCE.artURI(p, v)}" alt="${p.name} view ${v + 1}"></div>`).join("");

  const soldOut = p.sizes.every((s) => !s[1]);

  root.innerHTML = `
    <div class="pdp__gallery">${shots}</div>
    <div class="pdp__panel">
      <div class="pdp__eyebrow">
        <span class="label">${p.code} · ${p.category}</span>
        <span class="label" style="color:var(--signal)">${p.mass} g</span>
      </div>
      <h1 class="pdp__title">${p.name}</h1>
      <div class="pdp__price">${OUNCE.money(p.price)} · ${p.colorway}</div>
      <p class="pdp__desc">${p.desc}</p>

      <div class="label">Size</div>
      <div class="sizes">
        ${p.sizes.map((s) => `<button class="size" data-size="${s[0]}" data-oos="${!s[1]}">${s[0]}</button>`).join("")}
      </div>
      <div class="size-note" data-note></div>

      <div class="pdp__buy">
        <button class="btn btn--block" data-add ${soldOut ? "disabled" : ""}>${soldOut ? "Sold Out" : "Add to Cart"}</button>
      </div>

      <dl class="pdp__spec" style="margin-top:28px">
        <div><dt>Fabric</dt><dd>${p.fabric}</dd></div>
        <div><dt>Fit</dt><dd>${p.fit}</dd></div>
        <div><dt>Mass</dt><dd>${p.mass} g · ${(p.mass / 28.3495).toFixed(1)} oz</dd></div>
        <div><dt>Made in</dt><dd>${p.madeIn}</dd></div>
        <div><dt>Colourway</dt><dd>${p.colorway}</dd></div>
      </dl>
    </div>`;

  // size selection
  let chosen = null;
  const note = root.querySelector("[data-note]");
  root.querySelectorAll("[data-size]").forEach((btn) => {
    if (btn.dataset.oos === "true") return;
    btn.addEventListener("click", () => {
      root.querySelectorAll("[data-size]").forEach((b) => b.removeAttribute("data-active"));
      btn.setAttribute("data-active", "true");
      chosen = btn.dataset.size;
      note.textContent = "";
    });
  });
  // auto-select if only one size
  const avail = p.sizes.filter((s) => s[1]);
  if (avail.length === 1) { const b = root.querySelector(`[data-size="${avail[0][0]}"]`); b?.click(); }

  root.querySelector("[data-add]")?.addEventListener("click", () => {
    if (soldOut) return;
    if (!chosen) { note.textContent = "Select a size first"; return; }
    Cart.add(p.id, chosen, 1);
  });

  // related
  const related = document.querySelector("[data-related]");
  if (related) {
    const rel = OUNCE.PRODUCTS.filter((x) => x.id !== p.id && x.category === p.category);
    const pool = (rel.length ? rel : OUNCE.PRODUCTS.filter((x) => x.id !== p.id)).slice(0, 4);
    related.innerHTML = pool.map((x) => {
      const primary = x.images?.[0] || OUNCE.artURI(x, 0);
      const alt = x.images?.[1] || OUNCE.artURI(x, 1);
      return `<a class="card" href="/product.html?id=${x.id}">
        <div class="card__media"><img src="${primary}" alt="${x.name}" loading="lazy"><img class="alt" src="${alt}" alt="" aria-hidden="true" loading="lazy"></div>
        <div class="card__info"><div><div class="card__name">${x.name}</div><div class="card__sub">${x.code}</div></div><div class="card__price">${OUNCE.money(x.price)}</div></div>
      </a>`;
    }).join("");
  }
})();
