import { useCallback, useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

/**
 * Accessible lightbox for gallery images.
 * - Closes with Escape key / backdrop click / close button
 * - Traps no focus (kept simple), restores scroll on close
 */
export default function GalleryModal({ item, onClose }) {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (!item) return undefined;
    setLoaded(false);
    document.body.style.overflow = 'hidden';
    const onKey = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', onKey);
    };
  }, [item, onClose]);

  const handleBackdrop = useCallback(
    (e) => {
      if (e.target === e.currentTarget) onClose();
    },
    [onClose]
  );

  return (
    <AnimatePresence>
      {item && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          role="dialog"
          aria-modal="true"
          aria-label={item.title}
          onClick={handleBackdrop}
          className="fixed inset-0 z-[80] flex items-center justify-center bg-chocolate-900/90 p-4 backdrop-blur-sm sm:p-8"
        >
          <button
            type="button"
            onClick={onClose}
            aria-label="Close lightbox"
            className="absolute right-4 top-4 z-10 flex h-11 w-11 items-center justify-center rounded-full border border-ivory-50/30 text-ivory-50 transition-colors hover:border-gold-400 hover:text-gold-300"
          >
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
            </svg>
          </button>

          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.98 }}
            transition={{ duration: 0.3 }}
            className="relative max-h-full max-w-4xl overflow-hidden rounded-2xl bg-white"
          >
            <img
              src={item.image}
              alt={item.title}
              onLoad={() => setLoaded(true)}
              className="max-h-[72vh] w-auto object-contain"
            />
            {!loaded && (
              <div className="absolute inset-0 flex items-center justify-center bg-chocolate-100 text-chocolate-400">
                Loading…
              </div>
            )}
            <div className="flex items-center justify-between gap-4 bg-white px-5 py-4 sm:px-7">
              <div>
                <p className="font-serif text-lg text-chocolate-800">{item.title}</p>
                <p className="text-[10px] uppercase tracking-[0.25em] text-gold-600">
                  {item.category}
                </p>
              </div>
              {item.description && (
                <p className="hidden max-w-sm text-right text-xs leading-relaxed text-charcoal/60 sm:block">
                  {item.description}
                </p>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}