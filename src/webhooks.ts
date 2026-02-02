import crypto from 'node:crypto';

export type PaystackWebhookSignatureInput = {
  rawBody: string | Buffer | Uint8Array;
  signature: string;
  secret: string;
};

export function computePaystackWebhookSignature(rawBody: string | Buffer | Uint8Array, secret: string) {
  const body = typeof rawBody === 'string' ? Buffer.from(rawBody, 'utf8') : Buffer.from(rawBody);
  return crypto.createHmac('sha512', secret).update(body).digest('hex');
}

export function verifyPaystackWebhookSignature(input: PaystackWebhookSignatureInput) {
  const expected = computePaystackWebhookSignature(input.rawBody, input.secret);
  const provided = (input.signature ?? '').trim().toLowerCase();

  if (!provided) return false;

  const expectedBuf = Buffer.from(expected, 'utf8');
  const providedBuf = Buffer.from(provided, 'utf8');

  if (expectedBuf.length !== providedBuf.length) return false;

  return crypto.timingSafeEqual(expectedBuf, providedBuf);
}
