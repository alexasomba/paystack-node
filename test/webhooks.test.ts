import { describe, it, expect } from "vite-plus/test";

import {
  verifyPaystackWebhookSignature,
  computePaystackWebhookSignature,
} from "../src/webhooks.js";

describe("Webhook Verification", () => {
  const secret = "sk_test_1234567890abcdef1234567890abcdef12345678";
  const payload = JSON.stringify({
    event: "charge.success",
    data: {
      id: 123,
      domain: "test",
      status: "success",
      amount: 5000,
    },
  });

  it("should verify a valid signature with string input", () => {
    const signature = computePaystackWebhookSignature(payload, secret);
    const ok = verifyPaystackWebhookSignature({
      rawBody: payload,
      signature,
      secret,
    });
    expect(ok).toBe(true);
  });

  it("should verify a valid signature with Buffer input", () => {
    const rawBody = Buffer.from(payload, "utf8");
    const signature = computePaystackWebhookSignature(rawBody, secret);
    const ok = verifyPaystackWebhookSignature({
      rawBody,
      signature,
      secret,
    });
    expect(ok).toBe(true);
  });

  it("should fail for an invalid signature", () => {
    const ok = verifyPaystackWebhookSignature({
      rawBody: payload,
      signature: "invalid_signature",
      secret,
    });
    expect(ok).toBe(false);
  });

  it("should fail if signature is missing", () => {
    const ok = verifyPaystackWebhookSignature({
      rawBody: payload,
      signature: "",
      secret,
    });
    expect(ok).toBe(false);
  });

  it("should handle case-insensitivity and whitespace in signature", () => {
    const signature = computePaystackWebhookSignature(payload, secret);
    const ok = verifyPaystackWebhookSignature({
      rawBody: payload,
      signature: `  ${signature.toUpperCase()}  `,
      secret,
    });
    expect(ok).toBe(true);
  });
});
