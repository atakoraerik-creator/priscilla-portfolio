import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { site } from '../config/site';

const links = [
  { label: 'Home', to: '/' },
  { label: 'About', to: '/about' },
  { label: 'Creations', to: '/creations' },
  { label: 'Experience', to: '/experience' },
  { label: 'Shop', to: '/shop' },
  { label: 'Contact', to: '/contact' },
];

const socialLinks = [
  { key: 'instagram', label: 'Instagram', url: site.contact.social.instagram },
  { key: 'facebook', label: 'Facebook', url: site.contact.social.facebook },
  { key: 'linkedin', label: 'LinkedIn', url: site.contact.social.linkedin },
  { key: 'whatsapp', label: 'WhatsApp', url: site.contact.social.whatsapp },
].filter((s) => Boolean(s.url));

export default function Footer() {
  return (
    <footer className="bg-chocolate-900 text-ivory-50/80">
      <div className="container-content py-14">
        <div className="grid gap-12 md:grid-cols-3">
          <div>
            <p className="font-serif text-2xl text-ivory-50">{site.name}</p>
            <p className="mt-3 max-w-xs text-sm leading-relaxed text-ivory-50/60">
              {site.footerNote}. Creating refined cakes, pastries and dessert
              experiences — crafted with precision and passion.
            </p>
          </div>

          <nav aria-label="Footer" className="md:justify-self-center">
            <p className="eyebrow-light mb-5">Quick Links</p>
            <ul className="grid grid-cols-2 gap-x-12 gap-y-3 text-sm">
              {links.map((l) => (
                <li key={l.to}>
                  <Link
                    to={l.to}
                    className="transition-colors hover:text-gold-300"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {socialLinks.length > 0 && (
            <div className="md:justify-self-end">
              <p className="eyebrow-light mb-5">Connect</p>
              <ul className="space-y-3 text-sm">
                {socialLinks.map((s) => (
                  <li key={s.key}>
                    <a
                      href={s.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-3 transition-colors hover:text-gold-300"
                    >
                      <span className="flex h-9 w-9 items-center justify-center rounded-full border border-ivory-50/20">
                        <SocialIcon name={s.key} className="h-4 w-4" />
                      </span>
                      {s.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-ivory-50/10 pt-6 text-xs text-ivory-50/50 sm:flex-row">
          <p>© 2026 {site.name}. All rights reserved.</p>
          <ul className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2">
            <li>
              <Link to="/terms" className="transition-colors hover:text-gold-300">
                Terms &amp; Conditions
              </Link>
            </li>
            <li aria-hidden="true">·</li>
            <li>
              <Link to="/refund-policy" className="transition-colors hover:text-gold-300">
                Refund Policy
              </Link>
            </li>
            <li aria-hidden="true">·</li>
            <li>Digital products — no physical items shipped</li>
          </ul>
        </div>
      </div>
    </footer>
  );
}

export function SocialIcon({ name, className = 'h-4 w-4' }) {
  switch (name) {
    case 'instagram':
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={className} aria-hidden="true">
          <rect x="3" y="3" width="18" height="18" rx="5" />
          <circle cx="12" cy="12" r="4" />
          <circle cx="17.2" cy="6.8" r="0.9" fill="currentColor" stroke="none" />
        </svg>
      );
    case 'facebook':
      return (
        <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
          <path d="M13.5 21v-7h2.4l.4-3h-2.8V9.1c0-.9.3-1.5 1.6-1.5h1.3V4.9c-.3 0-1.2-.1-2.2-.1-2.2 0-3.7 1.3-3.7 3.8V11H8v3h2.5v7h3Z" />
        </svg>
      );
    case 'linkedin':
      return (
        <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
          <path d="M6.2 8.6H3.4V20h2.8V8.6ZM4.8 7.3a1.7 1.7 0 1 0 0-3.4 1.7 1.7 0 0 0 0 3.4ZM20.6 13.9c0-3.2-1.7-4.9-4-4.9-1.6 0-2.3.8-2.8 1.6V8.6H11V20h2.8v-5.9c0-1.6.6-2.5 1.9-2.5 1.2 0 1.9.8 1.9 2.5V20h3v-6.1Z" />
        </svg>
      );
    case 'whatsapp':
      return (
        <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
          <path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2Zm0 18.2a8.2 8.2 0 0 1-4.2-1.2l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2Zm4.6-6.1c-.3-.1-1.5-.7-1.7-.8-.2-.1-.4-.1-.6.1-.2.3-.6.8-.8 1-.1.2-.3.2-.5.1a6.7 6.7 0 0 1-3.4-3c-.3-.4 0-.6.2-.8l.4-.5c.1-.2.2-.3.3-.5v-.5c0-.1-.6-1.5-.8-2-.2-.5-.4-.4-.6-.4h-.5c-.2 0-.5.1-.7.3-.2.3-.9.9-.9 2.2s1 2.6 1.1 2.8c.1.2 1.9 3 4.7 4.2.7.3 1.2.4 1.6.6.7.2 1.3.2 1.8.1.6-.1 1.5-.6 1.7-1.2.2-.6.2-1.1.2-1.3l-.5-.3Z" opacity="0.95"/>
        </svg>
      );
    default:
      return null;
  }
}