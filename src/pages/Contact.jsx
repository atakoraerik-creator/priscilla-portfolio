import Seo from '../components/Seo';
import Reveal from '../components/Reveal';
import ContactForm from '../components/ContactForm';
import { SocialIcon } from '../components/Footer';
import { site } from '../config/site';

export default function Contact() {
  const hasAny =
    site.contact.email ||
    site.contact.phone ||
    site.contact.whatsapp ||
    site.contact.location;

  const socials = [
    { key: 'instagram', url: site.contact.social.instagram },
    { key: 'facebook', url: site.contact.social.facebook },
    { key: 'linkedin', url: site.contact.social.linkedin },
    { key: 'whatsapp', url: site.contact.social.whatsapp },
  ].filter((s) => Boolean(s.url));

  return (
    <>
      <Seo
        title="Contact"
        description="Get in touch with Priscilla Adubia Asamoah for cakes, catering, training and commissions."
      />

      <section className="paper-texture bg-ivory-100 pb-14 pt-32 lg:pt-40">
        <div className="container-content">
          <Reveal>
            <p className="eyebrow mb-4">Contact</p>
            <h1 className="h-display">Let&rsquo;s work together</h1>
            <p className="mt-5 max-w-2xl text-base leading-relaxed text-charcoal/70">
              Weddings, celebrations, catering, training or a bespoke
              commission — tell Priscilla about your project.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="container-content py-16 lg:py-24">
        <div className="grid gap-12 lg:grid-cols-5 lg:gap-16">
          <Reveal className="lg:col-span-3">
            <div className="card !p-8 sm:!p-10">
              <h2 className="font-serif text-2xl text-chocolate-800">
                Send a message
              </h2>
              <p className="mb-6 mt-1 text-sm text-charcoal/60">
                Fill in the form — it opens directly in your email or WhatsApp.
              </p>
              <ContactForm />
            </div>
          </Reveal>

          <Reveal delay={0.1} className="lg:col-span-2">
            <div className="flex h-full flex-col gap-6">
              {!hasAny && (
                <div className="rounded-2xl border border-dashed border-gold-400/60 bg-ivory-100 p-7">
                  <p className="text-sm leading-relaxed text-charcoal/70">
                    Contact details will appear here once configured in{' '}
                    <code className="rounded bg-white px-1.5 py-0.5 text-[11px] text-gold-600">
                      src/config/site.js
                    </code>
                    .
                  </p>
                </div>
              )}

              {site.contact.location && (
                <InfoRow label="Location" icon="pin">
                  {site.contact.location}
                </InfoRow>
              )}
              {site.contact.email && (
                <InfoRow label="Email" icon="mail">
                  <a
                    href={`mailto:${site.contact.email}`}
                    className="hover:text-gold-600"
                  >
                    {site.contact.email}
                  </a>
                </InfoRow>
              )}
              {site.contact.phone && (
                <InfoRow label="Phone" icon="phone">
                  <a
                    href={`tel:${site.contact.phone.replace(/[^+\d]/g, '')}`}
                    className="hover:text-gold-600"
                  >
                    {site.contact.phone}
                  </a>
                </InfoRow>
              )}
              {site.contact.whatsapp && (
                <InfoRow label="WhatsApp" icon="whatsapp">
                  <a
                    href={`https://wa.me/${site.contact.whatsapp}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-gold-600"
                  >
                    Chat with Priscilla
                  </a>
                </InfoRow>
              )}

              {socials.length > 0 && (
                <div className="rounded-2xl bg-chocolate-800 p-7">
                  <p className="eyebrow-light mb-5">Follow along</p>
                  <ul className="flex gap-4">
                    {socials.map((s) => (
                      <li key={s.key}>
                        <a
                          href={s.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label={`Open ${s.key}`}
                          className="flex h-11 w-11 items-center justify-center rounded-full border border-ivory-50/25 text-ivory-50 transition-colors hover:border-gold-400 hover:text-gold-300"
                        >
                          <SocialIcon name={s.key} className="h-5 w-5" />
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}

function InfoRow({ label, icon, children }) {
  const icons = {
    pin: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-5 w-5">
        <path d="M12 21s-6-5.3-6-10a6 6 0 1 1 12 0c0 4.7-6 10-6 10Z" />
        <circle cx="12" cy="11" r="2.4" />
      </svg>
    ),
    mail: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-5 w-5">
        <rect x="3" y="5" width="18" height="14" rx="2" />
        <path d="m3 7 9 6 9-6" />
      </svg>
    ),
    phone: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-5 w-5">
        <path d="M5 4c0-1 1-1 1-1h3l1 4-2 1.5a12 12 0 0 0 7 7L16.5 14l4 1v3c0 1-1 1-1 1A14 14 0 0 1 5 4Z" />
      </svg>
    ),
    whatsapp: <SocialIcon name="whatsapp" className="h-5 w-5" />,
  };

  return (
    <div className="flex items-center gap-4 rounded-2xl border border-chocolate-500/10 bg-white p-5 shadow-card">
      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-chocolate-100 text-chocolate-700">
        {icons[icon]}
      </span>
      <div>
        <p className="text-[10px] uppercase tracking-[0.25em] text-chocolate-400">
          {label}
        </p>
        <p className="mt-0.5 text-sm font-medium text-chocolate-800">{children}</p>
      </div>
    </div>
  );
}