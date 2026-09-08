import { motion } from 'framer-motion';

/**
 * Section heading with eyebrows + optional link on the right.
 * `light` renders the light version for dark backgrounds.
 */
export default function SectionTitle({
  eyebrow,
  title,
  description,
  light = false,
  center = false,
  action,
}) {
  return (
    <div
      className={`mb-12 flex flex-col gap-6 ${
        center ? 'items-center text-center' : ''
      } md:flex-row md:items-end md:justify-between`}
    >
      <div className={center ? 'mx-auto max-w-2xl' : 'max-w-2xl'}>
        {eyebrow && (
          <motion.p
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.5 }}
            className={light ? 'eyebrow-light mb-4' : 'eyebrow mb-4'}
          >
            {eyebrow}
          </motion.p>
        )}
        <motion.h2
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.55, delay: 0.05 }}
          className={`font-serif text-3xl leading-tight sm:text-4xl lg:text-[2.75rem] ${
            light ? 'text-ivory-50' : 'text-chocolate-800'
          }`}
        >
          {title}
        </motion.h2>
        {description && (
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.55, delay: 0.12 }}
            className={`mt-4 text-sm leading-relaxed sm:text-base ${
              light ? 'text-ivory-50/70' : 'text-charcoal/70'
            }`}
          >
            {description}
          </motion.p>
        )}
      </div>
      {action && <div>{action}</div>}
    </div>
  );
}