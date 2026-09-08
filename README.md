# Priscilla Adubia Asamoah — Portfolio & Digital Shop

Premium portfolio website for **Priscilla Adubia Asamoah** (Pastry Chef | Cake Artist | Dessert Specialist) with an integrated digital shop selling PDF books through **Paystack**, including **server-side payment verification** and **secure, expiring digital downloads**.

Built with **React + Vite + Tailwind CSS + Framer Motion + Express**. **No database** — the catalogue, gallery and site content are plain configuration files.

---

## Tech stack

| Layer | Tech |
|---|---|
| Frontend | React 18, Vite, Tailwind CSS, React Router, Framer Motion |
| Payments | Paystack Inline (browser) + Paystack API (server) |
| Backend | Express (Node 18+), stateless |
| Storage | Local private folder (default) **or** any private S3-compatible URL |
| Data | Static JS modules — `src/data/*.js` |

---

## Quick start

Requirements: **Node 18+** (tested on Node 24).

```bash
# 1. install dependencies
npm install

# 2. create environment file and fill in your keys
copy .env.example .env        # (Windows) /  cp .env.example .env (macOS/Linux)

# 3. run the whole app (API on :8787 + Vite dev on :5180)
npm run dev
```

Open **http://localhost:5180**.

> Ports: the Vite dev server runs on **5180** by default (a commonly used port was already occupied on some machines). The API server runs on **8787** and Vite proxies `/api` to it automatically.

### Run pieces separately

```bash
npm run dev:web     # Vite only (http://localhost:5180)
npm run dev:server  # Express only (http://localhost:8787) with auto-reload
```

### Production locally

```bash
npm run build   # builds the frontend into dist/
npm start       # Express serves dist/ + the API on PORT (default 8787)
```

### Production on a VPS / Render / Railway / Fly.io

Same thing:

```bash
npm install
npm run build
npm start
```

On **Render** create a **Web Service** with start command `npm start` and add the env vars below. On **Vercel/Netlify**, deploy the Express app as a serverless function instead — point the API routes at your function and keep the frontend static.

---

## Environment variables

Copy `.env.example` → `.env` and fill in:

| Variable | Where used | Required |
|---|---|---|
| `VITE_PAYSTACK_PUBLIC_KEY` | frontend (browser) | Yes — checkout |
| `PAYSTACK_SECRET_KEY` | server only | Yes — verification |
| `PORT` | server | No (default `8787`) |
| `DOWNLOAD_SECRET` | server | No (defaults to SECRET key) |
| `DOWNLOAD_TOKEN_TTL` | server | No (default `3600` seconds) |
| `PRIVATE_STORAGE_URL` | server | Only if PDFs are remote |
| `PRIVATE_STORAGE_KEY` | server | Only for remote storage auth |
| `ALLOWED_ORIGINS` | server CORS | Only if frontend & API are on different hosts |

**Security rules (enforced by design):**

- The **secret key** exists **only** server-side (`PAYSTACK_SECRET_KEY`). It is never prefixed with `VITE_`, never written into components, `products.js`, `public/`, or the repo.
- The **public key** (`VITE_PAYSTACK_PUBLIC_KEY`) may be exposed to the browser — that is expected.
- The real `.env` is gitignored. **Only `.env.example`** is committed.
- Real PDFs must **never** live in `public/`.

---

## How the shop & secure download work

```
/ Shop → product details → BUY NOW
   → email prompt → Paystack popup (public key, amount in minor units)
   → payment success → /payment-success?ref=…&product=…
   → frontend calls POST /api/paystack/verify
   → server verifies with Paystack (SECRET key) and checks:
       1. reference exists             
       2. status === success           
       3. product exists in products.js
       4. amount matches product.price (×100)
       5. currency matches
       6. metadata product matches
   → only then server signs a short-lived download token (HMAC, expires)
   → GET /api/download/<token> streams the PDF  (token expires, cannot be forged)
```

**Nothing is ever granted based on the frontend claiming success.** The success page only enables the download button after the server confirms with Paystack.

The download token is signed with HMAC-SHA256 and expires after `DOWNLOAD_TOKEN_TTL` seconds. A customer can never edit a URL to download a different product, and the browser never learns the storage location.

---

## Paystack configuration

1. Register at https://paystack.com and create an integration.
2. Copy the **Test** keys:
   - Public key `pk_test_…` → `VITE_PAYSTACK_PUBLIC_KEY`
   - Secret key `sk_test_…` → `PAYSTACK_SECRET_KEY` (server only)
3. Test the full flow with Paystack test cards:
   - **Success:** card `4084 0840 8408 4081`, any future expiry, CVV `408`, any PIN
   - **Failure:** card `4084 0840 8408 4082`
4. When ready for real money, flip Paystack to **Live** in the dashboard and update both keys (the same `.env` works — just swap the values).
5. (Recommended, later) Configure a **Paystack webhook** and your business *settlement/auto-delivery* settings.

> GHS amounts are passed to Paystack in **minor units (pesewas)** automatically by the frontend (`src/services/paystack.js`).

