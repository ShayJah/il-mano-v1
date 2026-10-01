/* ════════════════════════════════════════════════════════════════════
   IL MANO — THE ONE FILE TO EDIT for products, prices, shipping & tax.
   See CLIENT-GUIDE.md for step-by-step instructions.

   This file is read by BOTH the website (browser) and the checkout server
   (api/_lib/products.js), so a price changed here is changed everywhere —
   storefront, cart, Stripe charge and confirmation email. After editing, run
   `npm run check` to catch typos before you push.
   ════════════════════════════════════════════════════════════════════ */
(function () {
  const A = "assets/";

  // ── Store settings ─────────────────────────────────────────────────
  const settings = {
    freeShippingOver: 250,   // subtotal ABOVE this ships free (dollars)
    flatShipping: 12,        // otherwise this flat rate (dollars)
    taxRate: 0.085,          // 8.5% — applied to the subtotal
  };

  // Cart maths shared by the cart drawer, checkout and the server (dollars in, dollars out).
  const computeTotals = (subtotal) => {
    const shipping = subtotal > settings.freeShippingOver || subtotal === 0 ? 0 : settings.flatShipping;
    const tax = Math.round(subtotal * settings.taxRate);
    return { subtotal, shipping, tax, total: subtotal + shipping + tax };
  };

  // ── Products ───────────────────────────────────────────────────────
  // To add one: copy a whole { ... } block below, change every field, then add
  // a matching line to `gridCards` further down so it shows on the home page.
  // Sizes: set soldOut: true to grey a size out.  Photos: drop files in /assets.
  // `cutout` (optional, per colour) = background-removed photo for the /clothing page.

  const products = [
    {
      id: "hoodie-classic",
      slug: "classic-hoodie",
      name: "Classic Hoodie",
      category: "Hoodies",
      categoryKey: "hoodies",
      price: 100,
      badge: "New",
      rating: 4.9,
      reviews: 128,
      description:
        "Inspired by the weathered textures of the American West and refined for the urban landscape. Crafted from premium 100% French Terry and finished with a specialized LA-dye process to achieve a soft, lived-in patina from the first wear. A rebellious take on luxury basics — built to age beautifully and endure the grind.",
      colors: [
        { id: "black",  name: "Vanta Black",      hex: "#0e0e0e", front: A + "hoodie-black-front.webp",  back: A + "hoodie-black-back.webp", cutout: A + "gallery/hoodie-black-front.webp" },
        { id: "white",  name: "Bone White",       hex: "#efeadd", front: A + "hoodie-white-front.webp",  back: A + "hoodie-white-back.webp"  },
        { id: "blue",   name: "Electric Blue", hex: "#1f3a8a", front: A + "hoodie-blue-front.webp",   back: A + "hoodie-blue-back.webp", cutout: A + "gallery/hoodie-blue-front.webp" },
        { id: "brown",  name: "Cabalo Brown",    hex: "#6b4a2b", front: A + "hoodie-brown-front.webp",  back: A + "hoodie-brown-back.webp", cutout: A + "gallery/hoodie-brown-front.webp" },
      ],
      defaultColor: "black",
      sizes: [
        { id: "xs", label: "XS", soldOut: true },
        { id: "s",  label: "S",  soldOut: false },
        { id: "m",  label: "M",  soldOut: false },
        { id: "l",  label: "L",  soldOut: false },
        { id: "xl", label: "XL", soldOut: false },
        { id: "xxl",label: "XXL", soldOut: false },
      ],
      specs: [
        { k: "Material", v: "100% French Terry Cotton, 420 GSM" },
        { k: "Origin",   v: "Manufactured & Dyed in Los Angeles, CA" },
        { k: "Fit",      v: "Relaxed / Unisex" },
        { k: "Detail",   v: "Embroidered ILMANO neck label, woven side seam tag" },
      ],
      care: "Wash inside out, cold. Tumble dry low. Do not bleach. Iron reverse, low.",
      delivery: "Complimentary worldwide shipping over $250. 14-day home trial with prepaid returns.",
    },
    {
      id: "cap-trail",
      slug: "trail-cap",
      name: "Trail Cap",
      category: "Hats",
      categoryKey: "hats",
      price: 55,
      badge: null,
      rating: 4.8,
      reviews: 64,
      description:
        "Six-panel structured trucker with a hand-finished cowhide patch debossed with the ILMANO mark. Snap back fits a wide range; perforated mesh keeps the back cool through the Mojave summer.",
      colors: [
        { id: "black", name: "Vanta Black",  hex: "#0e0e0e", front: A + "cap-black.webp", back: A + "cap-black.webp" },
        { id: "brown", name: "Cabalo Brown", hex: "#6b4a2b", front: A + "cap-brown.webp", back: A + "cap-brown.webp" },
        { id: "white", name: "Bone White",   hex: "#efeadd", front: A + "cap-white.webp", back: A + "cap-white.webp" },
      ],
      defaultColor: "black",
      sizes: [{ id: "os", label: "One Size", soldOut: false }],
      specs: [
        { k: "Material", v: "Brushed canvas crown, polyester mesh back" },
        { k: "Patch",    v: "Genuine cowhide, laser-debossed mark" },
        { k: "Origin",   v: "Cut, sewn & finished in Los Angeles, CA" },
        { k: "Closure",  v: "Brass snap-back, 7-position" },
      ],
      care: "Spot clean only. Reshape and air dry.",
      delivery: "Complimentary worldwide shipping over $250. 14-day home trial.",
    },
    {
      id: "bag-duffle",
      slug: "heritage-duffle",
      name: "Heritage Duffle",
      category: "Bags",
      categoryKey: "bags",
      price: 280,
      badge: "Limited",
      rating: 5.0,
      reviews: 22,
      description:
        "A weekender carved from full-grain saddle leather, finished with solid brass hardware that develops its own patina with travel. Internal canvas lining, debossed ILMANO patch, removable shoulder strap with luggage tag. Made for the long road.",
      colors: [
        { id: "saddle", name: "Saddle", hex: "#6b4a2b", front: A + "bag-duffle.png", back: A + "bag-duffle.png" },
      ],
      defaultColor: "saddle",
      sizes: [{ id: "os", label: "One Size", soldOut: false }],
      specs: [
        { k: "Material", v: "Full-grain saddle leather, brass hardware" },
        { k: "Dimensions", v: "52cm × 28cm × 26cm" },
        { k: "Origin", v: "Hand-finished in Los Angeles, CA" },
        { k: "Lining", v: "Heavy canvas, two interior pockets" },
      ],
      care: "Condition with neutral leather balm twice yearly. Keep dry; patina is the point.",
      delivery: "Complimentary worldwide shipping. 30-day return window on Limited pieces.",
    },
  ];

  // Build the grid: 9 cards from real product variants
  const gridCards = [
    { productId: "hoodie-classic", colorId: "black",  badge: "New" },
    { productId: "hoodie-classic", colorId: "white",  badge: null },
    { productId: "hoodie-classic", colorId: "blue",   badge: null },
    { productId: "hoodie-classic", colorId: "brown",  badge: "Hot" },
    { productId: "cap-trail",      colorId: "black",  badge: null },
    { productId: "cap-trail",      colorId: "brown",  badge: null },
    { productId: "cap-trail",      colorId: "white",  badge: null },
    { productId: "bag-duffle",     colorId: "saddle", badge: "Limited" },
    { productId: "hoodie-classic", colorId: "brown",  badge: "Bundle", overrideName: "The Field Set", overridePrice: 340, overrideImg: A + "lifestyle-bag-hoodie.png", overrideSub: "Hoodie + Duffle" },
  ];

  // `key` must match a product's categoryKey. The "N pieces" label is counted
  // automatically from the products above; set `count: "Bespoke"` to override it.
  const categoryDefs = [
    { num: "01", name: "Hoodies",  key: "hoodies",  img: A + "hoodie-black-back.webp",  size: "lg" },
    { num: "02", name: "T-Shirts", key: "t-shirts", img: A + "hoodie-white-front.webp", size: "md" },
    { num: "03", name: "Hats",     key: "hats",     img: A + "cap-brown.webp",          size: "sm" },
    { num: "04", name: "Bags",     key: "bags",     img: A + "bag-duffle.png",          size: "sm" },
    { num: "05", name: "Gallery",  key: "gallery",  img: A + "brand-tags.webp",         size: "sm", count: "Bespoke" },
  ];
  const categories = categoryDefs.map(c => {
    if (c.count) return c;
    const n = products.filter(p => p.categoryKey === c.key).length;
    return { ...c, count: n === 0 ? "Coming soon" : `${n} ${n === 1 ? "piece" : "pieces"}` };
  });

  const marqueeItems = [
    "Summer 2026",
    "Manufactured in Los Angeles",
    "Connect · Create · Inspire",
    "American Iconography",
    "Hand finished",
    "Made to Endure",
  ];

  const storyPillars = [
    { title: "Connect", body: "Every piece carries the imprint of the hand that made it. Wear it, and you carry the line back to the maker." },
    { title: "Create",  body: "Garments engineered like leather: tested by use, improved by wear. We make objects that earn their place in your closet." },
    { title: "Inspire", body: "American iconography, refined for the way you actually live. Bold archetypes, quiet finish." },
  ];

  // Responsive photos: returns {src, srcSet, sizes} for an <img> so phones fetch the small file.
  // Needs the resized copies made by `npm run images`; without them it falls back to the original.
  const IMAGES = (typeof window !== "undefined" ? window.IL_MANO_IMAGES : null) || {};
  const variant = (path, w) => {
    const m = IMAGES[path];
    if (!m) return path;
    const pick = m.widths.find(x => x >= w) || m.widths[m.widths.length - 1];
    return `assets/opt/${m.stem}-${pick}.webp`;
  };
  const imgAttrs = (path, sizes) => {
    const m = IMAGES[path];
    if (!m) return { src: path };
    return {
      src: variant(path, 900),
      srcSet: m.widths.map(w => `assets/opt/${m.stem}-${w}.webp ${w}w`).join(", "),
      sizes: sizes || "100vw",
      decoding: "async",
    };
  };

  const DATA = {
    settings, computeTotals, imgAttrs, imgSrc: variant,
    products, gridCards, categories, marqueeItems, storyPillars,
    findProduct: (id) => products.find(p => p.id === id),
  };

  // Browser: window.IL_MANO_DATA.  Node (checkout server / check script): module.exports.
  if (typeof module !== "undefined" && module.exports) module.exports = DATA;
  else window.IL_MANO_DATA = DATA;
})();
