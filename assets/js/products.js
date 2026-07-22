/* ============================================================
   OUNCE — catalogue + brand marks + generative garment artwork
   ------------------------------------------------------------
   6 garments × 3 weights = 18 products. Each product ships in
   3 colourways (Black / Grey / White), chosen on the product
   page. Artwork is generated as clean technical "flats" in the
   selected colour, stamped with the ounce logo — so the store
   is complete with zero photography. Drop in real photos any
   time via a product's `images: {Black:[...],Grey:[...]}` map.
   ============================================================ */

const CURRENCY = { code: "GBP", symbol: "£" };

/* -------- colourways -------- */
const COLORS = {
  Black: { garment: "#1c1c1a", seam: "#000000", swatch: "#1c1c1a" },
  Grey:  { garment: "#9d9d97", seam: "#6f6f69", swatch: "#9d9d97" },
  White: { garment: "#F4F2EB", seam: "#CBC5B7", swatch: "#EFEDE6" },
};
const COLORWAYS = ["Black", "Grey", "White"];

/* -------- product factory -------- */
const APPAREL_SIZES = [["XS", true], ["S", true], ["M", true], ["L", true], ["XL", true], ["XXL", true]];
const OS = [["OS", true]];

function P(o) { return Object.assign({ colors: COLORWAYS, sizes: APPAREL_SIZES, madeIn: "Portugal" }, o); }

