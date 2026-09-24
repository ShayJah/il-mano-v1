# IL MANO — project context for Claude Code

E-commerce storefront for IL MANO (LA-made clothing). Read this before doing anything
in this repo — it captures decisions, gotchas, and open items from the initial
ship-tonight build so you don't have to re-derive them.

## Architecture

- **Frontend**: static HTML + React 18 loaded from CDN (unpkg) with in-browser Babel
  (`<script type="text/babel">`). No build step, no bundler, no `npm run build`.
  - `index.html` — main storefront shell
  - `app.jsx` — root component, cart state
  - `sections.jsx` — Nav (incl. mobile drawer), Hero, Collection, Footer
  - `pdp-cart.jsx` — product detail page + cart drawer
  - `checkout.jsx` — checkout flow, real Stripe Elements
  - `data.js` — hardcoded product catalog (plain JS, no CMS — see "Deferred" below)
  - `info-content.js` + `info-page.jsx` — shared shell for FAQ/Terms/Privacy/Shipping/
    Code of Conduct pages (`faq.html`, `terms.html`, etc. each just mount this with a
    different `slug`)
  - `styles.css` — single stylesheet, all of it
  - `tweaks-panel.jsx` — a design-prototyping overlay, NOT a CMS/admin. Only opens via
    postMessage from an external host; invisible to real customers.
- **Backend**: Vercel serverless functions in `/api`. No traditional server.
  - `api/create-payment-intent.js` — creates a Stripe PaymentIntent, `capture_method:
    "manual"` (authorize now, charge later — see "Payment model" below). Recomputes
    the cart total server-side from `api/_lib/products.js` — never trusts a price the
    browser sends.
  - `api/stripe-webhook.js` — verifies the Stripe signature, on
    `payment_intent.amount_capturable_updated` builds the order object
    (`orderFromIntent`) and both emails a confirmation and writes to Redis, resiliently
    (email fires even if Redis is down).
  - `api/capture-order.js` — manually charge an authorized order later, protected by
    `CAPTURE_ADMIN_SECRET` shared-secret header. (In practice: Stripe Dashboard →
    Payments → Uncaptured → Capture is easier than calling this.)
  - `api/_lib/clients.js` — lazy singletons for Stripe/Redis/Ratelimit/Resend clients.
  - `api/_lib/products.js` — server-side mirror of `data.js` prices/names/images. Keep
    these two files in sync manually if you add/change a product.
  - `api/_lib/email.js` — order-confirmation email template + send logic.

## Payment model (important — don't "fix" this by mistake)

Cards are **authorized, not charged**, at checkout (`capture_method: "manual"`). The
customer sees "Order received... you'll be charged when your order ships," not "you've
been charged." This was a deliberate choice to let the store owner review orders before
money moves. Don't switch this to `capture_method: "automatic"` without confirming
that's actually wanted — it changes the customer-facing promise on the success page and
in the email.

## Email delivery — current limitation

`ORDER_EMAIL_FROM` defaults to `onboarding@resend.dev`, which **only delivers to the
Resend account's own signup email** — not to arbitrary customers — until a real domain
is verified in Resend (Domains → Add Domain → add the DNS records they give you).

Until that's done, `ORDER_NOTIFY_EMAIL` (if set) routes every confirmation to one fixed
inbox instead, with `replyTo` set to the actual customer — so notifications aren't lost,
but customers themselves get nothing automated yet. Check whether a domain has been
verified in Resend before assuming customers are receiving these emails.

Once a domain is verified: set `ORDER_EMAIL_FROM=IL MANO <orders@yourdomain.com>` and
remove `ORDER_NOTIFY_EMAIL` so confirmations go to the actual customer.

## Env vars (Vercel dashboard → project → Settings → Environment Variables — NEVER in a committed file)

