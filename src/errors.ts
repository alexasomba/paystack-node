export const DEFAULT_REQUEST_ID_HEADERS = ["x-paystack-request-id", "x-request-id"] as const;

/**
 * Extracts a Paystack Request ID from response headers.
 */
export function getPaystackRequestId(headers: Headers | HeadersInit): string | undefined {
  const h = headers instanceof Headers ? headers : new Headers(headers);

  for (const name of DEFAULT_REQUEST_ID_HEADERS) {
    const value = h.get(name);
    if (value !== null && value.trim() !== "") return value.trim();
  }

  return undefined;
}

export type PaystackErrorType =
  | "api_error"
  | "validation_error"
  | "processor_error"
  | (string & {});

export interface PaystackErrorOptions {
  message: string;
  code?: string;
  type?: PaystackErrorType;
  status?: number;
  requestId?: string;
  meta?: Record<string, unknown>;
  /** Parsed Paystack response envelope or transport payload used to create this error. */
  raw?: unknown;
  /** Alias for raw, kept for callers that prefer body-oriented naming. */
  body?: unknown;
  /** Original transport/openapi-fetch error, when one exists. */
  cause?: unknown;
}

/**
 * Standard Paystack API Error
 */
export class PaystackError extends Error {
  /** The machine-readable error code */
  public readonly code?: string;
  /** The error type (e.g., api_error, validation_error, processor_error) */
  public readonly type?: string;
  /** The HTTP status code */
  public readonly status?: number;
  /** The request ID for debugging with Paystack support */
  public readonly requestId?: string;
  /** Additional metadata from the error response */
  public readonly meta?: Record<string, unknown>;
  /** Parsed Paystack response envelope or transport payload used to create this error. */
  public readonly raw?: unknown;
  /** Alias for raw, kept for callers that prefer body-oriented naming. */
  public readonly body?: unknown;

  constructor(options: PaystackErrorOptions) {
    const requestId = options.requestId;
    const suffix =
      requestId !== undefined && requestId !== null && requestId !== ""
        ? ` (requestId: ${requestId})`
        : "";
    super(
      `${options.message}${suffix}`,
      options.cause === undefined ? undefined : { cause: options.cause },
    );
    this.name = "PaystackError";
    this.code = options.code;
    this.type = options.type;
    this.status = options.status;
    this.requestId = options.requestId;
    this.meta = options.meta;
    this.raw = options.raw ?? options.body;
    this.body = options.body ?? options.raw;

    // Ensure proper stack trace in Node.js
    if (typeof Error.captureStackTrace === "function") {
      Error.captureStackTrace(this, PaystackError);
    }
  }

  /**
   * Helper to determine if the error is a processor-level issue
   * (e.g., insufficient funds, card declined)
   */
  public isProcessorError(): boolean {
    return this.type === "processor_error";
  }

  /**
   * Helper to determine if the error is due to invalid request parameters
   */
  public isValidationError(): boolean {
    return this.type === "validation_error";
  }
}

/**
 * @deprecated Use PaystackError
 */
export const PaystackApiError = PaystackError;

/**
 * @deprecated Use PaystackError
 */
export function isPaystackApiError(value: unknown): value is PaystackError {
  return value instanceof PaystackError;
}
