import crypto from 'node:crypto';

const key = process.env.DOWNLOAD_SECRET || 'local-dev-signing-key-change-me';
const base = 'http://localhost:8787';
const mkToken = (payload) => {
  const b64 = Buffer.from(JSON.stringify(payload)).toString('base64url');
  const sig = crypto.createHmac('sha256', key).update(b64).digest('base64url');
  return `${b64}.${sig}`;
};

const expired = await fetch(`${base}/api/download/${mkToken({ pid: 'cake-masterclass', ref: 'X', iat: 1, exp: 1 })}`);
console.log('expired token ->', expired.status);

const empty = await fetch(`${base}/api/download/${mkToken({ pid: 'does-not-exist', ref: 'X', iat: 1, exp: 9999999999 })}`);
console.log('unknown product token ->', empty.status);

const valid = await fetch(`${base}/api/download/${mkToken({ pid: 'cake-masterclass', ref: 'R', iat: 1, exp: 9999999999 })}`);
console.log('valid token ->', valid.status, valid.headers.get('content-type'));
console.log('attachment header ->', valid.headers.get('content-disposition'));