/**
 * ============================================================
 *  SERVER — Paystack verification + secure digital downloads
 * ============================================================
 *  Node + Express. Stateless: no database, no permanent order
 *  records. The Paystack SECRET key only ever lives here (env).
 *
 *  Endpoints
 *    POST /api/paystack/verify  { reference, productId }
 *        Verifies the transaction with Paystack, checks the
 *        product, amount and currency, then returns a short-lived
 *        HMAC-signed download token.
 *    GET  /api/download/:token
 *        Streams the PDF for a valid, unexpired token.
 *    GET  /api/health
 *
 *  Environment (.env — never committed)
 *    PAYSTACK_SECRET_KEY     required for verification
 *    VITE_PAYSTACK_PUBLIC_KEY (used by the frontend only)
 *    PORT                    default 8787
 *    DOWNLOAD_SECRET         token signing key (defaults to PAYSTACK_SECRET_KEY)
 *    DOWNLOAD_TOKEN_TTL      seconds, default 3600 (1 hour)
 *    PRIVATE_STORAGE_URL     optional remote private storage base URL
 *    PRIVATE_STORAGE_KEY     optional auth key for remote storage
 *    ALLOWED_ORIGINS         comma-separated extra CORS origins
 */
import express from 'express';
import cors from 'cors';
import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import 'dotenv/config';
import { products, getProduct } from '../src/data/products.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PAYSTACK_API = 'https://api.paystack.co';

const app = express();
app.use(express.json());

const allowedOrigins = [
  'http://localhost:5180',
  'http://127.0.0.1:5180',
  ...(process.env.ALLOWED_ORIGINS ? process.env.ALLOWED_ORIGINS.split(',').map((s) => s.trim()) : []),
];
app.use(
  cors({
    origin(origin, cb) {
      if (!origin || allowedOrigins.includes(origin)) return cb(null, true);
      return cb(null, true); // same-origin production requests carry no Origin header
    },
  })
);

const getSecret = () => process.env.PAYSTACK_SECRET_KEY || '';
const getSigningKey = () => process.env.DOWNLOAD_SECRET || getSecret();
const tokenTtl = Number(process.env.DOWNLOAD_TOKEN_TTL || 3600);

/* ------------------------------------------------ helpers */

function signToken(payload) {
  const b64 = Buffer.from(JSON.stringify(payload)).toString('base64url');
  const sig = crypto.createHmac('sha256', getSigningKey()).update(b64).digest('base64url');
  return `${b64}.${sig}`;
}

function verifyToken(token) {
  try {
    const [b64, sig] = String(token).split('.');
    if (!b64 || !sig) return null;
    const expected = crypto.createHmac('sha256', getSigningKey()).update(b64).digest('base64url');
    if (!crypto.timingSafeEqual(Buffer.from(sig), Buffer.from(expected))) return null;
    const payload = JSON.parse(Buffer.from(b64, 'base64url').toString('utf8'));
    if (!payload || !payload.exp || Date.now() > payload.exp * 1000) return null;
    return payload;
  } catch {
    return null;
  }
}

function publicProductMeta(product) {
  return {
    id: product.id,
    title: product.title,
    price: product.price,
    currency: product.currency,
    pages: product.pages,
    format: product.format,
    category: product.category,
  };
}

/** Friendly message that never leaks server internals. */
function friendlyVerificationError() {
  return { verified: false, message: 'Your payment could not be verified at this time. Please contact support.' };
}

/* ------------------------------------------------ API routes */

app.get('/api/health', (_req, res) => {
  res.json({ ok: true, name: 'asamcy-server', time: Date.now() });
});