const PRODUCTS = [
  /* ---------- T-SHIRTS ---------- */
  P({ id: "tee-light", code: "OZ·T1", name: "Lightweight Tee", category: "T-Shirts", garment: "tee", tier: "Light",
    price: 45, mass: 165, fabric: "180gsm combed organic cotton jersey", fit: "Regular, ribbed crew",
    desc: "The everyday layer. A fine 180gsm jersey with enough body to hold its line but light enough for summer. Cut regular, ribbed at the collar." , drop: 2 }),
  P({ id: "tee-mid", code: "OZ·T2", name: "Midweight Tee", category: "T-Shirts", garment: "tee", tier: "Mid",
    price: 55, mass: 220, fabric: "240gsm compact cotton jersey", fit: "Regular, structured collar",
    desc: "The one you'll reach for. A dense 240gsm knit with a collar that survives the machine and a hand that softens without thinning.", featured: true, drop: 1 }),
  P({ id: "tee-heavy", code: "OZ·T3", name: "Heavyweight Tee", category: "T-Shirts", garment: "tee", tier: "Heavy",
    price: 65, mass: 300, fabric: "300gsm loopback-backed cotton", fit: "Boxy, wide collar",
    desc: "A tee with real mass. 300gsm, boxy through the body, built to stand on its own and outlast the drawer it lives in.", featured: true, drop: 1 }),

  /* ---------- HOODIES ---------- */
  P({ id: "hoodie-light", code: "OZ·H1", name: "Lightweight Hoodie", category: "Hoodies", garment: "hoodie", tier: "Light",
    price: 110, mass: 480, fabric: "340gsm brushed loopback cotton", fit: "Regular, lined hood",
    desc: "A hood for the in-between days. 340gsm brushed-back cotton, soft from the first wear, cut clean with a lined two-piece hood.", drop: 2 }),
  P({ id: "hoodie-mid", code: "OZ·H2", name: "Midweight Hoodie", category: "Hoodies", garment: "hoodie", tier: "Mid",
    price: 130, mass: 620, fabric: "440gsm loopback cotton", fit: "Boxy, dropped shoulder",
    desc: "The middle weight that does the most work. 440gsm loopback, boxy with a dropped shoulder, a hood that actually holds its shape.", featured: true, drop: 1 }),
  P({ id: "hoodie-heavy", code: "OZ·H3", name: "Heavyweight Hoodie", category: "Hoodies", garment: "hoodie", tier: "Heavy",
    price: 150, mass: 780, fabric: "500gsm brushed-back loopback cotton", fit: "Boxy, dropped shoulder",
    desc: "The anchor of the line. 500gsm, heavy enough to hold its shape and soften over years, not washes. Blank on purpose.", featured: true, drop: 1 }),

  /* ---------- SWEATPANTS ---------- */
  P({ id: "pant-light", code: "OZ·P1", name: "Lightweight Sweatpant", category: "Sweatpants", garment: "pant", tier: "Light",
    price: 95, mass: 420, fabric: "340gsm brushed loopback cotton", fit: "Tapered, elastic cuff",
    desc: "Cut to match the light hood. 340gsm brushed cotton, tapered leg, a drawcord you can actually cinch and a cuff that stays put.", drop: 2 }),
  P({ id: "pant-mid", code: "OZ·P2", name: "Midweight Sweatpant", category: "Sweatpants", garment: "pant", tier: "Mid",
    price: 115, mass: 540, fabric: "440gsm loopback cotton", fit: "Straight, elastic cuff",
    desc: "The everyday sweat. 440gsm loopback, a straighter leg with weight to it, seams flat to the skin.", drop: 1 }),
  P({ id: "pant-heavy", code: "OZ·P3", name: "Heavyweight Sweatpant", category: "Sweatpants", garment: "pant", tier: "Heavy",
    price: 135, mass: 680, fabric: "500gsm brushed-back loopback cotton", fit: "Relaxed, elastic cuff",
    desc: "Sunday weight. 500gsm to match the heavy hood — relaxed through the thigh, cuffed at the ankle, made to be lived in.", featured: true, drop: 1 }),

  /* ---------- SWEATSHORTS ---------- */
  P({ id: "short-light", code: "OZ·S1", name: "Lightweight Sweatshort", category: "Shorts", garment: "short", tier: "Light",
    price: 70, mass: 260, fabric: "340gsm brushed loopback cotton", fit: "7\" inseam, elastic waist",
    desc: "The lightest way to wear the weight. 340gsm brushed cotton, a clean 7-inch short with an elastic waist and hidden drawcord.", drop: 2 }),
  P({ id: "short-mid", code: "OZ·S2", name: "Midweight Sweatshort", category: "Shorts", garment: "short", tier: "Mid",
    price: 85, mass: 340, fabric: "440gsm loopback cotton", fit: "8\" inseam, elastic waist",
    desc: "The match to the mid sweat. 440gsm loopback, an 8-inch inseam that breaks once, deep side pockets.", featured: true, drop: 1 }),
  P({ id: "short-heavy", code: "OZ·S3", name: "Heavyweight Sweatshort", category: "Shorts", garment: "short", tier: "Heavy",
    price: 100, mass: 430, fabric: "500gsm brushed-back loopback cotton", fit: "9\" inseam, elastic waist",
    desc: "Shorts with heft. 500gsm to sit heavy and drape clean, a longer 9-inch cut, ribbed waistband.", drop: 1 }),

  /* ---------- FISHERMAN BEANIES ---------- */
  P({ id: "beanie-light", code: "OZ·B1", name: "Lightweight Fisherman Beanie", category: "Beanies", garment: "beanie", tier: "Light",
    price: 40, mass: 80, fabric: "Fine-gauge extrafine merino", fit: "Short roll, mid-depth", sizes: OS, madeIn: "Italy",
    desc: "A fine-knit fisherman in extrafine merino. A short roll that sits above the ear, no slouch, no bulk.", drop: 3 }),
  P({ id: "beanie-mid", code: "OZ·B2", name: "Midweight Fisherman Beanie", category: "Beanies", garment: "beanie", tier: "Mid",
    price: 45, mass: 110, fabric: "Mid-gauge lambswool", fit: "Classic roll, mid-depth", sizes: OS, madeIn: "Scotland",
    desc: "The everyday roll. Mid-gauge lambswool with a defined cuff and an embroidered ounce mark at the fold.", featured: true, drop: 1 }),
  P({ id: "beanie-heavy", code: "OZ·B3", name: "Heavyweight Fisherman Beanie", category: "Beanies", garment: "beanie", tier: "Heavy",
    price: 50, mass: 150, fabric: "Chunky-gauge wool", fit: "Deep roll, high crown", sizes: OS, madeIn: "Scotland",
    desc: "The winter weight. Chunky wool with a deep roll that pulls down over the ears and holds its shape all season.", drop: 1 }),

  /* ---------- DAD CAPS ---------- */
  P({ id: "cap-light", code: "OZ·C1", name: "Lightweight Dad Cap", category: "Caps", garment: "cap", tier: "Light",
    price: 40, mass: 90, fabric: "Washed lightweight twill", fit: "6-panel, curved brim", sizes: OS,
    desc: "A soft, sun-faded twill six-panel. Unstructured crown, curved brim, an ounce mark embroidered low on the front.", drop: 3 }),
  P({ id: "cap-mid", code: "OZ·C2", name: "Midweight Dad Cap", category: "Caps", garment: "cap", tier: "Mid",
    price: 45, mass: 120, fabric: "Brushed cotton twill", fit: "6-panel, curved brim", sizes: OS,
    desc: "The everyday cap. Brushed cotton with a little more body, a metal buckle strap and a clean tonal ounce mark.", featured: true, drop: 1 }),
  P({ id: "cap-heavy", code: "OZ·C3", name: "Heavyweight Dad Cap", category: "Caps", garment: "cap", tier: "Heavy",
    price: 50, mass: 150, fabric: "Heavy cotton canvas", fit: "6-panel, curved brim", sizes: OS,
    desc: "A cap with structure. Heavy canvas that breaks in over time, a flat curved brim and a woven ounce label at the back.", drop: 1 }),
];

