/**
 * Book delivery backend — used by the Express server (local dev) and
 * the Vercel download function (production).
 *
 * Storage resolution order:
 *   1. Vercel Blob    — BLOB_READ_WRITE_TOKEN set (production / vercel dev)
 *   2. Remote private — PRIVATE_STORAGE_URL set (S3-compatible)
 *   3. Local folder   — server/private/books (dev only)
 *
 * The browser never receives the real storage location.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { getProduct } from '../src/data/products.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const bookHeaders = (fileKey) => ({
  'Content-Type': 'application/pdf',
  'Content-Disposition': `attachment; filename="${encodeURIComponent(fileKey)}"`,
  'X-Content-Type-Options': 'nosniff',
  'Cache-Control': 'private, no-store',
});

/**
 * Resolves the actual file for a valid download token and streams/sends it.
 * Sets response headers. On failure sends a friendly JSON response — the
 * caller should stop after awaiting this.
 */
export async function sendBookFile(req, res, { productId }) {
  const product = getProduct(productId);
  if (!product || !product.fileKey) {
    res.status(404).json({ message: 'Product not found.' });
    return;
  }

  const blobToken = process.env.BLOB_READ_WRITE_TOKEN;
  const remoteBase = process.env.PRIVATE_STORAGE_URL;
  const localDir = path.join(__dirname, '..', 'server', 'private', 'books');

  const pathname = `books/${product.fileKey}`;

  // 1) Vercel Blob (private, token-protected store — ideal for production)
  if (blobToken) {
    try {
      const { download } = await import('@vercel/blob');
      const blob = await download(pathname);
      res.set(bookHeaders(product.fileKey));
      const buffer = Buffer.from(await blob.arrayBuffer());
      res.send(buffer);
    } catch (err) {
      console.error('[download] blob error:', err.message);
      if (!res.headersSent) {
        res.status(404).json({ message: 'File is not available yet. Please contact support.' });
      }
    }
    return;
  }

  // 2) Generic private remote (S3-compatible, etc.) — stream through
  if (remoteBase) {
    try {
      const remoteUrl = `${remoteBase.replace(/\/$/, '')}/${encodeURIComponent(product.fileKey)}`;
      const r = await fetch(remoteUrl, {
        headers: process.env.PRIVATE_STORAGE_KEY
          ? { Authorization: `Bearer ${process.env.PRIVATE_STORAGE_KEY}` }
          : undefined,
      });
      if (!r.ok || !r.body) {
        res.status(404).json({ message: 'File not found.' });
        return;
      }
      res.set(bookHeaders(product.fileKey));
      r.body.pipe(res);
    } catch {
      if (!res.headersSent) res.status(502).json({ message: 'Download temporarily unavailable.' });
    }
    return;
  }

  // 3) Local private folder (dev). NOT under public/, never web-accessible.
  const filePath = path.join(localDir, product.fileKey);
  if (!fs.existsSync(filePath)) {
    console.error(`[download] missing private file for ${product.fileKey}`);
    res.status(404).json({ message: 'File is not available yet. Please contact support.' });
    return;
  }
  res.set(bookHeaders(product.fileKey));
  const stream = fs.createReadStream(filePath);
  stream.on('error', () => {
    if (!res.headersSent) res.status(500).json({ message: 'Download failed.' });
  });
  stream.pipe(res);
}