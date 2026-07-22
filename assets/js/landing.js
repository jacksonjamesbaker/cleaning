/* ============================================================
   OUNCE — the weighing room
   A soft-physics field of masses. Drift, gravity, cursor push,
   gentle collisions. No libraries. Respects reduced-motion.
   ============================================================ */

(function () {
  const canvas = document.getElementById("field");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;

  let W, H, DPR;
  const LABELS = ["1oz", "28g", "¼", "½", "16", "oz", "1lb", "g", "454g", "⅛", "2oz", "gram", "τ", "kg"];
  const mouse = { x: -9999, y: -9999, active: false };
  let bodies = [];

  function resize() {
    DPR = Math.min(devicePixelRatio || 1, 2);
    W = canvas.clientWidth; H = canvas.clientHeight;
    canvas.width = W * DPR; canvas.height = H * DPR;
    ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
  }

  function seed() {
    const n = Math.round(Math.min(26, Math.max(12, (W * H) / 46000)));
    bodies = [];
    for (let i = 0; i < n; i++) {
      const r = 14 + Math.pow(Math.random(), 1.6) * 62;
      bodies.push({
        x: Math.random() * W,
        y: Math.random() * H,
        vx: (Math.random() - 0.5) * 0.25,
        vy: (Math.random() - 0.5) * 0.25,
        r,
        m: r * r,
        label: LABELS[i % LABELS.length],
        signal: i === 3,           // one accent mass
        rot: (Math.random() - 0.5) * 0.4,
        a: Math.random() * Math.PI,
      });
    }
  }

  function step() {
    for (const b of bodies) {
      // faint downward drift = gravity of the room
      b.vy += 0.006;
      // gentle wander
      b.a += 0.01;
      b.vx += Math.cos(b.a) * 0.004;

      // cursor repulsion (mass has inertia — big ones move less)
      if (mouse.active) {
        const dx = b.x - mouse.x, dy = b.y - mouse.y;
        const d2 = dx * dx + dy * dy;
        const R = 190;
        if (d2 < R * R) {
          const d = Math.sqrt(d2) || 1;
          const f = (1 - d / R) * 4 / Math.sqrt(b.m);
          b.vx += (dx / d) * f * 26;
          b.vy += (dy / d) * f * 26;
        }
      }

      b.vx *= 0.985; b.vy *= 0.985;
      b.x += b.vx; b.y += b.vy;

      // walls
      if (b.x < b.r) { b.x = b.r; b.vx *= -0.6; }
      if (b.x > W - b.r) { b.x = W - b.r; b.vx *= -0.6; }
      if (b.y < b.r) { b.y = b.r; b.vy *= -0.6; }
      if (b.y > H - b.r) { b.y = H - b.r; b.vy *= -0.5; }
    }

    // soft collisions
    for (let i = 0; i < bodies.length; i++) {
      for (let j = i + 1; j < bodies.length; j++) {
        const a = bodies[i], c = bodies[j];
        const dx = c.x - a.x, dy = c.y - a.y;
        const dist = Math.hypot(dx, dy) || 1;
        const min = a.r + c.r + 4;
        if (dist < min) {
          const nx = dx / dist, ny = dy / dist;
          const overlap = (min - dist) / 2;
          const tot = a.m + c.m;
          a.x -= nx * overlap * (c.m / tot); a.y -= ny * overlap * (c.m / tot);
          c.x += nx * overlap * (a.m / tot); c.y += ny * overlap * (a.m / tot);
          const rel = (c.vx - a.vx) * nx + (c.vy - a.vy) * ny;
          if (rel < 0) {
            const imp = -rel * 0.6;
            a.vx -= nx * imp * (c.m / tot); a.vy -= ny * imp * (c.m / tot);
            c.vx += nx * imp * (a.m / tot); c.vy += ny * imp * (a.m / tot);
          }
        }
      }
    }
  }

  function draw() {
    ctx.clearRect(0, 0, W, H);
    for (const b of bodies) {
      ctx.beginPath();
      ctx.arc(b.x, b.y, b.r, 0, Math.PI * 2);
      if (b.signal) { ctx.fillStyle = "#E8451F"; ctx.fill(); }
      else {
        ctx.strokeStyle = "rgba(237,235,228,0.5)";
        ctx.lineWidth = 1;
        ctx.stroke();
      }
      // label
      const fs = Math.max(9, Math.min(b.r * 0.42, 22));
      ctx.fillStyle = b.signal ? "#0B0B0A" : "rgba(237,235,228,0.7)";
      ctx.font = `${fs}px ui-monospace, Menlo, monospace`;
      ctx.textAlign = "center"; ctx.textBaseline = "middle";
      ctx.fillText(b.label, b.x, b.y);
    }
  }

  let raf;
  function loop() { step(); draw(); raf = requestAnimationFrame(loop); }

  function init() {
    resize(); seed();
    if (reduce) { draw(); return; }
    cancelAnimationFrame(raf); loop();
  }

  addEventListener("resize", () => { resize(); seed(); if (reduce) draw(); });
  canvas.addEventListener("pointermove", (e) => {
    const r = canvas.getBoundingClientRect();
    mouse.x = e.clientX - r.left; mouse.y = e.clientY - r.top; mouse.active = true;
  });
  canvas.addEventListener("pointerleave", () => { mouse.active = false; mouse.x = -9999; });
  // click drops a new weight
  canvas.addEventListener("pointerdown", (e) => {
    if (reduce) return;
    const r = canvas.getBoundingClientRect();
    const rr = 16 + Math.random() * 50;
    bodies.push({ x: e.clientX - r.left, y: e.clientY - r.top, vx: 0, vy: -2, r: rr, m: rr * rr, label: LABELS[(Math.random() * LABELS.length) | 0], rot: 0, a: Math.random() * 6, signal: Math.random() < 0.1 });
    if (bodies.length > 44) bodies.shift();
  });

  // live readout: total mass in the room
  const readout = document.querySelector("[data-mass-readout]");
  if (readout) {
    setInterval(() => {
      const total = bodies.reduce((s, b) => s + b.r, 0);
      readout.textContent = (total * 1.7).toFixed(0) + " g";
    }, 120);
  }

  init();
})();

/* ---- render the featured rail from the catalogue ---- */
(function () {
  const rail = document.querySelector("[data-featured-rail]");
  if (!rail) return;
  const items = OUNCE.PRODUCTS.filter((p) => p.featured).slice(0, 4);
  rail.innerHTML = items.map((p) => cardHTML(p)).join("");
})();

function cardHTML(p) {
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
