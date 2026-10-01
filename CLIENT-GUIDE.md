# IL MANO — Store owner guide

You edit the site from a web dashboard — no code, no terminal.

## Logging in

1. Go to **your-site/admin** (e.g. https://il-mano-v1.vercel.app/admin).
2. Click **Login with GitHub** and approve. You need a free GitHub account that the
   developer has added as a collaborator on the repo (GitHub only lets people with
   write access save changes).
3. Edit something, press **Publish → Publish now**. The live site updates in about a
   minute (Vercel redeploys). Refresh to confirm.

If the site doesn't update after a few minutes, a typo may have failed the safety check
(`npm run check`, run on every deploy). The previous version stays live; tell the developer.

## What you can edit

| Section in the dashboard | What it controls |
|---|---|
| **Products** | name, price, colours + photos, sizes (tick *Sold out*), description, specs, care, delivery note, display order |
| **Store & Home Page → Shipping & tax** | free-shipping threshold, flat rate, tax rate |
| **Store & Home Page → Home page** | scrolling banner, Connect/Create/Inspire text, categories, special cards |
| **Gallery & Our Story** | gallery photos + captions, the Our Story vision sentence and values |
| **Info Pages** | FAQ, Shipping & Returns, Terms, Privacy, Code of Conduct |

**Add a product** — Products → *New Product*. Give it a unique lowercase **Product ID** (never
change it later — orders refer to it), pick a category, add at least one colour and size. Each colour
you tick *Show on home page* gets its own card on the home page automatically.
**Remove a product** — open it and delete it (old orders keep their own copy of the name).
**Change a price** — edit *Price*. It updates the storefront, cart, Stripe charge and email together.

⚠ The FAQ / Shipping page and each product's *Delivery note* are plain sentences that mention
"$250" / "$12". If you change shipping numbers, update those sentences too.

## Photos

Upload straight from the dashboard (WebP/JPG/PNG; ideally under ~2 MB). Small phone-friendly
copies are generated automatically on every deploy. The `uploads/` folder in the repo is NOT published.

## Not in the dashboard (needs a developer)

Hero headline and footer text (`sections.jsx`), the Our Story paragraphs (`our-story.jsx`), gallery
motion, page titles/meta descriptions (each `.html`), payment behaviour, email templates (`api/`),
keys, and the domain.

## 5. Orders (no code needed)

- **New orders** arrive as a Stripe authorization (card held, not charged) and a confirmation email.
- **To charge a customer**: Stripe Dashboard → Payments → **Uncaptured** → open the payment → **Capture**.
  Authorizations expire after ~7 days — capture or cancel before then.
- **Refunds / cancellations**: Stripe Dashboard → Payments → the payment → Refund / Cancel.
- **Newsletter signups** are stored in Upstash Redis (set `ilmano:subscribers`) — Vercel dashboard → Storage → Upstash → Data Browser.

## 6. Needs a developer (don't attempt)

Changing payment behaviour, email templates (`api/_lib/email.js`), Stripe/Resend/Redis keys,
the domain, or anything in `api/`. Env-var changes in Vercel only apply after a redeploy.

## Known gotcha

"The Field Set" bundle card on the home page displays $340 but currently adds a single
Classic Hoodie ($100) to the bag. Don't advertise bundle prices until a developer makes the
bundle a real product.
