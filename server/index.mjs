/**
 * ============================================================
 *  LOCAL DEV SERVER — Paystack payments + secure downloads
 * ============================================================
 *  Express, used for local development (npm run dev).
 *  Production on Vercel uses the serverless functions in /api,
 *  which share the exact same payment logic via /lib.
 *
 *  Endpoints
 *    POST /api/payment/initialize          { productId, customerName?, customerEmail, callbackUrl? }
 *    GET  /api/payment/verify/:reference
 *    POST /api/paystack/webhook            (signature-verified)
 *    GET  /api/download/:token
 *    GET  /api/health
 *
 *  Environment (.env — never committed)
 *    PAYSTACK_SECRET_KEY        required for payments
 *    VITE_PAYSTACK_PUBLIC_KEY   (frontend only)
 *    PORT                       default 8787
 *    DOWNLOAD_SECRET            token signing key (defaults to PAYSTACK_SECRET_KEY)
 *    DOWNLOAD_TOKEN_TTL         seconds, default 3600
 *    BLOB_READ_WRITE_TOKEN      optional — Vercel Blob (production storage)
 *    PRIVATE_STORAGE_URL        optional — S3-compatible remote storage
 *    UPSTASH_REDIS_REST_URL     optional — order store (production)
 *    UPSTASH_REDIS_REST_TOKEN   optional — order store (production)
 *    ALLOWED_ORIGINS            comma-separated extra CORS origins
 */
import express from 'express';
import cors from 'cors';
import path from 'node:path';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';
import 'dotenv/config';
import { verifyToken, hasSecret } from '../lib/verify.js';
import { sendBookFile } from '../lib/storage.js';
import {
  initializeTransaction,
  verifyAndFulfil,
  handleWebhook,
  friendlyInternalError,
} from '../lib/payments.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();

// JSON body parsing for everything EXCEPT the webhook, which needs the
// raw bytes to verify the Paystack HMAC signature.
const jsonParser = express.json();
app.use((req, res, next) => {
  if (req.path === '/api/paystack/webhook') return next();
  jsonParser(req, res, next);
});

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

/* ------------------------------------------------ API routes */

app.get('/api/health', (_req, res) => {
  res.json({ ok: true, name: 'asamcy-server', time: Date.now() });
});

app.post('/api/payment/initialize', async (req, res) => {
  const { productId, customerName, customerEmail, callbackUrl } = req.body || {};
  const result = await initializeTransaction({
    productId,
    customerName,
    customerEmail,
    callbackUrl,
  });

  if (!result.ok) {
    res.status(result.status).json({ message: result.message });
    return;
  }
  res.json({ ok: true, checkout: result.checkout, product: result.product });
});

app.get('/api/payment/verify/:reference', async (req, res) => {
  const result = await verifyAndFulfil({ reference: req.params.reference });

  if (!result.ok) {
    res.status(result.status).json({ verified: false, message: result.message });
    return;
  }
  res.json({
    verified: true,
    token: result.token,
    product: result.product,
    order: result.order,
    expiresIn: Number(process.env.DOWNLOAD_TOKEN_TTL || 3600),
  });
});

app.post('/api/paystack/webhook', express.raw({ type: '*/*' }), async (req, res) => {
  const rawBody = Buffer.isBuffer(req.body) ? req.body.toString('utf8') : String(req.body || '');
  const signature = String(req.headers['x-paystack-signature'] || '');
  const result = await handleWebhook({ rawBody, signature });
  res.status(result.status).json({ received: result.status === 200, message: result.message });
});

app.get('/api/download/:token', (req, res) => {
  const payload = verifyToken(req.params.token);

  if (!payload) {
    res.status(401).json({
      message: 'This download link is invalid or has expired. Please verify your payment again.',
    });
    return;
  }

  sendBookFile(req, res, { productId: payload.pid });
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
  if (err.type === 'entity.size.limit') {
    return res.status(413).json({ message: 'Request body is too large.' });
  }
  const status = err.status || err.statusCode || 500;
  console.error('[server] error:', err.message);
  res.status(status).json({ message: friendlyInternalError() });
});

const port = Number(process.env.PORT || 8787);
app.listen(port, () => {
  console.log(`[server] listening on http://localhost:${port}`);
  console.log(
    hasSecret()
      ? '[server] PAYSTACK_SECRET_KEY configured ✓'
      : '[server] WARNING: PAYSTACK_SECRET_KEY missing — payments will fail.'
  );
});