/**
 * ============================================================
 * PAYMENT CORE — shared by the Express server AND Vercel functions
 * ============================================================
 * Everything here runs server-side only. The Paystack SECRET key
 * is read from env vars and never shipped to the browser.
 *
 * Flow
 *   init -> POST /api/payment/initialize (this lib)
 *           server validates product, computes the amount in minor
 *           units (pesewas), creates a unique reference, calls
 *           Paystack transaction/initialize, stores a PENDING order
 *           and hands the customer the authorization_url.
 *   pay  -> Paystack Checkout (redirect), customer pays.
 *   back -> customer returns to the callback_url.
 *   fulfil-> GET /api/payment/verify/:reference (this lib)
 *           server independently re-verifies the transaction with
 *           Paystack, re-checks amount/currency/product, marks the
 *           order PAID (idempotently) and issues a short-lived
 *           download token. A download is ONLY ever granted here.
 *   webhook -> POST /api/paystack/webhook (this lib)
 *           signature-verified (HMAC-SHA512 of the raw body) and
 *           idempotent, so retries can never double-approve.
 *
 * Amounts are integer minor units the whole way (GHS 25.00 = 2500).
 */
import crypto from 'node:crypto';
import { getProduct } from '../src/data/products.js';
import { getSecret, hasSecret, issueDownloadToken, publicProductMeta } from './verify.js';
import { getOrder, saveOrder, updateOrderStatus, ORDER_STATUS } from './orders.js';

const PAYSTACK_API = 'https://api.paystack.co';
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export { hasSecret, ORDER_STATUS };

/** GHS 25.00 -> 2500. Integer, no floating-point drift. */
export const toMinorUnits = (price) => Math.round(Number(price) * 100);

/** Friendly user-facing message — technical details stay in server logs. */
export const friendlyInternalError = () =>
  'We could not complete this payment right now. Please try again or contact support.';

/** Unique, URL-safe reference. Paystack requires reference uniqueness. */
export function createReference() {
  const rnd = crypto.randomBytes(4).toString('hex').toUpperCase();
  const time = Date.now().toString(36).toUpperCase();
  return `PKT-${time}-${rnd}`;
}

const paystackHeaders = () => ({ Authorization: `Bearer ${getSecret()}` });

/* ================================================ INITIALIZE */

/**
 * Validates the product + customer, computes the amount SERVER-SIDE,
 * creates a unique reference and asks Paystack to open a transaction.
 *
 * Returns { ok:true, checkout, product }
 *     or { ok:false, status, message }
 */
