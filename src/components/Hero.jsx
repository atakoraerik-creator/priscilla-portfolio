import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { site } from '../config/site';

const fade = (delay) => ({
  initial: { opacity: 0, y: 28 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.8, delay, ease: 'easeOut' },
});

export default function Hero() {
  return (
    <section className="relative flex min-h-[100svh] items-center overflow-hidden bg-chocolate-900">
      {/* Full-bleed photo */}
      <img
        src={site.hero.image}
        alt={site.hero.imageAlt}
        className="absolute inset-0 h-full w-full object-cover"
      />

      {/* Scrim layers — guarantee the text is readable on any photo */}
      <div aria-hidden="true" className="absolute inset-0 bg-chocolate-900/50" />
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-gradient-to-r from-chocolate-900/95 via-chocolate-900/70 to-chocolate-900/30"
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-gradient-to-t from-chocolate-900/70 via-transparent to-chocolate-900/40"
      />

      {/* Text over the image */}
      <div className="container-content relative z-10 py-28">
        <div className="max-w-3xl">
          <motion.p {...fade(0.1)} className="mb-6">
            <span className="inline-block rounded-full border border-gold-400/40 bg-chocolate-900/40 px-4 py-1.5 text-[11px] uppercase tracking-[0.32em] text-gold-300 backdrop-blur-sm">
              {site.role}
            </span>
          </motion.p>

          <motion.h1
            {...fade(0.22)}
            className="font-serif text-4xl leading-[1.05] text-white drop-shadow-[0_3px_14px_rgba(20,10,5,0.55)] sm:text-6xl lg:text-[4.6rem]"
          >
            {site.name}
          </motion.h1>

          <motion.div {...fade(0.34)} className="mt-6 flex items-center gap-4">
            <span className="h-px w-12 bg-gold-400" aria-hidden="true" />
            <p className="text-sm font-medium uppercase tracking-[0.28em] text-gold-300 drop-shadow">
              Pastry Chef · Cake Artist · Dessert Specialist
            </p>
          </motion.div>

          <motion.p
            {...fade(0.46)}
            className="mt-8 max-w-xl text-base leading-relaxed text-ivory-50 drop-shadow-[0_2px_10px_rgba(20,10,5,0.6)] sm:text-lg"
          >
            {site.tagline}
          </motion.p>

          <motion.div {...fade(0.6)} className="mt-10 flex flex-col gap-4 sm:flex-row">
            <Link to="/creations" className="btn-gold">
              View My Creations
            </Link>
            <Link to="/shop" className="btn-outline-light">
              Visit Shop
            </Link>
          </motion.div>

          <motion.div
            {...fade(0.74)}
            className="mt-14 grid max-w-md grid-cols-3 gap-6 border-t border-ivory-50/25 pt-8"
          >
            {[
              ['4+', 'Years in kitchen'],
              ['100s', 'Cakes designed'],
              ['ENDLESS', 'Flavour ideas'],
            ].map(([num, label]) => (
              <div key={label}>
                <p className="font-serif text-2xl text-gold-300 drop-shadow sm:text-3xl">
                  {num}
                </p>
                <p className="mt-1 text-[10px] uppercase tracking-[0.22em] text-ivory-50/80">
                  {label}
                </p>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}