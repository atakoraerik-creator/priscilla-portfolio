import { Link, useParams } from 'react-router-dom';
import Seo from '../components/Seo';
import Reveal from '../components/Reveal';
import PaymentButton from '../components/PaymentButton';
import ProductCard from '../components/ProductCard';
import { getProduct, products } from '../data/products';

export default function ProductDetails() {
  const { productId } = useParams();
  const product = getProduct(productId);

  if (!product) {
    return (
      <>
        <Seo title="Product Not Found" />
        <section className="container-content flex min-h-[60vh] flex-col items-center justify-center py-32 text-center">
          <p className="eyebrow mb-4">404</p>
          <h1 className="h-display">Product not found</h1>
          <p className="mt-4 max-w-md text-sm text-charcoal/70">
            This item may have been removed, or the link is incorrect. Browse the
            shop to find it.
          </p>
          <Link to="/shop" className="btn-dark mt-8">
            Return to Shop
          </Link>
        </section>
      </>
    );
  }

  const others = products.filter((p) => p.id !== product.id).slice(0, 3);

  return (
    <>
      <Seo
        title={product.title}
        description={product.description}
        image={product.cover}
      />

      <div className="container-content pt-32 lg:pt-40">
        <nav aria-label="Breadcrumb" className="mb-10 text-xs text-chocolate-400">
          <Link to="/shop" className="hover:text-gold-600">
            Shop
          </Link>
          <span className="mx-2" aria-hidden="true">
            /
          </span>
          <span className="text-chocolate-700">{product.title}</span>
        </nav>

        <div className="grid gap-12 lg:grid-cols-2 lg:gap-20">
          {/* Cover */}
          <Reveal>
            <div className="relative mx-auto max-w-md">
              <div className="absolute -left-4 -top-4 h-full w-full rounded-2xl bg-chocolate-100" />
              <img
                src={product.cover}
                alt={`${product.title} — digital book cover`}
                className="relative aspect-[8/10] w-full rounded-2xl object-cover shadow-soft"
              />
              <span className="absolute right-4 top-4 rounded-full bg-gold-500/95 px-4 py-1.5 text-[11px] font-bold uppercase tracking-widest text-chocolate-900">
                {product.format}
              </span>
            </div>
          </Reveal>

          {/* Details */}
          <div>
            <Reveal>
              <p className="eyebrow mb-3">{product.category}</p>
              <h1 className="font-serif text-4xl leading-tight text-chocolate-800 sm:text-5xl">
                {product.title}
              </h1>
              <p className="mt-4 font-serif text-2xl text-gold-600">
                {Number(product.price).toFixed(2)}{' '}
                <span className="text-base">{product.currency}</span>
              </p>
            </Reveal>

            <Reveal delay={0.08}>
              <p className="mt-6 text-base leading-relaxed text-charcoal/75">
                {product.longDescription}
              </p>
            </Reveal>

            <Reveal delay={0.12}>
              <h2 className="mt-8 font-serif text-xl text-chocolate-800">
                What&rsquo;s inside
              </h2>
              <ul className="mt-4 space-y-2.5">
                {product.whatIsInside.map((line) => (
                  <li key={line} className="flex items-start gap-3 text-sm text-charcoal/75">
                    <span aria-hidden="true" className="mt-0.5 text-gold-500">
                      ✦
                    </span>
                    {line}
                  </li>
                ))}
              </ul>
            </Reveal>

            <Reveal delay={0.16}>
              <dl className="mt-8 grid grid-cols-3 gap-4 rounded-2xl bg-ivory-100 p-6">
                {[
                  ['Format', product.format],
                  ['Category', product.category],
                  ['Pages', product.pages ? String(product.pages) : '—'],
                ].map(([label, value]) => (
                  <div key={label}>
                    <dt className="text-[10px] uppercase tracking-[0.22em] text-chocolate-400">
                      {label}
                    </dt>
                    <dd className="mt-1 font-serif text-lg text-chocolate-800">
                      {value}
                    </dd>
                  </div>
                ))}
              </dl>
            </Reveal>

            <Reveal delay={0.2}>
              <div className="mt-8 rounded-2xl border border-gold-400/40 bg-gold-300/10 px-5 py-4">
                <p className="text-sm text-chocolate-800">
                  <span className="font-semibold">Digital product — PDF download.</span>{' '}
                  No physical product will be shipped. You receive instant access
                  after your payment is verified.
                </p>
              </div>
            </Reveal>

            <Reveal delay={0.24}>
              <div className="mt-8 flex flex-col gap-4 sm:flex-row">
                <PaymentButton product={product} className="btn-dark flex-1 !py-4" />
                <Link to="/shop" className="btn-outline flex-1 !py-4">
                  Continue Browsing
                </Link>
              </div>
              <p className="mt-4 text-xs text-charcoal/50">
                Checkout is handled securely by Paystack. We never see your card details.
              </p>
            </Reveal>
          </div>
        </div>
      </div>

      {/* More products */}
      <div className="container-content py-20 lg:py-24">
        <Reveal>
          <h2 className="mb-10 font-serif text-3xl text-chocolate-800">
            You might also like
          </h2>
        </Reveal>
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {others.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </div>
    </>
  );
}