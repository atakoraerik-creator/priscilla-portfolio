/**
 * ============================================================
 * PRODUCT CATALOGUE — the ENTIRE shop is driven by this file.
 * ============================================================
 * To add a product, add one more object to the array.
 * The Shop page, product details page and checkout all read
 * from this file automatically. No database involved.
 *
 * Fields:
 *  id          string — used in the URL  /shop/<id>  (unique)
 *  title       string
 *  description string — short card description
 *  longDescription string — expanded description on the detail page
 *  whatIsInside array  — bullet list shown on the detail page
 *  price       number — in `currency`
 *  currency    string — "GHS" (Paystack-supported)
 *  cover       string — cover image path in /public/images/books
 *  category    string — shown on cards (e.g. "Cake", "Pastry")
 *  pages       number — page count if known
 *  format      string — "PDF"
 *  fileKey     string — private storage key for the actual PDF.
 *                       The file itself must live OUTSIDE public/.
 *  featured    boolean — show on the home page featured row
 *
 * NOTE: The titles, descriptions and prices below are clearly
 * marked EXAMPLE products. Replace them with Priscilla's real
 * books once they are ready. The download files in
 * server/private/books must use the same fileKey ids.
 */

export const products = [
  {
    id: 'cake-masterclass',
    title: 'Cake Masterclass',
    description:
      'A practical guide to professional cake decoration — piping, smoothing and elegant finishes.',
    longDescription:
      'Cake Masterclass walks you through the techniques Priscilla uses every day in her cake studio: baking level, even layers, crumb-coating like a professional, and piping buttercream with confidence. A clear, beginner-friendly reference built for home bakers who want professional results.',
    whatIsInside: [
      'Professional cake preparation & layering',
      'Smoothing and crumb-coating techniques',
      'Buttercream piping patterns explained',
      'Decorative finishes & finale touches',
      'Troubleshooting common cake problems',
    ],
    price: 150,
    currency: 'GHS',
    cover: '/images/books/cake-masterclass.svg',
    category: 'Cake',
    pages: 80,
    format: 'PDF',
    fileKey: 'cake-masterclass.pdf',
    featured: true,
  },
  {
    id: 'dessert-artistry',
    title: 'Dessert Artistry',
    description:
      'Elegant plated desserts and refined sweet compositions for the modern pastry lover.',
    longDescription:
      'Dessert Artistry focuses on the presentation side of pastry. Learn how simple components — creams, fruit, chocolate, tuiles — come together into restaurant-quality plated desserts that feel effortless and look unforgettable.',
    whatIsInside: [
      'Building a balanced plated dessert',
      'Essential components: creams, sauces, tuiles',
      'Plating composition principles',
      'Chocolate work for decoration',
      'Seasonal flavour pairing ideas',
    ],
    price: 120,
    currency: 'GHS',
    cover: '/images/books/dessert-artistry.svg',
    category: 'Dessert',
    pages: 64,
    format: 'PDF',
    fileKey: 'dessert-artistry.pdf',
    featured: true,
  },
  {
    id: 'the-cake-artists-guide',
    title: 'The Cake Artist\u2019s Guide',
    description:
      'The essentials of professional cake art — design, structure and flawless execution.',
    longDescription:
      'A complete reference for anyone who wants to call themselves a cake artist. From understanding structure and support to finishing details that make cakes look like they came from a professional studio.',
    whatIsInside: [
      'Cake structure & support fundamentals',
      'Designing your cake with intent',
      'Working cleanly and efficiently',
      'Finishing details that elevate results',
      'Building your own cake portfolio',
    ],
    price: 180,
    currency: 'GHS',
    cover: '/images/books/the-cake-artists-guide.svg',
    category: 'Cake',
    pages: 96,
    format: 'PDF',
    fileKey: 'the-cake-artists-guide.pdf',
    featured: true,
  },
  {
    id: 'pastry-fundamentals',
    title: 'Pastry Fundamentals',
    description:
      'From scratch: the essential doughs, batters and techniques every pastry chef starts with.',
    longDescription:
      'Pastry Fundamentals is a step-by-step introduction to the building blocks of pastry work, written for students and home bakers alike. It includes the classic doughs, batters and methods that form the foundation of professional patisserie.',
    whatIsInside: [
      'Essential doughs, from scratch',
      'Core batters and methods explained',
      'Temperature and timing fundamentals',
      'Common mistakes and how to avoid them',
      'A glossary of pastry terms',
    ],
    price: 130,
    currency: 'GHS',
    cover: '/images/books/pastry-fundamentals.svg',
    category: 'Pastry',
    pages: 72,
    format: 'PDF',
    fileKey: 'pastry-fundamentals.pdf',
    featured: false,
  },
  {
    id: 'celebration-cakes',
    title: 'Celebration Cakes',
    description:
      'Ideas, themes and simple decorating routes for cakes that mark life\u2019s big moments.',
    longDescription:
      'Celebration Cakes collects approachable cake concepts for birthdays, weddings, anniversaries and key milestones. Each concept includes a decorating route and the techniques needed to pull it off at home.',
    whatIsInside: [
      'Birthday, wedding & milestone concepts',
      'Simple piping designs for events',
      'Colour and theme pairing guidance',
      'Timeline for building celebration cakes',
      'Serving and storage recommendations',
    ],
    price: 140,
    currency: 'GHS',
    cover: '/images/books/celebration-cakes.svg',
    category: 'Cake',
    pages: 84,
    format: 'PDF',
    fileKey: 'celebration-cakes.pdf',
    featured: false,
  },
  {
    id: 'chocolate-confectionery',
    title: 'Chocolate Confectionery',
    description:
      'Tempering, ganache and hand-crafted chocolate treats for the enthusiastic home maker.',
    longDescription:
      'A friendly introduction to chocolate work: how to temper chocolate at home, enrich your ganaches and shape elegant finished pieces. Ideal for bakers who want to add a professional chocolate touch to their repertoire.',
    whatIsInside: [
      'Tempering chocolate at home',
      'Ganache that sets and slices perfectly',
      'Moulding and enrobing basics',
      'Flavour infusions for chocolates',
      'Storage & shelf-life advice',
    ],
    price: 110,
    currency: 'GHS',
    cover: '/images/books/chocolate-confectionery.svg',
    category: 'Confectionery',
    pages: 58,
    format: 'PDF',
    fileKey: 'chocolate-confectionery.pdf',
    featured: false,
  },
];

/** Finds a product by id, returns undefined when missing. */
export const getProduct = (id) => products.find((p) => p.id === id);

/** Products flagged as featured (home page). */
export const getFeaturedProducts = () => products.filter((p) => p.featured);

/** Formats an amount for display, respecting minor units (kobo/pesewas). */
export const formatMoney = (amountInMinorUnits, currency = 'GHS') => {
  const number = (Number(amountInMinorUnits) || 0) / 100;
  try {
    return new Intl.NumberFormat('en', {
      style: 'currency',
      currency: currency === 'NGN' ? 'NGN' : 'GHS',
      minimumFractionDigits: 2,
    }).format(number);
  } catch {
    return `${amountInMinorUnits} ${currency}`;
  }
};

export const formatPrice = (product) =>
  `${(product ? product.price : 0).toFixed(2)} ${product ? product.currency : 'GHS'}`;