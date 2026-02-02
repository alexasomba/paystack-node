export const DEFAULT_REQUEST_ID_HEADERS = [
  'x-paystack-request-id',
  'x-request-id',
] as const;

export function getPaystackRequestId(headers: Headers | HeadersInit): string | undefined {
  const h = headers instanceof Headers ? headers : new Headers(headers);

  for (const name of DEFAULT_REQUEST_ID_HEADERS) {
    const value = h.get(name);
    if (value && value.trim()) return value.trim();
  }

  return undefined;
}

export type PaystackApiErrorOptions = {
  status?: number;
  url?: string;
  requestId?: string;
  error?: unknown;
};

export class PaystackApiError extends Error {
  readonly name = 'PaystackApiError';
  readonly status?: number;
  readonly url?: string;
  readonly requestId?: string;
  readonly error?: unknown;

  constructor(message: string, options: PaystackApiErrorOptions = {}) {
    super(message);
    this.status = options.status;
    this.url = options.url;
    this.requestId = options.requestId;
    this.error = options.error;
  }
}

export type OpenapiFetchResult<TData = unknown, TError = unknown> = {
  data?: TData;
  error?: TError;
  response: Response;
};

export function isPaystackApiError(value: unknown): value is PaystackApiError {
  return value instanceof PaystackApiError;
}

/**
 * Convert an openapi-fetch style result into a structured PaystackApiError.
 * Returns undefined when there is no error.
 */
export function toPaystackApiError<TData = unknown, TError = unknown>(
  result: OpenapiFetchResult<TData, TError>,
): PaystackApiError | undefined {
  if (!result.error) return undefined;

  const requestId = getPaystackRequestId(result.response.headers);
  const status = result.response.status;
  const url = result.response.url;

  const suffix = requestId ? ` (requestId: ${requestId})` : '';
  return new PaystackApiError(`Paystack API request failed with status ${status}${suffix}`, {
    status,
    url,
    requestId,
    error: result.error,
  });
}

/**
 * Convenience helper for openapi-fetch style results.
 * Throws a structured error when `result.error` exists.
 */
export function assertOk<TData = unknown, TError = unknown>(result: OpenapiFetchResult<TData, TError>): TData {
  const maybeError = toPaystackApiError(result);
  if (maybeError) throw maybeError;
  return result.data as TData;
}