export async function initializeTransaction({
  productId,
  customerName,
  customerEmail,
  callbackUrl,
}) {
  if (!productId || typeof productId !== 'string') {
    return { ok: false, status: 400, message: 'Please choose a product before checking out.' };
  }
  if (!customerEmail || typeof customerEmail !== 'string' || !EMAIL_RE.test(customerEmail)) {
    return {
      ok: false,
      status: 400,
      message: 'Please provide a valid email address for your receipt.',
    };
  }
  if (callbackUrl && typeof callbackUrl === 'string' && !/^https?:\/\//.test(callbackUrl)) {
    return { ok: false, status: 400, message: 'Invalid return URL.' };
  }
  if (!hasSecret()) {
    console.error('[payments] PAYSTACK_SECRET_KEY is not configured.');
    return { ok: false, status: 503, message: friendlyInternalError() };
  }

  const product = getProduct(productId);
  if (!product) {
    return { ok: false, status: 404, message: 'This product is no longer available.' };
  }

  const amountMinor = toMinorUnits(product.price);
  const name = String(customerName || '').trim().slice(0, 120);

  // A failed duplicate-reference response gets one retry with a fresh reference.
  for (let attempt = 0; attempt < 3; attempt += 1) {
    const reference = createReference();
    const base = {
      email: String(customerEmail).trim().slice(0, 254),
      amount: amountMinor,
      currency: product.currency,
      reference,
      metadata: {
        productId: product.id,
        productTitle: product.title,
        custom_fields: [
          { display_name: 'Product', variable_name: 'product', value: product.title },
          ...(name
            ? [{ display_name: 'Customer name', variable_name: 'customer_name', value: name }]
            : []),
        ],
      },
    };
    const payload = callbackUrl && /^https?:\/\//.test(callbackUrl)
      ? { ...base, callback_url: String(callbackUrl).slice(0, 500) }
      : base;

    try {
      const pRes = await fetch(`${PAYSTACK_API}/transaction/initialize`, {
        method: 'POST',
        headers: { ...paystackHeaders(), 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await pRes.json();

      if (pRes.status === 400 && /reference/i.test(String(data?.message || ''))) {
        console.warn('[payments] duplicate reference retry:', reference);
        continue; // regenerate the reference and try again
      }
      if (!pRes.ok || data.status !== true) {
        console.error('[payments] initialize failed:', pRes.status, String(data?.message));
        return { ok: false, status: 502, message: friendlyInternalError() };
      }

      const ref = String(data.data.reference || reference);
      await saveOrder({
        reference: ref,
        customer: { name, email: String(customerEmail).trim() },
        productId: product.id,
        productTitle: product.title,
        amount: amountMinor,
        currency: product.currency,
        status: ORDER_STATUS.PENDING,
        paidAt: null,
        createdAt: new Date().toISOString(),
        metadata: {},
      });

      return {
        ok: true,
        checkout: {
          reference: ref,
          authorization_url: data.data.authorization_url,
          amount: amountMinor,
          currency: product.currency,
        },
        product: publicProductMeta(product),
      };
    } catch (err) {
      console.error('[payments] initialize network error:', err.message);
      return { ok: false, status: 502, message: friendlyInternalError() };
    }
  }
  return { ok: false, status: 502, message: friendlyInternalError() };
}

/* ================================================ VERIFY + FULFIL */

/**
 * Independently verifies a Paystack transaction on the server.
 * A download token is issued ONLY when Paystack itself confirms a
 * successful charge AND amount/currency/product all match the order.
 *
 * Runs idempotently: repeating a successful reference returns the
 * same result (the short-lived token can be re-issued for a receipt
 * re-visit); an order can only ever move forward toward PAID once.
 */
export async function verifyAndFulfil({ reference }) {
  if (!reference || typeof reference !== 'string') {
    return { ok: false, status: 400, message: 'No payment reference was provided.' };
  }
  if (!hasSecret()) {
    console.error('[payments] PAYSTACK_SECRET_KEY is not configured.');
    return { ok: false, status: 503, message: friendlyInternalError() };
  }

  try {
    const pRes = await fetch(`${PAYSTACK_API}/transaction/verify/${encodeURIComponent(reference)}`, {
      headers: paystackHeaders(),
    });
    const data = await pRes.json();

    if (pRes.status === 404 || data.status === false) {
      await updateOrderStatus(reference, ORDER_STATUS.FAILED);
      return {
        ok: false,
        status: 422,
        message: 'This transaction could not be found. The payment may not have been completed.',
      };
    }

    const txn = data.data;
    const order = await getOrder(reference);
    const product = (order && getProduct(order.productId)) || getProduct(String(txn?.metadata?.productId || ''));

    if (!product) {
      await updateOrderStatus(reference, ORDER_STATUS.FAILED);
      return { ok: false, status: 404, message: 'This product is no longer available.' };
    }

    const expectedAmount =
      order && Number.isFinite(Number(order.amount)) ? Number(order.amount) : toMinorUnits(product.price);
    const metadataProduct = String(txn?.metadata?.productId || '');

    const checks = {
      statusSuccess: txn?.status === 'success',
      amountMatches: Number(txn?.amount || 0) === expectedAmount,
      currencyMatches:
        String(txn?.currency || '').toUpperCase() === String(product.currency).toUpperCase(),
      productMatches: !metadataProduct || metadataProduct === product.id,
      orderReference: order ? order.reference === reference : true,
    };
    console.log(`[payments] verify ${reference} ->`, JSON.stringify(checks));

    if (!Object.values(checks).every(Boolean)) {
      await updateOrderStatus(reference, ORDER_STATUS.FAILED, {
        paidAt: null,
        failureReason: 'amount/currency/product mismatch',
      });
      return {
        ok: false,
        status: 422,
        message: 'This transaction did not match the expected order. Please contact support.',
      };
    }

    // Idempotent marking: an already-PAID order is left PAID.
    const fulfilled = await updateOrderStatus(reference, ORDER_STATUS.PAID, {
      paidAt: new Date().toISOString(),
      reference: String(txn?.reference || reference),
      amount: expectedAmount,
      currency: String(txn?.currency || product.currency).toUpperCase(),
    });

    return {
      ok: true,
      token: issueDownloadToken(product.id, String(txn?.reference || reference)),
      product: publicProductMeta(product),
      order: {
        reference: String(txn?.reference || reference),
        productId: product.id,
        productTitle: product.title,
        amount: expectedAmount,
        currency: String(txn?.currency || product.currency).toUpperCase(),
        status: ORDER_STATUS.PAID,
        paidAt: fulfilled?.paidAt || new Date().toISOString(),
        customer: fulfilled?.customer ? { email: fulfilled.customer.email, name: fulfilled.customer.name } : {},
      },
    };
  } catch (err) {
    console.error('[payments] verify network error:', err.message);
    return { ok: false, status: 502, message: friendlyInternalError() };
  }
}

/* ================================================ WEBHOOK */

/** Paystack v2 webhook signature: HMAC-SHA512 of the RAW body with the secret key. */
export function signWebhookPayload(rawBody, secret) {
  return crypto.createHmac('sha512', String(secret)).update(String(rawBody), 'utf8').digest('hex');
}

function verifySignature(rawBody, signature) {
  const secret = getSecret();
  if (!secret || typeof signature !== 'string' || !rawBody) return false;
  const expected = signWebhookPayload(rawBody, secret);
  const got = signature.toLowerCase().replace(/^sha512=/i, '');
  if (got.length !== 128) return false;
  try {
    return crypto.timingSafeEqual(Buffer.from(got, 'hex'), Buffer.from(expected, 'hex'));
  } catch {
    return false;
  }
}

/**
 * Handles a Paystack webhook event.
 * Returns { status, message } — the route responds accordingly.
 * Signature MUST validate or we refuse outright (401).
 * charge.success marks the order PAID only when amount/currency still
 * match, and only once (idempotent).
 */
export async function handleWebhook({ rawBody, signature }) {
  if (!getSecret()) {
    console.error('[webhook] PAYSTACK_SECRET_KEY is not configured.');
    return { status: 503, message: 'Server is not configured for webhooks.' };
  }
  if (!verifySignature(rawBody, signature)) {
    console.warn('[webhook] rejected — invalid signature.');
    return { status: 401, message: 'Invalid signature.' };
  }

  let event;
  try {
    event = JSON.parse(rawBody);
  } catch {
    return { status: 400, message: 'Invalid webhook body.' };
  }

  if (event.event !== 'charge.success') {
    // Acknowledge every event; only charge.success changes state.
    return { status: 200, message: 'Ignored.' };
  }

  const data = event.data || {};
  const reference = String(data.reference || '');
  if (!reference) return { status: 400, message: 'Missing reference.' };

  const order = await getOrder(reference);
  if (!order) {
    // We only accept references we started (initialize). Paystack retries
    // are safe to ack — the download is gated on the verify endpoint anyway.
    console.warn(`[webhook] unknown order reference: ${reference}`);
    return { status: 200, message: 'Unknown order — acknowledged.' };
  }
  if (order.status === ORDER_STATUS.PAID) {
    return { status: 200, message: 'Already processed.' }; // idempotent
  }

  const paidAmount = Number(data.amount || 0);
  const checksOk =
    String(data.status || '').toUpperCase() === 'SUCCESS' &&
    paidAmount === Number(order.amount) &&
    String(data.currency || '').toUpperCase() === String(order.currency).toUpperCase();

  await updateOrderStatus(reference, checksOk ? ORDER_STATUS.PAID : ORDER_STATUS.FAILED, {
    paidAt: checksOk ? new Date().toISOString() : null,
    failureReason: checksOk ? null : 'webhook amount/currency mismatch',
  });

  console.log(`[webhook] charge.success ${reference} -> ${checksOk ? 'PAID' : 'FAILED'}`);
  return { status: 200, message: checksOk ? 'Processed.' : 'Rejected as mismatch.' };
}