/* ============================================================
   BRAND MARKS — the ounce logo, as reusable SVG fragments
   ============================================================ */

/* the coin: a weight/token carrying the oz unit */
function ounceCoin(cx, cy, r, stroke, ink) {
  return `<g><circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="${stroke}" stroke-width="${Math.max(1.5, r * 0.09)}"/>` +
    `<text x="${cx}" y="${cy + r * 0.34}" text-anchor="middle" font-family="ui-monospace, Menlo, monospace" font-size="${r * 0.86}" fill="${ink}">oz</text></g>`;
}

/* the wordmark: ounce, tight Helvetica, with an oz tick */
function ounceWordmark(x, y, h, fill, accent) {
  return `<text x="${x}" y="${y}" font-family="Helvetica, Arial, sans-serif" font-weight="700" font-size="${h}" letter-spacing="${-h * 0.045}" fill="${fill}">ounce` +
    `<tspan font-family="ui-monospace, monospace" font-weight="400" font-size="${h * 0.38}" dy="${-h * 0.42}" fill="${accent || fill}"> oz</tspan></text>`;
}

/* a small woven brand tab sewn to a garment */
function ounceTab(x, y, w, ink) {
  const hgt = w * 0.34;
  return `<g><rect x="${x}" y="${y}" width="${w}" height="${hgt}" rx="2" fill="${ink}"/>` +
    `<text x="${x + w / 2}" y="${y + hgt * 0.7}" text-anchor="middle" font-family="Helvetica, Arial, sans-serif" font-weight="700" font-size="${hgt * 0.62}" letter-spacing="-0.5" fill="${ink === '#E8451F' ? '#fff' : (ink === '#1c1c1a' ? '#EDEBE4' : '#1c1c1a')}">ounce</text></g>`;
}

/* ============================================================
   GENERATIVE GARMENT FLATS
   ounceArt(product, view, { color })  → SVG string
   view 0 = front, 1 = back, 2 = folded/detail
   ============================================================ */

function ounceArt(p, view = 0, opts = {}) {
  const W = 800, H = 1000;
  const colorName = opts.color || p.colors[0];
  const col = COLORS[colorName] || COLORS.Black;
  const g = col.garment, seam = col.seam;
  const isLight = colorName === "White";
  // contrast tone for logos against the garment
  const logoInk = isLight || colorName === "Grey" ? "#1c1c1a" : "#EDEBE4";
  const bg1 = "#EFEDE7", bg2 = "#E3E0D8"; // studio paper, no gradient refs (data-URI safe)
  const shadow = "rgba(20,20,18,0.10)";

  let body = drawGarment(p.garment, view, { g, seam, logoInk, isLight, accent: "#E8451F" });

  // header marks: code + weight (kept subtle, catalogue style)
  const head = `<text x="52" y="60" font-family="ui-monospace, Menlo, monospace" font-size="19" letter-spacing="1.5" fill="#8a877f">${p.code}</text>` +
    `<text x="${W - 52}" y="60" text-anchor="end" font-family="ui-monospace, Menlo, monospace" font-size="19" fill="#E8451F">${p.mass}<tspan font-size="12" fill="#8a877f"> G</tspan></text>` +
    `<text x="52" y="${H - 42}" font-family="ui-monospace, Menlo, monospace" font-size="15" letter-spacing="1" fill="#8a877f">${colorName.toUpperCase()}</text>` +
    ounceWordmark(W - 210, H - 34, 34, "#1c1c1a", "#E8451F");

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" role="img" aria-label="${p.name} — ${colorName}">` +
    `<rect width="${W}" height="${H}" fill="${bg1}"/>` +
    `<rect y="${H * 0.52}" width="${W}" height="${H * 0.48}" fill="${bg2}"/>` +
    `<ellipse cx="400" cy="880" rx="250" ry="26" fill="${shadow}"/>` +
    body + head + `</svg>`;
}

