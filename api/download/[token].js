/**
 * GET /api/download/[token]
 * Validates the HMAC download token, then streams the PDF from private
 * storage (Vercel Blob). Never serves unauthenticated / expired files.
 */
import { verifyToken } from '../../lib/verify.js';
import { sendBookFile } from '../../lib/storage.js';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    res.status(405).json({ message: 'Method not allowed.' });
    return;
  }

  const { token } = req.query;
  const payload = verifyToken(token);
  if (!payload) {
    res.status(401).json({ message: 'This download link has expired or is invalid. Please contact support.' });
    return;
  }

  await sendBookFile(req, res, { productId: payload.pid });
}