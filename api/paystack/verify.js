/**
 * POST /api/paystack/verify
 * Body: { reference, productId }
 * Verifies the transaction server-side with Paystack, then (and only then)
 * returns a short-lived, HMAC-signed download token.
 * The Paystack SECRET key only exists in server env vars.
 */
import { verifyPayment } from '../../lib/verify.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    res.status(405).json({ verified: false, message: 'Method not allowed.' });
    return;
  }

  const { reference, productId } = req.body || {};
  const result = await verifyPayment({ reference, productId });

  if (!result.ok) {
    res.status(result.status).json({ verified: false, message: result.message });
    return;
  }

  res.json({
    verified: true,
    token: result.token,
    product: result.product,
    expiresIn: Number(process.env.DOWNLOAD_TOKEN_TTL || 3600),
  });
}