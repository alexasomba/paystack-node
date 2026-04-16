import { PaystackError, getPaystackRequestId } from "./errors.js";

/**
 * Base structure of a Paystack API response body
 */
export interface PaystackRawResponse<T = unknown> {
  status: boolean;
  message: string;
  data: T;
  meta?: Record<string, unknown>;
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
      // Handle HTTP or Network errors
      let message = "Network or HTTP Error";
      if (typeof this.error === "object" && this.error !== null && "message" in this.error) {
        message = String((this.error as { message: unknown }).message);
      } else if (this.raw && typeof this.raw === "object" && "message" in this.raw) {
        message = this.raw.message;
      }

      throw new PaystackError({
        message,
        status: this.response.status,
        requestId,
        meta: this.raw?.meta,
      });
    }

    if (this.raw === undefined || this.raw === null) {
      // Handle missing body
      throw new PaystackError({
        message: "Empty response body",
        status: this.response.status,
        requestId,
      });
    }

    if (!this.raw.status) {
      // Handle Paystack-level errors (status: false)
      throw new PaystackError({
        message: this.raw.message,
        status: this.response.status,
        requestId,
        meta: this.raw.meta,
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
    if (this.raw === undefined || this.raw === null) {
      return this.unwrap();
    }
    return this.raw.data;
  }
}
