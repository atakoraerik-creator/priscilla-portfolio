/**
 * ============================================================
 * SITE CONFIGURATION — edit everything about Priscilla here.
 * ============================================================
 * Fields left as an empty string ("") are treated as "not set"
 * and the corresponding UI sections are hidden automatically.
 * Replace the placeholder contact values with real ones.
 */

export const site = {
  name: 'Priscilla Adubia Asamoah',
  firstName: 'Priscilla',
  title: 'Pastry Chef | Cake Artist | Dessert Specialist',
  role: 'Pastry Chef & Cake Artist',
  tagline:
    'Crafting beautiful pastries, elegant cakes and memorable dessert experiences through creativity, precision and passion.',

  hero: {
    // Real photography goes here. Placeholders are used until supplied.
    image: '/images/priscilla/hero.jpg',
    imageAlt: 'A pastry creation by Priscilla Adubia Asamoah',
  },

  about: {
    portrait: '/images/priscilla/profile.jpg',
    portraitAlt: 'Portrait of Priscilla Adubia Asamoah',
    // Biography — EDIT with real information as it becomes available.
    biography: [
      'Priscilla Adubia Asamoah is a pastry chef and cake artist with a deep love for craft, detail and flavour. Her journey has grown through hands-on kitchen experience, dedicated training in cake artistry and a constant drive to elevate everything she creates.',
      'For Priscilla, pastry is more than technique — it is a language of celebration. Every cake is designed to mark a moment, every dessert plated to be remembered.',
    ],
    philosophy:
      'Beautiful desserts are made with patience, precision and heart. I believe every creation should look as extraordinary as it tastes — and that the smallest detail is the one people remember.',
    passion:
      'From perfectly piped buttercream to delicate plated desserts, Priscilla is happiest at the pastry bench — turning simple ingredients into something elegant, refined and unmistakably hers.',
    strengths: [
      'Cake design & artistic decoration',
      'Pastry and dessert production',
      'Creative flavour development',
      'Attention to detail and finish',
      'Professional kitchen practice',
    ],
    // Highlights — only list facts you can confirm. Keep placeholders blank until known.
    highlights: [],
  },

  contact: {
    // Replace with real values. Empty = section hidden on the site.
    email: '',
    phone: '',
    whatsapp: '', // international format, digits only, e.g. "233201234567"
    location: '',
    // Leave empty to hide the corresponding social icon in the footer.
    social: {
      instagram: '',
      facebook: '',
      linkedin: '',
      whatsapp: '',
    },
  },

  // Used on the Contact page & footer.
  footerNote: 'Pastry Chef | Cake Artist | Dessert Specialist',
};

export const defaultSeo = {
  title: `${site.name} | Pastry Chef & Cake Artist`,
  description:
    'Priscilla Adubia Asamoah — professional pastry chef, cake artist and dessert specialist. Explore creations, professional experience and digital pastry books.',
};