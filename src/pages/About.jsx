import { Link } from 'react-router-dom';
import Seo from '../components/Seo';
import Reveal from '../components/Reveal';
import { site } from '../config/site';

export default function About() {
  const { about } = site;
  const noImage = !about.portrait;

  return (
    <>
      <Seo
        title="About"
        description={`Meet ${site.name} — pastry chef, cake artist and dessert specialist.`}
      />

      {/* Page header */}
      <section className="paper-texture bg-ivory-100 pb-14 pt-32 lg:pt-40">
        <div className="container-content">
          <Reveal>
            <p className="eyebrow mb-4">About</p>
            <h1 className="h-display">The chef behind the creations</h1>
            <p className="mt-5 max-w-2xl text-base leading-relaxed text-charcoal/70">
              {about.biography.join(' ')}
            </p>
          </Reveal>
        </div>
      </section>

      {/* Portrait + philosophy */}
      <section className="container-content py-20 lg:py-28">
        <div className="grid items-start gap-12 lg:grid-cols-2 lg:gap-20">
          <Reveal>
            <div className="relative">
              {noImage ? (
                <div className="flex aspect-[4/5] w-full items-center justify-center rounded-2xl border border-dashed border-chocolate-300 bg-ivory-100 text-center">
                  <p className="max-w-[12rem] text-xs uppercase tracking-widest text-chocolate-400">
                    Portrait placeholder — add your photo
                  </p>
                </div>
              ) : (
                <>
                  <div className="absolute -left-4 -top-4 h-full w-full rounded-2xl bg-chocolate-100" />
                  <img
                    src={about.portrait}
                    alt={about.portraitAlt}
                    className="relative aspect-[4/5] w-full rounded-2xl object-cover shadow-soft"
                  />
                </>
              )}
            </div>
          </Reveal>

          <div className="space-y-10">
            <Reveal>
              <p className="eyebrow mb-4">Professional Philosophy</p>
              <h2 className="font-serif text-3xl leading-tight text-chocolate-800">
                Precision in the craft, passion in the flavour
              </h2>
              <p className="mt-5 text-base leading-relaxed text-charcoal/70">
                {about.philosophy}
              </p>
            </Reveal>

            <Reveal>
              <p className="eyebrow mb-4">A Passion for Pastry</p>
              <h2 className="font-serif text-2xl leading-snug text-chocolate-800">
                Happiest at the pastry bench
              </h2>
              <p className="mt-4 text-base leading-relaxed text-charcoal/70">
                {about.passion}
              </p>
            </Reveal>

            <Reveal>
              <p className="eyebrow mb-4">Training & Approach</p>
              <p className="max-w-xl text-sm leading-relaxed text-charcoal/70">
                Priscilla&rsquo;s craft combines hands-on kitchen experience with
                dedicated training in cake art and professional pastry technique.
                She works in a clean, organised and consistent way — the
                foundation of every premium product she delivers.
              </p>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Key strengths */}
      <section className="bg-chocolate-900 py-20 lg:py-28">
        <div className="container-content">
          <Reveal>
            <p className="eyebrow-light mb-4">Key Strengths</p>
            <h2 className="font-serif text-3xl text-ivory-50 sm:text-4xl">
              What Priscilla brings to the kitchen
            </h2>
          </Reveal>
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {about.strengths.map((strength, i) => (
              <Reveal key={strength} delay={(i % 3) * 0.08}>
                <div className="flex h-full items-center gap-4 rounded-2xl border border-ivory-50/10 bg-ivory-50/5 p-6">
                  <span className="font-serif text-3xl text-gold-400">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <p className="text-sm font-medium text-ivory-50/90">{strength}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Career highlights */}
      {about.highlights.length > 0 && (
        <section className="container-content py-20 lg:py-28">
          <Reveal>
            <p className="eyebrow mb-4">Career Highlights</p>
            <h2 className="font-serif text-3xl text-chocolate-800">Milestones</h2>
          </Reveal>
          <ul className="mt-10 grid gap-6 md:grid-cols-2">
            {about.highlights.map((h, i) => (
              <Reveal key={i} delay={i * 0.06}>
                <li className="card !p-7">
                  <p className="font-serif text-lg text-chocolate-800">{h}</p>
                </li>
              </Reveal>
            ))}
          </ul>
        </section>
      )}

      {/* CTA */}
      <section className="container-content pb-24">
        <Reveal>
          <div className="flex flex-col items-center justify-between gap-8 rounded-3xl bg-ivory-100 p-10 text-center shadow-card sm:p-14 lg:flex-row lg:text-left">
            <div>
              <h2 className="font-serif text-3xl text-chocolate-800">
                Ready to talk about your next creation?
              </h2>
              <p className="mt-2 text-sm text-charcoal/70">
                Weddings, events, catering, or bespoke pastry — let&rsquo;s create.
              </p>
            </div>
            <Link to="/contact" className="btn-dark shrink-0">
              Contact Priscilla
            </Link>
          </div>
        </Reveal>
      </section>
    </>
  );
}