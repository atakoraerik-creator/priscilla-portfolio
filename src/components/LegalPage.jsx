import Reveal from './Reveal';

/**
 * Shared layout for legal-style pages (Terms, Refund Policy).
 * Content is placeholder boilerplate — review and edit the text
 * in each page file before going live.
 */
export default function LegalPage({ eyebrow, title, updated, children }) {
  return (
    <section className="paper-texture bg-ivory-100 pb-14 pt-32 lg:pt-40">
      <div className="container-content">
        <Reveal>
          <p className="eyebrow mb-4">{eyebrow}</p>
          <h1 className="h-display">{title}</h1>
          {updated && (
            <p className="mt-4 text-xs uppercase tracking-[0.22em] text-chocolate-400">
              Last updated: {updated}
            </p>
          )}
        </Reveal>
      </div>

      <div className="container-content mt-10">
        <Reveal>
          <div className="card max-w-3xl !p-8 sm:!p-12">
            <div className="prose-sm space-y-5 text-sm leading-relaxed text-charcoal/75">
              {children}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}