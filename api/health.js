/** GET /api/health — liveness check for Vercel. */
export default function handler(_req, res) {
  res.json({ ok: true, name: 'asamcy-vercel', time: Date.now() });
}