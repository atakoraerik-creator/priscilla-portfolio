/**
 * POST /api/paystack/webhook
 * Paystack pushes events here (charge.success etc.). The signature
 * (x-paystack-signature, HMAC-SHA512 of the raw body) is verified with
 * the SECRET key before anything is trusted.
 */
import { handleWebhook } from '../../lib/payments.js';

function readRawBody(req) {
  return new Promise((resolve) => {
    const chunks = [];
    req.on('data', (chunk) => chunks.push(chunk));
    req.on('end', () => resolve(Buffer.concat(chunks).toString('utf8')));
    req.on('error', () => resolve(''));
  });
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    res.status(405).json({ message: 'Method not allowed.' });
    return;
  }

  let rawBody = await readRawBody(req);
  if (!rawBody && req.body && typeof req.body === 'object') {
    // Some Vercel runtimes pre-parse JSON bodies; fall back best-effort.
    rawBody = JSON.stringify(req.body);
  }

  const signature = String(req.headers['x-paystack-signature'] || '');
  const result = await handleWebhook({ rawBody, signature });

  res.status(result.status).json({ received: result.status === 200, message: result.message });
}