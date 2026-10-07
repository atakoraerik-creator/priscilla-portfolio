/**
 * POST /api/payment/initialize
 * Body: { productId, customerName?, customerEmail, callbackUrl? }
 * Validates the order server-side, asks Paystack to open a transaction
 * and returns the authorization_url to redirect the customer to.
 * The SECRET key only exists in server env vars.
 */
import { initializeTransaction } from '../../lib/payments.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    res.status(405).json({ message: 'Method not allowed.' });
    return;
  }

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
}