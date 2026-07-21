/* ============================================================
   OUNCE — catalogue + generative artwork
   ------------------------------------------------------------
   Product imagery is generated as abstract, on-brand SVG so the
   store is 100% self-contained and looks intentional out of the
   box. To use real photography instead, give a product an
   `images: ['/assets/img/oz-01-front.jpg', ...]` array — the
   store will use those and ignore the generated art.
   ============================================================ */

const CURRENCY = { code: "GBP", symbol: "£" };

const PRODUCTS = [
  {
    id: "oz-01", code: "OZ—01", name: "Heavyweight Hoodie", category: "outerwear",
    price: 180, mass: 620, colorway: "Bone",
    fabric: "480gsm brushed-back loopback cotton", madeIn: "Portugal",
    fit: "Boxy, dropped shoulder",
    palette: ["#E5E2DA", "#141412", "#C9C5BA"],
    sizes: [["XS", true], ["S", true], ["M", true], ["L", true], ["XL", true], ["XXL", false]],
    desc: "The anchor of the line. A single-weight hood cut heavy enough to hold its shape and soften over years, not washes. Blank on purpose.",
    featured: true, drop: 1,
  },
  {
    id: "oz-02", code: "OZ—02", name: "14oz Selvedge Denim", category: "bottoms",
    price: 240, mass: 890, colorway: "Raw Indigo",
    fabric: "14oz unsanforized selvedge, Kaihara mill", madeIn: "Japan",
    fit: "Straight, mid-rise",
    palette: ["#20303F", "#0B1620", "#3C5266"],
    sizes: [["28", true], ["30", true], ["32", true], ["34", true], ["36", true], ["38", true]],
    desc: "Loomed narrow, hemmed clean. Sold rigid — it belongs to whoever wears it in. Expect fades at the ounce it was named for.",
    featured: true, drop: 1,
  },
  {
    id: "oz-03", code: "OZ—03", name: "Gram Tee", category: "tops",
    price: 65, mass: 180, colorway: "Chalk",
    fabric: "220gsm compact organic jersey", madeIn: "Portugal",
    fit: "Regular, structured collar",
    palette: ["#EFEDE6", "#141412", "#D8D4C9"],
    sizes: [["XS", true], ["S", true], ["M", true], ["L", true], ["XL", true], ["XXL", true]],
    desc: "Every gram accounted for. A dense-knit blank with a collar that survives the machine. Buy three.",
    featured: false, drop: 2,
  },
  {
    id: "oz-04", code: "OZ—04", name: "Featherweight Shell", category: "outerwear",
    price: 320, mass: 240, colorway: "Storm",
    fabric: "3-layer recycled ripstop, 10k/10k", madeIn: "Vietnam",
    fit: "Relaxed, articulated",
    palette: ["#5C6066", "#20232A", "#878C93"],
    sizes: [["S", true], ["M", true], ["L", true], ["XL", false]],
    desc: "Two-hundred-forty grams of weather between you and the day. Taped seams, no branding, a hood that actually works.",
    featured: true, drop: 1,
  },
  {
    id: "oz-05", code: "OZ—05", name: "Ballast Cargo", category: "bottoms",
    price: 210, mass: 540, colorway: "Field Olive",
    fabric: "Garment-dyed cotton ripstop", madeIn: "Portugal",
    fit: "Wide, cropped ankle",
    palette: ["#4A4A38", "#23241B", "#6E6E55"],
    sizes: [["28", true], ["30", true], ["32", true], ["34", true], ["36", false]],
    desc: "Weight where you want it. Deep bellows pockets, a hem that breaks once. Dyed after the fact so no two settle the same.",
    featured: false, drop: 2,
  },
  {
    id: "oz-06", code: "OZ—06", name: "Counterweight Knit", category: "knitwear",
    price: 195, mass: 480, colorway: "Oat",
    fabric: "7-gauge lambswool, fully fashioned", madeIn: "Scotland",
    fit: "Regular, high crew",
    palette: ["#D6CDB8", "#3A3428", "#B6AA8E"],
    sizes: [["S", true], ["M", true], ["L", true], ["XL", true]],
    desc: "Spun to balance the hood. A dense crew with saddle shoulders and a collar that stands on its own.",
    featured: true, drop: 1,
  },
  {
    id: "oz-07", code: "OZ—07", name: "Troy Beanie", category: "accessories",
    price: 55, mass: 90, colorway: "Ink",
    fabric: "Extrafine merino rib", madeIn: "Italy",
    fit: "Cuffed, mid-depth",
    palette: ["#16171A", "#050506", "#33353B"],
    sizes: [["OS", true]],
    desc: "Measured in troy, like the things worth keeping. A fine-gauge cuff that sits without slouch.",
    featured: false, drop: 3,
  },
  {
    id: "oz-08", code: "OZ—08", name: "Density Overshirt", category: "outerwear",
    price: 230, mass: 610, colorway: "Slate",
    fabric: "Double-face brushed wool-cotton", madeIn: "Portugal",
    fit: "Boxy, shirt-jacket",
    palette: ["#575A5E", "#25272A", "#7C7F84"],
    sizes: [["S", true], ["M", true], ["L", true], ["XL", true], ["XXL", false]],
    desc: "The in-between layer with real mass. Snaps hidden under a placket, a chest pocket sized for nothing in particular.",
    featured: true, drop: 2,
  },
  {
    id: "oz-09", code: "OZ—09", name: "Null Socks", category: "accessories",
    price: 22, mass: 40, colorway: "Bone / Ink",
    fabric: "Combed cotton terry, 2-pack", madeIn: "Portugal",
    fit: "Crew, cushioned sole",
    palette: ["#E5E2DA", "#141412", "#B7B3A8"],
    sizes: [["OS", true]],
    desc: "The lightest thing we make. Ribbed cuff, terry footbed, a tone-on-tone stripe you'll only notice up close.",
    featured: false, drop: 3,
  },
  {
    id: "oz-10", code: "OZ—10", name: "Standard Sweatpant", category: "bottoms",
    price: 150, mass: 500, colorway: "Bone",
    fabric: "480gsm loopback cotton", madeIn: "Portugal",
    fit: "Tapered, elastic hem",
    palette: ["#E5E2DA", "#141412", "#C9C5BA"],
    sizes: [["XS", true], ["S", true], ["M", true], ["L", true], ["XL", true], ["XXL", true]],
    desc: "Cut from the same cloth as the hood. A tapered pant with a drawcord you can actually cinch and a hem that stays put.",
    featured: false, drop: 2,
  },
];

