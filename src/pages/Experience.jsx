import { Link } from 'react-router-dom';
import Seo from '../components/Seo';
import Reveal from '../components/Reveal';
import ExperienceTimeline from '../components/ExperienceTimeline';
import { experience } from '../data/experience';
import { site } from '../config/site';

export default function Experience() {
  return (
    <>
      <Seo
        title="Experience"
        description={`Professional experience of ${site.name} — culinary training and working pastry career.`}
      />

      <section className="paper-texture bg-ivory-100 pb-14 pt-32 lg:pt-40">
        <div className="container-content">
          <Reveal>
            <p className="eyebrow mb-4">The Journey</p>
            <h1 className="h-display">Professional Experience</h1>
            <p className="mt-5 max-w-2xl text-base leading-relaxed text-charcoal/70">
              Culinary training, dedicated cake school, and a growing
              professional kitchen career — built step by step.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="container-content py-16 lg:py-24">
        <ExperienceTimeline items={experience} />
        <Reveal>
          <p className="mx-auto mt-16 max-w-2xl text-center text-xs uppercase tracking-[0.25em] text-chocolate-400">
            Exact dates & details can be updated in{' '}
            <code className="rounded bg-ivory-100 px-2 py-0.5 text-gold-600">
              src/data/experience.js
            </code>
          </p>
        </Reveal>
      </section>

      <section className="container-content pb-24">
        <Reveal>
          <div className="flex flex-col items-center justify-between gap-8 rounded-3xl bg-chocolate-800 p-10 text-center shadow-soft sm:p-14 lg:flex-row lg:text-left">
            <div>
              <h2 className="font-serif text-3xl text-ivory-50">
                Want to see the work?
              </h2>
              <p className="mt-2 text-sm text-ivory-50/70">
                Explore the pastry & cake gallery, or head to the shop for digital guides.
              </p>
            </div>
            <div className="flex shrink-0 gap-3">
              <Link to="/creations" className="btn-ivory">
                Creations
              </Link>
              <Link to="/shop" className="btn-gold">
                Shop
              </Link>
            </div>
          </div>
        </Reveal>
      </section>
    </>
  );
}