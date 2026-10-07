/**
 * GET /api/payment/verify/:reference
 * Independently verifies a transaction with Paystack and — only when
 * everything matches — marks the order PAID and issues a short-lived
 * download token. Nothing is ever granted client-side.
 */
import { verifyAndFulfil } from '../../../lib/payments.js';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    res.status(405).json({ message: 'Method not allowed.' });
    return;
  }

  const result = await verifyAndFulfil({ reference: req.query.reference });

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
}