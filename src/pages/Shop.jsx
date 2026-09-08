import Seo from '../components/Seo';
import Reveal from '../components/Reveal';
import ProductGrid from '../components/ProductGrid';
import { products } from '../data/products';

export default function Shop() {
  return (
    <>
      <Seo
        title="Digital Shop"
        description="Digital PDF books and guides by Priscilla Adubia Asamoah — instant download after secure payment."
      />

      <section className="paper-texture bg-ivory-100 pb-14 pt-32 lg:pt-40">
        <div className="container-content">
          <Reveal>
            <p className="eyebrow mb-4">Digital Shop</p>
            <h1 className="h-display">Books from the pastry kitchen</h1>
            <p className="mt-5 max-w-2xl text-base leading-relaxed text-charcoal/70">
              Practical PDF guides distilled from hands-on pastry practice.
              Pay securely with Paystack and download instantly.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="container-content py-16 lg:py-24">
        <Reveal>
          <div className="mb-12 flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-dashed border-gold-400/50 bg-ivory-100 px-6 py-5">
            <p className="text-sm text-charcoal/70">
              <span className="font-semibold text-chocolate-800">Digital product.</span>{' '}
              Each book is a PDF download — no physical product will be shipped.
            </p>
            <p className="text-[11px] uppercase tracking-[0.2em] text-gold-600">
              Secure checkout via Paystack
            </p>
          </div>
        </Reveal>

        <ProductGrid products={products} />
      </section>
    </>
  );
}