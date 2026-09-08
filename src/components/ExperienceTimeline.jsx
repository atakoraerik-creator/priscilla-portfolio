import { motion } from 'framer-motion';

/**
 * Vertical career timeline. Renders an alternating editorial
 * layout on desktop and a single centered line on mobile.
 */
export default function ExperienceTimeline({ items }) {
  return (
    <div className="relative mx-auto max-w-4xl">
      <span
        aria-hidden="true"
        className="absolute left-5 top-0 h-full w-px bg-gradient-to-b from-gold-500/60 via-chocolate-300 to-transparent md:left-1/2"
      />

      <ol className="space-y-12">
        {items.map((item, i) => {
          const flip = i % 2 === 0;
          return (
            <li key={item.id} className="relative md:grid md:grid-cols-2 md:gap-10">
              {/* Dot on the line */}
              <span
                aria-hidden="true"
                className="absolute left-5 top-7 -translate-x-1/2 rounded-full border-4 border-ivory-50 bg-gold-500 md:left-1/2"
                style={{ width: 14, height: 14 }}
              />

              <motion.div
                initial={{ opacity: 0, y: 26 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.55 }}
                className={`card !p-7 ${
                  flip ? 'md:col-start-1 md:text-right' : 'md:col-start-2'
                } ml-12 md:ml-0`}
              >
                <p className="text-[11px] font-semibold uppercase tracking-[0.25em] text-gold-600">
                  {item.date || '—'}
                </p>
                <h3 className="mt-2 font-serif text-2xl text-chocolate-800">
                  {item.company}
                </h3>
                <p className="mt-1 text-sm font-semibold text-chocolate-500">
                  {item.role}
                </p>
                <p className="mt-3 text-sm leading-relaxed text-charcoal/70">
                  {item.description}
                </p>
              </motion.div>
            </li>
          );
        })}
      </ol>
    </div>
  );
}