/* individual garment silhouettes (flats) */
function drawGarment(kind, view, s) {
  const { g, seam, logoInk, isLight, accent } = s;
  const sw = isLight ? 2 : 1.4;             // outline weight (whites need it)
  const stroke = `stroke="${seam}" stroke-width="${sw}"`;
  const seamLine = `stroke="${seam}" stroke-width="1" opacity="0.5" fill="none"`;
  const fill = `fill="${g}"`;

  if (kind === "tee") {
    const neck = view === 1
      ? `<path d="M338 250 Q400 286 462 250" ${seamLine}/>`                       // back collar
      : `<path d="M330 258 Q400 322 470 258" fill="none" stroke="${seam}" stroke-width="${sw}"/>`;
    return `<g>
      <path d="M310 300 L214 336 L250 470 L300 452 L300 772 Q300 802 330 802 L470 802 Q500 802 500 772 L500 452 L550 470 L586 336 L490 300 C470 258 436 246 400 246 C364 246 330 258 310 300 Z" ${fill} ${stroke} stroke-linejoin="round"/>
      ${neck}
      <path d="M300 452 L262 466 M500 452 L538 466" ${seamLine}/>
      ${view === 0 ? ounceCoin(340, 430, 20, logoInk, logoInk) : ""}
      ${ounceTab(300, 762, 44, isLight ? "#1c1c1a" : "#E8451F")}
    </g>`;
  }

  if (kind === "hoodie") {
    const hoodInner = isLight ? "#e9e6dd" : "rgba(0,0,0,0.16)";
    return `<g>
      <path d="M300 360 L168 520 L226 596 L332 470 Z" ${fill} ${stroke} stroke-linejoin="round"/>
      <path d="M500 360 L632 520 L574 596 L468 470 Z" ${fill} ${stroke} stroke-linejoin="round"/>
      <path d="M188 548 L246 604 M612 548 L554 604" ${seamLine}/>
      <path d="M300 360 C300 180 500 180 500 360 L470 380 C470 288 330 288 330 380 Z" ${fill} ${stroke} stroke-linejoin="round"/>
      <path d="M330 376 Q400 416 470 376 L470 336 Q400 292 330 336 Z" fill="${hoodInner}"/>
      <path d="M282 366 L282 742 Q282 776 318 776 L482 776 Q518 776 518 742 L518 366 Q400 344 282 366 Z" ${fill} ${stroke} stroke-linejoin="round"/>
      <rect x="336" y="574" width="128" height="112" rx="14" ${fill} ${stroke}/>
      <path d="M336 608 L464 608" ${seamLine}/>
      <line x1="382" y1="338" x2="382" y2="392" ${stroke}/><line x1="418" y1="338" x2="418" y2="392" ${stroke}/>
      <circle cx="382" cy="394" r="5" fill="${logoInk}"/><circle cx="418" cy="394" r="5" fill="${logoInk}"/>
      <path d="M282 752 L518 752" ${seamLine}/>
      ${view === 0 ? ounceCoin(360, 470, 20, logoInk, logoInk) : ""}
      ${ounceTab(306, 730, 46, isLight ? "#1c1c1a" : "#E8451F")}
    </g>`;
  }

  if (kind === "pant") {
    return `<g>
      <rect x="286" y="220" width="228" height="52" rx="10" ${fill} ${stroke}/>
      <path d="M286 264 L300 820 Q300 842 330 842 L376 842 Q396 842 398 820 L406 470 L410 470 L418 820 Q420 842 442 842 L490 842 Q514 842 514 820 L514 264 Z" ${fill} ${stroke} stroke-linejoin="round"/>
      <line x1="408" y1="272" x2="408" y2="470" ${seamLine}/>
      <path d="M300 812 Q360 826 398 812 M418 812 Q456 826 514 812" ${seamLine}/>
      <path d="M330 244 Q345 262 360 244" fill="none" stroke="${logoInk}" stroke-width="3"/>
      ${ounceCoin(474, 320, 18, logoInk, logoInk)}
      ${ounceTab(300, 300, 42, isLight ? "#1c1c1a" : "#E8451F")}
    </g>`;
  }

  if (kind === "short") {
    return `<g>
      <rect x="286" y="300" width="228" height="52" rx="10" ${fill} ${stroke}/>
      <path d="M286 344 L296 610 Q296 632 326 632 L378 632 Q398 632 400 610 L406 500 L410 500 L416 610 Q418 632 440 632 L494 632 Q516 632 516 610 L514 344 Z" ${fill} ${stroke} stroke-linejoin="round"/>
      <line x1="408" y1="352" x2="408" y2="500" ${seamLine}/>
      <path d="M296 604 Q356 618 400 604 M416 604 Q460 618 516 604" ${seamLine}/>
      <path d="M330 324 Q345 342 360 324" fill="none" stroke="${logoInk}" stroke-width="3"/>
      ${ounceCoin(474, 396, 18, logoInk, logoInk)}
      ${ounceTab(300, 384, 42, isLight ? "#1c1c1a" : "#E8451F")}
    </g>`;
  }

  if (kind === "beanie") {
    return `<g>
      <path d="M276 560 Q276 300 400 300 Q524 300 524 560 Z" ${fill} ${stroke} stroke-linejoin="round"/>
      <g stroke="${seam}" stroke-width="1.2" opacity="0.45">
        <path d="M320 320 Q320 480 320 560" fill="none"/><path d="M360 306 Q360 470 360 560" fill="none"/>
        <path d="M400 302 L400 560" fill="none"/><path d="M440 306 Q440 470 440 560" fill="none"/>
        <path d="M480 320 Q480 480 480 560" fill="none"/>
      </g>
      <rect x="262" y="556" width="276" height="86" rx="14" ${fill} ${stroke}/>
      <g stroke="${seam}" stroke-width="1" opacity="0.4"><line x1="262" y1="580" x2="538" y2="580"/><line x1="262" y1="618" x2="538" y2="618"/></g>
      ${ounceWordmark(338, 610, 30, logoInk, isLight ? "#1c1c1a" : accent)}
    </g>`;
  }

  if (kind === "cap") {
    return `<g>
      <path d="M250 470 Q250 300 400 300 Q550 300 550 470 Q400 452 250 470 Z" ${fill} ${stroke} stroke-linejoin="round"/>
      <path d="M250 470 Q400 452 550 470 Q640 486 650 548 Q640 566 560 556 Q400 520 250 512 Q220 500 250 470 Z" ${fill} ${stroke} stroke-linejoin="round"/>
      <g stroke="${seam}" stroke-width="1.2" opacity="0.4" fill="none"><path d="M400 302 L400 470"/><path d="M330 312 Q360 400 372 462"/><path d="M470 312 Q440 400 428 462"/></g>
      <circle cx="400" cy="306" r="7" fill="${logoInk}"/>
      ${ounceWordmark(330, 424, 30, logoInk, isLight ? "#1c1c1a" : accent)}
    </g>`;
  }

  return "";
}

/* -------- helpers -------- */
function artURI(p, view = 0, opts) { return "data:image/svg+xml;charset=utf-8," + encodeURIComponent(ounceArt(p, view, opts)); }
function colorSwatch(name) { return (COLORS[name] || COLORS.Black).swatch; }
function money(n) { return CURRENCY.symbol + n.toFixed(0); }
function getProduct(id) { return PRODUCTS.find((p) => p.id === id); }

if (typeof window !== "undefined") {
  window.OUNCE = { PRODUCTS, CURRENCY, COLORS, COLORWAYS, ounceArt, artURI, colorSwatch, money, getProduct, ounceWordmark, ounceCoin };
}
