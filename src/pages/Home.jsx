import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import Hero from '../components/Hero';
import Seo from '../components/Seo';
import SectionTitle from '../components/SectionTitle';
import Reveal from '../components/Reveal';
import ProductGrid from '../components/ProductGrid';
import GalleryCard from '../components/GalleryCard';
import { site } from '../config/site';
import { gallery } from '../data/gallery';
import { getFeaturedProducts } from '../data/products';
import { experience } from '../data/experience';

const expertise = [
  {
    title: 'Cake Art',
    text: 'Custom, artistically crafted cakes designed as the centrepiece of your celebration.',
  },
  {
    title: 'Cake Decoration',
    text: 'Piping, smoothing and finishing that turns a baked cake into a work of art.',
  },
  {
    title: 'Pastry Production',
    text: 'Classic and modern pastries produced from scratch with consistent professional quality.',
  },
  {
    title: 'Desserts',
    text: 'Plated and display desserts built around balance, texture and refined taste.',
  },
  {
    title: 'Confectionery',
    text: 'Chocolates and small sweets finished with patience and precision.',
  },
  {
    title: 'Creative Design',
    text: 'Original concepts and flavour combinations developed for each unique brief.',
  },
];

export default function Home() {
  const navigate = useNavigate();
  const featuredProducts = getFeaturedProducts();
  const featuredGallery = gallery.slice(0, 4);
  const journey = experience.slice(0, 3);

  return (
    <>
      <Seo title="Home" />
      <Hero />

      {/* About preview */}
      <section className="container-content py-20 lg:py-28">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
          <Reveal>
            <div className="relative">
              <div className="absolute -left-4 -top-4 h-full w-full rounded-2xl bg-chocolate-100" />
              <img
                src={site.about.portrait}
                alt={site.about.portraitAlt}
                className="relative aspect-[4/5] w-full rounded-2xl object-cover shadow-soft"
                loading="lazy"
              />
              <div className="absolute -bottom-5 left-6 rounded-xl bg-chocolate-800 px-5 py-4 text-ivory-50 shadow-soft">
                <p className="font-serif text-lg">{site.name}</p>
                <p className="text-[10px] uppercase tracking-[0.25em] text-gold-300">
                  {site.role}
                </p>
              </div>
            </div>
          </Reveal>

          <Reveal delay={0.1}>
            <p className="eyebrow mb-4">About Priscilla</p>
            <h2 className="font-serif text-3xl leading-tight text-chocolate-800 sm:text-4xl">
              A pastry journey built on care, craft and celebration
            </h2>
            <p className="mt-6 text-base leading-relaxed text-charcoal/70">
              {site.about.biography[0]}
            </p>
            <p className="mt-4 text-base leading-relaxed text-charcoal/70">
              {site.about.biography[1]}
            </p>
            <Link to="/about" className="btn-dark mt-8">
              Read More
            </Link>
          </Reveal>
        </div>
      </section>

      {/* Areas of expertise */}
      <section className="paper-texture bg-ivory-100 py-20 lg:py-28">
        <div className="container-content">
          <SectionTitle
            eyebrow="What I do"
            title="Areas of Expertise"
            description="Six specialisms that come together in every cake, pastry and dessert."
            center
          />
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {expertise.map((item, i) => (
              <Reveal key={item.title} delay={(i % 3) * 0.08}>
                <div className="group h-full rounded-2xl border border-chocolate-500/10 bg-white p-8 transition-all duration-300 hover:-translate-y-1 hover:border-gold-400/60 hover:shadow-card">
                  <span className="flex h-11 w-11 items-center justify-center rounded-full bg-chocolate-100 font-serif text-lg text-chocolate-700 transition-colors group-hover:bg-gold-500 group-hover:text-chocolate-900">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <h3 className="mt-5 font-serif text-xl text-chocolate-800">
                    {item.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-charcoal/65">
                    {item.text}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Featured creations */}
      <section className="container-content py-20 lg:py-28">
        <SectionTitle
          eyebrow="Portfolio"
          title="Featured Creations"
          description="A taste of the cakes, pastries and desserts Priscilla has crafted."
          action={
            <Link to="/creations" className="btn-outline">
              View All Creations
            </Link>
          }
        />
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {featuredGallery.map((item, i) => (
            <GalleryCard
              key={item.id}
              item={item}
              index={i}
              onOpen={() => navigate('/creations')}
            />
          ))}
        </div>
      </section>

      {/* Featured products */}
      <section className="bg-chocolate-900 py-20 lg:py-28">
        <div className="container-content">
          <SectionTitle
            eyebrow="Digital Shop"
            title="Featured Books"
            description="Practical PDF guides from Priscilla's pastry kitchen — delivered instantly after purchase."
            light
            action={
              <div className="flex gap-3">
                <Link to="/shop" className="btn-gold">
                  Visit Shop
                </Link>
              </div>
            }
          />
          <ProductGrid products={featuredProducts} />
        </div>
      </section>

      {/* Professional journey preview */}
      <section className="container-content py-20 lg:py-28">
        <SectionTitle
          eyebrow="The journey"
          title="Professional Journey"
          description="From culinary training to a steady professional kitchen career."
          action={
            <Link to="/experience" className="btn-outline">
              Full Experience
            </Link>
          }
        />
        <ol className="border-l border-chocolate-300/60 pl-8">
          {journey.map((item, i) => (
            <Reveal key={item.id} delay={i * 0.06}>
              <li className="relative mb-8 last:mb-0">
                <span
                  aria-hidden="true"
                  className="absolute -left-[41px] top-2 h-3 w-3 rounded-full bg-gold-500"
                />
                <p className="text-[11px] font-semibold uppercase tracking-[0.25em] text-gold-600">
                  {item.date || '—'}
                </p>
                <h3 className="mt-1 font-serif text-2xl text-chocolate-800">
                  {item.company}
                </h3>
                <p className="text-sm font-medium text-chocolate-500">{item.role}</p>
              </li>
            </Reveal>
          ))}
        </ol>
      </section>

      {/* Final CTA */}
      <section className="relative overflow-hidden bg-chocolate-800 py-24">
        <div
          aria-hidden="true"
          className="absolute inset-0 opacity-[0.07]"
          style={{
            backgroundImage:
              'radial-gradient(circle at 20% 50%, #D9B36A 0, transparent 45%), radial-gradient(circle at 80% 20%, #D9B36A 0, transparent 40%)',
          }}
        />
        <div className="container-content relative text-center">
          <motion.p
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="eyebrow-light mb-6"
          >
            Commission · Catering · Enquiries
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.05 }}
            className="mx-auto max-w-3xl font-serif text-4xl leading-tight text-ivory-50 sm:text-5xl"
          >
            Let&rsquo;s Create Something Beautiful
          </motion.h2>
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="mt-10 flex flex-col justify-center gap-4 sm:flex-row"
          >
            <Link to="/contact" className="btn-gold">
              Contact Priscilla
            </Link>
            <Link to="/shop" className="btn-outline-light">
              Visit Shop
            </Link>
          </motion.div>
        </div>
      </section>
    </>
  );
}