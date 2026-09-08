# Deploy to the internet (GitHub → Render)

This hosts **one Node service** that runs the Express API *and* serves the built
website — so Paystack verification and secure downloads work out of the box.

> **Before you start**: Render needs your repo on GitHub, and it will require
> you to sign in to your GitHub account and your Render account in the browser.
> Those are one-time interactive steps only you can do.

---

## Step 1 — Create the GitHub repo (2 minutes)

1. Go to **https://github.com/** and sign in (user: `atakoraerik-creator`).
2. Click **New repository** (top-right `+` → New repository).
3. Name it: **`priscilla-portfolio`** — leave it **Public** (or Private — either works for Render).
4. **Do NOT** tick "Add a README" (it would conflict). Click **Create repository**.
5. On the empty repo page, the terminal commands are shown. In the folder below, run:

```bash
git remote add origin https://github.com/atakoraerik-creator/priscilla-portfolio.git
git branch -M main
git push -u origin main
```

> The first push will ask you to sign in with your browser (Git Credential Manager pops up automatically). That's expected.

This project is already committed and ready — the repo contains **NO secrets**
(`.env`, `PAYSTACK_SECRET_KEY`, raw photos and `node_modules` are excluded).

---

## Step 2 — Create the Render service (1 minute)

1. Go to **https://dashboard.render.com/** and sign in.
2. Click **New** → **Blueprint**.
3. Click **Connect a repository**, choose `priscilla-portfolio`.
4. Render reads the included **`render.yaml`** and shows a service named
   `priscilla-portfolio`.
5. Click **Apply** — the first deployment starts automatically.

Render will now set environment variables it needs on its own (auto-deploy on
every push) and give you a URL like `https://priscilla-portfolio.onrender.com`.

---

## Step 3 — Set your security variables

The blueprint creates the service, but the secret values are *yours to fill*.
Render pauses builds until they are set.

1. In the Render dashboard open your service → **Environment**.
2. Add:

| Key | Value |
|---|---|
| `VITE_PAYSTACK_PUBLIC_KEY` | Your Paystack **public** key `pk_test_…` / `pk_live_…` |
| `PAYSTACK_SECRET_KEY` | Your Paystack **secret** key `sk_test_…` / `sk_live_…` |
| `DOWNLOAD_SECRET` | Any long random string (e.g. `openssl rand -hex 32`) |
| `DOWNLOAD_TOKEN_TTL` | `3600` |
3. Click **Save Changes**, then **Manual Deploy → Deploy latest commit**.

---

## Step 4 — Test it

- Visit `https://your-app.onrender.com/` — the site loads.
- Open `/api/health` — you should see `{"ok":true,...}`.
- Buy a book in the shop (use Paystack **test cards**) and confirm the download
  link works. Test cards:
  - Success: `4084 0840 8408 4081`, any future expiry, CVV `408`
- Try `/api/download/garbage` — it must return **401**, never a PDF.

---

## Going live with real money

1. Replace the **example products** in `src/data/products.js` with real books,
   put the real PDFs in `server/private/books/`, and use real covers in
   `public/images/books/`.
2. In the Paystack dashboard switch the integration to **Live** (add your
   domain to the live settings) and update both keys on Render.
3. (Recommended) Add a Paystack **webhook** and turn on email confirmation later.

## Custom domain (optional)

Render dashboard → service → **Settings → Custom Domain**, add your domain, and
point a `CNAME` record at `your-app.onrender.com`. Render auto-provisions HTTPS.

---

## What is *not* done by this flow
- Paystack **live** keys (you must toggle live in the Paystack dashboard).
- Real products / PDFs / photos / contact details (all are curated placeholders,
  ready to replace as described in the README).