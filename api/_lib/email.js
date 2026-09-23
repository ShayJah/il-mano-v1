const { getResend } = require("./clients");
const { NAMES } = require("./products");

const fmt = (cents) => "$" + (cents / 100).toFixed(2);

function orderConfirmationHtml(order) {
  const rows = order.cart.map(it => {
    const name = NAMES[it.id] || it.id;
    return `<tr>
      <td style="padding:8px 0;color:#0a0a0a;">${name} <span style="color:#8c8780;">× ${it.q}</span></td>
    </tr>`;
  }).join("");

  return `
  <div style="font-family:Helvetica,Arial,sans-serif;max-width:480px;margin:0 auto;padding:32px 24px;color:#0a0a0a;">
    <div style="font-size:20px;letter-spacing:0.14em;text-transform:uppercase;margin-bottom:24px;">IL MANO</div>
    <p style="font-size:15px;line-height:1.6;">Thanks for your order — your card has been authorized and your pieces are being reviewed before they ship from Los Angeles. This is a confirmation, not a charge notice; you'll be charged when your order is prepared for shipment.</p>
    <table style="width:100%;border-collapse:collapse;margin:24px 0;border-top:1px solid #e5e1d8;">
      ${rows}
    </table>
    <table style="width:100%;font-size:14px;color:#4a4640;">
      <tr><td>Subtotal</td><td style="text-align:right;">${fmt(order.subtotal * 100 || 0)}</td></tr>
      <tr><td>Shipping</td><td style="text-align:right;">${order.shipping ? fmt(order.shipping * 100) : "Free"}</td></tr>
      <tr><td>Tax</td><td style="text-align:right;">${fmt(order.tax * 100 || 0)}</td></tr>
      <tr style="font-weight:bold;color:#0a0a0a;"><td style="padding-top:8px;">Total</td><td style="text-align:right;padding-top:8px;">${fmt(order.amount)}</td></tr>
    </table>
    <p style="font-size:12px;color:#8c8780;margin-top:24px;">Order reference: ${order.id}<br/>Questions? Reply to this email or write hello@ilmano.com.</p>
  </div>`;
}

async function sendOrderConfirmation(order) {
  const resend = getResend();
  // ORDER_NOTIFY_EMAIL routes every confirmation to one inbox (e.g. the store owner)
  // instead of the customer — needed while sending from onboarding@resend.dev, which
  // only delivers to the Resend account's own address.
  const to = process.env.ORDER_NOTIFY_EMAIL || order.email;
  if (!resend || !to) return;
  const { error } = await resend.emails.send({
    from: process.env.ORDER_EMAIL_FROM || "IL MANO <onboarding@resend.dev>",
    to,
    replyTo: order.email || undefined,
    subject: process.env.ORDER_NOTIFY_EMAIL
      ? `New order from ${order.email || "unknown"} — IL MANO`
      : "We've got your order — IL MANO",
    html: orderConfirmationHtml(order),
  }).catch((e) => ({ error: e }));
  // Never let an email failure break order processing — just log it.
  if (error) console.error("[email] order confirmation failed", error);
}

module.exports = { sendOrderConfirmation };
