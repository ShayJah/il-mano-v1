const { getStripe, getRedis } = require("./_lib/clients");
const { sendOrderConfirmation } = require("./_lib/email");

// Stripe needs the raw, unparsed request body to verify the webhook signature.
module.exports.config = { api: { bodyParser: false } };

function readRawBody(req) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    req.on("data", (c) => chunks.push(c));
    req.on("end", () => resolve(Buffer.concat(chunks)));
    req.on("error", reject);
  });
}

async function orderFromIntent(pi, { stripe, siteUrl }) {
  let card = null;
  if (pi.payment_method) {
    try {
      const pm = await stripe.paymentMethods.retrieve(pi.payment_method);
      if (pm.card) card = { brand: pm.card.brand, last4: pm.card.last4 };
    } catch (e) {
      console.error("[stripe-webhook] could not retrieve payment method", e.message);
    }
  }

  let shippingAddress = null;
  try {
    shippingAddress = pi.metadata?.shipAddr ? JSON.parse(pi.metadata.shipAddr) : null;
  } catch (e) { /* leave null if malformed */ }

  return {
    id: pi.id,
    status: "authorized",
    amount: pi.amount,
    currency: pi.currency,
    email: pi.receipt_email,
    firstName: pi.metadata?.firstName || "",
    cart: pi.metadata?.cart ? JSON.parse(pi.metadata.cart) : [],
    subtotal: Number(pi.metadata?.subtotal || 0),
    shipping: Number(pi.metadata?.shipping || 0),
    tax: Number(pi.metadata?.tax || 0),
    shippingAddress,
    card,
    siteUrl,
    createdAt: new Date().toISOString(),
  };
}

module.exports = async (req, res) => {
  if (req.method !== "POST") {
    res.status(405).end();
    return;
  }

  const stripe = getStripe();
  const sig = req.headers["stripe-signature"];
  let event;
  try {
    const rawBody = await readRawBody(req);
    event = stripe.webhooks.constructEvent(rawBody, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (e) {
    console.error("[stripe-webhook] signature verification failed", e.message);
    res.status(400).send(`Webhook Error: ${e.message}`);
    return;
  }

  const siteUrl = `https://${req.headers.host}`;
  let order = null;
  if (event.type === "payment_intent.amount_capturable_updated") {
    order = await orderFromIntent(event.data.object, { stripe, siteUrl });
    // Email first and independently of Redis, so a storage outage (or missing Upstash
    // config) never swallows the order notification.
    await sendOrderConfirmation(order);
  }

  try {
    const redis = getRedis();

    if (event.type === "payment_intent.amount_capturable_updated") {
      // Card authorized successfully — funds are held, not yet charged.
      await redis.set(`order:${order.id}`, order);
      await redis.lpush("orders:authorized", order.id);
    }

    if (event.type === "payment_intent.canceled" || event.type === "payment_intent.payment_failed") {
      const pi = event.data.object;
      const existing = await redis.get(`order:${pi.id}`);
      if (existing) {
        await redis.set(`order:${pi.id}`, { ...existing, status: event.type === "payment_intent.canceled" ? "canceled" : "failed" });
      }
    }

    if (event.type === "payment_intent.succeeded") {
      // Fired once the order is actually captured (charged) later via /api/capture-order.
      const pi = event.data.object;
      const existing = await redis.get(`order:${pi.id}`);
      if (existing) {
        await redis.set(`order:${pi.id}`, { ...existing, status: "captured", capturedAt: new Date().toISOString() });
      }
    }

    res.status(200).json({ received: true });
  } catch (e) {
    console.error("[stripe-webhook] handler error", e);
    // Still 200 so Stripe doesn't hammer retries for an internal storage hiccup on an
    // already-verified event; the order can be reconciled from the Stripe dashboard.
    res.status(200).json({ received: true, warning: "order storage failed" });
  }
};
