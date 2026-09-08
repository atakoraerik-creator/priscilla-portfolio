import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import PaymentButton from './PaymentButton';

export default function ProductCard({ product }) {
  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.5 }}
      whileHover={{ y: -6 }}
      className="group flex flex-col overflow-hidden rounded-2xl bg-white shadow-card ring-1 ring-chocolate-500/5 transition-shadow hover:shadow-soft"
    >
      <Link
        to={`/shop/${product.id}`}
        className="relative block aspect-[8/10] overflow-hidden bg-chocolate-50"
        aria-label={product.title}
      >
        <img
          src={product.cover}
          alt={`${product.title} — digital book cover`}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute left-3 top-3 flex gap-2">
          <span className="rounded-full bg-chocolate-800/85 px-3 py-1 text-[10px] font-semibold uppercase tracking-widest text-ivory-50 backdrop-blur-sm">
            {product.category}
          </span>
        </div>
        <div className="absolute bottom-3 right-3 rounded-full bg-ivory-50/95 px-3 py-1 text-[10px] font-semibold uppercase tracking-widest text-chocolate-700 shadow-sm">
          {product.format}
        </div>
      </Link>

      <div className="flex flex-1 flex-col p-6">
        <div className="flex items-start justify-between gap-3">
          <h3 className="font-serif text-xl leading-snug text-chocolate-800">
            <Link to={`/shop/${product.id}`} className="hover:text-gold-600">
              {product.title}
            </Link>
          </h3>
          <p className="whitespace-nowrap font-serif text-lg text-gold-600">
            {Number(product.price).toFixed(2)} <span className="text-sm">{product.currency}</span>
          </p>
        </div>

        <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-charcoal/65">
          {product.description}
        </p>

        <div className="mt-auto flex flex-col gap-3 pt-6 sm:flex-row">
          <Link
            to={`/shop/${product.id}`}
            className="btn-outline flex-1 !px-4 !py-2.5 text-[11px]"
          >
            View Details
          </Link>
          <PaymentButton
            product={product}
            className="btn-dark flex-1 !px-4 !py-2.5 text-[11px]"
            label="Buy Now"
          />
        </div>
      </div>
    </motion.article>
  );
}