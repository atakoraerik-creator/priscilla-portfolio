import { useEffect, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { site } from '../config/site';

const links = [
  { label: 'Home', to: '/' },
  { label: 'About', to: '/about' },
  { label: 'Creations', to: '/creations' },
  { label: 'Experience', to: '/experience' },
  { label: 'Shop', to: '/shop' },
  { label: 'Contact', to: '/contact' },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  // On the home page hero (before scrolling) the navbar is transparent
  // over the dark photo, so the links turn white. Once you scroll (or
  // open the mobile menu) it switches to the solid light bar with dark text.
  const isHome = location.pathname === '/';
  const overHero = isHome && !scrolled && !open;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  // Escape closes the menu
  useEffect(() => {
    if (!open) return undefined;
    const onKey = (e) => {
      if (e.key === 'Escape') setOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
        scrolled || open
          ? 'border-b border-chocolate-500/10 bg-ivory-50/90 py-3 backdrop-blur-md'
          : 'bg-transparent py-5'
      }`}
    >
      <div className="container-content flex items-center justify-between">
        <Link to="/" className="flex flex-col leading-none" aria-label="Home">
          <span
            className={`font-serif text-lg font-semibold tracking-wide sm:text-xl transition-colors ${
              overHero ? 'text-white' : 'text-chocolate-800'
            }`}
          >
            {site.firstName.toUpperCase()}
          </span>
          <span
            className={`text-[10px] uppercase tracking-[0.3em] transition-colors ${
              overHero ? 'text-gold-300' : 'text-gold-600'
            }`}
          >
            Pastry Artist
          </span>
        </Link>

        <nav aria-label="Primary" className="hidden items-center gap-8 lg:flex">
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              className={({ isActive }) => {
                const base = overHero
                  ? isActive
                    ? 'text-gold-300 hover:text-white'
                    : 'text-white hover:text-gold-300'
                  : isActive
                    ? 'text-gold-600 hover:text-gold-500'
                    : 'text-chocolate-700 hover:text-gold-600';
                return `text-xs font-semibold uppercase tracking-[0.18em] transition-colors drop-shadow ${base}`;
              }}
            >
              {l.label}
            </NavLink>
          ))}
        </nav>

        <div className="hidden lg:block">
          <Link
            to="/contact"
            className={overHero ? 'btn-ivory !px-6 !py-2.5' : 'btn-dark !px-6 !py-2.5'}
          >
            Let&rsquo;s Work Together
          </Link>
        </div>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-controls="mobile-menu"
          aria-label={open ? 'Close menu' : 'Open menu'}
          className={`flex h-10 w-10 items-center justify-center rounded-full border transition-colors lg:hidden ${
            overHero
              ? 'border-white/40 text-white'
              : 'border-chocolate-500/20 text-chocolate-700'
          }`}
        >
          <div className="relative h-4 w-5">
            <span
              className={`absolute left-0 top-0 h-0.5 w-full bg-current transition-all duration-300 ${
                open ? 'top-1/2 -translate-y-1/2 rotate-45' : ''
              }`}
            />
            <span
              className={`absolute left-0 top-1/2 h-0.5 w-full -translate-y-1/2 bg-current transition-opacity duration-300 ${
                open ? 'opacity-0' : 'opacity-100'
              }`}
            />
            <span
              className={`absolute bottom-0 left-0 h-0.5 w-full bg-current transition-all duration-300 ${
                open ? 'bottom-1/2 translate-y-1/2 -rotate-45' : ''
              }`}
            />
          </div>
        </button>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-menu"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.28, ease: 'easeInOut' }}
            className="overflow-hidden border-t border-chocolate-500/10 bg-ivory-50 lg:hidden"
          >
            <nav aria-label="Mobile" className="container-content flex flex-col gap-1 py-6">
              {links.map((l, i) => (
                <motion.div
                  key={l.to}
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.05 * i }}
                >
                  <NavLink
                    to={l.to}
                    className={({ isActive }) =>
                      `block border-b border-chocolate-500/5 py-3 font-serif text-2xl transition-colors ${
                        isActive ? 'text-gold-600' : 'text-chocolate-800'
                      }`
                    }
                  >
                    {l.label}
                  </NavLink>
                </motion.div>
              ))}
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.32 }}
                className="mt-6"
              >
                <Link to="/contact" className="btn-dark w-full">
                  Let&rsquo;s Work Together
                </Link>
              </motion.div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}