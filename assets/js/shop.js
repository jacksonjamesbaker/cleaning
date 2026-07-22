/* ============================================================
   OUNCE — shop grid + filters + sort
   ============================================================ */

(function () {
  const grid = document.querySelector("[data-shop-grid]");
  if (!grid) return;
  const count = document.querySelector("[data-shop-count]");

  const cats = ["all", ...new Set(OUNCE.PRODUCTS.map((p) => p.category))];
  const filters = document.querySelector("[data-filters]");
  let active = new URLSearchParams(location.search).get("c") || "all";
  let sort = "featured";

  filters.innerHTML =
    cats.map((c) => `<button class="chip" data-cat="${c}" data-active="${c === active}">${c}</button>`).join("") +
    `<span class="filters__spacer"></span>
     <button class="chip" data-sort aria-label="Sort">Sort · Featured ⇅</button>`;

  const SORTS = ["featured", "price ↑", "price ↓", "mass ↑", "mass ↓"];
  let si = 0;

  function render() {
    let list = OUNCE.PRODUCTS.filter((p) => active === "all" || p.category === active);
    if (sort === "price ↑") list.sort((a, b) => a.price - b.price);
    else if (sort === "price ↓") list.sort((a, b) => b.price - a.price);
    else if (sort === "mass ↑") list.sort((a, b) => a.mass - b.mass);
    else if (sort === "mass ↓") list.sort((a, b) => b.mass - a.mass);
    else list.sort((a, b) => ((b.featured ? 1 : 0) - (a.featured ? 1 : 0)) || a.code.localeCompare(b.code));

    grid.innerHTML = list.map(card).join("");
    if (count) count.textContent = String(list.length).padStart(2, "0");
  }

  function card(p) {
    const primary = p.images?.[p.colors[0]]?.[0] || OUNCE.artURI(p, 0, { color: p.colors[0] });
    const alt = p.images?.[p.colors[1]]?.[0] || OUNCE.artURI(p, 0, { color: p.colors[1] });
    const sold = p.sizes.every((s) => !s[1]);
    const dots = p.colors.map((c) => `<span class="card__dot" style="background:${OUNCE.colorSwatch(c)}"></span>`).join("");
    return `<a class="card" href="/product.html?id=${p.id}">
      <div class="card__media">
        <img src="${primary}" alt="${p.name}" loading="lazy">
        <img class="alt" src="${alt}" alt="" aria-hidden="true" loading="lazy">
        ${p.drop === 1 ? '<span class="card__tag">New</span>' : ""}
        ${sold ? '<span class="card__tag card__tag--sold">Sold Out</span>' : ""}
        <div class="card__quick"><span class="btn btn--ghost btn--block" style="background:var(--paper)">View · ${OUNCE.money(p.price)}</span></div>
      </div>
      <div class="card__info">
        <div>
          <div class="card__name">${p.name}</div>
          <div class="card__sub">${p.code} · ${p.tier}</div>
          <div class="card__dots">${dots}</div>
        </div>
        <div class="card__price">${OUNCE.money(p.price)}</div>
      </div>
    </a>`;
  }

  filters.addEventListener("click", (e) => {
    const cat = e.target.closest("[data-cat]");
    const so = e.target.closest("[data-sort]");
    if (cat) {
      active = cat.dataset.cat;
      filters.querySelectorAll("[data-cat]").forEach((c) => c.setAttribute("data-active", c.dataset.cat === active));
      history.replaceState(null, "", active === "all" ? location.pathname : `?c=${active}`);
      render();
    }
    if (so) {
      si = (si + 1) % SORTS.length; sort = SORTS[si];
      so.textContent = `Sort · ${sort[0].toUpperCase() + sort.slice(1)} ⇅`;
      render();
    }
  });

  render();
})();
