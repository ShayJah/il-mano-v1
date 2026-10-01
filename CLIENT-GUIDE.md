# IL MANO — Store owner guide

Everything you can change yourself, without a developer. The site has no admin
dashboard; you edit a few plain-text files, then publish. Most changes take 2 minutes.

## The routine (every change)

1. Edit the file(s) below.
2. Added or changed a photo? Run `npm run images`. Then run `npm run check` in the project folder — it catches typos, missing photos and
   mismatched names and tells you exactly what's wrong. Fix anything marked ✗.
3. Publish: `git add -A && git commit -m "Update products" && git push`
   (the site redeploys automatically). If the site doesn't update, run `vercel --prod`.
4. Refresh the live site to confirm.

> Never put passwords or API keys in any of these files. Those live only in the Vercel dashboard.

---

## 1. Products, prices, sizes — `data.js`

**Change a price** — find the product, edit `price: 100`. Whole dollars only.
It updates the storefront, cart, the amount Stripe charges, and the confirmation email together.

**Mark a size sold out / back in stock** — in the product's `sizes`, flip `soldOut: true` ↔ `false`.

**Add a product**
1. Put the photos in the `assets/` folder (WebP, under ~500 KB each; name them clearly, e.g. `tee-black-front.webp`).
2. In `data.js`, copy an entire existing product block (from `{` to its closing `},`) and paste it after the last one.
3. Change **every** field: `id` (unique, lowercase, no spaces), `slug`, `name`, `category`,
   `categoryKey` (must match a category `key`), `price`, `description`, `colors`, `sizes`, `specs`, `care`, `delivery`.
4. Add a line to `gridCards` for each colour you want shown on the home page:
   `{ productId: "your-id", colorId: "black", badge: null },`
   (`badge` is the small label — `"New"`, `"Limited"`, or `null`.)

**Add a colour** — add a line to the product's `colors` with a new `id`, a display `name`,
a `hex` swatch colour, and `front` / `back` photos (use the same photo for both if you only have one).

**Remove a product** — delete its block *and* its `gridCards` lines. (Don't reuse its `id` for something else; old orders refer to it.)

**Shipping & tax** — `settings` at the top of `data.js`: `freeShippingOver`, `flatShipping`, `taxRate`.
⚠ The FAQ and Shipping pages and each product's `delivery:` text are plain sentences and mention
"$250" / "$12" — if you change the numbers, update those sentences too (see §2).

**Categories** — `categoryDefs` in `data.js`. The "N pieces" labels count automatically.

## 2. Wording on FAQ / Shipping & Returns / Terms / Privacy / Code of Conduct — `info-content.js`

Each page is a block of text. Edit the sentences between quotes (keep the quotes and commas).
Contact email addresses (hello@ilmano.com) appear here and in the footer in `sections.jsx` (search "mailto").

## 3. Home-page text

| What | Where |
|---|---|
| Scrolling banner words, "Connect / Create / Inspire" pillars | `marqueeItems`, `storyPillars` in `data.js` |
| Hero headline & intro paragraph | `Hero` in `sections.jsx` |
| Editorial quote under the collection | `Lookbook` in `sections.jsx` |
| Footer links, tagline | `Footer` in `sections.jsx` |
| Our Story page | `our-story.jsx` |
| Gallery page pieces & captions | the `GAL_PIECES` list at the top of `gallery.jsx` |
| Search-result title/description | `<title>` / `<meta name="description">` in each `.html` file |

## 4. Photos

Put the original image in `assets/` (any size is fine — it's kept as the master copy) and reference it
as `assets/filename.webp`. Then run **`npm run images`**: it creates small phone-friendly copies in
`assets/opt/` (a 2 MB photo becomes ~50 KB on a phone) and the site picks the right size
automatically. Commit the `assets/opt/` folder along with your photo.
`npm run check` warns if a photo you used hasn't been through this step.
File names are case-sensitive (`Hoodie.webp` ≠ `hoodie.webp`). The `uploads/` folder is NOT published.

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