app.post('/api/paystack/verify', async (req, res) => {
  const { reference, productId } = req.body || {};

  if (!reference || typeof reference !== 'string' || !productId || typeof productId !== 'string') {
    return res.status(400).json({
      verified: false,
      message: 'Missing payment reference or product. Please return to the shop.',
    });
  }

  const secret = getSecret();
  if (!secret) {
    console.error('[verify] PAYSTACK_SECRET_KEY is not configured on the server.');
    return res.status(503).json(friendlyVerificationError());
  }

  const product = getProduct(productId);
  if (!product) {
    return res.status(404).json({
      verified: false,
      message: 'This product is no longer available. Please return to the shop.',
    });
  }

  try {
    const pRes = await fetch(`${PAYSTACK_API}/transaction/verify/${encodeURIComponent(reference)}`, {
      headers: { Authorization: `Bearer ${secret}` },
    });
    const data = await pRes.json();

    if (pRes.status === 404 || data.status === false) {
      return res.status(422).json({
        verified: false,
        message: 'We could not find this transaction. The payment may not have been completed.',
      });
    }

    const txn = data.data;
    const paidAmount = Number(txn?.amount || 0);
    const expectedAmount = Math.round(Number(product.price) * 100);
    const txnRef = String(txn?.reference || '');
    const metadataProduct = String(txn?.metadata?.productId || '');

    const checks = {
      statusSuccess: txn?.status === 'success',
      amountMatches: paidAmount === expectedAmount,
      currencyMatches: String(txn?.currency || '').toUpperCase() === String(product.currency).toUpperCase(),
      productMatches: !metadataProduct || metadataProduct === product.id,
    };
    console.log(`[verify] ${reference} ->`, JSON.stringify(checks));

    if (!Object.values(checks).every(Boolean)) {
      return res.status(422).json({
        verified: false,
        message: 'This transaction could not be validated. Please contact support.',
      });
    }

    const token = signToken({
      pid: product.id,
      ref: txnRef,
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + tokenTtl,
    });

    return res.json({
      verified: true,
      token,
      product: publicProductMeta(product),
      expiresIn: tokenTtl,
    });
  } catch (err) {
    console.error('[verify] network error:', err.message);
    return res.status(502).json(friendlyVerificationError());
  }
});

app.get('/api/download/:token', (req, res) => {
  const payload = verifyToken(req.params.token);

  if (!payload) {
    return res.status(401).json({
      message: 'This download link is invalid or has expired. Please verify your payment again.',
    });
  }

  const product = getProduct(payload.pid);
  if (!product) {
    return res.status(404).json({ message: 'Product not found.' });
  }

  const headers = {
    'Content-Type': 'application/pdf',
    'Content-Disposition': `attachment; filename="${encodeURIComponent(product.fileKey)}"`,
    'X-Content-Type-Options': 'nosniff',
    'Cache-Control': 'private, no-store',
  };

  res.set(headers);

  const remoteBase = process.env.PRIVATE_STORAGE_URL;
  if (remoteBase) {
    // Private remote storage (e.g. S3-compatible). Stream through — client
    // never learns the real location.
    const remoteUrl = `${remoteBase.replace(/\/$/, '')}/${encodeURIComponent(product.fileKey)}`;
    fetch(remoteUrl, {
      headers: process.env.PRIVATE_STORAGE_KEY
        ? { Authorization: `Bearer ${process.env.PRIVATE_STORAGE_KEY}` }
        : undefined,
    })
      .then((r) => {
        if (!r.ok) return res.status(404).json({ message: 'File not found.' });
        return r.body.pipe(res);
      })
      .catch(() => res.status(502).json({ message: 'Download temporarily unavailable.' }));
    return;
  }

  // Local private storage — NOT under public/, never web-accessible directly.
  const filePath = path.join(__dirname, 'private', 'books', product.fileKey);
  if (!fs.existsSync(filePath)) {
    console.error(`[download] missing private file for ${product.fileKey}`);
    return res.status(404).json({
      message: 'File is not available yet. Please contact support.',
    });
  }
  const stream = fs.createReadStream(filePath);
  stream.on('error', () => {
    if (!res.headersSent) res.status(500).json({ message: 'Download failed.' });
  });
  stream.pipe(res);
});

/* ------------------------------------------------ static (production) */

const distDir = path.join(__dirname, '..', 'dist');
if (fs.existsSync(distDir)) {
  app.use(express.static(distDir));
  app.get(/^(?!\/api).*/, (_req, res) => {
    res.sendFile(path.join(distDir, 'index.html'));
  });
  console.log('[server] serving built frontend from /dist');
} else {
  console.warn('[server] /dist not found — run `npm run build` before `npm start`.');
}

// Friendly JSON errors (malformed bodies, unexpected routes) — never
// leak stack traces or server internals to the browser.
app.use((err, _req, res, next) => {
  if (res.headersSent) return next(err);
  const status = err.status || err.statusCode || 500;
  console.error('[server] error:', err.message);
  res.status(status).json({
    message: 'Something went wrong. Please try again.',
  });
});

const port = Number(process.env.PORT || 8787);
app.listen(port, () => {
  console.log(`[server] listening on http://localhost:${port}`);
  console.log(
    getSecret()
      ? '[server] PAYSTACK_SECRET_KEY configured ✓'
      : '[server] WARNING: PAYSTACK_SECRET_KEY missing — verification will fail.'
  );
});