/* ============================================================
   OUNCE — product detail page (colour + size)
   ============================================================ */

(function () {
  const root = document.querySelector("[data-pdp]");
  if (!root) return;
  const id = new URLSearchParams(location.search).get("id");
  const p = OUNCE.getProduct(id) || OUNCE.PRODUCTS[0];
  document.title = `${p.name} — ounce`;

  let color = p.colors[0];
  let size = null;
  const soldOut = p.sizes.every((s) => !s[1]);

  const img = (c) => (p.images?.[c]?.[0] || OUNCE.artURI(p, 0, { color: c }));

  root.innerHTML = `
    <div class="pdp__gallery">
      <div class="pdp__main"><img data-main src="${img(color)}" alt="${p.name} — ${color}"></div>
      <div class="pdp__thumbs">
        ${p.colors.map((c) => `<button class="pdp__thumb" data-thumb="${c}" data-active="${c === color}" aria-label="${c}"><img src="${img(c)}" alt="${p.name} — ${c}"></button>`).join("")}
      </div>
    </div>
    <div class="pdp__panel">
      <div class="pdp__eyebrow">
        <span class="label">${p.code} · ${p.category}</span>
        <span class="label" style="color:var(--signal)">${p.mass} g</span>
      </div>
      <h1 class="pdp__title">${p.name}</h1>
      <div class="pdp__price">${OUNCE.money(p.price)} · ${p.tier} weight</div>
      <p class="pdp__desc">${p.desc}</p>

      <div class="label">Colour — <span data-color-name>${color}</span></div>
      <div class="colors">
        ${p.colors.map((c) => `<button class="swatch" data-swatch="${c}" data-active="${c === color}" style="background:${OUNCE.colorSwatch(c)}" aria-label="${c}"></button>`).join("")}
      </div>

      <div class="label" style="margin-top:20px">Size</div>
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
        <div><dt>Colour</dt><dd data-spec-color>${color}</dd></div>
      </dl>
    </div>`;

  const mainImg = root.querySelector("[data-main]");
  function selectColor(c) {
    color = c;
    mainImg.src = img(c);
    root.querySelectorAll("[data-thumb]").forEach((t) => t.setAttribute("data-active", t.dataset.thumb === c));
    root.querySelectorAll("[data-swatch]").forEach((t) => t.setAttribute("data-active", t.dataset.swatch === c));
    root.querySelector("[data-color-name]").textContent = c;
    root.querySelector("[data-spec-color]").textContent = c;
  }
  root.querySelectorAll("[data-thumb]").forEach((b) => b.addEventListener("click", () => selectColor(b.dataset.thumb)));
  root.querySelectorAll("[data-swatch]").forEach((b) => b.addEventListener("click", () => selectColor(b.dataset.swatch)));

  const note = root.querySelector("[data-note]");
  root.querySelectorAll("[data-size]").forEach((btn) => {
    if (btn.dataset.oos === "true") return;
    btn.addEventListener("click", () => {
      root.querySelectorAll("[data-size]").forEach((b) => b.removeAttribute("data-active"));
      btn.setAttribute("data-active", "true");
      size = btn.dataset.size;
      note.textContent = "";
    });
  });
  const avail = p.sizes.filter((s) => s[1]);
  if (avail.length === 1) { const b = root.querySelector(`[data-size="${avail[0][0]}"]`); b?.click(); }

  root.querySelector("[data-add]")?.addEventListener("click", () => {
    if (soldOut) return;
    if (!size) { note.textContent = "Select a size first"; return; }
    Cart.add(p.id, size, color, 1);
  });

  // related — other weights in the same category
  const related = document.querySelector("[data-related]");
  if (related) {
    const rel = OUNCE.PRODUCTS.filter((x) => x.id !== p.id && x.category === p.category);
    const pool = (rel.length ? rel : OUNCE.PRODUCTS.filter((x) => x.id !== p.id)).slice(0, 4);
    related.innerHTML = pool.map((x) => card(x)).join("");
  }
})();

function card(p) {
  const primary = p.images?.[p.colors[0]]?.[0] || OUNCE.artURI(p, 0, { color: p.colors[0] });
  const alt = p.images?.[p.colors[1]]?.[0] || OUNCE.artURI(p, 0, { color: p.colors[1] });
  return `<a class="card" href="/product.html?id=${p.id}">
    <div class="card__media"><img src="${primary}" alt="${p.name}" loading="lazy"><img class="alt" src="${alt}" alt="" aria-hidden="true" loading="lazy"></div>
    <div class="card__info"><div><div class="card__name">${p.name}</div><div class="card__sub">${p.code} · ${p.tier}</div></div><div class="card__price">${OUNCE.money(p.price)}</div></div>
  </a>`;
}
