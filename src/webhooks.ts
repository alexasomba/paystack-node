import { createHmac } from "node:crypto";
import type { components } from "./openapi-types.js";

/**
 * Discriminated Union of all supported Webhook Events.
 * This type is derived from the OpenAPI specification.
 */
export type PaystackWebhookEvent = components["schemas"]["WebhookEvent"];

/**
 * Utilities for handling Paystack Webhooks
 */
export const Webhooks = {
  /**
   * Verified that a webhook request truly originated from Paystack.
   * Uses HMAC SHA-512 with your Secret Key.
   *
   * @param body The raw request body string (important: use the raw body, not the parsed JSON)
   * @param signature The value of the 'x-paystack-signature' header
   * @param secretKey Your Paystack Secret Key
   */
  verifySignature(body: string, signature: string, secretKey: string): boolean {
    const hash = createHmac("sha512", secretKey).update(body).digest("hex");
    return hash === signature;
  },

  /**
   * A helper to parse and validate a webhook event from a raw body string.
   * @param body Raw request body
   */
  parseEvent(body: string): PaystackWebhookEvent {
    return JSON.parse(body) as PaystackWebhookEvent;
  },
};
