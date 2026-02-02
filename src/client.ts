import createClient, { type Client } from 'openapi-fetch';
import type { paths } from './openapi-types.js';
import {
  DEFAULT_IDEMPOTENCY_HEADER,
  type IdempotencyKeyInput,
  hasHeader,
  resolveIdempotencyKey,
  setHeader,
} from './idempotency.js';

export type PaystackPaths = paths;
export type PaystackClient = Client<PaystackPaths>;

export type PaystackClientOptions = {
  secretKey: string;
  baseUrl?: string;
  fetch?: typeof fetch;
  headers?: Record<string, string>;
  /** Abort the request if it takes longer than this many milliseconds. */
  timeoutMs?: number;
  /** Automatically retry transient failures (defaults to safe/idempotent methods only). */
  retry?: PaystackRetryOptions;
  /**
   * Adds an idempotency key header automatically on POST requests (useful for safe retries).
   * If you already set an Idempotency-Key header per request, this will not override it.
   */
  idempotencyKey?: 'auto' | string | (() => string);
  /** Header name to use for idempotency. Default: 'Idempotency-Key' */
  idempotencyHeader?: string;
};

export type PaystackRetryOptions = {
  /** Number of retries after the initial attempt. Default: 2 */
  retries?: number;
  /** Minimum backoff delay. Default: 250 */
  minDelayMs?: number;
  /** Maximum backoff delay. Default: 2000 */
  maxDelayMs?: number;
  /** HTTP statuses to retry. Default: [408, 429, 500, 502, 503, 504] */
  retryOnStatuses?: number[];
  /** HTTP methods to retry. Default: ['GET','HEAD','OPTIONS'] */
  retryOnMethods?: string[];
};

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function isBodyRetryable(body: RequestInit['body']) {
  if (typeof body === 'undefined' || body === null) return true;
  if (typeof body === 'string') return true;
  if (body instanceof ArrayBuffer) return true;
  if (ArrayBuffer.isView(body)) return true;
  // Unknown/streaming bodies may not be reusable across retries.
  return false;
}

function resolveIdempotencyMode(options: { idempotencyKey?: 'auto' | string | (() => string) }): IdempotencyKeyInput {
  const key = options.idempotencyKey;
  if (!key) return { mode: 'none' };
  if (key === 'auto') return { mode: 'auto' };
  if (typeof key === 'function') return { mode: 'custom', generate: key };
  return { mode: 'static', key };
}

function wrapFetch(
  fetchImpl: typeof fetch,
  options: {
    timeoutMs?: number;
    retry?: PaystackRetryOptions;
    idempotency?: IdempotencyKeyInput;
    idempotencyHeader?: string;
  },
): typeof fetch {
  const retries = options.retry?.retries ?? 2;
  const minDelayMs = options.retry?.minDelayMs ?? 250;
  const maxDelayMs = options.retry?.maxDelayMs ?? 2000;
  const retryOnStatuses = options.retry?.retryOnStatuses ?? [408, 429, 500, 502, 503, 504];
  const retryOnMethods = (options.retry?.retryOnMethods ?? ['GET', 'HEAD', 'OPTIONS']).map((m) => m.toUpperCase());
  const idempotencyHeader = options.idempotencyHeader ?? DEFAULT_IDEMPOTENCY_HEADER;

  return (async (input: RequestInfo | URL, init?: RequestInit) => {
    const method = (init?.method ?? 'GET').toUpperCase();

    const idempotencyAlreadySet = hasHeader(init?.headers, idempotencyHeader);
    const canAddIdempotency = method === 'POST' && !idempotencyAlreadySet;
    const autoKey = canAddIdempotency && options.idempotency ? resolveIdempotencyKey(options.idempotency) : undefined;
    const initWithIdempotency = autoKey ? { ...init, headers: setHeader(init?.headers, idempotencyHeader, autoKey) } : init;

    const canRetryByMethod = retries > 0 && retryOnMethods.includes(method) && isBodyRetryable(init?.body);
    // Allow POST retries only when an idempotency key is present.
    const canRetryByIdempotency =
      retries > 0 && method === 'POST' && (idempotencyAlreadySet || Boolean(autoKey)) && isBodyRetryable(init?.body);
    const canRetry = canRetryByMethod || canRetryByIdempotency;

    const attemptFetch = async () => {
      const timeoutMs = options.timeoutMs;
      if (!timeoutMs || timeoutMs <= 0) return fetchImpl(input, initWithIdempotency);

      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), timeoutMs);

      const onAbort = () => controller.abort();
      if (initWithIdempotency?.signal) {
        if (initWithIdempotency.signal.aborted) controller.abort();
        else initWithIdempotency.signal.addEventListener('abort', onAbort, { once: true });
      }

      try {
        return await fetchImpl(input, { ...initWithIdempotency, signal: controller.signal });
      } finally {
        clearTimeout(timer);
        if (initWithIdempotency?.signal) initWithIdempotency.signal.removeEventListener('abort', onAbort);
      }
    };

    let lastError: unknown;
    for (let attempt = 0; attempt <= (canRetry ? retries : 0); attempt += 1) {
      try {
        const response = await attemptFetch();
        if (!canRetry) return response;
        if (!retryOnStatuses.includes(response.status)) return response;

        // Respect Retry-After on 429 if present.
        let delayMs: number | undefined;
        if (response.status === 429) {
          const retryAfter = response.headers.get('retry-after');
          if (retryAfter) {
            const seconds = Number.parseInt(retryAfter, 10);
            if (Number.isFinite(seconds) && seconds >= 0) delayMs = seconds * 1000;
          }
        }

        if (attempt >= retries) return response;

        const backoffBase = Math.min(maxDelayMs, minDelayMs * 2 ** attempt);
        const jitter = 0.5 + Math.random();
        await sleep(Math.min(maxDelayMs, delayMs ?? Math.floor(backoffBase * jitter)));
        continue;
      } catch (err) {
        lastError = err;
        if (!canRetry || attempt >= retries) throw err;

        const backoffBase = Math.min(maxDelayMs, minDelayMs * 2 ** attempt);
        const jitter = 0.5 + Math.random();
        await sleep(Math.floor(backoffBase * jitter));
      }
    }

    throw lastError;
  }) as typeof fetch;
}

export function createPaystackClient(options: PaystackClientOptions): PaystackClient {
  const baseUrl = options.baseUrl ?? 'https://api.paystack.co';

  const baseFetch = options.fetch ?? fetch;
  const wrappedFetch = wrapFetch(baseFetch, {
    timeoutMs: options.timeoutMs,
    retry: options.retry,
    idempotency: resolveIdempotencyMode(options),
    idempotencyHeader: options.idempotencyHeader,
  });

  return createClient<PaystackPaths>({
    baseUrl,
    fetch: wrappedFetch,
    headers: {
      Authorization: `Bearer ${options.secretKey}`,
      ...options.headers,
    },
  });
}