---

## Adding a new PDF product (no database)

1. Put the real PDF at `server/private/books/<fileKey>` (rename to your file).
2. Open **`src/data/products.js`** and add one object:

```js
{
  id: 'new-book',               // unique id → /shop/new-book
  title: 'New Pastry Book',
  description: 'Short card blurb.',
  longDescription: 'Longer detail-page text.',
  whatIsInside: ['Chapter 1', 'Chapter 2', '…'],
  price: 120,                   // GHS
  currency: 'GHS',
  cover: '/images/books/new-book.svg',   // or .jpg cover photo
  category: 'Pastry',
  pages: 100,
  format: 'PDF',
  fileKey: 'new-book.pdf',      // must match the filename in server/private/books
  featured: false,              // true → appears on the home page
}
```

3. Done. It appears automatically on `/shop`, gets its own detail page, and becomes purchasable.

### Replacing a book cover

Drop the real cover into `public/images/books/` and point `cover` at it (e.g. `/images/books/cake-masterclass.jpg`).

---

## Replacing gallery images

Edit **`src/data/gallery.js`**. Each entry:

```js
{
  id: 10,
  title: 'Your Cake Title',
  category: 'Cakes',            // Cakes | Pastries | Desserts | Bread | Special Creations
  image: '/images/gallery/cake-01.jpg',
  description: 'Optional caption shown in the lightbox.',
}
```

Put the photo files in `public/images/gallery/`. The Creations page renders every entry and the filter tabs update automatically.

---

## Changing Priscilla's details

Everything personal lives in **`src/config/site.js`**:

- Name, title, tagline, hero/about images
- Biography, philosophy, passion, strengths, highlights
- **Contact**: email, phone, WhatsApp, location
- **Social links**: instagram / facebook / linkedin / whatsapp

Empty strings are treated as "not set" — the corresponding UI (email row, social icons in the footer, etc.) hides itself automatically. Nothing is invented: leave blank until real values exist.

### Experience timeline

Edit **`src/data/experience.js`** — add, remove or reorder entries. Empty `date` renders as a dash.

### Hero / portrait photo & performance

The original photo (21 MB DSC_6991) was already resized into optimized JPGs at `public/images/priscilla/`. When you replace them, keep files reasonably sized (≤ ~300 KB, ideally ≤1600px wide) for performance.

---

## Project structure

```
├── public/
│   ├── images/
│   │   ├── priscilla/    hero + portrait (real photos)
│   │   ├── gallery/      gallery placeholders → replace with real photography
│   │   └── books/        book cover placeholders → replace
├── src/
│   ├── components/       Navbar, Footer, Hero, ProductCard, PaymentButton,
│   │                     GalleryCard/Modal, ExperienceTimeline, ContactForm, …
│   ├── pages/            Home, About, Creations, Experience, Shop,
│   │                     ProductDetails, Contact, PaymentSuccess, PaymentFailed
│   ├── data/             products.js · gallery.js · experience.js   ← “the database”
│   ├── config/           site.js    ← all personal info
│   ├── services/         paystack.js (frontend popup wrapper)
│   ├── api/              client.js (fetch helpers)
│   └── App.jsx / main.jsx
├── server/
│   ├── index.mjs         Express: verify + secure download + static hosting
│   └── private/books/    ← PDFs. NEVER public. gitignored by default.
├── scripts/              placeholder generator + sample PDF generator + smoke test
```

## Scripts

```bash
npm run dev          # API + Vite together
npm run build        # production frontend build
npm start            # production server (API + built site)
node scripts/smoke-test.mjs   # validates download-token security (dev server must be running)
```

---

## What is placeholder / example content right now?

Because real assets/keys/data were not provided, the following are **clearly marked placeholders** — the system is built so you can drop the real things in:

- **Products** — 6 example books (`src/data/products.js`) with example prices. Replace with Priscilla's actual books.
- **Book covers & gallery images** — elegant generated SVGs (`public/images/books`, `public/images/gallery`). Swap for real photography anytime.
- **Contact & social details** — empty/placeholder in `src/config/site.js`. Fill them in; sections appear automatically.
- **Experience dates/descriptions** — generic text in `src/data/experience.js` marked as editable.
- **PDFs** — generated sample PDFs in `server/private/books/` so the download flow is testable now. Replace with real books (keep the same file names as the `fileKey`s).
- **Paystack keys** — `.env` needs your real keys.

---

## Security checklist (already implemented)

- [x] Secret key only on the server, never in the bundle
- [x] Server-side verification with Paystack API (not just the frontend callback)
- [x] Amount, currency, product, reference all validated against `products.js`
- [x] Unguessable, expiring, HMAC-signed download tokens
- [x] PDFs outside `public/`, never served statically
- [x] Friendly error messages — no stack traces, no internal details leaked
- [x] `.env` gitignored; only `.env.example` committed
- [x] Malformed requests handled gracefully (tested: bad JSON, missing fields, unknown products, tampered/expired tokens)