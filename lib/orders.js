/**
 * ============================================================
 * ORDER STORE — minimal persistence for a stateless application
 * ============================================================
 * There is intentionally no heavy database. Orders are stored
 * through one of these backends (best available wins):
 *
 *   1. Upstash Redis REST  — set UPSTASH_REDIS_REST_URL and
 *                            UPSTASH_REDIS_REST_TOKEN. RECOMMENDED on
 *                            Vercel (survives cold starts & instances).
 *                            No SDK dependency — plain REST + fetch.
 *   2. Local JSON file      — default dev store, written to
 *                            ./data/orders.json (falls back to the OS
 *                            temp dir when the project dir is read-only).
 *   3. In-memory Map        — final fallback (per server instance).
 *
 * Orders NEVER contain card details — Paystack keeps those; it only
 * ever hands us an opaque reference.
 */
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export const ORDER_STATUS = Object.freeze({
  PENDING: 'PENDING',
  PAID: 'PAID',
  FAILED: 'FAILED',
  CANCELLED: 'CANCELLED',
});

/* ------------------------------------------------ memory + file */
const memory = new Map();
let fileReady = false;
let filePath = '';

function initFile() {
  if (fileReady) return true;
  const candidates = [
    process.env.ORDER_STORE_DIR,
    path.join(__dirname, '..', 'data'),
    path.join(os.tmpdir(), 'asamcy-orders'),
  ]
    .filter(Boolean)
    .map((d) => ({ dir: d, test: path.join(d, '.write-test') }));

  for (const { dir, test } of candidates) {
    try {
      fs.mkdirSync(dir, { recursive: true });
      fs.writeFileSync(test, '1');
      fs.rmSync(test);
      filePath = path.join(dir, 'orders.json');
      // Load previously persisted orders (dev restarts).
      if (fs.existsSync(filePath)) {
        const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
        if (Array.isArray(data)) {
          data.forEach((o) => o && o.reference && memory.set(o.reference, o));
        }
      }
      fileReady = true;
      return true;
    } catch {
      /* this candidate is not writable — try the next one */
    }
  }
  fileReady = true; // memory only
  return false;
}

function persist() {
  if (!filePath) return;
  try {
    fs.writeFileSync(filePath, JSON.stringify([...memory.values()], null, 2));
  } catch {
    /* write-through is best-effort */
  }
}

/* ------------------------------------------------ upstash */
const hasUpstash = () =>
  Boolean(process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN);

const upstashBase = () => process.env.UPSTASH_REDIS_REST_URL.replace(/\/+$/, '');

async function upstashGet(key) {
  try {
    const res = await fetch(`${upstashBase()}/get/${encodeURIComponent(key)}`, {
      headers: { Authorization: `Bearer ${process.env.UPSTASH_REDIS_REST_TOKEN}` },
    });
    const json = await res.json();
    if (!json || json.result === null) return null;
    return typeof json.result === 'string' ? JSON.parse(json.result) : json.result;
  } catch (err) {
    console.error('[orders] upstash get failed:', err.message);
    return null;
  }
}

async function upstashSet(key, value) {
  try {
    const res = await fetch(`${upstashBase()}/set/${encodeURIComponent(key)}`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${process.env.UPSTASH_REDIS_REST_TOKEN}` },
      body: JSON.stringify(value),
    });
    return res.ok;
  } catch (err) {
    console.error('[orders] upstash set failed:', err.message);
    return false;
  }
}

/* ------------------------------------------------ public API */
const orderKey = (reference) => `orders:${String(reference || '')}`;

export async function getOrder(reference) {
  const key = String(reference || '');
  if (!key || key.length > 128) return null;
  if (hasUpstash()) return upstashGet(orderKey(key));
  return memory.get(key) || null;
}

export async function saveOrder(order) {
  const reference = String(order?.reference || '');
  if (!reference) return null;
  const copy = { ...order, reference, updatedAt: new Date().toISOString() };
  if (hasUpstash()) {
    await upstashSet(orderKey(reference), copy);
    return copy;
  }
  memory.set(reference, copy);
  if (initFile()) persist();
  return copy;
}

export async function updateOrderStatus(reference, status, extra = {}) {
  const current = await getOrder(reference);
  if (!current) return null;
  const copy = {
    ...current,
    status,
    ...extra,
    updatedAt: new Date().toISOString(),
  };
  if (hasUpstash()) {
    await upstashSet(orderKey(reference), copy);
    return copy;
  }
  memory.set(reference, copy);
  persist();
  return copy;
}