See `.env.example` for the full list with descriptions. Summary:
- `STRIPE_SECRET_KEY` — `sk_test_...` until go-live, then `sk_live_...`
- `STRIPE_WEBHOOK_SECRET` — from Stripe Dashboard → Webhooks → your endpoint
- `UPSTASH_REDIS_REST_URL` / `UPSTASH_REDIS_REST_TOKEN` — from Vercel Storage → Upstash
- `CAPTURE_ADMIN_SECRET` — `openssl rand -hex 32`
- `RESEND_API_KEY` — optional, from resend.com
- `ORDER_EMAIL_FROM` — optional, needs a verified Resend domain
- `ORDER_NOTIFY_EMAIL` — optional stopgap, see above

**Changing an env var in the Vercel dashboard does nothing to the live site until you
redeploy** (`vercel --prod`). This tripped us up twice already — always redeploy after
touching env vars.

## Deployment gotchas already hit once — don't repeat these

1. **Preview URLs vs production domain**: `vercel` (no flag) creates a new random
   preview URL every time (`il-mano-v1-xxxxx-....vercel.app`). `vercel --prod` deploys
   to the stable domain (`il-mano-v1.vercel.app`). The Stripe webhook is registered
   against the **stable production domain** — always test checkout on that same domain,
   not a preview URL, or the webhook will silently never fire for that test.
2. **Global `vercel` CLI can be stale**: if `vercel login`/`vercel` behaves oddly or
   errors about a legacy auth flow, run `npm install -g vercel@latest` first —
   different machines in this project's history have had CLI versions as old as 44.x
   vs the current 59.x, and the old device-auth flow is being deprecated.
3. **`.env.example` is committed to git — never put a real secret in it.** Real values
   only go in the Vercel dashboard, or in a local (gitignored) `.env` if running
   `vercel dev`.
4. **Two parallel Claude Code sessions have edited this repo from different machines
   in the same evening** (see git log around commits `8e163cf`/`846f79a` vs `e5e79ac`).
   If you're picking this up fresh: `git fetch && git log --oneline origin/main -10`
   before assuming local state is current, and merge (never force-push) if diverged.

## Compliance note — not yet resolved

The order-confirmation email includes marketing content (a brand quote + "Continue the
collection" CTA), which pushes it toward "commercial email" under CAN-SPAM — those are
expected to include a real physical business postal address. None is currently in the
footer because no address was available to put there. If IL MANO has a business
address, add it to `api/_lib/email.js` (search for "Manufactured in Los Angeles, CA" in
the footer block) before this goes out to real customers at any real volume.

## What's built vs explicitly deferred

**Built and working** (as of last test): checkout → Stripe auth-hold → webhook → Redis
order storage → confirmation email, mobile hamburger nav, FAQ/Terms/Privacy/
Shipping-Returns/Code-of-Conduct pages, 404 page, favicon, dynamic copyright year,
rate limiting on the payment endpoint, no horizontal scroll (verified via headless
browser at desktop + 375px mobile).

**Explicitly deferred** (do not build these without asking first — they were cut from
scope deliberately, not overlooked):
- Firebase Auth / customer accounts — guest checkout only, by design
- A real CMS/admin — products stay as direct edits to `data.js` + `api/_lib/products.js`
  (keep both in sync) + `git push`
- Full rate-limiting/WAF hardening — only the payment endpoint has basic per-IP
  throttling
- Load testing — needs a live deployed target, wasn't done
- Async job infrastructure (queues, scheduled jobs) — order emails are synchronous,
  fine at current scale

## Outstanding decisions only the store owner can make

- No custom domain purchased/connected yet (was mid-setup — see chat history or ask)
- Still in Stripe test/sandbox mode — no real charges yet. Going live means swapping
  `STRIPE_SECRET_KEY` for `sk_live_...` and running `vercel --prod`
- No Resend sending domain verified yet — customers aren't getting confirmation emails
  directly (see "Email delivery" above)
- No real business address for the email footer (see "Compliance note" above)

## What an autonomous agent can and can't do here

Can: edit code, run local syntax/build checks, commit, and — once given valid
credentials/env vars — call Stripe/Resend/Upstash APIs directly.

Can't: complete `vercel login` (OAuth device flow needs a human to click approve in a
browser), verify a domain in Resend or add DNS records at a registrar (both are
browser/dashboard actions), or decide the open items in the section above. Surface
these back to the user rather than guessing.
