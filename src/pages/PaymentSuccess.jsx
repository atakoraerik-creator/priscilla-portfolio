import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import Seo from '../components/Seo';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import { verifyPayment } from '../api/client';
import { formatMoney } from '../data/products';

const STORAGE_KEY = 'spa_purchase';

function readStoredPurchase() {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function writeStoredPurchase(purchase) {
  try {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(purchase));
  } catch {
    /* private mode — ignore */
  }
}

export default function PaymentSuccess() {
  const [params] = useSearchParams();
  const [state, setState] = useState(null);
  const [verifying, setVerifying] = useState(false);
  const [error, setError] = useState('');

  const reference = params.get('ref');
  const productId = params.get('product');

  useEffect(() => {
    const stored = readStoredPurchase();

    // No reference at all
    if (!reference || !productId) {
      if (stored && stored.status === 'verified' && stored.reference) {
        setState(stored);
        return;
      }
      setState({ status: 'error' });
      return;
    }

    // Restore an already-verified purchase for the same reference
    if (stored && stored.status === 'verified' && stored.reference === reference) {
      setState(stored);
      return;
    }

    setVerifying(true);
    setError('');
    verifyPayment({ reference, productId })
      .then((data) => {
        if (data && data.verified && data.token && data.product) {
          const purchase = {
            status: 'verified',
            reference,
            productId,
            product: data.product,
            token: data.token,
          };
          writeStoredPurchase(purchase);
          setState(purchase);
        } else {
          setState({ status: 'error' });
          setError(
            data?.message ||
              'Your payment could not be verified. This can happen if the payment was not completed.'
          );
        }
      })
      .catch((err) => {
        setState({ status: 'error' });
        setError(err.message || 'Payment verification failed. Please try again.');
      })
      .finally(() => setVerifying(false));
  }, [reference, productId]);

  return (
    <>
      <Seo title="Payment Successful" noindex />

      <section className="container-content flex min-h-[80vh] items-center justify-center py-32">
        <div className="w-full max-w-xl text-center">
          {verifying && <LoadingSpinner label="Verifying your payment" />}

          {!verifying && state?.status === 'error' && (
            <div className="flex flex-col items-center">
              <CircleIcon className="h-14 w-14 text-amber-500" type="question" />
              <h1 className="mt-6 font-serif text-3xl text-chocolate-800">
                Payment verification incomplete
              </h1>
              <div className="mt-6 w-full text-left">
                <ErrorMessage
                  title="We could not verify this purchase"
                  message={
                    error ||
                    'No payment reference was provided. Please return to the shop.'
                  }
                />
              </div>
              <div className="mt-8 flex gap-3">
                <Link to="/shop" className="btn-dark">
                  Return to Shop
                </Link>
              </div>
            </div>
          )}

          {!verifying && state?.status === 'verified' && (
            <>
              <CircleIcon className="h-14 w-14 text-green-500" type="check" />
              <h1 className="mt-6 font-serif text-3xl text-chocolate-800">
                Payment successful
              </h1>
              <p className="mt-2 text-sm text-charcoal/60">
                Thank you for your purchase — your digital product is ready.
              </p>

              <div className="mt-10 rounded-2xl border border-chocolate-500/10 bg-white p-8 text-left shadow-card">
                <dl className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <dt className="text-[10px] uppercase tracking-[0.25em] text-chocolate-400">
                      Product
                    </dt>
                    <dd className="mt-1 font-serif text-lg text-chocolate-800">
                      {state.product.title}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-[10px] uppercase tracking-[0.25em] text-chocolate-400">
                      Amount paid
                    </dt>
                    <dd className="mt-1 font-serif text-lg text-gold-600">
                      {formatMoney(
                        Math.round(state.product.price * 100),
                        state.product.currency
                      )}
                    </dd>
                  </div>
                  <div className="sm:col-span-2">
                    <dt className="text-[10px] uppercase tracking-[0.25em] text-chocolate-400">
                      Transaction reference
                    </dt>
                    <dd className="mt-1 break-all text-sm text-charcoal/70">
                      {state.reference}
                    </dd>
                  </div>
                </dl>

                <a
                  href={`/api/download/${encodeURIComponent(state.token)}`}
                  className="btn-gold mt-8 w-full !py-4"
                >
                  Download your PDF
                </a>
                <p className="mt-3 text-center text-xs text-charcoal/50">
                  The download link is temporary. If it expires, return here or
                  check your email receipt.
                </p>
              </div>

              <div className="mt-10">
                <Link
                  to="/shop"
                  className="text-sm font-medium text-gold-600 hover:text-gold-500"
                >
                  Continue browsing the shop →
                </Link>
              </div>
            </>
          )}
        </div>
      </section>
    </>
  );
}

function CircleIcon({ className = 'h-14 w-14', type }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      className={className}
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="10" strokeOpacity="0.25" />
      {type === 'check' ? (
        <path d="m8 12.5 2.6 2.6L16.5 9.5" strokeLinecap="round" strokeLinejoin="round" />
      ) : (
        <path d="M9 9a3 3 0 1 1 4.6 2.6c-.8.5-1.1 1-1.1 2.1m0 3.4h.01" strokeLinecap="round" />
      )}
    </svg>
  );
}