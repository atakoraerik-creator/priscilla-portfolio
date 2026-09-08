/**
 * Uploads the book PDFs from server/private/books/ to Vercel Blob (private).
 *
 * Usage (needs a local env var — never committed):
 *   $env:BLOB_READ_WRITE_TOKEN="vercel_blob_rw_..." ;  # PowerShell
 *   npm run books:upload
 *
 * In Vercel, set the same BLOB_READ_WRITE_TOKEN and add the Blob store
 * (Storage → Create → Blob). Uploads land under `books/<fileKey>` — the
 * same key the download function expects.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { put } from '@vercel/blob';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const booksDir = path.join(__dirname, '..', 'server', 'private', 'books');

if (!process.env.BLOB_READ_WRITE_TOKEN) {
  console.error('Missing BLOB_READ_WRITE_TOKEN. Get one at vercel.com > project > Storage.');
  process.exit(1);
}

const files = fs.readdirSync(booksDir).filter((f) => f.endsWith('.pdf'));
if (files.length === 0) {
  console.error(`No PDFs found in ${booksDir}`);
  process.exit(1);
}

for (const file of files) {
  const content = fs.readFileSync(path.join(booksDir, file));
  const blob = await put(`books/${file}`, content, {
    access: 'private',
    contentType: 'application/pdf',
    addRandomSuffix: false,
  });
  console.log(`uploaded books/${file} -> ${blob.url}`);
}
console.log(`\nDone: ${files.join(', ')}`);