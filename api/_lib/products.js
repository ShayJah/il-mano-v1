// Server-side view of the catalog. There is no second copy of prices to maintain:
// everything here is derived from data.js (the file the store owner edits), so the
// backend still recomputes totals itself and never trusts a price the browser sends.
const data = require("../../data.js");

const PRICES = {};
const NAMES = {};
const COLOR_NAMES = {};
const IMAGES = {};
for (const p of data.products) {
  PRICES[p.id] = p.price;
  NAMES[p.id] = p.name;
  COLOR_NAMES[p.id] = {};
  IMAGES[p.id] = {};
  for (const c of p.colors) {
    COLOR_NAMES[p.id][c.id] = c.name;
    IMAGES[p.id][c.id] = c.front;
  }
}

function priceCart(items) {
  if (!Array.isArray(items) || items.length === 0) {
    throw new Error("Cart is empty");
  }
  let subtotal = 0;
  for (const it of items) {
    const price = PRICES[it.productId];
    const qty = Number(it.qty);
    if (!price || !Number.isInteger(qty) || qty <= 0 || qty > 20) {
      throw new Error(`Invalid cart line for product "${it.productId}"`);
    }
    subtotal += price * qty;
  }
  return data.computeTotals(subtotal);
}

module.exports = { PRICES, NAMES, COLOR_NAMES, IMAGES, priceCart };
