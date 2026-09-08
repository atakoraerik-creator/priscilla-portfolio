import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { payForProduct, PAYSTACK_KEY_CONFIGURED } from '../services/paystack';
import LoadingSpinner from './LoadingSpinner';
import ErrorMessage from './ErrorMessage';

/**
 * The complete "one-click to payment" experience.
 * Collects the email Paystack requires, opens the popup and then
 * redirects to /payment-success (with state) or /payment-failed.
 *
 * Nothing is granted client-side — the success page re-verifies
 * the transaction on the server before enabling any download.
 */
export default function PaymentButton({
  product,
  className = 'btn-gold',
  label = 'Buy Now',
}) {
  const [step, setStep] = useState('idle'); // idle | email | paying | error
  const [error, setError] = useState('');
  const [email, setEmail] = useState('');
  const navigate = useNavigate();

  const openCheckout = () => {
    setError('');
    if (!PAYSTACK_KEY_CONFIGURED) {
      setStep('error');
      setError(
        'Payments are not configured yet. Set VITE_PAYSTACK_PUBLIC_KEY, then try again.'
      );
      return;
    }
    setStep('email');
  };

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setStep('paying');
    try {
      const result = await payForProduct({
        product,
        customerEmail: email,
      });
      navigate(
        `/payment-success?ref=${encodeURIComponent(result.reference)}&product=${encodeURIComponent(
          result.productId
        )}&email=${encodeURIComponent(email)}`,
        { replace: true }
      );
    } catch (err) {
      setStep('error');
      setError(err.message || 'Payment could not be completed.');
    }
  };

  const closeModal = () => {
    if (step === 'paying') return;
    setStep('idle');
    setError('');
  };

  return (
    <>
      <button type="button" onClick={openCheckout} className={className}>
        {label}
      </button>

      <AnimatePresence>
        {step === 'email' && (
          <ModalShell onClose={closeModal} label="Checkout">
            <form onSubmit={handleEmailSubmit} className="space-y-5">
              <div>
                <h3 className="font-serif text-2xl text-chocolate-800">
                  {product.title}
                </h3>
                <p className="mt-1 text-sm text-charcoal/60">
                  {Number(product.price).toFixed(2)} {product.currency} · Digital
                  PDF · Secure checkout by Paystack
                </p>
              </div>

              <div>
                <label htmlFor="checkout-email" className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-chocolate-700">
                  Email for your receipt & download
                </label>
                <input
                  id="checkout-email"
                  type="email"
                  required
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="input"
                />
              </div>

              <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={closeModal}
                  className="btn-outline !px-5 !py-2.5 text-xs"
                >
                  Cancel
                </button>
                <button type="submit" className="btn-dark !px-8">
                  Pay {Number(product.price).toFixed(2)} {product.currency}
                </button>
              </div>
              <p className="text-xs text-charcoal/50">
                You will be redirected to Paystack to complete your secure
                payment. No physical product will be shipped.
              </p>
            </form>
          </ModalShell>
        )}

        {step === 'paying' && (
          <ModalShell onClose={() => {}} label="Redirecting to Paystack">
            <LoadingSpinner label="Opening secure checkout" />
          </ModalShell>
        )}

        {step === 'error' && (
          <ModalShell onClose={closeModal} label="Payment error">
            <ErrorMessage title="Payment could not be completed" message={error} />
            <div className="mt-5 flex justify-end gap-3">
              <button
                type="button"
                onClick={closeModal}
                className="btn-outline !px-5 !py-2.5 text-xs"
              >
                Close
              </button>
              <button
                type="button"
                onClick={openCheckout}
                className="btn-dark !px-6 !py-2.5 text-xs"
              >
                Try Again
              </button>
            </div>
          </ModalShell>
        )}
      </AnimatePresence>
    </>
  );
}

function ModalShell({ children, onClose, label }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[90] flex items-center justify-center bg-chocolate-900/70 p-4 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-label={label}
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 12, scale: 0.98 }}
        transition={{ duration: 0.25 }}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-md rounded-2xl bg-white p-7 shadow-2xl"
      >
        {children}
      </motion.div>
    </motion.div>
  );
}