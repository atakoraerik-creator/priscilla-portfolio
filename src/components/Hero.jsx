import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { site } from '../config/site';

const fade = (delay) => ({
  initial: { opacity: 0, y: 28 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.8, delay, ease: 'easeOut' },
});

const fromRight = (delay) => ({
  initial: { opacity: 0, x: 40 },
  animate: { opacity: 1, x: 0 },
  transition: { duration: 1, delay, ease: 'easeOut' },
});

const stats = [
  ['4+', 'Years in kitchen'],
  ['100s', 'Cakes designed'],
  ['ENDLESS', 'Flavour ideas'],
];

export default function Hero() {
  return (
    <section className="relative flex min-h-[100svh] items-center overflow-hidden bg-chocolate-900">
      {/* Decorative glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-40 -top-40 h-[36rem] w-[36rem] rounded-full bg-gold-500/10 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-56 -left-32 h-[30rem] w-[30rem] rounded-full bg-rose-500/10 blur-3xl"
      />

      <div className="container-content relative z-10 py-24 lg:py-28">
        <div className="grid items-center gap-14 lg:grid-cols-[1fr_minmax(0,26rem)]">
          {/* Text column */}
          <div className="max-w-3xl">
            <motion.p {...fade(0.1)} className="mb-6">
              <span className="inline-block rounded-full border border-gold-400/40 bg-chocolate-900/40 px-4 py-1.5 text-[11px] uppercase tracking-[0.32em] text-gold-300 backdrop-blur-sm">
                {site.role}
              </span>
            </motion.p>

            <motion.h1
              {...fade(0.22)}
              className="font-serif text-4xl leading-[1.05] text-ivory-50 sm:text-6xl lg:text-[4.2rem]"
            >
              {site.name}
            </motion.h1>

            <motion.div {...fade(0.34)} className="mt-6 flex items-center gap-4">
              <span className="h-px w-12 bg-gold-400" aria-hidden="true" />
              <p className="text-sm font-medium uppercase tracking-[0.28em] text-gold-300">
                Pastry Chef · Cake Artist · Dessert Specialist
              </p>
            </motion.div>

            <motion.p
              {...fade(0.46)}
              className="mt-8 max-w-xl text-base leading-relaxed text-ivory-50/90 sm:text-lg"
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
              {stats.map(([num, label]) => (
                <div key={label}>
                  <p className="font-serif text-2xl text-gold-300 sm:text-3xl">{num}</p>
                  <p className="mt-1 text-[10px] uppercase tracking-[0.22em] text-ivory-50/80">
                    {label}
                  </p>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Portrait — framed, right side, not full-bleed */}
          <motion.div {...fromRight(0.3)} className="relative mx-auto w-full max-w-sm lg:max-w-full">
            <div
              aria-hidden="true"
              className="absolute -inset-3 rotate-2 rounded-[2rem] border border-gold-400/30"
            />
            <img
              src={site.hero.image}
              alt={site.hero.imageAlt}
              className="relative aspect-[4/5] w-full rounded-[1.75rem] bg-chocolate-800 object-cover shadow-2xl shadow-black/50 ring-1 ring-gold-400/30"
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
}