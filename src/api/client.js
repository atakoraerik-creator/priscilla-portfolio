/** Thin fetch wrapper for the server-side API (/api). */

async function request(path, { method = 'GET', body } = {}) {
  const res = await fetch(path, {
    method,
    headers: { 'Content-Type': 'application/json' },
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

export const verifyPayment = ({ reference, productId }) =>
  request('/api/paystack/verify', {
    method: 'POST',
    body: { reference, productId },
  });

export const health = () => request('/api/health');