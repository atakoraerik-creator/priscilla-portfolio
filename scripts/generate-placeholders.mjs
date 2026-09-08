/**
 * Generates elegant placeholder SVG images for books and gallery items.
 * Run with: node scripts/generate-placeholders.mjs
 * Replace these with real photography as it becomes available.
 */
import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');

const BOOKS = [
  { id: 'cake-masterclass', title: 'Cake Masterclass', sub: 'Professional Decoration' },
  { id: 'dessert-artistry', title: 'Dessert Artistry', sub: 'Elegant Plated Desserts' },
  { id: 'the-cake-artists-guide', title: 'The Cake Artist\u2019s Guide', sub: 'Essentials & Techniques' },
  { id: 'pastry-fundamentals', title: 'Pastry Fundamentals', sub: 'From Scratch' },
  { id: 'celebration-cakes', title: 'Celebration Cakes', sub: 'Designs for Every Occasion' },
  { id: 'chocolate-confectionery', title: 'Chocolate Confectionery', sub: 'Bonbons & More' },
];

const GALLERY = [
  { id: 'cake-01', title: 'Elegant Celebration Cake', category: 'Cakes', hue: 'chocolate' },
  { id: 'cake-02', title: 'Layered Buttercream Cake', category: 'Cakes', hue: 'ivory' },
  { id: 'cake-03', title: 'Modern Wedding Cake', category: 'Cakes', hue: 'gold' },
  { id: 'pastry-01', title: 'Piped Puffs & Éclairs', category: 'Pastries', hue: 'beige' },
  { id: 'pastry-02', title: 'Flaky Butter Pastries', category: 'Pastries', hue: 'ivory' },
  { id: 'dessert-01', title: 'Plated Dessert', category: 'Desserts', hue: 'chocolate' },
  { id: 'dessert-02', title: 'Layered Trifle Glass', category: 'Desserts', hue: 'gold' },
  { id: 'bread-01', title: 'Artisan Loaves', category: 'Bread', hue: 'beige' },
  { id: 'special-01', title: 'Cake Commission', category: 'Special Creations', hue: 'gold' },
];

const PALETTE = {
  chocolate: {
    bg: 'linear-gradient(150deg,#24150B 0%,#452A16 55%,#58371C 100%)',
    text: '#F3ECDF',
    accent: '#D9B36A',
    frame: 'rgba(217,179,106,0.5)',
  },
  gold: {
    bg: 'linear-gradient(150deg,#24150B 0%,#6B4423 60%,#B8862F 130%)',
    text: '#FDFBF7',
    accent: '#D9B36A',
    frame: 'rgba(253,251,247,0.45)',
  },
  ivory: {
    bg: 'linear-gradient(150deg,#FDFBF7 0%,#F3ECDF 60%,#E9DCC8 100%)',
    text: '#452A16',
    accent: '#B8862F',
    frame: 'rgba(107,68,35,0.45)',
  },
  beige: {
    bg: 'linear-gradient(150deg,#F7F1E7 0%,#E9DCC8 60%,#DCC9AC 100%)',
    text: '#452A16',
    accent: '#9C6F24',
    frame: 'rgba(107,68,35,0.4)',
  },
};

