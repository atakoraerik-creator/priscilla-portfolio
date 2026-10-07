/**
 * Small session-state helpers for the checkout/return flow.
 * Nothing sensitive — just enough context to restore the success page
 * and show helpful messages after Paystack redirects the customer back.
 */

const PENDING_KEY = 'spa_pending_checkout';

export function savePendingCheckout({ reference, productId }) {
  try {
    sessionStorage.setItem(PENDING_KEY, JSON.stringify({ reference, productId }));
  } catch {
    /* private mode — ignore */
  }
}

export function readPendingCheckout() {
  try {
    const raw = sessionStorage.getItem(PENDING_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function clearPendingCheckout() {
  try {
    sessionStorage.removeItem(PENDING_KEY);
  } catch {
    /* ignore */
  }
}