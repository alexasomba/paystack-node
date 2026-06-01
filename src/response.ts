import { PaystackError, getPaystackRequestId, type PaystackErrorType } from "./errors.js";

/**
 * Base structure of a Paystack API response body
 */
export interface PaystackRawResponse<T = unknown> {
  status: boolean;
  message: string;
  data: T;
  code?: string;
  type?: PaystackErrorType;
  meta?: Record<string, unknown>;
  errorCodeMappingNotFound?: boolean;
}

interface PaystackErrorEnvelope {
  message?: string;
  code?: string;
  type?: PaystackErrorType;
  meta?: Record<string, unknown>;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function getStringField(source: unknown, field: string): string | undefined {
  if (!isRecord(source)) return undefined;
  const value = source[field];
  return typeof value === "string" && value !== "" ? value : undefined;
}

function getMeta(source: unknown): Record<string, unknown> | undefined {
  if (!isRecord(source)) return undefined;
  const value = source.meta;
  return isRecord(value) ? value : undefined;
}

function getPaystackEnvelope(source: unknown): PaystackErrorEnvelope {
  return {
    message: getStringField(source, "message"),
    code: getStringField(source, "code"),
    type: getStringField(source, "type") as PaystackErrorType | undefined,
    meta: getMeta(source),
  };
}

function resolveErrorMessage(error: unknown, raw: unknown): string {
  const errorEnvelope = getPaystackEnvelope(error);
  if (errorEnvelope.message !== undefined) return errorEnvelope.message;

  const rawEnvelope = getPaystackEnvelope(raw);
  if (rawEnvelope.message !== undefined) return rawEnvelope.message;

  if (error instanceof Error && error.message !== "") return error.message;
  return "Network or HTTP Error";
}

/**
 * Enhanced response wrapper for the Paystack SDK.
 * Provides .unwrap() and .data helpers for elegant error handling.
 */
export class PaystackResponse<T> {
  constructor(
    /** The raw JSON data returned in the response body */
    public readonly raw: PaystackRawResponse<T> | undefined,
    /** The error object if the request failed (from openapi-fetch) */
    public readonly error: unknown,
    /** The raw fetch Response object */
    public readonly response: Response,
  ) {}

  /**
   * The success indicator from the Paystack API body.
   */
  public get status(): boolean {
    return this.raw?.status ?? false;
  }

  /**
   * The message from the Paystack API body.
   */
  public get message(): string {
    return this.raw?.message ?? "Unknown response";
  }

  /**
   * Helper to automatically check the Paystack status and throw a descriptive
   * PaystackError if it fails. Returns the unwrapped 'data' payload on success.
   *
   * @throws {PaystackError} if status is false or an HTTP error occurred.
   */
  public unwrap(): T {
    const requestId = getPaystackRequestId(this.response.headers);

    if (this.error !== undefined && this.error !== null) {
      const errorEnvelope = getPaystackEnvelope(this.error);
      const rawEnvelope = getPaystackEnvelope(this.raw);

      throw new PaystackError({
        message: resolveErrorMessage(this.error, this.raw),
        code: errorEnvelope.code ?? rawEnvelope.code,
        type: errorEnvelope.type ?? rawEnvelope.type,
        status: this.response.status,
        requestId,
        meta: errorEnvelope.meta ?? rawEnvelope.meta,
        raw: this.error,
        body: this.error,
        cause: this.error,
      });
    }

    if (this.raw === undefined || this.raw === null) {
      // Handle missing body
      throw new PaystackError({
        message: "Empty response body",
        status: this.response.status,
        requestId,
        raw: this.raw,
        body: this.raw,
      });
    }

    if (!this.raw.status) {
      const rawEnvelope = getPaystackEnvelope(this.raw);

      // Handle Paystack-level errors (status: false)
      throw new PaystackError({
        message: rawEnvelope.message ?? "Paystack API Error",
        code: rawEnvelope.code,
        type: rawEnvelope.type,
        status: this.response.status,
        requestId,
        meta: rawEnvelope.meta,
        raw: this.raw,
        body: this.raw,
      });
    }

    return this.raw.data;
  }

  /**
   * A convenience getter that returns the data payload after unwrapping.
   * Use this when you are confident the request succeeded or want to catch at a higher level.
   *
   * @throws {PaystackError} if status is false.
   */
  public get data(): T {
    return this.unwrap();
  }
}

export function assertOk<T>(result: PaystackResponse<T>): T {
  return result.unwrap();
}

export function toPaystackApiError<T>(result: PaystackResponse<T>): PaystackError | undefined {
  try {
    result.unwrap();
    return undefined;
  } catch (error) {
    if (error instanceof PaystackError) return error;
    throw error;
  }
}
