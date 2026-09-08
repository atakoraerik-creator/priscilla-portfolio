import { useMemo, useState } from 'react';
import Seo from '../components/Seo';
import Reveal from '../components/Reveal';
import GalleryCard from '../components/GalleryCard';
import GalleryModal from '../components/GalleryModal';
import { gallery, galleryCategories } from '../data/gallery';

export default function Creations() {
  const [active, setActive] = useState('All');
  const [openItem, setOpenItem] = useState(null);

  const items = useMemo(
    () =>
      active === 'All'
        ? gallery
        : gallery.filter((g) => g.category === active),
    [active]
  );

  return (
    <>
      <Seo
        title="Creations"
        description="A gallery of cakes, pastries, desserts and special creations by Priscilla Adubia Asamoah."
      />

      <section className="paper-texture bg-ivory-100 pb-14 pt-32 lg:pt-40">
        <div className="container-content">
          <Reveal>
            <p className="eyebrow mb-4">Gallery</p>
            <h1 className="h-display">Pastry & Cake Creations</h1>
            <p className="mt-5 max-w-2xl text-base leading-relaxed text-charcoal/70">
              A look at the cakes, pastries, desserts and special creations
              crafted in the pastry kitchen. Photos will be added over time.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="container-content py-14 lg:py-20">
        {/* Filters */}
        <div
          role="tablist"
          aria-label="Gallery categories"
          className="mb-10 flex flex-wrap gap-3"
        >
          {galleryCategories.map((cat) => (
            <button
              key={cat}
              role="tab"
              aria-selected={active === cat}
              onClick={() => setActive(cat)}
              className={`rounded-full px-5 py-2 text-xs font-semibold uppercase tracking-widest transition-all duration-300 ${
                active === cat
                  ? 'bg-chocolate-700 text-ivory-50 shadow-card'
                  : 'border border-chocolate-500/25 text-chocolate-600 hover:border-chocolate-700 hover:text-chocolate-800'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Masonry grid */}
        <div className="columns-1 gap-6 sm:columns-2 lg:columns-3 [&>*]:mb-6">
          {items.map((item, i) => (
            <GalleryCard key={item.id} item={item} index={i} onOpen={setOpenItem} />
          ))}
        </div>

        {items.length === 0 && (
          <p className="py-16 text-center text-sm text-charcoal/50">
            No images in this category yet.
          </p>
        )}
      </section>

      <GalleryModal item={openItem} onClose={() => setOpenItem(null)} />
    </>
  );
}