/* -------- deterministic pseudo-random (seeded) -------- */
function seeded(seedStr) {
  let h = 1779033703 ^ seedStr.length;
  for (let i = 0; i < seedStr.length; i++) {
    h = Math.imul(h ^ seedStr.charCodeAt(i), 3432918353);
    h = (h << 13) | (h >>> 19);
  }
  return function () {
    h = Math.imul(h ^ (h >>> 16), 2246822507);
    h = Math.imul(h ^ (h >>> 13), 3266489909);
    h ^= h >>> 16;
    return (h >>> 0) / 4294967296;
  };
}

/* -------- generative artwork ---------------------------
   Returns an SVG string. `variant` 0 = primary, 1 = alt.
   Compositions vary by category but share a language:
   paper ground, one mass, structural lines, an oz mark.  */
function ounceArt(p, variant = 0, opts = {}) {
  const rnd = seeded(p.id + ":" + variant);
  const w = 800, h = 1000;
  const [c1, c2, c3] = p.palette;
  const light = mixHex(c1, "#ffffff", 0.4);

  // NOTE: no <defs>/gradient/filter — internal url(#id) refs don't
  // resolve when an SVG is loaded as a data: URI inside <img>. We use
  // solid fills only; page-wide film grain is handled globally in CSS.
  const ground = mixHex(light, c1, 0.5);
  const hi = mixHex(light, "#ffffff", 0.5);

  let body = "";
  const cat = p.category;

  if (cat === "outerwear" || cat === "knitwear") {
    // a large soft garment mass, offset; a heavy circle = the weight
    const ox = 150 + rnd() * 80, oy = 200 + rnd() * 60;
    const bw = 500, bh = 620;
    body += `<rect x="${ox}" y="${oy}" width="${bw}" height="${bh}" rx="34" fill="${c2}" opacity="0.92"/>`;
    body += `<rect x="${ox + 46}" y="${oy + 40}" width="${bw - 92}" height="${bh - 80}" rx="20" fill="none" stroke="${light}" stroke-width="1.5" opacity="0.35"/>`;
    // sleeve/negative marks
    body += `<rect x="${ox - 70}" y="${oy + 30}" width="90" height="300" rx="30" fill="${c2}" opacity="0.7"/>`;
    body += `<rect x="${ox + bw - 20}" y="${oy + 30}" width="90" height="300" rx="30" fill="${c2}" opacity="0.7"/>`;
    const r = 60 + rnd() * 30;
    body += `<circle cx="${ox + bw - 40}" cy="${oy + bh - 40}" r="${r}" fill="${c3}"/>`;
  } else if (cat === "bottoms") {
    const ox = 250 + rnd() * 40, oy = 120;
    body += `<rect x="${ox}" y="${oy}" width="150" height="720" rx="24" fill="${c2}" opacity="0.92"/>`;
    body += `<rect x="${ox + 160}" y="${oy}" width="150" height="720" rx="24" fill="${c2}" opacity="0.82"/>`;
    body += `<line x1="${ox + 155}" y1="${oy}" x2="${ox + 155}" y2="${oy + 720}" stroke="${light}" stroke-width="1.5" opacity="0.4"/>`;
    body += `<circle cx="${ox + 155}" cy="${oy + 620}" r="72" fill="${c3}"/>`;
  } else {
    // accessories / tops: a centered stack + big weight
    const cx = 400, cy = 500;
    if (cat === "tops") {
      body += `<rect x="200" y="240" width="400" height="480" rx="26" fill="${c2}" opacity="0.92"/>`;
      body += `<rect x="150" y="270" width="80" height="200" rx="26" fill="${c2}" opacity="0.7"/>`;
      body += `<rect x="570" y="270" width="80" height="200" rx="26" fill="${c2}" opacity="0.7"/>`;
      body += `<circle cx="400" cy="300" r="60" fill="${ground}"/>`; // collar hole
    } else {
      for (let i = 0; i < 3; i++) {
        const yy = 340 + i * 120, ww = 360 - i * 40;
        body += `<rect x="${cx - ww / 2}" y="${yy}" width="${ww}" height="86" rx="43" fill="${c2}" opacity="${0.9 - i * 0.15}"/>`;
      }
    }
    body += `<circle cx="${cx + 150}" cy="${cy + 210}" r="80" fill="${c3}"/>`;
  }

  // structural registration lines
  body += `<g opacity="0.5" stroke="${c2}" stroke-width="1">
    <line x1="60" y1="0" x2="60" y2="${h}"/><line x1="${w - 60}" y1="0" x2="${w - 60}" y2="${h}"/>
    <line x1="0" y1="${h - 60}" x2="${w}" y2="${h - 60}"/></g>`;

  // typographic marks
  const label = opts.label !== false;
  let type = "";
  if (label) {
    type = `
    <text x="60" y="66" font-family="ui-monospace, Menlo, monospace" font-size="20" letter-spacing="2" fill="${c2}">${p.code}</text>
    <text x="${w - 60}" y="66" text-anchor="end" font-family="ui-monospace, Menlo, monospace" font-size="20" fill="${p.category === 'outerwear' ? '#E8451F' : c2}">${p.mass}<tspan font-size="12">G</tspan></text>
    <text x="60" y="${h - 24}" font-family="Helvetica, Arial, sans-serif" font-weight="700" font-size="44" letter-spacing="-2" fill="${c2}">ounce<tspan font-family="ui-monospace, monospace" font-size="16" dy="-18" fill="#E8451F"> oz</tspan></text>`;
  }

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" role="img" aria-label="${p.name}">
    <rect width="${w}" height="${h}" fill="${ground}"/>
    <rect width="${w}" height="${h * 0.55}" fill="${hi}" opacity="0.6"/>
    ${body}
    ${type}
  </svg>`;
}

function mixHex(a, b, t) {
  const pa = hx(a), pb = hx(b);
  const c = pa.map((v, i) => Math.round(v + (pb[i] - v) * t));
  return "#" + c.map((v) => v.toString(16).padStart(2, "0")).join("");
}
function hx(s) { s = s.replace("#", ""); return [0, 2, 4].map((i) => parseInt(s.slice(i, i + 2), 16)); }

/* svg string -> data URI (for <img src>) */
function artURI(p, variant = 0, opts) {
  return "data:image/svg+xml;charset=utf-8," + encodeURIComponent(ounceArt(p, variant, opts));
}

function money(n) { return CURRENCY.symbol + n.toFixed(0); }
function getProduct(id) { return PRODUCTS.find((p) => p.id === id); }

if (typeof window !== "undefined") {
  window.OUNCE = { PRODUCTS, CURRENCY, ounceArt, artURI, money, getProduct };
}
