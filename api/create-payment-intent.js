const { getStripe, getRatelimit, clientIp } = require("./_lib/clients");
const { priceCart } = require("./_lib/products");

module.exports = async (req, res) => {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  try {
    const ip = clientIp(req);
    const { success } = await getRatelimit().limit(ip);
    if (!success) {
      res.status(429).json({ error: "Too many requests. Please wait a moment and try again." });
      return;
    }
  } catch (e) {
    console.error("[create-payment-intent] rate limit check failed", e);
    // Fail open on infra hiccups rather than blocking every checkout.
  }

  try {
    const { items, email, firstName } = req.body || {};
    if (!email || typeof email !== "string" || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
      res.status(400).json({ error: "A valid email is required." });
      return;
    }

    const { subtotal, shipping, tax, total } = priceCart(items);
    if (total <= 0) {
      res.status(400).json({ error: "Order total must be greater than zero." });
      return;
    }

    const stripe = getStripe();
    const intent = await stripe.paymentIntents.create({
      amount: Math.round(total * 100), // cents
      currency: "usd",
      capture_method: "manual", // authorize now, capture later once reviewed
      payment_method_types: ["card"], // only card supports manual capture reliably; the checkout UI only offers card today
      receipt_email: email,
      metadata: {
        cart: JSON.stringify(items.map(it => ({ id: it.productId, c: it.colorId, s: it.sizeId, q: it.qty }))),
        subtotal: String(subtotal),
        shipping: String(shipping),
        tax: String(tax),
        firstName: typeof firstName === "string" ? firstName.slice(0, 60) : "",
      },
    });

    res.status(200).json({
      clientSecret: intent.client_secret,
      paymentIntentId: intent.id,
      subtotal, shipping, tax, total,
    });
  } catch (e) {
    console.error("[create-payment-intent] error", e);
    res.status(400).json({ error: e.message || "Could not start payment." });
  }
};
