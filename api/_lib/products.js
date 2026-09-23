// Server-side mirror of the prices in data.js. Kept separate (rather than requiring
// data.js, which is a browser IIFE that assigns to `window`) so the backend never
// trusts a price the client sends — it always recomputes the total from this table.
const PRICES = {
  "hoodie-classic": 100,
  "cap-trail": 55,
  "bag-duffle": 280,
};

const NAMES = {
  "hoodie-classic": "Classic Hoodie",
  "cap-trail": "Trail Cap",
  "bag-duffle": "Heritage Duffle",
};

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
  const shipping = subtotal > 250 || subtotal === 0 ? 0 : 12;
  const tax = Math.round(subtotal * 0.085);
  const total = subtotal + shipping + tax;
  return { subtotal, shipping, tax, total };
}

module.exports = { PRICES, NAMES, priceCart };
