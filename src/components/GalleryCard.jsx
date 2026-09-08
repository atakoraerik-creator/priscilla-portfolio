import { motion } from 'framer-motion';

export default function GalleryCard({ item, onOpen, index = 0 }) {
  return (
    <motion.figure
      layout
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.5, delay: (index % 4) * 0.06 }}
      className="group relative cursor-zoom-in overflow-hidden rounded-2xl bg-chocolate-50 shadow-card break-inside-avoid"
    >
      <button
        type="button"
        onClick={() => onOpen(item)}
        className="block w-full text-left"
        aria-label={`Open ${item.title} in lightbox`}
      >
        <img
          src={item.image}
          alt={item.title}
          loading="lazy"
          className="w-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <figcaption className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-chocolate-900/85 via-chocolate-900/40 to-transparent p-5 pt-16 opacity-95 transition-opacity duration-300 group-hover:opacity-100">
          <p className="font-serif text-lg text-ivory-50">{item.title}</p>
          <p className="mt-0.5 text-[10px] uppercase tracking-[0.25em] text-gold-300">
            {item.category}
          </p>
        </figcaption>
      </button>
    </motion.figure>
  );
}