/**
 * Frontend Paystack integration.
 * The PUBLIC key (VITE_PAYSTACK_PUBLIC_KEY) is safe to ship to
 * the browser. The SECRET key NEVER appears in this folder.
 */

const publicKey = import.meta.env.VITE_PAYSTACK_PUBLIC_KEY || '';

export const PAYSTACK_KEY_CONFIGURED = Boolean(publicKey);

/** Simple random reference, e.g. "SA-9f2kXq7L1" */
export function createReference(prefix = 'PA') {
  const rand = Math.random().toString(36).slice(2, 10).toUpperCase();
  const time = Date.now().toString(36).toUpperCase();
  return `${prefix}-${time}-${rand}`;
}

function parseErrorMessage(err) {
  if (!err) return 'Payment could not be completed.';
  return err.message || String(err);
}

/**
 * Initialises the Paystack inline popup, memory-safe (dynamically
 * imported so it is code-split away from the initial bundle).
 */
export async function initiatePaystack({
  email,
  amount, // in minor units (pesewas)
  currency = 'GHS',
  reference,
  productId,
  metadata = {},
  onSuccess,
  onCancel,
}) {
  if (!PAYSTACK_KEY_CONFIGURED) {
    throw new Error(
      'Paystack is not configured yet. Please set VITE_PAYSTACK_PUBLIC_KEY.'
    );
  }

  const PaystackPop = (await import('@paystack/inline-js')).default;
  const handler = new PaystackPop();

  handler.newTransaction({
    key: publicKey,
    email,
    amount,
    currency,
    ref: reference,
    metadata: { ...metadata, productId },
    onSuccess: (response) =>
      onSuccess({
        reference: response.reference,
        trxref: response.trxref,
        productId,
        email,
      }),
    onCancel: () => {
      if (onCancel) onCancel();
    },
  });
}

/** High-level helper used by the payment button. */
export async function payForProduct({ product, customerEmail }) {
  const reference = createReference('PAST4RY');
  const amountInPesewas = Math.round(product.price * 100);

  return new Promise((resolve, reject) => {
    const metadata = {
      productId: product.id,
      productTitle: product.title,
      custom_fields: [
        {
          display_name: 'Product',
          variable_name: 'product',
          value: product.title,
        },
      ],
    };

    let settled = false;

    initiatePaystack({
      email: customerEmail,
      amount: amountInPesewas,
      currency: product.currency,
      reference,
      productId: product.id,
      metadata,
      onSuccess: (result) => {
        settled = true;
        resolve(result);
      },
      onCancel: () => {
        if (settled) return;
        settled = true;
        reject(new Error('Payment was cancelled. Nothing was charged.'));
      },
    }).catch((err) => {
      if (settled) return;
      settled = true;
      reject(new Error(parseErrorMessage(err)));
    });
  });
}