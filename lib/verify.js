/**
 * Shared Paystack verification + download-token logic.
 * Used by BOTH the local Express server (server/index.mjs) and the
 * Vercel serverless functions (api/*). Monolithic — still stateless.
 *
 * The Paystack SECRET key only ever exists in server-side env vars.
 */
import crypto from 'node:crypto';

export const getSecret = () => process.env.PAYSTACK_SECRET_KEY || '';
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