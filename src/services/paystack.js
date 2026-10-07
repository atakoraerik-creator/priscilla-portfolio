/**
 * Frontend Paystack integration — the PUBLIC key indicator only.
 *
 * Checkout now uses the SERVER-INITIALIZED redirect flow:
 *   the backend calls Paystack, and the customer is redirected to
 *   Paystack's hosted checkout. The public key is therefore never
 *   needed to start a payment — we keep it here purely to show a
 *   friendly "not configured yet" message during development.
 *
 * The SECRET key NEVER appears in this folder (or anywhere in the
 * browser bundle).
 */

const publicKey = import.meta.env.VITE_PAYSTACK_PUBLIC_KEY || '';

export const PAYSTACK_KEY_CONFIGURED = Boolean(publicKey);