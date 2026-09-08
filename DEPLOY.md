# Deploy to Vercel

This repo deploys to Vercel as:

- **Static frontend** — the Vite build (`dist/`), with an SPA fallback
  (`vercel.json`) so deep links like `/shop/books/cake-pastry` work.
- **Serverless functions** — the Paystack verification + secure downloads,
  ported from Express into `api/` (same logic, shared `/lib`).
- **Private storage** — the PDFs live in **Vercel Blob**, never in the web
  bundle.

> Vercel deploys automatically on every push to `main`. You must sign in with
> your GitHub + Vercel accounts in the browser — those are one-time interactive
> steps only you can do.

---

## Step 1 — Push the code to GitHub (only if not yet done)

```bash
git remote add origin https://github.com/atakoraerik-creator/priscilla-portfolio.git
git branch -M main
git push -u origin main
```

A browser sign-in pops up on the first push — approve it (the repo already
contains the Vercel files from this guide, so you can just pull/push).

---

## Step 2 — Connect Vercel (2 minutes)

1. Go to **https://vercel.com/** and sign in with GitHub
   (continue with `atakoraerik-creator`).
2. **Add New → Project** → import **`priscilla-portfolio`**.
3. Vercel auto-detects the framework (Vite). The config is already in
   `vercel.json` (build command `npm run build`, output `dist`). Just click
   **Deploy**.
4. After it finishes you get `https://priscilla-portfolio.vercel.app`.

---

## Step 3 — Add the Blob store + upload the PDFs

1. In the project: **Storage → Create Database → Blob** (free tier fine).
2. Copy the token Vercel gives you (`vercel_blob_rw_…`).
3. Add it as an environment variable (see Step 4) **and** run the upload:

```powershell
$env:BLOB_READ_WRITE_TOKEN="vercel_blob_rw_..."     # your token
npm.cmd run books:upload                             # reads server/private/books/
```

For each new upload, re-run `npm run books:upload`.

---

## Step 4 — Environment variables

Project → **Settings → Environment Variables** (add to *Production*):

| Name | Value |
|---|---|
| `VITE_PAYSTACK_PUBLIC_KEY` | Paystack **public** key (`pk_test_…` / `pk_live_…`) |
| `PAYSTACK_SECRET_KEY` | Paystack **secret** key (`sk_test_…` / `sk_live_…`) |
| `BLOB_READ_WRITE_TOKEN` | from Step 3 |
| `DOWNLOAD_SECRET` | any long random string (fallback signing key) |
| `DOWNLOAD_TOKEN_TTL` | `3600` |

Then **Redeploy** (Deployments → latest → ⋯ → Redeploy) so the new variables
take effect. Keys come from **dashboard.paystack.com → Settings → API Keys**.

---

## Step 5 — Test everything

- `/api/health` → `{"ok":true,...}`
- Buy a book in the shop with Paystack **test cards**
  (e.g. `4084 0840 8408 4081`, future expiry, CVV `408`):
  - Payment success page downloads the PDF, which is streamed from **Blob**.
  - `/api/download/garbage` → **401**, never a file.
- Deep links work: type `/creations` directly in the URL bar.

---

## Going live with real money

1. Replace example products/covers/photos and the real PDFs in
   `server/private/books/`, then re-run `npm run books:upload`.
2. In Paystack, go **Live** (add your `*.vercel.app` domain) and update both
   keys in Vercel.
3. (Recommended) Add a Paystack **webhook** to `/api/paystack/verify` later.

## Custom domain (optional)

Project → **Settings → Domains** → add your domain. Vercel provisions HTTPS
automatically.

## Notes
- The Blob token in `books/` is private — the browser can only reach a file
  through `api/download`, which enforces the HMAC token + expiry.
- Local dev still uses Express (`npm run dev`) and falls back to
  `server/private/books/` when no `BLOB_READ_WRITE_TOKEN` is set, so you can
  test without Vercel.