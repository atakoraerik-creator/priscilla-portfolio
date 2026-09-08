/**
 * Generates minimal placeholder PDFs for the sample products so the
 * secure-download flow can be tested end-to-end.
 *
 * Run with: node scripts/generate-sample-pdfs.mjs
 * REGENERATE THIS AFTER REPLACING WITH REAL BOOKS:
 * place the real PDFs inside  server/private/books/<fileKey>.
 *
 * IMPORTANT: server/private/ is NOT part of the web bundle and must
 * never be copied into public/ in production.
 */
import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { products } from '../src/data/products.js';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const out = join(root, 'server', 'private', 'books');
mkdirSync(out, { recursive: true });

function esc(s) {
  return String(s).replace(/\\/g, '\\\\').replace(/\(/g, '\\(').replace(/\)/g, '\\)');
}

function makePdf(title, subtitle) {
  const lines = [
    'BT',
    '20 0 0 20 60 720 Tm',
    `(\\2450 ${esc(title)}) Tj`,
    'ET',
  ];
  const text = lines.join('\n');
  const content = `<</Length ${text.length}>>\nstream\n${text}\nendstream`;

  const objects = [
    { o: '<</Type /Catalog /Pages 2 0 R>>' },
    { o: '<</Type /Pages /Kids [3 0 R] /Count 1>>' },
    { o: `<</Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Contents 4 0 R /Resources <</Font <</F1 5 0 R>>>> >>` },
    { o: content },
    { o: '<</Type /Font /Subtype /Type1 /BaseFont /Helvetica>>' },
  ];

  let pdf = '%PDF-1.4\n';
  const offsets = [];
  objects.forEach((obj, i) => {
    offsets.push(Buffer.byteLength(pdf, 'latin1'));
    pdf += `${i + 1} 0 obj\n${obj.o}\nendobj\n`;
  });

  const xrefStart = Buffer.byteLength(pdf, 'latin1');
  pdf += `xref\n0 ${objects.length + 1}\n0000000000 65535 f \n`;
  for (const off of offsets) {
    pdf += `${String(off).padStart(10, '0')} 00000 n \n`;
  }
  pdf += `trailer\n<</Size ${objects.length + 1} /Root 1 0 R>>\nstartxref\n${xrefStart}\n%%EOF\n`;
  return pdf;
}

for (const p of products) {
  const pdf = makePdf(`${p.title}`, `Sample placeholder book by Priscilla Adubia Asamoah`);
  writeFileSync(join(out, p.fileKey), pdf, 'latin1');
  console.log(`wrote server/private/books/${p.fileKey}`);
}
console.log(`\nGenerated ${products.length} sample PDFs. Replace with real books before launch.`);