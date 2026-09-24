const { getResend } = require("./clients");
const { NAMES, PRICES } = require("./products");

const INK = "#0a0a0a";
const MID = "#8c8780";
const BG = "#f5f4f0";
const LINE = "#ddd8cc";
const TOBACCO = "#6b4a2b";

const fmt = (cents) => "$" + (cents / 100).toFixed(2);

function orderConfirmationHtml(order) {
  const rows = order.cart.map(it => {
    const name = NAMES[it.id] || it.id;
    const price = PRICES[it.id] || 0;
    return `
      <tr>
        <td style="padding:14px 0;border-bottom:1px solid ${LINE};font-family:Georgia,'Times New Roman',serif;font-size:16px;color:${INK};">
          ${name}
          <div style="font-family:Helvetica,Arial,sans-serif;font-size:12px;letter-spacing:0.04em;color:${MID};margin-top:3px;">Qty ${it.q}</div>
        </td>
        <td style="padding:14px 0;border-bottom:1px solid ${LINE};font-family:Helvetica,Arial,sans-serif;font-size:14px;color:${INK};text-align:right;vertical-align:top;white-space:nowrap;">
          ${fmt(price * it.q * 100)}
        </td>
      </tr>`;
  }).join("");

  const totalRow = (label, cents, strong) => `
    <tr>
      <td style="padding:${strong ? "10px 0 0" : "3px 0"};font-family:Helvetica,Arial,sans-serif;font-size:${strong ? "14px" : "13px"};color:${strong ? INK : MID};${strong ? "font-weight:bold;border-top:1px solid " + LINE + ";padding-top:12px;" : ""}">${label}</td>
      <td style="padding:${strong ? "10px 0 0" : "3px 0"};font-family:Helvetica,Arial,sans-serif;font-size:${strong ? "15px" : "13px"};color:${strong ? INK : MID};text-align:right;${strong ? "font-weight:bold;border-top:1px solid " + LINE + ";padding-top:12px;" : ""}">${cents === 0 ? "Free" : fmt(cents)}</td>
    </tr>`;

  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Your IL MANO order</title>
</head>
<body style="margin:0;padding:0;background:${BG};">
  <div style="display:none;max-height:0;overflow:hidden;">Your card is authorized — ${fmt(order.amount)} — order ${order.id}.</div>
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${BG};padding:40px 16px;">
    <tr>
      <td align="center">
        <table role="presentation" width="560" cellpadding="0" cellspacing="0" style="max-width:560px;width:100%;background:${BG};">

          <tr>
            <td style="padding-bottom:28px;border-bottom:1px solid ${INK};">
              <span style="font-family:Georgia,'Times New Roman',serif;font-size:21px;letter-spacing:0.18em;color:${INK};">IL&nbsp;MANO</span>
            </td>
          </tr>

          <tr>
            <td style="padding:32px 0 8px;font-family:Helvetica,Arial,sans-serif;font-size:11px;letter-spacing:0.14em;text-transform:uppercase;color:${TOBACCO};">
              Order received
            </td>
          </tr>
          <tr>
            <td style="padding-bottom:20px;font-family:Georgia,'Times New Roman',serif;font-size:26px;line-height:1.3;color:${INK};">
              Thank you${order.firstName ? ", " + order.firstName : ""}.
            </td>
          </tr>
          <tr>
            <td style="padding-bottom:32px;font-family:Helvetica,Arial,sans-serif;font-size:14px;line-height:1.7;color:${INK};">
              Your card has been authorized and your pieces are being reviewed before they leave our workshop in Los Angeles. You won't be charged until your order ships — we'll follow up with tracking once it's on its way.
            </td>
          </tr>

          <tr>
            <td>
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                ${rows}
              </table>
            </td>
          </tr>

          <tr>
            <td style="padding-top:4px;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                ${totalRow("Subtotal", order.subtotal * 100 || 0)}
                ${totalRow("Shipping", order.shipping * 100 || 0)}
                ${totalRow("Tax", order.tax * 100 || 0)}
                ${totalRow("Total authorized", order.amount, true)}
              </table>
            </td>
          </tr>

          <tr>
            <td style="padding-top:40px;border-top:1px solid ${LINE};margin-top:32px;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-top:32px;">
                <tr>
                  <td style="font-family:Helvetica,Arial,sans-serif;font-size:11px;letter-spacing:0.1em;text-transform:uppercase;color:${MID};padding-bottom:4px;">Order reference</td>
                </tr>
                <tr>
                  <td style="font-family:'Courier New',Courier,monospace;font-size:13px;color:${INK};padding-bottom:24px;">${order.id}</td>
                </tr>
                <tr>
                  <td style="font-family:Helvetica,Arial,sans-serif;font-size:12px;line-height:1.7;color:${MID};">
                    Questions about your order? Just reply to this email, or write <a href="mailto:hello@ilmano.com" style="color:${INK};">hello@ilmano.com</a>.<br/>
                    Manufactured in Los Angeles, CA.
                  </td>
                </tr>
              </table>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
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

module.exports = { sendOrderConfirmation, orderConfirmationHtml };
