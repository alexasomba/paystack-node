import crypto from 'node:crypto';

export const DEFAULT_IDEMPOTENCY_HEADER = 'Idempotency-Key';

export type IdempotencyKeyInput =
  | { mode: 'none' }
  | { mode: 'static'; key: string }
  | { mode: 'auto' }
  | { mode: 'custom'; generate: () => string };

export function createIdempotencyKey(): string {
  if (typeof crypto.randomUUID === 'function') return crypto.randomUUID();
  return crypto.randomBytes(16).toString('hex');
}

export function hasHeader(headers: HeadersInit | undefined, name: string): boolean {
  if (!headers) return false;
  const target = name.toLowerCase();

  if (headers instanceof Headers) return headers.has(name);

  if (Array.isArray(headers)) {
    return headers.some(([k]) => String(k).toLowerCase() === target);
  }

  for (const k of Object.keys(headers)) {
    if (k.toLowerCase() === target) return true;
  }
  return false;
}

export function setHeader(headers: HeadersInit | undefined, name: string, value: string): Headers {
  const out = new Headers(headers ?? undefined);
  out.set(name, value);
  return out;
}

export function resolveIdempotencyKey(input: IdempotencyKeyInput): string | undefined {
  switch (input.mode) {
    case 'none':
      return undefined;
    case 'static':
      return input.key;
    case 'auto':
      return createIdempotencyKey();
    case 'custom':
      return input.generate();
  }
}
