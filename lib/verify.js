/**
 * Shared Paystack verification + download-token logic.
 * Used by BOTH the local Express server (server/index.mjs) and the
 * Vercel serverless functions (api/*). Monolithic — still stateless.
 *
 * The Paystack SECRET key only ever exists in server-side env vars.
 */
import crypto from 'node:crypto';
import { getProduct } from '../src/data/products.js';

const PAYSTACK_API = 'https://api.paystack.co';

const getSecret = () => process.env.PAYSTACK_SECRET_KEY || '';
const getSigningKey = () => process.env.DOWNLOAD_SECRET || getSecret();
const tokenTtl = Number(process.env.DOWNLOAD_TOKEN_TTL || 3600);

export const hasSecret = () => Boolean(getSecret());

export function signToken(payload) {
  const b64 = Buffer.from(JSON.stringify(payload)).toString('base64url');
  const sig = crypto.createHmac('sha256', getSigningKey()).update(b64).digest('base64url');
  return `${b64}.${sig}`;
}

export function verifyToken(token) {
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

export function issueDownloadToken(productId, reference) {
  return signToken({
    pid: productId,
    ref: reference,
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor(Date.now() / 1000) + tokenTtl,
  });
}

export function publicProductMeta(product) {
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
const friendly = () => 'Your payment could not be verified at this time. Please contact support.';

/**
 * Verifies a Paystack transaction against the product catalogue.
 * Returns { ok:true, token, product }
 *     or { ok:false, status, message }
 * A download token is issued ONLY when every check passes.
 */
export async function verifyPayment({ reference, productId }) {
  if (!reference || typeof reference !== 'string' || !productId || typeof productId !== 'string') {
    return {
      ok: false,
      status: 400,
      message: 'Missing payment reference or product. Please return to the shop.',
    };
  }

  const secret = getSecret();
  if (!secret) {
    console.error('[verify] PAYSTACK_SECRET_KEY is not configured.');
    return { ok: false, status: 503, message: friendly() };
  }

  const product = getProduct(productId);
  if (!product) {
    return {
      ok: false,
      status: 404,
      message: 'This product is no longer available. Please return to the shop.',
    };
  }

  try {
    const pRes = await fetch(
      `${PAYSTACK_API}/transaction/verify/${encodeURIComponent(reference)}`,
      { headers: { Authorization: `Bearer ${secret}` } }
    );
    const data = await pRes.json();

    if (pRes.status === 404 || data.status === false) {
      return {
        ok: false,
        status: 422,
        message: 'We could not find this transaction. The payment may not have been completed.',
      };
    }

    const txn = data.data;
    const paidAmount = Number(txn?.amount || 0);
    const expectedAmount = Math.round(Number(product.price) * 100);
    const metadataProduct = String(txn?.metadata?.productId || '');

    const checks = {
      statusSuccess: txn?.status === 'success',
      amountMatches: paidAmount === expectedAmount,
      currencyMatches:
        String(txn?.currency || '').toUpperCase() === String(product.currency).toUpperCase(),
      productMatches: !metadataProduct || metadataProduct === product.id,
    };
    console.log(`[verify] ${reference} ->`, JSON.stringify(checks));

    if (!Object.values(checks).every(Boolean)) {
      return {
        ok: false,
        status: 422,
        message: 'This transaction could not be validated. Please contact support.',
      };
    }

    return {
      ok: true,
      token: issueDownloadToken(product.id, String(txn?.reference || reference)),
      product: publicProductMeta(product),
    };
  } catch (err) {
    console.error('[verify] network error:', err.message);
    return { ok: false, status: 502, message: friendly() };
  }
}