function bookCover(p) {
  const { bg, text, accent, frame } = PALETTE[p.hue ?? 'chocolate'];
  return `<svg xmlns="http://www.w3.org/2000/svg" width="800" height="1100" viewBox="0 0 800 1100">
  <defs>
    <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">${bg.replace('linear-gradient(150deg,', '')}</linearGradient>
  </defs>
  <rect width="800" height="1100" fill="url(#g)"/>
  <rect x="56" y="56" width="688" height="988" fill="none" stroke="${frame}" stroke-width="3"/>
  <rect x="76" y="76" width="648" height="948" fill="none" stroke="${frame}" stroke-width="1" stroke-opacity="0.5"/>
  <text x="400" y="260" font-family="Georgia, 'Times New Roman', serif" font-size="34" letter-spacing="14" fill="${accent}" text-anchor="middle">PRISCILLA ADUBIA ASAMOAH</text>
  <line x1="330" y1="300" x2="470" y2="300" stroke="${accent}" stroke-width="2"/>
  <circle cx="400" cy="250" r="4" fill="${accent}"/>
  <text x="400" y="560" font-family="Georgia, 'Times New Roman', serif" font-size="76" fill="${text}" text-anchor="middle" font-style="italic" letter-spacing="2">${p.title}</text>
  <text x="400" y="640" font-family="Georgia, 'Times New Roman', serif" font-size="30" fill="${accent}" text-anchor="middle" letter-spacing="8">${p.sub}</text>
  <g transform="translate(400,760)" fill="none" stroke="${accent}" stroke-width="4" stroke-linecap="round">
    <path d="M 0 -90 C 60 -60 60 40 0 90 C -60 40 -60 -60 0 -90 Z"/>
    <line x1="0" y1="-70" x2="0" y2="70"/>
    <line x1="0" y1="-40" x2="-34" y2="-8"/>
    <line x1="0" y1="-10" x2="34" y2="22"/>
    <line x1="0" y1="20" x2="-30" y2="52"/>
    <circle cx="0" cy="-95" r="6" fill="${accent}" stroke="none"/>
  </g>
  <text x="400" y="980" font-family="Georgia, 'Times New Roman', serif" font-size="24" letter-spacing="6" fill="${text}" text-anchor="middle">PDF DIGITAL BOOK</text>
</svg>`;
}

function galleryArt(g) {
  const { bg, text, accent, frame } = PALETTE[g.hue];
  return `<svg xmlns="http://www.w3.org/2000/svg" width="900" height="700" viewBox="0 0 900 700">
  <rect width="900" height="700" fill="${g.hue === 'ivory' || g.hue === 'beige' ? '#FDFBF7' : 'url(#spine)'}"/>
  <defs>
    <pattern id="dots" width="26" height="26" patternUnits="userSpaceOnUse">
      <circle cx="3" cy="3" r="2" fill="${accent}" opacity="0.16"/>
    </pattern>
  </defs>
  <rect width="900" height="700" fill="url(#dots)"/>
  <rect x="30" y="30" width="840" height="640" fill="none" stroke="${frame}" stroke-width="3"/>
  <rect x="52" y="52" width="796" height="596" fill="none" stroke="${frame}" stroke-width="1" stroke-opacity="0.5"/>
  <g transform="translate(450,300)" fill="none" stroke="${accent}" stroke-width="5" stroke-linecap="round" stroke-linejoin="round">
    <path d="M 0 -130 C 90 -90 90 60 0 130 C -90 60 -90 -90 0 -130 Z"/>
    <line x1="0" y1="-100" x2="0" y2="100"/>
    <line x1="0" y1="-56" x2="-52" y2="-12"/>
    <line x1="0" y1="-14" x2="50" y2="30"/>
    <line x1="0" y1="28" x2="-44" y2="72"/>
    <circle cx="0" cy="-138" r="9" fill="${accent}" stroke="none"/>
    <path d="M -60 150 H 60" stroke-width="4" opacity="0.7"/>
  </g>
  <text x="450" y="460" font-family="Georgia, 'Times New Roman', serif" font-size="46" fill="${g.hue === 'ivory' || g.hue === 'beige' ? '#452A16' : '#FDFBF7'}" text-anchor="middle" font-style="italic">${g.title}</text>
  <text x="450" y="512" font-family="Arial, Helvetica, sans-serif" font-size="22" letter-spacing="10" fill="${accent}" text-anchor="middle">${g.category.toUpperCase()}</text>
  <text x="450" y="642" font-family="Arial, Helvetica, sans-serif" font-size="16" letter-spacing="6" fill="${frame}" text-anchor="middle">PLACEHOLDER IMAGE</text>
</svg>`;
}

function writeRel(path, content) {
  const full = join(root, path);
  mkdirSync(dirname(full), { recursive: true });
  writeFileSync(full, content);
}

BOOKS.forEach((b) => writeRel(`public/images/books/${b.id}.svg`, bookCover(b)));
GALLERY.forEach((g) =>
  writeRel(`public/images/gallery/${g.id}.svg`, galleryArt(g))
);

writeRel(
  'public/images/placeholders/portrait.svg',
  galleryArt({ id: 'portrait', title: 'Portrait', category: 'Coming Soon', hue: 'ivory' })
);

console.log(`Generated ${BOOKS.length} book covers + ${GALLERY.length} gallery placeholders`);