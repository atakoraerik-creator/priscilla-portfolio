/** Thin fetch wrapper for the server-side API (/api). */

async function request(path, { method = 'GET', body } = {}) {
  const res = await fetch(path, {
    method,
    headers: body ? { 'Content-Type': 'application/json' } : undefined,
    body: body ? JSON.stringify(body) : undefined,
  });

  let data = null;
  try {
    data = await res.json();
  } catch {
    data = null;
  }

  if (!res.ok) {
    const message =
      data && data.message ? data.message : 'Something went wrong on our side.';
    const err = new Error(message);
    err.status = res.status;
    throw err;
  }
  return data;
}

/**
 * Server-side checkout initialization. The backend validates the
 * product, computes the amount, and returns the Paystack
 * authorization_url to redirect the customer to.
 */
export const initializePayment = ({ productId, customerName, customerEmail, callbackUrl }) =>
  request('/api/payment/initialize', {
    method: 'POST',
    body: { productId, customerName, customerEmail, callbackUrl },
  });

/** Server-side verification. Grants the download only when Paystack confirms payment. */
export const verifyPayment = (reference) =>
  request(`/api/payment/verify/${encodeURIComponent(reference)}`);

export const health = () => request('/api/health');