import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import PaymentButton from './PaymentButton';

export default function ProductCard({ product, index = 0 }) {
  const price = Number(product.price) || 0;

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.5, delay: Math.min(index, 5) * 0.07, ease: 'easeOut' }}
      whileHover={{ y: -8 }}
      className="group flex flex-col overflow-hidden rounded-2xl bg-white shadow-card ring-1 ring-chocolate-500/5 transition-[box-shadow,ring-color] duration-300 hover:shadow-soft hover:ring-gold-400/50"
    >
      <Link
        to={`/shop/${product.id}`}
        className="relative block aspect-[8/10] overflow-hidden bg-gradient-to-br from-chocolate-100 via-ivory-100 to-beige-200"
        aria-label={product.title}
      >
        <img
          src={product.cover}
          alt={`${product.title} — digital book cover`}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.06]"
        />

        {/* Book spine hint */}
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-y-0 left-0 w-9 bg-gradient-to-r from-chocolate-900/30 via-chocolate-900/10 to-transparent"
        />
        {/* Bottom scrim so the price pill always reads */}
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-chocolate-900/60 via-chocolate-900/15 to-transparent"
        />

        <span className="absolute left-3 top-3 inline-flex items-center gap-1.5 rounded-full bg-chocolate-900/80 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.18em] text-ivory-50 backdrop-blur-sm">
          <span className="h-1.5 w-1.5 rounded-full bg-gold-400" />
          {product.category}
        </span>

        <span className="absolute bottom-3 left-3 rounded-full bg-gold-500 px-3.5 py-1.5 font-serif text-sm font-semibold text-chocolate-900 shadow-card transition-colors duration-300 group-hover:bg-gold-400">
          {price.toFixed(2)}{' '}
          <span className="font-sans text-[10px] font-bold tracking-wider">
            {product.currency}
          </span>
        </span>

        <span className="absolute bottom-3 right-3 rounded-full bg-ivory-50/90 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-chocolate-700">
          {product.format}
        </span>
      </Link>

      <div className="flex flex-1 flex-col p-5 sm:p-6">
        <h3 className="font-serif text-xl leading-snug text-chocolate-800 transition-colors duration-300 group-hover:text-gold-600">
          <Link to={`/shop/${product.id}`}>{product.title}</Link>
        </h3>

        <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-charcoal/65">
          {product.description}
        </p>

        <div className="mt-3 flex items-center gap-2.5 text-[10px] font-semibold uppercase tracking-[0.2em] text-charcoal/50">
          <span>{product.pages} pages</span>
          <span className="h-1 w-1 rounded-full bg-gold-400" />
          <span>Instant download</span>
        </div>

        <div className="mt-auto pt-5">
          <div className="mb-4 h-px bg-gradient-to-r from-chocolate-500/20 via-chocolate-500/10 to-transparent" />

          <PaymentButton
            product={product}
            className="btn-dark w-full !py-3 text-[11px]"
            label="Buy Now"
          />

          <Link
            to={`/shop/${product.id}`}
            className="group/link mt-3 inline-flex w-full items-center justify-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.16em] text-chocolate-600 transition-colors duration-300 hover:text-gold-600"
          >
            View details
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.4"
              className="h-3 w-3 transition-transform duration-300 group-hover/link:translate-x-1"
              aria-hidden="true"
            >
              <path d="M5 12h14m-6-6 6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </Link>
        </div>
      </div>
    </motion.article>
  );
}