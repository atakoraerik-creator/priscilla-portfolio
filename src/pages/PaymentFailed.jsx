import { Link, useSearchParams } from 'react-router-dom';
import Seo from '../components/Seo';

export default function PaymentFailed() {
  const [params] = useSearchParams();
  const productId = params.get('product');

  return (
    <>
      <Seo title="Payment Failed" noindex />

      <section className="container-content flex min-h-[80vh] items-center justify-center py-32">
        <div className="w-full max-w-xl text-center">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.6"
            className="mx-auto h-14 w-14 text-red-500"
            aria-hidden="true"
          >
            <circle cx="12" cy="12" r="10" strokeOpacity="0.2" />
            <path d="m9.2 9.2 5.6 5.6m0-5.6-5.6 5.6" strokeLinecap="round" />
          </svg>

          <h1 className="mt-6 font-serif text-3xl text-chocolate-800">
            Payment was not completed
          </h1>
          <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-charcoal/60">
            It looks like the payment was cancelled or did not go through. Your
            card was not charged. You can try again, or return to the shop.
          </p>

          <div className="mt-10 flex flex-col justify-center gap-3 sm:flex-row">
            <a href="/shop" className="btn-dark">
              Try Again
            </a>
            <Link to="/shop" className="btn-outline">
              Return to Shop
            </Link>
          </div>

          <p className="mt-8 text-xs text-charcoal/45">
            Any transaction with {productId && <span className="font-medium">reference</span>}{' '}
            shown in your Paystack receipt was not completed.
          </p>
        </div>
      </section>
    </>
  );
}